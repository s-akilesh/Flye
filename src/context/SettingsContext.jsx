import React, { createContext, useState, useEffect } from 'react';
import { settingsService } from '../services/settingsService';
import { logger } from '../utils/logger';
import { supabase } from '../lib/supabase';

export const SettingsContext = createContext();

export const DEFAULT_SETTINGS = {
  companyName: '',
  companyTagline: '',
  contactEmail: '',
  contactPhone: '',
  whatsappNumber: '',
  companyAddress: '',
  instagramUrl: '',
  youtubeUrl: '',
  linkedinUrl: '',
  facebookUrl: '',
  twitterUrl: '',
  githubUrl: '',
  websiteUrl: '',
  currency: 'INR',
  maintenanceMode: false,
  adminPassword: 'admin123',
  websiteLogo: '',
  websiteFavicon: '',
  footerText: '',
  copyrightText: '',
  notificationEmail: '',
  replyToEmail: '',
  profilePhoto: '',
  profileName: '',
  profileEmail: '',
  profilePhone: '',
  profileDesignation: '',
  lastPasswordChanged: 'June 2026',
  lastLogin: 'Just now',
};

// Map DB snake_case columns to Context camelCase properties
const mapDbToContext = (dbRow) => {
  if (!dbRow) return {};
  return {
    companyName: dbRow.website_name ?? '',
    companyTagline: dbRow.website_tagline ?? '',
    websiteLogo: dbRow.logo_url ?? '',
    websiteFavicon: dbRow.favicon_url ?? '',
    companyAddress: dbRow.address ?? '',
    contactEmail: dbRow.contact_email ?? '',
    contactPhone: dbRow.contact_phone ?? '',
    whatsappNumber: dbRow.whatsapp_number ?? '',
    instagramUrl: dbRow.instagram_url ?? '',
    youtubeUrl: dbRow.youtube_url ?? '',
    linkedinUrl: dbRow.linkedin_url ?? '',
    facebookUrl: dbRow.facebook_url ?? '',
    githubUrl: dbRow.github_url ?? '',
    websiteUrl: dbRow.website_url ?? '',
    footerText: dbRow.footer_text ?? '',
    copyrightText: dbRow.copyright_text ?? '',
    notificationEmail: dbRow.notification_email ?? '',
    replyToEmail: dbRow.reply_to_email ?? '',
    profilePhoto: dbRow.profile_photo ?? '',
    profileName: dbRow.profile_name ?? '',
    profileEmail: dbRow.profile_email ?? '',
    profilePhone: dbRow.profile_phone ?? '',
    profileDesignation: dbRow.profile_designation ?? '',
  };
};

