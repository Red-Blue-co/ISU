import React, { Suspense, useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SplineBlob from '../components/SplineBlob';
import InteractiveText from '../components/InteractiveText';
import { useTheme } from '../context/ThemeContext';
import { useLoader } from '../context/LoaderContext';

const Home = () => {
    const { currentTheme } = useTheme();
    const { showLoader } = useLoader();
    const [hasWebGL, setHasWebGL] = useState(true);

    // Check WebGL again for this section
    useEffect(() => {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) setHasWebGL(false);
        } catch (e) {
            setHasWebGL(false);
        }
    }, [showLoader]);

    const sectionStyle = {
        padding: '4rem 2rem',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: currentTheme.colors.bg,
        position: 'relative',
        overflow: 'hidden'
    };

    const textContainerStyle = {
        flex: 1,
        zIndex: 10,
        paddingRight: '50px'
    };

    const canvasContainerStyle = {
        flex: 1,
        height: '500px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    return (
        <div>
            {/* Hero Section */}
            <Hero />

            {/* Spline Showcase Section (About/Community intro) */}
            <div style={sectionStyle}>
                <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>

                    {/* Text Side */}
                    <div style={textContainerStyle}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: currentTheme.colors.primary }}>
                            <InteractiveText text="STUDENT COMMUNITY" />
                        </h2>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: currentTheme.colors.text }}>
                            A dedicated platform organized and managed by ISU.
                            Connecting students globally through collaboration and growth.
                        </p>
                        <p style={{ marginTop: '1rem', color: currentTheme.colors.accent }}>
                            *This 3D organic shape is rendered in real-time, inspired by Spline design tools.*
                        </p>
                    </div>

                    {/* 3D Spline Blob Side */}
                    <div style={canvasContainerStyle}>
                        {hasWebGL ? (
                            <Canvas camera={{ position: [0, 0, 5] }}>
                                <ambientLight intensity={0.8} />
                                <directionalLight position={[10, 10, 5]} intensity={1} />
                                <Suspense fallback={null}>
                                    <SplineBlob />
                                </Suspense>
                                <OrbitControls enableZoom={false} />
                            </Canvas>
                        ) : (
                            <div style={{
                                width: '100%', height: '100%',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                position: 'relative'
                            }}>
                                {/* CSS Gradient Blob Mimic */}
                                <div className="blob-anim" style={{
                                    width: '300px',
                                    height: '300px',
                                    background: `radial-gradient(circle at 30% 30%, ${currentTheme.colors.primary}, transparent)`,
                                    filter: 'blur(20px)',
                                    opacity: 0.6,
                                    borderRadius: '50%',
                                    // Animation handled by style tag below
                                    boxShadow: `0 0 50px ${currentTheme.colors.accent}`,
                                    transition: 'all 0.5s ease'
                                }} />

                                <style>{`
                                    @keyframes morph {
                                        0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(0deg) scale(1); }
                                        50% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(180deg) scale(1.1); }
                                        100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(360deg) scale(1); }
                                    }
                                    .blob-anim {
                                        animation: morph 20s linear infinite;
                                    }
                                `}</style>

                                <p style={{
                                    position: 'absolute',
                                    bottom: '10%',
                                    color: currentTheme.colors.accent,
                                    fontSize: '0.8rem',
                                    opacity: 0.7
                                }}>
                                    (Spline-style 2D Preview)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Community/Join Section */}
            <div style={{ ...sectionStyle, minHeight: '50vh', background: currentTheme.colors.secondary }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ color: currentTheme.colors.bg, fontSize: '3rem', marginBottom: '2rem' }}>JOIN OUR COMMUNITY</h1>
                    <p style={{ color: currentTheme.colors.bg, marginBottom: '2rem', opacity: 0.8 }}>
                        Organized and managed by ISU students for the student world.
                    </p>
                    <button style={{
                        padding: '1rem 3rem',
                        fontSize: '1.2rem',
                        background: currentTheme.colors.bg,
                        color: currentTheme.colors.primary,
                        border: 'none',
                        borderRadius: '50px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}>
                        Get Started
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Home;
