import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierConfig, // 关闭与 prettier 冲突规则
    ],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
    },

    plugins: {
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      /* ================= Prettier 接管格式 ================= */
      'prettier/prettier': 'error',

      /* ================= 基础风格 ================= */
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^React$' },
      ],

      /* ================= import 排序 ================= */
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              // React 系列优先
              '^react$',
              '^react-dom$',
              '^react-router-dom$',
              '^react-redux$',
              // 其他第三方库
              '^@?\\w',
            ],
            // 图片组，保持手写顺序
            ['^@/assets/images/'],

            // 绝对路径别名
            ['^@/'],

            // 相对路径
            ['^\\.'],

            // 样式文件
            ['\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      /* ================= Hooks ================= */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /* ================= JSX 优化 ================= */
      'react/self-closing-comp': 'error',
      // 关闭 JSX 作用域检查（使用新的 JSX 转换）
      'react/react-in-jsx-scope': 'off',
      // 关闭 any 报错
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
