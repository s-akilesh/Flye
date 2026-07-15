import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { ROUTES } from '../../../shared/constants/routes';

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
    <>
      <style>{`
        .project-marketplace-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, 320px) !important;
          gap: 20px 16px !important;
          justify-content: center !important;
        }
        
        /* Desktop Layout (min-width: 768px) */
        @media (min-width: 768px) {
          .project-card-premium {
            display: flex !important;
            flex-direction: column !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            box-sizing: border-box !important;
          }
          .project-card-premium .project-card-img {
            width: 100% !important;
            height: 120px !important;
            margin-bottom: 0 !important;
          }
          .project-card-premium .product-details {
            padding: 16px 12px 12px 12px !important;
            display: flex !important;
            flex-direction: column !important;
            flex: 1 !important;
            gap: 6px !important;
          }
        }

        /* Mobile Layout (max-width: 767px) */
        @media (max-width: 767px) {
          .project-card-thumbnails {
            display: none !important;
          }
          .project-marketplace-grid {
            grid-template-columns: 1fr !important;
          }
          .project-card-premium {
            display: flex !important;
            flex-direction: row !important;
            padding: 12px !important;
            gap: 12px !important;
            width: 100% !important;
            height: auto !important;
            align-items: center !important;
            box-sizing: border-box !important;
          }
          .project-card-premium .project-card-img {
            width: 90px !important;
            height: 90px !important;
            flex-shrink: 0 !important;
            border-radius: 8px !important;
            margin-bottom: 0 !important;
          }
          .project-card-premium .product-details {
            padding: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            flex: 1 !important;
            gap: 6px !important;
            min-width: 0 !important;
          }
          .project-card-premium h3 {
            font-size: 13px !important;
            height: auto !important;
            max-height: 36px !important;
            line-height: 1.3 !important;
            margin: 0 !important;
          }
          .project-card-premium .btn-card-order, 
          .project-card-premium button {
            height: 30px !important;
            font-size: 11px !important;
            margin-top: 4px !important;
          }
        }
      `}</style>
      <div className="project-marketplace-grid" id="project-marketplace-grid">
        {projects.map((proj) => {
          const displayPrice = (Number(proj.price) || 0).toLocaleString('en-IN');

          return (
            <Card
              key={proj.id}
              id={`project-card-${proj.id}`}
              className="project-card-premium"
              onClick={(e) => handleCardClick(e, proj)}
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                flexDirection: 'column', 
                border: '1px solid var(--sys-border)', 
                borderRadius: '12px', 
                background: 'var(--sys-surface)', 
                overflow: 'hidden', 
                transition: 'all 0.2s ease', 
                position: 'relative',
                width: '100%',
                padding: 0,
                boxSizing: 'border-box'
              }}
            >
              {/* Badge overlay on image */}
              {proj.badge && (
                <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10 }}>
                  <span className={`project-badge-tag ${proj.badge}`}>
                    {proj.badge === 'best-seller' ? 'Best Seller' : proj.badge === 'new' ? 'New Release' : proj.badge === 'student' ? 'Student Project' : proj.badge}
                  </span>
                </div>
              )}

              {/* Main Image Box */}
              <div className="project-card-img" style={{ background: 'rgba(255, 255, 255, 0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                {proj.images?.main ? (
                  <img
                    src={proj.images.main}
                    alt={proj.title}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                ) : (
                  <span className="material-icons-outlined" style={{ fontSize: '32px', color: 'var(--txt-muted)' }}>image</span>
                )}
              </div>

              {/* Content Details */}
              <div className="product-details">
                
                {/* Title */}
                <h3 style={{ fontSize: '13.5px', fontWeight: '500', margin: 0, color: 'var(--txt-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px', lineHeight: '1.4' }}>
                  {proj.title}
                </h3>

                {/* Pricing block */}
                <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
                  {proj.price && Number(proj.price) > 0 ? (
                    <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--txt-primary)' }}>
                      ₹{displayPrice}
                    </span>
                  ) : (
                    <span style={{ fontSize: '13px', color: 'var(--brand-primary)', fontWeight: '600', textTransform: 'uppercase' }}>
                      Price On Request
                    </span>
                  )}
                </div>

                {/* Full-width View Details button */}
                <Button
                  type="button"
                  variant="primary"
                  style={{ width: '100%', height: '34px', fontSize: '11.5px', fontWeight: '600', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <span className="material-icons-outlined" style={{ fontSize: '15px' }}>shopping_cart</span>
                  View Details
                </Button>
              </div>
            </Card>
          );
        })}
    </div>
    </>
  );
};
