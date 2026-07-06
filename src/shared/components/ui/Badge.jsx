import React from 'react';
import { BADGE_LABELS } from '../../../modules/projects/constants/projectBadges';

export const Badge = ({ badgeType, className = '' }) => {
  if (!badgeType) return null;
  const normalized = badgeType.toLowerCase().replace(/[-_]/g, ' ');
  if (normalized === 'best seller') return null;
  const label = BADGE_LABELS[badgeType] || badgeType;
  const badgeClass = badgeType.replace('-', '');
  
  return (
    <span className={`project-badge-tag ${badgeClass} ${className}`}>
      {label}
    </span>
  );
};
