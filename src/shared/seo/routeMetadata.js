import { ROUTES } from '../constants/routes.js';
import { PageType } from './constants/pageTypes.js';

export const routeMetadata = {
  [ROUTES.HOME]: {
    path: ROUTES.HOME,
    pageType: PageType.HOME,
    inSitemap: true,
    priority: '1.0',
    changeFreq: 'daily',
    breadcrumbLabel: 'Home'
  },
  [ROUTES.PROJECTS]: {
    path: ROUTES.PROJECTS,
    pageType: PageType.PROJECT_LISTING,
    inSitemap: true,
    priority: '0.9',
    changeFreq: 'weekly',
    breadcrumbLabel: 'Projects'
  },
  [ROUTES.PROJECT_DETAILS]: {
    path: ROUTES.PROJECT_DETAILS,
    pageType: PageType.PROJECT,
    inSitemap: true,
    priority: '0.8',
    changeFreq: 'weekly',
    breadcrumbLabel: 'Project Details'
  },
  [ROUTES.CONTACT]: {
    path: ROUTES.CONTACT,
    pageType: PageType.CONTACT,
    inSitemap: true,
    priority: '0.7',
    changeFreq: 'monthly',
    breadcrumbLabel: 'Contact'
  },
  [ROUTES.PRINTING]: {
    path: ROUTES.PRINTING,
    pageType: PageType.PRINTING,
    inSitemap: true,
    priority: '0.7',
    changeFreq: 'monthly',
    breadcrumbLabel: '3D Printing'
  },
  '/about': {
    path: '/about',
    pageType: PageType.ABOUT,
    inSitemap: true,
    priority: '0.5',
    changeFreq: 'monthly',
    breadcrumbLabel: 'About Us'
  },
  '/departments': {
    path: '/departments',
    pageType: PageType.DEPARTMENTS,
    inSitemap: true,
    priority: '0.5',
    changeFreq: 'monthly',
    breadcrumbLabel: 'Departments'
  }
};
