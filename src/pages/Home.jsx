import React from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/sections/Hero';
import { NavigationCards } from '../components/sections/NavigationCards';
import { KPISection } from '../components/sections/KPISection';

export const Home = () => {
  return (
    <motion.main
      className="gateway-container"
      id="main-gateway"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Hero />
      <NavigationCards />
      <KPISection />
    </motion.main>
  );
};
