import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLoader } from '../context/LoaderContext';
import InteractiveText from '../components/InteractiveText';
import './About.css';

const About = () => {
    const { currentTheme } = useTheme();

    return (
        <div className="isu-about-page" style={{ background: currentTheme.colors.bg, color: currentTheme.colors.text }}>
            <div className="isu-about-container">
                <h1 className="isu-about-title" style={{ color: currentTheme.colors.primary }}>
                    <InteractiveText text="ABOUT ISU" />
                </h1>

                <div className="isu-about-content">
                    <p className="isu-about-paragraph">
                        Welcome to <strong>ISU</strong>, a dedicated student community organized and managed by ISU.
                        We provide a space for students to connect, collaborate, and grow together.
                    </p>

                    <p className="isu-about-paragraph">
                        Our platform is designed to be a hub for student engagement,
                        fostering a supportive environment where ideas can be shared and developed.
                    </p>

                    <h2 className="isu-about-subtitle" style={{ color: currentTheme.colors.secondary }}>Our Mission</h2>
                    <p className="isu-about-paragraph">
                        To build a strong and vibrant student community where every member is empowered
                        through organized initiatives and collaborative projects managed by ISU.
                    </p>

                    <div className="isu-about-quote-box" style={{ borderLeftColor: currentTheme.colors.primary }}>
                        <p className="isu-about-quote">
                            "Innovation is not just about new tools, it's about a new way of seeing the world through those tools."
                        </p>
                    </div>
                </div>
            </div>

            <footer className="isu-about-footer">
                © 2026 ISU. ORGANIZED AND MANAGED BY ISU.
            </footer>
        </div>
    );
};

export default About;
