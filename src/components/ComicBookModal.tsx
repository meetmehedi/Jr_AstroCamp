import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  COMIC_BOOK_ISSUES, 
  type ComicIssue, 
  type ComicPanelScene 
} from '../data/comicBooks';
import { 
  BookOpen, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Award, 
  HelpCircle, 
  FlaskConical, 
  Layers, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { ComicVisualArtwork } from './ComicVisualArtwork';

interface ComicBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIssueId?: string;
}

export const ComicBookModal: React.FC<ComicBookModalProps> = ({
  isOpen,
  onClose,
  initialIssueId
}) => {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(initialIssueId || null);
  const [currentPageIdx, setCurrentPageIdx] = useState<number>(0);
  const [activePanelIdx, setActivePanelIdx] = useState<number | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<{ title: string; fact: string; formula?: string } | null>(null);
  const [showCurriculumTab, setShowCurriculumTab] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'comic' | 'blueprint'>('comic');

  // Sync initialIssueId if provided
  useEffect(() => {
    if (initialIssueId) {
      setSelectedIssueId(initialIssueId);
      setCurrentPageIdx(0);
      setActivePanelIdx(null);
    }
  }, [initialIssueId]);

  const currentIssue: ComicIssue | undefined = COMIC_BOOK_ISSUES.find(
    (i) => i.id === selectedIssueId
  );

  const currentPage = currentIssue?.pages[currentPageIdx];

  // Stop speech synthesis when closing or switching pages
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedIssueId, currentPageIdx]);

  if (!isOpen) return null;

  // Speak dialogue using Web Speech API with character-tailored pitch
  const speakPanelDialogue = (panel: ComicPanelScene) => {
    if (!isAudioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(panel.dialogue);
    utterance.rate = 1.0;
    
    switch (panel.speaker) {
      case 'CADET_MAYA':
        utterance.pitch = 1.35;
        utterance.rate = 1.05;
        break;
      case 'COMMANDER_DADU':
        utterance.pitch = 0.82;
        utterance.rate = 0.95;
        break;
      case 'ASTRO_BOT':
        utterance.pitch = 1.6;
        utterance.rate = 1.15;
        break;
      case 'HOUSTON_CAPCOM':
        utterance.pitch = 1.0;
        break;
      case 'DR_ELENA':
        utterance.pitch = 1.15;
        break;
    }
    
    window.speechSynthesis.speak(utterance);
    setActivePanelIdx(panel.panelNumber);
    soundFx.playClick(800);
  };

  const handleNextPage = () => {
    if (!currentIssue) return;
    if (currentPageIdx < currentIssue.pages.length - 1) {
      setCurrentPageIdx((p) => p + 1);
      setActivePanelIdx(null);
      setActiveHotspot(null);
      soundFx.playClick(650);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIdx > 0) {
      setCurrentPageIdx((p) => p - 1);
      setActivePanelIdx(null);
      setActiveHotspot(null);
      soundFx.playClick(650);
    }
  };

  const getSpeakerStyle = (speaker: ComicPanelScene['speaker']) => {
    switch (speaker) {
      case 'CADET_MAYA':
        return { name: 'Cadet Maya (Age 6)', color: '#38bdf8', badge: '🧒', role: 'Junior Cadet' };
      case 'COMMANDER_DADU':
        return { name: 'Commander Dadu (Age 70)', color: '#43ffa0', badge: '👨‍🚀', role: 'Veteran Flight Engineer' };
      case 'ASTRO_BOT':
        return { name: 'AstroBot AI', color: '#f59e0b', badge: '🤖', role: 'Autonomous Rover OS' };
      case 'HOUSTON_CAPCOM':
        return { name: 'Houston CapCom', color: '#ec4899', badge: '📡', role: 'Mission Control' };
      case 'DR_ELENA':
      default:
        return { name: 'Dr. Elena Vance', color: '#a78bfa', badge: '🔬', role: 'Astrobiologist' };
    }
  };



  return ReactDOM.createPortal(
    <div className="comic-modal-backdrop" onClick={onClose}>
      <div className="comic-modal-window" onClick={(e) => e.stopPropagation()}>
        
        {/* ── TOP COMIC BRANDING HEADER BAR ─────────────────────────────────── */}
        <div className="comic-top-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: '#020617',
              color: '#fbbf24',
              padding: '2px 8px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.1em',
              border: '1px solid #f59e0b'
            }}>
              TEAM MYSTERIO
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} />
              JR_ASTROCAMP · NASA STEM GRAPHIC NOVEL SERIES
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Audio Voiceover Toggle */}
            <button
              onClick={() => {
                const next = !isAudioEnabled;
                setIsAudioEnabled(next);
                if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                soundFx.playClick(700);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: isAudioEnabled ? '#020617' : 'rgba(2, 6, 23, 0.7)',
                color: isAudioEnabled ? '#43ffa0' : '#94a3b8',
                transition: 'all 0.2s'
              }}
              title="Toggle Audio Read-Aloud Narration"
            >
              {isAudioEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{isAudioEnabled ? 'Voiceover ON' : 'Muted'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                onClose();
              }}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: '#020617',
                color: '#fbbf24',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Close Graphic Novel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT AREA ────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', background: '#070c18', color: '#f8fafc' }}>
          
          {/* CASE 1: NO ISSUE SELECTED (COMIC ISSUE GALLERY / SHELF) */}
          {!currentIssue ? (
            <div className="comic-shelf-container">
              <div className="comic-shelf-header">
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fbbf24',
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '10px'
                }}>
                  <Award size={14} /> Official Space Apps 2026 STEM Curriculum
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, color: '#ffffff' }}>
                  NASA Mission Graphic Novels
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '8px', lineHeight: 1.6 }}>
                  Fly through real NASA physics with Cadet Maya, Commander Dadu, and AstroBot! 
                  Select an issue below to start reading the illustrated comic book with voiceover narration, 
                  curriculum breakdown, and interactive STEM challenges.
                </p>
              </div>

              {/* Comic Book Shelf Grid */}
              <div className="comic-grid">
                {COMIC_BOOK_ISSUES.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => {
                      setSelectedIssueId(issue.id);
                      setCurrentPageIdx(0);
                      setShowCurriculumTab(false);
                      soundFx.playClick(900);
                    }}
                    className="comic-card"
                  >
                    {/* Illustrated Comic Book Cover Art */}
                    <div className="comic-card-cover-wrapper">
                      <img 
                        src={`/comics/covers/cover_issue_${issue.issueNumber}.jpg`} 
                        alt={issue.title}
                        className="comic-cover-img"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                      {/* Top floating badges */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
                        <span style={{
                          fontFamily: 'monospace',
                          fontSize: '10px',
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'rgba(2, 6, 23, 0.9)',
                          color: '#fbbf24',
                          border: '1px solid rgba(245, 158, 11, 0.6)',
                          backdropFilter: 'blur(6px)'
                        }}>
                          {issue.coverBadge}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: '#f8fafc',
                          fontWeight: 800,
                          background: 'rgba(2, 6, 23, 0.85)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(6px)'
                        }}>
                          {issue.gradeLevel}
                        </span>
                      </div>
                      
                      {/* Bottom title gradient strip */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(7, 12, 24, 0.98) 0%, rgba(7, 12, 24, 0.75) 60%, transparent 100%)',
                        padding: '24px 14px 10px 14px'
                      }}>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#fbbf24', fontWeight: 900, letterSpacing: '0.06em' }}>
                          ISSUE #{issue.issueNumber} · {issue.nasaMissionTieIn}
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: '3px 0 2px 0', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                          {issue.title}
                        </h3>
                        <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.3 }}>
                          {issue.subtitle}
                        </div>
                      </div>
                    </div>

                    {/* Synopsis & Meta */}
                    <div className="comic-card-body">
                      <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                        {issue.synopsis}
                      </p>

                      <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, marginBottom: '10px' }}>
                          🛰️ {issue.nasaMissionTieIn}
                        </div>
                        
                        <button
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontWeight: 800,
                            color: '#020617',
                            background: issue.coverThemeColor,
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            boxShadow: `0 4px 14px ${issue.coverThemeColor}50`
                          }}
                        >
                          <BookOpen size={14} /> Read Issue #{issue.issueNumber}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* CASE 2: ACTIVE COMIC ISSUE READER VIEW */
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              
              {/* Comic Navigation Sub-Bar */}
              <div className="comic-reader-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setSelectedIssueId(null);
                      setShowCurriculumTab(false);
                      soundFx.playClick(600);
                    }}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      background: '#1e293b',
                      color: '#cbd5e1',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ChevronLeft size={14} /> Comic Shelf
                  </button>

                  <div style={{ width: '1px', height: '16px', background: '#334155', margin: '0 4px' }} />

                  {/* Issue Selector Dropdown */}
                  <select
                    value={currentIssue.id}
                    onChange={(e) => {
                      setSelectedIssueId(e.target.value);
                      setCurrentPageIdx(0);
                      setActivePanelIdx(null);
                      setShowCurriculumTab(false);
                      soundFx.playClick(750);
                    }}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#fbbf24',
                      fontWeight: 800,
                      padding: '5px 8px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {COMIC_BOOK_ISSUES.map((iss) => (
                      <option key={iss.id} value={iss.id}>
                        Issue #{iss.issueNumber}: {iss.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Right controls: Curriculum toggle + Page controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setShowCurriculumTab(!showCurriculumTab);
                      soundFx.playClick(700);
                    }}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: showCurriculumTab ? '#f59e0b' : '#1e293b',
                      color: showCurriculumTab ? '#020617' : '#fbbf24',
                      boxShadow: showCurriculumTab ? '0 2px 10px rgba(245, 158, 11, 0.4)' : 'none'
                    }}
                  >
                    <FlaskConical size={14} />
                    <span>STEM Curriculum & Quiz</span>
                  </button>

                  {/* View Mode Toggle: Comic Art vs Blueprint */}
                  <button
                    onClick={() => {
                      setViewMode((m) => (m === 'comic' ? 'blueprint' : 'comic'));
                      soundFx.playClick(600);
                    }}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: viewMode === 'blueprint' ? '#0284c7' : '#1e293b',
                      color: viewMode === 'blueprint' ? '#f0f9ff' : '#38bdf8',
                      boxShadow: viewMode === 'blueprint' ? '0 0 12px rgba(56, 189, 248, 0.5)' : 'none'
                    }}
                    title="Toggle between Illustrated Comic Art and Technical Blueprint Schematics"
                  >
                    {viewMode === 'comic' ? (
                      <>
                        <Sparkles size={14} />
                        <span>🎨 Comic Art</span>
                      </>
                    ) : (
                      <>
                        <Layers size={14} />
                        <span>📐 Blueprint</span>
                      </>
                    )}
                  </button>

                  <div style={{ width: '1px', height: '16px', background: '#334155', margin: '0 4px' }} />

                  <button
                    onClick={handlePrevPage}
                    disabled={currentPageIdx === 0}
                    style={{
                      padding: '5px 8px',
                      borderRadius: '6px',
                      background: '#1e293b',
                      color: '#f8fafc',
                      border: 'none',
                      cursor: currentPageIdx === 0 ? 'not-allowed' : 'pointer',
                      opacity: currentPageIdx === 0 ? 0.4 : 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Previous Page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 800, color: '#94a3b8', padding: '0 4px' }}>
                    Page {currentPageIdx + 1} / {currentIssue.pages.length}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPageIdx === currentIssue.pages.length - 1}
                    style={{
                      padding: '5px 8px',
                      borderRadius: '6px',
                      background: '#1e293b',
                      color: '#f8fafc',
                      border: 'none',
                      cursor: currentPageIdx === currentIssue.pages.length - 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPageIdx === currentIssue.pages.length - 1 ? 0.4 : 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Next Page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* CURRICULUM & QUIZ DRAWER VIEW */}
              {showCurriculumTab ? (
                <div className="comic-curriculum-panel">
                  {/* Curriculum Header */}
                  <div style={{
                    background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15), rgba(15, 23, 42, 0.8))',
                    padding: '18px 20px',
                    borderRadius: '14px',
                    border: '1px solid rgba(245, 158, 11, 0.35)'
                  }}>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Curriculum Framework · Issue #{currentIssue.issueNumber}
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>{currentIssue.title}: STEM Standards</h3>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{currentIssue.subtitle}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '14px' }}>
                      <div style={{ background: '#020617', padding: '10px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                        <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700 }}>Target Audience:</div>
                        <div style={{ color: '#43ffa0', fontSize: '13px', fontWeight: 800, marginTop: '2px' }}>{currentIssue.gradeLevel}</div>
                      </div>
                      <div style={{ background: '#020617', padding: '10px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                        <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700 }}>NASA Mission Anchor:</div>
                        <div style={{ color: '#38bdf8', fontSize: '13px', fontWeight: 800, marginTop: '2px' }}>{currentIssue.nasaMissionTieIn}</div>
                      </div>
                    </div>
                  </div>

                  {/* Learning Objectives List */}
                  <div style={{ background: '#0b1120', padding: '18px 20px', borderRadius: '14px', border: '1px solid #1e293b' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}>
                      <Layers size={16} /> Key Learning Objectives & Physics Principles
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {currentIssue.curriculumStandards.map((std, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(2, 6, 23, 0.6)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '12px' }}>
                          <CheckCircle2 size={16} style={{ color: '#43ffa0', flexShrink: 0, marginTop: '2px' }} />
                          <span>{std}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hands-On Science Experiment */}
                  <div style={{ background: '#0b1120', padding: '18px 20px', borderRadius: '14px', border: '1px solid rgba(67, 255, 160, 0.3)' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#43ffa0', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}>
                      <FlaskConical size={16} /> Hands-On Student Activity: {currentIssue.handsOnExperiment.title}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#cbd5e1' }}>
                      <div>
                        <strong style={{ color: '#f8fafc' }}>Materials Needed: </strong>
                        <span style={{ color: '#94a3b8' }}>{currentIssue.handsOnExperiment.materials.join(', ')}</span>
                      </div>
                      <div style={{ background: '#020617', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b', lineHeight: 1.6 }}>
                        <strong style={{ color: '#f8fafc', display: 'block', marginBottom: '4px' }}>Procedure:</strong>
                        {currentIssue.handsOnExperiment.instructions}
                      </div>
                      <div style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', lineHeight: 1.5 }}>
                        <strong>Why It Works (The Science): </strong>
                        {currentIssue.handsOnExperiment.whyItWorks}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Comprehension Quiz */}
                  <div style={{ background: '#0b1120', padding: '18px 20px', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 14px 0' }}>
                      <HelpCircle size={16} /> Mission Comprehension Check
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {currentIssue.comprehensionQuiz.map((q, qIdx) => (
                        <div key={qIdx} style={{ background: '#020617', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                          <div style={{ fontWeight: 700, color: '#ffffff' }}>
                            {qIdx + 1}. {q.question}
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '4px' }}>
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selectedAnswers[qIdx] === optIdx;
                              const isCorrect = q.correctIndex === optIdx;
                              let bg = '#0f172a';
                              let border = '#334155';
                              let color = '#cbd5e1';
                              
                              if (quizSubmitted) {
                                if (isCorrect) {
                                  bg = 'rgba(67, 255, 160, 0.15)';
                                  border = '#43ffa0';
                                  color = '#43ffa0';
                                } else if (isSelected) {
                                  bg = 'rgba(239, 68, 68, 0.15)';
                                  border = '#ef4444';
                                  color = '#fca5a5';
                                }
                              } else if (isSelected) {
                                bg = 'rgba(245, 158, 11, 0.2)';
                                border = '#f59e0b';
                                color = '#fbbf24';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => {
                                    if (quizSubmitted) return;
                                    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                                  }}
                                  style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '10px 12px',
                                    borderRadius: '6px',
                                    background: bg,
                                    border: `1px solid ${border}`,
                                    color: color,
                                    fontSize: '12px',
                                    cursor: quizSubmitted ? 'default' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.15s'
                                  }}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && isCorrect && <CheckCircle2 size={14} style={{ color: '#43ffa0' }} />}
                                  {quizSubmitted && isSelected && !isCorrect && <AlertCircle size={14} style={{ color: '#ef4444' }} />}
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div style={{ marginTop: '8px', padding: '10px 12px', borderRadius: '6px', background: '#0f172a', fontSize: '11.5px', color: '#cbd5e1', border: '1px solid #334155', lineHeight: 1.5 }}>
                              <strong style={{ color: '#fbbf24' }}>Explanation: </strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      ))}

                      <div style={{ paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {!quizSubmitted ? (
                          <button
                            onClick={() => {
                              setQuizSubmitted(true);
                              soundFx.playTelemetryChirp();
                            }}
                            disabled={Object.keys(selectedAnswers).length < currentIssue.comprehensionQuiz.length}
                            style={{
                              padding: '8px 18px',
                              borderRadius: '8px',
                              background: '#f59e0b',
                              color: '#020617',
                              fontWeight: 800,
                              fontSize: '12px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              border: 'none',
                              cursor: Object.keys(selectedAnswers).length < currentIssue.comprehensionQuiz.length ? 'not-allowed' : 'pointer',
                              opacity: Object.keys(selectedAnswers).length < currentIssue.comprehensionQuiz.length ? 0.4 : 1
                            }}
                          >
                            Submit Quiz Answers
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedAnswers({});
                              setQuizSubmitted(false);
                            }}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              background: '#1e293b',
                              color: '#f8fafc',
                              fontWeight: 700,
                              fontSize: '12px',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Retake Quiz
                          </button>
                        )}

                        <button
                          onClick={() => setShowCurriculumTab(false)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#38bdf8',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          ← Return to Comic Story
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* NASA Technical Reference Citation */}
                  <div style={{ padding: '12px 16px', background: '#020617', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={14} style={{ color: '#38bdf8', flexShrink: 0 }} />
                    <span>NASA Reference: <strong style={{ color: '#cbd5e1' }}>{currentIssue.nasaDocumentCitation}</strong></span>
                  </div>
                </div>
              ) : (
                /* THE GRAPHIC NOVEL PAGE CANVAS */
                <div className="comic-page-view">
                  
                  {/* Page Title & Caption */}
                  <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(245, 158, 11, 0.25)', paddingBottom: '10px' }}>
                    <div>
                      <span style={{ fontFamily: 'monospace', fontSize: '10px', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', marginRight: '8px' }}>
                        {currentIssue.coverBadge}
                      </span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', display: 'inline', margin: 0 }}>
                        {currentPage?.pageTitle}
                      </h4>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                      PANELS {currentPage?.panels[0]?.panelNumber}–{currentPage?.panels[currentPage.panels.length - 1]?.panelNumber}
                    </div>
                  </div>

                  {/* Dynamic Graphic Novel Comic Grid */}
                  <div className="comic-panels-grid">
                    {currentPage?.panels.map((panel) => {
                      const speaker = getSpeakerStyle(panel.speaker);
                      const isFull = panel.layout === 'FULL_WIDTH';
                      const isActive = activePanelIdx === panel.panelNumber;

                      return (
                        <div
                          key={panel.id}
                          className={`comic-panel-card ${isFull ? 'comic-panel-full' : ''} ${isActive ? 'active-panel' : ''}`}
                        >
                          {/* Panel Header Banner (Panel # and Mission Subsystem) */}
                          <div className="comic-panel-meta-bar">
                            <span className="comic-panel-number-pill">PANEL #{panel.panelNumber}</span>
                            <span className="comic-panel-scene-pill">{panel.sceneType.replace(/_/g, ' ')}</span>
                          </div>

                          {/* DEDICATED ILLUSTRATED COMIC ARTWORK VIEWPORT */}
                          <div className="comic-panel-art-frame">
                            <ComicVisualArtwork
                              issueNumber={currentIssue.issueNumber}
                              panelNumber={panel.panelNumber}
                              sceneType={panel.sceneType}
                              speaker={panel.speaker}
                              mood={panel.mood}
                              viewMode={viewMode}
                              sfxText={panel.sfx?.text}
                            />

                            {/* Sound Effect Explosion Burst (SFX) over Artwork */}
                            {panel.sfx && (
                              <div 
                                className="comic-sfx-burst"
                                style={{
                                  color: panel.sfx.color,
                                  top: panel.sfx.position === 'top-right' ? '12px' : panel.sfx.position === 'top-left' ? '12px' : 'auto',
                                  bottom: panel.sfx.position === 'bottom-right' ? '12px' : 'auto',
                                  right: panel.sfx.position.includes('right') ? '14px' : 'auto',
                                  left: panel.sfx.position === 'top-left' ? '14px' : panel.sfx.position === 'center' ? '50%' : 'auto',
                                  transform: panel.sfx.position === 'center' ? 'translate(-50%, -50%) rotate(-4deg)' : 'rotate(6deg)'
                                }}
                              >
                                <span className="comic-sfx-text">{panel.sfx.text}</span>
                              </div>
                            )}
                          </div>

                          {/* Top: Narrator Caption Box */}
                          {panel.caption && (
                            <div className="comic-caption-box">
                              <span style={{ fontFamily: 'monospace', fontSize: '9px', textTransform: 'uppercase', display: 'block', opacity: 0.8 }}>LOG ENTRY:</span>
                              {panel.caption}
                            </div>
                          )}

                          {/* Middle/Bottom: Interactive Dialogue Speech Bubble */}
                          <div className="comic-bubble">
                            {/* Speaker Header with Play Voiceover Button */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div 
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    border: `2px solid ${speaker.color}`,
                                    background: `${speaker.color}20`
                                  }}
                                >
                                  {speaker.badge}
                                </div>
                                <div>
                                  <div style={{ fontSize: '12px', fontWeight: 900, color: speaker.color }}>
                                    {speaker.name}
                                  </div>
                                  <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
                                    {speaker.role}
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => speakPanelDialogue(panel)}
                                style={{
                                  padding: '6px',
                                  borderRadius: '50%',
                                  background: '#1e293b',
                                  color: '#fbbf24',
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                                title="Listen to this character speak"
                              >
                                <Play size={12} fill="#fbbf24" />
                              </button>
                            </div>

                            {/* Dialogue Text */}
                            <div style={{ fontSize: '12.5px', color: '#f8fafc', fontWeight: 500, lineHeight: 1.5, fontStyle: 'italic' }}>
                              "{panel.dialogue}"
                            </div>

                            {/* Interactive STEM Science Fact Hotspot Button */}
                            {panel.stemFactHotspot && (
                              <div style={{ paddingTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                <button
                                  onClick={() => setActiveHotspot(panel.stemFactHotspot || null)}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#38bdf8',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: 0
                                  }}
                                >
                                  <Sparkles size={12} /> Science Fact: {panel.stemFactHotspot.title}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Page Navigation Bottom Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1e293b' }}>
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPageIdx === 0}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: '#1e293b',
                        color: '#f8fafc',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: currentPageIdx === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentPageIdx === 0 ? 0.4 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <ChevronLeft size={16} /> Previous Page
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {currentIssue.pages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentPageIdx(idx);
                            setActivePanelIdx(null);
                            soundFx.playClick(600);
                          }}
                          style={{
                            width: currentPageIdx === idx ? '24px' : '10px',
                            height: '10px',
                            borderRadius: '999px',
                            background: currentPageIdx === idx ? '#fbbf24' : '#334155',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          title={`Page ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPageIdx === currentIssue.pages.length - 1}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: '#f59e0b',
                        color: '#020617',
                        fontSize: '12px',
                        fontWeight: 800,
                        border: 'none',
                        cursor: currentPageIdx === currentIssue.pages.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPageIdx === currentIssue.pages.length - 1 ? 0.4 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      Next Page <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── STEM FACT HOTSPOT MODAL POPUP ──────────────────────────────────── */}
        {activeHotspot && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              maxWidth: '440px',
              width: '100%',
              background: '#090e1a',
              border: '2px solid #38bdf8',
              borderRadius: '16px',
              padding: '20px',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)'
            }}>
              <button
                onClick={() => setActiveHotspot(null)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <div style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> NASA Science Spotlight
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0' }}>
                {activeHotspot.title}
              </h4>

              <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                {activeHotspot.fact}
              </p>

              {activeHotspot.formula && (
                <div style={{ background: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', fontFamily: 'monospace', fontSize: '12px', color: '#38bdf8', textAlign: 'center', fontWeight: 700, marginBottom: '14px' }}>
                  {activeHotspot.formula}
                </div>
              )}

              <button
                onClick={() => setActiveHotspot(null)}
                style={{
                  width: '100%',
                  padding: '9px',
                  borderRadius: '8px',
                  background: '#38bdf8',
                  color: '#020617',
                  fontWeight: 800,
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                Got It! Back to Comic
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
