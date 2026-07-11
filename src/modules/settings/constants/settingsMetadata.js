export const SETTINGS_METADATA = [
  {
    id: 'website',
    title: 'Website',
    icon: 'language',
    rows: [
      {
        id: 'branding',
        title: 'Website Branding',
        description: 'Manage website name, logo, favicon and branding.',
        keywords: ['logo', 'favicon', 'name', 'tagline', 'branding', 'identity', 'title'],
        status: (settings) => (settings.companyName && settings.websiteLogo && settings.websiteFavicon) ? 'configured' : 'attention',
        component: 'WebsiteBranding',
        adminOnly: true
      },
      {
        id: 'contact-info',
        title: 'Contact Information',
        description: 'Manage phone number, email and address.',
        keywords: ['phone', 'email', 'address', 'whatsapp', 'location', 'mobile'],
        status: (settings) => (settings.contactPhone && settings.contactEmail && settings.companyAddress) ? 'configured' : 'attention',
        component: 'ContactInfo',
        adminOnly: true
      },
      {
        id: 'footer',
        title: 'Footer Settings',
        description: 'Configure footer text and copyright.',
        keywords: ['footer', 'copyright', 'tagline', 'text'],
        status: (settings) => (settings.footerText && settings.copyrightText) ? 'configured' : 'attention',
        component: 'FooterSettings',
        adminOnly: true
      },
      {
        id: 'legal-pages',
        title: 'Legal Pages',
        description: 'Configure Privacy Policy and Terms & Conditions.',
        keywords: ['privacy', 'terms', 'conditions', 'legal', 'policy', 'disclaimer'],
        status: () => 'configured',
        component: 'LegalPagesSettings',
        adminOnly: true
      }
    ]
  },
  {
    id: 'security',
    title: 'Security',
    icon: 'lock',
    rows: [
      {
        id: 'password',
        title: 'Portal Password',
        description: 'Change administrative password and manage session tokens.',
        keywords: ['password', 'credential', 'security', 'change', 'login'],
        status: (settings) => settings.adminPassword ? 'configured' : 'attention',
        component: 'PasswordSettings',
        adminOnly: true
      },
      {
        id: 'access-stats',
        title: 'Access Statistics',
        description: 'Review administrative login logs and active session details.',
        keywords: ['session', 'device', 'logs', 'audit', 'login', 'history', 'ip'],
        status: () => 'configured',
        component: 'AccessStats',
        adminOnly: true
      }
    ]
  },
  {
    id: 'communication',
    title: 'Communication',
    icon: 'mail',
    rows: [
      {
        id: 'email-routing',
        title: 'Email Routing',
        description: 'Configure automated notification channels and default addresses.',
        keywords: ['email', 'routing', 'alert', 'notifications', 'inquiry', 'routing'],
        status: (settings) => (settings.contactEmail && settings.notificationEmail) ? 'configured' : 'attention',
        component: 'EmailRouting',
        adminOnly: true
      }
    ]
  },
  {
    id: 'social-media',
    title: 'Social Media',
    icon: 'phone_iphone',
    rows: [
      {
        id: 'social-networks',
        title: 'Social Networks',
        description: 'Manage external URLs for Facebook, Instagram, LinkedIn, and YouTube.',
        keywords: ['social', 'facebook', 'instagram', 'linkedin', 'youtube', 'twitter', 'github', 'links'],
        status: (settings) => (settings.facebookUrl || settings.instagramUrl || settings.linkedinUrl || settings.youtubeUrl || settings.twitterUrl || settings.githubUrl || settings.websiteUrl) ? 'configured' : 'attention',
        component: 'SocialNetworks',
        adminOnly: true
      }
    ]
  },
  {
    id: 'administration',
    title: 'Administration',
    icon: 'people',
    rows: [
      {
        id: 'system-prefs',
        title: 'System Preferences',
        description: 'Configure dashboard timezones, languages, and accessibility options.',
        keywords: ['timezone', 'language', 'locale', 'preferences', 'dark', 'light'],
        status: () => 'configured',
        component: 'SystemPrefs',
        adminOnly: true
      }
    ]
  }
];
