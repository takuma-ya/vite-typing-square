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
      isProduction: "True"
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'views/index.html'),
        main_en: resolve(__dirname, 'views/index_en.html'),
        credit: resolve(__dirname, 'views/credit.html'),
        credit_en: resolve(__dirname, 'views/credit_en.html'),
      },
    },
  }
})
