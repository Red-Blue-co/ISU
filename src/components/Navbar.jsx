import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { currentTheme } = useTheme();

    const navStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        background: 'transparent', // Glassmorphism can be added here
        color: currentTheme.colors.text,
    };

    const linkStyle = {
        color: currentTheme.colors.text,
        marginLeft: '2rem',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        letterSpacing: '2px',
        fontSize: '0.9rem',
        position: 'relative',
    };

    return (
        <nav style={navStyle}>
            <Link to="/" style={{ ...linkStyle, marginLeft: 0, fontSize: '1.5rem' }}>ISU</Link>
            <div>
                <Link to="/" style={linkStyle}>Home</Link>
                <Link to="/about" style={linkStyle}>About</Link>
                <Link to="/community" style={linkStyle}>Community</Link>
                <Link to="/login" style={linkStyle}>Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;
