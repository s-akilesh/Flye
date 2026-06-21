import React from 'react';

export const KPISection = () => {
  const kpis = [
    { val: '350+', lbl: 'Projects Delivered' },
    { val: '120+', lbl: 'Project Kits Sold' },
    { val: '45+', lbl: 'Custom Builds' },
    { val: '4.9★', lbl: 'Customer Rating' }
  ];

  return (
    <div className="kpi-section">
      {kpis.map((kpi, idx) => (
        <div className="kpi-card" key={idx}>
          <div className="kpi-val">{kpi.val}</div>
          <div className="kpi-lbl">{kpi.lbl}</div>
        </div>
      ))}
    </div>
  );
};
