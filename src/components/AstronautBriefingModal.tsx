import React, { useState, useEffect } from 'react';
import type { NasaMission } from '../data/nasaMissions';
import {
  X,
  Rocket,
  Volume2,
  VolumeX,
  Compass,
  CheckCircle2,
  Radio,
  FileText,
  MapPin,
  Thermometer,
  Shield
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { speechEngine } from '../utils/speechEngine';

interface AstronautBriefingModalProps {
  mission: NasaMission | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchMission: (mission: NasaMission) => void;
}

export const AstronautBriefingModal: React.FC<AstronautBriefingModalProps> = ({
  mission,
  isOpen,
  onClose,
  onLaunchMission
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Stop speech when modal closes
    if (!isOpen) {
      speechEngine.stop();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen || !mission) return null;

  const handleSpeakBriefing = () => {
    if (isSpeaking) {
      speechEngine.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    speechEngine.speak(
      mission.scientificProblem.briefingAudio,
      'COMMANDER_DADU',
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleLaunch = () => {
    speechEngine.stop();
    soundFx.playReactorStart();
    onLaunchMission(mission);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1000 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Top Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem' }}>{mission.missionPatchEmoji}</span>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.06em' }}>
                NASA FLIGHT BRIEFING · MISSION #{mission.number}
              </div>
              <h2 className="modal-title" style={{ fontSize: '1.25rem' }}>
                {mission.name}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Audio Voice Briefing Player Banner */}
          <div style={{
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="brand-logo-glow" style={{ width: '38px', height: '38px' }}>
                <Radio size={20} className={isSpeaking ? 'text-emerald-400 animate-pulse' : 'text-cyan-400'} />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>
                  ASTRONAUT HOLOGRAPHIC VOICE BRIEFING
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {isSpeaking ? 'CapCom is transmitting flight briefing...' : 'Click to hear NASA CapCom voice narration'}
                </div>
              </div>
            </div>

            <button
              onClick={handleSpeakBriefing}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: isSpeaking ? '#ef4444' : '#38bdf8',
                color: isSpeaking ? '#fff' : '#070a0e'
              }}
            >
              {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isSpeaking ? 'Stop Audio' : 'Play Briefing'}</span>
            </button>
          </div>

          {/* Location & Mission Telemetry */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.72rem' }}>
                <MapPin size={13} className="text-rose-400" />
                <span>Target Site</span>
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                {mission.targetLocation}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>
                {mission.coordinates}
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.72rem' }}>
                <Thermometer size={13} className="text-amber-400" />
                <span>Environment</span>
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                {mission.surfaceTempC}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                Gravity: {mission.gravityG}g · {mission.atmosphere}
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.72rem' }}>
                <Shield size={13} className="text-emerald-400" />
                <span>Primary Instrument</span>
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                {mission.primaryInstrument}
              </div>
            </div>
          </div>

          {/* Section 1: Astronaut First-Person Perspective */}
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#38bdf8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={15} />
              <span>ASTRONAUT FIRST-PERSON TELEMETRY</span>
            </h3>
            <blockquote style={{
              margin: 0,
              padding: '12px 16px',
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              borderLeft: '3px solid #38bdf8',
              borderRadius: '0 8px 8px 0',
              fontStyle: 'italic',
              fontSize: '0.84rem',
              color: '#e2e8f0',
              lineHeight: '1.5'
            }}>
              "{mission.scientificProblem.astronautPOV}"
            </blockquote>
          </div>

          {/* Section 2: Real Scientific Problem */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fbbf24', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} />
              <span>THE ENGINEERING & SCIENTIFIC PROBLEM</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
              {mission.scientificProblem.summary}
            </p>
          </div>

          {/* Section 3: Official NASA Citation */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.06)',
            fontSize: '0.74rem',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px'
          }}>
            <FileText size={15} className="text-cyan-400 shrink-0" />
            <div>
              <strong>NASA Document: </strong>
              <span style={{ color: '#e2e8f0' }}>{mission.nasaCitation.title}</span> ({mission.nasaCitation.docNumber})
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={onClose} className="nav-link-btn" style={{ padding: '10px 18px' }}>
              Cancel
            </button>
            <button
              onClick={handleLaunch}
              style={{
                padding: '10px 24px',
                backgroundColor: '#38bdf8',
                color: '#070a0e',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
              }}
            >
              <Rocket size={16} />
              <span>ACCEPT MISSION & COMMENCE EVA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
