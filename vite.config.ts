import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
// @ts-expect-error 必须加点说明，否则ts报错
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
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
  ],
});
