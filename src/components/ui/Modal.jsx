import React from 'react';

export const Modal = ({ isOpen, onClose, children, className = '', id }) => {
  return (
    <div
      id={id}
      className={`success-modal ${isOpen ? 'active' : ''}`}
      onClick={onClose}
    >
      <div
        className={`modal-content ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
