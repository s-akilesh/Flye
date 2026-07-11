import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { Input } from '../../../shared/components/ui/Input';
import { useToast } from '../../../shared/context/ToastContext';
import { exportActivityLogsToExcel } from '../../../shared/utils/excel';
import {
  activityLogService,
  ACTIVITY_MODULES,
  ACTIVITY_STATUS,
  ACTIVITY_SEVERITY
} from '../../../services/activityLogService';

export const ActivityLogs = () => {
  const { showToast } = useToast();
  
  // State variables
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  
  // Filters
  const [moduleFilter, setModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');
  
  // States for loaders and overlays
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, today: 0, failed: 0, activeUsersCount: 0 });
  const [selectedLog, setSelectedLog] = useState(null);
  


  // Load logs and metrics whenever filters or pagination parameters modify
  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await activityLogService.getLogs({
        page,
        limit,
        module: moduleFilter,
        status: statusFilter,
        severity: severityFilter,
        startDate,
        endDate,
        search
      });
      setLogs(data.logs);
      setTotal(data.total);
    } catch (err) {
      showToast('Failed to retrieve activity log rows.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    setIsStatsLoading(true);
    try {
      const metrics = await activityLogService.getStats();
      setStats(metrics);
    } catch (err) {
      console.error('Stats loading failed:', err);
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page, limit, moduleFilter, statusFilter, severityFilter, startDate, endDate, search]);

  useEffect(() => {
    loadStats();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset page on query updates
  };

  const handleFilterChange = (filterSetter, val) => {
    filterSetter(val);
    setPage(1);
  };



  // Excel Spreadsheet Export Helper
  const handleExportExcel = async () => {
    try {
      showToast('Preparing Excel workbook export...', 'info');
      const res = await activityLogService.getLogs({
        page: 1,
        limit: 1000, // Export up to 1000 matching logs
        module: moduleFilter,
        status: statusFilter,
        severity: severityFilter,
        startDate,
        endDate,
        search
      });
      
      if (res.logs.length === 0) {
        showToast('No logs found matching selection filters.', 'warning');
        return;
      }
      
      await exportActivityLogsToExcel(res.logs);
      showToast('Excel export downloaded successfully!', 'success');
    } catch (err) {
      showToast('Excel export failed.', 'error');
    }
  };

  // CSV Text Export Helper
  const handleExportCSV = async () => {
    try {
      showToast('Preparing CSV spreadsheet export...', 'info');
      const res = await activityLogService.getLogs({
        page: 1,
        limit: 1000,
        module: moduleFilter,
        status: statusFilter,
        severity: severityFilter,
        startDate,
        endDate,
        search
      });
      
      if (res.logs.length === 0) {
        showToast('No logs found matching selection filters.', 'warning');
        return;
      }

      const headers = ['Log ID', 'Time', 'User', 'Module', 'Action', 'Description', 'Status', 'Severity', 'Source', 'Entity Type', 'Entity ID', 'User Agent'];
      const rows = res.logs.map(log => [
        `LOG-${log.id.slice(0, 8).toUpperCase()}`,
        log.created_at ? new Date(log.created_at).toLocaleString('en-IN') : 'N/A',
        log.profiles?.full_name || 'System',
        log.module,
        log.action,
        log.description,
        log.status,
        log.severity,
        log.source,
        log.entity_type || '-',
        log.entity_id || '-',
        log.user_agent || '-'
      ]);
      
      const csvString = [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `flyen_activity_logs_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast('CSV export downloaded successfully!', 'success');
    } catch (err) {
      showToast('CSV export failed.', 'error');
    }
  };

  // Styled status pill helper
  const getStatusBadgeStyle = (status) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return {
          background: 'rgba(16, 185, 129, 0.08)',
          color: 'var(--accent-emerald, #10b981)',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '700',
          display: 'inline-block'
        };
      case 'FAILED':
        return {
          background: 'rgba(239, 68, 68, 0.08)',
          color: 'var(--accent-crimson, #ef4444)',
          border: '1px solid rgba(239, 68, 68, 0.15)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '700',
          display: 'inline-block'
        };
      case 'WARNING':
        return {
          background: 'rgba(245, 158, 11, 0.08)',
          color: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.15)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '700',
          display: 'inline-block'
        };
      default:
        return {
          background: 'rgba(59, 130, 246, 0.08)',
          color: 'var(--accent-blue, #3b82f6)',
          border: '1px solid rgba(59, 130, 246, 0.15)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '700',
          display: 'inline-block'
        };
    }
  };

  // Render Metadata parser
  const renderMetadataFields = (meta) => {
    if (!meta || Object.keys(meta).length === 0) {
      return <span style={{ color: 'var(--text-muted, #6b7280)' }}>No additional parameters</span>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '12px' }}>
        {Object.entries(meta).map(([key, val]) => {
          if (key === 'userAgent') return null; // Already shown in layout
          
          let parsedVal = typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
          return (
            <div key={key} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <span style={{ fontSize: '12.5px', color: '#f3f4f6', wordBreak: 'break-all', whiteSpace: 'pre-wrap', fontFamily: typeof val === 'object' ? 'monospace' : 'inherit' }}>
                {parsedVal}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Pagination coordinates
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <motion.section
      id="activity-logs-portal"
      className="portal-section page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
    >
      <div className="portal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div className="portal-title-area">
          <h2>Activity Audit Logs</h2>
          <p>Centralized monitoring, security auditing, and system operations logging across Flyen modules</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" onClick={handleExportCSV} style={{ height: '36px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons-outlined" style={{ fontSize: '16px' }}>download</span>
            Export CSV
          </Button>
          <Button variant="primary" onClick={handleExportExcel} style={{ height: '36px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons-outlined" style={{ fontSize: '16px' }}>table_view</span>
            Export Excel
          </Button>
        </div>
      </div>

      <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
        
        {/* KPI metrics row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <Card style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="material-icons" style={{ color: 'var(--accent-violet)', fontSize: '20px', background: 'rgba(139,92,246,0.08)', padding: '10px', borderRadius: '8px' }}>list_alt</span>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #6b7280)', fontWeight: '600', textTransform: 'uppercase' }}>Total Events</span>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '4px 0 0 0' }}>{isStatsLoading ? '...' : stats.total}</h3>
            </div>
          </Card>
          <Card style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="material-icons" style={{ color: 'var(--accent-blue)', fontSize: '20px', background: 'rgba(59,130,246,0.08)', padding: '10px', borderRadius: '8px' }}>today</span>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #6b7280)', fontWeight: '600', textTransform: 'uppercase' }}>Logged Today</span>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '4px 0 0 0' }}>{isStatsLoading ? '...' : stats.today}</h3>
            </div>
          </Card>
          <Card style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="material-icons" style={{ color: 'var(--accent-crimson, #ef4444)', fontSize: '20px', background: 'rgba(239,68,68,0.08)', padding: '10px', borderRadius: '8px' }}>error_outline</span>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #6b7280)', fontWeight: '600', textTransform: 'uppercase' }}>Failed Ops</span>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '4px 0 0 0' }}>{isStatsLoading ? '...' : stats.failed}</h3>
            </div>
          </Card>
          <Card style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="material-icons" style={{ color: 'var(--accent-emerald, #10b981)', fontSize: '20px', background: 'rgba(16,185,129,0.08)', padding: '10px', borderRadius: '8px' }}>people_outline</span>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #6b7280)', fontWeight: '600', textTransform: 'uppercase' }}>Active Users</span>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '4px 0 0 0' }}>{isStatsLoading ? '...' : stats.activeUsersCount}</h3>
            </div>
          </Card>
        </div>

        {/* Main Listing & Filters Panel */}
        <Card style={{ background: 'rgba(10, 10, 15, 0.25)', border: '1px solid rgba(255,255,255,0.06)', padding: 0, overflow: 'hidden' }}>
          
          {/* Filters Area */}
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255, 255, 255, 0.01)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              
              {/* Search */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase' }}>Search logs</label>
                <Input
                  type="text"
                  placeholder="Filter by description..."
                  value={search}
                  onChange={handleSearchChange}
                  className="form-input"
                  style={{
                    height: '38px',
                    background: 'rgba(15, 15, 25, 0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '0 12px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Module Filter */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase' }}>Module</label>
                <select
                  value={moduleFilter}
                  onChange={(e) => handleFilterChange(setModuleFilter, e.target.value)}
                  style={{
                    height: '38px',
                    background: 'rgba(15, 15, 25, 0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '0 12px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">All Modules</option>
                  {Object.entries(ACTIVITY_MODULES).map(([key, label]) => (
                    <option key={key} value={label}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase' }}>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
                  style={{
                    height: '38px',
                    background: 'rgba(15, 15, 25, 0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '0 12px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">All Statuses</option>
                  {Object.entries(ACTIVITY_STATUS).map(([key, label]) => (
                    <option key={key} value={label}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Date Filters */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase' }}>From Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleFilterChange(setStartDate, e.target.value)}
                  className="form-input"
                  style={{
                    height: '38px',
                    background: 'rgba(15, 15, 25, 0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '0 12px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase' }}>To Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleFilterChange(setEndDate, e.target.value)}
                  className="form-input"
                  style={{
                    height: '38px',
                    background: 'rgba(15, 15, 25, 0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '0 12px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

            </div>
          </div>

          {/* Table Container */}
          {isLoading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted, #6b7280)' }}>
              Loading activity logs...
            </div>
          ) : logs.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted, #6b7280)' }}>
              No activities found matching criteria.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #6b7280)', fontWeight: '700' }}>Log ID</th>
                    <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #6b7280)', fontWeight: '700' }}>Time</th>
                    <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #6b7280)', fontWeight: '700' }}>User</th>
                    <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #6b7280)', fontWeight: '700' }}>Module</th>
                    <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #6b7280)', fontWeight: '700' }}>Action</th>
                    <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #6b7280)', fontWeight: '700' }}>Description</th>
                    <th style={{ padding: '14px 20px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #6b7280)', fontWeight: '700' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      className="table-row-hover"
                    >
                      <td style={{ padding: '14px 20px', fontSize: '12.5px', fontWeight: 'bold', color: 'var(--accent-violet, #8b5cf6)', fontFamily: 'monospace' }}>
                        {`LOG-${log.id.slice(0, 8).toUpperCase()}`}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-secondary, #d1d5db)' }}>
                        {new Date(log.created_at).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: '#fff', fontWeight: '600' }}>
                        {log.profiles?.full_name || 'System'}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '12px' }}>
                        <span style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'var(--text-secondary, #d1d5db)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          {log.module}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '12.5px', color: 'var(--text-muted, #9ca3af)', fontWeight: 'bold' }}>
                        {log.action}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: '#fff', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.description}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={getStatusBadgeStyle(log.status)}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255, 255, 255, 0.01)', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted, #9ca3af)' }}>
                Showing Page {page} of {totalPages} ({total} events logged)
              </span>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted, #9ca3af)' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted, #9ca3af)' }}>Rows per page:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="form-input"
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    height: '28px',
                    width: '70px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '4px',
                    color: '#fff'
                  }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>



      </div>

      {/* Details drawer Modal */}
      {selectedLog && (
        <Modal
          isOpen={selectedLog !== null}
          onClose={() => setSelectedLog(null)}
          title="Activity Details"
          style={{ maxWidth: '680px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0', textAlign: 'left' }}>
            
            {/* Meta Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px', textAlign: 'left' }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '4px' }}>Log ID</span>
                <span style={{ fontSize: '14px', color: 'var(--accent-violet, #8b5cf6)', fontWeight: 'bold', fontFamily: 'monospace' }}>
                  {`LOG-${selectedLog.id.slice(0, 8).toUpperCase()}`}
                </span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '4px' }}>Logged Time</span>
                <span style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>
                  {new Date(selectedLog.created_at).toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '4px' }}>Action TriggeredBy</span>
                <span style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>
                  {selectedLog.profiles?.full_name || 'System'}
                </span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '4px' }}>Source / Origin</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary, #d1d5db)', fontWeight: 'bold' }}>
                  {selectedLog.source}
                </span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '4px' }}>Severity Level</span>
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 'bold',
                  color: selectedLog.severity === 'CRITICAL' || selectedLog.severity === 'ERROR' ? 'var(--accent-crimson, #ef4444)' : selectedLog.severity === 'WARNING' ? '#f59e0b' : 'var(--accent-blue, #3b82f6)'
                }}>
                  {selectedLog.severity}
                </span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '4px' }}>Target Entity</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary, #d1d5db)', wordBreak: 'break-all' }}>
                  {selectedLog.entity_type ? `${selectedLog.entity_type} (ID: ${selectedLog.entity_id || 'N/A'})` : 'None'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '6px' }}>Event Message</span>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: 0, lineHeight: '1.4' }}>
                {selectedLog.description}
              </h4>
            </div>

            {/* Formatted Metadata */}
            <div style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '6px' }}>Metadata Parameters</span>
              {renderMetadataFields(selectedLog.metadata)}
            </div>

            {/* User Agent */}
            <div style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted, #6b7280)', textTransform: 'uppercase', marginBottom: '6px' }}>User Agent Coordinates</span>
              <div style={{
                background: 'rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '6px',
                padding: '10px 14px',
                fontSize: '12px',
                color: 'var(--text-muted, #9ca3af)',
                fontFamily: 'monospace',
                wordBreak: 'break-all'
              }}>
                {selectedLog.user_agent || 'Unknown / Server Triggered'}
              </div>
            </div>

          </div>
        </Modal>
      )}



    </motion.section>
  );
};
