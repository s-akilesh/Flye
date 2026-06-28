import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import { ContactChips } from '../sections/ContactChips';

export const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="home-footer">
      {settings.footerText && (
        <div className="home-footer-tagline" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', marginBottom: 'var(--space-3)', padding: '0 var(--space-4)', lineHeight: '1.5' }}>
          {settings.footerText}
        </div>
      )}

      <div className="home-footer-links">
        <ContactChips />
      </div>

      {(settings.instagramUrl || settings.youtubeUrl || settings.linkedinUrl || settings.facebookUrl) && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', margin: 'var(--space-4) 0' }}>
          {settings.instagramUrl && (
            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="contact-chip" style={{ padding: '8px' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          )}
          {settings.youtubeUrl && (
            <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="contact-chip" style={{ padding: '8px' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
          )}
          {settings.linkedinUrl && (
            <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-chip" style={{ padding: '8px' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          )}
          {settings.facebookUrl && (
            <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="contact-chip" style={{ padding: '8px' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          )}
        </div>
      )}

      <div className="home-footer-copyright">
        {settings.copyrightText ? settings.copyrightText : `\u00A9 ${new Date().getFullYear()} ${settings.companyName || 'Flyen'}. All rights reserved.`}
      </div>
    </footer>
  );
};
