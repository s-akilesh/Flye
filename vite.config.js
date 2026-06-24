import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('@supabase') || id.includes('supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('xlsx') || id.includes('adler-32') || id.includes('cfb') || id.includes('codepage') || id.includes('crc-32') || id.includes('frac') || id.includes('ssf') || id.includes('wmf') || id.includes('word')) {
              return 'vendor-xlsx';
            }
            if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
              return 'vendor-motion';
            }
            return 'vendor-other';
          }
          if (id.includes('src/pages/')) {
            const adminPages = [
              'AdminDashboard',
              'ManageProjects',
              'AddProject',
              'EditProject',
              'ManageEnquiries',
              'AdminSettings',
              'AdminLogin'
            ];
            if (adminPages.some(page => id.includes(page))) {
              return 'admin-pages';
            }
            return 'public-pages';
          }
        }
      }
    }
  }
});
