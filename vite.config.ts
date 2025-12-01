import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          external: [], // 不移除任何依赖，全部打包
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'framer-motion': ['framer-motion'],
              'lucide': ['lucide-react']
            },
            entryFileNames: 'assets/[name].[hash].js',
            chunkFileNames: 'assets/[name].[hash].js',
            assetFileNames: 'assets/[name].[hash][extname]'
          }
        },
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        },
        target: 'es2015',
        sourcemap: false,
        cssCodeSplit: false, // 强制 CSS 内联到 HTML 中
        assetsInlineLimit: 0 // 不内联任何资源
      },
      base: './'
    };
});
