import React from 'react';
import { BADGE_LABELS } from '../../constants/projectBadges';

export const Badge = ({ badgeType, className = '' }) => {
  if (!badgeType) return null;
  const label = BADGE_LABELS[badgeType] || badgeType;
  const badgeClass = badgeType.replace('-', '');
  
  return (
    <span className={`project-badge-tag ${badgeClass} ${className}`}>
      {label}
    </span>
  );
};
