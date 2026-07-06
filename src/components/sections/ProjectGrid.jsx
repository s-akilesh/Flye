import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ROUTES } from '../../constants/routes';

export const ProjectGrid = ({ projects, onRequestOrder }) => {
  const navigate = useNavigate();

  const handleCardClick = (e, proj) => {
    // If user clicks direct order button, intercept
    if (e.target.closest('.btn-card-order')) {
      onRequestOrder(proj);
      return;
    }
    
    // Otherwise route to detail page
    const detailUrl = ROUTES.PROJECT_DETAILS.replace(':slug', proj.slug);
    navigate(detailUrl);
  };

  return (
    <div className="project-marketplace-grid" id="project-marketplace-grid">
      {projects.map((proj) => {
        const diff = proj.difficulty || 'intermediate';
        const difficultyLabel = diff.charAt(0).toUpperCase() + diff.slice(1);
        return (
          <Card
            key={proj.id}
            id={`project-card-${proj.id}`}
            className="project-card-premium"
            onClick={(e) => handleCardClick(e, proj)}
          >
            <div className="card-top-row">
              <Badge badgeType={proj.badge} />
            </div>
            
            <div className="project-card-img">
              {proj.images?.main ? (
                <img
                  src={proj.images.main}
                  alt={proj.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    // Fallback to SVG placeholder on broken image
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <svg
                viewBox="0 0 48 48"
                style={{ display: proj.images?.main ? 'none' : 'block' }}
              >
                <rect x="10" y="10" width="28" height="28" rx="2" fill="none" />
                <path d="M15,24 L33,24" />
                <circle cx="24" cy="24" r="4" fill="none" />
              </svg>
            </div>

            <h3>{proj.title}</h3>
            <p className="card-desc">{proj.description}</p>
            
            <div className="card-spec-row">
              <span className={`status-pill diff-${diff}`}>{difficultyLabel}</span>
              <span className={`status-pill level-${proj.projectLevel?.toLowerCase()}`}>{proj.projectLevel}</span>
            </div>

            <div className="project-card-footer">
              <span className="project-card-price">₹{proj.price}</span>
              <Button type="button" variant="secondary" className="btn-card-order">Request Kit</Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
