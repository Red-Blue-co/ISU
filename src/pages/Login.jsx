import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import GlobeStage from '../components/GlobeStage';
import { useNotification } from '../context/NotificationContext';
import { Github, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import './Login.css';

const COPY = {
    login: { title: 'Welcome back', sub: 'Sign in to your ISU account.', cta: 'Sign in' },
    signup: { title: 'Create your account', sub: 'Join students from all over the world.', cta: 'Create account' },
    forgot: { title: 'Reset password', sub: "Enter your email and we'll send you a reset link.", cta: 'Send reset link' },
};

// Sign up sits to the right of sign in, reset to the right of both
const ORDER = { login: 0, signup: 1, forgot: 2 };

// Smoothly opens and closes its content. Closed fields are disabled so the form skips them.
const Reveal = ({ open, children, className = '' }) => (
    <div className={`login-reveal ${open ? 'open' : ''} ${className}`} aria-hidden={!open}>
        <fieldset disabled={!open}>{children}</fieldset>
    </div>
);

const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
);

const Login = () => {
    const navigate = useNavigate();
    const { notify } = useNotification();

    const location = useLocation();
    const [mode, setMode] = useState(location.state?.mode === 'signup' ? 'signup' : 'login');
    const [showPassword, setShowPassword] = useState(false);
    const [busy, setBusy] = useState(false);
    const [dir, setDir] = useState(0);
    const passwordRef = useRef(null);

    const copy = COPY[mode];

    const switchMode = (next) => {
        if (next === mode) return;
        setDir(ORDER[next] > ORDER[mode] ? 1 : -1);
        setMode(next);
        setShowPassword(false);
    };

    const togglePassword = () => {
        const input = passwordRef.current;
        const pos = input ? input.selectionStart : null;
        setShowPassword((v) => !v);
        // Switching the input type resets the caret; put it back where it was
        setTimeout(() => { if (input && pos !== null) input.setSelectionRange(pos, pos); }, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (busy) return;

        if (mode === 'signup') {
            notify('Account created. You can sign in now.', 'success');
            switchMode('login');
        } else if (mode === 'forgot') {
            notify('If that email has an account, a reset link is on its way.', 'info');
            switchMode('login');
        } else {
            setBusy(true);
            setTimeout(() => navigate('/'), 700);
        }
    };

    return (
        <div className="login">
            <section className="login-panel">
                <header className="login-top">
                    <Link to="/" className="login-brand">ISU</Link>
                    <Link to="/" className="login-back"><ArrowLeft size={14} /> Home</Link>
                </header>

                <div className="login-body">
                    <div className="login-heading">
                        <div key={mode} className={`login-swap ${dir > 0 ? 'from-right' : dir < 0 ? 'from-left' : ''}`}>
                            <h1 className="login-title">{copy.title}</h1>
                            <p className="login-sub">{copy.sub}</p>
                        </div>
                    </div>

                    <Reveal open={mode !== 'forgot'}>
                        <div className="login-tabs" role="tablist">
                            <button type="button" role="tab" aria-selected={mode === 'login'}
                                className={mode === 'login' ? 'on' : ''} onClick={() => switchMode('login')}>Sign in</button>
                            <button type="button" role="tab" aria-selected={mode === 'signup'}
                                className={mode === 'signup' ? 'on' : ''} onClick={() => switchMode('signup')}>Sign up</button>
                            <span className={`login-tabs-pill ${mode === 'signup' ? 'right' : ''}`} />
                        </div>
                    </Reveal>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <Reveal open={mode === 'signup'}>
                            <label className="login-field">
                                <span>Full name</span>
                                <input type="text" name="fullName" autoComplete="name" placeholder="Alex Morgan" defaultValue={location.state?.name || ''} required />
                            </label>
                        </Reveal>

                        <label className="login-field">
                            <span className="login-field-row">
                                <span key={mode === 'login' ? 'user' : 'mail'} className="login-swap">
                                    {mode === 'login' ? 'Email or username' : 'Email'}
                                </span>
                            </span>
                            <input
                                type={mode === 'login' ? 'text' : 'email'}
                                name={mode === 'login' ? 'username' : 'email'}
                                autoComplete={mode === 'login' ? 'username' : 'email'}
                                placeholder="you@university.edu"
                                required
                            />
                        </label>

                        <Reveal open={mode !== 'forgot'}>
                            <label className="login-field">
                                <span className="login-field-row">
                                    Password
                                    <button type="button" className={`login-link login-forgot ${mode === 'login' ? 'show' : ''}`}
                                        tabIndex={mode === 'login' ? 0 : -1} onClick={() => switchMode('forgot')}>Forgot?</button>
                                </span>
                                <div className="login-pass">
                                    <input
                                        ref={passwordRef}
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                        placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'}
                                        minLength={mode === 'signup' ? 8 : undefined}
                                        required
                                    />
                                    <button type="button" className="login-eye" onMouseDown={(e) => e.preventDefault()}
                                        onClick={togglePassword} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </label>
                        </Reveal>

                        <button type="submit" className="login-submit" disabled={busy}>
                            <span key={busy ? 'busy' : mode} className="login-submit-label">
                                {busy ? <><span className="login-dot" /> Signing in…</> : <>{copy.cta} <ArrowRight size={16} /></>}
                            </span>
                        </button>
                    </form>

                    <Reveal open={mode === 'forgot'}>
                        <button type="button" className="login-link login-return" onClick={() => switchMode('login')}>
                            <ArrowLeft size={14} /> Back to sign in
                        </button>
                    </Reveal>

                    <Reveal open={mode !== 'forgot'}>
                        <div className="login-or"><span>or continue with</span></div>
                        <div className="login-social">
                            <button type="button"><GoogleIcon /> Google</button>
                            <button type="button"><Github size={16} /> GitHub</button>
                        </div>
                    </Reveal>
                </div>

                <footer className="login-foot">© {new Date().getFullYear()} ISU · Students, everywhere.</footer>
            </section>

            <section className="login-globe" aria-hidden="true">
                <GlobeStage />
            </section>
        </div>
    );
};

export default Login;
