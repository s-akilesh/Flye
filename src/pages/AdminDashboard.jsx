import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../constants/routes';
import { useProjects } from '../hooks/useProjects';
import { useEnquiries } from '../hooks/useEnquiries';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { allProjects, isLoading: projectsLoading } = useProjects();
  const { enquiries, isLoading: enquiriesLoading } = useEnquiries();

  const isLoading = projectsLoading || enquiriesLoading;

  // Memoize calculations
  const stats = useMemo(() => {
    // Projects metrics
    const totalProjects = allProjects.length;
    const activeProjects = allProjects.filter((p) => p.status === 'active').length;
    const draftProjects = allProjects.filter((p) => p.status === 'draft').length;
    const featuredProjects = allProjects.filter((p) => p.featured).length;

    // Enquiries metrics
    const totalEnquiries = enquiries.length;
    const newLeads = enquiries.filter((e) => e.status === 'new').length;
    const contactedLeads = enquiries.filter((e) => e.status === 'contacted').length;
    const quotedLeads = enquiries.filter((e) => e.status === 'quoted').length;
    const completedLeads = enquiries.filter((e) => e.status === 'completed').length;
    const rejectedLeads = enquiries.filter((e) => e.status === 'rejected').length;

    // Conversion rate
    const conversionRate = totalEnquiries > 0 ? (completedLeads / totalEnquiries) * 100 : 0;

    // Recent enquiries (latest 5)
    const recentEnquiries = enquiries.slice(0, 5);

    // Last activity
    let lastEnquiryTime = null;
    let lastUpdatedTime = null;
    if (enquiries.length > 0) {
      lastEnquiryTime = enquiries[0].createdAt || enquiries[0].created_at || null;
      
      const updateTimes = enquiries
        .map(e => e.updatedAt || e.updated_at || e.createdAt || e.created_at)
        .filter(Boolean)
        .map(t => new Date(t).getTime());
      if (updateTimes.length > 0) {
        lastUpdatedTime = new Date(Math.max(...updateTimes)).toISOString();
      }
    }

    return {
      totalProjects,
      activeProjects,
      draftProjects,
      featuredProjects,
      totalEnquiries,
      newLeads,
      contactedLeads,
      quotedLeads,
      completedLeads,
      rejectedLeads,
      conversionRate,
      recentEnquiries,
      lastEnquiryTime,
      lastUpdatedTime
    };
  }, [allProjects, enquiries]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const statusColors = {
    new: '#eab308',
    contacted: 'var(--accent-blue)',
    quoted: 'var(--accent-violet)',
    completed: 'var(--accent-emerald)',
    rejected: 'var(--accent-crimson, #ef4444)'
  };

  const statusLabels = {
    new: 'New',
    contacted: 'Contacted',
    quoted: 'Quoted',
    completed: 'Completed',
    rejected: 'Rejected'
  };

  const projectKpis = [
    { title: 'Total Projects', value: stats.totalProjects, color: 'var(--accent-blue)' },
    { title: 'Active Projects', value: stats.activeProjects, color: 'var(--accent-emerald)' },
    { title: 'Draft Projects', value: stats.draftProjects, color: '#eab308' },
    { title: 'Featured Projects', value: stats.featuredProjects, color: 'var(--accent-violet)' },
  ];

  const enquiryKpis = [
    { title: 'Total Enquiries', value: stats.totalEnquiries, color: 'var(--text-primary)' },
    { title: 'New Leads', value: stats.newLeads, color: '#eab308' },
    { title: 'Contacted Leads', value: stats.contactedLeads, color: 'var(--accent-blue)' },
    { title: 'Quoted Leads', value: stats.quotedLeads, color: 'var(--accent-violet)' },
    { title: 'Completed Leads', value: stats.completedLeads, color: 'var(--accent-emerald)' },
    { title: 'Rejected Leads', value: stats.rejectedLeads, color: 'var(--accent-crimson, #ef4444)' },
  ];

  if (isLoading) {
    return (
      <div className="portal-section page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="card-glass" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
          <div className="loading-spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--accent-violet)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto var(--space-4) auto' }} />
          <h3>Loading dashboard analytics...</h3>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      className="portal-section page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
    >
      <div className="portal-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="portal-title-area">
          <h2>Admin Portal Dashboard</h2>
          <p>Real-time analytics, conversion metrics, and management console</p>
        </div>
      </div>

      <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* Projects Overview */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-3)' }}>
            Projects Overview
          </h3>
          {allProjects.length === 0 ? (
            <div className="card-glass" style={{ padding: 'var(--space-6)', textAlign: 'center', width: '100%' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>No project kits created yet.</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Create your first project kit.</p>
            </div>
          ) : (
            <div className="admin-kpi-grid">
              {projectKpis.map((kpi, idx) => (
                <Card key={idx} style={{ padding: 'var(--space-4)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{kpi.title}</span>
                  <h3 style={{ fontSize: '28px', fontWeight: '700', color: kpi.color, margin: 'var(--space-2) 0 0 0' }}>{kpi.value}</h3>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Enquiries Overview */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-3)' }}>
            Enquiries Overview
          </h3>
          {enquiries.length === 0 ? (
            <div className="card-glass" style={{ padding: 'var(--space-6)', textAlign: 'center', width: '100%' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>No enquiries received yet.</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Customer enquiries will appear here.</p>
            </div>
          ) : (
            <div className="admin-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
              {enquiryKpis.map((kpi, idx) => (
                <Card key={idx} style={{ padding: 'var(--space-4)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{kpi.title}</span>
                  <h3 style={{ fontSize: '28px', fontWeight: '700', color: kpi.color, margin: 'var(--space-2) 0 0 0' }}>{kpi.value}</h3>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Conversion, Activity, Quick Actions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          {/* Conversion Rate Card */}
          <Card className="card-glass" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Conversion Metrics</span>
              {stats.totalEnquiries > 0 ? (
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <h3 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--accent-violet)', margin: 0 }}>
                    {stats.conversionRate.toFixed(1)}%
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Completed enquiries ratio</p>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', marginTop: 'var(--space-3)' }}>
                    <div 
                      style={{ 
                        width: `${stats.conversionRate}%`, 
                        height: '100%', 
                        background: 'linear-gradient(90deg, var(--accent-violet) 0%, var(--accent-blue) 100%)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }} 
                    />
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', margin: 0 }}>
                    No enquiry data available
                  </h4>
                </div>
              )}
            </div>
          </Card>

          {/* Last Activity Card */}
          <Card className="card-glass" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Last Activity</span>
              {enquiries.length === 0 ? (
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', margin: 0 }}>
                    No recent activity
                  </h4>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}>Last Enquiry Received</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginTop: '2px', display: 'block' }}>
                      {stats.lastEnquiryTime ? formatDate(stats.lastEnquiryTime) : 'N/A'}
                    </span>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 'var(--space-2)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}>Last Updated Time</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginTop: '2px', display: 'block' }}>
                      {stats.lastUpdatedTime ? formatDate(stats.lastUpdatedTime) : 'N/A'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className="card-glass" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Actions</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                <Button variant="secondary" onClick={() => navigate(ROUTES.ADMIN_ADD_PROJECT)} style={{ fontSize: '12px', padding: '10px 8px', justifyContent: 'center' }}>
                  ➕ Add Kit
                </Button>
                <Button variant="secondary" onClick={() => navigate(ROUTES.ADMIN_PROJECTS)} style={{ fontSize: '12px', padding: '10px 8px', justifyContent: 'center' }}>
                  🛠️ Projects
                </Button>
                <Button variant="secondary" onClick={() => navigate(ROUTES.ADMIN_ENQUIRIES)} style={{ fontSize: '12px', padding: '10px 8px', justifyContent: 'center' }}>
                  📋 Enquiries
                </Button>
                <Button variant="secondary" onClick={() => navigate(ROUTES.ADMIN_SETTINGS)} style={{ fontSize: '12px', padding: '10px 8px', justifyContent: 'center' }}>
                  ⚙️ Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Enquiries table */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-3)' }}>
            Recent Enquiries
          </h3>
          {stats.recentEnquiries.length === 0 ? (
            <Card className="card-glass" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>No recent enquiries.</p>
            </Card>
          ) : (
            <Card className="card-glass" style={{ padding: 'var(--space-4)', overflowX: 'auto' }}>
              <table className="tbl-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th style={{ padding: '12px 8px', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer Name</th>
                    <th style={{ padding: '12px 8px', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Project Name</th>
                    <th style={{ padding: '12px 8px', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                    <th style={{ padding: '12px 8px', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentEnquiries.map((enq) => (
                    <tr key={enq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13px' }}>
                      <td style={{ padding: '12px 8px', color: '#fff', fontWeight: '500' }}>{enq.name}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{enq.projectTitle}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span 
                          style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            padding: '2px 8px', 
                            borderRadius: '12px', 
                            fontSize: '11px', 
                            fontWeight: '600',
                            border: `1px solid ${statusColors[enq.status]}`,
                            color: statusColors[enq.status],
                            background: 'rgba(255, 255, 255, 0.02)'
                          }}
                        >
                          {statusLabels[enq.status]}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{formatDate(enq.createdAt || enq.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>

      </div>
    </motion.section>
  );
};
