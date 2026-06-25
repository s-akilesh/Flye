import { fundamentalsData } from './fundamentals';
import { capacitorData } from './components/capacitor';
import { resistorData } from './components/resistor';
import { ledData } from './components/led';

const componentsData = [
  capacitorData,
  resistorData,
  ledData
];

export const LearningRepository = {
  // Fundamentals
  getFundamentals: () => {
    return fundamentalsData;
  },

  // Components
  getComponents: () => {
    return componentsData;
  },

  getComponentBySlug: (slug) => {
    return componentsData.find(c => c.slug === slug) || null;
  },

  getCategories: () => {
    const categories = new Set();
    componentsData.forEach(c => {
      if (c.category) categories.add(c.category);
    });
    return Array.from(categories);
  },

  getComponentsByCategory: (category) => {
    return componentsData.filter(c => c.category === category);
  }
};
