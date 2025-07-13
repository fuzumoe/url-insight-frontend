import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [
    react(),
    istanbul({
      cypress: true,
      requireEnv: false,
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: ['node_modules', '**/cypress/**', '**/*.d.ts'],
    }),
  ],
  build: {
    sourcemap: true,
  },
});
