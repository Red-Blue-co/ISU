import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './Hero.css';

const Hero = () => {
    const { currentTheme } = useTheme();

    return (
        <div className="isu-hero" style={{ background: currentTheme.colors.bg }}>

            {/* Background Effect */}
            <div className="isu-hero-bg-effect" style={{ background: currentTheme.colors.primary }} />

            {/* Overlay Text */}
            <div className="isu-hero-overlay" style={{ color: currentTheme.colors.text }}>
                <h1 className="isu-hero-title" style={{ color: currentTheme.colors.text }}>ISU</h1>
                <p className="isu-hero-subtitle" style={{ color: currentTheme.colors.secondary }}>Student Community</p>
                <p className="isu-hero-managed-by" style={{ color: currentTheme.colors.primary }}>Organized & Managed by ISU</p>
            </div>
        </div>
    );
};

export default Hero;
