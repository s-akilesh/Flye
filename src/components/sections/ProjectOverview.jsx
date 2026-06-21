import React from 'react';
import { FEATURE_LABELS } from '../../constants/projectFeatures';

export const ProjectOverview = ({ project }) => {
  if (!project) return null;

  // Map database properties to the detail structures.
  // Generate mock details if fields are not fully defined.
  const objective = project.description;
  const howItWorks = `This system initializes standard sensor coordinates and reads parameters into the ${project.specifications?.controller || 'main controller'}. Based on configured thresholds, it communicates triggers to local relay/servo actuators or broadcasts wireless telemetry nodes.`;
  const applications = [
    `Educational physical setups for lab research`,
    `Custom prototyping designs for innovator kits`,
    `Academic engineering project implementations`
  ];
  const benefits = [
    `Ready-to-assemble structured components`,
    `Validated wiring diagrams and code bases`,
    `24/7 technical query troubleshooting support`
  ];

  const featuresList = ['hardware', 'code', 'circuit', 'docs', 'video', 'support'];

  return (
    <>
      {/* Package Inclusions */}
      <div className="detail-section card-glass">
        <h3>Project Package Inclusions</h3>
        <div className="includes-prominent-grid">
          {featuresList.map((f) => {
            const isIncluded = project.features?.includes(f) || false;
            return (
              <div key={f} className={`inc-grid-item ${isIncluded ? 'active' : ''}`}>
                <span className="inc-icon">{isIncluded ? '✓' : '✗'}</span>
                <span className="inc-lbl">{FEATURE_LABELS[f]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Overview & Operations */}
      <div className="detail-section card-glass">
        <h3>Project Overview & Operations</h3>
        <div className="overview-grid">
          <div className="overview-block">
            <h5>Objective</h5>
            <p>{objective}</p>
          </div>
          <div className="overview-block">
            <h5>How It Works</h5>
            <p>{howItWorks}</p>
          </div>
          <div className="overview-blocks-row">
            <div className="overview-block">
              <h5>Applications</h5>
              <ul className="overview-list">
                {applications.map((app, idx) => (
                  <li key={idx}>{app}</li>
                ))}
              </ul>
            </div>
            <div className="overview-block">
              <h5>Benefits</h5>
              <ul className="overview-list">
                {benefits.map((ben, idx) => (
                  <li key={idx}>{ben}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
