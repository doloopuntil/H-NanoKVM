import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tailwindcss(), react(), viteTsconfigPaths()],
  server: {
    port: 3001
  },
  build: {
    chunkSizeWarningLimit: 1024
  }
});
