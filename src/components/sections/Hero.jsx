import React, { useState, useEffect } from 'react';

export const Hero = () => {
  const words = [
    'Robotics',
    'Electronic Projects',
    'IoT Solutions',
    '3D Printed Products',
    'Premade Projects & Kits',
    'Learning Resources'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionClass, setTransitionClass] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger slide-out upward
      setTransitionClass('fade-out');

      setTimeout(() => {
        // Change word content
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        // Swap classes to prepare slide-in from below
        setTransitionClass('fade-in');

        // Force animation frame reflow, then transition in
        requestAnimationFrame(() => {
          setTransitionClass('');
        });
      }, 400); // matches slide-out animation time
    }, 3000); // rotates every 3 seconds

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="system-title">
      <div className="subtitle">BUILD &bull; PRINT &bull; LEARN</div>
      <h1>From Concept to Creation</h1>
      <div className="dynamic-word-wrapper">
        <span className={`dynamic-word ${transitionClass}`}>{words[currentIndex]}</span>
      </div>
      <p className="desc">
        Transform ideas into reality with custom 3D printing, electronic project kits, robotics solutions, premade projects, and expert technical guidance designed for students, makers, innovators, schools, and colleges.
      </p>
    </div>
  );
};
