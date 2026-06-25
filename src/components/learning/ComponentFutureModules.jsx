import React from 'react';

export const ComponentFutureModules = () => {
  const modules = [
    {
      title: 'Circuit Simulation',
      desc: 'Interactive breadboard sandbox to build and test components virtually.'
    },
    {
      title: 'Practical Experiments',
      desc: 'Step-by-step guided hands-on lab experiments with hardware kits.'
    },
    {
      title: 'AI Lab Tutor',
      desc: 'Smart workspace mentor to ask questions and troubleshoot circuits.'
    }
  ];

  return (
    <div className="future-modules-row">
      {modules.map((mod, idx) => (
        <div key={idx} className="future-module-card">
          <div style={{ fontSize: '18px', filter: 'grayscale(0.5)' }}>
            {idx === 0 && '⚡'}
            {idx === 1 && '🔬'}
            {idx === 2 && '🤖'}
          </div>
          <h4>{mod.title}</h4>
          <p>{mod.desc}</p>
        </div>
      ))}
    </div>
  );
};
