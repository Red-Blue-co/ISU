import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const InteractiveText = ({ text = "ISU COMMUNITY", sensitivity = 5 }) => {
    const { currentTheme } = useTheme();

    // We split text into characters to animate individually
    const chars = text.split('');

    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', cursor: 'default' }}>
            {chars.map((char, index) => (
                <CharItem key={index} char={char} color={currentTheme.colors.primary} />
            ))}
        </div>
    );
};

const CharItem = ({ char, color }) => {
    const [transform, setTransform] = useState('');

    const handleMouseMove = (e) => {
        // Calculate distance from center of this char
        const rect = e.target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        const maxDist = 100; // Influence radius

        if (dist < maxDist) {
            const power = (maxDist - dist) / maxDist;
            const moveX = (e.clientX - centerX) * power * 0.5;
            const moveY = (e.clientY - centerY) * power * 0.5;

            // "Repel" or "Attract" effect - here Repel/Bulge
            setTransform(`translate(${moveX}px, ${moveY}px) scale(${1 + power})`);
        } else {
            setTransform('');
        }
    };

    const handleMouseLeave = () => {
        setTransform('');
    };

    return (
        <span
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                display: 'inline-block',
                fontSize: '4rem',
                fontWeight: '900',
                color: color,
                transition: 'transform 0.1s ease-out',
                transform: transform,
                margin: '0 2px',
                userSelect: 'none',
                // Text shadow for "Pop"
                textShadow: transform ? '0 10px 20px rgba(0,0,0,0.5)' : 'none'
            }}
        >
            {char === ' ' ? '\u00A0' : char}
        </span>
    );
};

export default InteractiveText;
