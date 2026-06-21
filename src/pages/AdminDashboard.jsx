import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../constants/routes';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('flyen_admin_access');
    // Dispatch storage event so the Header component detects it instantly
    window.dispatchEvent(new Event('storage'));
    navigate(ROUTES.ADMIN_ACCESS);
  };

  return (
    <motion.section
      className="portal-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
    >
      <div className="portal-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="portal-title-area">
          <h2>Admin Portal Dashboard</h2>
          <p>Central control console for Flyen catalog and client lead management</p>
        </div>
        <div className="portal-header-meta">
          <Button
            variant="ghost"
            onClick={handleLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--accent-crimson, #ef4444)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
          >
            🚪 Logout Session
          </Button>
        </div>
      </div>

      <div className="portal-content">
        <div className="admin-dashboard-grid">
          {/* Projects Desk */}
          <Card
            className="card-glass hover-lift"
            onClick={() => navigate(ROUTES.ADMIN_PROJECTS)}
            style={{
              padding: 'var(--space-5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              minHeight: '220px'
            }}
          >
            <div>
              <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>🛠️</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                Manage Projects
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 'var(--space-2)', lineHeight: '1.5' }}>
                Add new engineering project kits, edit catalog details, modify pricing tier tags, adjust component hardware inventories, and maintain detailed build schematics.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                Open Projects Desk &rarr;
              </span>
            </div>
          </Card>

          {/* Enquiries Desk */}
          <Card
            className="card-glass hover-lift"
            onClick={() => navigate(ROUTES.ADMIN_ENQUIRIES)}
            style={{
              padding: 'var(--space-5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              minHeight: '220px'
            }}
          >
            <div>
              <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>📋</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                Manage Enquiries
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 'var(--space-2)', lineHeight: '1.5' }}>
                Audit customer kit fabrication requests, manage lead statuses (New, Contacted, Qualified, Closed), log callback callback notes, and track request volumes.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                Open Enquiries Desk &rarr;
              </span>
            </div>
          </Card>
        </div>
      </div>
    </motion.section>
  );
};
