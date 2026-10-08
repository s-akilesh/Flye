import React from 'react';
import { Footer } from '../../../shared/components/layout/Footer';

export const SupportLayout = ({
  badge = 'SUPPORT & POLICIES',
  title,
  description,
  version = '1.0.0',
  lastUpdated,
  children
}) => {
  return (
    <>
      <div className="flyen-support-page-root">
        <div className="flyen-support-container">
          
          {/* Top Header Banner */}
          <div className="flyen-support-header">
            <div className="flyen-support-badge-row">
              <span className="flyen-support-badge">{badge}</span>
            </div>
            <h1 className="flyen-support-title">{title}</h1>
            {description && <p className="flyen-support-desc">{description}</p>}
            <div className="flyen-support-meta-bar">
              <span>Version {version}</span>
              <span className="flyen-support-meta-dot">•</span>
              <span>Last Updated: {lastUpdated || 'October 2026'}</span>
            </div>
          </div>

          {/* Main Document Content Area (Clean Single-Column Layout) */}
          <main className="flyen-support-content-area">
            {children}
          </main>

        </div>
      </div>
      <Footer />
    </>
  );
};
