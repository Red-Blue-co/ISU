import React, { useState } from 'react';
import { useReveal } from './homeHooks';
import { Link } from 'react-router-dom';
import LightWall from '../components/LightWall';
import { WHATSAPP_COMMUNITY } from '../links';
import { Plane, House, BookOpen, Briefcase, HeartPulse, PartyPopper, Plus, ArrowUpRight, ArrowRight } from 'lucide-react';

const Reveal = ({ as: Tag = 'section', className = '', children, ...rest }) => {
    const ref = useReveal();
    return <Tag ref={ref} className={`reveal ${className}`} {...rest}>{children}</Tag>;
};

/* ---------- a big ribbon of everything we help with ---------- */
const RIBBON = ['Housing', 'Visas', 'Study groups', 'Jobs', 'Friends', 'Food', 'Football', 'Paperwork', 'Language swaps', 'Exams'];

export const Ribbon = () => (
    <div className="ribbon" aria-hidden="true">
        <div className="ribbon-track">
            {[...RIBBON, ...RIBBON].map((w, i) => (
                <span key={i} className={i % 2 ? 'outline' : ''}>{w}</span>
            ))}
        </div>
    </div>
);

/* ---------- where to start: topics with the questions people really ask ---------- */
const TOPICS = [
    { icon: Plane, title: 'Arriving', qs: ['Registering your address', 'Residence permit steps', 'Your first week checklist'] },
    { icon: House, title: 'Housing', qs: ['Rooms and flatmates', 'Reading a rental contract', 'Deposits and your rights'] },
    { icon: BookOpen, title: 'Studying', qs: ['Study groups by course', 'Notes and past exams', 'Thesis and writing help'] },
    { icon: Briefcase, title: 'Work', qs: ['Student jobs and hours', 'CV and interview practice', 'Internships from alumni'] },
    { icon: HeartPulse, title: 'Wellbeing', qs: ['Health insurance basics', 'Finding a doctor', 'Someone to talk to'] },
    { icon: PartyPopper, title: 'Social', qs: ['Events every week', 'Clubs and sports', 'Language exchange'] },
];

export const Topics = () => (
    <Reveal className="topics" id="topics">
        <div className="sec-head">
            <h2>Where to start.</h2>
            <p>Whatever you are dealing with, someone here has already figured it out.</p>
        </div>
        <div className="topics-grid">
            {TOPICS.map(({ icon: Icon, title, qs }) => (
                <a href="#faq" className="topic" key={title}>
                    <Icon size={26} strokeWidth={1.6} />
                    <h3>{title}</h3>
                    <ul>{qs.map((q) => <li key={q}>{q}</li>)}</ul>
                    <ArrowUpRight className="topic-arrow" size={20} />
                </a>
            ))}
        </div>
    </Reveal>
);

/* ---------- upcoming events (dates are counted from today so the list never looks stale) ---------- */
const EVENTS = [
    { in: 4, title: 'Welcome walk through the old town', where: 'Main library steps · 17:00', kind: 'Social' },
    { in: 9, title: 'CV and LinkedIn clinic', where: 'Room 2.14 · 18:30', kind: 'Career' },
    { in: 13, title: 'International food evening', where: 'Student kitchen, Block C · 19:00', kind: 'Food' },
    { in: 20, title: 'Exam prep marathon', where: 'Library, 3rd floor · 10:00 to 20:00', kind: 'Study' },
];

const dateIn = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return { day: d.getDate(), mon: d.toLocaleString('en', { month: 'short' }), wk: d.toLocaleString('en', { weekday: 'long' }) };
};

