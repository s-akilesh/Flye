import React from 'react';
import { ProjectGrid } from './ProjectGrid';

export const RelatedProjects = ({ relatedProjects, onRequestOrder }) => {
  return (
    <div className="detail-section">
      <h3 style={{ marginBottom: '20px' }}>Related Prototyping Kits</h3>
      <ProjectGrid projects={relatedProjects} onRequestOrder={onRequestOrder} />
    </div>
  );
};
