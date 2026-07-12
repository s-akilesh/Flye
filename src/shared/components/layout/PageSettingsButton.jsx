import React from 'react';
import { useAuth } from '../../../modules/auth/context/AuthContext.jsx';

/**
 * PageSettingsButton Component
 * Renders a floating settings cog button fixed at the bottom right corner.
 * Only visible to authenticated administrators.
 *
 * @param {object} props
 * @param {function} props.onClick Callback when the button is clicked
 */
export const PageSettingsButton = ({ onClick }) => {
  const { user, isAdmin } = useAuth();

  // Guard: Only authenticated administrators can see the button
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '80px', // slightly offset from bottom navigation
        right: '24px',
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--brand-accent), var(--brand-primary))',
        border: 'none',
        outline: 'none',
        boxShadow: '0 0 20px var(--interaction-selected)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, filter 0.2s',
        color: 'var(--txt-inverse)'
      }}
      title="Page Settings"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) rotate(45deg)';
        e.currentTarget.style.boxShadow = '0 0 30px var(--interaction-selected)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        e.currentTarget.style.boxShadow = '0 0 20px var(--interaction-selected)';
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </button>
  );
};
