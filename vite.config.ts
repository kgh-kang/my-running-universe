import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/nike-api': {
        target: 'https://api.nike.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nike-api/, ''),
      },
    },
  },
});
