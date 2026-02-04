import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
    const { currentTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="isu-navbar" style={{ color: currentTheme.colors.text }}>
            <div className="isu-nav-header">
                <Link to="/" className="isu-nav-logo" style={{ color: currentTheme.colors.text }}>ISU</Link>
                <div className="isu-hamburger" onClick={toggleMenu}>
                    <span style={{ background: currentTheme.colors.text }}></span>
                    <span style={{ background: currentTheme.colors.text }}></span>
                    <span style={{ background: currentTheme.colors.text }}></span>
                </div>
            </div>

            <div className={`isu-nav-links ${isOpen ? 'active' : ''}`}>
                <Link to="/" className="isu-nav-link" onClick={() => setIsOpen(false)} style={{ color: currentTheme.colors.text }}>Home</Link>
                <Link to="/about" className="isu-nav-link" onClick={() => setIsOpen(false)} style={{ color: currentTheme.colors.text }}>About</Link>
                <Link to="/community" className="isu-nav-link" onClick={() => setIsOpen(false)} style={{ color: currentTheme.colors.text }}>Community</Link>
                <Link to="/login" className="isu-nav-link" onClick={() => setIsOpen(false)} style={{ color: currentTheme.colors.text }}>Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;
