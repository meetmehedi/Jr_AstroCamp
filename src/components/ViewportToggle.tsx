import React from 'react';
import { Box, Map as MapIcon } from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface ViewportToggleProps {
  is3DView: boolean;
  onSetView: (is3D: boolean) => void;
}

export const ViewportToggle: React.FC<ViewportToggleProps> = ({ is3DView, onSetView }) => (
  <div style={{
    display: 'flex',
    gap: '4px',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: '2px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  }}>
    <button
      onClick={() => { onSetView(true); soundFx.playClick(750); }}
      style={{
        padding: '3px 8px',
        fontSize: '0.7rem',
        fontWeight: 600,
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: is3DView ? '#38bdf8' : 'transparent',
        color: is3DView ? '#070a0e' : '#94a3b8',
        transition: 'all 0.15s ease',
      }}
    >
      <Box size={12} />
      <span>3D Live</span>
    </button>
    <button
      onClick={() => { onSetView(false); soundFx.playClick(650); }}
      style={{
        padding: '3px 8px',
        fontSize: '0.7rem',
        fontWeight: 600,
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: !is3DView ? '#38bdf8' : 'transparent',
        color: !is3DView ? '#070a0e' : '#94a3b8',
        transition: 'all 0.15s ease',
      }}
    >
      <MapIcon size={12} />
      <span>2D Map</span>
    </button>
  </div>
);
