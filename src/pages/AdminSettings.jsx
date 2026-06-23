import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { ROUTES } from '../constants/routes';
import { DEFAULT_SETTINGS } from '../context/SettingsContext';
import { useSettings } from '../hooks/useSettings';
import { ProjectContext } from '../context/ProjectContext';
import { EnquiryContext } from '../context/EnquiryContext';

// ─── Section Header ──────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title, subtitle }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
    <div style={{
      width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
      background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
    }}>
      {icon}
    </div>
    <div>
      <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
      {subtitle && <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>{subtitle}</p>}
    </div>
  </div>
);

// ─── Field Row ───────────────────────────────────────────────────────────────
const FieldRow = ({ label, hint, children }) => (
  <div className="calc-row settings-field-row">
    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
      {label}
    </label>
    {children}
    {hint && <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>{hint}</p>}
  </div>
);

// ─── Toggle ──────────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, id }) => (
  <label htmlFor={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
    <div style={{ position: 'relative', width: '44px', height: '24px' }}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
      />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '12px',
        background: checked ? 'var(--accent-violet)' : 'rgba(255,255,255,0.1)',
        border: `1.5px solid ${checked ? 'var(--accent-violet)' : 'rgba(255,255,255,0.15)'}`,
        transition: 'all 0.25s ease',
        boxShadow: checked ? '0 0 10px rgba(139,92,246,0.35)' : 'none'
      }} />
      <div style={{
        position: 'absolute', top: '3px',
        left: checked ? '23px' : '3px',
        width: '16px', height: '16px', borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.25s ease',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)'
      }} />
    </div>
  </label>
);

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color = 'var(--text-primary)' }) => (
  <div style={{
    padding: 'var(--space-3) var(--space-4)',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
    display: 'flex', flexDirection: 'column', gap: '2px'
  }}>
    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
    <span style={{ fontSize: '22px', fontWeight: '800', color, lineHeight: 1 }}>{value}</span>
  </div>
);

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ message, type }) => {
  if (!message) return null;
  const colors = {
    success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', text: 'var(--accent-emerald)' },
    error: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', text: 'var(--accent-crimson, #ef4444)' },
    info: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', text: 'var(--accent-violet)' },
  };
  const c = colors[type] || colors.info;
  return (
    <div style={{
      padding: 'var(--space-3) var(--space-4)', borderRadius: '8px',
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontSize: '13px', fontWeight: '600', marginBottom: 'var(--space-4)'
    }}>
      {message}
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export const AdminSettings = () => {
  const navigate = useNavigate();
  const { settings, saveSettings, resetDefaults } = useSettings();
  const { projects } = useContext(ProjectContext);
  const { enquiries } = useContext(EnquiryContext);

  // Local form state mirrors settings
  const [form, setForm] = useState({ ...settings });

  // Password section separate state
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // General toast
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const field = (key) => ({
    value: form[key] ?? '',
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  const handleSave = () => {
    saveSettings(form);
    showToast('✅ Settings saved successfully!', 'success');
  };

  const handleReset = () => {
    setForm({ ...DEFAULT_SETTINGS });
    resetDefaults();
    showToast('🔄 Settings reset to defaults.', 'info');
  };

  const handlePasswordChange = () => {
    setPwError('');
    setPwSuccess('');
    if (pwForm.current !== settings.adminPassword) {
      setPwError('Current password is incorrect.');
      return;
    }
    if (!pwForm.newPw || pwForm.newPw.length < 4) {
      setPwError('New password must be at least 4 characters.');
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      setPwError('New password and confirm password do not match.');
      return;
    }
    const updated = { ...form, adminPassword: pwForm.newPw };
    setForm(updated);
    saveSettings(updated);
    setPwForm({ current: '', newPw: '', confirm: '' });
    setPwSuccess('✅ Password updated successfully!');
  };

  // System stats
  const totalProjects = projects?.length ?? 0;
  const activeProjects = projects?.filter((p) => p.status === 'active').length ?? 0;
  const featuredProjects = projects?.filter((p) => p.featured).length ?? 0;
  const totalEnquiries = enquiries?.length ?? 0;

  const estimateStorage = () => {
    let total = 0;
    for (const key of ['flyen_projects', 'flyen_enquiries', 'flyen_settings']) {
      try {
        const v = localStorage.getItem(key);
        if (v) total += v.length * 2; // UTF-16 bytes approx
      } catch (_) {}
    }
    if (total < 1024) return `${total} B`;
    if (total < 1024 * 1024) return `${(total / 1024).toFixed(1)} KB`;
    return `${(total / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <motion.section
      className="portal-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page Header */}
      <div className="portal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Button
            variant="secondary"
            className="btn-back"
            onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            style={{ padding: '8px', minWidth: 'auto' }}
          >
            <svg viewBox="0 0 24 24">
              <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z" />
            </svg>
          </Button>
          <div className="portal-title-area">
            <h2>Platform Settings</h2>
            <p>Centralized configuration hub for the Flyen platform</p>
          </div>
        </div>
        <div className="portal-header-meta" style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Button variant="ghost" onClick={handleReset} style={{ fontSize: '13px', padding: '8px 16px' }}>
            Reset Defaults
          </Button>
          <Button variant="primary" onClick={handleSave} style={{ fontSize: '13px', padding: '8px 20px' }}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="portal-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Toast message={toast.message} type={toast.type} />

        {/* ── Two-column layout ── */}
        <div className="settings-grid">

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

            {/* Section 1: Company Information */}
            <Card className="card-glass" style={{ padding: 'var(--space-5)' }}>
              <SectionHeader icon="🏢" title="Company Information" subtitle="Your business identity shown publicly across the platform" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <FieldRow label="Company Name">
                  <Input id="s-company-name" type="text" className="form-input" placeholder="e.g. Flyen Labs" {...field('companyName')} />
                </FieldRow>
                <FieldRow label="Tagline" hint="Short phrase shown on the homepage hero">
                  <Input id="s-tagline" type="text" className="form-input" placeholder="e.g. Build. Learn. Innovate." {...field('companyTagline')} />
                </FieldRow>
                <FieldRow label="Contact Email">
                  <Input id="s-email" type="email" className="form-input" placeholder="e.g. info@flyenlabs.com" {...field('contactEmail')} />
                </FieldRow>
                <FieldRow label="Contact Phone">
                  <Input id="s-phone" type="tel" className="form-input" placeholder="e.g. +91 9876543210" {...field('contactPhone')} />
                </FieldRow>
                <FieldRow label="WhatsApp Number" hint="Number only, no spaces or +, e.g. 919876543210">
                  <Input id="s-whatsapp" type="tel" className="form-input" placeholder="e.g. 919876543210" {...field('whatsappNumber')} />
                </FieldRow>
                <FieldRow label="Company Address">
                  <Input id="s-address" type="text" className="form-input" placeholder="e.g. Lab Sector 7, Tech City" {...field('companyAddress')} />
                </FieldRow>
              </div>
            </Card>

            {/* Section 2: Social Media */}
            <Card className="card-glass" style={{ padding: 'var(--space-5)' }}>
              <SectionHeader icon="🔗" title="Social Media" subtitle="Social profile links shown in the footer and contact page" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <FieldRow label="Instagram URL">
                  <Input id="s-instagram" type="url" className="form-input" placeholder="https://instagram.com/yourpage" {...field('instagramUrl')} />
                </FieldRow>
                <FieldRow label="YouTube URL">
                  <Input id="s-youtube" type="url" className="form-input" placeholder="https://youtube.com/@yourchannel" {...field('youtubeUrl')} />
                </FieldRow>
                <FieldRow label="LinkedIn URL">
                  <Input id="s-linkedin" type="url" className="form-input" placeholder="https://linkedin.com/company/yourpage" {...field('linkedinUrl')} />
                </FieldRow>
                <FieldRow label="Facebook URL" hint="Optional">
                  <Input id="s-facebook" type="url" className="form-input" placeholder="https://facebook.com/yourpage" {...field('facebookUrl')} />
                </FieldRow>
              </div>
            </Card>

          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

            {/* Section 3: Website Configuration */}
            <Card className="card-glass" style={{ padding: 'var(--space-5)' }}>
              <SectionHeader icon="⚙️" title="Website Configuration" subtitle="Global site behavior and display settings" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <FieldRow label="Currency" hint="Displayed across pricing, project cards, and enquiry tables">
                  <select
                    id="s-currency"
                    className="form-select"
                    value={form.currency}
                    onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                  >
                    <option value="INR">INR — Indian Rupee (₹)</option>
                    <option value="USD">USD — US Dollar ($)</option>
                    <option value="EUR">EUR — Euro (€)</option>
                  </select>
                </FieldRow>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  background: form.maintenanceMode ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${form.maintenanceMode ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '8px', transition: 'all 0.25s ease'
                }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: form.maintenanceMode ? 'var(--accent-crimson, #ef4444)' : 'var(--text-primary)', margin: 0 }}>
                      {form.maintenanceMode ? '🔴 Maintenance Mode ON' : '🟢 Maintenance Mode OFF'}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      When enabled, public visitors see a maintenance screen. Admin routes remain accessible.
                    </p>
                  </div>
                  <Toggle
                    id="s-maintenance"
                    checked={form.maintenanceMode}
                    onChange={(e) => setForm((f) => ({ ...f, maintenanceMode: e.target.checked }))}
                  />
                </div>
              </div>
            </Card>

            {/* Section 4: Admin Security */}
            <Card className="card-glass" style={{ padding: 'var(--space-5)' }}>
              <SectionHeader icon="🔒" title="Admin Security" subtitle="Update the administration portal access password" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {pwError && (
                  <div style={{ fontSize: '12px', color: 'var(--accent-crimson, #ef4444)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', padding: 'var(--space-2) var(--space-3)', borderRadius: '6px' }}>
                    ⚠️ {pwError}
                  </div>
                )}
                {pwSuccess && (
                  <div style={{ fontSize: '12px', color: 'var(--accent-emerald)', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: 'var(--space-2) var(--space-3)', borderRadius: '6px' }}>
                    {pwSuccess}
                  </div>
                )}
                <FieldRow label="Current Password">
                  <Input
                    id="s-pw-current"
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={pwForm.current}
                    onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                    style={{ letterSpacing: pwForm.current ? '3px' : '0' }}
                  />
                </FieldRow>
                <FieldRow label="New Password">
                  <Input
                    id="s-pw-new"
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={pwForm.newPw}
                    onChange={(e) => setPwForm((f) => ({ ...f, newPw: e.target.value }))}
                    style={{ letterSpacing: pwForm.newPw ? '3px' : '0' }}
                  />
                </FieldRow>
                <FieldRow label="Confirm New Password">
                  <Input
                    id="s-pw-confirm"
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                    style={{ letterSpacing: pwForm.confirm ? '3px' : '0' }}
                  />
                </FieldRow>
                <Button variant="secondary" onClick={handlePasswordChange} style={{ alignSelf: 'flex-start', fontSize: '13px', padding: '8px 20px' }}>
                  Update Password
                </Button>
              </div>
            </Card>

            {/* Section 5: System Information */}
            <Card className="card-glass" style={{ padding: 'var(--space-5)' }}>
              <SectionHeader icon="📊" title="System Information" subtitle="Live read-only platform statistics" />
              <div className="settings-stats-grid">
                <StatCard label="Total Projects" value={totalProjects} color="var(--text-primary)" />
                <StatCard label="Active Projects" value={activeProjects} color="var(--accent-emerald)" />
                <StatCard label="Featured Projects" value={featuredProjects} color="var(--accent-amber, #f59e0b)" />
                <StatCard label="Total Enquiries" value={totalEnquiries} color="var(--accent-blue)" />
              </div>
              <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Storage Used (localStorage)</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-violet)' }}>{estimateStorage()}</span>
              </div>
            </Card>

          </div>
        </div>

        {/* Bottom Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', paddingBottom: 'var(--space-6)' }}>
          <Button variant="ghost" onClick={handleReset} style={{ fontSize: '13px', padding: '10px 20px' }}>
            Reset Defaults
          </Button>
          <Button variant="primary" onClick={handleSave} style={{ fontSize: '13px', padding: '10px 24px' }}>
            Save Changes
          </Button>
        </div>
      </div>
    </motion.section>
  );
};
