import React from 'react';

export const Dropdown = ({ options, value, onChange, className = '', id }) => {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={`sort-select ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
