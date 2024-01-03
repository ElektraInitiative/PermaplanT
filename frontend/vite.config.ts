/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import manifest from './manifest.json';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      react(),
      svgr(),
      //https://vite-pwa-org.netlify.app/guide/#configuring-vite-plugin-pwa
      VitePWA({
        manifest,
        includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        // switch to "true" to enable the service worker on development
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
        '@public': path.resolve(__dirname, './public'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/vitest-setup.ts'],
      // To understand this config, check https://github.com/vitest-dev/vitest/issues/740
      // Because of this issue, we need to use a forked pool
      pool: 'forks',
      environmentOptions: {
        jsdom: {
          resources: 'usable',
        },
      },
      deps: {
        optimizer: {
          web: {
            exclude: ['canvas'],
            include: ['vitest-canvas-mock'],
          },
        },
      },
      onConsoleLog: (logMessage, type) => {
        if (type === 'stdout') {
          for (const ignoredMessage of ignoredLogs) {
            if (logMessage.includes(ignoredMessage)) return false;
          }
        }
        if (type === 'stderr') {
          for (const ignoredError of ignoredErrors) {
            if (logMessage.includes(ignoredError)) return false;
          }
        }
      },
    },
  };
});

const ignoredLogs = ['i18next'];
const ignoredErrors = ['AxiosError: Network Error'];
