import React, { useState, useEffect } from 'react';
import { CURRICULUM_MODULES, type CurriculumModulePackage } from '../data/curriculumNotesAudioVideo';
import { Printer, CheckCircle2, HelpCircle, Sparkles, Bookmark } from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface HandwrittenNotebookViewProps {
  initialModuleId?: number;
  onLaunchMission?: (missionId: string) => void;
}

export const HandwrittenNotebookView: React.FC<HandwrittenNotebookViewProps> = ({
  initialModuleId = 1,
  onLaunchMission,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<number>(initialModuleId);
  const [userFillIns, setUserFillIns] = useState<Record<string, string>>({});
  const [predictions, setPredictions] = useState<Record<number, string>>({});
  const [debriefs, setDebriefs] = useState<Record<number, string>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});

  const currentModule: CurriculumModulePackage =
    CURRICULUM_MODULES.find((m) => m.id === selectedModuleId) || CURRICULUM_MODULES[0];
  const { notebook } = currentModule;

  // Load saved notebook entries from localStorage
  useEffect(() => {
    try {
      const savedFillIns = localStorage.getItem('astrocamp_notebook_fillins');
      if (savedFillIns) setUserFillIns(JSON.parse(savedFillIns));

      const savedPreds = localStorage.getItem('astrocamp_notebook_predictions');
      if (savedPreds) setPredictions(JSON.parse(savedPreds));

      const savedDebriefs = localStorage.getItem('astrocamp_notebook_debriefs');
      if (savedDebriefs) setDebriefs(JSON.parse(savedDebriefs));
    } catch {
      // ignore
    }
  }, []);

  const handleFillInChange = (ideaId: string, val: string) => {
    const updated = { ...userFillIns, [ideaId]: val };
    setUserFillIns(updated);
    try {
      localStorage.setItem('astrocamp_notebook_fillins', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handlePredictionChange = (val: string) => {
    const updated = { ...predictions, [selectedModuleId]: val };
    setPredictions(updated);
    try {
      localStorage.setItem('astrocamp_notebook_predictions', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleDebriefChange = (val: string) => {
    const updated = { ...debriefs, [selectedModuleId]: val };
    setDebriefs(updated);
    try {
      localStorage.setItem('astrocamp_notebook_debriefs', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const toggleHint = (ideaId: string) => {
    setShowHints((prev) => ({ ...prev, [ideaId]: !prev[ideaId] }));
    soundFx.playClick(600);
  };

  const handlePrint = () => {
    soundFx.playTelemetryChirp();
    window.print();
  };

  // Render hand-drawn SVG sketches for notebook ideas
  const renderIdeaSketch = (sketchType: string) => {
    switch (sketchType) {
      case 'ROCKET_FORCES':
        return (
          <svg viewBox="0 0 160 120" className="notebook-sketch-svg">
            <line x1="80" y1="10" x2="80" y2="100" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />
            <polygon points="75,30 85,30 80,15" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
            <rect x="73" y="30" width="14" height="40" fill="#f8fafc" stroke="#000" strokeWidth="1.5" />
            {/* Thrust Arrow UP */}
            <line x1="80" y1="15" x2="80" y2="2" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" />
            <polygon points="77,5 80,0 83,5" fill="#10b981" />
            <text x="90" y="14" fill="#10b981" fontSize="9" fontWeight="bold">THRUST (F_t)</text>
            {/* Weight Arrow DOWN */}
            <line x1="80" y1="70" x2="80" y2="95" stroke="#ef4444" strokeWidth="3" />
            <polygon points="77,95 80,100 83,95" fill="#ef4444" />
            <text x="90" y="95" fill="#ef4444" fontSize="9" fontWeight="bold">GRAVITY (W)</text>
            {/* Drag Arrow DOWN */}
            <text x="15" y="55" fill="#38bdf8" fontSize="8" fontWeight="bold">DRAG (F_d) ↓</text>
          </svg>
        );
      case 'STAGING_DROP':
        return (
          <svg viewBox="0 0 160 120" className="notebook-sketch-svg">
            {/* Upper Stage Going Up */}
            <g transform="translate(65, 10)">
              <polygon points="15,0 10,12 20,12" fill="#ef4444" stroke="#000" strokeWidth="1.5" />
              <rect x="9" y="12" width="12" height="28" fill="#f8fafc" stroke="#000" strokeWidth="1.5" />
              <polygon points="9,40 21,40 18,48 12,48" fill="#f59e0b" />
            </g>
            {/* Separated Lower Booster Dropping */}
            <g transform="translate(80, 65) rotate(18)">
              <rect x="0" y="0" width="14" height="32" fill="#94a3b8" stroke="#000" strokeWidth="1.5" />
              <text x="-45" y="15" fill="#ef4444" fontSize="8" fontWeight="bold">EMPTY TANK</text>
              <line x1="-5" y1="12" x2="5" y2="12" stroke="#ef4444" strokeWidth="1.5" />
            </g>
          </svg>
        );
      case 'ORBIT_FALLING':
        return (
          <svg viewBox="0 0 160 120" className="notebook-sketch-svg">
            <circle cx="80" cy="80" r="38" fill="#0284c7" stroke="#000" strokeWidth="2" />
            <path d="M 80 42 Q 135 42 135 80 T 80 118 T 25 80 T 80 42" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3" />
            <circle cx="135" cy="80" r="4" fill="#fbbf24" stroke="#000" strokeWidth="1.5" />
            <text x="35" y="25" fill="#f59e0b" fontSize="8.5" fontWeight="bold">7.8 km/s (SIDEWAYS)</text>
          </svg>
        );
      case 'RELATIVE_SPEED':
        return (
          <svg viewBox="0 0 160 120" className="notebook-sketch-svg">
            {/* Two Cars on highway */}
            <rect x="15" y="25" width="40" height="20" fill="#38bdf8" stroke="#000" strokeWidth="1.5" rx="3" />
            <text x="18" y="38" fill="#000" fontSize="7" fontWeight="bold">100 km/h</text>
            <rect x="65" y="25" width="40" height="20" fill="#43ffa0" stroke="#000" strokeWidth="1.5" rx="3" />
            <text x="68" y="38" fill="#000" fontSize="7" fontWeight="bold">100 km/h</text>
            <text x="25" y="60" fill="#64748b" fontSize="8">Δv = 0 km/h (STATIONARY!)</text>
            {/* Spacecraft below */}
            <circle cx="50" cy="90" r="12" fill="#94a3b8" stroke="#000" strokeWidth="1.5" />
            <circle cx="95" cy="90" r="10" fill="#cbd5e1" stroke="#000" strokeWidth="1.5" />
            <line x1="62" y1="90" x2="85" y2="90" stroke="#ef4444" strokeWidth="2" strokeDasharray="2,2" />
            <text x="35" y="112" fill="#10b981" fontSize="8" fontWeight="bold">CLOSING AT 0.1 M/S</text>
          </svg>
        );
      case 'GRAVITY_COMPARE':
        return (
          <svg viewBox="0 0 160 120" className="notebook-sketch-svg">
            {/* Earth vs Moon vs Mars Gravity Scales */}
            <rect x="15" y="70" width="30" height="40" fill="#0284c7" stroke="#000" strokeWidth="1.5" />
            <text x="18" y="60" fill="#0284c7" fontSize="8" fontWeight="bold">EARTH</text>
            <text x="18" y="95" fill="#fff" fontSize="8">9.8</text>

            <rect x="65" y="95" width="30" height="15" fill="#94a3b8" stroke="#000" strokeWidth="1.5" />
            <text x="68" y="85" fill="#64748b" fontSize="8" fontWeight="bold">MOON</text>
            <text x="68" y="106" fill="#000" fontSize="8">1.62</text>

            <rect x="115" y="85" width="30" height="25" fill="#dc2626" stroke="#000" strokeWidth="1.5" />
            <text x="118" y="75" fill="#dc2626" fontSize="8" fontWeight="bold">MARS</text>
            <text x="118" y="100" fill="#fff" fontSize="8">3.71</text>
          </svg>
        );
      case 'SPHERICAL_ABERRATION':
        return (
          <svg viewBox="0 0 160 120" className="notebook-sketch-svg">
            {/* Curved primary mirror */}
            <path d="M 20 20 Q 35 60 20 100" stroke="#38bdf8" strokeWidth="4" fill="none" />
            {/* Edge rays focusing short */}
            <line x1="22" y1="25" x2="110" y2="60" stroke="#ef4444" strokeWidth="1.5" />
            <line x1="22" y1="95" x2="110" y2="60" stroke="#ef4444" strokeWidth="1.5" />
            <circle cx="110" cy="60" r="3" fill="#ef4444" />
            <text x="85" y="50" fill="#ef4444" fontSize="7" fontWeight="bold">EDGE FOCUS</text>
            {/* Center rays focusing long */}
            <line x1="30" y1="45" x2="145" y2="60" stroke="#10b981" strokeWidth="1.5" />
            <line x1="30" y1="75" x2="145" y2="60" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="145" cy="60" r="3" fill="#10b981" />
            <text x="120" y="75" fill="#10b981" fontSize="7" fontWeight="bold">CENTER FOCUS</text>
          </svg>
        );
      case 'GRAVITY_SLINGSHOT':
        return (
          <svg viewBox="0 0 160 120" className="notebook-sketch-svg">
            <circle cx="85" cy="60" r="24" fill="#ea580c" stroke="#000" strokeWidth="1.5" />
            <text x="65" y="65" fill="#fff" fontSize="8" fontWeight="bold">JUPITER</text>
            {/* Slingshot Hyperbola curve */}
            <path d="M 20 100 Q 80 15 145 35" stroke="#10b981" strokeWidth="2.5" fill="none" strokeDasharray="3,3" />
            <polygon points="145,30 152,36 144,42" fill="#10b981" />
            <text x="25" y="30" fill="#10b981" fontSize="8" fontWeight="bold">+ Δv SLINGSHOT</text>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 160 120" className="notebook-sketch-svg">
            <rect x="20" y="20" width="120" height="80" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" rx="6" />
            <circle cx="80" cy="60" r="18" fill="#fbbf24" opacity="0.6" />
            <text x="50" y="65" fill="#000" fontSize="9" fontWeight="bold">DIAGRAM</text>
          </svg>
        );
    }
  };

  return (
    <div className="handwritten-notebook-wrapper">
      {/* ── TOP ACTION & MODULE SELECTOR BAR ────────────────────────────────── */}
      <div className="notebook-toolbar no-print">
        <div className="notebook-module-pills">
          {CURRICULUM_MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => {
                setSelectedModuleId(mod.id);
                soundFx.playClick(750);
              }}
              className={`notebook-pill-btn ${mod.id === selectedModuleId ? 'active' : ''}`}
              style={{
                borderColor: mod.id === selectedModuleId ? mod.themeColor : 'rgba(255,255,255,0.1)'
              }}
            >
              <span>{mod.badge}</span>
              <strong>Mod {mod.id}</strong>
            </button>
          ))}
        </div>

        <div className="notebook-toolbar-actions">
          <button onClick={handlePrint} className="notebook-print-btn" title="Print this handwritten notebook sheet as a PDF">
            <Printer size={15} />
            <span>Print Student PDF</span>
          </button>
          {onLaunchMission && (
            <button
              onClick={() => onLaunchMission(`NASA-M00${selectedModuleId}`)}
              className="notebook-launch-btn"
              style={{ background: currentModule.themeColor }}
            >
              <Sparkles size={14} />
              <span>Fly Sim Mission</span>
            </button>
          )}
        </div>
      </div>

      {/* ── AUTHENTIC LINED/DOT-GRID PAPER NOTEBOOK PAGE ────────────────────── */}
      <div className="notebook-sheet printable-paper">
        {/* Binder Ring Holes on the Left Margin */}
        <div className="notebook-binder-holes">
          <div className="binder-hole" />
          <div className="binder-hole" />
          <div className="binder-hole" />
        </div>

        {/* Paper Tape Corner / Paper Clip Decoration */}
        <div className="notebook-washi-tape" style={{ background: `${currentModule.themeColor}dd` }}>
          JR_ASTROCAMP · NASA STEM LOG
        </div>

        {/* Notebook Header */}
        <div className="notebook-header">
          <div className="notebook-meta-strip">
            <div className="notebook-field">
              <span className="notebook-field-label">STUDENT CADET:</span>
              <span className="notebook-field-val">____________________</span>
            </div>
            <div className="notebook-field">
              <span className="notebook-field-label">DATE / MISSION:</span>
              <span className="notebook-handwritten-badge">{notebook.nasaMission}</span>
            </div>
            <div className="notebook-field">
              <span className="notebook-field-label">LEVEL:</span>
              <span className="notebook-field-val">{notebook.gradeLevel}</span>
            </div>
          </div>

          <h2 className="notebook-title">
            📓 {notebook.moduleTitle}
          </h2>
          <div className="notebook-subtitle">
            ~ {notebook.subtitle} ~
          </div>
        </div>

        {/* ── THE BIG QUESTION BOX (Highlighter Accent) ───────────────────────── */}
        <div className="notebook-big-question-box">
          <div className="notebook-big-q-tag">
            <Bookmark size={14} /> THE BIG QUESTION
          </div>
          <div className="notebook-big-q-text">
            "{notebook.bigQuestion}"
          </div>
        </div>

        {/* ── 3 KEY SCIENTIFIC IDEAS WITH DIAGRAMS & FILL-IN LINES ───────────── */}
        <div className="notebook-key-ideas-section">
          <div className="notebook-section-title">
            ✏️ Key Scientific Principles (Write Your Observations)
          </div>

          <div className="notebook-ideas-grid">
            {notebook.keyIdeas.map((idea, idx) => {
              const userVal = userFillIns[idea.id] || '';
              const isCorrect = userVal.trim().toLowerCase() === idea.correctAnswer.toLowerCase();
              const hasHint = showHints[idea.id];

              return (
                <div key={idea.id} className="notebook-idea-card">
                  <div className="notebook-idea-header">
                    <span className="notebook-idea-num">IDEA #{idx + 1}</span>
                    <h4 className="notebook-idea-title">{idea.title}</h4>
                  </div>

                  {/* Hand-Drawn Diagram Sketch Frame */}
                  <div className="notebook-sketch-frame">
                    {renderIdeaSketch(idea.sketchType)}
                  </div>

                  <p className="notebook-idea-desc">
                    {idea.explanation}
                  </p>

                  {/* Interactive Student Fill-In Line */}
                  <div className="notebook-fillin-container">
                    <label className="notebook-fillin-label">
                      <strong>Cadet Fill-in: </strong>
                      {idea.fillInPrompt.split('________')[0]}
                      <span className="notebook-input-underline-wrap">
                        <input
                          type="text"
                          value={userVal}
                          onChange={(e) => handleFillInChange(idea.id, e.target.value)}
                          placeholder="write answer..."
                          className={`notebook-handwritten-input ${userVal && isCorrect ? 'correct' : ''}`}
                        />
                        {userVal && isCorrect && (
                          <CheckCircle2 size={14} className="notebook-check-icon" />
                        )}
                      </span>
                      {idea.fillInPrompt.split('________')[1]}
                    </label>

                    <div className="notebook-hint-row no-print">
                      <button onClick={() => toggleHint(idea.id)} className="notebook-hint-btn">
                        <HelpCircle size={12} /> {hasHint ? 'Hide Hint' : 'Need a Hint?'}
                      </button>
                      {hasHint && (
                        <span className="notebook-hint-bubble">
                          💡 {idea.hint}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── TWO-COLUMN BOTTOM: PRE-FLIGHT PREDICTION & POST-FLIGHT DEBRIEF ─── */}
        <div className="notebook-flight-loop-row">
          {/* Pre-Flight Prediction Box */}
          <div className="notebook-loop-box prediction-box">
            <div className="notebook-loop-header">
              <span>🚀 1. MY PREDICTION (Before Flying)</span>
            </div>
            <div className="notebook-prompt-text">{notebook.predictionPrompt}</div>
            <textarea
              value={predictions[selectedModuleId] || ''}
              onChange={(e) => handlePredictionChange(e.target.value)}
              placeholder="Write your hypothesis here before launching the simulator..."
              className="notebook-handwritten-textarea"
              rows={3}
            />
          </div>

          {/* Post-Flight Debrief Box */}
          <div className="notebook-loop-box debrief-box">
            <div className="notebook-loop-header">
              <span>🎯 2. MY FLIGHT DEBRIEF (After Flying)</span>
            </div>
            <div className="notebook-prompt-text">{notebook.debriefPrompt}</div>
            <textarea
              value={debriefs[selectedModuleId] || ''}
              onChange={(e) => handleDebriefChange(e.target.value)}
              placeholder="Record your telemetry, fuel margin, and what actually happened..."
              className="notebook-handwritten-textarea"
              rows={3}
            />
          </div>
        </div>

        {/* ── VOCABULARY STRIP (Sticky Note Tape Style) ───────────────────────── */}
        <div className="notebook-vocab-strip">
          <div className="notebook-vocab-label">🏷️ CORE VOCABULARY:</div>
          <div className="notebook-vocab-tags">
            {notebook.vocabulary.map((v, i) => (
              <div key={i} className="notebook-vocab-tag" title={v.definition}>
                <strong>{v.term}</strong>
                <span className="notebook-vocab-def">: {v.definition}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Citation */}
        <div className="notebook-footer-ref">
          <span>NASA Research Citation: {notebook.nasaCitation}</span>
          <span style={{ float: 'right' }}>Team Mysterio · Junior Astronaut STEM Curriculum</span>
        </div>
      </div>
    </div>
  );
};
