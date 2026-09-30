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
          <h2 className="about-app-title">Jr_AstroCamp</h2>
          <p style={{ fontSize:'0.8rem', color:'#7c3aed', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'20px' }}>
            Fly · Learn · Explore
          </p>
          <p className="about-story">
            We're six problem-solvers who believe space education shouldn't feel like a textbook you're forced to finish.
            We're an AI automation engineer, a data scientist, an ML engineer, a full-stack developer, a researcher, and a UI/UX designer —
            brought together by one shared memory: <strong style={{ color:'#e2e8f0' }}>looking up at the night sky and wondering what it would take to get up there.</strong>
          </p>
        </div>

        {/* Body */}
        <div className="about-body">

          {/* The Problem */}
          <div>
            <div className="about-section-title">The Challenge: Turn Curious Kids into Mission-Ready Thinkers</div>
            <p style={{ fontSize:'0.88rem', color:'#94a3b8', lineHeight:1.8 }}>
              In a universe where the next generation of astronauts is sitting in classrooms right now, Jr_AstroCamp is Team Mysterio's answer to a question every space agency eventually asks: <strong style={{ color:'#e2e8f0' }}>how do you turn a curious kid into a mission-ready thinker?</strong>
            </p>
            <p style={{ fontSize:'0.88rem', color:'#94a3b8', lineHeight:1.8, marginTop:'10px' }}>
              Most STEM platforms either oversimplify the science into cartoons or bury it in technical jargon. Worse, most tools deliver everything in a single format, quietly leaving most students behind without a safe way to fail, learn, and retry.
            </p>
          </div>

          {/* What We Built */}
          <div>
            <div className="about-section-title">What We Built</div>
            <p style={{ fontSize:'0.88rem', color:'#94a3b8', lineHeight:1.8, marginBottom:'12px' }}>
              So we built <strong style={{ color:'#c4b5fd' }}>Jr_AstroCamp</strong>, an ed-tech learning platform where students
              don't just read about real NASA missions — they fly them. At its heart is a 60 FPS flight simulator featuring{' '}
              <strong style={{ color:'#38bdf8' }}>76 real, historical NASA missions</strong> across 6 flight disciplines (Launch, Docking, Lander, Rover, Telescope, Deep Space),
              plus an Outpost command simulator.
            </p>
            <p style={{ fontSize:'0.88rem', color:'#94a3b8', lineHeight:1.8 }}>
              Around every mission sits our multi-format Learning Layer: interactive mini-games, handwritten-style notebooks,
              comics, audio lessons, and archival NASA reels — four doors into the same concept so every student succeeds.
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
            <div className="about-motto">Fly. Learn. Explore.</div>
            <p className="about-motto-sub">
              🚀 Jr_AstroCamp · Team Mysterio · NASA International Space Apps Challenge 2026
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
