import React, { useEffect, useState } from 'react';
import { useLoader } from '../context/LoaderContext';

const Loader = ({ onFinish }) => {
    const { isLoading, message } = useLoader();
    const [opacity, setOpacity] = useState(0);
    const [shouldRender, setShouldRender] = useState(false);

    // Sync visibility with context isLoading state
    useEffect(() => {
        if (isLoading) {
            setShouldRender(true);
            // Instant opacity set to avoid gaps
            setOpacity(1);
        } else {
            setOpacity(0);
            const timer = setTimeout(() => {
                setShouldRender(false);
                if (onFinish) onFinish();
            }, 1000); // Wait for fade out transition
            return () => clearTimeout(timer);
        }
    }, [isLoading, onFinish]);

    if (!shouldRender) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#000',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'opacity 1s ease-in-out',
            opacity: opacity,
            pointerEvents: 'none'
        }}>
            {/* Tech Ring Animation */}
            <div style={{
                position: 'relative',
                width: '100px',
                height: '100px'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    border: '2px solid rgba(0, 255, 204, 0.2)',
                    borderRadius: '50%',
                    borderTopColor: '#00ffcc',
                    animation: 'spin 1.5s linear infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '15px', left: '15px', width: '70px', height: '70px',
                    border: '2px solid rgba(0, 255, 204, 0.4)',
                    borderRadius: '50%',
                    borderBottomColor: '#00ffcc',
                    animation: 'spin 2s linear infinite reverse'
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '30px', left: '30px', width: '40px', height: '40px',
                    backgroundColor: '#00ffcc',
                    borderRadius: '50%',
                    animation: 'pulse 1s ease-in-out infinite',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#000',
                    fontWeight: '900',
                    fontSize: '10px',
                    fontFamily: 'sans-serif',
                    letterSpacing: '1px'
                }}>
                    ISU
                </div>
            </div>

            {/* Loading Text */}
            {message && (
                <h2 style={{
                    marginTop: '30px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '18px',
                    letterSpacing: '5px',
                    animation: 'blink 1.5s infinite',
                    textAlign: 'center',
                    padding: '0 20px'
                }}>
                    {message.toUpperCase()}
                </h2>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.8); opacity: 0.5; }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default Loader;
