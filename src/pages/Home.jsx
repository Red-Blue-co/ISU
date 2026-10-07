import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { WHATSAPP_COMMUNITY } from '../links';
import { useReveal } from './homeHooks';
import PolaroidStack from '../components/PolaroidStack';
import { Ribbon, Topics, Events, Crew, Voices, Faq, Footer } from './HomeSections';
import './Home.css';

// Unsplash photos (free licence); swap for real ISU photos when we have them
const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=70`;

const PILLARS = [
    {
        word: 'HELP',
        text: 'Stuck on paperwork, a course or a flat hunt? Someone here has been through it. Ask, and get a real answer from a real student.',
        img: photo('photo-1758270705317-3ef6142d306f'),
        alt: 'Students gathered around a laptop',
    },
    {
        word: 'MEET',
        text: 'Coffee, game nights, city walks, study sessions. Events planned by students, so new faces become friends.',
        img: photo('photo-1543269865-cbf427effbad'),
        alt: 'A group of friends at a coffee shop',
    },
    {
        word: 'BUILD',
        text: 'Every event, every decision, every line of this site is made by students who said yes. Bring an idea and we will build it with you.',
        img: photo('photo-1530099486328-e021101a494a'),
        alt: 'Students planning together around a table',
    },
];

const STEPS = [
    { n: '01', title: 'Join for free', text: 'Make an account in a minute. No fees, ever. Any course, any year, any country.' },
    { n: '02', title: 'Ask or offer', text: 'Post what you need, or help with what you know. Small help counts.' },
    { n: '03', title: 'Show up', text: 'Come to an event, meet people, and if you like it, help run the next one.' },
];

// Sets --p (0 → 1) on an element as it scrolls through the viewport
const useScrollProgress = () => {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let frame = 0;
        const update = () => {
            frame = 0;
            const r = el.getBoundingClientRect();
            const total = r.height + window.innerHeight;
            const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / total));
            el.style.setProperty('--p', p.toFixed(4));
        };
        const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            cancelAnimationFrame(frame);
        };
    }, []);
    return ref;
};

// A huge word on a plain panel, then a full-width photo slides up over it with one sentence
const Pillar = ({ word, text, img, alt }) => {
    const wordRef = useScrollProgress();
    const photoRef = useScrollProgress();
    return (
        <section className="pillar">
            <div className="pillar-word" ref={wordRef}>
                <div className="pillar-word-sticky">
                    <h2>{word}</h2>
                </div>
            </div>
            <div className="pillar-photo" ref={photoRef}>
                <img src={img} alt={alt} loading="lazy" />
                <p>{text}</p>
            </div>
        </section>
    );
};

const Home = () => {
    const stepsRef = useReveal();

    return (
        <div className="home">
            {/* ---------- hero: headline + a 3D pile of polaroids from student life ---------- */}
            <header className="home-hero">
                <div className="home-hero-text">
                    <h1>
                        By students.<br />
                        <span>For students.</span>
                    </h1>
                    <p>
                        Real people, real help. Housing, studies, friends and weekends,
                        all run by students like you.
                    </p>
                    <div className="home-cta">
                        <a href={WHATSAPP_COMMUNITY} target="_blank" rel="noopener noreferrer" className="home-btn primary">
                            Join ISU <ArrowUpRight size={16} />
                        </a>
                        <a href="#pillars" className="home-btn">What we do <ArrowDown size={16} /></a>
                    </div>
                    <ul className="home-facts">
                        <li><b>100%</b> student-run</li>
                        <li><b>Free</b> to join</li>
                        <li><b>Open</b> to every course</li>
                    </ul>
                </div>

                <div className="home-hero-stack">
                    <PolaroidStack />
                </div>
            </header>

            <Ribbon />

            {/* ---------- pillars ---------- */}
            <div id="pillars">
                {PILLARS.map((p) => <Pillar key={p.word} {...p} />)}
            </div>

            <Topics />
            <Events />
            <Crew />
            <Voices />

            {/* ---------- how it works ---------- */}
            <section className="home-steps reveal" ref={stepsRef}>
                <div className="home-section-head">
                    <h2>Three steps. No gatekeepers.</h2>
                </div>
                <ol>
                    {STEPS.map((s) => (
                        <li key={s.n}>
                            <span className="home-step-n">{Number(s.n)}</span>
                            <h3>{s.title}</h3>
                            <p>{s.text}</p>
                        </li>
                    ))}
                </ol>
            </section>

            <Faq />

            <Footer />
        </div>
    );
};

export default Home;
