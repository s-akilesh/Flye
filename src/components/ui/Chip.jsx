import React from 'react';

export const Chip = ({
  label,
  active = false,
  onClick,
  className = '',
  icon,
  id
}) => {
  const mergedClass = `${className} ${active ? 'active' : ''}`.trim();
  
  return (
    <button
      id={id}
      type="button"
      className={mergedClass}
      onClick={onClick}
      aria-pressed={active}
    >
      {icon && <span className="chip-icon">{icon}</span>}
      {label}
    </button>
  );
};
