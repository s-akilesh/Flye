import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

export const ProjectGrid = ({ projects, onRequestOrder }) => {
  const navigate = useNavigate();

  const handleCardClick = (e, proj) => {
    // If user clicks direct order / plus button, intercept
    if (e.target.closest('.btn-card-plus')) {
      if (onRequestOrder) {
        onRequestOrder(proj);
      } else {
        navigate(ROUTES.PROJECT_DETAILS.replace(':slug', proj.slug));
      }
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
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)) !important;
          gap: 16px !important;
          width: 100% !important;
        }

        .sample-product-card {
          display: flex;
          flex-direction: column;
          border-radius: 14px;
          background: var(--sys-surface, #12121a);
          border: 1px solid var(--sys-border, rgba(255, 255, 255, 0.08));
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }

        .sample-product-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .sample-product-card .card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #14141f;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sample-product-card .card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .sample-product-card:hover .card-img-wrap img {
          transform: scale(1.04);
        }

        .sample-product-card .card-pill-tag {
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 2;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: #ffffff;
          font-size: 9.5px;
          font-weight: 800;
          padding: 3px 7px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .sample-product-card .card-info-wrap {
          padding: 10px 10px 12px 10px;
          display: flex;
          flex-direction: column;
          flex: 1;
          justifyContent: space-between;
          gap: 4px;
        }

        .sample-product-card .card-title {
          font-size: 13px;
          font-weight: 700;
          margin: 0;
          color: var(--txt-primary, #ffffff);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.35;
          min-height: 35px;
          max-height: 35px;
        }

        .sample-product-card .card-meta {
          font-size: 11px;
          color: var(--txt-muted, #9ca3af);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sample-product-card .card-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          margin-top: 6px;
        }

        .sample-product-card .card-price {
          font-size: 13.5px;
          font-weight: 800;
          color: var(--txt-primary, #ffffff);
          white-space: nowrap;
        }

        .sample-product-card .btn-card-plus {
          width: 30px !important;
          height: 30px !important;
          min-width: 30px !important;
          border-radius: 50% !important;
          border: 1.5px solid var(--brand-primary, #38bdf8) !important;
          background: transparent !important;
          color: var(--brand-primary, #38bdf8) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          padding: 0 !important;
          flex-shrink: 0 !important;
          box-shadow: none !important;
          transition: all 0.2s ease !important;
        }

        .sample-product-card .btn-card-plus svg {
          stroke: var(--brand-primary, #38bdf8) !important;
          display: block !important;
        }

        [data-theme='light'] .sample-product-card .btn-card-plus {
          border: 1.5px solid var(--brand-primary, #0284c7) !important;
          background: transparent !important;
          color: var(--brand-primary, #0284c7) !important;
          box-shadow: none !important;
        }

        [data-theme='light'] .sample-product-card .btn-card-plus svg {
          stroke: var(--brand-primary, #0284c7) !important;
        }

        .sample-product-card .btn-card-plus:hover {
          background: var(--brand-primary, #38bdf8) !important;
          border-color: var(--brand-primary, #38bdf8) !important;
          color: #ffffff !important;
          transform: scale(1.08) !important;
        }

        .sample-product-card .btn-card-plus:hover svg {
          stroke: #ffffff !important;
        }

        [data-theme='light'] .sample-product-card .btn-card-plus:hover {
          background: var(--brand-primary, #0284c7) !important;
          border-color: var(--brand-primary, #0284c7) !important;
          color: #ffffff !important;
        }

        [data-theme='light'] .sample-product-card .btn-card-plus:hover svg {
          stroke: #ffffff !important;
        }

        /* Mobile Adjustments (<= 767px) */
        @media (max-width: 767px) {
          .project-marketplace-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .sample-product-card {
            border-radius: 14px !important;
          }
          .sample-product-card .card-info-wrap {
            padding: 8px 8px 10px 8px !important;
          }
          .sample-product-card .card-title {
            font-size: 12.5px !important;
            line-height: 1.35 !important;
            min-height: 34px !important;
            max-height: 34px !important;
          }
          .sample-product-card .card-meta {
            font-size: 10.5px !important;
          }
          .sample-product-card .card-price {
            font-size: 13px !important;
          }
          .sample-product-card .btn-card-plus {
            width: 28px !important;
            height: 28px !important;
            min-width: 28px !important;
          }
        }
      `}</style>
      <div className="project-marketplace-grid" id="project-marketplace-grid">
        {projects.map((proj) => {
          const displayPrice = (Number(proj.price) || 0).toLocaleString('en-IN');
          const badgeText = proj.badge === 'best-seller' 
            ? 'BEST SELLER' 
            : proj.badge === 'new' 
            ? 'NEW' 
            : proj.badge === 'student' 
            ? 'STUDENT' 
            : proj.badge 
            ? String(proj.badge).toUpperCase() 
            : null;

          return (
            <div
              key={proj.id}
              id={`project-card-${proj.id}`}
              className="sample-product-card"
              onClick={(e) => handleCardClick(e, proj)}
            >
              {/* Main Image Box */}
              <div className="card-img-wrap">
                {/* Badge Tag */}
                {badgeText && (
                  <span className="card-pill-tag">
                    {badgeText}
                  </span>
                )}

                {proj.images?.main ? (
                  <img
                    src={proj.images.main}
                    alt={proj.title}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="material-icons-outlined" style={{ fontSize: '32px', color: 'var(--txt-muted)' }}>image</span>
                )}
              </div>

              {/* Content Details */}
              <div className="card-info-wrap">
                {/* Row 1: Title (2 lines) */}
                <h3 className="card-title" title={proj.title}>
                  {proj.title}
                </h3>

                {/* Row 2: Subtitle / Meta from DB */}
                <div className="card-meta">
                  {proj.category || proj.domain || proj.level || 'Engineering Kit'}
                </div>

                {/* Row 3: Price + Plus Circle Button (Right to price) */}
                <div className="card-bottom-row">
                  {proj.price && Number(proj.price) > 0 ? (
                    <span className="card-price">
                      ₹{displayPrice}
                    </span>
                  ) : (
                    <span style={{ fontSize: '10.5px', color: 'var(--brand-primary)', fontWeight: '700', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      Price On Request
                    </span>
                  )}

                  <button
                    type="button"
                    className="btn-card-plus"
                    title="View details & order"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRequestOrder) onRequestOrder(proj);
                      else navigate(ROUTES.PROJECT_DETAILS.replace(':slug', proj.slug));
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
