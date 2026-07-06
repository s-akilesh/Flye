import React from 'react';

export const Modal = ({ isOpen, onClose, children, className = '', id, style }) => {
  return (
    <div
      id={id}
      className={`success-modal ${isOpen ? 'active' : ''}`}
      onClick={onClose}
    >
      <div
        className={`modal-content ${className}`}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
