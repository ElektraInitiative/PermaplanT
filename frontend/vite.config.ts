import manifest from './manifest.json';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const env = loadEnv(process.env.NODE_ENV, process.cwd());

  if (!env?.VITE_BASE_CLIENT_URL) {
    throw new Error('VITE_BASE_CLIENT_URL not set');
  }

  return {
    base: env.VITE_BASE_CLIENT_URL,
    plugins: [
      react(),
      svgr(),
      VitePWA({
        manifest,
        includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        // switch to "true" to enable sw on development
        devOptions: {
          enabled: false,
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html}', '**/*.{svg,png,jpg,gif}'],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
