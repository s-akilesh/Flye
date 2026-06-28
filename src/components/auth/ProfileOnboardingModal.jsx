import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { logger } from '../../utils/logger';

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

export const ProfileOnboardingModal = ({ isOpen, onClose }) => {
  const { profile, refreshProfile } = useAuth();
  
  const [photoPath, setPhotoPath] = useState(profile?.profile_photo || '');
  const [institution, setInstitution] = useState(profile?.institution || '');
  const [department, setDepartment] = useState(profile?.department || '');
  const [yearOfStudy, setYearOfStudy] = useState(profile?.year_of_study || '');
  
  const [searchFocused, setSearchFocused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Filter institutions based on search query
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
    setError(null);

    try {
      logger.log('[ProfileOnboardingModal] Uploading profile avatar...');
      const uploadedPath = await userService.uploadProfilePhoto(file, photoPath);
      setPhotoPath(uploadedPath);
      logger.log('[ProfileOnboardingModal] Avatar uploaded. Path:', uploadedPath);
    } catch (err) {
      logger.error('[ProfileOnboardingModal] Photo upload failed:', err);
      setError(err.message || 'Failed to upload profile photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!institution.trim() || !department || !yearOfStudy) {
      setError('Please fill in all profile details.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      logger.log('[ProfileOnboardingModal] Saving profile details...');
      await userService.updateProfile({
        id: profile.id,
        profile_photo: photoPath,
        institution: institution.trim(),
        department,
        year_of_study: yearOfStudy
      });
      
      logger.log('[ProfileOnboardingModal] Profile saved. Refreshing context...');
      await refreshProfile();
      onClose();
    } catch (err) {
      logger.error('[ProfileOnboardingModal] Failed to save profile:', err);
      setError(err.message || 'Failed to save profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="modal-content purple" style={{ maxWidth: '440px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Complete Your Profile</h3>
          <button 
            type="button" 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted, #64748b)', fontSize: '16px', cursor: 'pointer', padding: '4px' }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{
            padding: '10px 12px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            color: 'var(--accent-danger, #ef4444)',
            fontSize: '12px'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Avatar Upload Zone */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
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
                <span style={{ fontSize: '24px' }}>👤</span>
              )}
              {isUploading && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label 
                htmlFor="avatar-upload" 
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'var(--accent-violet, #8b5cf6)',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Upload Photo
              </label>
              <span style={{ fontSize: '10px', color: 'var(--text-muted, #64748b)' }}>JPG, PNG up to 2MB</span>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                style={{ display: 'none' }} 
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Institution Searchable Autocomplete */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Institution</label>
            <input
              type="text"
              className="form-input"
              placeholder="Start typing your college..."
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
                maxHeight: '180px',
                overflowY: 'auto',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
              }}>
                {filteredInstitutions.map((inst, idx) => (
                  <div
                    key={idx}
                    onMouseDown={() => setInstitution(inst)}
                    style={{ padding: '10px 12px', fontSize: '12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.02)' }}
                    className="institution-item"
                  >
                    {inst}
                  </div>
                ))}
                {showCreateNew && (
                  <div
                    onMouseDown={() => setInstitution(institution.trim())}
                    style={{ padding: '10px 12px', fontSize: '12px', cursor: 'pointer', color: 'var(--accent-violet)', fontWeight: '700' }}
                  >
                    + Add "{institution.trim()}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Department Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department</label>
            <select
              className="form-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Year of Study Grid Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Year of Study</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {Object.keys(YEAR_LABELS).map((val) => {
                const isActive = yearOfStudy === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setYearOfStudy(val)}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '8px',
                      background: isActive ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255,255,255,0.01)',
                      border: isActive ? '1px solid var(--accent-violet, #8b5cf6)' : '1px solid rgba(255,255,255,0.04)',
                      color: isActive ? '#fff' : 'var(--text-secondary, #94a3b8)',
                      fontSize: '11px',
                      fontWeight: isActive ? '700' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isActive ? '0 0 12px rgba(139, 92, 246, 0.15)' : 'none'
                    }}
                  >
                    {YEAR_LABELS[val]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving || isUploading}
              style={{
                flex: 2,
                padding: '12px',
                fontWeight: '700',
                fontSize: '13px',
                background: 'linear-gradient(135deg, var(--accent-blue, #3b82f6), var(--accent-violet, #8b5cf6))',
                border: 'none',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.25)'
              }}
            >
              {isSaving ? 'Saving Details...' : 'Save and Complete'}
            </Button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                color: 'var(--text-secondary, #94a3b8)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Skip
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .institution-item:hover {
          background: rgba(255, 255, 255, 0.03) !important;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Modal>
  );
};
