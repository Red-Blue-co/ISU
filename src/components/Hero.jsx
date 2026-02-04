import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Hero = () => {
    const { currentTheme } = useTheme();

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', background: currentTheme.colors.bg }}>

            {/* Background Effect */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60vw', height: '60vw',
                background: currentTheme.colors.primary,
                filter: 'blur(150px)',
                opacity: 0.2,
                borderRadius: '50%'
            }} />

            {/* Overlay Text */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 20,
                textAlign: 'center',
                pointerEvents: 'none',
                // mixBlendMode: 'difference', // Removed for better compatibility
                color: currentTheme.colors.text,
                width: '100%'
            }}>
                <h1 style={{ fontSize: '15vw', fontWeight: '900', margin: 0, lineHeight: 0.8, color: currentTheme.colors.text }}>ISU</h1>
                <p style={{ fontSize: '1.5rem', marginTop: '1rem', letterSpacing: '8px', color: currentTheme.colors.secondary, textTransform: 'uppercase' }}>Student Community</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', letterSpacing: '4px', color: currentTheme.colors.primary, opacity: 0.8, textTransform: 'uppercase' }}>Organized & Managed by ISU</p>
            </div>
        </div>
    );
};

export default Hero;
