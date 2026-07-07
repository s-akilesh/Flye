import { PageType } from './constants/pageTypes';
import { homeSEO } from './templates/homeSEO';
import { projectListingSEO } from './templates/projectListingSEO';
import { projectSEO } from './templates/projectSEO';
import { contactSEO } from './templates/contactSEO';
import { printingSEO } from './templates/printingSEO';

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
    default:
      return {};
  }
};
