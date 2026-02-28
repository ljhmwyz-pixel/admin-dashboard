import { useContext } from 'react';

import { ThemeContext, type ThemeContextType } from '../contexts/ThemeContext';
import { useUnifiedTheme } from './useUnifiedTheme';

/**
 * 使用主题上下文的 Hook
 */
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

/**
 * 简化的主题 Hook，只暴露常用属性和方法
 * 基于新的统一主题hook实现
 */
export const useTheme = () => {
  return useUnifiedTheme();
};
