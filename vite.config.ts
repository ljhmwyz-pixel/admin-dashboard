import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
// @ts-expect-error 必须加点说明，否则ts报错
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://172.21.101.9:8098',
        changeOrigin: true,
      },
    },
  },
  build: {
    // 启用 CSS Tree Shaking
    cssMinify: 'esbuild',
    // 启用 terser 压缩以获得更好的 Tree Shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除 console
        drop_debugger: true, // 移除 debugger
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // 将大型库单独打包
          antd: ['antd'],
          icons: ['@ant-design/icons'],
          'react-vendor': ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          i18n: ['i18next', 'react-i18next'],
          utils: ['axios'],
        },
        // 优化 chunk 命名
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
    chunkSizeWarningLimit: 1500, // 增加警告阈值，因为 antd 确实很大
  },
  define: {
    'process.env': {},
    process: '{}',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@config': path.resolve(__dirname, './src/config'),
      '@core': path.resolve(__dirname, './src/core'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  plugins: [
    react(),
    eslintPlugin({
      cache: false, // 关闭缓存，保证每次编译都检查
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.jsx'],
      exclude: ['node_modules', 'dist'],
      failOnError: true, // 编译出错时终端报错
      emitWarning: true, // 控制是否输出警告
    }),
    // 打包分析插件
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
