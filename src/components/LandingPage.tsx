import React, { useEffect, useRef, useState } from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

// ── Starfield Canvas ──────────────────────────────────────────────────────────
const StarfieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const stars: { x: number; y: number; r: number; opacity: number; speed: number; phase: number }[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars.length = 0;
      const count = Math.floor((canvas.width * canvas.height) / 5000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.2,
          opacity: Math.random() * 0.7 + 0.2,
          speed: Math.random() * 0.004 + 0.001,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const alpha = s.opacity * (0.5 + 0.5 * Math.sin(t * s.speed * 1000 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };

    init();
    animId = requestAnimationFrame(draw);
    const onResize = () => init();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="landing-starfield" />;
};

// ── Data ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '🎮',
    title: 'Junior Astronaut Mission Trainer',
    desc: 'Run your own lunar or Martian outpost. Balance life support, radiation shielding, power, and food — and feel the consequences of every decision across 30 Sols.',
  },
  {
    icon: '📚',
    title: 'Multi-Format Learning',
    desc: 'Some students learn by playing, some by reading a comic, some by listening, and some by scribbling notes. Astro Camp is built for all of them.',
  },
  {
    icon: '🛰️',
    title: 'Real NASA Science',
    desc: 'Every simulation constant, environmental hazard, and engineering trade-off is derived from real NASA technical reports and open telemetry datasets.',
  },
];

const STEPS = [
  { emoji: '🌍', title: 'Choose Your Mission', desc: 'Pick from 10 real NASA missions — Moon, Mars, Europa, Titan, and beyond.', color: '#a78bfa' },
  { emoji: '🏗️', title: 'Build Your Outpost', desc: 'Set up your habitat, power station, greenhouse, and storm vault on alien terrain.', color: '#38bdf8' },
  { emoji: '⚡', title: 'Make Hard Decisions', desc: 'Crisis events hit every Sol. Your choices cascade — one wrong call can end the mission.', color: '#43ffa0' },
  { emoji: '🔬', title: 'Learn the Science', desc: 'After every decision, unlock real STEM flashcards, comics, and audio lessons grounded in NASA data.', color: '#f59e0b' },
];

const FORMATS = [
  { icon: '🎮', name: 'Mission Simulator', label: 'Interactive decision-making game with real engineering trade-offs' },
  { icon: '📖', name: 'Comic Book', label: 'Cinematic story panels with voice dialogue for every crisis event' },
  { icon: '🔊', name: 'Audio Lessons', label: 'Text-to-speech science cards adapted for every age group' },
  { icon: '📓', name: 'Mission Notebook', label: 'Handwritten-style journal that collects your discoveries' },
  { icon: '🛰️', name: 'Mission Briefings', label: 'Full audio briefings for every NASA mission destination' },
];

