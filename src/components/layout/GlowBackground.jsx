import React from 'react';

export const GlowBackground = () => {
  return (
    <div className="lab-background">
      {/* Layer 2: Violet glow center */}
      <div className="glow-violet"></div>
      {/* Layer 3: Blue/Purple glow drifting */}
      <div className="glow-drifter"></div>
      {/* Layer 4: Secondary Violet glow */}
      <div className="glow-violet-secondary"></div>
    </div>
  );
};
