import { useContext } from 'react';
import { SettingsContext, DEFAULT_SETTINGS } from '../context/SettingsContext';

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    // If used outside of provider, return default values safely
    return {
      settings: DEFAULT_SETTINGS,
      updateSettings: () => {},
      saveSettings: () => {},
      resetDefaults: () => {},
    };
  }
  return ctx;
};
