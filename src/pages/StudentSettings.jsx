import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { logger } from '../utils/logger';

const POPULAR_INSTITUTIONS = [
  'Indian Institute of Technology (IIT)',
  'National Institute of Technology (NIT)',
  'Birla Institute of Technology and Science (BITS)',
  'Massachusetts Institute of Technology (MIT)',
  'Stanford University',
  'California Institute of Technology (Caltech)',
  'Indian Institute of Science (IISc)',
  'Delhi Technological University (DTU)'
];

const DEPARTMENTS = [
  'Electrical Engineering',
  'Electronics & Communication',
  'Robotics & Automation',
  'Computer Science',
  'Mechanical Engineering',
  'Physics',
  'Other'
];

const YEAR_LABELS = {
  '1': '1st Year',
  '2': '2nd Year',
  '3': '3rd Year',
  '4': '4th Year',
  '5': '5th Year',
  'PG': 'Postgraduate',
  'Other': 'Other'
};

export const StudentSettings = () => {
  const { profile, refreshProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security' | 'notifications' | 'danger'
  
  // Profile Form States
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [institution, setInstitution] = useState(profile?.institution || '');
  const [department, setDepartment] = useState(profile?.department || '');
  const [yearOfStudy, setYearOfStudy] = useState(profile?.year_of_study || '');
  const [photoPath, setPhotoPath] = useState(profile?.profile_photo || '');
  const [searchFocused, setSearchFocused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Security States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Notification States
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Modal States
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Status & Feedback States
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message: string }

  const filteredInstitutions = POPULAR_INSTITUTIONS.filter(inst => 
    inst.toLowerCase().includes(institution.toLowerCase())
  );

  const showCreateNew = institution.trim() && !POPULAR_INSTITUTIONS.some(inst => 
    inst.toLowerCase() === institution.trim().toLowerCase()
  );

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFeedback(null);

    try {
      const uploadedPath = await userService.uploadProfilePhoto(file, photoPath);
      setPhotoPath(uploadedPath);
      setFeedback({ type: 'success', message: 'Profile photo uploaded successfully!' });
    } catch (err) {
      logger.error('[StudentSettings] Photo upload failed:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to upload profile photo.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      await userService.updateProfile({
        id: profile.id,
        full_name: fullName.trim(),
        phone: phone.trim(),
        institution: institution.trim(),
        department,
        year_of_study: yearOfStudy,
        profile_photo: photoPath
      });
      await refreshProfile();
      setFeedback({ type: 'success', message: 'Profile details updated successfully!' });
    } catch (err) {
      logger.error('[StudentSettings] Failed to save profile:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to save profile details.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    setPasswordStrength(getPasswordStrength(pwd));
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setFeedback({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      await authService.updatePassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStrength(0);
      setFeedback({ type: 'success', message: 'Password updated successfully!' });
    } catch (err) {
      logger.error('[StudentSettings] Password update failed:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to update password.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivateAccount = async () => {
    setIsSaving(true);
    setFeedback(null);

    try {
      logger.log(`[StudentSettings] Deactivating student profile ID: ${profile.id}`);
      // Update status to inactive in database
      await userService.updateProfile({
        id: profile.id,
        status: 'inactive'
      });
      setShowDeactivateModal(false);
      await logout();
    } catch (err) {
      logger.error('[StudentSettings] Deactivation failed:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to deactivate profile.' });
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '110px 24px 40px 24px',
        fontFamily: 'Inter, sans-serif',
        color: 'var(--text-primary, #f3f4f6)'
      }}
    >
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0', color: '#fff', letterSpacing: '-0.5px' }}>
          Account Settings
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary, #94a3b8)', margin: 0 }}>
          Manage your student profile, security, and notification preferences.
        </p>
      </div>

      {feedback && (
        <div style={{
          padding: '12px 16px',
          background: feedback.type === 'success' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
          border: feedback.type === 'success' ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          color: feedback.type === 'success' ? 'var(--accent-success, #22c55e)' : 'var(--accent-danger, #ef4444)',
          fontSize: '13px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{feedback.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Settings Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gap: '40px'
      }} className="settings-grid">
        
        {/* Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { id: 'profile', label: 'Profile Details', icon: '👤' },
            { id: 'security', label: 'Password & Security', icon: '🔒' },
            { id: 'notifications', label: 'Notifications', icon: '🔔' },
            { id: 'danger', label: 'Danger Zone', icon: '⚠️' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setFeedback(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'rgba(139, 92, 246, 0.08)' : 'none',
                  color: isActive ? 'var(--accent-violet, #8b5cf6)' : 'var(--text-secondary, #94a3b8)',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Panel Container */}
        <div style={{
          background: 'var(--bg-secondary, #111115)',
          border: '1px solid var(--border-color, rgba(255,255,255,0.04))',
          borderRadius: '12px',
          padding: '32px'
        }}>
          <AnimatePresence mode="wait">
            
            {/* 1. Profile Details Form */}
            {activeTab === 'profile' && (
              <motion.form 
                key="profile-form"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onSubmit={handleProfileSave}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0', color: '#fff' }}>Profile Details</h3>
                
                {/* Avatar upload */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {photoPath ? (
                      <img 
                        src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profiles/${photoPath}`}
                        alt="Avatar Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <span style={{ fontSize: '28px' }}>👤</span>
                    )}
                    {isUploading && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="settings-avatar-upload" style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-violet, #8b5cf6)', cursor: 'pointer', textDecoration: 'underline' }}>
                      Change Photo
                    </label>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted, #64748b)' }}>JPG or PNG. Max 2MB.</span>
                    <input id="settings-avatar-upload" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={isUploading} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row-grid">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
                    <input type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</label>
                    <input type="text" className="form-input" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>

                {/* Searchable Institution input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Institution</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search your college..."
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    required
                  />
                  {searchFocused && (institution.trim() || filteredInstitutions.length > 0) && (
                    <div style={{
                      position: 'absolute',
                      top: '64px',
                      left: 0,
                      right: 0,
                      background: 'var(--bg-secondary, #111115)',
                      border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
                      borderRadius: '8px',
                      zIndex: 10,
                      maxHeight: '150px',
                      overflowY: 'auto'
                    }}>
                      {filteredInstitutions.map((inst, idx) => (
                        <div
                          key={idx}
                          onMouseDown={() => setInstitution(inst)}
                          style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.02)' }}
                          className="institution-item"
                        >
                          {inst}
                        </div>
                      ))}
                      {showCreateNew && (
                        <div
                          onMouseDown={() => setInstitution(institution.trim())}
                          style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: 'var(--accent-violet)', fontWeight: '700' }}
                        >
                          + Add "{institution.trim()}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row-grid">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department</label>
                    <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)} required>
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map((dept, idx) => (
                        <option key={idx} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Year of Study</label>
                    <select className="form-select" value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)} required>
                      <option value="">Select Year</option>
                      {Object.keys(YEAR_LABELS).map((val) => (
                        <option key={val} value={val}>{YEAR_LABELS[val]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button type="submit" variant="primary" disabled={isSaving} style={{ alignSelf: 'flex-start', padding: '10px 24px', fontWeight: '700' }}>
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </motion.form>
            )}

            {/* 2. Security Form */}
            {activeTab === 'security' && (
              <motion.form 
                key="security-form"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onSubmit={handlePasswordSave}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0', color: '#fff' }}>Change Password</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Password</label>
                  <input type="password" className="form-input" placeholder="Min. 8 characters" value={newPassword} onChange={handlePasswordChange} required />
                  
                  {newPassword && (
                    <div style={{ marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted, #94a3b8)', marginBottom: '4px' }}>
                        <span>Password Strength</span>
                        <span style={{ color: ['#64748b', '#ef4444', '#f97316', '#22c55e', '#a855f7'][passwordStrength], fontWeight: '700' }}>
                          {['Empty', 'Weak', 'Fair', 'Strong', 'Excellent'][passwordStrength]}
                        </span>
                      </div>
                      <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '1.5px', overflow: 'hidden' }}>
                        <div style={{ width: `${(passwordStrength / 4) * 100}%`, height: '100%', background: ['#64748b', '#ef4444', '#f97316', '#22c55e', '#a855f7'][passwordStrength], transition: 'all 0.3s' }} />
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm Password</label>
                  <input type="password" className="form-input" placeholder="Repeat new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>

                <Button type="submit" variant="primary" disabled={isSaving} style={{ alignSelf: 'flex-start', padding: '10px 24px', fontWeight: '700' }}>
                  {isSaving ? 'Updating Password...' : 'Update Password'}
                </Button>
              </motion.form>
            )}

            {/* 3. Notifications Form */}
            {activeTab === 'notifications' && (
              <motion.div 
                key="notifications-form"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
              >
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0', color: '#fff' }}>Notification Preferences</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary, #94a3b8)', margin: 0 }}>Choose how you would like to stay updated with Flyen.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700' }}>Product & Feature Updates</h4>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>Receive emails about new component workspaces and learning modules.</p>
                    </div>
                    <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700' }}>Weekly Digest</h4>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>A summary of your learning progress, streaks, and recommendations.</p>
                    </div>
                    <input type="checkbox" checked={weeklyDigest} onChange={(e) => setWeeklyDigest(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. Danger Zone */}
            {activeTab === 'danger' && (
              <motion.div 
                key="danger-zone"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--accent-danger, #ef4444)' }}>Danger Zone</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary, #94a3b8)', margin: 0 }}>Permanently deactivate your student profile. This action cannot be undone.</p>
                </div>

                <div style={{
                  background: 'rgba(239, 68, 68, 0.03)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  padding: '20px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700' }}>Deactivate Account</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>This will sign you out and set your profile status to inactive.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeactivateModal(true)}
                    style={{
                      background: 'var(--accent-danger, #ef4444)',
                      border: 'none',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Deactivate Profile
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Account Deactivation Modal */}
      <Modal isOpen={showDeactivateModal} onClose={() => setShowDeactivateModal(false)} className="modal-content crimson" style={{ maxWidth: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', color: '#fff' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            color: 'var(--accent-danger, #ef4444)',
            boxShadow: '0 0 24px rgba(239, 68, 68, 0.15)'
          }}>
            ⚠️
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0' }}>Are you absolutely sure?</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary, #94a3b8)', lineHeight: '1.6', margin: 0 }}>
              Deactivating your profile will revoke your access to progress tracking and bookmarks. You will be logged out immediately.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleDeactivateAccount}
              disabled={isSaving}
              style={{
                flex: 1,
                background: 'var(--accent-danger, #ef4444)',
                border: 'none',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {isSaving ? 'Deactivating...' : 'Yes, Deactivate'}
            </button>
            <button
              onClick={() => setShowDeactivateModal(false)}
              disabled={isSaving}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-secondary, #94a3b8)',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Responsive styling overrides */}
      <style>{`
        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .form-row-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </motion.div>
  );
};
