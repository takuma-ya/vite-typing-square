import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import {ViteEjsPlugin} from "vite-plugin-ejs";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // With Data
    ViteEjsPlugin({
      isProduction: "True",
      user1st: "<%= user1st %>",
      score1st: "<%= score1st %>",
      ratio1st: "<%= ratio1st %>",
      user2nd: "<%= user2nd %>",
      score2nd: "<%= score2nd %>",
      ratio2nd: "<%= ratio2nd %>",
      user3rd: "<%= user3rd %>",
      score3rd: "<%= score3rd %>",
      ratio3rd: "<%= ratio3rd %>",
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'views/index.html'),
        main_en: resolve(__dirname, 'views/index_en.html'),
        credit: resolve(__dirname, 'views/credit.html'),
        credit_en: resolve(__dirname, 'views/credit_en.html'),
        about: resolve(__dirname, 'views/about.html'),
        about_en: resolve(__dirname, 'views/about_en.html'),
      },
    },
  }
})
