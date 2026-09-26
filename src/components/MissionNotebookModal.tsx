import React, { useState } from 'react';
import type { SolHistoryEntry, ResourceState } from '../types/game';
import type { TeachingFlashcard } from '../data/teachingFlashcards';
import type { NasaMission } from '../data/nasaMissions';
import {
  X,
  BookOpen,
  Award,
  Calendar,
  Download,
  Sparkles,
  Printer
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface MissionNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: NasaMission;
  history: SolHistoryEntry[];
  collectedFlashcards: TeachingFlashcard[];
  resources: ResourceState;
  playerName?: string;
}

export const MissionNotebookModal: React.FC<MissionNotebookModalProps> = ({
  isOpen,
  onClose,
  mission,
  history,
  collectedFlashcards,
  resources,
  playerName = 'Cadet Explorer'
}) => {
  const [activeTab, setActiveTab] = useState<'FLIGHT_LOG' | 'FLASHCARDS' | 'CERTIFICATE'>('FLIGHT_LOG');

  if (!isOpen) return null;

  const handleExportText = () => {
    soundFx.playTelemetryChirp();
    const content = [
      `=============================================================`,
      `NASA OUTPOST COMMAND: ASTRONAUT FLIGHT NOTEBOOK`,
      `Mission: ${mission.name} (${mission.nasaProgram})`,
      `Astronaut / Commander: ${playerName}`,
      `Date Generated: ${new Date().toLocaleDateString()}`,
      `=============================================================`,
      ``,
      `MISSION METRICS:`,
      `- Science Points: ${resources.science} RP`,
      `- Power Reserve: ${resources.power}%`,
      `- Water Reserve: ${resources.water}%`,
      `- Atmospheric Oxygen: ${resources.oxygen}%`,
      `- Radiation Absorbed: ${resources.radiation} mSv`,
      `- Crew Health: ${resources.crewHealth}%`,
      ``,
      `FLIGHT LOG ENTRIES (${history.length} Sols Logged):`,
      ...history.map((h) =>
        `[SOL ${h.sol}] ${h.eventTitle}\n` +
        `  Decision: ${h.chosenOption.title}\n` +
        `  Physics Insight: ${h.chainReactionNote}\n`
      ),
      ``,
      `COLLECTED SCIENCE FLASHCARDS (${collectedFlashcards.length}):`,
      ...collectedFlashcards.map((c) =>
        `- ${c.title} [${c.category}]\n` +
        `  ${c.shortSummary}\n` +
        `  Reference: ${c.nasaDocReference}\n`
      ),
      ``,
      `NASA International Space Apps Challenge 2026 - By Team Mysterio`
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NASA_Flight_Notebook_${mission.destination}_Sol_${history.length}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1000 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '880px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-glow" style={{ width: '36px', height: '36px' }}>
              <BookOpen size={20} className="text-cyan-400" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.06em' }}>
                OFFICIAL FLIGHT LOGBOOK & STEM DOSSIER
              </div>
              <h2 className="modal-title" style={{ fontSize: '1.25rem' }}>
                {mission.name} — Flight Diary
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.4)'
        }}>
          <button
            onClick={() => { setActiveTab('FLIGHT_LOG'); soundFx.playClick(700); }}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'FLIGHT_LOG' ? '#38bdf8' : 'transparent',
              color: activeTab === 'FLIGHT_LOG' ? '#070a0e' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Calendar size={14} />
            <span>Sol Flight Log ({history.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab('FLASHCARDS'); soundFx.playClick(750); }}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'FLASHCARDS' ? '#38bdf8' : 'transparent',
              color: activeTab === 'FLASHCARDS' ? '#070a0e' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} />
            <span>Science Flashcard Dex ({collectedFlashcards.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab('CERTIFICATE'); soundFx.playClick(850); }}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'CERTIFICATE' ? '#38bdf8' : 'transparent',
              color: activeTab === 'CERTIFICATE' ? '#070a0e' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Award size={14} />
            <span>Astronaut Certificate</span>
          </button>
        </div>

        {/* Tab 1: Sol Flight Log */}
        {activeTab === 'FLIGHT_LOG' && (
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                Chronological record of decisions and scientific discoveries:
              </div>
              <button
                onClick={handleExportText}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid #38bdf8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={13} />
                <span>Export Log (.txt)</span>
              </button>
            </div>

            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <Calendar size={36} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
                <div>No decisions logged yet. Advance through the mission to record Sols!</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {history.map((entry, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      padding: '14px 18px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          backgroundColor: '#38bdf8',
                          color: '#070a0e',
                          fontWeight: 800,
                          fontSize: '0.68rem',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          SOL {entry.sol}
                        </span>
                        <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>
                          {entry.eventTitle}
                        </strong>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#43ffa0', fontWeight: 600 }}>
                        Choice: {entry.chosenOption.title}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4', marginTop: '4px' }}>
                      <strong>STEM Consequence: </strong>
                      {entry.chainReactionNote}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Science Flashcard Dex */}
        {activeTab === 'FLASHCARDS' && (
          <div style={{ padding: '24px' }}>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '16px' }}>
              Collection of verified STEM principles discovered during planetary exploration:
            </div>

            {collectedFlashcards.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <Sparkles size={36} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
                <div>No flashcards collected yet! Click "Save to Flight Notebook" on any lesson card.</div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '14px'
              }}>
                {collectedFlashcards.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: '10px',
                      padding: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.8rem' }}>{c.emoji}</span>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700 }}>
                          {c.category}
                        </div>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                          {c.title}
                        </h4>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.4', margin: '6px 0' }}>
                      {c.shortSummary}
                    </p>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '6px' }}>
                      {c.nasaDocReference}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Official NASA Astronaut Certificate */}
        {activeTab === 'CERTIFICATE' && (
          <div style={{ padding: '24px' }}>
            <div style={{
              border: '4px double #38bdf8',
              borderRadius: '16px',
              padding: '36px 30px',
              backgroundColor: 'rgba(7, 10, 14, 0.95)',
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 0 35px rgba(56, 189, 248, 0.2)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>
                {mission.missionPatchEmoji}
              </div>
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
                NASA INTERNATIONAL SPACE APPS CHALLENGE 2026
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', margin: '8px 0' }}>
                CERTIFICATE OF ASTRONAUT ACHIEVEMENT
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '520px', margin: '0 auto 18px auto' }}>
                This certifies that Junior Astronaut & Flight Director
              </p>
              <div style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#43ffa0',
                borderBottom: '2px solid rgba(67, 255, 160, 0.4)',
                display: 'inline-block',
                padding: '0 24px 4px 24px',
                marginBottom: '16px'
              }}>
                {playerName}
              </div>
              <p style={{ fontSize: '0.84rem', color: '#cbd5e1', maxWidth: '560px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
                has successfully commanded the <strong>{mission.name}</strong> expedition at <strong>{mission.targetLocation}</strong>, demonstrating exemplary systems engineering, closed-loop life support stewardship, and scientific discovery.
              </p>

              {/* Stats Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                margin: '20px 0',
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>SCIENCE TARGET</div>
                  <strong style={{ fontSize: '1.2rem', color: '#fbbf24' }}>{resources.science} RP</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>CREW HEALTH</div>
                  <strong style={{ fontSize: '1.2rem', color: '#43ffa0' }}>{resources.crewHealth}%</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>FLASHCARDS COLLECTED</div>
                  <strong style={{ fontSize: '1.2rem', color: '#38bdf8' }}>{collectedFlashcards.length}</strong>
                </div>
              </div>

              {/* Signatures */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                maxWidth: '480px',
                margin: '28px auto 0 auto',
                borderTop: '1px solid rgba(255,255,255,0.15)',
                paddingTop: '12px'
              }}>
                <div>
                  <div style={{ fontFamily: 'cursive', fontSize: '1.1rem', color: '#f8fafc' }}>Team Mysterio</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Flight Operations & Mission Control</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'cursive', fontSize: '1.1rem', color: '#f8fafc' }}>Outpost Commander Dadu</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>NASA Space Apps 2026</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '10px' }}>
              <button
                onClick={handlePrintCertificate}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  backgroundColor: '#38bdf8',
                  color: '#070a0e',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={15} />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
