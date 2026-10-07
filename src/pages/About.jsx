import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from './homeHooks';
import { Footer } from './HomeSections';
import './Home.css';
import './About.css';

// Unsplash photos (free licence); swap for real ISU photos when we have them
const ph = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const STRIP = [
    { src: ph('photo-1523240795612-9a054b0db644', 900), alt: 'Three students laughing at a laptop' },
    { src: ph('photo-1549057446-9f5c6ac91a04', 900), alt: 'Friends walking together' },
    { src: ph('photo-1517486808906-6ca8b3f04846', 900), alt: 'Students sitting on a bench outside' },
    { src: ph('photo-1520881363902-a0ff4e722963', 900), alt: 'Three students talking' },
];

const PRINCIPLES = [
    { title: 'Nobody figures it out alone.', text: 'Whatever you are stuck on, someone here has been stuck on it too. Asking is how this place works.' },
    { title: 'Free, always.', text: 'Joining, events and help cost nothing. If a trip shares costs, we say so up front.' },
    { title: 'Run by students.', text: 'Every role, every event and every page of this site is done by students giving their time.' },
    { title: 'Open to everyone.', text: 'Any course, any year, any country, any level of confidence. Come as you are.' },
    { title: 'Small help counts.', text: 'A link, a lamp, a coffee, ten minutes of your time. It adds up to a community.' },
];

const About = () => {
    const whyRef = useReveal();
    const listRef = useReveal();
    const ctaRef = useReveal();

    return (
        <div className="home about">
            {/* ---------- intro ---------- */}
            <header className="about-hero">
                <h1>
                    A community made of<br />
                    <span>the people it helps.</span>
                </h1>
                <p>
                    ISU is a student community, run by students. We help each other settle in,
                    get through our studies, and build a life around them.
                </p>
            </header>

            {/* photos that step up and down like a row of people */}
            <div className="about-strip" aria-hidden="true">
                {STRIP.map((p, i) => (
                    <div className="about-strip-photo" key={p.src} style={{ '--i': i, '--off': i % 2 }}>
                        <img src={p.src} alt={p.alt} />
                    </div>
                ))}
            </div>

            {/* ---------- why ---------- */}
            <section className="about-why reveal" ref={whyRef}>
                <h2>Moving somewhere new to study is exciting. It is also a lot.</h2>
                <div>
                    <p>
                        New city, new language, new forms. A course that moves fast and a calendar
                        that is empty. Most of us have been there, and most of us remember who helped.
                    </p>
                    <p>
                        ISU is that help, organised. A place to ask, a place to offer, and a reason to
                        leave your room on a Thursday night. No staff, no sales, just students looking
                        out for each other.
                    </p>
                </div>
            </section>

            {/* ---------- what we believe ---------- */}
            <section className="about-principles reveal" ref={listRef}>
                <h2>What we believe.</h2>
                <ol>
                    {PRINCIPLES.map((p, i) => (
                        <li key={p.title}>
                            <span className="about-n">{i + 1}</span>
                            <h3>{p.title}</h3>
                            <p>{p.text}</p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* ---------- one big line over a photo ---------- */}
            <section className="about-quote">
                <img src={ph('photo-1758270704524-596810e891b5', 2000)} alt="" />
                <blockquote>
                    By students.<br />For students.<br /><span>That is the whole idea.</span>
                </blockquote>
            </section>

            {/* ---------- get involved ---------- */}
            <section className="about-cta reveal" ref={ctaRef}>
                <h2>Want to help build it?</h2>
                <p>Join as a member, or give an hour a week to one of the teams. Either way, you are part of it.</p>
                <div className="home-cta">
                    <Link to="/login" state={{ mode: 'signup' }} className="home-btn primary">Join ISU <ArrowRight size={16} /></Link>
                    <Link to="/" className="home-btn">See what we do</Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
