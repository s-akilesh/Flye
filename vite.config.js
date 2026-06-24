import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'stats.json',
      json: true
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') || 
              id.includes('scheduler') || 
              id.includes('react-router') || 
              id.includes('@remix-run/router')
            ) {
              return 'vendor-react';
            }
            if (
              id.includes('@supabase') || 
              id.includes('postgrest-js') || 
              id.includes('gotrue-js') || 
              id.includes('storage-js') || 
              id.includes('realtime-js') || 
              id.includes('functions-js')
            ) {
              return 'vendor-supabase';
            }
            if (
              id.includes('xlsx') || 
              id.includes('adler-32') || 
              id.includes('cfb') || 
              id.includes('codepage') || 
              id.includes('crc-32') || 
              id.includes('frac') || 
              id.includes('wmf') || 
              id.includes('word') || 
              id.includes('ssf')
            ) {
              return 'vendor-xlsx';
            }
            return 'vendor-others';
          }
          if (id.includes('src/pages/')) {
            if (
              id.includes('AdminDashboard') || 
              id.includes('ManageProjects') || 
              id.includes('AddProject') || 
              id.includes('EditProject') || 
              id.includes('ManageEnquiries') || 
              id.includes('AdminSettings') || 
              id.includes('AdminLogin')
            ) {
              return 'admin-pages';
            }
            return 'public-pages';
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
