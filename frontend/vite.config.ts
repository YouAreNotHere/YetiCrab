import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
