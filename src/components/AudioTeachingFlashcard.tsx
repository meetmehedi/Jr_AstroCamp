import React, { useState, useEffect } from 'react';
import type { TeachingFlashcard } from '../data/teachingFlashcards';
import type { DifficultyTier } from '../data/difficultyTiers';
import {
  X,
  Volume2,
  VolumeX,
  BookMarked,
  Check,
  Sparkles,
  FileText,
  HelpCircle
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { speechEngine } from '../utils/speechEngine';

interface AudioTeachingFlashcardProps {
  card: TeachingFlashcard | null;
  isOpen: boolean;
  onClose: () => void;
  tier: DifficultyTier;
  onSaveToNotebook: (card: TeachingFlashcard) => void;
  isSaved?: boolean;
}

export const AudioTeachingFlashcard: React.FC<AudioTeachingFlashcardProps> = ({
  card,
  isOpen,
  onClose,
  tier,
  onSaveToNotebook,
  isSaved = false
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      speechEngine.stop();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen || !card) return null;

  const currentTierContent = card.ageAdaptations[tier] || card.ageAdaptations.CADET;

  const handleSpeak = () => {
    if (isSpeaking) {
      speechEngine.stop();
      setIsSpeaking(false);
      return;
    }

    const fullAudioText = `${card.title}. ${currentTierContent.text} Key takeaway: ${currentTierContent.keyTakeaway}`;
    setIsSpeaking(true);
    speechEngine.speak(
      fullAudioText,
      'CADET_MAYA',
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleSave = () => {
    soundFx.playTelemetryChirp();
    onSaveToNotebook(card);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1001 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px', overflow: 'hidden', padding: 0 }}
      >
        {/* Top Gradient Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
          padding: '20px 24px',
          color: '#070a0e',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '2.4rem' }}>{card.emoji}</span>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#082f49' }}>
                NASA SCIENCE FLASHCARD · {card.category}
              </div>
              <h2 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', fontWeight: 900, color: '#070a0e' }}>
                {card.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#070a0e'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Card Body */}
        <div style={{ padding: '24px' }}>
          {/* Audio Voiceover Bar */}
          <div style={{
            backgroundColor: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '10px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={16} className={isSpeaking ? 'text-emerald-400 animate-bounce' : 'text-cyan-400'} />
              <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                {isSpeaking ? 'Voice Teacher is speaking...' : 'Listen to CapCom voice lesson'}
              </span>
            </div>
            <button
              onClick={handleSpeak}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isSpeaking ? '#ef4444' : '#38bdf8',
                color: isSpeaking ? '#fff' : '#070a0e',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
              <span>{isSpeaking ? 'Pause' : 'Read Aloud'}</span>
            </button>
          </div>

          {/* Equation or Formula Pill (if available) */}
          {card.equationOrFormula && (
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontFamily: 'monospace',
              fontSize: '0.84rem',
              color: '#38bdf8',
              marginBottom: '16px',
              textAlign: 'center',
              fontWeight: 600
            }}>
              {card.equationOrFormula}
            </div>
          )}

          {/* Age-Tier Adapted Lesson */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px' }}>
              <Sparkles size={13} className="text-amber-400" />
              <span>THE SCIENCE LESSON:</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#f1f5f9', lineHeight: '1.6', margin: 0 }}>
              {currentTierContent.text}
            </p>
          </div>

          {/* Key Takeaway Box */}
          <div style={{
            backgroundColor: 'rgba(67, 255, 160, 0.1)',
            border: '1px solid rgba(67, 255, 160, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <HelpCircle size={18} className="text-emerald-400 shrink-0" style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#43ffa0', textTransform: 'uppercase' }}>
                Key STEM Takeaway:
              </div>
              <div style={{ fontSize: '0.84rem', color: '#e2e8f0', fontWeight: 600, marginTop: '2px' }}>
                {currentTierContent.keyTakeaway}
              </div>
            </div>
          </div>

          {/* NASA Document Citation */}
          <div style={{
            fontSize: '0.72rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '22px'
          }}>
            <FileText size={13} />
            <span>Ref: {card.nasaDocReference}</span>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={onClose} className="nav-link-btn" style={{ padding: '8px 16px' }}>
              Close Card
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isSaved || justSaved ? '#10b981' : '#38bdf8',
                color: isSaved || justSaved ? '#ffffff' : '#070a0e',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              {isSaved || justSaved ? <Check size={15} /> : <BookMarked size={15} />}
              <span>{isSaved || justSaved ? 'Saved in Flight Notebook' : 'Save to Flight Notebook'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
