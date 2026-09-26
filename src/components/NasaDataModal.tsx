import React from 'react';
import { NASA_DATASETS } from '../data/nasaDatasets';
import { Database, ExternalLink, X } from 'lucide-react';

interface NasaDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NasaDataModal: React.FC<NasaDataModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Database size={20} className="text-emerald-400" />
            <span className="modal-title">NASA Open Datasets & Scientific Citations</span>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <p className="modal-intro">
          In strict compliance with NASA Space Apps Challenge 2026 judging criteria, all simulation constants, physical models, and environmental hazards in <strong>Astro Camp: Outpost Command</strong> are mathematically derived from the following peer-reviewed NASA technical reports and open telemetry repositories:
        </p>

        <div className="dataset-cards-list">
          {NASA_DATASETS.map((ds) => (
            <div key={ds.id} className="dataset-item-card">
              <div className="dataset-item-header">
                <div>
                  <div className="dataset-item-name">{ds.name}</div>
                  <div className="dataset-item-meta">
                    <span className="text-cyan-400 font-mono">{ds.citationDoc}</span> · <span>{ds.missionOrCenter}</span>
                  </div>
                </div>
                <a
                  href={ds.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dataset-link-btn"
                  title="View Official NASA Document"
                >
                  <span>NASA Docs</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <p className="dataset-item-app">
                <strong className="text-emerald-400">Implementation in Game: </strong>
                {ds.applicationInOutpost}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
