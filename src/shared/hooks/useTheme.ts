import { useContext } from 'react';
import { ThemeContext, type ThemeContextType } from '@core/providers/ThemeContext';

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
  const unifiedTheme = useUnifiedTheme();

  return {
    mode: unifiedTheme.mode,
    isDark: unifiedTheme.isDarkMode,
    isDarkMode: unifiedTheme.isDarkMode, // 保持向后兼容
    themeConfig: unifiedTheme.currentThemeConfig,
    currentThemeConfig: unifiedTheme.currentThemeConfig, // 保持向后兼容
    toggleDarkMode: unifiedTheme.toggleDark,
    changeColorScheme: unifiedTheme.changeColorScheme,
    isLoading: unifiedTheme.isLoading,
    colorScheme: unifiedTheme.colorScheme,
  };
};
