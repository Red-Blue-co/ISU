import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import DottedGlobe from '../components/DottedGlobe';
import LoginAvatar from '../components/LoginAvatar';
import { useLoader } from '../context/LoaderContext';

const Login = () => {
    const { currentTheme } = useTheme();
    const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot-request', 'forgot-otp'
    const [isAnimating, setIsAnimating] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        confirmPassword: ''
    });
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [focusField, setFocusField] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        // Sync-trap for route transitions is handled in App.jsx
        // Just ensuring we have a smooth entry
    }, []);

    // Timer logic for OTP
    useEffect(() => {
        let interval = null;
        if (mode === 'forgot-otp' && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [mode, timer]);

    const handleModeToggle = (newMode) => {
        setIsAnimating(true);
        setTimeout(() => {
            setMode(newMode);
            if (newMode === 'forgot-otp') setTimer(60);
            setIsAnimating(false);
        }, 300);
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleForgotPassword = () => {
        // Logic for sending recovery email
        console.log("Forgot password requested for:", recoveryEmail);
        showLoader("Sending recovery email...", 2000);
        setTimeout(() => {
            handleModeToggle('forgot-otp');
        }, 2000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (mode === 'signup' && formData.password !== formData.confirmPassword) {
            alert("Security Breach: Passwords do not match.");
            return;
        }

        if (mode === 'forgot-request') {
            showLoader("Checking Credentials...", 1000);
            setTimeout(() => handleModeToggle('forgot-otp'), 1000);
            return;
        }

        if (mode === 'forgot-otp') {
            const code = otp.join('');
            if (code.length < 4) {
                alert("Please enter the full 4-digit code.");
                return;
            }
            showLoader("Verifying Code...", 1500);
            setTimeout(() => {
                alert("Verification Successful! You can now reset your password.");
                handleModeToggle('login');
            }, 1500);
            return;
        }

        const actionText = mode === 'login' ? "Loading Home Page..." : "Establishing Identity...";
        showLoader(`Success! ${actionText}`, 2000);

        setTimeout(() => {
            alert(`${mode === 'login' ? 'Login' : 'Signup'} successful: ${formData.username || formData.email}`);
        }, 1500);
    };

    useEffect(() => {
        const handleMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    const pageStyle = {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        background: `radial-gradient(circle at 20% 50%, ${currentTheme.colors.secondary} 0%, ${currentTheme.colors.bg} 100%)`,
        overflow: 'hidden',
        position: 'relative'
    };

    const formSectionStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        position: 'relative',
        padding: '2rem'
    };

    const glassCardStyle = {
        width: '100%',
        maxWidth: '420px',
        padding: '3rem',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    };

    const inputGroupStyle = {
        width: '100%',
        position: 'relative',
        marginBottom: '2rem'
    };

    const labelStyle = (isFocused) => ({
        display: 'block',
        color: isFocused ? currentTheme.colors.primary : currentTheme.colors.secondary,
        fontSize: '0.75rem',
        fontWeight: '900',
        letterSpacing: '2px',
        marginBottom: '10px',
        transition: 'color 0.3s ease',
        textTransform: 'uppercase'
    });

    const boxInputStyle = (isFocused) => ({
        width: '100%',
        padding: '22px 24px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${isFocused ? currentTheme.colors.primary : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: '18px',
        color: currentTheme.colors.text,
        fontSize: '1.05rem',
        outline: 'none',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: isFocused ? `0 0 30px -10px ${currentTheme.colors.primary}44, inset 0 0 10px rgba(0,0,0,0.2)` : 'none',
        letterSpacing: '0.5px'
    });

    return (
        <div style={pageStyle}>
            {/* LEFT SIDE: Premium Form */}
            <div style={formSectionStyle}>

                <div style={{
                    ...glassCardStyle,
                    opacity: isAnimating ? 0 : 1,
                    transform: `translateY(${isAnimating ? '10px' : '0'})`,
                    transition: 'all 0.3s ease-out'
                }}>
                    {/* Interactive Avatar Header */}
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        width: '100px',
                        height: '100px',
                        zIndex: 20
                    }}>
                        <LoginAvatar fieldFocus={focusField} mousePos={mousePos} />
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '2.5rem', marginTop: '1.5rem' }}>
                        <h1 style={{
                            fontSize: '2.2rem',
                            fontWeight: '900',
                            letterSpacing: '-1px',
                            color: currentTheme.colors.text,
                            margin: 0,
                            textTransform: 'uppercase'
                        }}>
                            {mode === 'login' ? 'Student Login' :
                                mode === 'signup' ? 'Join our Community' :
                                    mode === 'forgot-request' ? 'Reset Password' : 'Verify Code'}
                        </h1>
                        <p style={{
                            color: currentTheme.colors.text,
                            opacity: 0.5,
                            fontSize: '0.8rem',
                            marginTop: '10px',
                            fontWeight: 'bold',
                            letterSpacing: '1px'
                        }}>
                            {mode === 'login' ? 'WELCOME BACK! PLEASE ENTER YOUR DETAILS.' :
                                mode === 'signup' ? 'CREATE AN ACCOUNT TO JOIN THE COMMUNITY.' :
                                    mode === 'forgot-request' ? 'ENTER YOUR EMAIL TO RECEIVE A CODE.' :
                                        `CHECK YOUR EMAIL: ${recoveryEmail || 'USER@DOMAIN.COM'}`}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        {mode === 'signup' && (
                            <div style={inputGroupStyle}>
                                <input
                                    type="text"
                                    name="fullName"
                                    style={boxInputStyle(focusField === 'fullName')}
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    onFocus={() => setFocusField('fullName')}
                                    onBlur={() => setFocusField(null)}
                                    placeholder="FULL NAME"
                                    required
                                />
                            </div>
                        )}

                        {(mode === 'login' || mode === 'signup') && (
                            <div style={inputGroupStyle}>
                                <input
                                    type={mode === 'login' ? 'text' : 'email'}
                                    name={mode === 'login' ? 'username' : 'email'}
                                    style={boxInputStyle(focusField === 'username' || focusField === 'email')}
                                    value={mode === 'login' ? formData.username : formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusField(mode === 'login' ? 'username' : 'email')}
                                    onBlur={() => setFocusField(null)}
                                    placeholder={mode === 'login' ? 'USERNAME_OR_ID' : 'EMAIL_ADDRESS'}
                                    required
                                />
                            </div>
                        )}

                        {mode === 'forgot-request' && (
                            <div style={inputGroupStyle}>
                                <input
                                    type="email"
                                    name="recoveryEmail"
                                    style={boxInputStyle(focusField === 'recoveryEmail')}
                                    value={recoveryEmail}
                                    onChange={(e) => setRecoveryEmail(e.target.value)}
                                    onFocus={() => setFocusField('recoveryEmail')}
                                    onBlur={() => setFocusField(null)}
                                    placeholder="RECOVERY_EMAIL"
                                    required
                                />
                            </div>
                        )}

                        {mode === 'forgot-otp' && (
                            <div style={{ ...inputGroupStyle, textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            style={{
                                                ...boxInputStyle(focusField === `otp-${index}`),
                                                width: '65px',
                                                height: '65px',
                                                textAlign: 'center',
                                                fontSize: '1.8rem',
                                                fontWeight: '900',
                                                padding: '0'
                                            }}
                                            value={data}
                                            onChange={(e) => handleOtpChange(e.target, index)}
                                            onFocus={() => setFocusField(`otp-${index}`)}
                                            onBlur={() => setFocusField(null)}
                                        />
                                    ))}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: currentTheme.colors.text, opacity: 0.4, letterSpacing: '1px' }}>
                                    {timer > 0 ? (
                                        <span>SYSTEM_TIMEOUT IN <strong style={{ color: currentTheme.colors.primary, opacity: 1 }}>0:{timer < 10 ? `0${timer}` : timer}</strong></span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setTimer(60)}
                                            style={{
                                                background: `${currentTheme.colors.primary}11`,
                                                border: `1px solid ${currentTheme.colors.primary}33`,
                                                color: currentTheme.colors.primary,
                                                padding: '8px 20px',
                                                borderRadius: '10px',
                                                fontWeight: '900',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                                letterSpacing: '1px',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = `${currentTheme.colors.primary}22`;
                                                e.target.style.boxShadow = `0 0 15px ${currentTheme.colors.primary}33`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = `${currentTheme.colors.primary}11`;
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        >
                                            RESEND_REQUEST
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {(mode === 'login' || mode === 'signup') && (
                            <div style={inputGroupStyle}>
                                <input
                                    type="password"
                                    name="password"
                                    style={boxInputStyle(focusField === 'password')}
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusField('password')}
                                    onBlur={() => setFocusField(null)}
                                    placeholder="PASSWORD"
                                    required
                                />
                                {mode === 'login' && (
                                    <button
                                        type="button"
                                        onClick={() => handleModeToggle('forgot-request')}
                                        style={{
                                            position: 'absolute',
                                            right: '24px',
                                            bottom: '-25px',
                                            background: 'none',
                                            border: 'none',
                                            color: currentTheme.colors.primary,
                                            fontSize: '0.65rem',
                                            opacity: 0.5,
                                            cursor: 'pointer',
                                            fontWeight: '900',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase',
                                            transition: 'opacity 0.3s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.opacity = 1}
                                        onMouseLeave={(e) => e.target.style.opacity = 0.5}
                                    >
                                        [FORGOT_PASSWORD?]
                                    </button>
                                )}
                            </div>
                        )}

                        {mode === 'signup' && (
                            <div style={inputGroupStyle}>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    style={boxInputStyle(focusField === 'confirmPassword')}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onFocus={() => setFocusField('confirmPassword')}
                                    onBlur={() => setFocusField(null)}
                                    placeholder="CONFIRM_PASSWORD"
                                    required
                                />
                            </div>
                        )}

                        <button type="submit" style={{
                            width: '100%',
                            padding: '18px',
                            background: currentTheme.colors.primary,
                            color: currentTheme.colors.bg,
                            border: 'none',
                            borderRadius: '16px',
                            fontWeight: '900',
                            fontSize: '0.9rem',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            boxShadow: `0 10px 30px -10px ${currentTheme.colors.primary}`,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            marginTop: '0.5rem'
                        }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = `0 15px 40px -10px ${currentTheme.colors.primary}`;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = `0 10px 30px -10px ${currentTheme.colors.primary}`;
                            }}
                        >
                            {mode === 'login' ? 'Log In' :
                                mode === 'signup' ? 'Create Account' :
                                    mode === 'forgot-request' ? 'Send Code' : 'Verify & Reset'}
                        </button>
                    </form>

                    {/* Social Authentication Section */}
                    {mode === 'login' && (
                        <div style={{ width: '100%', marginTop: '2.5rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '1.5rem',
                                opacity: 0.3
                            }}>
                                <div style={{ flex: 1, height: '1px', background: currentTheme.colors.text }}></div>
                                <span style={{ padding: '0 15px', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px' }}>OR CONTINUE WITH</span>
                                <div style={{ flex: 1, height: '1px', background: currentTheme.colors.text }}></div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: currentTheme.colors.text,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'all 0.2s',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.borderColor = currentTheme.colors.primary;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                    }}
                                >
                                    <span style={{ fontSize: '1rem' }}>G</span> GOOGLE
                                </button>
                                <button style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: currentTheme.colors.text,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'all 0.2s',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.borderColor = currentTheme.colors.primary;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                    }}
                                >
                                    <span style={{ fontSize: '1rem' }}>⌨</span> GITHUB
                                </button>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '3rem', width: '100%' }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            padding: '20px',
                            borderRadius: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '15px'
                        }}>
                            {(mode === 'login' || mode === 'signup') ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '0.8rem', color: currentTheme.colors.text, opacity: 0.4, fontWeight: '500' }}>
                                        {mode === 'login' ? 'NEW HERE?' : 'MEMBER ALREADY?'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleModeToggle(mode === 'login' ? 'signup' : 'login')}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: currentTheme.colors.primary,
                                            fontWeight: '900',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            letterSpacing: '1.5px',
                                            textTransform: 'uppercase',
                                            padding: '8px 16px',
                                            borderRadius: '10px',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = `${currentTheme.colors.primary}11`;
                                            e.target.style.textShadow = `0 0 10px ${currentTheme.colors.primary}66`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'none';
                                            e.target.style.textShadow = 'none';
                                        }}
                                    >
                                        {mode === 'login' ? 'CREATE_ACCOUNT' : 'LOG_IN_NOW'}
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '0.8rem', color: currentTheme.colors.text, opacity: 0.4, fontWeight: '500' }}>
                                        REMEMBERED?
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleModeToggle('login')}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: currentTheme.colors.primary,
                                            fontWeight: '900',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            letterSpacing: '1.5px',
                                            textTransform: 'uppercase',
                                            padding: '8px 16px',
                                            borderRadius: '10px',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = `${currentTheme.colors.primary}11`;
                                            e.target.style.textShadow = `0 0 10px ${currentTheme.colors.primary}66`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'none';
                                            e.target.style.textShadow = 'none';
                                        }}
                                    >
                                        GO_BACK_TO_LOGIN
                                    </button>
                                </div>
                            )}

                            <div style={{ width: '30px', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

                            <Link to="/" style={{
                                color: currentTheme.colors.text,
                                textDecoration: 'none',
                                opacity: 0.3,
                                fontSize: '0.7rem',
                                fontWeight: '900',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                transition: 'all 0.3s'
                            }}
                                onMouseEnter={(e) => e.target.style.opacity = 0.8}
                                onMouseLeave={(e) => e.target.style.opacity = 0.3}
                            >
                                ← EXIT_PORTAL
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Interactive Dotted Globe */}
            <div style={{
                flex: 1.5,
                position: 'relative',
                display: 'block'
            }}>
                <DottedGlobe />
            </div>

        </div>
    );
};

export default Login;
