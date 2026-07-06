import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ROUTES } from '../constants/routes';
import { useProjects } from '../hooks/useProjects';
import { useEnquiries } from '../hooks/useEnquiries';

// Helper to parse notes serialized in the enquiries table
const parseNotes = (notes) => {
  const data = {
    projectStatus: '-',
    budget: '-',
    submissionDate: '-',
    needDocument: '-',
    needPresentation: '-',
    remarks: ''
  };

  if (!notes) return data;

  const lines = notes.split('\n');
  lines.forEach(line => {
    const cleanLine = line.trim();
    if (cleanLine.startsWith('Project Status:')) {
      data.projectStatus = cleanLine.replace('Project Status:', '').trim();
    } else if (cleanLine.startsWith('Budget:')) {
      data.budget = cleanLine.replace('Budget:', '').trim();
    } else if (cleanLine.startsWith('Submission Date:')) {
      data.submissionDate = cleanLine.replace('Submission Date:', '').trim();
    } else if (cleanLine.startsWith('Need Document:')) {
      data.needDocument = cleanLine.replace('Need Document:', '').trim();
    } else if (cleanLine.startsWith('Need Presentation Support:')) {
      data.needPresentation = cleanLine.replace('Need Presentation Support:', '').trim();
    } else if (cleanLine.startsWith('Remarks:')) {
      data.remarks = cleanLine.replace('Remarks:', '').trim();
    }
  });

  return data;
};

// Colors mapping for pipeline & charts
const statusColors = {
  new: '#f59e0b',       // Amber
  contacted: '#3b82f6', // Blue
  quoted: '#8b5cf6',    // Violet
  confirmed: '#06b6d4', // Cyan
  in_progress: '#6366f1', // Indigo
  completed: '#10b981',  // Emerald
  rejected: '#ef4444'    // Crimson
};

