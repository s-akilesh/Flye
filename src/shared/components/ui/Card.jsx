import React from 'react';

export const Card = ({ children, className = '', onClick, id, style }) => {
  return (
    <div
      id={id}
      className={`card-glass ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};
