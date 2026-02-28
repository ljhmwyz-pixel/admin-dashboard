import React, { createContext } from 'react';
import type { ThemeConfig } from 'antd';
import type { ReactNode } from 'react';

import type { ColorScheme, ThemeAlgorithm, ThemeMode } from '../config/themes';
import { useAdvancedTheme } from '../hooks/useAdvancedTheme';

// 主题上下文类型
interface ThemeContextType {
  // 当前主题状态
  mode: ThemeMode;
  algorithm: ThemeAlgorithm;
  colorScheme: ColorScheme;
  isDarkMode: boolean;
  isLoading: boolean;
  isManualOverride: boolean;

  // 当前主题配置
  currentThemeConfig: ThemeConfig;

  // 操作方法
  changeThemeMode: (mode: ThemeMode) => void;
  changeThemeAlgorithm: (algorithm: ThemeAlgorithm) => void;
  changeColorScheme: (colorScheme: ColorScheme) => void;
  toggleDark: () => void;
  resetToSystemTheme: () => void;

  // 工具方法
  getThemeClassNames: () => string;
  applyThemeToDOM: () => void;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题 Provider Props
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * 主题 Provider 组件
 * 为整个应用提供统一的主题管理
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeHook = useAdvancedTheme();

  const contextValue: ThemeContextType = {
    // 状态
    mode: themeHook.mode,
    algorithm: themeHook.algorithm,
    colorScheme: themeHook.colorScheme,
    isDarkMode: themeHook.isDarkMode,
    isLoading: themeHook.isLoading,
    isManualOverride: themeHook.isManualOverride,

    // 配置
    currentThemeConfig: themeHook.currentThemeConfig,

    // 方法
    changeThemeMode: themeHook.changeThemeMode,
    changeThemeAlgorithm: themeHook.changeThemeAlgorithm,
    changeColorScheme: themeHook.changeColorScheme,
    toggleDark: themeHook.toggleDark,
    resetToSystemTheme: themeHook.resetToSystemTheme,

    // 工具
    getThemeClassNames: themeHook.getThemeClassNames,
    applyThemeToDOM: themeHook.applyThemeToDOM,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

// 导出 Context 和类型供 Hook 使用
export { ThemeContext };
export type { ThemeContextType };

// 默认导出 Provider
export default ThemeProvider;
