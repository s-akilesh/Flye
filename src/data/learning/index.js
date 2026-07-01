import { fundamentalsData } from './fundamentals';
import { level1Lessons } from './level1ElectricalBasics';
import { capacitorFamily } from './components/capacitor';
import { resistorFamily } from './components/resistor';
import { ledFamily } from './components/led';
import { ROADMAP_METADATA } from '../../constants/roadmapMetadata';

const families = [
  capacitorFamily,
  resistorFamily,
  ledFamily
];

const componentsData = families.reduce((acc, family) => {
  return acc.concat(family.variants);
}, []);

export const LearningRepository = {
  // Fundamentals
  getFundamentals: () => {
    return level1Lessons;
  },

  getFundamentalBySlug: (slug) => {
    return level1Lessons.find(f => f.slug === slug) || null;
  },

  // Components (all individual variants)
  getComponents: () => {
    return componentsData;
  },

  // Parent families
  getFamilies: () => {
    return families;
  },

  getFamilyById: (id) => {
    return families.find(f => f.id === id) || null;
  },

  getComponentBySlug: (slug) => {
    // If slug is a family ID, return its first variant
    const family = families.find(f => f.id === slug);
    if (family && family.variants && family.variants.length > 0) {
      return family.variants[0];
    }
    return componentsData.find(c => c.slug === slug) || null;
  },

  // Get the parent family container for a given variant slug or family ID
  getFamilyBySlug: (slug) => {
    return families.find(f => f.id === slug || f.variants.some(v => v.slug === slug)) || null;
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
  },

  // Roadmap queries
  getRoadmap: () => {
    return ROADMAP_METADATA;
  },

  getRoadmapComponent: (slug) => {
    for (const level of ROADMAP_METADATA) {
      for (const cat of level.categories) {
        const comp = cat.components.find(c => c.slug === slug || c.id === slug);
        if (comp) {
          return {
            ...comp,
            levelTitle: level.title,
            categoryName: cat.name
          };
        }
      }
    }
    return null;
  }
};
