import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const LoginAvatar = ({ fieldFocus, mousePos, showPassword, isRed }) => {
    const { currentTheme } = useTheme();
    const [isBlinking, setIsBlinking] = useState(false);
    
    const activeColor = isRed ? '#ff1744' : currentTheme.colors.primary;

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
        width: '100%',
        height: '100%',
        maxWidth: '100px',
        maxHeight: '100px',
        borderRadius: '50%',
        background: currentTheme.colors.bg,
        border: `2px solid ${activeColor}`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 0 ${isRed ? '30px' : '20px'} ${isRed ? activeColor : currentTheme.colors.accent}`,
        transition: 'all 0.3s ease',
    };

    // The "Eye" / Core
    const coreBaseStyle = {
        width: '20px',
        height: '20px',
        background: activeColor,
        borderRadius: '50%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transition: 'all 0.2s ease-out',
        boxShadow: `0 0 10px ${activeColor}`,
    };

    // Calculate Eye Position based on interaction
    let eyeTransform = 'translate(-50%, -50%)'; // Default center
    // Toggle Privacy/Masked Eye Logic
    const isPrivacyClosed = fieldFocus === 'password' && !showPassword;

    // Organic Random Blinking
    useEffect(() => {
        if (isPrivacyClosed) return; // Don't randomly blink if we are actively hiding the password
        
        let timeoutId;
        const scheduleBlink = () => {
            const timeUntilNextBlink = Math.random() * 4000 + 2000; // 2s to 6s
            timeoutId = setTimeout(() => {
                setIsBlinking(true);
                setTimeout(() => setIsBlinking(false), 150); // Blink duration
                scheduleBlink();
            }, timeUntilNextBlink);
        };

        scheduleBlink();
        return () => clearTimeout(timeoutId);
    }, [isPrivacyClosed]);

    if (fieldFocus === 'username') {
        // Look down/at username field
        eyeTransform = `translate(-50%, 10px)`;
    } else if (isPrivacyClosed) {
        // "Closed" or looking away/up
        eyeTransform = `translate(-50%, -50%) scale(0.1)`; // Shrink to hide
    } else if (fieldFocus === 'password' && showPassword) {
        // Staring directly forward since secret is exposed
        eyeTransform = `translate(-50%, -50%) scale(1.15)`;
    } else if (mousePos) {
        // Follow mouse slightly
        // Assume mousePos is -1 to 1 normalized
        eyeTransform = `translate(calc(-50% + ${mousePos.x * 10}px), calc(-50% + ${mousePos.y * 10}px))`;
    }
    const isEyelidDown = isPrivacyClosed || isBlinking;

    const eyelidStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: isEyelidDown ? '100%' : '0%',
        background: currentTheme.colors.secondary,
        borderBottom: isEyelidDown ? `2px solid ${activeColor}` : '0px solid transparent',
        boxShadow: isEyelidDown ? `0 10px 20px rgba(0,0,0,${currentTheme.name === 'Light' ? '0.1' : '0.8'})` : 'none',
        transition: isBlinking ? 'height 0.1s ease' : 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        opacity: 0.98,
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
