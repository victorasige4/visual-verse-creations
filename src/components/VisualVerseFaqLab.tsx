import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { KeyboardEvent } from "react";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Asterisk, Check, CircleHelp,
  Mail, MousePointer2, MoveUpRight, Shuffle, Sparkles, WandSparkles
} from "lucide-react";
import "../faq-question-lab.css";

/**
 * The Question Lab is a playful, original Visual Verse FAQ experience:
 * a wall of clickable question-notes feeding a kinetic answer-printing desk.
 * Every answer is present in the underlying source data and available without
 * timers, dragging or hover-only interaction.
 */
const questions = [
  {
    card: "What's in your creative toolkit?",
    category: "THE CREATIVE MENU",
    question: "What services does Visual Verse offer?",
    answer: "We bring together photography, videography, branding, graphic design, web and UI/UX design, and social media and digital marketing. We can focus on one service or combine disciplines around a broader creative brief.",
    takeaway: "One studio. Many ways to tell your story.",
    symbol: "✳",
  },
  {
    card: "Beyond Nairobi?",
    category: "WHERE WE CREATE",
    question: "Do you work with clients outside Nairobi?",
    answer: "Yes. We can collaborate remotely with clients across Kenya. For photography, videography and other work that requires an on-site presence, travel and scheduling are discussed during project planning.",
    takeaway: "Nairobi is home. Creativity travels.",
    symbol: "↗",
  },
  {
    card: "I have an idea. Now what?",
    category: "THE FIRST HELLO",
    question: "How do we start a project?",
    answer: "Share what you are building, the outcome you need, your timeline and any reference material. We can then clarify the scope, creative direction and next steps before confirming the project.",
    takeaway: "Start with an idea. We'll shape the next step.",
    symbol: "✦",
  },
  {
    card: "Let's talk numbers.",
    category: "THE INVESTMENT",
    question: "How is a project priced?",
    answer: "Every quote depends on the deliverables, scope, complexity, usage needs and turnaround time. We prepare an appropriate quotation after discussing your requirements; there is no universal price for every project.",
    takeaway: "Made for your brief, not a one-size-fits-all price.",
    symbol: "◈",
  },
  {
    card: "Already got a brand?",
    category: "BUILDING ON WHAT EXISTS",
    question: "Can you work with an existing logo or brand identity?",
    answer: "Absolutely. We can work within your current guidelines, refresh selected elements or discuss a complete identity project if that is what your brand needs.",
    takeaway: "Your identity, thoughtfully taken further.",
    symbol: "✣",
  },
  {
    card: "How soon can we make magic?",
    category: "THE TIMELINE",
    question: "How long does a project usually take?",
    answer: "Timelines vary depending on the service, complexity, feedback rounds and assets required. We agree on realistic milestones before production begins.",
    takeaway: "Clear milestones. Room for great work.",
    symbol: "⌁",
  },
  {
    card: "Can I get involved?",
    category: "MADE TOGETHER",
    question: "Will I be involved in the creative process?",
    answer: "Yes. We begin by understanding your brief and include feedback points throughout the project so the final work reflects your vision and the agreed creative direction.",
    takeaway: "The best ideas happen together.",
    symbol: "♡",
  },
];

const CONTACT_EMAIL = "hello@visualverse.com";
const focusableSelector = ".vv-faq-lab-note";