export const Events = () => (
    <Reveal className="events" id="events">
        <div className="sec-head row">
            <h2>Coming up.</h2>
            <Link to="/login" state={{ mode: 'signup' }} className="home-btn">All events <ArrowRight size={16} /></Link>
        </div>
        <ul className="events-list">
            {EVENTS.map((e) => {
                const d = dateIn(e.in);
                return (
                    <li key={e.title}>
                        <Link to="/login" state={{ mode: 'signup' }} className="event">
                            <span className="event-date"><b>{d.day}</b>{d.mon}</span>
                            <span className="event-main">
                                <b>{e.title}</b>
                                <span>{d.wk} · {e.where}</span>
                            </span>
                            <span className="event-kind">{e.kind}</span>
                            <span className="event-go"><ArrowRight size={18} /></span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    </Reveal>
);

/* ---------- run by students: the roles that keep ISU going ---------- */
const ROLES = [
    { title: 'Welcome team', text: 'Meet newcomers, run first-week walks, answer the first questions.', seats: 3 },
    { title: 'Events crew', text: 'Plan the nights, the trips and the food evenings. Bring friends.', seats: 4 },
    { title: 'Study circle leads', text: 'Host a weekly group for your course. Snacks are on us.', seats: 6 },
    { title: 'Design and web', text: 'Work on this site and everything ISU puts out. Real users, real feedback.', seats: 2 },
    { title: 'Socials and photos', text: 'Tell our story. Cameras and phones both welcome.', seats: 2 },
];

export const Crew = () => (
    <Reveal className="crew">
        <div className="sec-head">
            <h2>Everything here is run by students.<br /><span>There is a seat for you.</span></h2>
        </div>
        <div className="crew-grid">
            {ROLES.map((r) => (
                <div className="crew-role" key={r.title}>
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                    <div className="crew-seats">
                        <span className="crew-dots">
                            {Array.from({ length: r.seats }, (_, i) => <i key={i} />)}
                        </span>
                        {r.seats} open {r.seats === 1 ? 'seat' : 'seats'}
                    </div>
                </div>
            ))}
            <Link to="/login" state={{ mode: 'signup' }} className="crew-role crew-own">
                <Plus size={28} strokeWidth={1.6} />
                <h3>Start your own</h3>
                <p>Got an idea nobody is doing yet? Pitch it and we will help you run it.</p>
            </Link>
        </div>
    </Reveal>
);

/* ---------- student voices (placeholder quotes until we collect real ones) ---------- */
const VOICES = [
    { q: 'I landed on a Sunday with no flat and no idea. By Wednesday I had both, and three friends.', who: 'Ana', what: 'Architecture, Year 1' },
    { q: 'Started by asking one question about my visa. Now I answer them for others.', who: 'Kofi', what: 'Economics, Year 2' },
    { q: 'The study circle got me through statistics. I would not have passed alone.', who: 'Mei', what: 'Psychology, Year 2' },
];

export const Voices = () => (
    <Reveal className="voices">
        {VOICES.map((v) => (
            <figure key={v.who}>
                <blockquote>“{v.q}”</blockquote>
                <figcaption>
                    <span className="voice-avatar">{v.who[0]}</span>
                    <span><b>{v.who}</b>{v.what}</span>
                </figcaption>
            </figure>
        ))}
    </Reveal>
);

/* ---------- FAQ ---------- */
const FAQ = [
    { q: 'Is ISU free?', a: 'Yes. Joining, events and help are free. Some trips share costs, and we always say so up front.' },
    { q: 'Who runs ISU?', a: 'Students. Every role, from the welcome team to this website, is a student volunteering their time.' },
    { q: 'Do I have to be an international student?', a: 'No. ISU is open to every student, from anywhere, on any course and in any year.' },
    { q: 'Can I start my own event or group?', a: 'Please do. Tell us the idea, and we will help with a room, the word and the first few people.' },
    { q: 'I am shy. Is it awkward to come alone?', a: 'Most people come alone the first time. The welcome team will say hi and introduce you around.' },
];

export const Faq = () => {
    const [open, setOpen] = useState(0);
    return (
        <Reveal className="faq" id="faq">
            <div className="sec-head">
                <h2>Questions.</h2>
                <p>Still unsure? Ask us anything once you join, a real student will answer.</p>
            </div>
            <div className="faq-list">
                {FAQ.map((f, i) => (
                    <div className={`faq-item ${open === i ? 'open' : ''}`} key={f.q}>
                        <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                            {f.q}
                            <Plus size={20} className="faq-icon" />
                        </button>
                        <div className="faq-answer"><div><p>{f.a}</p></div></div>
                    </div>
                ))}
            </div>
        </Reveal>
    );
};

/* ---------- footer with a giant wordmark ---------- */
export const Footer = () => (
    <footer className="home-foot">
        <div className="foot-cols">
            <div>
                <h4>Community</h4>
                <a href="/#events">Events</a>
                <a href="/#topics">Where to start</a>
                <a href={WHATSAPP_COMMUNITY} target="_blank" rel="noopener noreferrer">Join</a>
            </div>
            <div>
                <h4>Help</h4>
                <a href="/#faq">Questions</a>
                <Link to="/login">Sign in</Link>
            </div>
            <div>
                <h4>ISU</h4>
                <Link to="/about">About</Link>
                <Link to="/login" state={{ mode: 'signup' }}>Volunteer</Link>
            </div>
        </div>
        <LightWall />
        <div className="foot-base">
            <span>© {new Date().getFullYear()} ISU · Website by <a href="https://sherin.fun" rel="author">Sherin Varghese</a></span>
            <span>Made by students, for students.</span>
        </div>
    </footer>
);