const statusLabels = {
  new: 'New',
  contacted: 'Contacted',
  quoted: 'Quoted',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  rejected: 'Rejected'
};

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { allProjects, isLoading: projectsLoading } = useProjects();
  const { enquiries, addEnquiry, updateEnquiry, isLoading: enquiriesLoading } = useEnquiries();

  const isLoading = projectsLoading || enquiriesLoading;

  // Local UI States
  const [pipelineFilter, setPipelineFilter] = useState(null);
  const [selectedEnquiryDetails, setSelectedEnquiryDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);
  const [hoveredDonutSlice, setHoveredDonutSlice] = useState(null);

  // DOM Ref to scroll to enquiries table
  const enquiriesTableRef = useRef(null);

  const scrollToEnquiries = (statusStr) => {
    if (statusStr) {
      setPipelineFilter(statusStr);
    }
    setTimeout(() => {
      enquiriesTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Helper date conversions
  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === '-') return '-';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Memoized stats & data aggregations
  const dashboardData = useMemo(() => {
    if (enquiries.length === 0) {
      return {
        newCount: 0,
        newToday: 0,
        pendingFollowUp: 0,
        followUpToday: 0,
        pendingDelivery: 0,
        deliveryToday: 0,
        upcomingDeadlines: 0,
        upcomingToday: 0,
        statusDistribution: {},
        dailyTrend: [],
        priorityEnquiries: [],
        upcomingSubmissionsList: [],
        popularProjectsList: [],
        sparklines: { new: [0,0,0,0,0,0,0], followUp: [0,0,0,0,0,0,0], delivery: [0,0,0,0,0,0,0], deadlines: [0,0,0,0,0,0,0] }
      };
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Pipeline counts
    let newCount = 0;
    let newToday = 0;
    let pendingFollowUp = 0;
    let followUpToday = 0;
    let pendingDelivery = 0;
    let deliveryToday = 0;
    let upcomingDeadlines = 0;
    let upcomingToday = 0;

    const statusDistribution = {
      new: 0,
      contacted: 0,
      quoted: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      rejected: 0
    };

    // Initialize 7-day sparkline slots
    const sparklineNew = [0,0,0,0,0,0,0];
    const sparklineFollowUp = [0,0,0,0,0,0,0];
    const sparklineDelivery = [0,0,0,0,0,0,0];
    const sparklineDeadlines = [0,0,0,0,0,0,0];

    const projectsEnquiryMap = {};
    const upcomingSubmissionsList = [];

    const parsedEnquiries = enquiries.map((enq) => {
      const parsedNotes = parseNotes(enq.notes);
      const enqStatus = enq.status || 'new';

      // Increment status count
      if (statusDistribution[enqStatus] !== undefined) {
        statusDistribution[enqStatus]++;
      } else {
        statusDistribution.new++;
      }

      // Group by project for popularity ranking
      const pTitle = enq.projectTitle || 'General / Unknown';
      if (!projectsEnquiryMap[pTitle]) {
        projectsEnquiryMap[pTitle] = {
          name: pTitle,
          count: 0,
          budgets: []
        };
      }
      projectsEnquiryMap[pTitle].count++;
      if (parsedNotes.budget && parsedNotes.budget !== '-') {
        const budgetNums = parsedNotes.budget.match(/\d+/g);
        if (budgetNums && budgetNums.length > 0) {
          const avg = budgetNums.map(Number).reduce((a,b)=>a+b, 0) / budgetNums.length;
          projectsEnquiryMap[pTitle].budgets.push(avg);
        }
      } else if (enq.price) {
        const numPrice = parseInt(String(enq.price).replace(/\D/g, ''));
        if (!isNaN(numPrice)) {
          projectsEnquiryMap[pTitle].budgets.push(numPrice);
        }
      }

      const createdTime = new Date(enq.createdAt || enq.created_at).getTime();
      const createdToday = isToday(enq.createdAt || enq.created_at);

      // Populate sparklines for the last 7 days
      for (let i = 0; i < 7; i++) {
        const dayCheck = new Date();
        dayCheck.setDate(dayCheck.getDate() - (6 - i));
        dayCheck.setHours(0,0,0,0);
        const dayEnd = new Date(dayCheck);
        dayEnd.setHours(23,59,59,999);

        if (createdTime >= dayCheck.getTime() && createdTime <= dayEnd.getTime()) {
          if (enqStatus === 'new') sparklineNew[i]++;
          if (enqStatus === 'contacted' || enqStatus === 'quoted') sparklineFollowUp[i]++;
          if (enqStatus === 'confirmed' || enqStatus === 'in_progress') sparklineDelivery[i]++;
        }
      }

      if (enqStatus === 'new') {
        newCount++;
        if (createdToday) newToday++;
      }
      if (enqStatus === 'contacted' || enqStatus === 'quoted') {
        pendingFollowUp++;
        if (createdToday) followUpToday++;
      }
      if (enqStatus === 'confirmed' || enqStatus === 'in_progress') {
        pendingDelivery++;
        if (createdToday) deliveryToday++;
      }

      // Parse submission date for priority & deadlines
      let daysLeft = null;
      let isFutureDeadline = false;
      let priority = 'Low';

      if (parsedNotes.submissionDate && parsedNotes.submissionDate !== '-') {
        const subDate = new Date(parsedNotes.submissionDate);
        subDate.setHours(0,0,0,0);
        
        if (!isNaN(subDate.getTime())) {
          const diffTime = subDate.getTime() - now.getTime();
          daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (daysLeft >= 0) {
            isFutureDeadline = true;
            upcomingDeadlines++;
            if (createdToday) upcomingToday++;

            // Populate deadline sparkline
            for (let i = 0; i < 7; i++) {
              const dayCheck = new Date();
              dayCheck.setDate(dayCheck.getDate() - (6 - i));
              dayCheck.setHours(0,0,0,0);
              if (subDate.getTime() === dayCheck.getTime()) {
                sparklineDeadlines[i]++;
              }
            }
          }

          // Calculate Priority
          if (daysLeft <= 3 && daysLeft >= 0) {
            priority = 'High';
          } else if (daysLeft <= 7 && daysLeft >= 0) {
            priority = 'Medium';
          }
        }
      }

      // Add to upcoming submissions if deadline is in the future
      if (isFutureDeadline && enqStatus !== 'completed' && enqStatus !== 'rejected') {
        let submissionStatus = 'Ready';
        const needDocStr = String(parsedNotes.needDocument).toLowerCase();
        const needPPTStr = String(parsedNotes.needPresentation).toLowerCase();

        if (needDocStr === 'yes' && needPPTStr === 'yes') {
          submissionStatus = 'Docs & PPT Pending';
        } else if (needDocStr === 'yes') {
          submissionStatus = 'Documentation Pending';
        } else if (needPPTStr === 'yes') {
          submissionStatus = 'Need PPT';
        }

        upcomingSubmissionsList.push({
          studentName: enq.name,
          projectName: enq.projectTitle || 'General',
          daysLeft,
          status: submissionStatus,
          rawDaysLeft: daysLeft
        });
      }

      return {
        ...enq,
        parsedNotes,
        priority,
        daysLeft
      };
    });

    // Sort Upcoming Submissions by closest deadline
    upcomingSubmissionsList.sort((a, b) => a.rawDaysLeft - b.rawDaysLeft);

    // Process last 12 Days Enquiry Trend (For Bar Chart matching Customers Activity)
    const dailyTrend = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dString = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      
      const paidCount = enquiries.filter(e => {
        const cDate = (e.createdAt || e.created_at || '').split('T')[0];
        return cDate === dString && (e.status === 'completed' || e.status === 'confirmed');
      }).length;

      const checkoutCount = enquiries.filter(e => {
        const cDate = (e.createdAt || e.created_at || '').split('T')[0];
        return cDate === dString && (e.status === 'new' || e.status === 'contacted' || e.status === 'quoted');
      }).length;

      dailyTrend.push({ dateString: dString, label, paid: paidCount, checkout: checkoutCount });
    }

    // Process Popular Projects with expectation percentage
    const maxProjectEnquiries = Math.max(...Object.values(projectsEnquiryMap).map(p => p.count), 1);
    const popularProjectsList = Object.values(projectsEnquiryMap)
      .map(p => {
        const avgBudget = p.budgets.length > 0 
          ? Math.round(p.budgets.reduce((a,b)=>a+b, 0) / p.budgets.length) 
          : 0;
        
        // Percent calculations
        const percentage = Math.round((p.count / maxProjectEnquiries) * 100);

        return {
          name: p.name,
          count: p.count,
          avgBudget,
          percentage
        };
      })
      .sort((a,b) => b.count - a.count)
      .slice(0, 5);

    return {
      newCount,
      newToday,
      pendingFollowUp,
      followUpToday,
      pendingDelivery,
      deliveryToday,
      upcomingDeadlines,
      upcomingToday,
      statusDistribution,
      dailyTrend,
      parsedEnquiries,
      upcomingSubmissionsList: upcomingSubmissionsList.slice(0, 5),
      popularProjectsList,
      sparklines: {
        new: sparklineNew,
        followUp: sparklineFollowUp,
        delivery: sparklineDelivery,
        deadlines: sparklineDeadlines
      }
    };
  }, [enquiries]);

  // Handle inline status updates
  const handleStatusChange = async (id, nextStatus) => {
    try {
      setIsProcessing(true);
      await updateEnquiry(id, { status: nextStatus });
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };



  // Filtered recent enquiries list based on selected stage
  const filteredEnquiries = useMemo(() => {
    const list = dashboardData.parsedEnquiries || [];
    if (!pipelineFilter) return list.slice(0, 8);
    return list.filter((e) => e.status === pipelineFilter).slice(0, 8);
  }, [pipelineFilter, dashboardData.parsedEnquiries]);

  // Mini Sparkline SVG render
  const renderSparkline = (pointsData, isPositive = true) => {
    const width = 90;
    const height = 30;
    const maxVal = Math.max(...pointsData, 1);
    
    // Map values to (x, y) coordinates
    const coordinates = pointsData.map((val, idx) => {
      const x = (idx / (pointsData.length - 1)) * width;
      const y = height - (val / maxVal) * (height - 6) - 3;
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = isPositive ? '#10b981' : '#ef4444';

    return (
      <svg width={width} height={height} style={{ overflow: 'visible', opacity: 0.85 }}>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coordinates}
        />
      </svg>
    );
  };

  // Render Section 4 Left: Bar Chart matching Customers Activity
  const renderBarChart = () => {
    const data = dashboardData.dailyTrend || [];
    if (data.length === 0) return null;

    const width = 500;
    const height = 180;
    const paddingLeft = 35;
    const paddingRight = 15;
    const paddingTop = 20;
    const paddingBottom = 25;

    const maxVal = Math.max(...data.map(d => Math.max(d.paid, d.checkout)), 2);

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;
    const colWidth = plotWidth / data.length;

    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          {/* Horizontal Gridlines */}
          <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke="rgba(255,255,255,0.03)" />
          <line x1={paddingLeft} y1={paddingTop + plotHeight / 2} x2={width - paddingRight} y2={paddingTop + plotHeight / 2} stroke="rgba(255,255,255,0.03)" />
          <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="rgba(255,255,255,0.08)" />

          {/* Y Axis labels */}
          <text x={paddingLeft - 8} y={paddingTop + 3} fill="var(--text-muted)" fontSize="8.5" textAnchor="end">{maxVal}</text>
          <text x={paddingLeft - 8} y={paddingTop + plotHeight / 2 + 3} fill="var(--text-muted)" fontSize="8.5" textAnchor="end">{Math.round(maxVal / 2)}</text>
          <text x={paddingLeft - 8} y={height - paddingBottom + 3} fill="var(--text-muted)" fontSize="8.5" textAnchor="end">0</text>

          {/* Draw bars */}
          {data.map((d, idx) => {
            const xCenter = paddingLeft + idx * colWidth + colWidth / 2;
            const barW = Math.max(colWidth * 0.28, 5); // width of individual bars

            // Heights
            const paidH = (d.paid / maxVal) * plotHeight;
            const checkoutH = (d.checkout / maxVal) * plotHeight;

            // Y starts
            const paidY = height - paddingBottom - paidH;
            const checkoutY = height - paddingBottom - checkoutH;

            const isHovered = hoveredBarIndex === idx;

            return (
              <g key={idx}>
                {/* X Axis Label */}
                {idx % 2 === 0 && (
                  <text x={xCenter} y={height - 8} fill="var(--text-muted)" fontSize="8" textAnchor="middle">
                    {d.label}
                  </text>
                )}

                {/* Checkout Bar (Light blue glow) */}
                <rect
                  x={xCenter - barW - 2}
                  y={checkoutY}
                  width={barW}
                  height={Math.max(checkoutH, 1)}
                  fill={isHovered ? '#38bdf8' : '#0284c7'}
                  rx="2"
                  style={{ transition: 'all 0.2s ease', opacity: 0.8 }}
                />

                {/* Paid Bar (Blue purple) */}
                <rect
                  x={xCenter + 2}
                  y={paidY}
                  width={barW}
                  height={Math.max(paidH, 1)}
                  fill={isHovered ? '#818cf8' : '#4f46e5'}
                  rx="2"
                  style={{ transition: 'all 0.2s ease', opacity: 0.8 }}
                />

                {/* Invisible hover overlay */}
                <rect
                  x={xCenter - colWidth / 2}
                  y={paddingTop}
                  width={colWidth}
                  height={plotHeight}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip card */}
        {hoveredBarIndex !== null && (
          <div 
            style={{
              position: 'absolute',
              left: `${((paddingLeft + hoveredBarIndex * colWidth + colWidth/2) / width) * 100}%`,
              top: '10px',
              transform: 'translateX(-50%)',
              background: 'rgba(18, 18, 30, 0.95)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              color: '#fff',
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              zIndex: 10,
              minWidth: '110px'
            }}
          >
            <div style={{ fontWeight: '700', marginBottom: '3px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '2px', fontSize: '10px', color: 'var(--text-muted)' }}>
              {data[hoveredBarIndex].label}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{ color: '#0284c7' }}>Checkout:</span>
              <span style={{ fontWeight: '700' }}>{data[hoveredBarIndex].checkout}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{ color: '#4f46e5' }}>Paid:</span>
              <span style={{ fontWeight: '700' }}>{data[hoveredBarIndex].paid}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Donut Chart matching screenshot's "Product Activity"
  const renderDonutChart = () => {
    const dist = dashboardData.statusDistribution || {};
    const total = Object.values(dist).reduce((a, b) => a + b, 0);

    if (total === 0) {
      return (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: 'var(--space-6) 0' }}>
          No lead logs registered
        </div>
      );
    }

    const radius = 38;
    const circ = 2 * Math.PI * radius; // ~238.76

    let cumulativePercentage = 0;

    const slices = Object.entries(dist)
      .map(([status, count]) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        const strokeLength = (percentage * circ) / 100;
        const strokeOffset = circ - strokeLength;
        const rotation = (cumulativePercentage * 360) / 100;
        cumulativePercentage += percentage;

        return {
          status,
          count,
          percentage,
          strokeLength,
          strokeOffset,
          rotation,
          color: statusColors[status] || '#ccc'
        };
      })
      .filter(s => s.count > 0);

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-5)', width: '100%' }}>
        {/* SVG Circle */}
        <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            {slices.map((slice, idx) => {
              const isHovered = hoveredDonutSlice === slice.status;
              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? 9 : 7}
                  strokeDasharray={`${slice.strokeLength} ${circ - slice.strokeLength}`}
                  strokeDashoffset={0}
                  transform={`rotate(${slice.rotation} 50 50)`}
                  style={{
                    transition: 'stroke-width 0.2s ease, filter 0.2s',
                    cursor: 'pointer',
                    filter: isHovered ? 'drop-shadow(0 0 4px rgba(255,255,255,0.15))' : 'none'
                  }}
                  onMouseEnter={() => setHoveredDonutSlice(slice.status)}
                  onMouseLeave={() => setHoveredDonutSlice(null)}
                />
              );
            })}
          </svg>

          {/* Center text count */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            lineHeight: '1.2'
          }}>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff', letterSpacing: '0.5px' }}>
              {hoveredDonutSlice ? dist[hoveredDonutSlice] : total}
            </span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
              {hoveredDonutSlice ? statusLabels[hoveredDonutSlice] : 'Total Leads'}
            </span>
          </div>
        </div>

        {/* Right side Legends (List structure like Product Activity) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          {Object.entries(dist).map(([status, count]) => {
            if (count === 0) return null;
            const isHovered = hoveredDonutSlice === status;
            return (
              <div 
                key={status} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  fontSize: '12px', 
                  color: isHovered ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  background: isHovered ? 'rgba(255,255,255,0.03)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={() => setHoveredDonutSlice(status)}
                onMouseLeave={() => setHoveredDonutSlice(null)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColors[status] || '#ccc' }} />
                  <span>{statusLabels[status]}</span>
                </div>
                <span style={{ fontWeight: '700', color: '#fff' }}>{count.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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

  // Define dynamic color themes for popular project bars
  const projectColors = [
    'linear-gradient(90deg, #3b82f6, #06b6d4)', // Blue to Cyan
    'linear-gradient(90deg, #f59e0b, #ef4444)', // Amber to Crimson
    'linear-gradient(90deg, #8b5cf6, #3b82f6)', // Violet to Blue
    'linear-gradient(90deg, #10b981, #06b6d4)', // Emerald to Cyan
    'linear-gradient(90deg, #ec4899, #8b5cf6)'  // Pink to Violet
  ];

  return (
    <motion.section
      id="admin-dashboard-portal"
      className="portal-section page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
      style={{ paddingTop: '76px' }}
    >
      {/* Mobile Sticky Sub-Header */}
      <header className="mobile-learning-header">
        <span className="mobile-learning-title" style={{ fontSize: '14px', fontWeight: '800', color: '#fff', textTransform: 'uppercase' }}>
          Flyen Operations Control
        </span>
      </header>

      <div className="portal-header" style={{ marginBottom: '16px', paddingBottom: '16px' }}>
        <div className="portal-title-area">
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <p style={{ margin: '4px 0 0 0' }}>Daily metrics, lead priority queues, and pending fulfillment tracking</p>
        </div>
      </div>

      <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        
        {/* ROW 1: today's metrics & donut chart side-by-side */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
          {/* Left Grid: 2x2 KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* KPI 1 */}
            <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="material-icons" style={{ color: '#f59e0b', fontSize: '16px', background: 'rgba(245,158,11,0.06)', padding: '5px', borderRadius: '6px' }}>mail_outline</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Enquiries</span>
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '4px 0' }}>
                  {dashboardData.newCount}
                </h3>
                <span style={{ fontSize: '10.5px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: '600' }}>
                  <span className="material-icons" style={{ fontSize: '12px' }}>arrow_upward</span>
                  {dashboardData.newToday > 0 ? `+${dashboardData.newToday} today` : '0 today'}
                </span>
              </div>
              <div style={{ alignSelf: 'center', paddingLeft: '8px' }}>
                {renderSparkline(dashboardData.sparklines.new, true)}
              </div>
            </Card>

            {/* KPI 2 */}
            <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="material-icons" style={{ color: 'var(--accent-blue)', fontSize: '16px', background: 'rgba(59,130,246,0.06)', padding: '5px', borderRadius: '6px' }}>phone_callback</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Follow-ups</span>
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '4px 0' }}>
                  {dashboardData.pendingFollowUp}
                </h3>
                <span style={{ fontSize: '10.5px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: '600' }}>
                  <span className="material-icons" style={{ fontSize: '12px' }}>arrow_upward</span>
                  {dashboardData.followUpToday > 0 ? `+${dashboardData.followUpToday} today` : '0 today'}
                </span>
              </div>
              <div style={{ alignSelf: 'center', paddingLeft: '8px' }}>
                {renderSparkline(dashboardData.sparklines.followUp, true)}
              </div>
            </Card>

            {/* KPI 3 */}
            <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="material-icons" style={{ color: 'var(--accent-violet)', fontSize: '16px', background: 'rgba(139,92,246,0.06)', padding: '5px', borderRadius: '6px' }}>local_shipping</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deliveries</span>
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '4px 0' }}>
                  {dashboardData.pendingDelivery}
                </h3>
                <span style={{ fontSize: '10.5px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: '600' }}>
                  <span className="material-icons" style={{ fontSize: '12px' }}>arrow_upward</span>
                  {dashboardData.deliveryToday > 0 ? `+${dashboardData.deliveryToday} today` : '0 today'}
                </span>
              </div>
              <div style={{ alignSelf: 'center', paddingLeft: '8px' }}>
                {renderSparkline(dashboardData.sparklines.delivery, true)}
              </div>
            </Card>

            {/* KPI 4 */}
            <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="material-icons" style={{ color: '#ef4444', fontSize: '16px', background: 'rgba(239,68,68,0.06)', padding: '5px', borderRadius: '6px' }}>alarm</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deadlines</span>
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '4px 0' }}>
                  {dashboardData.upcomingDeadlines}
                </h3>
                <span style={{ fontSize: '10.5px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: '600' }}>
                  <span className="material-icons" style={{ fontSize: '12px' }}>arrow_downward</span>
                  {dashboardData.upcomingToday > 0 ? `+${dashboardData.upcomingToday} today` : '0 today'}
                </span>
              </div>
              <div style={{ alignSelf: 'center', paddingLeft: '8px' }}>
                {renderSparkline(dashboardData.sparklines.deadlines, false)}
              </div>
            </Card>
          </div>

          {/* Right Card: Product/Enquiry Activity Donut Chart */}
          <Card className="card-glass" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-icons" style={{ color: 'var(--accent-violet)', fontSize: '16px' }}>donut_large</span>
                <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Product Activity</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['1W', '1M', '3W', 'YTD', 'Total'].map((tab) => (
                  <button key={tab} type="button" style={{ border: 'none', background: tab === 'Total' ? 'rgba(255,255,255,0.08)' : 'transparent', color: tab === 'Total' ? '#fff' : 'var(--text-muted)', fontSize: '9px', fontWeight: '700', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer' }}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
              {renderDonutChart()}
            </div>
          </Card>
        </div>

        {/* SECTION 2 — Today's Priorities */}
        <div>
          <Card className="card-glass" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-icons-outlined" style={{ fontSize: '18px', color: 'var(--accent-violet)' }}>checklist</span>
              Fulfillment Priorities & Immediate Tasks
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {dashboardData.newCount > 0 ? (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px', background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: '6px' }}>
                  <span className="material-icons" style={{ color: '#f59e0b', fontSize: '20px', marginTop: '2px' }}>call</span>
                  <div>
                    <h5 style={{ margin: '0 0 2px 0', fontSize: '12.5px', fontWeight: '600', color: '#fff' }}>Contact New Leads</h5>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>You have {dashboardData.newCount} fresh leads waiting for initial follow-up.</p>
                    <button onClick={() => scrollToEnquiries('new')} style={{ border: 'none', background: 'none', color: '#f59e0b', fontSize: '11px', fontWeight: '600', padding: 0, marginTop: '4px', cursor: 'pointer' }}>Start Calling &rarr;</button>
                  </div>
                </div>
              ) : null}

              {dashboardData.pendingFollowUp > 0 ? (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px', background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: '6px' }}>
                  <span className="material-icons" style={{ color: 'var(--accent-blue)', fontSize: '20px', marginTop: '2px' }}>description</span>
                  <div>
                    <h5 style={{ margin: '0 0 2px 0', fontSize: '12.5px', fontWeight: '600', color: '#fff' }}>Send Pending Quotations</h5>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{dashboardData.pendingFollowUp} enquiries are in Contacted/Quoted stage.</p>
                    <button onClick={() => scrollToEnquiries('quoted')} style={{ border: 'none', background: 'none', color: 'var(--accent-blue)', fontSize: '11px', fontWeight: '600', padding: 0, marginTop: '4px', cursor: 'pointer' }}>Draft Quotations &rarr;</button>
                  </div>
                </div>
              ) : null}

              {dashboardData.pendingDelivery > 0 ? (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px', background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.12)', borderRadius: '6px' }}>
                  <span className="material-icons" style={{ color: 'var(--accent-violet)', fontSize: '20px', marginTop: '2px' }}>local_shipping</span>
                  <div>
                    <h5 style={{ margin: '0 0 2px 0', fontSize: '12.5px', fontWeight: '600', color: '#fff' }}>Dispatch Pending Kits</h5>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{dashboardData.pendingDelivery} confirmed student projects need assembly or delivery.</p>
                    <button onClick={() => scrollToEnquiries('confirmed')} style={{ border: 'none', background: 'none', color: 'var(--accent-violet)', fontSize: '11px', fontWeight: '600', padding: 0, marginTop: '4px', cursor: 'pointer' }}>Fulfill Orders &rarr;</button>
                  </div>
                </div>
              ) : null}

              {dashboardData.upcomingSubmissionsList.length > 0 ? (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '6px' }}>
                  <span className="material-icons" style={{ color: '#ef4444', fontSize: '20px', marginTop: '2px' }}>fact_check</span>
                  <div>
                    <h5 style={{ margin: '0 0 2px 0', fontSize: '12.5px', fontWeight: '600', color: '#fff' }}>Prepare Project Deliverables</h5>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Deadlines approaching this week. Verify student kits and documents.</p>
                    <button onClick={() => {
                      const el = document.getElementById('upcoming-submissions-section');
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }} style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '11px', fontWeight: '600', padding: 0, marginTop: '4px', cursor: 'pointer' }}>Review Deadlines &rarr;</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '6px', width: '100%', gridColumn: 'span 2' }}>
                  <span className="material-icons" style={{ color: 'var(--accent-emerald)', fontSize: '22px' }}>check_circle</span>
                  <div>
                    <h5 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '600', color: '#fff' }}>Fulfillment Queue Stable</h5>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>No urgent student deadlines or pending call-backs today. Excellent work!</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* SECTION 3 — Sales Pipeline */}
        <div>
          <Card className="card-glass" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>
                Sales Enquiry Pipeline
              </h3>
              {pipelineFilter && (
                <Button variant="ghost" style={{ padding: '2px 8px', fontSize: '11px', height: '24px' }} onClick={() => setPipelineFilter(null)}>
                  Reset Filters
                </Button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
              {Object.entries(statusLabels).map(([statusKey, labelText]) => {
                const count = dashboardData.statusDistribution[statusKey] || 0;
                const isSelected = pipelineFilter === statusKey;
                
                return (
                  <button
                    key={statusKey}
                    type="button"
                    onClick={() => setPipelineFilter(isSelected ? null : statusKey)}
                    style={{
                      background: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                      border: isSelected 
                        ? `1.5px solid ${statusColors[statusKey]}` 
                        : '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '10px 8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                      }
                    }}
                  >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColors[statusKey] }} />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{labelText}</span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                      {count}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ROW 2: Customers Activity Bar chart & Customers Active project list */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
          {/* Customers Activity */}
          <Card className="card-glass" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-icons" style={{ color: '#4f46e5', fontSize: '16px' }}>bar_chart</span>
                <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Customers Activity</span>
              </div>
              {/* Chart Legend */}
              <div style={{ display: 'flex', gap: '12px', fontSize: '9px', fontWeight: '700' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '1.5px', background: '#4f46e5' }} /> Paid Leads
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '1.5px', background: '#0284c7' }} /> Checkout Leads
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
              {renderBarChart()}
            </div>
          </Card>

          {/* Popular Projects requests */}
          <Card className="card-glass" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-icons" style={{ color: 'var(--accent-emerald)', fontSize: '16px' }}>trending_up</span>
                <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Customers Active Projects</span>
              </div>
              <Button variant="ghost" style={{ padding: '2px 8px', fontSize: '10px', height: '24px' }} onClick={() => navigate(ROUTES.ADMIN_PROJECTS)}>
                View All
              </Button>
            </div>

            {dashboardData.popularProjectsList.length === 0 ? (
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 'var(--space-4) 0', textAlign: 'center', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No projects registered.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flexGrow: 1, justifyContent: 'center' }}>
                {dashboardData.popularProjectsList.map((proj, idx) => {
                  const barGradient = projectColors[idx % projectColors.length];
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                        <span style={{ fontWeight: '600', color: '#fff' }}>{proj.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                          <strong style={{ color: '#fff' }}>{proj.count}</strong> ({proj.percentage}%)
                        </span>
                      </div>
                      {/* Horizontal progress bar matching Customers Active */}
                      <div style={{ width: '100%', height: '7px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${proj.percentage}%`, 
                            height: '100%', 
                            background: barGradient,
                            borderRadius: '4px',
                            transition: 'width 0.5s ease'
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* SECTION 5 — Recent Enquiries */}
        <div ref={enquiriesTableRef}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <h3 style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              Recent Enquiries {pipelineFilter ? `(${statusLabels[pipelineFilter]} Only)` : ''}
            </h3>
            {pipelineFilter && (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Showing filtered pipeline segment
              </span>
            )}
          </div>

          {filteredEnquiries.length === 0 ? (
            <Card className="card-glass" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>No records match the current filter.</p>
            </Card>
          ) : (
            <Card className="card-glass" style={{ padding: '0', overflowX: 'auto' }}>
              <table className="tbl-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student</th>
                    <th style={{ padding: '12px 10px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Project Kit</th>
                    <th style={{ padding: '12px 10px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lead Status</th>
                    <th style={{ padding: '12px 10px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Priority</th>
                    <th style={{ padding: '12px 10px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Budget</th>
                    <th style={{ padding: '12px 10px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Submission</th>
                    <th style={{ padding: '12px 10px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Created</th>
                    <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnquiries.map((enq) => {
                    const statusColorsMap = {
                      new: '#f59e0b',
                      contacted: '#3b82f6',
                      quoted: '#8b5cf6',
                      confirmed: '#06b6d4',
                      in_progress: '#6366f1',
                      completed: '#10b981',
                      rejected: '#ef4444'
                    };

                    const priorityBadgeColors = {
                      High: { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.2)' },
                      Medium: { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)' },
                      Low: { text: 'var(--text-muted)', bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.05)' }
                    };

                    const pBadge = priorityBadgeColors[enq.priority];

                    return (
                      <tr key={enq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13px', transition: 'background 0.2s' }}>
                        <td style={{ padding: '12px 14px', color: '#fff', fontWeight: '600' }}>
                          <div>{enq.name}</div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 'normal' }}>{enq.mobile}</div>
                        </td>
                        <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{enq.projectTitle}</td>
                        <td style={{ padding: '12px 10px' }}>
                          <select
                            value={enq.status || 'new'}
                            disabled={isProcessing}
                            onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                            style={{
                              padding: '4px 20px 4px 8px',
                              background: '#12121e',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: '600',
                              color: statusColorsMap[enq.status || 'new'],
                              border: `1px solid ${statusColorsMap[enq.status || 'new']}`,
                              cursor: 'pointer',
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(statusColorsMap[enq.status || 'new'])}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 4px center',
                              backgroundSize: '12px'
                            }}
                          >
                            {Object.entries(statusLabels).map(([k, label]) => (
                              <option key={k} value={k} style={{ color: '#fff', background: '#12121e' }}>{label}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '10.5px',
                            fontWeight: '700',
                            color: pBadge.text,
                            background: pBadge.bg,
                            border: `1px solid ${pBadge.border}`
                          }}>
                            {enq.priority}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px', color: '#fff', fontWeight: '500' }}>
                          {enq.parsedNotes?.budget && enq.parsedNotes?.budget !== '-' ? enq.parsedNotes.budget : `₹${enq.price || '0'}`}
                        </td>
                        <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>
                          {formatDate(enq.parsedNotes?.submissionDate)}
                        </td>
                        <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>
                          {formatDate(enq.createdAt || enq.created_at)}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            {/* Direct Call Button */}
                            <a
                              href={`tel:${enq.mobile}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'var(--text-secondary)',
                                textDecoration: 'none'
                              }}
                              title="Call Student"
                            >
                              <span className="material-icons-outlined" style={{ fontSize: '15px' }}>phone</span>
                            </a>

                            {/* Direct WhatsApp Button */}
                            <a
                              href={`https://wa.me/${String(enq.mobile).replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                background: 'rgba(16,185,129,0.05)',
                                border: '1px solid rgba(16,185,129,0.15)',
                                color: 'var(--accent-emerald)'
                              }}
                              title="WhatsApp Message"
                            >
                              <span className="material-icons" style={{ fontSize: '15px' }}>chat</span>
                            </a>

                            {/* View Modal Trigger */}
                            <Button
                              variant="ghost"
                              style={{ padding: '2px 8px', fontSize: '11px', height: '28px' }}
                              onClick={() => setSelectedEnquiryDetails(enq)}
                            >
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </div>

        {/* SECTION 6 — Upcoming Submissions */}
        <div id="upcoming-submissions-section">
          <h3 style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-3)' }}>
            Upcoming Submissions Checklist
          </h3>

          {dashboardData.upcomingSubmissionsList.length === 0 ? (
            <Card className="card-glass" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>No upcoming student submissions scheduled.</p>
            </Card>
          ) : (
            <Card className="card-glass" style={{ padding: 0 }}>
              <table className="tbl-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student</th>
                    <th style={{ padding: '12px 10px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Project Name</th>
                    <th style={{ padding: '12px 10px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time Remaining</th>
                    <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Checklist Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.upcomingSubmissionsList.map((sub, idx) => {
                    const submissionStatusColors = {
                      'Ready': { color: 'var(--accent-emerald)', bg: 'rgba(16, 185, 129, 0.08)' },
                      'Documentation Pending': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' },
                      'Need PPT': { color: 'var(--accent-blue)', bg: 'rgba(59, 130, 246, 0.08)' },
                      'Docs & PPT Pending': { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)' }
                    };

                    const sColor = submissionStatusColors[sub.status] || { color: 'white', bg: 'rgba(255,255,255,0.02)' };

                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13px' }}>
                        <td style={{ padding: '12px 14px', color: '#fff', fontWeight: '600' }}>{sub.studentName}</td>
                        <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{sub.projectName}</td>
                        <td style={{ padding: '12px 10px', fontWeight: '700', color: sub.daysLeft <= 2 ? '#ef4444' : '#fff' }}>
                          {sub.daysLeft === 0 ? '🗓 Today' : sub.daysLeft === 1 ? '🗓 Tomorrow' : `${sub.daysLeft} Days Left`}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: sColor.color,
                            background: sColor.bg
                          }}>
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </div>

      </div>

      {/* READ-ONLY Lead Details View Modal */}
      <Modal isOpen={selectedEnquiryDetails !== null} onClose={() => setSelectedEnquiryDetails(null)} className="modal-content purple" style={{ maxWidth: '580px' }}>
        <h4>ENQUIRY FILE DETAILS</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '16px' }}>Detailed visual file checklist for lead record</p>

        {selectedEnquiryDetails && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Student Name</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{selectedEnquiryDetails.name}</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Mobile Number</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{selectedEnquiryDetails.mobile}</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Enquired Project</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent-violet)' }}>{selectedEnquiryDetails.projectTitle}</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Base Price</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>₹{selectedEnquiryDetails.price || '0'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', background: 'rgba(255,255,255,0.01)', padding: '12px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Project Status</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{selectedEnquiryDetails.parsedNotes?.projectStatus}</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Submission Date</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{formatDate(selectedEnquiryDetails.parsedNotes?.submissionDate)}</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Need Document</span>
                <span style={{ fontSize: '13.5px', fontWeight: '700', color: String(selectedEnquiryDetails.parsedNotes?.needDocument).toLowerCase() === 'yes' ? '#ef4444' : 'var(--accent-emerald)' }}>
                  {selectedEnquiryDetails.parsedNotes?.needDocument}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Need PPT Support</span>
                <span style={{ fontSize: '13.5px', fontWeight: '700', color: String(selectedEnquiryDetails.parsedNotes?.needPresentation).toLowerCase() === 'yes' ? '#ef4444' : 'var(--accent-emerald)' }}>
                  {selectedEnquiryDetails.parsedNotes?.needPresentation}
                </span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Remarks & Notes</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                {selectedEnquiryDetails.parsedNotes?.remarks || 'No internal remarks logged.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <a
                href={`tel:${selectedEnquiryDetails.mobile}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 0',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '12.5px',
                  fontWeight: '600'
                }}
              >
                <span className="material-icons" style={{ fontSize: '16px' }}>phone</span>
                Call Student
              </a>
              <Button variant="secondary" onClick={() => setSelectedEnquiryDetails(null)} style={{ flex: 1, padding: '8px 0' }}>
                Dismiss File
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </motion.section>
  );
};
