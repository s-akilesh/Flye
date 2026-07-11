import React, { useState, useEffect } from 'react';
import { SettingsLayout } from './SettingsLayout';
import { SettingsSection } from './SettingsSection';
import { useAuth } from '../../auth/context/AuthContext.jsx';
import { activityLogService } from '../../../services/activityLogService';
import { Button } from '../../../shared/components/ui/Button';

export const ActivitySummary = ({ onBack, hideBreadcrumbs = false, hideCancel = false }) => {
  const { user } = useAuth();
  
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalLogs, setTotalLogs] = useState(0);

  // Pagination & view expansion states
  const [isExpanded, setIsExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchLogs = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const queryLimit = isExpanded ? limit : 10;
      const queryPage = isExpanded ? page : 1;
      
      const result = await activityLogService.getLogs({
        page: queryPage,
        limit: queryLimit,
        userId: user.id
      });
      setLogs(result.logs || []);
      setTotalLogs(result.total || 0);
    } catch (err) {
      console.error('Failed to load user activity logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user, isExpanded, page, limit]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    if (status === 'SUCCESS') return 'var(--accent-emerald, #10b981)';
    if (status === 'FAILED') return 'var(--accent-red, #ef4444)';
    return 'var(--text-muted)';
  };

  const totalPages = Math.ceil(totalLogs / limit);

  return (
    <SettingsLayout
      title="Activity Summary"
      description="Review your recent portal logins, security updates, and active session records."
      categoryName="Administration"
      isDirty={false}
      isLoading={isLoading}
      onSave={() => {}}
      onCancel={onBack}
      hideBreadcrumbs={hideBreadcrumbs}
      hideCancel={hideCancel}
    >
      <SettingsSection title="Recent Portal History" description="A complete chronological log of actions taken by your account.">
        
        {/* Logs Table */}
        <div style={{ overflowX: 'auto', background: 'rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)' }}>Action</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)' }}>Details</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)' }}>Timestamp</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '12px 16px', color: '#fff', fontWeight: '700' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-violet)' }}>
                      [{log.module}]
                    </span>
                    <br />
                    {log.action}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{log.description}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatDate(log.created_at)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span 
                      style={{ 
                        fontSize: '10px', 
                        fontWeight: '700', 
                        color: getStatusColor(log.status), 
                        background: `${getStatusColor(log.status)}15`,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: `1px solid ${getStatusColor(log.status)}25`
                      }}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No recent activities recorded for this account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* View All & Pagination Controls */}
        {!isExpanded ? (
          totalLogs > 10 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <Button 
                variant="secondary" 
                onClick={() => setIsExpanded(true)}
                style={{ fontSize: '12px', padding: '8px 16px' }}
              >
                View All Activity Logs ({totalLogs})
              </Button>
            </div>
          )
        ) : (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginTop: '16px',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            {/* Limit Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                style={{
                  background: '#18181b',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  outline: 'none'
                }}
              >
                {[10, 20, 50].map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button
                variant="secondary"
                disabled={page === 1 || isLoading}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                style={{ padding: '6px 12px', minWidth: 'auto', fontSize: '12px' }}
              >
                Prev
              </Button>
              <span style={{ fontSize: '12px', color: '#fff' }}>
                Page {page} of {totalPages || 1}
              </span>
              <Button
                variant="secondary"
                disabled={page === totalPages || isLoading}
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                style={{ padding: '6px 12px', minWidth: 'auto', fontSize: '12px' }}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </SettingsSection>
    </SettingsLayout>
  );
};
