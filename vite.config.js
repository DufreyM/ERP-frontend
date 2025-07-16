/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    css: true,
    transformMode: {
      web: [/\.jsx$/],
    },
    include: ['src/**/*.test.{js,ts,jsx,tsx}'],
    watch:false,
  },
  server: {
    port: 5173,
    host:true
  },
  preview: {
    port: 3000,
    host:true
  }
});
