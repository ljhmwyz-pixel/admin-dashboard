import { useAdvancedTheme, useSimpleTheme } from './useAdvancedTheme';

/**
 * 主题切换Hook - 简化版本
 * @deprecated 请使用 useAdvancedTheme 或 useSimpleTheme
 */
export const useTheme = () => {
  return useSimpleTheme();
};

// 导出高级版本供需要更多功能的组件使用
export { useAdvancedTheme, useSimpleTheme };
