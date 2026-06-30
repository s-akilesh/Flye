// Flyen Platform Unified Navigation Configuration

export const BOTTOM_NAVIGATION = [
  {
    id: 'home',
    label: 'Home',
    path: '/'
  },
  {
    id: 'workspace',
    label: 'Workspace',
    path: '/learning/workspace'
  },
  {
    id: 'projects',
    label: 'Projects',
    path: '/projects'
  },
  {
    id: 'enquiries',
    label: 'Enquiries',
    adminPath: '/admin/enquiries',
    guestPath: '/contact'
  }
];

export const LEARNING_NAVIGATION = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard'
  },
  {
    id: 'workspace',
    label: 'Engineering Workspace',
    path: '/learning/workspace'
  },
  {
    id: 'electricity',
    label: 'Electrical Basics',
    path: '/learning/fundamentals'
  },
  {
    id: 'components',
    label: 'Components Library',
    path: '/learning/components'
  },
  {
    id: 'experiments',
    label: 'Experiments',
    path: '#experiments',
    disabled: true
  },
  {
    id: 'progress',
    label: 'Learning Progress',
    path: '#progress',
    disabled: true
  },
  {
    id: 'bookmarks',
    label: 'Bookmarks',
    path: '#bookmarks',
    disabled: true
  }
];

export const PROJECTS_NAVIGATION = [
  {
    id: 'kits',
    label: 'Project Kits',
    path: '/projects'
  },
  {
    id: 'printing',
    label: '3D Printing Catalog',
    path: '/printing'
  },
  {
    id: 'saved',
    label: 'Saved Projects',
    path: '#saved-projects',
    disabled: true
  }
];

export const QUICK_ACTIONS = [
  {
    id: 'ai',
    label: 'Ask Flyen AI',
    action: 'ai-mentor'
  },
  {
    id: 'contact',
    label: 'Contact Support',
    path: '/contact'
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    requiresAdmin: true
  }
];
