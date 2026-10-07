import React, { useState, useCallback } from 'react';
import DottedGlobe from './DottedGlobe';
import './GlobeStage.css';

// The dotted globe plus a translucent "building globe…" placeholder that fades out once the dots are drawn
const GlobeStage = ({ className = '', allowZoom = true }) => {
    const [ready, setReady] = useState(false);
    const handleReady = useCallback(() => requestAnimationFrame(() => requestAnimationFrame(() => setReady(true))), []);

    return (
        <div className={`globe-stage ${className}`}>
            <div className={`globe-stage-building ${ready ? 'gone' : ''}`}>
                <div className="globe-stage-orb" />
                <span>building globe…</span>
            </div>
            <div className={`globe-stage-canvas ${ready ? 'ready' : ''}`}>
                <DottedGlobe onReady={handleReady} allowZoom={allowZoom} />
            </div>
        </div>
    );
};

export default GlobeStage;
