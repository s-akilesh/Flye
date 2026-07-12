import React from 'react';

/**
 * Reusable premium Skeleton component.
 * Supports various layouts and sizes, themed automatically via CSS.
 */
export const Skeleton = ({ variant = 'text', width, height, style, className = '' }) => {
  const getStyle = () => {
    const baseStyle = { ...style };
    if (width) baseStyle.width = width;
    if (height) baseStyle.height = height;
    return baseStyle;
  };

  if (variant === 'card') {
    return (
      <div className={`skeleton-card ${className}`} style={getStyle()}>
        <div className="skeleton" style={{ height: '140px', borderRadius: '12px' }} />
        <div className="skeleton skeleton-text title" style={{ marginTop: '8px' }} />
        <div className="skeleton skeleton-text" style={{ width: '90%' }} />
        <div className="skeleton skeleton-text" style={{ width: '75%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-3)', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: '60px', height: '20px', borderRadius: '10px' }} />
          <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '4px' }} />
        </div>
      </div>
    );
  }

  const variantClass = variant === 'circle' 
    ? 'skeleton-circle' 
    : variant === 'text' 
      ? 'skeleton-text' 
      : '';

  return (
    <div 
      className={`skeleton ${variantClass} ${className}`} 
      style={getStyle()} 
    />
  );
};
