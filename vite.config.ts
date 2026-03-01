import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
// @ts-expect-error 必须加点说明，否则ts报错
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  build: {
    // 启用 CSS Tree Shaking
    cssMinify: 'esbuild',
    // 启用 terser 压缩以获得更好的 Tree Shaking
    minify: 'terser',
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
          charts: ['recharts'],
          utils: ['axios'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 增加警告阈值
  },
  define: {
    'process.env': {},
    process: '{}',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 关键
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
