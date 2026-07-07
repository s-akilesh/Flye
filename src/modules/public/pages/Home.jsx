import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../../projects/hooks/useProjects';
import { useEnquiries } from '../../enquiries/hooks/useEnquiries';
import { useToast } from '../../../shared/context/ToastContext';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Footer } from '../../../shared/components/layout/Footer';
import { ROUTES } from '../../../shared/constants/routes';
import { useSettings } from '../../settings/hooks/useSettings';

export const Home = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { addEnquiry, isProcessing } = useEnquiries();
  const { showToast } = useToast();
  const { settings } = useSettings();

  // Local state for featured project tab selection
  const [activeTab, setActiveTab] = useState('Popular');

  // Detailed project request form states
  const [orderedProject, setOrderedProject] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [projectStatus, setProjectStatus] = useState('Not Started yet');
  const [requestorName, setRequestorName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [needDocument, setNeedDocument] = useState('Yes');
  const [needPresentation, setNeedPresentation] = useState('Yes');
  const [customProjectTitle, setCustomProjectTitle] = useState('');
  const [projectRemarks, setProjectRemarks] = useState('');
  const [orderStep, setOrderStep] = useState('input'); // 'input' | 'success'

  const handleScrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter 6 featured projects dynamically based on tabs
  const featuredProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    
    let list = [...projects];
    if (activeTab === 'Popular') {
      list.sort((a, b) => (b.badge === 'best-seller' ? 1 : 0) - (a.badge === 'best-seller' ? 1 : 0));
    } else if (activeTab === 'Latest') {
      list.sort((a, b) => b.id.localeCompare(a.id));
    } else if (activeTab === 'Affordable') {
      list.sort((a, b) => a.price - b.price);
    } else if (activeTab === 'Trending') {
      list.reverse();
    }
    return list.slice(0, 6);
  }, [projects, activeTab]);

  const handleOpenFormModal = (status, proj = null) => {
    setProjectStatus(status);
    setOrderedProject(proj);
    setRequestorName('');
    setContactNumber('');
    setProjectBudget('');
    setSubmissionDate('');
    setNeedDocument('Yes');
    setNeedPresentation('Yes');
    setCustomProjectTitle(proj ? proj.title : '');
    setProjectRemarks('');
    setOrderStep('input');
    setIsOpenModal(true);
  };

  const handleOpenOrderModal = (proj) => {
    handleOpenFormModal('Choosed Flyen Project', proj);
  };

  const handleRequestSubmit = async () => {
    if (!requestorName.trim()) {
      showToast('Please enter your name.', 'error');
      return;
    }
    if (!contactNumber.trim() || contactNumber.replace(/\D/g, '').length < 10) {
      showToast('Please enter a valid 10-digit contact number.', 'error');
      return;
    }

    const titleToUse = projectStatus === 'Choosed Flyen Project' 
      ? (orderedProject?.title || customProjectTitle)
      : customProjectTitle;

    // Serialize all details cleanly into notes
    const serializedNotes = [
      `Project Status: ${projectStatus}`,
      `Budget: ${projectBudget ? `₹${projectBudget}` : 'Not specified'}`,
      `Submission Date: ${submissionDate || 'Not specified'}`,
      `Need Document: ${needDocument}`,
      `Need Presentation Support: ${needPresentation}`,
      projectRemarks.trim() ? `Remarks: ${projectRemarks}` : ''
    ].filter(Boolean).join('\n');

    try {
      await addEnquiry({
        name: requestorName,
        mobile: contactNumber,
        projectId: orderedProject?.id || '',
        projectTitle: titleToUse || 'Custom Project Enquiry',
        price: orderedProject?.price || '',
        notes: serializedNotes
      });
      setOrderStep('success');
      showToast('Your request has been successfully submitted!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <motion.main
      id="main-gateway"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0', 
        paddingBottom: '0',
        width: '100vw',
        maxWidth: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        minHeight: 'calc(100vh - 120px)',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      
      {/* 1. HERO SECTION & VALUE PROPOSITIONS (FULL WIDTH) */}
      <section 
        className="hero-section" 
        style={{ 
          textAlign: 'center', 
          padding: '120px var(--page-padding) 60px var(--page-padding)', 
          background: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.15), transparent 50%)',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          width: '100%',
          minHeight: '100vh',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: '800', color: 'var(--accent-violet)', letterSpacing: '2px' }}>
          {settings.companyTagline || 'Build • Print • Learn'}
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#fff', margin: '0 max(20px, 4%)', lineHeight: '1.35', maxWidth: '800px' }}>
          Complete Your Engineering Project with Confidence
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary, #9ca3af)', maxWidth: '600px', margin: '0 auto 8px auto', lineHeight: '1.6' }}>
          Affordable Engineering Projects with complete guidance from project selection to final presentation.
        </p>

        {/* Hero CTAs */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px', marginBottom: '48px' }}>
          <Button variant="primary" onClick={() => handleScrollToSection('how-can-we-help')} style={{ padding: '12px 28px', fontSize: '14px', fontWeight: 'bold' }}>
            Request / Find My project
          </Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.PROJECTS)} style={{ padding: '12px 28px', fontSize: '14px', fontWeight: 'bold' }}>
            Browse Projects
          </Button>
        </div>

        {/* Redesigned 5 Options/Value Propositions Grid (Super Attractive & check icon only) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', width: '100%', maxWidth: '1100px', marginTop: '16px' }}>
          {[
            { 
              label: 'Affordable Project Kits', 
              desc: 'High-quality hardware components at prices students can actually afford.', 
              color: 'var(--accent-emerald, #10b981)',
              bg: 'rgba(16, 185, 129, 0.05)',
              border: 'rgba(16, 185, 129, 0.15)'
            },
            { 
              label: 'Documentation Included', 
              desc: 'Complete, structured project report files ready for your college submission.', 
              color: 'var(--accent-emerald, #10b981)',
              bg: 'rgba(16, 185, 129, 0.05)',
              border: 'rgba(16, 185, 129, 0.15)'
            },
            { 
              label: 'Technical Guidance', 
              desc: 'Step-by-step block diagrams, circuit schematics, and complete code explanations.', 
              color: 'var(--accent-emerald, #10b981)',
              bg: 'rgba(16, 185, 129, 0.05)',
              border: 'rgba(16, 185, 129, 0.15)'
            },
            { 
              label: 'Continuous Support', 
              desc: 'Dedicated technical debug support and help until your final submission day.', 
              color: 'var(--accent-emerald, #10b981)',
              bg: 'rgba(16, 185, 129, 0.05)',
              border: 'rgba(16, 185, 129, 0.15)'
            }
          ].map((vp, idx) => (
            <div 
              key={idx} 
              className="card-glass hover-lift" 
              style={{ 
                padding: '24px 16px', 
                borderRadius: '12px', 
                border: `1px solid ${vp.border}`, 
                background: vp.bg,
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-icons" style={{ fontSize: '20px', color: vp.color }}>check</span>
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', margin: 0 }}>{vp.label}</h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary, #9ca3af)', margin: 0, lineHeight: '1.4' }}>{vp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. SECTION 2: HOW CAN WE HELP YOU? (FULL WIDTH BACKGROUND) */}
      <section id="how-can-we-help" style={{ padding: '110px var(--page-padding)', background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, transparent 100%)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 8px 0' }}>How Can We Help You?</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted, #6b7280)' }}>Select the customer journey that fits your current academic needs</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            {
              title: 'Help Me Choose a Project',
              desc: "I don't know which engineering project to select.",
              cta: 'Contact our Expert',
              action: () => handleOpenFormModal('Not Started yet'),
              icon: 'explore'
            },
            {
              title: 'I Have a Project Idea',
              desc: "I have a project title but don't know how to build it.",
              cta: 'Request Guidance',
              action: () => handleOpenFormModal('Have Project idea'),
              icon: 'tips_and_updates'
            },
            {
              title: 'I Already choosed my project from flyen',
              desc: 'I found the project I want in the Flyen catalog and am ready to get the complete solution.',
              cta: 'Browse Projects',
              action: () => navigate(ROUTES.PROJECTS),
              icon: 'local_library'
            },
            {
              title: 'Help Me Complete My Project',
              desc: 'I need documentation, guidance, debugging support, or presentation preparation.',
              cta: 'Get Support',
              action: () => handleOpenFormModal('Need Only Support'),
              icon: 'verified_user'
            }
          ].map((card, idx) => (
            <div 
              key={idx}
              className="journey-card"
              onClick={card.action}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span className="material-icons" style={{ fontSize: '32px', color: 'var(--accent-violet)' }}>{card.icon}</span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0 }}>{card.title}</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary, #9ca3af)', margin: 0, lineHeight: '1.5' }}>{card.desc}</p>
              </div>
              <button 
                type="button"
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--accent-violet)', 
                  fontWeight: 'bold', 
                  fontSize: '13px', 
                  textAlign: 'left', 
                  padding: 0, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {card.cta} &rarr;
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECTION 3: FEATURED ENGINEERING PROJECTS (FULL WIDTH SECTION) */}
      <section style={{ padding: '80px var(--page-padding)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '40px', maxWidth: '1100px', margin: '0 auto 40px auto' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 8px 0' }}>Featured Engineering Projects</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted, #6b7280)', margin: 0 }}>Choose a certified project package to start immediately</p>
          </div>

          {/* Tabs Selector */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '4px' }}>
            {['Popular', 'Latest', 'Affordable', 'Trending'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? 'var(--accent-violet)' : 'none',
                  border: 'none',
                  color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Projects Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
          {featuredProjects.map((proj) => {
            const diff = proj.difficulty?.toLowerCase();
            return (
              <div 
                key={proj.id} 
                className="card-glass hover-lift" 
                style={{ 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Card Visual / Graphic */}
                  <div style={{ height: '140px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '8px' }}>
                    <svg viewBox="0 0 48 48" style={{ width: '40px', height: '40px', stroke: 'var(--text-muted)', strokeWidth: 1.5, fill: 'none' }}>
                      <rect x="10" y="10" width="28" height="28" rx="2" />
                      <circle cx="24" cy="24" r="5" />
                      <line x1="15" y1="24" x2="33" y2="24" />
                    </svg>
                  </div>

                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent-violet)', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    {proj.projectLevel || 'Engineering'} Project
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '4px 0 8px 0', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '40px' }}>
                    {proj.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary, #9ca3af)', margin: 0, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px', lineHeight: '1.4' }}>
                    {proj.description}
                  </p>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                    <span className={`status-pill diff-${diff}`} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px' }}>
                      {proj.difficulty}
                    </span>
                    <span className="status-pill" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
                      {proj.category}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px', marginTop: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '950', color: '#fff' }}>₹{proj.price}</span>
                  <Button type="button" variant="secondary" onClick={() => handleOpenOrderModal(proj)} style={{ padding: '6px 14px', fontSize: '12px' }}>
                    Request Project
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SECTION 4: WHY STUDENTS CHOOSE FLYEN (FULL WIDTH BACKGROUND) */}
      <section id="about" style={{ padding: '110px var(--page-padding)', background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.04) 0%, transparent 100%)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 8px 0' }}>Why Students Choose Flyen</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted, #6b7280)' }}>Flyen supports you step-by-step, unlike traditional sellers</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', maxWidth: '960px', margin: '0 auto' }}>
          
          {/* Col 1: Traditional Project Centers (Check icon in green) */}
          <div className="card-glass" style={{ padding: '32px 24px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Traditional Project Centers
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                'Only sell hardware and source code packages',
                'Provide a quick, one-time overview of the kit',
                'Extremely limited debug support or documentation'
              ].map((text, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: 'var(--text-secondary, #9ca3af)' }}>
                  <span className="material-icons" style={{ fontSize: '16px', color: 'var(--accent-emerald, #10b981)', marginTop: '2px' }}>check</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Flyen Accents (Check icon in green) */}
          <div className="card-glass" style={{ padding: '32px 24px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(16, 185, 129, 0.02)', boxShadow: '0 0 30px rgba(16, 185, 129, 0.05)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-emerald, #10b981)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Flyen Platform
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                'Helps you choose the right project based on your requirements',
                'Explains core circuit concepts & component operations',
                'Complete structured project documentation included',
                'Comprehensive technical guidance & live hardware debugging support',
                'Expert presentation slides preparation & guidance',
                'Continuous support until your final project submission'
              ].map((text, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: '#fff' }}>
                  <span className="material-icons" style={{ fontSize: '16px', color: 'var(--accent-emerald, #10b981)', marginTop: '2px' }}>check</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* 5. SECTION 5: YOUR PROJECT JOURNEY (FULL WIDTH) */}
      <section id="how-it-works" style={{ padding: '80px var(--page-padding)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 8px 0' }}>Your Project Journey</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted, #6b7280)' }}>Six simple steps to execute your project successfully</p>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '20px 0' }}>
          
          {/* Continuous curved connector line (Desktop only) */}
          <div className="desktop-connector-svg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
            <svg width="100%" height="100%" viewBox="0 0 1100 240" fill="none" preserveAspectRatio="none">
              <path 
                d="M 91.6,120 C 183.3,120 183.3,46 275,46 C 366.6,46 366.6,120 458.3,120 C 550,120 550,46 641.6,46 C 733.3,46 733.3,120 825,120 C 916.6,120 916.6,46 1008.3,46" 
                stroke="rgba(139, 92, 246, 0.35)" 
                strokeWidth="2.5" 
                strokeDasharray="6,6" 
                fill="none" 
              />
            </svg>
          </div>

          <div className="journey-grid-container">
            {[
              { 
                step: '01', 
                title: 'Choose Your Project', 
                bullets: ['Browse or tell us your project title.'] 
              },
              { 
                step: '02', 
                title: 'Discuss Your Requirements', 
                bullets: ['Budget', 'Submission Date', 'Documentation', 'Presentation Support'] 
              },
              { 
                step: '03', 
                title: 'Choose Your Package', 
                bullets: ['DIY Kit', 'Assembled Kit', 'Documentation Only'] 
              },
              { 
                step: '04', 
                title: 'Project Tested & Verified', 
                bullets: ['We test your project and share a working demonstration video before dispatch.'] 
              },
              { 
                step: '05', 
                title: 'Learn & Prepare', 
                bullets: ['Working Principle', 'Documentation & Code', 'Project Explanation', 'Build Guidance'] 
              },
              { 
                step: '06', 
                title: 'Receive & Present', 
                bullets: ['Receive your project on time to your doorstep.'] 
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`journey-step-wrapper ${idx % 2 === 0 ? 'offset-low' : ''}`}
              >
                <div className="journey-step-card-v2">
                  {/* Number badge above the line */}
                  <div className="journey-step-number-badge">
                    {item.step}
                  </div>
                  {/* Title below the number */}
                  <h4 className="journey-step-title-v2">{item.title}</h4>
                  {/* Detailed content shown on hover */}
                  <div className="journey-step-details-v2">
                    <ul className="journey-step-bullet-list">
                      {item.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>
                          <span className="material-icons" style={{ fontSize: '12px', color: 'var(--accent-emerald, #10b981)', marginTop: '2px' }}>check</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECTION 6: CONTACT CTA (FULL WIDTH BACKGROUND) */}
      <section style={{ padding: '80px var(--page-padding)', background: 'rgba(255, 255, 255, 0.01)', width: '100%', boxSizing: 'border-box' }}>
        <div 
          className="card-glass" 
          style={{ 
            maxWidth: '900px', 
            margin: '0 auto', 
            padding: '48px 32px', 
            borderRadius: '16px', 
            border: '1px solid rgba(139, 92, 246, 0.25)', 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(5,5,10,0.4) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0 }}>Still Confused About Your Project?</h2>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary, #9ca3af)', maxWidth: '600px', lineHeight: '1.6', margin: 0 }}>
            Talk to our engineering experts. We'll help you choose the right project based on your department, budget, and submission date.
          </p>
          <Button variant="primary" onClick={() => navigate('/contact')} style={{ padding: '12px 32px', fontSize: '14px', fontWeight: 'bold', marginTop: '8px' }}>
            Contact Us
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* Order Kit Confirmation Modal */}
      <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} className="modal-content purple" style={{ maxWidth: '600px', width: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        {orderStep === 'input' ? (
          <>
            {/* Fixed Header with Glass/Milk Background */}
            <div style={{
              padding: '24px 24px 16px 24px',
              background: 'rgba(255, 255, 255, 0.015)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              zIndex: 10,
              flexShrink: 0
            }}>
              <h4 style={{ textAlign: 'left', margin: 0, fontSize: '16px', fontWeight: '800', color: '#fff' }}>PROJECT ENQUIRY</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'left', margin: '4px 0 0 0' }}>
                Fill in your details below. Our engineering expert will coordinate with you.
              </p>
            </div>

            {/* Scrollable Middle Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', textAlign: 'left', width: '100%' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Your Name *</label>
                  <Input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={requestorName}
                    onChange={(e) => setRequestorName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Contact Number *</label>
                  <Input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="form-input"
                    maxLength={15}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Your Project Status</label>
                  <select
                    value={projectStatus}
                    onChange={(e) => {
                      setProjectStatus(e.target.value);
                      if (e.target.value !== 'Choosed Flyen Project') {
                        setOrderedProject(null);
                      }
                    }}
                    className="form-select"
                    style={{ height: '38px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '6px', width: '100%' }}
                  >
                    <option value="Not Started yet" style={{ background: '#09090d', color: '#fff' }}>Not Started yet</option>
                    <option value="Have Project idea" style={{ background: '#09090d', color: '#fff' }}>Have Project idea</option>
                    <option value="Need Only Support" style={{ background: '#09090d', color: '#fff' }}>Need Only Support</option>
                    <option value="Choosed Flyen Project" style={{ background: '#09090d', color: '#fff' }}>Choosed Flyen Project</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Project Title</label>
                  <Input
                    type="text"
                    placeholder="e.g. Smart Irrigation System"
                    value={projectStatus === 'Choosed Flyen Project' ? (orderedProject?.title || customProjectTitle) : customProjectTitle}
                    onChange={(e) => setCustomProjectTitle(e.target.value)}
                    disabled={projectStatus === 'Choosed Flyen Project' && !!orderedProject}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Budget (₹)</label>
                  <Input
                    type="text"
                    placeholder="e.g. 5000"
                    value={projectBudget}
                    onChange={(e) => setProjectBudget(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Submission Date</label>
                  <Input
                    type="date"
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                    className="form-input"
                    style={{ colorScheme: 'dark', height: '38px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Need Document?</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setNeedDocument('Yes')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needDocument === 'Yes' ? 'var(--accent-violet)' : 'rgba(255,255,255,0.02)',
                        border: needDocument === 'Yes' ? '1px solid var(--accent-violet)' : '1px solid rgba(255,255,255,0.08)',
                        color: needDocument === 'Yes' ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setNeedDocument('No')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needDocument === 'No' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.02)',
                        border: needDocument === 'No' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.08)',
                        color: needDocument === 'No' ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Need Presentation Support?</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setNeedPresentation('Yes')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needPresentation === 'Yes' ? 'var(--accent-violet)' : 'rgba(255,255,255,0.02)',
                        border: needPresentation === 'Yes' ? '1px solid var(--accent-violet)' : '1px solid rgba(255,255,255,0.08)',
                        color: needPresentation === 'Yes' ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setNeedPresentation('No')}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: needPresentation === 'No' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.02)',
                        border: needPresentation === 'No' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.08)',
                        color: needPresentation === 'No' ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', marginTop: '4px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Describe your project or any remark (optional)</label>
                <textarea
                  value={projectRemarks}
                  onChange={(e) => setProjectRemarks(e.target.value)}
                  placeholder="Specify any custom requirements, hardware needs, or comments..."
                  className="form-textarea"
                  style={{ width: '100%', minHeight: '80px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff', padding: '10px', fontSize: '12.5px' }}
                />
              </div>
            </div>

            {/* Fixed Footer with Glass/Milk Background */}
            <div style={{
              padding: '16px 24px 20px 24px',
              background: 'rgba(255, 255, 255, 0.015)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              gap: '12px',
              width: '100%',
              boxSizing: 'border-box',
              flexShrink: 0
            }}>
              <Button variant="secondary" onClick={() => setIsOpenModal(false)} disabled={isProcessing} style={{ flex: 1, height: '42px' }}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={isProcessing}
                onClick={handleRequestSubmit}
                style={{ flex: 1, height: '42px' }}
              >
                {isProcessing ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </>
        ) : (
          <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="modal-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald, #10b981)', marginBottom: '16px' }}>
              <span className="material-icons" style={{ fontSize: '32px' }}>check_circle</span>
            </div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800' }}>REQUEST RECEIVED</h4>
            <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Our engineering team has received your enquiry. We will call you back within 2 to 4 hours to coordinate project delivery and support details.
            </p>
            <Button variant="secondary" className="width-100" onClick={() => setIsOpenModal(false)} style={{ width: '100%', maxWidth: '200px' }}>
              Got It
            </Button>
          </div>
        )}
      </Modal>

    </motion.main>
  );
};