export function VisualVerseFaqLab() {
  const [selected, setSelected] = useState(0);
  const [shuffleCount, setShuffleCount] = useState(0);
  const noteBoardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const current = questions[selected];

  const choose = (index: number) => {
    setSelected(index);
  };
  const surprise = () => {
    setSelected((previous) => {
      // A random card, guaranteed to be different from the one now showing.
      const jump = 1 + Math.floor(Math.random() * (questions.length - 1));
      return (previous + jump) % questions.length;
    });
    setShuffleCount((n) => n + 1);
  };
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const direction =
      event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 :
      event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    const next = (index + direction + questions.length) % questions.length;
    choose(next);
    noteBoardRef.current?.querySelectorAll<HTMLButtonElement>(focusableSelector)[next]?.focus();
  };

  return (
    <section className="vv-faq-lab" aria-labelledby="vv-faq-lab-heading">
      <header className="vv-faq-lab-header">
        <div className="vv-faq-lab-header-copy">
          <span className="vv-faq-lab-eyebrow"><span aria-hidden="true" className="vv-faq-lab-blink"/> THE QUESTION LAB · VISUAL VERSE</span>
          <h2 id="vv-faq-lab-heading">Curious?<br/><em>We love that.</em><span className="vv-faq-lab-header-asterisk" aria-hidden="true">✳</span></h2>
        </div>
        <div className="vv-faq-lab-intro">
          <p>Every great collaboration starts with a good question. Pick one from the board and see what we have to say — or let curiosity choose for you.</p>
          <button type="button" onClick={surprise} className="vv-faq-lab-surprise" data-cursor="TRY ME">
            <motion.span key={shuffleCount} initial={false} animate={reduced ? {} : {rotate: shuffleCount * 110}} transition={{type:"spring",stiffness:170,damping:15}}>
              <Shuffle size={17} aria-hidden="true"/>
            </motion.span>
            Surprise me
            <ArrowUpRight size={16} aria-hidden="true"/>
          </button>
        </div>
      </header>

      <div className="vv-faq-lab-experience">
        <div className="vv-faq-lab-wall" ref={noteBoardRef}>
          <div className="vv-faq-lab-wall-top"><span><Asterisk size={16} aria-hidden="true"/> THE CURIOSITY WALL</span><span>GO AHEAD. PICK ONE.</span></div>
          <div className="vv-faq-lab-ambient" aria-hidden="true">
            <span className="vv-faq-lab-ambient-ring"/><span className="vv-faq-lab-ambient-ring second"/>
            <span className="vv-faq-lab-ambient-center">?</span>
            <span className="vv-faq-lab-ambient-scribble">↝</span>
          </div>
          <div className="vv-faq-lab-note-grid" role="group" aria-label="Frequently asked questions">
            {questions.map((item,index) => (
              <button type="button"
                className={"vv-faq-lab-note vv-faq-lab-note-"+index+(selected===index?" is-selected":"")}
                key={item.question}
                aria-label={item.question}
                aria-pressed={selected===index}
                onClick={()=>choose(index)}
                onKeyDown={(event)=>navigate(event,index)}
                data-cursor="ASK"
              >
                <span className="vv-faq-lab-note-pin" aria-hidden="true"/>
                <span className="vv-faq-lab-note-label">{item.category}</span>
                <span className="vv-faq-lab-note-text">{item.card}</span>
                <span className="vv-faq-lab-note-mark" aria-hidden="true">{selected===index?<Check size={15}/>:item.symbol}</span>
              </button>
            ))}
          </div>
          <div className="vv-faq-lab-wall-bottom">
            <span><MousePointer2 size={15} aria-hidden="true"/> YOUR QUESTIONS. OUR WORLD.</span>
            <span className="vv-faq-lab-wall-star" aria-hidden="true">✦ ✳ ✦</span>
          </div>
        </div>

        <div className="vv-faq-lab-answer-stage">
          <div className="vv-faq-lab-answer-head">
            <span><span className="vv-faq-lab-live-led"/> THE ANSWER STUDIO</span>
            <span className="vv-faq-lab-answer-status">SIGNAL RECEIVED <Sparkles size={14} aria-hidden="true"/></span>
          </div>
          <div className="vv-faq-lab-answer-orbit" aria-hidden="true"><i/><i/><i/></div>

          <div className="vv-faq-lab-answer-paper">
            <div className="vv-faq-lab-paper-top">
              <img src={import.meta.env.BASE_URL+"logo-mark.png"} alt="" aria-hidden="true" loading="lazy"/>
              <span>A NOTE FROM OUR STUDIO</span>
              <span aria-hidden="true">✳</span>
            </div>
            <div className="vv-faq-lab-perforation" aria-hidden="true"/>
            <div className="vv-faq-lab-answer-content" role="region" aria-label="Selected FAQ answer" aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={selected}
                  initial={reduced?false:{opacity:0,y:24,rotate:-2,filter:"blur(5px)"}}
                  animate={{opacity:1,y:0,rotate:0,filter:"blur(0px)"}}
                  exit={reduced?{opacity:0}:{opacity:0,y:-20,rotate:2,filter:"blur(5px)"}}
                  transition={{duration:reduced?.01:.37,ease:[.22,1,.36,1]}}
                  className="vv-faq-lab-answer-copy">
                  <div className="vv-faq-lab-question-meta"><span>YOU ASKED</span><CircleHelp size={16} aria-hidden="true"/></div>
                  <h3>{current.question}</h3>
                  <div className="vv-faq-lab-answer-divider"><span/> THE SHORT ANSWER <span/></div>
                  <p>{current.answer}</p>
                  <div className="vv-faq-lab-answer-takeaway"><WandSparkles size={18} aria-hidden="true"/><strong>{current.takeaway}</strong></div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="vv-faq-lab-paper-footer"><span>WITH CARE, VISUAL VERSE</span><span>✳</span></div>
          </div>

          <div className="vv-faq-lab-control-bar">
            <div><span>GOOD QUESTION?</span><strong>THERE'S ALWAYS MORE.</strong></div>
            <div className="vv-faq-lab-navigation" role="group" aria-label="Browse FAQ answers">
              <button type="button" onClick={()=>choose((selected-1+questions.length)%questions.length)} aria-label="Previous question" data-cursor="PREV"><ArrowLeft size={18}/></button>
              <button type="button" onClick={()=>choose((selected+1)%questions.length)} aria-label="Next question" data-cursor="NEXT"><ArrowRight size={18}/></button>
            </div>
          </div>
        </div>
      </div>

      <footer className="vv-faq-lab-footer">
        <div className="vv-faq-lab-footer-note"><span className="vv-faq-lab-footer-icon"><MoveUpRight size={19}/></span><div><strong>Still wondering about something?</strong><p>Some things are better talked through. Tell us what's on your mind.</p></div></div>
        <div className="vv-faq-lab-footer-actions">
          <a href={"mailto:"+CONTACT_EMAIL+"?subject=Question%20for%20Visual%20Verse"} className="vv-faq-lab-email"><Mail size={16}/> Email a question</a>
          <a href="/contact.html" className="vv-faq-lab-ask" data-cursor="LET'S TALK">Ask us anything <ArrowUpRight size={17}/></a>
        </div>
      </footer>
    </section>
  );
}
