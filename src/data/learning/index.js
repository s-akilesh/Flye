import { fundamentalsData } from './fundamentals';
import { capacitorFamily } from './components/capacitor';
import { resistorFamily } from './components/resistor';
import { ledFamily } from './components/led';

const families = [
  capacitorFamily,
  resistorFamily,
  ledFamily
];

// Flat list of all component variants
const componentsData = families.reduce((acc, family) => {
  return acc.concat(family.variants);
}, []);

export const LearningRepository = {
  // Fundamentals
  getFundamentals: () => {
    return fundamentalsData;
  },

  // Components (all individual variants)
  getComponents: () => {
    return componentsData;
  },

  getComponentBySlug: (slug) => {
    return componentsData.find(c => c.slug === slug) || null;
  },

  // Get the parent family container for a given variant slug
  getFamilyBySlug: (slug) => {
    return families.find(f => f.variants.some(v => v.slug === slug)) || null;
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
