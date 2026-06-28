import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { ProfileOnboardingModal } from '../components/auth/ProfileOnboardingModal';

export const StudentDashboard = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const studentName = profile?.full_name || user?.email?.split('@')[0] || 'Student';

  // Mocked state data aligned with MobileDrawer values
  const activeCourse = {
    name: 'Electrical Basics',
    progress: 68,
    lastActivity: '10 minutes ago'
  };

  const recents = [
    { title: 'Voltage', path: '/learning/fundamentals/electricity', type: 'Fundamental' },
    { title: 'Capacitor', path: '/learning/components/capacitor', type: 'Component' },
    { title: 'Resistor', path: '/learning/components/resistor', type: 'Component' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 0px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        fontFamily: 'Inter, sans-serif',
        color: 'var(--text-primary, #f3f4f6)'
      }}
    >
      {/* 1. Welcoming & Streaks Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0', color: '#fff', letterSpacing: '-0.5px' }}>
            Welcome back, {studentName} 👋
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary, #94a3b8)', margin: 0 }}>
            Ready to continue building your electronics knowledge?
          </p>
        </div>

        {/* Learning Streak Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(249, 115, 22, 0.08)',
          border: '1px solid rgba(249, 115, 22, 0.2)',
          padding: '10px 16px',
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(249, 115, 22, 0.05)'
        }}>
          <span style={{ fontSize: '20px' }}>🔥</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-orange, #f97316)' }}>3 Day Streak</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted, #64748b)' }}>Keep it up!</div>
          </div>
        </div>
      </div>

      {/* Profile Onboarding Banner Placeholder (Will be completed in Sprint 4) */}
      {!profile?.institution && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.05))',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          padding: '20px',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '24px' }}>🎓</span>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700', color: '#fff' }}>Complete your Profile</h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary, #94a3b8)' }}>Add your institution details to unlock certificates and progress tracking.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowOnboarding(true)}
            style={{
              background: 'var(--accent-violet, #8b5cf6)',
              border: 'none',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* 2. Primary Dashboard Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px'
      }} className="dashboard-grid">
        
        {/* Left Column: Learning Progress & Recents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Active Course Card */}
          <div style={{
            background: 'var(--bg-secondary, #111115)',
            border: '1px solid var(--border-color, rgba(255,255,255,0.04))',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Continue Learning</h3>
            
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              padding: '16px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '14px' }}>{activeCourse.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>Active {activeCourse.lastActivity}</span>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <span>Overall Module Progress</span>
                  <span style={{ fontWeight: '700', color: 'var(--accent-violet)' }}>{activeCourse.progress}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${activeCourse.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-violet))' }} />
                </div>
              </div>

              <button 
                onClick={() => navigate(ROUTES.LEARNING_FUNDAMENTALS)}
                style={{
                  alignSelf: 'flex-start',
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-violet, #8b5cf6)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: '4px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Resume Module →
              </button>
            </div>
          </div>

          {/* Recently Viewed */}
          <div style={{
            background: 'var(--bg-secondary, #111115)',
            border: '1px solid var(--border-color, rgba(255,255,255,0.04))',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Recently Visited</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recents.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => navigate(item.path)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)';
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>{item.title}</span>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-violet)', fontWeight: '700', textTransform: 'uppercase' }}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Bookmarks & Resources Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Bookmarks Placeholder */}
          <div style={{
            background: 'var(--bg-secondary, #111115)',
            border: '1px solid var(--border-color, rgba(255,255,255,0.04))',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Bookmarked Projects</h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '40px 20px',
              textAlign: 'center',
              border: '1px dashed rgba(255,255,255,0.06)',
              borderRadius: '8px',
              height: '100%'
            }}>
              <span style={{ fontSize: '20px' }}>🔖</span>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>
                No bookmarked projects yet. Start exploring the catalog to save your favorite builds!
              </p>
              <button 
                onClick={() => navigate(ROUTES.PROJECTS)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Browse Projects
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styling overrides */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <ProfileOnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </motion.div>
  );
};
