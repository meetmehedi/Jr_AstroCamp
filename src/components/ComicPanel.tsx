import React, { useState, useEffect } from 'react';
import type { ComicPanelData, SpeakerRole } from '../types/game';
import { Volume2, VolumeX, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ComicPanelProps {
  panels: ComicPanelData[];
  onAudioToggled?: (enabled: boolean) => void;
}

export const ComicPanel: React.FC<ComicPanelProps> = ({ panels }) => {
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);

  // Reset to panel 1 when a new event loads
  useEffect(() => {
    setActivePanelIndex(0);
  }, [panels]);

  const currentPanel = panels[activePanelIndex] || panels[0];

  // Web Speech API for voiceover so 3-4 year olds can listen
  useEffect(() => {
    if (isSpeechEnabled && 'speechSynthesis' in window && currentPanel) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentPanel.dialogue);
      utterance.rate = 1.0;
      utterance.pitch = currentPanel.speaker === 'CADET_MAYA' ? 1.3 : 0.85;
      window.speechSynthesis.speak(utterance);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
    // Use dialogue string + speaker as dep (not the panel object) to avoid re-fires on re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPanel?.dialogue, currentPanel?.speaker, isSpeechEnabled]);

  const getSpeakerDetails = (role: SpeakerRole) => {
    switch (role) {
      case 'CADET_MAYA':
        return {
          name: 'Cadet Maya (Age 6)',
          avatarColor: '#38bdf8',
          borderClass: 'border-cyan-400',
          titleColor: '#38bdf8',
          tag: 'JUNIOR ASTRONAUT',
          badge: '🚀'
        };
      case 'COMMANDER_DADU':
        return {
          name: 'Commander Dadu (Age 70)',
          avatarColor: '#43ffa0',
          borderClass: 'border-emerald-400',
          titleColor: '#43ffa0',
          tag: 'VETERAN FLIGHT ENGINEER',
          badge: '👨‍🚀'
        };
      case 'HOUSTON_CAPCOM':
        return {
          name: 'Houston CapCom',
          avatarColor: '#ffb454',
          borderClass: 'border-amber-400',
          titleColor: '#ffb454',
          tag: 'MISSION CONTROL',
          badge: '📡'
        };
      case 'SYSTEM_AI':
      default:
        return {
          name: 'Artemis Core AI',
          avatarColor: '#ef4444',
          borderClass: 'border-rose-400',
          titleColor: '#ef4444',
          tag: 'TELEMETRY OS',
          badge: '🤖'
        };
    }
  };

  const speaker = getSpeakerDetails(currentPanel.speaker);

  return (
    <div className="comic-panel-container">
      {/* Comic Page Navigation Bar */}
      <div className="comic-toolbar">
        <div className="comic-panel-tabs">
          {panels.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActivePanelIndex(idx)}
              className={`comic-tab-btn ${activePanelIndex === idx ? 'active' : ''}`}
            >
              Panel {idx + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            const nextState = !isSpeechEnabled;
            setIsSpeechEnabled(nextState);
            if (!nextState && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
          }}
          className="audio-read-toggle"
          title={isSpeechEnabled ? "Mute Read-Aloud Voiceover" : "Enable Read-Aloud Voiceover"}
        >
          {isSpeechEnabled ? (
            <>
              <Volume2 size={16} className="text-emerald-400" />
              <span>Voiceover: ON</span>
            </>
          ) : (
            <>
              <VolumeX size={16} className="text-slate-400" />
              <span>Voiceover: OFF</span>
            </>
          )}
        </button>
      </div>

      {/* The Active Graphic Novel Frame */}
      <div className="comic-frame">
        {/* Character Badge & Title */}
        <div className="comic-speaker-header">
          <div className="speaker-avatar-circle" style={{ borderColor: speaker.avatarColor }}>
            <span className="avatar-emoji">{speaker.badge}</span>
          </div>
          <div>
            <div className="speaker-name" style={{ color: speaker.titleColor }}>
              {speaker.name}
            </div>
            <div className="speaker-tag">{speaker.tag}</div>
          </div>
          <div className="comic-halftone-accent">
            {currentPanel.mood === 'warning' && <AlertTriangle className="text-amber-400 animate-pulse" size={20} />}
            {currentPanel.mood === 'heroic' && <ShieldCheck className="text-emerald-400" size={20} />}
            {currentPanel.mood === 'excited' && <Sparkles className="text-cyan-400" size={20} />}
          </div>
        </div>

        {/* Comic Speech Bubble */}
        <div className="comic-speech-bubble">
          <div className="speech-tail"></div>
          <p className="speech-text">"{currentPanel.dialogue}"</p>
        </div>

        {/* Panel Switcher Dots */}
        {panels.length > 1 && (
          <div className="panel-dots-row">
            {panels.map((_, i) => (
              <span
                key={i}
                onClick={() => setActivePanelIndex(i)}
                className={`panel-dot ${activePanelIndex === i ? 'active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
