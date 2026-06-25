import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const NavigationCards = () => {
  const navigate = useNavigate();

  const handleMouseMove = (e, ref) => {
    if (window.innerWidth < 768) return;
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;
    
    const rotateX = ((y / height) - 0.5) * -6;
    const rotateY = ((x / width) - 0.5) * 6;
    
    card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (ref) => {
    const card = ref.current;
    if (!card) return;
    card.style.transform = 'translateY(0px) rotateX(0deg) rotateY(0deg)';
  };

  const CardWrapper = ({ route, children, subtitle, title, desc, ctaText, vectorSvg }) => {
    const ref = useRef(null);
    return (
      <section
        ref={ref}
        className="gateway-card"
        onMouseMove={(e) => handleMouseMove(e, ref)}
        onMouseLeave={() => handleMouseLeave(ref)}
        onClick={() => navigate(route)}
      >
        <div className="card-visual">{vectorSvg}</div>
        <div className="card-header-info">
          <span className="card-subtitle">{subtitle}</span>
          <h2 className="card-title">{title}</h2>
        </div>
        <p className="card-desc">{desc}</p>
        <div className="card-cta">
          <span>{ctaText}</span>
          <svg viewBox="0 0 24 24">
            <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
          </svg>
        </div>
      </section>
    );
  };

  return (
    <div className="card-deck">
      <CardWrapper
        route={ROUTES.PRINTING}
        subtitle="Shop & Services"
        title="3D Printing"
        desc="Custom functional parts, educational models, visual prototypes, and personalized products printed in high-fidelity materials."
        ctaText="Explore Printing"
        vectorSvg={
          <svg className="vector-printer" viewBox="0 0 100 100">
            <rect x="20" y="20" width="60" height="60" rx="3" />
            <line x1="20" y1="40" x2="80" y2="40" strokeDasharray="2 2" />
            <line x1="30" y1="20" x2="30" y2="80" />
            <line x1="70" y1="20" x2="70" y2="80" />
            <polygon className="vector-printer-model" points="50,45 68,55 68,75 50,85 32,75 32,55" />
            <rect x="42" y="32" width="16" height="8" rx="1" fill="#1e1e24" />
            <polygon points="47,40 53,40 50,45" fill="var(--accent-blue)" />
          </svg>
        }
      />

      <CardWrapper
        route={ROUTES.PROJECTS}
        subtitle="School & College Projects"
        title="Electronic Project Kits"
        desc="Ready-to-build microcontroller packages, smart robotics, automated IoT setups, GPS tracking, and sensors kits."
        ctaText="Browse Projects"
        vectorSvg={
          <svg className="vector-arduino" viewBox="0 0 100 100">
            <rect x="15" y="25" width="70" height="50" rx="4" />
            <rect className="vector-arduino-chip" x="48" y="38" width="22" height="22" rx="2" />
            <rect x="22" y="20" width="8" height="10" fill="#2d2d34" />
            <rect x="10" y="35" width="10" height="12" fill="#2d2d34" />
            <path className="vector-arduino-trace" d="M 22,25 L 22,35 L 48,35 M 15,41 L 35,41 L 48,46 M 75,30 L 75,45 L 70,45" />
          </svg>
        }
      />

      <CardWrapper
        route={ROUTES.LEARNING || '/learning'}
        subtitle="Videos and Consultation"
        title="Projects & Development"
        desc="High-grade engineering tutorials, detailed circuit schematics, custom code repositories, and expert implementation guidance."
        ctaText="Enter Workspace"
        vectorSvg={
          <div className="vector-code-window">
            <div style={{ display: 'flex', gap: '3px', marginBottom: '5px' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            </div>
            <div className="vector-code-line green"></div>
            <div className="vector-code-line purple"></div>
            <div className="vector-code-line blue" style={{ marginLeft: '8px' }}></div>
            <div className="vector-code-line green"></div>
          </div>
        }
      />
    </div>
  );
};
