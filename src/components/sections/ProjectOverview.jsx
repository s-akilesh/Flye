import React from 'react';

export const ProjectOverview = ({ project }) => {
  if (!project) return null;

  // Map database properties to the detail structures.
  // Generate mock details if fields are not fully defined.
  const objective = project.description;
  const howItWorks = project.howItWorks || `This system initializes standard sensor coordinates and reads parameters into the ${project.specifications?.controller || 'main controller'}. Based on configured thresholds, it communicates triggers to local relay/servo actuators or broadcasts wireless telemetry nodes.`;
  const applications = project.applications && project.applications.length > 0
    ? project.applications
    : [
        `Educational physical setups for lab research`,
        `Custom prototyping designs for innovator kits`,
        `Academic engineering project implementations`
      ];
  const benefits = project.benefits && project.benefits.length > 0
    ? project.benefits
    : [
        `Ready-to-assemble structured components`,
        `Validated wiring diagrams and code bases`,
        `24/7 technical query troubleshooting support`
      ];

  return (
    <>

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
