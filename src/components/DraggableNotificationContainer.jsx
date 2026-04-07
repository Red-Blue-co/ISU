import React, { useState, useEffect, useRef } from 'react';
import { useNotification } from '../context/NotificationContext';
import { X, Check, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './DraggableNotificationContainer.css';

const LOCAL_STORAGE_KEY = 'isu-toast-pos';

const getIconForType = (type) => {
    switch (type) {
        case 'success': return <Check size={16} color="#00e676" />;
        case 'error': return <ShieldAlert size={16} color="#ff1744" />;
        case 'warning': return <AlertTriangle size={16} color="#ffea00" />;
        case 'info':
        default:
            return <Info size={16} color="inherit" />;
    }
};

const NotificationItem = ({ notif, onRemove }) => {
    const defaultTime = 5000;
    const [progress, setProgress] = useState(100);
    const [isHovered, setIsHovered] = useState(false);
    const timeLeft = useRef(defaultTime);
    const lastTick = useRef(Date.now());

    useEffect(() => {
        let frameId;
        const tick = () => {
            const now = Date.now();
            if (!isHovered) {
                const delta = now - lastTick.current;
                timeLeft.current -= delta;
                if (timeLeft.current <= 0) {
                    onRemove(notif.id);
                    return;
                }
                setProgress(Math.max(0, (timeLeft.current / defaultTime) * 100));
            }
            lastTick.current = now;
            frameId = requestAnimationFrame(tick);
        };
        lastTick.current = Date.now();
        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [isHovered, notif.id, onRemove]);

    return (
        <div 
            className={`isu-notification-item type-${notif.type}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="isu-notification-icon-bg">
                {getIconForType(notif.type)}
            </div>
            <div className="isu-notification-content">
                {notif.message}
            </div>
            <button 
                className="isu-notification-close" 
                onClick={() => onRemove(notif.id)}
            >
                <X size={14} />
            </button>
            <div className={`isu-notification-progress ${isHovered ? 'paused' : ''}`} style={{ width: `${progress}%` }} />
        </div>
    );
};

const DraggableNotificationContainer = () => {
    const { notifications, removeNotification } = useNotification();
    
    // Default top-right
    const [position, setPosition] = useState({ x: window.innerWidth - 340, y: 20 });
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const savedPos = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedPos) {
            try {
                const parsed = JSON.parse(savedPos);
                // Ensure it's not totally off-screen if window was resized
                const safeX = Math.min(Math.max(20, parsed.x), window.innerWidth - 340);
                const safeY = Math.min(Math.max(20, parsed.y), window.innerHeight - 100);
                setPosition({ x: safeX, y: safeY });
            } catch (e) {
                console.error("Failed to parse saved toast position", e);
            }
        }
    }, []);

    const handleMouseDown = (e) => {
        isDragging.current = true;
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        document.body.style.userSelect = 'none'; // Prevent text selection during drag
    };

    const handleMouseUp = () => {
        if (isDragging.current) {
            isDragging.current = false;
            document.body.style.userSelect = '';
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        
        const newX = e.clientX - dragOffset.current.x;
        const newY = e.clientY - dragOffset.current.y;
        
        setPosition({ x: newX, y: newY });
        // Save immediately as they drag so it's perfectly persistent
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ x: newX, y: newY }));
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [position]);

    if (notifications.length === 0) return null;

    return (
        <div 
            className="isu-notification-stack" 
            style={{ left: position.x, top: position.y }}
        >
            <div 
                className="isu-notification-drag-handle"
                onMouseDown={handleMouseDown}
                title="Drag to reposition notifications"
            />
            {notifications.map((notif) => (
                <NotificationItem 
                    key={notif.id} 
                    notif={notif} 
                    onRemove={removeNotification} 
                />
            ))}
        </div>
    );
};

export default DraggableNotificationContainer;
