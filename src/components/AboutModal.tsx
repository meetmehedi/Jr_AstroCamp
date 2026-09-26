import React from 'react';
import { X } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TEAM_MEMBERS = [
  { emoji: '🤖', role: 'AI Automation Engineer', desc: 'Keeps everything running smoothly behind the scenes' },
  { emoji: '📊', role: 'Data Scientist', desc: 'Turns NASA datasets into dynamic, realistic mission challenges' },
  { emoji: '🧠', role: 'ML Engineer', desc: 'Powers adaptive difficulty and intelligent student feedback' },
  { emoji: '💻', role: 'Developer', desc: 'Brings the full Astro Camp vision to life in code' },
  { emoji: '🔭', role: 'Researcher', desc: 'Keeps the science accurate and grounded in real NASA data' },
  { emoji: '🎨', role: 'UI/UX Designer', desc: 'Makes it as fun to look at as it is to learn from' },
];

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="about-modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Hero Banner */}
        <div className="about-hero-banner">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', marginBottom:'12px' }}>
            <button
              onClick={onClose}
              style={{ background:'transparent', border:'none', color:'#64748b', cursor:'pointer', padding:'4px', borderRadius:'6px', display:'flex', alignItems:'center' }}
              aria-label="Close About"
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ fontSize:'2.5rem', marginBottom:'12px' }}>🚀</div>
          <div className="about-team-name">Team Mysterio · NASA Space Apps Challenge 2026</div>
          <h2 className="about-app-title">Astro Camp</h2>
          <p style={{ fontSize:'0.8rem', color:'#7c3aed', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'20px' }}>
            Junior Astronaut Mission Trainer
          </p>
          <p className="about-story">
            We're six problem-solvers who believe space education shouldn't feel like a textbook you're forced to finish.
            We're an AI automation engineer, a data scientist, an ML engineer, a developer, a researcher, and a UI/UX designer —
            brought together by one idea: <strong style={{ color:'#e2e8f0' }}>kids learn best when they're having fun, and every kid learns differently.</strong>
          </p>
        </div>

        {/* Body */}
        <div className="about-body">

          {/* The Problem */}
          <div>
            <div className="about-section-title">The Problem We Set Out to Solve</div>
            <p style={{ fontSize:'0.88rem', color:'#94a3b8', lineHeight:1.8 }}>
              Space STEM content usually fails in one of two ways. It's either so oversimplified that it hides the real
              engineering trade-offs, or so complex that young learners tune out. And even when it's done well, it's
              often delivered in just one format. But some students learn by playing, some by reading a comic, some by
              listening, and some by scribbling their own notes. We wanted to build something for all of them.
            </p>
          </div>

          {/* What We Built */}
          <div>
            <div className="about-section-title">What We Built</div>
            <p style={{ fontSize:'0.88rem', color:'#94a3b8', lineHeight:1.8, marginBottom:'12px' }}>
              So we built <strong style={{ color:'#c4b5fd' }}>Astro Camp</strong>, an edtech learning platform where young
              explorers train to become astronauts. At its heart is our{' '}
              <strong style={{ color:'#38bdf8' }}>Junior Astronaut Mission Trainer</strong> — a game where students run their
              own lunar or Martian outpost, balancing life support, radiation shielding, power, and food production, and feel
              the consequences of every decision.
            </p>
            <p style={{ fontSize:'0.88rem', color:'#94a3b8', lineHeight:1.8 }}>
              Around it, Astro Camp offers interactive games, handwritten-style notebooks, comic books, audio lessons,
              and videos — all built on real NASA data — so students can dive into the same ideas in whichever way
              clicks for them.
            </p>
          </div>

          {/* The Team */}
          <div>
            <div className="about-section-title">The Team</div>
            <div className="about-team-grid">
              {TEAM_MEMBERS.map((m) => (
                <div key={m.role} className="about-member-card">
                  <span className="about-member-emoji">{m.emoji}</span>
                  <div className="about-member-role">{m.role}</div>
                  <p className="about-member-desc">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Mysterio */}
          <div>
            <div className="about-section-title">Why "Mysterio"?</div>
            <p style={{ fontSize:'0.88rem', color:'#94a3b8', lineHeight:1.8 }}>
              None of us started out as mission planners, but we all remember what it felt like to look up at the sky
              and wonder. <strong style={{ color:'#e2e8f0' }}>Mysterio isn't just a name.</strong> Space has always been a
              mystery, and we're here to make it something anyone can explore, question, and solve.
            </p>
          </div>

          {/* Motto */}
          <div className="about-motto-box">
            <div className="about-motto">One Team. One Sky. Infinite Possibilities.</div>
            <p className="about-motto-sub">
              🌕 Outpost Command · Astro Camp · Team Mysterio · NASA Space Apps Challenge 2026
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
