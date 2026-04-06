import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import DottedGlobe from '../components/DottedGlobe';
import LoginAvatar from '../components/LoginAvatar';
import { useLoader } from '../context/LoaderContext';
import { User, Lock, Mail, Github, ArrowLeft, Key } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { currentTheme } = useTheme();
    const { showLoader } = useLoader();

    const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [isAnimating, setIsAnimating] = useState(false);
    const [focusField, setFocusField] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: ''
    });

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    const handleModeToggle = (newMode) => {
        setIsAnimating(true);
        setTimeout(() => {
            setMode(newMode);
            setIsAnimating(false);
        }, 300);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const actionText = mode === 'login' ? "Accessing Workspace..." : "Creating Profile...";
        showLoader(`Success! ${actionText}`, 2000);
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    // Styles
    const pageStyle = {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        background: `radial-gradient(circle at 20% 50%, ${currentTheme.colors.secondary} 0%, ${currentTheme.colors.bg} 100%)`,
        overflow: 'hidden',
        position: 'relative',
        color: currentTheme.colors.text,
        fontFamily: "'Inter', sans-serif"
    };

    const formSectionStyle = {
        flex: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobile ? '2rem 1.5rem' : '4rem',
        zIndex: 10
    };

    const glassCardStyle = {
        width: '100%',
        maxWidth: isMobile ? '100%' : '540px',
        padding: isMobile ? '2.5rem 1.75rem' : '4.5rem 4rem',
        background: 'rgba(255, 255, 255, 0.012)',
        backdropFilter: 'blur(45px) saturate(200%)',
        borderRadius: isMobile ? '32px' : '42px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.8)',
        opacity: isAnimating ? 0 : 1,
        transform: `translateY(${isAnimating ? '10px' : '0'})`,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column'
    };

    const inputGroupStyle = {
        width: '100%',
        position: 'relative',
        marginBottom: '1.25rem'
    };

    const inputStyle = (isFocused) => ({
        width: '100%',
        padding: '22px 24px 22px 58px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${isFocused ? currentTheme.colors.primary : 'rgba(255, 255, 255, 0.05)'}`,
        borderRadius: '18px',
        color: currentTheme.colors.text,
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isFocused ? `0 0 40px -10px ${currentTheme.colors.primary}22` : 'none',
        fontWeight: '500'
    });

    const iconStyle = (isFocused) => ({
        position: 'absolute',
        left: '22px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: isFocused ? currentTheme.colors.primary : 'rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease',
        pointerEvents: 'none'
    });

    const submitButtonStyle = {
        width: '100%',
        padding: '18px',
        background: currentTheme.colors.primary,
        color: currentTheme.colors.bg,
        border: 'none',
        borderRadius: '18px',
        fontWeight: '700',
        fontSize: '0.9rem',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: `0 15px 35px -10px ${currentTheme.colors.primary}55`,
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        marginTop: '1.5rem'
    };

    return (
        <div style={pageStyle}>
            {/* FORM SIDE */}
            <div style={formSectionStyle}>
                <div style={glassCardStyle}>
                    {/* Interactive Avatar Header */}
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100px',
                        height: '100px',
                        zIndex: 20
                    }}>
                        <LoginAvatar fieldFocus={focusField} mousePos={mousePos} />
                    </div>
                    <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
                        <h1 style={{
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            margin: 0,
                            letterSpacing: '-0.3px'
                        }}>
                            {mode === 'login' ? 'Welcome back' : 'Create account'}
                        </h1>
                        <p style={{
                            opacity: 0.3,
                            fontSize: '0.85rem',
                            marginTop: '8px',
                            lineHeight: '1.4'
                        }}>
                            {mode === 'login'
                                ? 'Enter your credentials to access your secure ISU workspace.'
                                : 'Join our professional community and start your journey today.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {mode === 'signup' && (
                            <div style={inputGroupStyle}>
                                <User size={18} style={iconStyle(focusField === 'fullName')} />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    style={inputStyle(focusField === 'fullName')}
                                    onFocus={() => setFocusField('fullName')}
                                    onBlur={() => setFocusField(null)}
                                    required
                                />
                            </div>
                        )}

                        <div style={inputGroupStyle}>
                            {mode === 'login' ? <User size={18} style={iconStyle(focusField === 'username')} /> : <Mail size={18} style={iconStyle(focusField === 'email')} />}
                            <input
                                type={mode === 'login' ? 'text' : 'email'}
                                name={mode === 'login' ? 'username' : 'email'}
                                placeholder={mode === 'login' ? 'Username or Email' : 'Email Address'}
                                style={inputStyle(focusField === 'username' || focusField === 'email')}
                                onFocus={() => setFocusField(mode === 'login' ? 'username' : 'email')}
                                onBlur={() => setFocusField(null)}
                                required
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <Lock size={18} style={iconStyle(focusField === 'password')} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                style={inputStyle(focusField === 'password')}
                                onFocus={() => setFocusField('password')}
                                onBlur={() => setFocusField(null)}
                                required
                            />
                            {mode === 'login' && (
                                <button
                                    type="button"
                                    onClick={() => handleModeToggle('forgot')}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        bottom: '-22px',
                                        background: 'none',
                                        border: 'none',
                                        color: currentTheme.colors.primary,
                                        fontSize: '0.65rem',
                                        opacity: 0.5,
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        transition: 'opacity 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.opacity = 1}
                                    onMouseLeave={(e) => e.target.style.opacity = 0.5}
                                >
                                    Forgot Password?
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            style={submitButtonStyle}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            {mode === 'login' ? 'Sign In' : 'Get Started'}
                        </button>
                    </form>

                    <div style={{
                        marginTop: '2.5rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '0.86rem'
                    }}>
                        <button
                            onClick={() => handleModeToggle(mode === 'login' ? 'signup' : 'login')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: currentTheme.colors.primary,
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            {mode === 'login' ? 'NEW HERE? CREATE ACCOUNT' : 'MEMBER ALREADY? SIGN IN'}
                        </button>
                    </div>

                    {mode === 'login' && (
                        <div style={{ marginTop: '2.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', opacity: 0.15, marginBottom: '1.5rem' }}>
                                <div style={{ flex: 1, height: '1px', background: 'white' }}></div>
                                <span style={{ padding: '0 10px', fontSize: '0.7rem', fontWeight: 'bold' }}>OR CONTINUE WITH</span>
                                <div style={{ flex: 1, height: '1px', background: 'white' }}></div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button style={{
                                    flex: 1,
                                    padding: '14px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: '15px',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: '900' }}>G</span> Google
                                </button>
                                <button style={{
                                    flex: 1,
                                    padding: '14px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: '15px',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}>
                                    <Github size={18} /> GitHub
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* GLOBE SIDE */}
            {!isMobile && (
                <div style={{ flex: 1, height: '100%', position: 'relative' }}>
                    <DottedGlobe />
                </div>
            )}
        </div>
    );
};

export default Login;
