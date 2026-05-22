import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/ai-/',
  build: {
    outDir: 'build'
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'AI小账房',
        short_name: 'AI小账房',
        description: '记录学习 AI 赚钱过程中的投入、支出、收入和利润。',
        start_url: '/ai-/',
        scope: '/ai-/',
        display: 'standalone',
        background_color: '#f8f8f7',
        theme_color: '#f8f8f7',
        lang: 'zh-CN',
        icons: [
          {
            src: '/ai-/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/ai-/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/ai-/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/ai-/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}']
      },
      devOptions: {
        enabled: true
      }
    })
  ]
});
