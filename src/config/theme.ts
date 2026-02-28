// 保留向后兼容的导出
export {
  compactTheme,
  darkTheme,
  defaultTheme,
  getThemeConfig,
  SystemThemeDetector,
  ThemePersistence,
} from './themes';

// 向后兼容的类型导出
export type { ColorScheme, ThemeAlgorithm, ThemeConfiguration, ThemeMode } from './themes';

// 保持原有的简单接口以确保向后兼容
export type { ThemeType } from './themes';
export { getCurrentTheme, switchTheme } from './themes';
