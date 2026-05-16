import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'frontend',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'frontend/index.html'),
        optimizer: resolve(__dirname, 'frontend/optimizer.html'),
        about: resolve(__dirname, 'frontend/about.html'),
      },
    },
  },
});
