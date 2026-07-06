import { useState } from 'react';
import printingProductsData from '../../../shared/config/printingProducts.json';

/**
 * Hook to retrieve and manage 3D printing products.
 */
export const usePrintingProducts = () => {
  const [printingProducts] = useState(() =>
    printingProductsData.filter((item) => item.status === 'active' || item.status === 'coming-soon')
  );

  const getProductById = (id) => {
    return printingProducts.find((item) => item.id === id);
  };

  return {
    printingProducts,
    getProductById
  };
};
