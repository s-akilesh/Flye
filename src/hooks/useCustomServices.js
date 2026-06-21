import { useState } from 'react';
import customServicesData from '../data/customServices.json';

/**
 * Hook to retrieve and manage custom consultation services.
 */
export const useCustomServices = () => {
  const [customServices] = useState(() =>
    customServicesData.filter((item) => item.status === 'active' || item.status === 'coming-soon')
  );

  return {
    customServices
  };
};
