import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import copy from 'rollup-plugin-copy';

const destName = 'dist';

// https://vite.dev/config/
export default defineConfig(() => {
  const inputOption = {
    index: path.resolve(__dirname, 'index.html'),
    background: 'src/background.ts',
  };

  return {
    plugins: [
      react(),
      tailwindcss(),
      copy({
        targets: [
          { src: 'src/assets', dest: destName },
        ],
        hook: 'writeBundle',
      }),
    ],
    server: {
      port: 5205,
    },
    build: {
      rollupOptions: {
        input: inputOption,
        output: {
          entryFileNames: '[name].js',
          assetFileNames: '[name].[ext]', // CSS
        },
      },
    },
  };
});
