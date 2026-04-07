import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import DottedGlobe from '../components/DottedGlobe';
import LoginAvatar from '../components/LoginAvatar';
import confetti from 'canvas-confetti';
import { useLoader } from '../context/LoaderContext';
import { useNotification } from '../context/NotificationContext';
import { User, Lock, Mail, Github, Eye, EyeOff, Sun, Moon, Sparkles } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { currentTheme, applyTheme } = useTheme();
    const { showLoader } = useLoader();
    const { notify } = useNotification();

    const [mode, setMode] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [isAnimating, setIsAnimating] = useState(false);
    const [focusField, setFocusField] = useState(null);
    const [easterEggActive, setEasterEggActive] = useState(false);
    const passwordRef = useRef(null);

    const isLight = currentTheme.name === 'Light';
    const inputBg = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.025)';
    const inputBorder = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.06)';
    const iconInactive = isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.2)';
    const glassBg = isLight ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.012)';
    const glassBorder = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)';
    const glassShadow = isLight ? '0 30px 80px -15px rgba(0,0,0,0.1)' : '0 30px 80px -15px rgba(0,0,0,0.6)';
    const socialBg = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
    const socialBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: (e.clientY / window.innerHeight) * 2 - 1
            });
        };
        window.addEventListener('mousemove', handleMove);

        return () => window.removeEventListener('mousemove', handleMove);
    }, [notify]);

    const handleModeToggle = (newMode) => {
        setIsAnimating(true);
        setTimeout(() => { setMode(newMode); setIsAnimating(false); }, 300);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (mode === 'signup') {
            // Success signup behavior
            handleModeToggle('login');
            notify('Account created successfully! Welcome aboard.', 'success');
            
            // Dramatic rain confetti effect
            const duration = 4500;
            const end = Date.now() + duration;

            const frame = () => {
                // Natural physics formulation for depth and drift
                confetti({
                    particleCount: 2,
                    angle: 270,
                    spread: 100,
                    origin: { x: Math.random(), y: -0.1 }, // Start slightly off-screen top
                    startVelocity: Math.random() * 10 + 5, // Gentle start, not blasted out
                    gravity: Math.random() * 0.4 + 0.4, // Light varying gravity float
                    drift: Math.random() * 2 - 1,   // Natural gentle wind sway (left to right)
                    ticks: 400, // Stay on screen longer
                    zIndex: 99999,
                    scalar: Math.random() * 0.7 + 0.4, // Parallax depth variation (small and large)
                    shapes: ['circle', 'square'], // Mixer shapes
                    colors: [currentTheme.colors.primary, currentTheme.colors.accent, '#ffffff', isLight ? '#000000' : '#a3a3a3']
                });
                
                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
            
        } else if (mode === 'forgot') {
            handleModeToggle('login');
            notify('Password reset link has been dispatched to your inbox.', 'info');
        } else {
            // Standard Login behavior
            showLoader(`Success! Accessing Workspace...`, 2000);
            setTimeout(() => navigate('/'), 2000);
        }
    };

    const activateEasterEgg = () => {
        if (easterEggActive) return;
        setEasterEggActive(true);
        notify('🥚 Easter Egg Found: Unicorn Mode Initiated! 🦄', 'unicorn');
        
        // Rainbow confetti explosion
        const duration = 5000;
        const end = Date.now() + duration;
        const frame = () => {
            confetti({
                particleCount: 5,
                spread: 100,
                origin: { x: Math.random(), y: Math.random() - 0.2 },
                gravity: 0.1,
                startVelocity: 10,
                zIndex: 99999,
                colors: ['#ff0055', '#ff9900', '#ffee00', '#00ff44', '#0099ff', '#aa00ff']
            });
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();

        // Turn eye off after 5 sec
        setTimeout(() => setEasterEggActive(false), 5000);
    };

    const inputStyle = (isFocused) => ({
        width: '100%',
        padding: '14px 18px 14px 46px',
        background: inputBg,
        border: `1px solid ${isFocused ? currentTheme.colors.primary : inputBorder}`,
        borderRadius: '14px',
        color: currentTheme.colors.text,
        fontSize: '0.88rem',
        outline: 'none',
        transition: 'all 0.35s ease',
        boxShadow: isFocused ? `0 0 25px -8px ${currentTheme.colors.primary}20` : 'none',
        fontWeight: '500',
        boxSizing: 'border-box'
    });

    const iconStyle = (isFocused) => ({
        position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
        color: isFocused ? currentTheme.colors.primary : iconInactive,
        transition: 'color 0.3s', pointerEvents: 'none'
    });

    return (
        <div style={{
            width: '100vw', height: '100vh', display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            background: `radial-gradient(circle at 20% 50%, ${currentTheme.colors.secondary} 0%, ${currentTheme.colors.bg} 100%)`,
            overflow: 'hidden', position: 'relative',
            color: currentTheme.colors.text, fontFamily: "'Inter', sans-serif"
        }}>

            {/* ═══════════ FORM SIDE ═══════════ */}
            <div style={{
                flex: isMobile ? 1 : '0 0 42%',
                height: '100%', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                padding: isMobile ? '1.5rem' : '2rem',
                zIndex: 10, overflow: 'auto', position: 'relative'
            }}>
                <div style={{ width: '100%', maxWidth: '380px' }}>

                    {/* Avatar — always above card */}
                    <div style={{
                        textAlign: 'center', marginBottom: '20px',
                        opacity: isAnimating ? 0 : 1,
                        transform: `translateY(${isAnimating ? '-6px' : '0'})`,
                        transition: 'all 0.3s ease'
                    }}>
                        <div 
                            style={{ width: '68px', height: '68px', margin: '0 auto', cursor: 'pointer' }}
                            onClick={activateEasterEgg}
                            title="Poke the eye..."
                        >
                            <LoginAvatar fieldFocus={focusField} mousePos={mousePos} showPassword={showPassword} isRed={easterEggActive} />
                        </div>
                    </div>

                    {/* Glass Card — inputs + button ONLY */}
                    <div style={{
                        padding: '1.5rem',
                        background: glassBg,
                        backdropFilter: 'blur(40px) saturate(180%)',
                        borderRadius: '24px',
                        border: `1px solid ${glassBorder}`,
                        boxShadow: glassShadow,
                        opacity: isAnimating ? 0 : 1,
                        transform: `translateY(${isAnimating ? '8px' : '0'})`,
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {mode === 'signup' && (
                                <div style={{ position: 'relative' }}>
                                    <User size={16} style={iconStyle(focusField === 'fullName')} />
                                    <input type="text" name="fullName" placeholder="Full Name"
                                        style={inputStyle(focusField === 'fullName')}
                                        onFocus={() => setFocusField('fullName')} onBlur={() => setFocusField(null)} required />
                                </div>
                            )}
                            <div style={{ position: 'relative' }}>
                                {mode === 'login'
                                    ? <User size={16} style={iconStyle(focusField === 'username')} />
                                    : <Mail size={16} style={iconStyle(focusField === 'email')} />}
                                <input
                                    type={(mode === 'signup' || mode === 'forgot') ? 'email' : 'text'}
                                    name={(mode === 'signup' || mode === 'forgot') ? 'email' : 'username'}
                                    placeholder={mode === 'forgot' ? 'Enter your email address' : mode === 'login' ? 'Username or Email' : 'Email Address'}
                                    style={inputStyle(focusField === 'username' || focusField === 'email')}
                                    onFocus={() => setFocusField(mode === 'login' ? 'username' : 'email')}
                                    onBlur={() => setFocusField(null)} required />
                            </div>
                            {mode !== 'forgot' && (
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <Lock size={16} style={iconStyle(focusField === 'password')} />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        placeholder="Password"
                                        ref={passwordRef}
                                        style={{ ...inputStyle(focusField === 'password'), paddingRight: '40px' }}
                                        onFocus={() => setFocusField('password')} onBlur={() => setFocusField(null)} required />
                                    <button 
                                        type="button" 
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => {
                                            if (!passwordRef.current) return;
                                            // Save current cursor pos before standard HTML input type switch destroys it
                                            const pos = passwordRef.current.selectionStart;
                                            setShowPassword(!showPassword);
                                            setTimeout(() => {
                                                if (passwordRef.current) {
                                                    passwordRef.current.setSelectionRange(pos, pos);
                                                }
                                            }, 0);
                                        }}
                                        style={{
                                            position: 'absolute', right: '15px',
                                            background: 'none', border: 'none', color: focusField === 'password' ? currentTheme.colors.primary : 'rgba(255,255,255,0.4)',
                                            cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', transition: 'color 0.2s', width: 'auto'
                                        }}
                                        title={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            )}
                            {mode === 'login' && (
                                <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                                    <button type="button" onClick={() => handleModeToggle('forgot')} style={{
                                        background: 'none', border: 'none', color: currentTheme.colors.primary,
                                        fontSize: '0.65rem', opacity: 0.5, cursor: 'pointer', fontWeight: '700', padding: 0
                                    }}
                                        onMouseEnter={(e) => e.target.style.opacity = 1}
                                        onMouseLeave={(e) => e.target.style.opacity = 0.5}
                                    >Forgot Password?</button>
                                </div>
                            )}
                            <button type="submit" style={{
                                width: '100%', padding: '14px',
                                background: currentTheme.colors.primary,
                                color: currentTheme.colors.bg,
                                border: 'none', borderRadius: '14px',
                                fontWeight: '600', fontSize: '0.92rem',
                                letterSpacing: '0.5px', cursor: 'pointer',
                                boxShadow: `0 8px 25px -8px ${currentTheme.colors.primary}`,
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = `0 12px 30px -6px ${currentTheme.colors.primary}`;
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = `0 8px 25px -8px ${currentTheme.colors.primary}`;
                                }}
                            >
                                {mode === 'forgot' ? 'Reset Password' : mode === 'login' ? 'Sign In' : 'Sign Up'}
                            </button>
                        </form>
                    </div>

                    {/* Toggle + Social — below card */}
                    <div style={{ textAlign: 'center', marginTop: '22px' }}>
                        <span style={{ fontSize: '0.85rem', color: currentTheme.colors.text, opacity: 0.6 }}>
                            {mode === 'forgot' ? "Remember your password? " : mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button onClick={() => handleModeToggle((mode === 'forgot' || mode === 'signup') ? 'login' : 'signup')} style={{
                            background: 'none', border: 'none', color: currentTheme.colors.primary,
                            cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', padding: 0,
                            textDecoration: 'underline', textUnderlineOffset: '4px', textDecorationColor: 'transparent',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => e.target.style.textDecorationColor = currentTheme.colors.primary}
                            onMouseLeave={(e) => e.target.style.textDecorationColor = 'transparent'}
                        >
                            {mode === 'forgot' ? 'Back to login' : mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>

                    {mode === 'login' && (
                        <div style={{ marginTop: '18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', opacity: 0.35, marginBottom: '12px', color: currentTheme.colors.text }}>
                                <div style={{ flex: 1, height: '1px', background: currentTheme.colors.text }} />
                                <span style={{ padding: '0 10px', fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '1px' }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: currentTheme.colors.text }} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {[
                                    { icon: <span style={{ fontSize: '0.95rem', fontWeight: '900' }}>G</span>, label: 'Google' },
                                    { icon: <Github size={15} />, label: 'GitHub' }
                                ].map((s, i) => (
                                    <button key={i} style={{
                                        flex: 1, padding: '10px',
                                        background: socialBg, border: `1px solid ${socialBorder}`,
                                        borderRadius: '12px', color: currentTheme.colors.text,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = socialBg}
                                    >
                                        {s.icon} {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════ GLOBE SIDE — fully interactive ═══════════ */}
            {!isMobile && (
                <div style={{ flex: '1 1 58%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    
                    <div style={{ flex: 1, position: 'relative' }}>
                        <DottedGlobe />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
