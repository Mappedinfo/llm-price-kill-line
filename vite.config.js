import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 项目页需带 base 前缀
export default defineConfig({
  plugins: [react()],
  base: '/llm-price-kill-line/',
});
