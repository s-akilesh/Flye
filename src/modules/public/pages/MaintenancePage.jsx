import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../../settings/hooks/useSettings';
import { Card } from '../../../shared/components/ui/Card';

export const MaintenancePage = () => {
  const { settings } = useSettings();

  return (
    <motion.section
      className="portal-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 160px)',
        padding: 'var(--space-4)'
      }}
    >
      <Card
        className="card-glass"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: 'var(--space-6)',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px'
          }}>
            🛠️
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: 'var(--space-2)' }}>
          System Maintenance
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: 'var(--space-5)', lineHeight: 1.5 }}>
          {settings.companyName} is currently undergoing scheduled maintenance to upgrade our platform. We will be back online shortly.
        </p>

        <div style={{
          padding: 'var(--space-3)',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
            Need urgent assistance? Contact us at <a href={`mailto:${settings.contactEmail}`} style={{ color: 'var(--accent-violet)', textDecoration: 'none' }}>{settings.contactEmail}</a>
          </p>
        </div>
      </Card>
    </motion.section>
  );
};
