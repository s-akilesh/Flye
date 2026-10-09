import React from 'react';

export const Modal = ({ isOpen, onClose, children, className = '', id, style, zIndex, overlayStyle }) => {
  return (
    <div
      id={id}
      className={`success-modal ${isOpen ? 'active' : ''}`}
      style={{
        zIndex: zIndex || 10000,
        ...overlayStyle
      }}
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