// Map Context camelCase properties to DB snake_case columns (Only include verified columns to avoid Postgrest cache errors)
const mapContextToDb = (contextData) => {
  const dbRow = {};
  if (contextData.companyName !== undefined) dbRow.website_name = contextData.companyName;
  if (contextData.companyTagline !== undefined) dbRow.website_tagline = contextData.companyTagline;
  if (contextData.websiteLogo !== undefined) dbRow.logo_url = contextData.websiteLogo;
  if (contextData.websiteFavicon !== undefined) dbRow.favicon_url = contextData.websiteFavicon;
  if (contextData.companyAddress !== undefined) dbRow.address = contextData.companyAddress;
  if (contextData.contactEmail !== undefined) dbRow.contact_email = contextData.contactEmail;
  if (contextData.contactPhone !== undefined) dbRow.contact_phone = contextData.contactPhone;
  if (contextData.whatsappNumber !== undefined) dbRow.whatsapp_number = contextData.whatsappNumber;
  if (contextData.instagramUrl !== undefined) dbRow.instagram_url = contextData.instagramUrl;
  if (contextData.youtubeUrl !== undefined) dbRow.youtube_url = contextData.youtubeUrl;
  if (contextData.linkedinUrl !== undefined) dbRow.linkedin_url = contextData.linkedinUrl;
  if (contextData.facebookUrl !== undefined) dbRow.facebook_url = contextData.facebookUrl;
  if (contextData.githubUrl !== undefined) dbRow.github_url = contextData.githubUrl;
  if (contextData.websiteUrl !== undefined) dbRow.website_url = contextData.websiteUrl;
  if (contextData.footerText !== undefined) dbRow.footer_text = contextData.footerText;
  if (contextData.copyrightText !== undefined) dbRow.copyright_text = contextData.copyrightText;
  if (contextData.notificationEmail !== undefined) dbRow.notification_email = contextData.notificationEmail;
  if (contextData.replyToEmail !== undefined) dbRow.reply_to_email = contextData.replyToEmail;
  if (contextData.profilePhoto !== undefined) dbRow.profile_photo = contextData.profilePhoto;
  if (contextData.profileName !== undefined) dbRow.profile_name = contextData.profileName;
  if (contextData.profileEmail !== undefined) dbRow.profile_email = contextData.profileEmail;
  if (contextData.profilePhone !== undefined) dbRow.profile_phone = contextData.profilePhone;
  if (contextData.profileDesignation !== undefined) dbRow.profile_designation = contextData.profileDesignation;
  return dbRow;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPlatformSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      logger.log('[SettingsContext] Initiating settings fetch from Supabase...');
      const dbRow = await settingsService.getSettings();
      if (dbRow) {
        const mapped = mapDbToContext(dbRow);
        logger.log('[SettingsContext] Settings fetched successfully. Mapped payload:', mapped);
        setSettings((prev) => ({ ...prev, ...mapped }));
      } else {
        logger.log('[SettingsContext] No settings record returned from Supabase.');
      }
    } catch (err) {
      logger.error('[SettingsContext] Failed to load settings from Supabase:', err);
      setError(err.message || 'Failed to load platform settings.');
    } finally {
      setLoading(false);
    }
  };

  // Load settings from Supabase on startup
  useEffect(() => {
    loadPlatformSettings();
  }, []);

  // Re-fetch settings dynamically on authentication state changes (login/logout)
  useEffect(() => {
    logger.log('[SettingsContext] Registering auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logger.log(`[SettingsContext] Auth state changed event: ${event}. User is authenticated: ${!!session?.user}`);
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        logger.log(`[SettingsContext] Triggering settings re-fetch due to auth event: ${event}`);
        loadPlatformSettings();
      }
    });

    return () => {
      logger.log('[SettingsContext] Unsubscribing from auth state listener.');
      subscription.unsubscribe();
    };
  }, []);

  // Update Favicon and Document Title reactively when settings change
  useEffect(() => {
    if (settings.websiteFavicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.websiteFavicon;
    }
    if (settings.companyName) {
      document.title = settings.companyName;
    }
  }, [settings.websiteFavicon, settings.companyName]);

  // In-memory state updater for form edits (no immediate database write)
  const updateSettings = (patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  // Persists changes to the Supabase settings table
  const saveSettings = async (data) => {
    try {
      setError(null);
      const merged = { ...settings, ...data };
      const dbPayload = mapContextToDb(merged);
      const updatedRow = await settingsService.updateSettings(dbPayload);
      const mapped = mapDbToContext(updatedRow);
      setSettings((prev) => ({ ...prev, ...mapped }));
      return { success: true };
    } catch (err) {
      logger.error('Failed to save settings to Supabase:', err);
      throw err;
    }
  };

  // Resets settings to default values in both context and database
  const resetDefaults = async () => {
    try {
      setError(null);
      const dbPayload = mapContextToDb(DEFAULT_SETTINGS);
      const updatedRow = await settingsService.updateSettings(dbPayload);
      const mapped = mapDbToContext(updatedRow);
      setSettings({ ...DEFAULT_SETTINGS, ...mapped });
      return { success: true };
    } catch (err) {
      logger.error('Failed to reset settings in Supabase:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary, #0a0a0c)', color: 'var(--text-muted, #94a3b8)', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--accent-violet, #8b5cf6)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <span style={{ fontSize: '11px', letterSpacing: '2px', fontWeight: '600', color: 'var(--text-dim, #64748b)' }}>LOADING FLYEN PLATFORM...</span>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        loading, 
        error, 
        updateSettings, 
        saveSettings, 
        resetDefaults 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
