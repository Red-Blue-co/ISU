import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './LightWall.css';

// How many students have joined, and the number that would light the whole wall.
// Placeholders until the backend can tell us; nothing here is ever shown as a number.
const MEMBERS = 1;
const FULL_WALL = 2000;

const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

// A wall of little lights. Each student who joins switches one on; the lights that spell ISU go first and burn brightest.
const LightWall = () => {
    const wrap = useRef(null);
    const canvas = useRef(null);

    useEffect(() => {
        const box = wrap.current;
        const cv = canvas.current;
        if (!box || !cv) return;
        const ctx = cv.getContext('2d');
        const layer = document.createElement('canvas');
        const lctx = layer.getContext('2d');
        const fill = Math.min(1, MEMBERS / FULL_WALL);
        box.style.setProperty('--fill', fill.toFixed(3));
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let bulbs = [];
        let W = 0, H = 0, dpr = 1, gap = 14;
        let started = 0, visible = false, raf = 0;
        const mouse = { x: -999, y: -999 };

        const build = () => {
            dpr = Math.min(2, window.devicePixelRatio || 1);
            W = box.clientWidth;
            H = box.clientHeight;
            gap = W < 600 ? 8 : 14;
            [cv, layer].forEach((c) => { c.width = W * dpr; c.height = H * dpr; });
            cv.style.width = `${W}px`;
            cv.style.height = `${H}px`;

            const cols = Math.floor(W / gap), rows = Math.floor(H / gap);
            const ox = (W - (cols - 1) * gap) / 2, oy = (H - (rows - 1) * gap) / 2;

            // draw "ISU" four times finer than the grid, then light a bulb when most of its cell is covered
            const K = 4;
            const m = document.createElement('canvas');
            m.width = cols * K; m.height = rows * K;
            const mc = m.getContext('2d');
            mc.fillStyle = '#fff';
            mc.textAlign = 'center';
            mc.textBaseline = 'middle';
            let size = rows * K * 0.8;
            mc.font = `800 ${size}px Inter, Arial, sans-serif`;
            const tw = mc.measureText('ISU').width;
            if (tw > cols * K * 0.78) { size *= (cols * K * 0.78) / tw; mc.font = `800 ${size}px Inter, Arial, sans-serif`; }
            mc.fillText('ISU', (cols * K) / 2, (rows * K) / 2 + size * 0.05);
            const px = mc.getImageData(0, 0, cols * K, rows * K).data;
            const covered = (c, r) => {
                let sum = 0;
                for (let y = 0; y < K; y++) for (let x = 0; x < K; x++) sum += px[(((r * K + y) * cols * K) + c * K + x) * 4 + 3];
                return sum / (K * K * 255) > 0.45;
            };

            const letters = [], rest = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const b = { x: ox + c * gap, y: oy + r * gap, letter: covered(c, r), on: Infinity, seed: Math.random() * 6.28 };
                    (b.letter ? letters : rest).push(b);
                }
            }
            // switch-on order: the word first, then everyone else at random
            const order = [...shuffle(letters), ...shuffle(rest)];
            // never round a member away, and never show more lights than there are members
            const lit = Math.min(order.length, MEMBERS, Math.max(Math.min(MEMBERS, 1), Math.round(order.length * fill)));
            order.forEach((b, i) => { b.on = i < lit ? i / lit : Infinity; });
            bulbs = order;
        };

        const draw = (t) => {
            raf = 0;
            const now = t / 1000;
            if (!started) started = now;
            // the whole wall takes about three seconds to light up
            const progress = reduce ? 1 : Math.min(1, (now - started) / 3.2);
            const r = gap * 0.24;

            lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            lctx.clearRect(0, 0, W, H);
            for (const b of bulbs) {
                const age = progress - b.on * 0.85;
                let a;
                if (age <= 0) {
                    a = 0;
                } else {
                    const fadeIn = Math.min(1, age / 0.08);
                    const flicker = reduce ? 1 : 0.88 + 0.12 * Math.sin(now * 2.2 + b.seed * 9);
                    // the fuller the wall, the brighter every light burns; at 100% the whole wall glows
                    a = (b.letter ? 1 : 0.42 + 0.53 * fill ** 3) * fadeIn * flicker;
                }
                // lights near the cursor flare up
                const d = Math.hypot(b.x - mouse.x, b.y - mouse.y);
                const near = d < 120 ? (1 - d / 120) : 0;
                if (a > 0) a = Math.min(1, a + near * 0.6);

                if (a > 0) {
                    lctx.fillStyle = b.letter ? `rgba(255, 238, 200, ${a})` : `rgba(255, 210, 130, ${a})`;
                    lctx.beginPath();
                    lctx.arc(b.x, b.y, r * (1 + near * 0.35), 0, 6.283);
                    lctx.fill();
                } else {
                    lctx.fillStyle = `rgba(255, 255, 255, ${0.07 + near * 0.08})`;
                    lctx.beginPath();
                    lctx.arc(b.x, b.y, r * 0.8, 0, 6.283);
                    lctx.fill();
                }
            }

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, cv.width, cv.height);
            // soft glow underneath, then the crisp bulbs on top
            ctx.globalCompositeOperation = 'lighter';
            ctx.filter = `blur(${10 * dpr}px)`;
            ctx.drawImage(layer, 0, 0);
            // a wide halo that only really shows once the wall is nearly full
            ctx.globalAlpha = fill ** 2;
            ctx.filter = `blur(${26 * dpr}px)`;
            ctx.drawImage(layer, 0, 0);
            ctx.globalAlpha = 1;
            ctx.filter = `blur(${3 * dpr}px)`;
            ctx.drawImage(layer, 0, 0);
            ctx.filter = 'none';
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(layer, 0, 0);

            if (visible && !reduce) raf = requestAnimationFrame(draw);
        };

        const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };

        build();
        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting;
            if (visible) { box.classList.add('in'); kick(); }
        }, { threshold: 0.3 });
        io.observe(box);

        const ro = new ResizeObserver(() => { build(); kick(); });
        ro.observe(box);

        const move = (e) => {
            const rect = cv.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            if (reduce) kick();
        };
        const leave = () => { mouse.x = mouse.y = -999; if (reduce) kick(); };
        cv.addEventListener('pointermove', move);
        cv.addEventListener('pointerleave', leave);

        return () => {
            io.disconnect();
            ro.disconnect();
            cancelAnimationFrame(raf);
            cv.removeEventListener('pointermove', move);
            cv.removeEventListener('pointerleave', leave);
        };
    }, []);

    return (
        <section className="lightwall">
            <div className="lightwall-text">
                <h2>Every light is a student.</h2>
                <p>
                    Each one switched on when someone joined ISU.
                    The more of us there are, the brighter this wall gets.
                </p>
                <Link to="/login" state={{ mode: 'signup' }} className="home-btn primary">
                    Add your light <ArrowRight size={16} />
                </Link>
            </div>
            <div className="lightwall-stage">
                <div className="lightwall-board" ref={wrap}>
                    <canvas ref={canvas} aria-hidden="true" />
                </div>
            </div>
        </section>
    );
};

export default LightWall;
