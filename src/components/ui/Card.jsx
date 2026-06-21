import React from 'react';

export const Card = ({ children, className = '', onClick, id }) => {
  return (
    <div
      id={id}
      className={`card-glass ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
