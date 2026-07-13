import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../shared/components/ui/Badge';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { ROUTES } from '../../../shared/constants/routes';
import { CATEGORY_LABELS } from '../constants/categories';

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
        @media (max-width: 767px) {
          .project-card-thumbnails {
            display: none !important;
          }
        }
      `}</style>
      <div className="project-marketplace-grid" id="project-marketplace-grid">
        {projects.map((proj) => {
          const categoryLabel = CATEGORY_LABELS[proj.category] || proj.category || 'General';
          const displayPrice = (Number(proj.price) || 0).toLocaleString('en-IN');

          return (
            <Card
              key={proj.id}
              id={`project-card-${proj.id}`}
              className="project-card-premium"
              onClick={(e) => handleCardClick(e, proj)}
              style={{ 
                padding: '16px', 
                borderRadius: '16px', 
                background: 'var(--sys-surface)', 
                border: '1px solid var(--sys-border)',
                position: 'relative',
                width: '320px',
                boxSizing: 'border-box'
              }}
            >

              {/* Main Image Box */}
              <div className="project-card-img" style={{ height: '140px', background: 'var(--interaction-hover)', border: 'none', overflow: 'hidden', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <svg
                  viewBox="0 0 48 48"
                  style={{ display: proj.images?.main ? 'none' : 'block', width: '40px', height: '40px', stroke: 'var(--txt-muted)' }}
                >
                  <rect x="10" y="10" width="28" height="28" rx="2" fill="none" />
                  <path d="M15,24 L33,24" />
                  <circle cx="24" cy="24" r="4" fill="none" />
                </svg>
              </div>

            {/* Title */}
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--txt-primary)', margin: '0 0 4px 0', textTransform: 'capitalize', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '40px', lineHeight: '1.25' }}>
              {proj.title}
            </h3>

            {/* Category / Subtitle */}
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--status-warning)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              {categoryLabel}
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px', height: '24px' }}>
              {proj.price && Number(proj.price) > 0 ? (
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--txt-primary)' }}>₹{displayPrice}</span>
              ) : (
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--brand-accent)' }}>Contact Us for Pricing</span>
              )}
            </div>

            {/* CTA Request Button */}
            <div style={{ marginTop: 'auto' }}>
              <Button
                type="button"
                variant="none"
                className="btn-card-order"
                style={{
                  width: '100%',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  background: 'var(--interaction-hover)',
                  border: '1px solid var(--sys-border)',
                  borderRadius: '8px',
                  color: 'var(--txt-primary)',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer'
                }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                REQUEST KIT
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
    </>
  );
};
