import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const MagicCursor = () => {
    const { currentTheme } = useTheme();
    const cursorRef = useRef(null);
    const trailsRef = useRef([]);
    const [cursorType, setCursorType] = useState('default'); // 'default', 'action', 'text'

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX: x, clientY: y } = e;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            }

            createTrail(x, y);
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            const interactive = target.closest('button, a, [role="button"], .isu-menu-item, .isu-color-dot');
            const input = target.closest('input, textarea');

            if (interactive) {
                setCursorType('action');
            } else if (input) {
                setCursorType('text');
            } else {
                setCursorType('default');
            }
        };

        const createTrail = (x, y) => {
            const trail = document.createElement('div');
            trail.className = 'magic-trail';
            trail.style.left = `${x}px`;
            trail.style.top = `${y}px`;
            trail.style.backgroundColor = currentTheme.colors.primary;
            trail.style.boxShadow = `0 0 10px ${currentTheme.colors.accent}`;

            document.body.appendChild(trail);
            trailsRef.current.push(trail);

            setTimeout(() => {
                trail.style.opacity = '0';
                trail.style.transform = 'scale(0)';
            }, 10);

            setTimeout(() => {
                trail.remove();
                trailsRef.current = trailsRef.current.filter(t => t !== trail);
            }, 500);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            trailsRef.current.forEach(t => t.remove());
        };
    }, [currentTheme]);

    return (
        <>
            <style>{`
                .magic-cursor {
                    position: fixed;
                    top: 0; left: 0;
                    width: 20px; height: 20px;
                    margin-left: -10px;
                    margin-top: -10px;
                    border: 2px solid ${currentTheme.colors.primary};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 10001;
                    transform: translate3d(-100px, -100px, 0);
                    transition: transform 0.08s cubic-bezier(0.23, 1, 0.32, 1), 
                                width 0.3s cubic-bezier(0.23, 1, 0.32, 1), 
                                height 0.3s cubic-bezier(0.23, 1, 0.32, 1), 
                                margin 0.3s cubic-bezier(0.23, 1, 0.32, 1),
                                border-radius 0.3s cubic-bezier(0.23, 1, 0.32, 1),
                                background 0.3s ease,
                                border-color 0.3s ease,
                                box-shadow 0.3s ease,
                                opacity 0.3s ease;
                    mix-blend-mode: difference;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .magic-cursor.is-action {
                    width: 20px;
                    height: 20px;
                    margin-left: -10px;
                    margin-top: -10px;
                    background: ${currentTheme.colors.primary}11;
                    border-radius: 6px;
                    border: 1px solid ${currentTheme.colors.primary}33;
                    mix-blend-mode: normal;
                    backdrop-filter: blur(6px);
                    box-shadow: 0 0 15px ${currentTheme.colors.primary}22;
                }

                .magic-cursor.is-text {
                    width: 2px;
                    height: 24px;
                    margin-left: -1px;
                    margin-top: -12px;
                    border-radius: 0;
                    background: ${currentTheme.colors.primary};
                    border-width: 0;
                    mix-blend-mode: normal;
                }

                body.no-cursor .magic-cursor,
                body.no-cursor .magic-trail {
                    opacity: 0 !important;
                }

                .magic-cursor::after {
                    content: '';
                    position: absolute;
                    width: 4px; height: 4px;
                    background: ${currentTheme.colors.accent};
                    border-radius: 50%;
                    transition: opacity 0.2s ease;
                }

                .magic-cursor.is-text::after,
                .magic-cursor.is-action::after {
                    opacity: 0;
                }

                .magic-trail {
                    position: fixed;
                    width: 10px; height: 10px;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9998;
                    transform: scale(1);
                    transition: all 0.5s ease-out;
                    opacity: 0.5;
                }
            `}</style>
            <div
                ref={cursorRef}
                className={`magic-cursor ${cursorType === 'action' ? 'is-action' : cursorType === 'text' ? 'is-text' : ''}`}
            />
        </>
    );
};

export default MagicCursor;
