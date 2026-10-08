// Export Route dynamic import descriptors for link prefetching & code splitting
export const lazyRoutes = {
  Home: () => import('../modules/public/pages/Home').then(module => ({ default: module.Home })),
  ProjectListing: () => import('../modules/projects/pages/ProjectListing').then(module => ({ default: module.ProjectListing })),
  ProjectDetails: () => import('../modules/projects/pages/ProjectDetails').then(module => ({ default: module.ProjectDetails })),
  PrintingCatalog: () => import('../modules/public/pages/PrintingCatalog').then(module => ({ default: module.PrintingCatalog })),
  LearningHub: () => import('../modules/public/pages/LearningHub').then(module => ({ default: module.LearningHub })),
  Contact: () => import('../modules/public/pages/Contact').then(module => ({ default: module.Contact })),
  Feedback: () => import('../modules/public/pages/Feedback').then(module => ({ default: module.Feedback })),
  MyProjects: () => import('../modules/my-projects/pages/MyProjects').then(module => ({ default: module.MyProjects })),
  ShippingDelivery: () => import('../modules/legal/pages/ShippingDelivery').then(module => ({ default: module.ShippingDelivery })),
  ReturnsCancellations: () => import('../modules/legal/pages/ReturnsCancellations').then(module => ({ default: module.ReturnsCancellations })),
  PersonalisedOrderPolicy: () => import('../modules/legal/pages/PersonalisedOrderPolicy').then(module => ({ default: module.PersonalisedOrderPolicy })),
  CustomBulkEnquiries: () => import('../modules/legal/pages/CustomBulkEnquiries').then(module => ({ default: module.CustomBulkEnquiries })),
  PrivacyPolicy: () => import('../modules/legal/pages/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })),
  TermsConditions: () => import('../modules/legal/pages/TermsConditions').then(module => ({ default: module.TermsConditions }))
};
