import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
    const { currentTheme } = useTheme();

    return (
        <nav className="isu-navbar" style={{ color: currentTheme.colors.text }}>
            <Link to="/" className="isu-nav-logo" style={{ color: currentTheme.colors.text }}>ISU</Link>
            <div className="isu-nav-links">
                <Link to="/" className="isu-nav-link" style={{ color: currentTheme.colors.text }}>Home</Link>
                <Link to="/about" className="isu-nav-link" style={{ color: currentTheme.colors.text }}>About</Link>
                <Link to="/community" className="isu-nav-link" style={{ color: currentTheme.colors.text }}>Community</Link>
                <Link to="/login" className="isu-nav-link" style={{ color: currentTheme.colors.text }}>Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;
