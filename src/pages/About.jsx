import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLoader } from '../context/LoaderContext';
import InteractiveText from '../components/InteractiveText';

const About = () => {
    const { currentTheme } = useTheme();

    const pageStyle = {
        minHeight: '100vh',
        background: currentTheme.colors.bg,
        color: currentTheme.colors.text,
        paddingTop: '120px',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    };

    const containerStyle = {
        maxWidth: '1000px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '3rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
    };

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '2rem', color: currentTheme.colors.primary }}>
                    <InteractiveText text="ABOUT ISU" />
                </h1>

                <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Welcome to <strong>ISU</strong>, a dedicated student community organized and managed by ISU.
                        We provide a space for students to connect, collaborate, and grow together.
                    </p>

                    <p style={{ marginBottom: '1.5rem' }}>
                        Our platform is designed to be a hub for student engagement,
                        fostering a supportive environment where ideas can be shared and developed.
                    </p>

                    <h2 style={{ marginTop: '3rem', marginBottom: '1rem', color: currentTheme.colors.secondary }}>Our Mission</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        To build a strong and vibrant student community where every member is empowered
                        through organized initiatives and collaborative projects managed by ISU.
                    </p>

                    <div style={{
                        marginTop: '4rem',
                        padding: '2rem',
                        borderLeft: `4px solid ${currentTheme.colors.primary}`,
                        background: 'rgba(0, 255, 204, 0.05)'
                    }}>
                        <p style={{ fontStyle: 'italic', opacity: 0.8 }}>
                            "Innovation is not just about new tools, it's about a new way of seeing the world through those tools."
                        </p>
                    </div>
                </div>
            </div>

            <footer style={{ marginTop: '4rem', paddingBottom: '2rem', opacity: 0.5, fontSize: '0.9rem' }}>
                © 2026 ISU. ORGANIZED AND MANAGED BY ISU.
            </footer>
        </div>
    );
};

export default About;
