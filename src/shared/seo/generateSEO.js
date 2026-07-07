import { PageType } from './constants/pageTypes.js';
import { homeSEO } from './templates/homeSEO.js';
import { projectListingSEO } from './templates/projectListingSEO.js';
import { projectSEO } from './templates/projectSEO.js';
import { contactSEO } from './templates/contactSEO.js';
import { printingSEO } from './templates/printingSEO.js';
import { aboutSEO } from './templates/aboutSEO.js';
import { departmentsSEO } from './templates/departmentsSEO.js';

export const generateSEO = (pageType, data) => {
  switch (pageType) {
    case PageType.HOME:
      return homeSEO(data);
    case PageType.PROJECT_LISTING:
      return projectListingSEO(data);
    case PageType.PROJECT:
      return projectSEO(data);
    case PageType.CONTACT:
      return contactSEO(data);
    case PageType.PRINTING:
      return printingSEO(data);
    case PageType.ABOUT:
      return aboutSEO(data);
    case PageType.DEPARTMENTS:
      return departmentsSEO(data);
    default:
      return {};
  }
};
