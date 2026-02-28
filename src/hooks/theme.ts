import { useContext } from 'react';

import { ThemeContext, type ThemeContextType } from '../contexts/ThemeContext';

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
 */
export const useTheme = () => {
  const { mode, isDarkMode, currentThemeConfig, toggleDark, changeColorScheme, isLoading } =
    useThemeContext();

  return {
    mode,
    isDark: isDarkMode,
    themeConfig: currentThemeConfig,
    toggleDarkMode: toggleDark,
    changeColorScheme,
    isLoading,
  };
};
