import React, { Suspense, useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SplineBlob from '../components/SplineBlob';
import InteractiveText from '../components/InteractiveText';
import { useTheme } from '../context/ThemeContext';
import { useLoader } from '../context/LoaderContext';
import './Home.css';

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

    return (
        <div>
            {/* Hero Section */}
            <Hero />

            {/* Spline Showcase Section (About/Community intro) */}
            <div className="isu-home-section" style={{ background: currentTheme.colors.bg }}>
                <div className="isu-home-container">

                    {/* Text Side */}
                    <div className="isu-home-text-side">
                        <h2 className="isu-home-title" style={{ color: currentTheme.colors.primary }}>
                            <InteractiveText text="STUDENT COMMUNITY" />
                        </h2>
                        <p className="isu-home-description" style={{ color: currentTheme.colors.text }}>
                            A dedicated platform organized and managed by ISU.
                            Connecting students globally through collaboration and growth.
                        </p>
                        <p className="isu-home-note" style={{ color: currentTheme.colors.accent }}>
                            *This 3D organic shape is rendered in real-time, inspired by Spline design tools.*
                        </p>
                    </div>

                    {/* 3D Spline Blob Side */}
                    <div className="isu-home-canvas-side">
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
                            <div className="isu-blob-fallback-container">
                                {/* CSS Gradient Blob Mimic */}
                                <div className="isu-blob-anim" style={{
                                    background: `radial-gradient(circle at 30% 30%, ${currentTheme.colors.primary}, transparent)`,
                                    boxShadow: `0 0 50px ${currentTheme.colors.accent}`,
                                }} />
                                <p className="isu-blob-note" style={{ color: currentTheme.colors.accent }}>
                                    (Spline-style 2D Preview)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Community/Join Section */}
            <div className="isu-home-section isu-join-section" style={{ background: currentTheme.colors.secondary }}>
                <div className="isu-join-content">
                    <h1 className="isu-join-title" style={{ color: currentTheme.colors.bg }}>JOIN OUR COMMUNITY</h1>
                    <p className="isu-join-text" style={{ color: currentTheme.colors.bg }}>
                        Organized and managed by ISU students for the student world.
                    </p>
                    <button className="isu-join-btn" style={{
                        background: currentTheme.colors.bg,
                        color: currentTheme.colors.primary
                    }}>
                        Get Started
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Home;
