import { ROUTES } from '../constants/routes';
import { PageType } from './constants/pageTypes';

export const routeSEOMapping = {
  [ROUTES.HOME]: PageType.HOME,
  [ROUTES.PROJECTS]: PageType.PROJECT_LISTING,
  [ROUTES.PROJECT_DETAILS]: PageType.PROJECT,
  [ROUTES.CONTACT]: PageType.CONTACT,
  [ROUTES.PRINTING]: PageType.PRINTING
};
