import React from 'react';

export const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  id,
  min,
  max,
  required = false,
  style,
  ...props
}) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`form-input ${className}`.trim()}
      min={min}
      max={max}
      required={required}
      style={style}
      {...props}
    />
  );
};
