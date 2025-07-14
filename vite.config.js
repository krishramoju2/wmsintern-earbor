import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to your backend during development
      '/employee': 'http://localhost:8080',
      '/files': 'http://localhost:8080',
      '/stats': 'http://localhost:8080',
    },
  },
  build: {
    outDir: 'dist'
  }
});
