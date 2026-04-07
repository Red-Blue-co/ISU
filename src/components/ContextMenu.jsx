import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useTheme, THEMES } from '../context/ThemeContext';
import { Palette, Maximize, Settings, Monitor, RefreshCw, X, Terminal } from 'lucide-react';
import './ContextMenu.css';
import './SystemEffects.css';

const ContextMenu = () => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isScanning, setIsScanning] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const { applyTheme, applyCustomColor } = useTheme();

    const handleContextMenu = useCallback((e) => {
        if (e.shiftKey) return; // Native bypass
        e.preventDefault();
        setVisible(true);

        // Ensure menu doesn't go off screen
        const menuWidth = 220;
        const menuHeight = 300;
        let x = e.clientX;
        let y = e.clientY;

        if (x + menuWidth > window.innerWidth) x -= menuWidth;
        if (y + menuHeight > window.innerHeight) y -= menuHeight;

        setPosition({ x, y });
    }, []);

    const handleInspect = () => {
        setVisible(false);
        setIsScanning(true);
        setShowInfo(true);

        // Show Eruda if it's loaded
        if (window.eruda) {
            window.eruda.show();
        }

        // Reset scanning line after animation
        setTimeout(() => setIsScanning(false), 2000);

        // Auto-hide info pane after 6 seconds
        setTimeout(() => setShowInfo(false), 6000);
    };

    const handleClick = useCallback(() => {
        if (visible) setVisible(false);
    }, [visible]);

    useEffect(() => {
        // Initialize Eruda
        if (window.eruda) {
            window.eruda.init({
                theme: 'dark',
                defaults: { displaySize: 50, transparency: 90, theme: 'dark' }
            });
            // Hide the default floating button
            const el = document.querySelector('.eruda-container');
            if (el) el.style.display = 'none';
        }

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('click', handleClick);
        window.addEventListener('scroll', handleClick);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('scroll', handleClick);
        };
    }, [handleContextMenu, handleClick]);

    if (!visible) return null;

    const menuContent = (
        <div
            className="isu-context-menu"
            style={{ left: position.x, top: position.y }}
            onClick={(e) => e.stopPropagation()}
            onMouseLeave={() => setVisible(false)}
        >
            <div className="isu-menu-item" onClick={() => window.location.reload()}>
                <RefreshCw size={14} /> <span>Refresh Page</span>
            </div>
            <div className="isu-menu-item" onClick={() => document.documentElement.requestFullscreen()}>
                <Maximize size={14} /> <span>Toggle Fullscreen</span>
            </div>

            <div className="isu-menu-item isu-menu-submenu">
                <Palette size={14} /> <span>Change Theme</span>
                <div className="isu-menu-submenu-content">
                    <div className="isu-submenu-container">
                        {Object.keys(THEMES).map((key) => (
                            <div
                                key={key}
                                className="isu-menu-item"
                                onClick={() => { applyTheme(key); setVisible(false); }}
                            >
                                {THEMES[key].name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="isu-menu-item isu-menu-submenu">
                <Settings size={14} /> <span>Theme Colors</span>
                <div className="isu-menu-submenu-content">
                    <div className="isu-submenu-container" style={{ padding: '8px' }}>
                        <div className="isu-color-grid">
                            {['#00ffcc', '#ff3366', '#ffcc00', '#0077ff', '#ffffff', '#aa00ff', '#55ff00', '#ff6600'].map(color => (
                                <div
                                    key={color}
                                    className="isu-color-dot"
                                    style={{ backgroundColor: color }}
                                    onClick={() => applyCustomColor('primary', color)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );

    return ReactDOM.createPortal(
        menuContent,
        document.body
    );
};

export default ContextMenu;
