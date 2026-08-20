import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const coi = process.env.COI === '1';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
    ...(coi
      ? {
          headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
          },
        }
      : {}),
  },
});
