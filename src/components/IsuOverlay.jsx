import React from 'react';
import './OverlayStyles.css';

const IsuOverlay = ({ isOpen, onClose, children, style, title = "ISU DATA" }) => {
    if (!isOpen) return null;

    return (
        <div className="isu-overlay-container" style={style}>
            {/* Main Frame Borders */}
            <div className="isu-frame-border isu-frame-top"></div>
            <div className="isu-frame-border isu-frame-right"></div>
            <div className="isu-frame-border isu-frame-bottom"></div>
            <div className="isu-frame-border isu-frame-left"></div>

            {/* Specialized Corner Accents */}
            <div className="isu-corner isu-corner-tl"></div>
            <div className="isu-corner isu-corner-tr"></div>
            <div className="isu-corner isu-corner-bl"></div>
            <div className="isu-corner isu-corner-br"></div>

            {/* Close Button */}
            <button className="isu-close-btn" onClick={onClose}>
                <span className="isu-close-icon">×</span>
            </button>

            {/* Content Area */}
            <div className="isu-content">
                {title && (
                    <div className="isu-header">
                        <span className="isu-header-tag">SYSTEM_OVR</span>
                        <h3 className="isu-title">{title}</h3>
                        <div className="isu-header-line"></div>
                    </div>
                )}
                <div className="isu-inner-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default IsuOverlay;
