import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const LoginAvatar = ({ fieldFocus, mousePos }) => {
    const { currentTheme } = useTheme();

    // Base Orb Style
    const containerStyle = {
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    };

    const orbStyle = {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: currentTheme.colors.bg,
        border: `2px solid ${currentTheme.colors.primary}`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 0 20px ${currentTheme.colors.accent}`,
        transition: 'all 0.3s ease',
    };

    // The "Eye" / Core
    const coreBaseStyle = {
        width: '20px',
        height: '20px',
        background: currentTheme.colors.primary,
        borderRadius: '50%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transition: 'all 0.2s ease-out',
        boxShadow: `0 0 10px ${currentTheme.colors.primary}`,
    };

    // Calculate Eye Position based on interaction
    let eyeTransform = 'translate(-50%, -50%)'; // Default center

    if (fieldFocus === 'username') {
        // Look down/at username field
        eyeTransform = `translate(-50%, 10px)`;
    } else if (fieldFocus === 'password') {
        // "Closed" or looking away/up
        eyeTransform = `translate(-50%, -50%) scale(0.1)`; // Shrink to hide
    } else if (mousePos) {
        // Follow mouse slightly
        // Assume mousePos is -1 to 1 normalized
        eyeTransform = `translate(calc(-50% + ${mousePos.x * 10}px), calc(-50% + ${mousePos.y * 10}px))`;
    }

    // Eyelid for password (privacy mode)
    const eyelidStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: fieldFocus === 'password' ? '100%' : '0%', // Close eye
        background: currentTheme.colors.secondary,
        transition: 'height 0.3s ease',
        opacity: 0.9,
        zIndex: 10,
    };

    return (
        <div style={containerStyle}>
            {/* Antenna */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                width: '2px',
                height: '20px',
                background: currentTheme.colors.primary
            }} />

            <div style={orbStyle}>
                <div style={eyelidStyle} />
                <div style={{ ...coreBaseStyle, transform: eyeTransform }} />

                {/* Tech decorative rings */}
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    width: '100%', height: '100%',
                    borderRadius: '50%',
                    border: `1px dashed ${currentTheme.colors.accent}`,
                    transform: `translate(-50%, -50%) rotate(${Date.now() / 50}deg)`,
                    opacity: 0.5
                }} />
            </div>
        </div>
    );
};

export default LoginAvatar;