const TEAM = [
  { emoji: '🤖', role: 'AI Automation Engineer', desc: 'Keeps the platform running smoothly behind the scenes' },
  { emoji: '📊', role: 'Data Scientist', desc: 'Turns NASA datasets into dynamic, realistic challenges' },
  { emoji: '🧠', role: 'ML Engineer', desc: 'Powers adaptive difficulty and intelligent feedback' },
  { emoji: '💻', role: 'Developer', desc: 'Brings the full vision to life in code' },
  { emoji: '🔭', role: 'Researcher', desc: 'Keeps the science accurate and true to NASA data' },
  { emoji: '🎨', role: 'UI/UX Designer', desc: 'Makes it as fun as it is clear to navigate' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [warping, setWarping] = useState(false);

  const handleEnter = () => {
    setWarping(true);
    setTimeout(onEnter, 1050);
  };

  return (
    <div className="landing-root" id="astro-camp-landing">
      <StarfieldCanvas />

      {warping && <div className="landing-warp-overlay" />}

      <div className="landing-content">

        {/* HERO */}
        <section className="landing-hero">
          <div className="landing-brand">
            <div className="landing-logo-ring">🚀</div>
            <div>
              <div className="landing-brand-name">Jr_AstroCamp</div>
              <div className="landing-brand-sub">Junior Astronaut Mission Trainer · Team Mysterio · Space Apps 2026</div>
            </div>
          </div>

          <h1 className="landing-hero-headline">
            <span className="hl-white">Train. </span>
            <span className="hl-violet">Explore. </span>
            <span className="hl-cyan">Survive.</span>
          </h1>

          <p className="landing-hero-tagline">
            Space education that doesn't feel like a textbook you're forced to finish.
            Run a real lunar outpost. Make hard engineering decisions. Learn NASA science — your way.
          </p>

          <div className="landing-hero-tags">
            <span className="hero-tag hero-tag-violet">🌕 Moon &amp; Mars</span>
            <span className="hero-tag hero-tag-cyan">🔬 Real NASA Data</span>
            <span className="hero-tag hero-tag-green">🎮 Edtech Game</span>
            <span className="hero-tag hero-tag-amber">🏆 Space Apps 2026</span>
          </div>

          <button
            className="landing-enter-btn"
            onClick={handleEnter}
            id="landing-enter-mission-control"
          >
            🚀&nbsp; Enter Mission Control
          </button>

          <p className="landing-scroll-hint">↓ Scroll to explore the platform</p>
        </section>

        <hr className="landing-divider" />

        {/* WHAT IS ASTRO CAMP */}
        <section className="landing-section">
          <h2 className="landing-section-title">
            One Platform.{' '}
            <span style={{ background: 'linear-gradient(90deg,#a78bfa,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Every Way to Learn.
            </span>
          </h2>
          <p className="landing-section-sub">
            Space STEM content usually fails in one of two ways — it's either too simple or too complex.
            Astro Camp fixes both.
          </p>
          <div className="landing-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="landing-feature-card">
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="landing-divider" />

        {/* HOW IT WORKS */}
        <section className="landing-section">
          <h2 className="landing-section-title">How It Works</h2>
          <p className="landing-section-sub">
            Four steps from launch to learning — each grounded in real mission engineering.
          </p>
          <div className="landing-steps-grid">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="landing-step-card"
                style={{ '--step-color': s.color } as React.CSSProperties}
              >
                <div className="step-number">{i + 1}</div>
                <span className="step-emoji">{s.emoji}</span>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="landing-divider" />

        {/* LEARNING FORMATS */}
        <section className="landing-section">
          <h2 className="landing-section-title">
            Learn In Your{' '}
            <span style={{ background: 'linear-gradient(90deg,#43ffa0,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Own Way
            </span>
          </h2>
          <p className="landing-section-sub">
            Every student has a different learning style. Astro Camp meets all of them.
          </p>
          <div className="landing-formats-grid">
            {FORMATS.map((f) => (
              <div key={f.name} className="learning-format-card">
                <span className="format-icon">{f.icon}</span>
                <div className="format-name">{f.name}</div>
                <p className="format-label">{f.label}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="landing-divider" />

        {/* TEAM MYSTERIO */}
        <section className="landing-section">
          <h2 className="landing-section-title">
            Meet{' '}
            <span style={{ background: 'linear-gradient(90deg,#a78bfa,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Team Mysterio
            </span>
          </h2>
          <p className="landing-section-sub">
            Six problem-solvers united by one idea: kids learn best when they're having fun,
            and every kid learns differently.
          </p>
          <div className="landing-team-grid">
            {TEAM.map((m) => (
              <div key={m.role} className="team-card">
                <div className="team-avatar">{m.emoji}</div>
                <div className="team-role">{m.role}</div>
                <p className="team-desc">{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="team-motto-banner">
            <p style={{ fontSize:'0.92rem', color:'#94a3b8', lineHeight:1.8, marginBottom:'20px', fontStyle:'italic' }}>
              "We all remember what it felt like to look up at the sky and wonder.{' '}
              <strong style={{ color:'#e2e8f0' }}>Mysterio</strong> isn't just a name.
              Space has always been a mystery, and we're here to make it something anyone can explore, question, and solve."
            </p>
            <div className="team-motto-text">One Team. One Sky. Infinite Possibilities.</div>
            <p style={{ fontSize:'0.72rem', color:'#64748b', marginTop:'8px', letterSpacing:'0.08em', textTransform:'uppercase' }}>
              NASA Space Apps Challenge 2026
            </p>
          </div>
        </section>

        <hr className="landing-divider" />

        {/* FINAL CTA */}
        <section className="landing-section" style={{ textAlign:'center', paddingBottom:'100px' }}>
          <h2 className="landing-section-title">Ready to Begin?</h2>
          <p className="landing-section-sub">
            Your first Sol on the lunar surface is waiting. Will your outpost survive?
          </p>
          <button
            className="landing-enter-btn"
            onClick={handleEnter}
            id="landing-enter-final"
            style={{ animation:'pulse-glow 2.5s ease-in-out infinite' }}
          >
            🌕&nbsp; Start Your Mission
          </button>
          <p style={{ marginTop:'16px', fontSize:'0.72rem', color:'#475569' }}>
            Built with real NASA data · Free to play · No account required
          </p>
        </section>

      </div>
    </div>
  );
};
