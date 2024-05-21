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
        //main: resolve(__dirname, 'src/server/views/index.html'),
        credit: resolve(__dirname, 'views/credit.html'),
        //credit: resolve(__dirname, 'src/server/views/credit.html'),
      },
    },
  }
})
