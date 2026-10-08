import React, { useEffect, useRef, useState } from 'react';
import './PolaroidStack.css';

// Unsplash photos (free licence); swap for real ISU photos when we have them
const ph = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&h=700&q=70`;
const PHOTOS = [
    { src: ph('photo-1517486808906-6ca8b3f04846'), caption: 'sunday picnic', alt: 'ISU students having a Sunday picnic together' },
    { src: ph('photo-1758270705317-3ef6142d306f'), caption: 'study night', alt: 'ISU students studying together around a laptop' },
    { src: ph('photo-1549057446-9f5c6ac91a04'), caption: 'first week walk', alt: 'New ISU students on a walk in their first week' },
    { src: ph('photo-1530099486328-e021101a494a'), caption: 'events crew', alt: 'The ISU events crew together' },
    { src: ph('photo-1543269865-cbf427effbad'), caption: 'coffee after class', alt: 'ISU students meeting for coffee after class' },
];

// Where each place in the pile sits: the front photo first, the others fanned out behind it
const SLOTS = [
    { x: 0, y: 0, r: -3 },
    { x: -46, y: -14, r: -13 },
    { x: 44, y: -8, r: 11 },
    { x: -30, y: 26, r: 6 },
    { x: 36, y: 30, r: -8 },
];

// A pile of polaroids in 3D. Every few seconds (or on click) the front photo flies off to the back.
const PolaroidStack = () => {
    const [order, setOrder] = useState(PHOTOS.map((_, i) => i));
    const [leaving, setLeaving] = useState(null);
    const busy = useRef(false);

    const shuffle = () => {
        if (busy.current) return;
        busy.current = true;
        setLeaving(order[0]);
        setTimeout(() => {
            setOrder((o) => [...o.slice(1), o[0]]);
            setLeaving(null);
            setTimeout(() => { busy.current = false; }, 450);
        }, 380);
    };

    // turn over a new photo every few seconds
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const t = setTimeout(shuffle, 4200);
        return () => clearTimeout(t);
    });

    return (
        <div
            className="pstack"
            onClick={shuffle}
            role="button"
            tabIndex={0}
            aria-label="Photos of ISU student life. Press to see the next one."
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); shuffle(); } }}
        >
            <div className="pstack-plane">
                {PHOTOS.map((p, id) => {
                    const depth = order.indexOf(id);
                    const s = SLOTS[depth];
                    return (
                        <figure
                            key={id}
                            className={`polaroid ${leaving === id ? 'leaving' : ''}`}
                            style={{
                                '--x': `${s.x}%`, '--y': `${s.y}%`, '--r': `${s.r}deg`,
                                '--z': `${-depth * 46}px`, '--deal': `${(PHOTOS.length - id) * 0.09}s`,
                                zIndex: leaving === id ? 20 : 10 - depth,
                            }}
                        >
                            <img src={p.src} alt={p.alt} draggable="false" />
                            <figcaption>{p.caption}</figcaption>
                        </figure>
                    );
                })}
            </div>
        </div>
    );
};

export default PolaroidStack;
