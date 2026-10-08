import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../../modules/settings/hooks/useSettings';
import { masterDataService } from '../../services/masterDataService';
import { ROUTES } from '../../constants/routes';

export const Footer = () => {
  const { settings } = useSettings();
  const companyName = settings.companyName || 'Flyen';

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchHomeCategories = async () => {
      try {
        const allCats = await masterDataService.getCategories();
        if (isMounted && Array.isArray(allCats)) {
          const homeCats = allCats.filter(c => c.is_active && c.show_in_home);
          setCategories(homeCats);
        }
      } catch (err) {
        console.error('[Footer] Error loading home categories:', err);
      }
    };

    fetchHomeCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const shopLinks = categories.length > 0
    ? categories.map(cat => {
        const isProject = cat.type === 'project_category';
        const route = isProject
          ? `${ROUTES.PROJECTS}?category=${encodeURIComponent(cat.value || cat.key)}`
          : `${ROUTES.PRINTING}?category=${encodeURIComponent(cat.key || cat.value)}`;
        return {
          id: cat.id || cat.key,
          title: cat.value,
          route
        };
      })
    : [
        { id: 'gifts', title: 'Gifts & Occasions', route: `${ROUTES.PRINTING}?category=gifts` },
        { id: 'decor', title: 'Home & Décor', route: `${ROUTES.PRINTING}?category=decor` },
        { id: 'household', title: 'Household Essentials', route: `${ROUTES.PRINTING}?category=household` },
        { id: 'parts', title: '3D Printer Parts', route: `${ROUTES.PRINTING}?category=parts` },
        { id: 'kits', title: 'Student Kits', route: ROUTES.PROJECTS }
      ];

  return (
    <footer className="flyen-main-footer">
      <div className="flyen-footer-container">
        
        {/* Main 4-Column Grid */}
        <div className="flyen-footer-grid">
          
          {/* Column 1: Brand & Bio & Socials */}
          <div className="flyen-footer-brand-col">
            <div className="flyen-footer-logo-row">
              {settings.websiteLogo ? (
                <img 
                  src={settings.websiteLogo} 
                  alt={companyName} 
                  style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
                />
              ) : (
                <div className="flyen-footer-logo-badge">
                  <span>{companyName.charAt(0).toUpperCase() || 'F'}</span>
                </div>
              )}
              <span className="flyen-footer-brand-title">
                {companyName.toUpperCase()} / LAB
              </span>
            </div>

            <p className="flyen-footer-bio">
              {settings.websiteTagline ||
                `${companyName} creates and sells 3D-printed gifts, home products, parts and electronics project kits, with custom printing and bulk-order services.`}
            </p>

            {/* Circular Social Outline Buttons */}
            <div className="flyen-footer-socials">
              <a 
                href={settings.instagramUrl || "https://instagram.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flyen-footer-social-btn"
                title="Instagram"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              <a 
                href={settings.youtubeUrl || "https://youtube.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flyen-footer-social-btn"
                title="YouTube"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>

              <a 
                href={settings.githubUrl || settings.linkedinUrl || "https://github.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flyen-footer-social-btn"
                title="GitHub / Repository"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>

              <a 
                href={settings.whatsappUrl || (settings.contactPhone ? `https://wa.me/${settings.contactPhone.replace(/[^0-9]/g, '')}` : "https://whatsapp.com")} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flyen-footer-social-btn"
                title="WhatsApp / Chat"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: SHOP */}
          <div className="flyen-footer-col">
            <span className="flyen-footer-col-title">SHOP</span>
            {shopLinks.map(link => (
              <Link key={link.id} to={link.route} className="flyen-footer-link">
                {link.title}
              </Link>
            ))}
          </div>

          {/* Column 3: SERVICES */}
          <div className="flyen-footer-col">
            <span className="flyen-footer-col-title">SERVICES</span>
            <Link to={ROUTES.PROJECTS} className="flyen-footer-link">Project</Link>
            <Link to={ROUTES.PRINTING} className="flyen-footer-link">3D Printing</Link>
            <Link to={ROUTES.PRINTING} className="flyen-footer-link">Custom 3D Printing</Link>
            <Link to={ROUTES.CONTACT} className="flyen-footer-link">Bulk Orders</Link>
            <Link to={ROUTES.CONTACT} className="flyen-footer-link">Contact</Link>
          </div>

          {/* Column 4: SUPPORT */}
          <div className="flyen-footer-col">
            <span className="flyen-footer-col-title">SUPPORT</span>
            <Link to={ROUTES.TERMS_CONDITIONS} className="flyen-footer-link">Shipping and delivery</Link>
            <Link to={ROUTES.TERMS_CONDITIONS} className="flyen-footer-link">Returns and cancellations</Link>
            <Link to={ROUTES.TERMS_CONDITIONS} className="flyen-footer-link">Personalised-order policy</Link>
            <Link to={ROUTES.CONTACT} className="flyen-footer-link">Custom printing and bulk enquiries</Link>
            <Link to={ROUTES.PRIVACY_POLICY} className="flyen-footer-link">Privacy policy and terms</Link>
          </div>

        </div>

        {/* Divider Line */}
        <div className="flyen-footer-divider-line" />

        {/* Bottom Bar: Copyright (Center Aligned) */}
        <div className="flyen-footer-bottom-row">
          <div>
            {settings.copyrightText || `\u00A9 ${new Date().getFullYear()} ${companyName} Supply Co. Built with precision.`}
          </div>
        </div>

      </div>
    </footer>
  );
};
