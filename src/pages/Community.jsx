import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useReveal } from './homeHooks';
import { WHATSAPP_COMMUNITY } from '../links';
import { Events, Footer } from './HomeSections';
import './Home.css';
import './Community.css';

const GROUPS = [
    { title: 'Newcomers', text: 'Just arrived? Start here. Paperwork, first-week questions and people in the same boat.' },
    { title: 'Housing', text: 'Rooms, flatmates, sublets and help reading a rental contract.' },
    { title: 'Study circles', text: 'Weekly groups by course. Notes, past exams and someone to revise with.' },
    { title: 'Jobs and internships', text: 'Student jobs, CV checks, interview practice and leads from alumni.' },
    { title: 'Sports and outdoors', text: 'Football, running, hikes and anyone up for a game this weekend.' },
    { title: 'Food and culture', text: 'Cook-offs, festivals and finding a taste of home in the city.' },
    { title: 'Language exchange', text: 'Swap an hour of your language for an hour of theirs.' },
    { title: 'Wellbeing', text: 'Health insurance, finding a doctor, and someone to talk to.' },
];

// Example posts, the kind of thing students share on the board
const BOARD = [
    { tag: 'Ask', text: 'Just arrived. How do I register my address?', meta: '4 replies' },
    { tag: 'Offer', text: 'I can proofread your CV in English or German.', meta: '3rd year, Business' },
    { tag: 'Event', text: 'Sunday football in the park. All levels welcome.', meta: '14 going' },
    { tag: 'Ask', text: 'Anyone have the notes from Statistics week 4?', meta: '3 replies' },
    { tag: 'Offer', text: 'Free desk lamp and kettle. Moving out Friday.', meta: 'Claimed' },
    { tag: 'Ask', text: 'Looking for a flatmate near campus from March.', meta: '2 replies' },
];

const RULES = [
    { title: 'Be kind.', text: 'Everyone was new once. Answer the way you would have wanted to be answered.' },
    { title: 'Help where you can.', text: 'A link, a tip or ten minutes of your time is enough.' },
    { title: 'No selling or spam.', text: 'Giving things away is welcome. Ads, promotions and chain messages are not.' },
    { title: 'Keep it safe.', text: 'Never post IDs, bank details or anyone else’s private information.' },
    { title: 'Tell an admin.', text: 'If something feels wrong, message the team and we will sort it out.' },
];

const Community = () => {
    const groupsRef = useReveal();
    const boardRef = useReveal();
    const rulesRef = useReveal();

    return (
        <div className="home community">
            {/* ---------- intro ---------- */}
            <header className="cm-hero">
                <h1>Find your people.<br /><span>They are already here.</span></h1>
                <div className="cm-hero-side">
                    <p>
                        Groups for every part of student life, a board where people ask and offer,
                        and events every week. All run by students.
                    </p>
                    <a href={WHATSAPP_COMMUNITY} target="_blank" rel="noopener noreferrer" className="home-btn primary">
                        Join the community <ArrowUpRight size={16} />
                    </a>
                </div>
            </header>

            {/* ---------- groups ---------- */}
            <section className="cm-groups reveal" ref={groupsRef}>
                <div className="sec-head">
                    <h2>Groups.</h2>
                    <p>All our groups live in the ISU community on WhatsApp. Join it once, then pick as many as you like.</p>
                </div>
                <div className="cm-groups-grid">
                    {GROUPS.map((g) => (
                        <a href={WHATSAPP_COMMUNITY} target="_blank" rel="noopener noreferrer" className="cm-group" key={g.title}>
                            <h3>{g.title}</h3>
                            <p>{g.text}</p>
                            <span className="cm-join">Join on WhatsApp <ArrowUpRight size={16} /></span>
                        </a>
                    ))}
                </div>
            </section>

            {/* ---------- the board ---------- */}
            <section className="cm-board reveal" ref={boardRef}>
                <div className="sec-head row">
                    <div>
                        <h2>The board.</h2>
                        <p>Ask for help, offer what you know, or find something to do tonight.</p>
                    </div>
                    <a href={WHATSAPP_COMMUNITY} target="_blank" rel="noopener noreferrer" className="home-btn">Post something <ArrowUpRight size={16} /></a>
                </div>
                <div className="cm-board-grid">
                    {BOARD.map((b) => (
                        <div className={`cm-post tag-${b.tag.toLowerCase()}`} key={b.text}>
                            <span className="cm-tag">{b.tag}</span>
                            <p>{b.text}</p>
                            <span className="cm-meta">{b.meta}</span>
                        </div>
                    ))}
                </div>
            </section>

            <Events />

            {/* ---------- house rules ---------- */}
            <section className="cm-rules reveal" ref={rulesRef}>
                <h2>House rules.</h2>
                <ol>
                    {RULES.map((r, i) => (
                        <li key={r.title}>
                            <span className="cm-n">{i + 1}</span>
                            <div>
                                <h3>{r.title}</h3>
                                <p>{r.text}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <Footer />
        </div>
    );
};

export default Community;
