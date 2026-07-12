import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { ROUTES } from '../../../shared/constants/routes';
import { useVideos } from '../hooks/useVideos';

export const LearningHub = () => {
  const navigate = useNavigate();
  const { videos } = useVideos();

  // State
  const [activeVideo, setActiveVideo] = useState(videos[0] || null);
  const [isVideoTransitioning, setIsVideoTransitioning] = useState(false);
  
  // Form input states
  const [consultName, setConsultName] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultCategory, setConsultCategory] = useState('robotics');
  const [consultDesc, setConsultDesc] = useState('');
  const [consultReceipt, setConsultReceipt] = useState(null);

  const handlePlaylistItemClick = (item) => {
    setIsVideoTransitioning(true);
    setActiveVideo(item);
    setTimeout(() => {
      setIsVideoTransitioning(false);
    }, 200);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!consultName || !consultEmail || !consultDesc) return;
    
    setConsultReceipt({
      name: consultName,
      type: consultCategory.toUpperCase(),
      email: consultEmail
    });

    // Reset Form
    setConsultName('');
    setConsultEmail('');
    setConsultCategory('robotics');
    setConsultDesc('');
  };

  return (
    <motion.section
      className="portal-section"
      id="dev-portal"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="portal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button variant="secondary" className="btn-back" onClick={() => navigate(ROUTES.HOME)} style={{ padding: '8px', minWidth: 'auto' }}>
            <svg viewBox="0 0 24 24">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
            </svg>
          </Button>
          <div className="portal-title-area">
            <h2>Video Library & Consultation</h2>
            <p>Embedded Systems Engineering Support Portal</p>
          </div>
        </div>
      </div>

      <div className="portal-content custom-layout">
        {/* Videos Section */}
        <div className="video-library">
          <div className="video-player-container">
            <div
              className="video-placeholder"
              style={{ opacity: isVideoTransitioning ? 0.6 : 1, transition: 'opacity 0.2s ease' }}
            >
              {/* Play icon */}
              <svg className="play-icon" viewBox="0 0 24 24">
                <polygon points="8,5 19,12 8,19" />
              </svg>
              
              <div className="video-meta-pane">
                <span className="video-tag" id="active-video-tag">{activeVideo?.tag}</span>
                <h3 className="video-title" id="active-video-title">{activeVideo?.title}</h3>
              </div>
            </div>
          </div>

          {/* Playlist list */}
          <div className="video-playlist">
            {videos.map((item) => (
              <div
                key={item.id}
                className={`playlist-item ${activeVideo?.id === item.id ? 'active' : ''}`}
                onClick={() => handlePlaylistItemClick(item)}
              >
                <div className="playlist-thumb">
                  <svg viewBox="0 0 24 24">
                    <polygon points="8,5 19,12 8,19" />
                  </svg>
                </div>
                <div className="playlist-info">
                  <h5>{item.title}</h5>
                  <span>{item.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Consultation Form */}
        <div className="consultation-card">
          <h3>Consultation Request</h3>
          <form className="terminal-form" id="console-form" onSubmit={handleFormSubmit}>
            <div className="terminal-row">
              <label htmlFor="console-name">Name</label>
              <Input
                type="text"
                id="console-name"
                className="form-input"
                placeholder="e.g. Akilesh"
                required
                value={consultName}
                onChange={(e) => setConsultName(e.target.value)}
              />
            </div>
            
            <div className="terminal-row">
              <label htmlFor="console-email">Email</label>
              <Input
                type="email"
                id="console-email"
                className="form-input"
                placeholder="e.g. port@domain.com"
                required
                value={consultEmail}
                onChange={(e) => setConsultEmail(e.target.value)}
              />
            </div>
            
            <div className="terminal-row">
              <label htmlFor="console-project-type">Project Category</label>
              <select
                id="console-project-type"
                className="form-select"
                value={consultCategory}
                onChange={(e) => setConsultCategory(e.target.value)}
              >
                <option value="robotics">Robotics & Actuation Systems</option>
                <option value="iot">IoT Remote Telemetry Networks</option>
                <option value="pcb">Custom PCB Schematic & Layout</option>
                <option value="firmware">Embedded Microcontroller Firmware</option>
              </select>
            </div>
            
            <div className="terminal-row">
              <label htmlFor="console-desc">System Requirements</label>
              <textarea
                id="console-desc"
                className="form-textarea"
                placeholder="Outline schematic nodes, mechanical constraints, and firmware behaviors..."
                required
                value={consultDesc}
                onChange={(e) => setConsultDesc(e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" className="btn-terminal-submit">
              Book Free Consultation
            </Button>
          </form>
        </div>
      </div>

      {/* Success Receipt Modal */}
      <Modal isOpen={consultReceipt !== null} onClose={() => setConsultReceipt(null)}>
        <div className="modal-icon">
          <svg viewBox="0 0 24 24">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
        <h4>CONSULTATION REQUESTED</h4>
        <p>Your request has been logged successfully. Summary receipt details below.</p>
        
        {consultReceipt && (
          <div className="modal-receipt" id="receipt-meta">
            <div className="receipt-row">
              <span>CLIENT NODE:</span>
              <span className="receipt-val">{consultReceipt.name}</span>
            </div>
            <div className="receipt-row">
              <span>PROJECT FOCUS:</span>
              <span className="receipt-val">{consultReceipt.type}</span>
            </div>
            <div className="receipt-row">
              <span>REPLY PORT:</span>
              <span className="receipt-val">{consultReceipt.email}</span>
            </div>
            <div className="receipt-row" style={{ borderTop: '1px dashed var(--sys-border)', paddingTop: '8px', marginTop: '8px' }}>
              <span>STATUS:</span>
              <span className="receipt-val" style={{ color: 'var(--status-success)', fontWeight: 600 }}>
                LINK STABLE
              </span>
            </div>
          </div>
        )}
        
        <Button variant="secondary" className="modal-btn" onClick={() => setConsultReceipt(null)}>
          Close
        </Button>
      </Modal>
    </motion.section>
  );
};
