import { useEffect, useRef } from 'react';

// Adds .in once the element scrolls into view
export const useReveal = () => {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); }
        }, { threshold: 0.15 });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return ref;
};

// Cards lean toward the cursor: sets --rx/--ry (and the glare spot --gx/--gy) from the mouse position
export const tilt = {
    onMouseMove: (e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', `${(x - 0.5) * 14}deg`);
        el.style.setProperty('--rx', `${(0.5 - y) * 14}deg`);
        el.style.setProperty('--gx', `${x * 100}%`);
        el.style.setProperty('--gy', `${y * 100}%`);
    },
    onMouseLeave: (e) => {
        ['--rx', '--ry'].forEach((v) => e.currentTarget.style.setProperty(v, '0deg'));
    },
};
