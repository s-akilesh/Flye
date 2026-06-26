import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

const LOCAL_STORAGE_KEY = 'flyen_settings';

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

const loadSettings = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      // Merge stored with defaults to ensure new fields are present
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load settings from localStorage', e);
  }
  return { ...DEFAULT_SETTINGS };
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(loadSettings);

  // Persist to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  const updateSettings = (patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const saveSettings = (data) => {
    const merged = { ...DEFAULT_SETTINGS, ...data };
    setSettings(merged);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  };

  const resetDefaults = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (e) {
      console.error('Failed to reset settings', e);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, saveSettings, resetDefaults }}>
      {children}
    </SettingsContext.Provider>
  );
};
