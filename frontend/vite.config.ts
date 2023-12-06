import manifest from './manifest.json';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

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
      environment: 'happy-dom',
      setupFiles: './test.setup.ts',
      threads: false, // Workaround for this bug: https://github.com/vitest-dev/vitest/issues/740
      // Another workaround package.json for react-markdown is broken.
      // https://github.com/vitest-dev/vitest/discussions/3654
      alias: [
        {
          find: /^@uiw\/react-markdown-preview$/,
          replacement: '@uiw/react-markdown-preview/esm/index.js',
        },
        {
          find: /^@uiw\/react-md-editor$/,
          replacement: '@uiw/react-md-editor/esm/index.js',
        },
      ],
    },
  };
});
