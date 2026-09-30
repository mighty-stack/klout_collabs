import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// In development the API runs on :4000. Proxying /api keeps everything same-origin, so login
// cookies work without any CORS or SameSite setup. In production the client talks to
// VITE_API_URL (https://api.yourdomain.com) instead.
const proxy = { '/api': 'http://localhost:4000', '/health': 'http://localhost:4000' };

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, proxy },
  preview: { port: 5173, proxy },
});
