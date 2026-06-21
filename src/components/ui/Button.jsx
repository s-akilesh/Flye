import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'none'
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  id
}) => {
  const baseClasses = variant !== 'none' ? `btn btn-${variant}` : '';
  const mergedClass = `${baseClasses} ${className}`.trim();

  return (
    <button
      id={id}
      type={type}
      className={mergedClass}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
