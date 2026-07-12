import React from 'react';
import { useTheme } from '../../../shared/context/ThemeContext';
import { SettingsSection } from '../../settings/components/SettingsSection';

export const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <SettingsSection 
      title="Appearance Settings" 
      description="Customize the look and feel of your Flyen console interface."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginTop: '8px' }}>
        
        {/* Dark Theme Selection Card */}
        <div 
          onClick={() => setTheme('dark')}
          className={`card-glass hover-lift ${theme === 'dark' ? 'active-selection' : ''}`}
          style={{
            padding: '20px',
            borderRadius: '12px',
            border: theme === 'dark' ? '2px solid var(--brand-primary)' : '1px solid var(--sys-border)',
            background: theme === 'dark' ? 'var(--interaction-selected)' : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'all 0.25s ease'
          }}
        >
          {/* Card Top / Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--txt-primary)' }}>Dark Theme</span>
            <div style={{ 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              border: '2px solid var(--brand-primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: theme === 'dark' ? 'var(--brand-primary)' : 'transparent'
            }}>
              {theme === 'dark' && (
                <span className="material-icons" style={{ fontSize: '12px', color: 'var(--txt-inverse)', fontWeight: 'bold' }}>check</span>
              )}
            </div>
          </div>

          {/* Graphical Mockup representation of Dark Theme */}
          <div style={{ 
            height: '100px', 
            background: '#08070d', 
            borderRadius: '8px', 
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* Header Mock */}
            <div style={{ height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', width: '100%' }} />
            
            {/* Main content split mocks */}
            <div style={{ display: 'flex', gap: '8px', height: '100%' }}>
              {/* Sidebar Mock */}
              <div style={{ width: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', height: '50px' }} />
              
              {/* Content Panel Mock */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', width: '70%' }} />
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', width: '40%' }} />
                <div style={{ height: '18px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '4px', width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Light Theme Selection Card */}
        <div 
          onClick={() => setTheme('light')}
          className={`card-glass hover-lift ${theme === 'light' ? 'active-selection' : ''}`}
          style={{
            padding: '20px',
            borderRadius: '12px',
            border: theme === 'light' ? '2px solid var(--brand-primary)' : '1px solid var(--sys-border)',
            background: theme === 'light' ? 'var(--interaction-selected)' : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'all 0.25s ease'
          }}
        >
          {/* Card Top / Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--txt-primary)' }}>Light Theme</span>
            <div style={{ 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              border: '2px solid var(--brand-primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: theme === 'light' ? 'var(--brand-primary)' : 'transparent'
            }}>
              {theme === 'light' && (
                <span className="material-icons" style={{ fontSize: '12px', color: 'var(--txt-inverse)', fontWeight: 'bold' }}>check</span>
              )}
            </div>
          </div>

          {/* Graphical Mockup representation of Light Theme */}
          <div style={{ 
            height: '100px', 
            background: '#f8fafc', 
            borderRadius: '8px', 
            border: '1px solid rgba(15,23,42,0.12)',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* Header Mock */}
            <div style={{ height: '14px', background: 'rgba(15,23,42,0.06)', borderRadius: '3px', width: '100%' }} />
            
            {/* Main content split mocks */}
            <div style={{ display: 'flex', gap: '8px', height: '100%' }}>
              {/* Sidebar Mock */}
              <div style={{ width: '30px', background: 'rgba(15,23,42,0.03)', borderRadius: '3px', height: '50px' }} />
              
              {/* Content Panel Mock */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ height: '12px', background: 'rgba(15,23,42,0.05)', borderRadius: '3px', width: '70%' }} />
                <div style={{ height: '8px', background: 'rgba(15,23,42,0.03)', borderRadius: '3px', width: '40%' }} />
                <div style={{ height: '18px', background: 'rgba(109,40,217,0.12)', border: '1px solid rgba(109,40,217,0.2)', borderRadius: '4px', width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </SettingsSection>
  );
};
