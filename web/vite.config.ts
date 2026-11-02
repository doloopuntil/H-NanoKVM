import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    tsconfigPaths: true
  },
  server: {
    port: 3001
  },
  build: {
    chunkSizeWarningLimit: 1024
  }
});
