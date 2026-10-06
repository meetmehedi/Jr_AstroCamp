import React from 'react';

interface ComicVisualArtworkProps {
  issueNumber: number;
  panelNumber: number;
  sceneType?: string;
  speaker?: string;
  mood?: string;
  viewMode?: 'comic' | 'blueprint';
  sfxText?: string;
}

export const ComicVisualArtwork: React.FC<ComicVisualArtworkProps> = ({
  issueNumber,
  panelNumber,
  sceneType = '',
  viewMode = 'comic',
}) => {
  // Common visual backdrop with comic halftones and starfield
  const renderCommonBackdrop = (skyGrad: string, withStars = true, withSpeedLines = false) => (
    <>
      <defs>
        <pattern id={`dots-${issueNumber}-${panelNumber}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.08)" />
        </pattern>
        <linearGradient id={`sky-${issueNumber}-${panelNumber}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyGrad.split(',')[0] || '#020617'} />
          <stop offset="100%" stopColor={skyGrad.split(',')[1] || '#0f172a'} />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#sky-${issueNumber}-${panelNumber})`} />
      <rect width="100%" height="100%" fill={`url(#dots-${issueNumber}-${panelNumber})`} />
      
      {withStars && (
        <g opacity="0.8">
          <circle cx="35" cy="25" r="1" fill="#fff" />
          <circle cx="85" cy="45" r="1.5" fill="#fef08a" />
          <circle cx="150" cy="18" r="1" fill="#fff" />
          <circle cx="230" cy="35" r="2" fill="#fff" />
          <circle cx="310" cy="20" r="1.2" fill="#93c5fd" />
          <circle cx="380" cy="40" r="1" fill="#fff" />
          <circle cx="460" cy="15" r="1.5" fill="#fef08a" />
          <circle cx="530" cy="30" r="1" fill="#fff" />
          <circle cx="70" cy="85" r="1.2" fill="#fff" />
          <circle cx="280" cy="90" r="1" fill="#93c5fd" />
          <circle cx="490" cy="75" r="1.8" fill="#fff" />
          <circle cx="560" cy="100" r="1" fill="#fef08a" />
        </g>
      )}

      {withSpeedLines && (
        <g stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="12,18">
          <line x1="20" y1="10" x2="160" y2="190" />
          <line x1="80" y1="5" x2="220" y2="195" />
          <line x1="400" y1="5" x2="260" y2="195" />
          <line x1="520" y1="15" x2="380" y2="195" />
        </g>
      )}
    </>
  );

  // Blueprint / Technical Schematics View
  if (viewMode === 'blueprint') {
    return (
      <div className="comic-visual-viewport blueprint-mode">
        <div className="blueprint-grid-overlay" />
        <svg viewBox="0 0 600 240" className="comic-svg-stage">
          <defs>
            <pattern id="bp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="#031525" />
          <rect width="100%" height="100%" fill="url(#bp-grid)" />
          
          {/* Engineering Callouts & Schematics */}
          <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
            <rect x="50" y="30" width="500" height="180" stroke="#0284c7" strokeDasharray="4,4" />
            <circle cx="300" cy="120" r="70" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="300" cy="120" r="5" fill="#38bdf8" />
            <line x1="200" y1="120" x2="400" y2="120" stroke="#38bdf8" strokeDasharray="2,2" />
            <line x1="300" y1="40" x2="300" y2="200" stroke="#38bdf8" strokeDasharray="2,2" />
            
            {/* Thrust Vector */}
            <path d="M 300 120 L 450 70" stroke="#43ffa0" strokeWidth="2.5" markerEnd="url(#arrow)" />
            <text x="460" y="70" fill="#43ffa0" fontSize="11" fontFamily="monospace" fontWeight="bold">VELOCITY VECTOR (v)</text>
            <text x="80" y="65" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold">
              SYS-TELEMETRY: ISSUE #{issueNumber} · PANEL #{panelNumber}
            </text>
            <text x="80" y="85" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              SUBSYSTEM: {sceneType.replace('_', ' ')}
            </text>
            <text x="80" y="105" fill="#38bdf8" fontSize="10" fontFamily="monospace">
              STATUS: NOMINAL ACTIVE SPECIFICATION
            </text>
          </g>
        </svg>
        <div className="comic-visual-badge">📐 NASA TECHNICAL BLUEPRINT SPECIFICATION</div>
      </div>
    );
  }

  // ISSUE 1: FRIENDSHIP 7 (LAUNCH & ORBIT)
  if (issueNumber === 1) {
    if (panelNumber === 1) {
      // Cape Canaveral Pad 14 Atlas Gantry
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#0b1d3a,#1e3a5f', false)}
            {/* Sunny Florida Coastline */}
            <path d="M 0 170 Q 200 150 600 165 L 600 240 L 0 240 Z" fill="#0f766e" />
            <path d="M 350 160 Q 480 145 600 155 L 600 175 L 350 175 Z" fill="#fde047" opacity="0.7" />
            
            {/* Red Launch Tower Truss */}
            <rect x="230" y="30" width="35" height="150" fill="#dc2626" opacity="0.9" />
            <g stroke="#991b1b" strokeWidth="2">
              <line x1="230" y1="30" x2="265" y2="60" />
              <line x1="230" y1="60" x2="265" y2="90" />
              <line x1="230" y1="90" x2="265" y2="120" />
              <line x1="230" y1="120" x2="265" y2="150" />
              <line x1="230" y1="150" x2="265" y2="180" />
            </g>
            {/* Umbilical Swing Arm */}
            <rect x="265" y="65" width="40" height="8" fill="#e2e8f0" />
            
            {/* Atlas Rocket & Mercury Capsule */}
            <g transform="translate(300, 20)">
              {/* Escape Tower */}
              <polygon points="15,0 12,20 18,20" fill="#dc2626" />
              <line x1="15" y1="20" x2="15" y2="45" stroke="#dc2626" strokeWidth="2" />
              {/* Mercury Capsule Friendship 7 */}
              <polygon points="10,45 20,45 24,70 6,70" fill="#1e293b" stroke="#000" strokeWidth="1" />
              <text x="11" y="62" fill="#fbbf24" fontSize="5" fontWeight="bold">7</text>
              {/* Atlas Booster Body (Stainless Steel Balloon Tank) */}
              <rect x="5" y="70" width="20" height="95" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
              <rect x="5" y="85" width="20" height="8" fill="#3b82f6" />
              <text x="6" y="91" fill="#fff" fontSize="5" fontWeight="bold">UNITED</text>
              {/* Rocket Base & Engines */}
              <polygon points="3,165 27,165 24,175 6,175" fill="#475569" />
              {/* Boil-off Oxygen Vapor */}
              <ellipse cx="25" cy="80" rx="14" ry="5" fill="#ffffff" opacity="0.6" />
            </g>

            {/* Launchpad Platform & Trench */}
            <rect x="200" y="180" width="200" height="35" fill="#334155" />
            <rect x="270" y="195" width="60" height="30" fill="#0f172a" />
          </svg>
          <div className="comic-visual-badge">📍 CAPE CANAVERAL · COMPLEX 14 · T-00:00:10</div>
        </div>
      );
    }

    if (panelNumber === 2) {
      // Atlas Engine Liftoff Blast & Exhaust
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#1e1b4b,#0369a1', false, true)}
            
            {/* Giant Billowing Smoke Clouds */}
            <ellipse cx="180" cy="220" rx="130" ry="60" fill="#e2e8f0" opacity="0.9" />
            <ellipse cx="420" cy="220" rx="140" ry="60" fill="#cbd5e1" opacity="0.95" />
            <ellipse cx="300" cy="230" rx="160" ry="70" fill="#f8fafc" />
            
            {/* Massive Fire Exhaust Plume */}
            <polygon points="275,120 325,120 360,230 240,230" fill="#f97316" />
            <polygon points="285,120 315,120 335,210 265,210" fill="#fef08a" />
            <polygon points="295,120 305,120 315,190 285,190" fill="#ffffff" />
            
            {/* Atlas Rocket Rising */}
            <g transform="translate(285, 10)">
              <polygon points="15,0 12,20 18,20" fill="#dc2626" />
              <polygon points="10,25 20,25 24,50 6,50" fill="#0f172a" />
              <rect x="5" y="50" width="20" height="75" fill="#f1f5f9" stroke="#000" strokeWidth="1.5" />
              <line x1="5" y1="70" x2="25" y2="70" stroke="#ef4444" strokeWidth="2" />
            </g>

            {/* Shockwave Rings */}
            <circle cx="300" cy="140" r="60" fill="none" stroke="#fde047" strokeWidth="3" opacity="0.7" />
            <circle cx="300" cy="140" r="100" fill="none" stroke="#fb923c" strokeWidth="2" opacity="0.4" />
          </svg>
          <div className="comic-visual-badge">🔥 ATLAS LV-3B IGNITION · 360,000 LBF THRUST</div>
        </div>
      );
    }

    if (panelNumber === 3) {
      // Friendship 7 in Orbit & Sunset "Fireflies"
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#020617,#0f172a', true)}
            
            {/* Glowing Earth Horizon Limb */}
            <path d="M 0 160 Q 300 130 600 160 L 600 240 L 0 240 Z" fill="#0284c7" />
            <path d="M 0 158 Q 300 128 600 158" stroke="#38bdf8" strokeWidth="6" fill="none" opacity="0.8" />
            <path d="M 0 155 Q 300 125 600 155" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.9" />

            {/* Friendship 7 Capsule in Low Earth Orbit */}
            <g transform="translate(240, 45) rotate(-15)">
              {/* Retro pack at blunt end */}
              <rect x="5" y="70" width="40" height="14" fill="#64748b" rx="2" />
              {/* Heat shield curve */}
              <ellipse cx="25" cy="70" rx="22" ry="6" fill="#475569" />
              {/* Conical Capsule */}
              <polygon points="12,15 38,15 45,70 5,70" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              {/* Window */}
              <rect x="20" y="32" width="10" height="12" fill="#38bdf8" rx="2" />
              <text x="18" y="58" fill="#fbbf24" fontSize="7" fontWeight="bold">NASA</text>
            </g>

            {/* Swirling Luminous "Fireflies" (Glenn's ice crystals) */}
            <g fill="#fef08a" opacity="0.9">
              <circle cx="210" cy="50" r="3" />
              <circle cx="230" cy="75" r="2.5" />
              <circle cx="310" cy="35" r="3" />
              <circle cx="340" cy="65" r="2" />
              <circle cx="320" cy="95" r="3.5" />
              <circle cx="270" cy="110" r="2" />
            </g>
          </svg>
          <div className="comic-visual-badge">🌍 LOW EARTH ORBIT · 162 MILES · GLENN'S FIREFLIES</div>
        </div>
      );
    }

    if (panelNumber === 4) {
      // Segment 51 Sensor Alert Console & Retropack Straps
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#050510,#0f172a', false)}
            
            {/* Retro Console Interface Panel */}
            <rect x="60" y="25" width="480" height="190" fill="#0f172a" stroke="#334155" strokeWidth="3" rx="10" />
            
            {/* Warning Indicator Light */}
            <rect x="90" y="50" width="190" height="45" fill="#f59e0b" rx="6" />
            <text x="105" y="78" fill="#000" fontSize="13" fontFamily="monospace" fontWeight="bold">
              ⚠️ RETROPACK LOOSE?
            </text>

            <rect x="90" y="110" width="190" height="85" fill="#020617" stroke="#1e293b" strokeWidth="1.5" rx="6" />
            <text x="105" y="135" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">HEAT SHIELD: CLAMP ON</text>
            <text x="105" y="155" fill="#38bdf8" fontSize="10" fontFamily="monospace">STATUS: KEEP RETROPACK</text>
            <text x="105" y="175" fill="#43ffa0" fontSize="10" fontFamily="monospace">STRAPS RETAINED: 3 OF 3</text>

            {/* Capsule Cutaway Diagram showing Retropack Straps */}
            <g transform="translate(370, 45)">
              <ellipse cx="50" cy="120" rx="45" ry="12" fill="#ef4444" opacity="0.8" />
              <text x="15" y="138" fill="#f87171" fontSize="9" fontWeight="bold">BERYLLIUM HEATSHIELD</text>
              <polygon points="25,20 75,20 85,115 15,115" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
              {/* Retropack Straps */}
              <line x1="20" y1="70" x2="80" y2="120" stroke="#fbbf24" strokeWidth="4" />
              <line x1="80" y1="70" x2="20" y2="120" stroke="#fbbf24" strokeWidth="4" />
              <rect x="35" y="115" width="30" height="15" fill="#eab308" rx="2" />
            </g>
          </svg>
          <div className="comic-visual-badge">📡 MERCURY CONTROL · SEGMENT 51 TELEMETRY ALERT</div>
        </div>
      );
    }

    if (panelNumber === 5) {
      // Re-entry Fiery Plasma Inferno
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#451a03,#7f1d1d', false, true)}
            
            {/* Plasma Fireball Shockwave */}
            <path d="M 0 120 Q 250 20 600 90 L 600 240 L 0 240 Z" fill="#ea580c" opacity="0.85" />
            <path d="M 50 140 Q 280 50 600 120 L 600 240 L 50 240 Z" fill="#facc15" opacity="0.9" />

            {/* Glowing Burning Capsule */}
            <g transform="translate(230, 40) rotate(25)">
              {/* White-Hot Heatshield */}
              <ellipse cx="40" cy="110" rx="35" ry="10" fill="#ffffff" />
              <ellipse cx="40" cy="110" rx="42" ry="14" fill="#fbbf24" opacity="0.6" />
              {/* Capsule Body */}
              <polygon points="20,25 60,25 72,110 8,110" fill="#1e293b" stroke="#f97316" strokeWidth="2" />
              {/* Burning Straps Flying Away */}
              <polygon points="75,90 120,60 110,80" fill="#ef4444" />
              <polygon points="70,110 130,105 115,115" fill="#f59e0b" />
            </g>

            {/* Fiery Embers & Plasma Streaks */}
            <g stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round">
              <line x1="380" y1="90" x2="520" y2="70" />
              <line x1="360" y1="120" x2="550" y2="105" />
              <line x1="390" y1="150" x2="570" y2="140" />
            </g>
          </svg>
          <div className="comic-visual-badge">🔥 RE-ENTRY PLASMA · 3,000°F ABLATIVE SHOCKWAVE</div>
        </div>
      );
    }

    if (panelNumber === 6) {
      // Balloon Rocket Experiment (Newton's 3rd Law)
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#0f172a,#1e293b', false)}
            
            {/* Guide String line */}
            <line x1="40" y1="120" x2="560" y2="120" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6,4" />
            <text x="50" y="105" fill="#94a3b8" fontSize="10" fontFamily="monospace">GUIDE STRING</text>

            {/* Balloon Body */}
            <g transform="translate(260, 70)">
              {/* Inflated Red/Orange Balloon */}
              <ellipse cx="70" cy="50" rx="75" ry="42" fill="#ef4444" stroke="#991b1b" strokeWidth="3" />
              <ellipse cx="60" cy="40" rx="30" ry="12" fill="#f87171" opacity="0.6" />
              {/* Straw Taped on top */}
              <rect x="30" y="-3" width="70" height="8" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              <line x1="50" y1="-8" x2="50" y2="10" stroke="#000" strokeWidth="2" />
              <line x1="80" y1="-8" x2="80" y2="10" stroke="#000" strokeWidth="2" />
              {/* Air Venting Nozzle */}
              <polygon points="145,50 170,40 170,60" fill="#b91c1c" />
              {/* Escaping Air Streams */}
              <path d="M 175 42 Q 220 30 250 40" stroke="#60a5fa" strokeWidth="3" fill="none" />
              <path d="M 175 50 Q 230 50 265 52" stroke="#93c5fd" strokeWidth="3" fill="none" />
              <path d="M 175 58 Q 220 70 250 62" stroke="#60a5fa" strokeWidth="3" fill="none" />
            </g>

            {/* Force Arrows: Action vs Reaction */}
            <g>
              {/* Force of air pushing left */}
              <path d="M 230 190 L 120 190" stroke="#43ffa0" strokeWidth="4" />
              <polygon points="120,183 105,190 120,197" fill="#43ffa0" />
              <text x="130" y="178" fill="#43ffa0" fontSize="12" fontWeight="bold">ACTION: ROCKET THRUST (FORWARD)</text>
              
              {/* Reaction arrow */}
              <path d="M 370 190 L 480 190" stroke="#38bdf8" strokeWidth="4" />
              <polygon points="480,183 495,190 480,197" fill="#38bdf8" />
              <text x="360" y="178" fill="#38bdf8" fontSize="12" fontWeight="bold">REACTION: EXHAUST AIR (BACKWARD)</text>
            </g>
          </svg>
          <div className="comic-visual-badge">🧪 STEM LAB · NEWTON'S 3RD LAW: F_thrust = -F_exhaust</div>
        </div>
      );
    }
  }

  // ISSUE 2: THE SLOW DANCE (GEMINI 8 DOCKING & EMERGENCY)
  if (issueNumber === 2) {
    if (panelNumber === 1 || panelNumber === 2) {
      // Gemini 8 Approaching and Docking with Agena Target Vehicle
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#020617,#075985', true)}
            
            {/* Earth horizon below */}
            <path d="M 0 175 Q 300 150 600 175 L 600 240 L 0 240 Z" fill="#0284c7" />

            {/* Agena Target Vehicle (Cylinder with docking collar) */}
            <g transform="translate(100, 70)">
              <rect x="0" y="15" width="120" height="35" fill="#94a3b8" stroke="#475569" strokeWidth="2" rx="4" />
              <line x1="30" y1="15" x2="30" y2="50" stroke="#334155" strokeWidth="2" />
              <line x1="70" y1="15" x2="70" y2="50" stroke="#334155" strokeWidth="2" />
              <text x="35" y="36" fill="#020617" fontSize="10" fontWeight="bold">AGENA GATV</text>
              {/* Docking Cone */}
              <polygon points="120,10 150,22 150,43 120,55" fill="#cbd5e1" stroke="#000" strokeWidth="1.5" />
              <circle cx="150" cy="32" r="10" fill="#475569" />
              {/* Antenna */}
              <line x1="20" y1="15" x2="5" y2="-10" stroke="#f59e0b" strokeWidth="2" />
            </g>

            {/* Gemini 8 Spacecraft Approaching Nose-First */}
            <g transform="translate(290, 60)">
              {/* Nose cone index bar */}
              <rect x="0" y="37" width="25" height="10" fill="#e2e8f0" stroke="#000" />
              {/* Re-entry module */}
              <polygon points="25,25 90,5 90,80 25,60" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              {/* Equipment adapter module */}
              <polygon points="90,5 150,0 150,85 90,80" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Cockpit Window */}
              <polygon points="35,32 55,22 55,42 35,42" fill="#38bdf8" />
              
              {/* Thruster bursts (Hydrazine OAMS) */}
              <polygon points="110,0 118,-15 125,0" fill="#43ffa0" opacity="0.9" />
              <polygon points="110,85 118,100 125,85" fill="#43ffa0" opacity="0.9" />
            </g>

            {/* Docking Alignment Radar Beam */}
            <line x1="250" y1="102" x2="290" y2="102" stroke="#43ffa0" strokeWidth="3" strokeDasharray="4,3" />
          </svg>
          <div className="comic-visual-badge">🎯 GEMINI 8 & AGENA DOCKING · RELATIVE VELOCITY &lt; 0.2 M/S</div>
        </div>
      );
    }

    if (panelNumber === 3 || panelNumber === 4 || panelNumber === 5) {
      // Violent 60 RPM Spin & Armstrong's RCS Hand Controller
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#1e1b4b,#020617', false, true)}
            
            {/* Extreme Rotational Motion Streaks */}
            <path d="M 100 40 Q 300 200 500 40" stroke="#ef4444" strokeWidth="3" fill="none" opacity="0.8" />
            <path d="M 50 180 Q 300 30 550 180" stroke="#f59e0b" strokeWidth="3" fill="none" opacity="0.8" />

            {/* Roll Rate Meter Indicator (Pegged at 60 deg/sec) */}
            <g transform="translate(60, 40)">
              <rect x="0" y="0" width="140" height="90" fill="#0f172a" stroke="#ef4444" strokeWidth="2" rx="6" />
              <text x="15" y="25" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">ROLL RATE GYRO</text>
              <line x1="20" y1="65" x2="120" y2="65" stroke="#334155" strokeWidth="3" />
              <line x1="70" y1="45" x2="115" y2="65" stroke="#ef4444" strokeWidth="4" />
              <text x="35" y="82" fill="#fbbf24" fontSize="12" fontWeight="bold">60° / SEC !</text>
            </g>

            {/* Cockpit POV: Armstrong at the Hand Controller */}
            <g transform="translate(240, 25)">
              {/* Helmet Visor with Glowing Reflection */}
              <circle cx="120" cy="70" r="50" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
              <ellipse cx="120" cy="65" rx="38" ry="28" fill="#fbbf24" opacity="0.85" />
              <path d="M 95 55 Q 120 45 145 55" stroke="#ffffff" strokeWidth="3" fill="none" />
              
              {/* Armstrong's Gloved Hand on Attitude Controller */}
              <rect x="95" y="130" width="45" height="60" fill="#cbd5e1" stroke="#000" strokeWidth="2" rx="4" />
              <line x1="117" y1="110" x2="117" y2="150" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
              <circle cx="117" cy="105" r="12" fill="#b91c1c" />
              <text x="80" y="205" fill="#43ffa0" fontSize="10" fontWeight="bold">RCS ISOLATION ON</text>
            </g>

            {/* Counter-Firing RCS Thruster Burst */}
            <polygon points="450,110 520,80 500,120" fill="#38bdf8" opacity="0.9" />
          </svg>
          <div className="comic-visual-badge">🚨 CRITICAL EMERGENCY · STUCK THRUSTER ROLL · RCS ACTIVATION</div>
        </div>
      );
    }

    if (panelNumber === 6) {
      // Precision Relative Velocity STEM Diagram
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#020617,#0f172a', true)}
            <ellipse cx="300" cy="320" rx="320" ry="200" fill="#0284c7" opacity="0.5" />
            <path d="M 50 120 Q 300 70 550 120" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6,4" fill="none" />
            <circle cx="200" cy="90" r="8" fill="#fbbf24" />
            <text x="175" y="75" fill="#fbbf24" fontSize="11" fontWeight="bold">AGENA</text>
            <circle cx="380" cy="95" r="8" fill="#43ffa0" />
            <text x="355" y="75" fill="#43ffa0" fontSize="11" fontWeight="bold">GEMINI 8</text>
            <path d="M 380 95 L 290 85" stroke="#43ffa0" strokeWidth="3" />
            <text x="260" y="150" fill="#f8fafc" fontSize="12" fontWeight="bold">
              ORBITAL RENDEZVOUS: BURN RETRO TO LOWER ORBIT & SPEED UP!
            </text>
          </svg>
          <div className="comic-visual-badge">📐 ORBITAL MECHANICS · RELATIVE VELOCITY DRIFT</div>
        </div>
      );
    }
  }

  // ISSUE 3: EAGLE IS LANDING (APOLLO 11)
  if (issueNumber === 3) {
    if (panelNumber === 1 || panelNumber === 2 || panelNumber === 3) {
      // Lunar Module Eagle Descent & 1202 Guidance Alarm
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#000000,#020617', true)}
            
            {/* Moon Horizon with Craters */}
            <path d="M 0 170 Q 250 145 600 165 L 600 240 L 0 240 Z" fill="#475569" />
            <ellipse cx="140" cy="195" rx="35" ry="12" fill="#334155" />
            <ellipse cx="440" cy="185" rx="55" ry="16" fill="#1e293b" />

            {/* Apollo 11 Lunar Module Eagle */}
            <g transform="translate(180, 25)">
              {/* Ascent Stage (Upper cabin) */}
              <polygon points="40,20 80,20 95,55 25,55" fill="#94a3b8" stroke="#000" strokeWidth="1.5" />
              {/* Triangular Cockpit Windows */}
              <polygon points="42,32 54,26 52,40" fill="#38bdf8" />
              <polygon points="68,26 80,32 70,40" fill="#38bdf8" />
              {/* Descent Stage (Gold Mylar Foil Octagon) */}
              <polygon points="25,55 95,55 110,85 10,85" fill="#d97706" stroke="#b45309" strokeWidth="2" />
              {/* Descent Engine Bell */}
              <polygon points="50,85 70,85 78,110 42,110" fill="#475569" />
              {/* Descent Rocket Plume */}
              <polygon points="45,110 75,110 60,145" fill="#fde047" opacity="0.8" />
              {/* Landing Gear Struts */}
              <line x1="20" y1="80" x2="-5" y2="135" stroke="#cbd5e1" strokeWidth="3" />
              <circle cx="-5" cy="135" r="8" fill="#94a3b8" />
              <line x1="100" y1="80" x2="125" y2="135" stroke="#cbd5e1" strokeWidth="3" />
              <circle cx="125" cy="135" r="8" fill="#94a3b8" />
            </g>

            {/* Glowing DSKY 1202 Program Alarm Box */}
            <g transform="translate(370, 30)">
              <rect x="0" y="0" width="180" height="95" fill="#020617" stroke="#22c55e" strokeWidth="2" rx="6" />
              <rect x="15" y="15" width="45" height="22" fill="#ef4444" rx="2" />
              <text x="20" y="30" fill="#fff" fontSize="9" fontWeight="bold">PROG</text>
              <text x="70" y="32" fill="#22c55e" fontSize="18" fontFamily="monospace" fontWeight="bold">1202</text>
              <text x="15" y="58" fill="#fbbf24" fontSize="10" fontFamily="monospace">RADAR OVERLOAD</text>
              <text x="15" y="78" fill="#43ffa0" fontSize="11" fontFamily="monospace" fontWeight="bold">HOUSTON: "WE GO!"</text>
            </g>
          </svg>
          <div className="comic-visual-badge">⚠️ APOLLO 11 · FLIGHT COMPUTER 1202 ALARM · RADAR DATA OVERFLOW</div>
        </div>
      );
    }

    if (panelNumber === 4 || panelNumber === 5 || panelNumber === 6) {
      // West Crater Boulder Avoidance & Touchdown Dust
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#000000,#0a0f1d', true)}
            
            {/* Cratered Lunar Surface */}
            <path d="M 0 160 Q 200 130 600 150 L 600 240 L 0 240 Z" fill="#64748b" />
            
            {/* West Crater Giant Boulders */}
            <polygon points="90,170 120,150 145,175 110,185" fill="#334155" />
            <polygon points="150,175 180,145 210,180 170,195" fill="#1e293b" />
            <text x="100" y="210" fill="#f87171" fontSize="9" fontWeight="bold">WEST CRATER BOULDER FIELD</text>

            {/* Armstrong's Manual Flyover Trajectory */}
            <path d="M 200 60 Q 320 80 440 125" stroke="#38bdf8" strokeWidth="3" strokeDasharray="5,4" fill="none" />
            
            {/* Lunar Module Settling at Safe Spot */}
            <g transform="translate(420, 75)">
              <polygon points="25,20 65,20 75,45 15,45" fill="#94a3b8" />
              <polygon points="15,45 75,45 85,70 5,70" fill="#d97706" />
              {/* Contact Probes */}
              <line x1="8" y1="70" x2="-10" y2="105" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="82" y1="70" x2="100" y2="105" stroke="#cbd5e1" strokeWidth="2" />
              {/* Radial Dust Sheets Blowing Outward */}
              <ellipse cx="45" cy="100" rx="65" ry="15" fill="#cbd5e1" opacity="0.75" />
            </g>

            {/* Fuel Gauge Margin Display */}
            <g transform="translate(30, 30)">
              <rect x="0" y="0" width="150" height="70" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" rx="6" />
              <text x="12" y="20" fill="#fbbf24" fontSize="10" fontWeight="bold">HOVER FUEL REMAINING</text>
              <rect x="12" y="30" width="125" height="15" fill="#1e293b" rx="3" />
              <rect x="12" y="30" width="35" height="15" fill="#ef4444" rx="3" />
              <text x="12" y="60" fill="#f87171" fontSize="10" fontWeight="bold">UNDER 1 MINUTE !</text>
            </g>
          </svg>
          <div className="comic-visual-badge">🌕 TOUCHDOWN · SEA OF TRANQUILLITY · "THE EAGLE HAS LANDED"</div>
        </div>
      );
    }
  }

  // ISSUE 4: FIRST WHEELS ON MARS (SOJOURNER & PATHFINDER)
  if (issueNumber === 4) {
    if (panelNumber === 1 || panelNumber === 2) {
      // Airbag Bounce & Unfolding Petals on Ares Vallis
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#451a03,#7c2d12', false)}
            
            {/* Butterscotch Martian Sky & Red Hills */}
            <path d="M 0 130 Q 180 90 350 120 Q 480 80 600 115 L 600 240 L 0 240 Z" fill="#991b1b" />
            <path d="M 0 160 Q 250 140 600 155 L 600 240 L 0 240 Z" fill="#b91c1c" />

            {/* Mars Pathfinder Unfolded Base & Ramp */}
            <g transform="translate(180, 100)">
              {/* Petals */}
              <polygon points="0,50 80,65 50,20" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
              <polygon points="160,50 80,65 110,20" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
              <polygon points="80,65 50,95 110,95" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
              {/* Deflated Airbag Cushions around Base */}
              <ellipse cx="20" cy="70" rx="30" ry="12" fill="#f8fafc" opacity="0.7" />
              <ellipse cx="140" cy="70" rx="30" ry="12" fill="#f8fafc" opacity="0.7" />
              {/* Deployment Ramp leading to ground */}
              <polygon points="75,50 85,50 115,100 100,100" fill="#475569" />
              {/* Sojourner Rover on the ramp */}
              <rect x="85" y="65" width="28" height="18" fill="#d97706" rx="2" />
              <circle cx="88" cy="85" r="5" fill="#1e293b" />
              <circle cx="102" cy="85" r="5" fill="#1e293b" />
            </g>

            {/* Martian Rocks (Yogi & Barnacle Bill) */}
            <polygon points="380,160 410,135 440,165 420,185" fill="#78350f" />
            <text x="390" y="198" fill="#fde047" fontSize="9" fontWeight="bold">"YOGI"</text>
          </svg>
          <div className="comic-visual-badge">🔴 ARES VALLIS · MARS PATHFINDER UNPETALING · SOL 1</div>
        </div>
      );
    }

    if (panelNumber === 3 || panelNumber === 4 || panelNumber === 5 || panelNumber === 6) {
      // Sojourner Rover APXS Spectrometer on Rock Yogi
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#3f1a0b,#78350f', false)}
            
            {/* Martian Soil with Cleated Wheel Tracks */}
            <path d="M 0 140 Q 300 125 600 145 L 600 240 L 0 240 Z" fill="#9a3412" />
            <g stroke="#7c2d12" strokeWidth="3" strokeDasharray="3,4">
              <path d="M 20 220 Q 150 190 280 170" fill="none" />
              <path d="M 40 235 Q 170 205 300 185" fill="none" />
            </g>

            {/* Sojourner Micro-Rover (Rocker-Bogie 6-wheel suspension) */}
            <g transform="translate(230, 80)">
              {/* Solar Panel Top Plate */}
              <rect x="20" y="20" width="75" height="35" fill="#0284c7" stroke="#000" strokeWidth="2" rx="3" />
              <rect x="25" y="23" width="65" height="29" fill="#1e3a8a" />
              {/* Rover Body Gold/Silver */}
              <rect x="25" y="45" width="65" height="25" fill="#d97706" rx="2" />
              {/* Stereo Camera Mast */}
              <line x1="35" y1="20" x2="35" y2="0" stroke="#cbd5e1" strokeWidth="3" />
              <rect x="30" y="-8" width="10" height="8" fill="#475569" />
              {/* APXS Robotic Arm Sensor deployed to Rock */}
              <line x1="85" y1="55" x2="135" y2="65" stroke="#94a3b8" strokeWidth="4" />
              <circle cx="138" cy="67" r="7" fill="#fbbf24" />
              {/* Alpha particles & X-Ray rays */}
              <g stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2,2">
                <line x1="138" y1="67" x2="160" y2="60" />
                <line x1="138" y1="67" x2="165" y2="72" />
              </g>
              {/* Rock Yogi */}
              <polygon points="160,35 220,20 250,85 180,95" fill="#581c87" opacity="0.8" />
              <polygon points="160,35 220,20 250,85 180,95" fill="#78350f" opacity="0.85" />
              <text x="180" y="110" fill="#fde047" fontSize="10" fontWeight="bold">ROCK YOGI</text>
              {/* 6 Wheels */}
              <circle cx="25" cy="80" r="9" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="58" cy="82" r="9" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="90" cy="80" r="9" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
            </g>

            {/* Telemetry Delay Display */}
            <g transform="translate(30, 30)">
              <rect x="0" y="0" width="170" height="55" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" rx="5" />
              <text x="12" y="20" fill="#38bdf8" fontSize="10" fontWeight="bold">EARTH-MARS LIGHT DELAY</text>
              <text x="12" y="38" fill="#43ffa0" fontSize="13" fontFamily="monospace" fontWeight="bold">10 MIN 42 SEC</text>
            </g>
          </svg>
          <div className="comic-visual-badge">🔬 SOJOURNER APXS SPECTROMETER · AUTONOMOUS ROCKER-BOGIE MOBILITY</div>
        </div>
      );
    }
  }

  // ISSUE 5: A BLURRY START (HUBBLE SPACE TELESCOPE & COSTAR FIX)
  if (issueNumber === 5) {
    if (panelNumber === 1 || panelNumber === 2 || panelNumber === 3) {
      // Hubble Launch & Spherical Aberration Optical Ray Diagram
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#020617,#032b43', true)}
            
            {/* Hubble Floating in Orbit */}
            <g transform="translate(100, 40) rotate(-10)">
              {/* Silver Telescope Cylinder */}
              <rect x="0" y="20" width="130" height="45" fill="#cbd5e1" stroke="#334155" strokeWidth="2" rx="4" />
              {/* Solar Arrays */}
              <rect x="35" y="-35" width="20" height="55" fill="#1e3a8a" stroke="#fbbf24" strokeWidth="1.5" />
              <rect x="35" y="65" width="20" height="55" fill="#1e3a8a" stroke="#fbbf24" strokeWidth="1.5" />
              {/* Aperture Door Open */}
              <line x1="0" y1="20" x2="-25" y2="5" stroke="#94a3b8" strokeWidth="4" />
            </g>

            {/* Spherical Aberration Optical Diagram */}
            <g transform="translate(320, 25)">
              <rect x="0" y="0" width="240" height="180" fill="#020617" stroke="#ef4444" strokeWidth="1.5" rx="8" />
              <text x="20" y="25" fill="#ef4444" fontSize="11" fontWeight="bold">FLAW: 2-MICRON EDGE ERROR</text>
              {/* Primary Mirror Curve */}
              <path d="M 20 60 Q 30 110 20 160" stroke="#38bdf8" strokeWidth="5" fill="none" />
              {/* Light rays focusing at wrong points */}
              <line x1="20" y1="70" x2="180" y2="110" stroke="#facc15" strokeWidth="2" />
              <line x1="20" y1="150" x2="180" y2="110" stroke="#facc15" strokeWidth="2" />
              <line x1="20" y1="90" x2="215" y2="110" stroke="#38bdf8" strokeWidth="2" />
              <line x1="20" y1="130" x2="215" y2="110" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="180" cy="110" r="4" fill="#ef4444" />
              <circle cx="215" cy="110" r="4" fill="#38bdf8" />
              <text x="30" y="170" fill="#cbd5e1" fontSize="9">BLURRED FOCAL REGION (HALO)</text>
            </g>
          </svg>
          <div className="comic-visual-badge">🔭 HUBBLE OPTICAL FLAW · PRIMARY MIRROR SPHERICAL ABERRATION</div>
        </div>
      );
    }

    if (panelNumber === 4 || panelNumber === 5 || panelNumber === 6) {
      // STS-61 Shuttle Spacewalk & Before/After Galaxy M100 Fix
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#020617,#0f172a', true)}
            
            {/* Space Shuttle Canadarm & Spacewalker */}
            <g transform="translate(50, 40)">
              {/* Canadarm White Robotic Joint */}
              <path d="M 0 160 Q 60 80 120 40" stroke="#f8fafc" strokeWidth="8" fill="none" />
              {/* Astronaut in EMU Spacewalk Suit */}
              <circle cx="130" cy="35" r="16" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
              <ellipse cx="134" cy="35" rx="9" ry="7" fill="#fbbf24" />
              <rect x="120" y="50" width="22" height="35" fill="#f8fafc" rx="4" />
              {/* COSTAR Optical Instrument Box */}
              <rect x="150" y="30" width="55" height="70" fill="#e2e8f0" stroke="#3b82f6" strokeWidth="2" rx="4" />
              <text x="158" y="55" fill="#1d4ed8" fontSize="9" fontWeight="bold">COSTAR</text>
            </g>

            {/* Split View: Before vs After Image */}
            <g transform="translate(320, 30)">
              <rect x="0" y="0" width="250" height="160" fill="#020617" stroke="#334155" strokeWidth="2" rx="6" />
              {/* Left: Blurry M100 */}
              <rect x="5" y="5" width="115" height="150" fill="#090d16" />
              <circle cx="62" cy="80" r="30" fill="#93c5fd" opacity="0.25" filter="blur(4px)" />
              <circle cx="62" cy="80" r="12" fill="#fff" opacity="0.4" />
              <text x="25" y="145" fill="#ef4444" fontSize="10" fontWeight="bold">BEFORE: BLUR</text>
              {/* Divider */}
              <line x1="125" y1="5" x2="125" y2="155" stroke="#fbbf24" strokeWidth="3" />
              {/* Right: Sharp Pinpoint M100 */}
              <rect x="130" y="5" width="115" height="150" fill="#090d16" />
              <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
                <path d="M 185 80 Q 200 65 210 80" />
                <path d="M 185 80 Q 170 95 160 80" />
              </g>
              <circle cx="185" cy="80" r="4" fill="#fff" />
              <circle cx="170" cy="70" r="1.5" fill="#fde047" />
              <circle cx="205" cy="90" r="1.5" fill="#fde047" />
              <text x="145" y="145" fill="#43ffa0" fontSize="10" fontWeight="bold">AFTER: SHARP!</text>
            </g>
          </svg>
          <div className="comic-visual-badge">✨ STS-61 REPAIR · COSTAR CORRECTIVE OPTICS RESTORES CRYSTAL VISION</div>
        </div>
      );
    }
  }

  // ISSUE 6: THE GRAND TOUR (VOYAGER 1 & 2)
  if (issueNumber === 6) {
    if (panelNumber === 1 || panelNumber === 2 || panelNumber === 3) {
      // 176-Year Planetary Alignment & Jupiter Gravity Assist Slingshot
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#020617,#1e1b4b', true)}
            
            {/* Giant Jupiter with Great Red Spot & Bands */}
            <g transform="translate(140, 100)">
              <circle cx="0" cy="0" r="65" fill="#ea580c" />
              <ellipse cx="0" cy="-20" rx="63" ry="12" fill="#c2410c" />
              <ellipse cx="0" cy="15" rx="63" ry="12" fill="#9a3412" />
              <ellipse cx="25" cy="22" rx="14" ry="9" fill="#dc2626" />
              <text x="-25" y="85" fill="#fdba74" fontSize="11" fontWeight="bold">JUPITER</text>
            </g>

            {/* Hyperbolic Slingshot Trajectory Arc */}
            <path d="M 30 190 Q 140 10 260 90 T 540 50" stroke="#43ffa0" strokeWidth="3.5" fill="none" strokeDasharray="6,4" />
            <polygon points="540,43 555,50 540,57" fill="#43ffa0" />
            <text x="320" y="75" fill="#43ffa0" fontSize="11" fontWeight="bold">+ Δv SLINGSHOT ACCELERATION!</text>

            {/* Voyager Spacecraft with High-Gain Antenna Dish */}
            <g transform="translate(360, 95) rotate(-20)">
              {/* White High Gain Dish */}
              <ellipse cx="20" cy="20" rx="30" ry="14" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
              <circle cx="20" cy="20" r="4" fill="#000" />
              {/* Golden Record on side */}
              <circle cx="45" cy="35" r="12" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
              {/* Boom & Magnetometer */}
              <line x1="20" y1="20" x2="-40" y2="40" stroke="#cbd5e1" strokeWidth="3" />
            </g>
          </svg>
          <div className="comic-visual-badge">🪐 176-YEAR GEOMETRY · JUPITER GRAVITY ASSIST SLINGSHOT</div>
        </div>
      );
    }

    if (panelNumber === 4 || panelNumber === 5 || panelNumber === 6) {
      // Golden Record & Crossing the Heliopause into Interstellar Space
      return (
        <div className="comic-visual-viewport">
          <svg viewBox="0 0 600 240" className="comic-svg-stage">
            {renderCommonBackdrop('#000000,#0b0f19', true)}
            
            {/* Heliopause Boundary (Solar Wind vs Interstellar Space) */}
            <path d="M 280 0 Q 320 120 280 240" stroke="#818cf8" strokeWidth="5" strokeDasharray="8,6" fill="none" opacity="0.8" />
            <text x="130" y="30" fill="#38bdf8" fontSize="10" fontWeight="bold">HELIOSPHERE (SOLAR WIND)</text>
            <text x="340" y="30" fill="#c084fc" fontSize="10" fontWeight="bold">INTERSTELLAR MEDIUM (COSMIC RAYS)</text>

            {/* Voyager 1 Passing Boundary */}
            <g transform="translate(230, 80)">
              <ellipse cx="30" cy="30" rx="35" ry="16" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
              {/* Golden Record */}
              <circle cx="55" cy="50" r="16" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              <circle cx="55" cy="50" r="3" fill="#000" />
              {/* Radio Wavefront beaming back to Earth */}
              <g stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.7">
                <path d="M 10 30 A 20 20 0 0 0 -10 10" />
                <path d="M 5 30 A 35 35 0 0 0 -25 5" />
              </g>
            </g>

            {/* DSN Signal Delay Meter */}
            <g transform="translate(370, 130)">
              <rect x="0" y="0" width="190" height="60" fill="#020617" stroke="#818cf8" strokeWidth="1.5" rx="6" />
              <text x="12" y="20" fill="#c084fc" fontSize="9" fontWeight="bold">DSN SIGNAL DELAY (ONE-WAY)</text>
              <text x="12" y="42" fill="#43ffa0" fontSize="15" fontFamily="monospace" fontWeight="bold">22.5 LIGHT-HOURS</text>
            </g>
          </svg>
          <div className="comic-visual-badge">🌌 VOYAGER 1 INTERSTELLAR PASSAGE · 140+ ASTRONOMICAL UNITS</div>
        </div>
      );
    }
  }

  // Graceful Fallback Dynamic Scene Illustration
  return (
    <div className="comic-visual-viewport">
      <svg viewBox="0 0 600 240" className="comic-svg-stage">
        {renderCommonBackdrop('#020617,#0f172a', true)}
        <circle cx="300" cy="120" r="60" fill="#38bdf8" opacity="0.4" />
        <text x="220" y="125" fill="#f8fafc" fontSize="14" fontWeight="bold">
          MISSION SCENE #{panelNumber}
        </text>
      </svg>
      <div className="comic-visual-badge">🚀 MISSION TELEMETRY VIEW</div>
    </div>
  );
};
