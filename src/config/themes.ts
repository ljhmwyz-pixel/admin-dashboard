import type { ThemeConfig } from 'antd';

// 颜色主题配置
export const colorSchemes = {
  turquoise: {
    primary: '#33C2C8',
    primaryHover: '#33C2C8',
    primaryActive: '#33C2C8',
  },
  blue: {
    primary: '#1677ff',
    primaryHover: '#40a9ff',
    primaryActive: '#0958d9',
  },
  green: {
    primary: '#52c41a',
    primaryHover: '#73d13d',
    primaryActive: '#389e0d',
  },
  purple: {
    primary: '#722ed1',
    primaryHover: '#9254de',
    primaryActive: '#531dab',
  },
  orange: {
    primary: '#fa8c16',
    primaryHover: '#ffa940',
    primaryActive: '#d46b08',
  },
  red: {
    primary: '#f5222d',
    primaryHover: '#ff4d4f',
    primaryActive: '#cf1322',
  },
} as const;

// 基础主题配置
const baseTheme: ThemeConfig = {
  token: {
    colorPrimary: colorSchemes.turquoise.primary,
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 6,
      defaultColor: '#191B1F66',
    },
    Input: {
      borderRadius: 6,
    },
    Menu: {
      borderRadius: 6,
    },
    Card: {
      borderRadius: 8,
    },
  },
};

// 默认主题
export const defaultTheme: ThemeConfig = {
  ...baseTheme,
  token: {
    ...baseTheme.token,
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorText: '#191B1F',
    colorTextSecondary: '#191B1F66',
    colorBorder: '#191B1F0F',
    colorBorderSecondary: '#f0f0f0',
    colorError: '#F45858',
  },
};

// 导入 Ant Design 主题算法
import { theme } from 'antd';

// 暗色主题
export const darkTheme: ThemeConfig = {
  ...baseTheme,
  algorithm: [theme.darkAlgorithm], // Ant Design 的暗色算法
  token: {
    ...baseTheme.token,
    colorBgBase: '#141414',
    colorBgContainer: '#191B1F',
    colorBgElevated: '#262626',
    colorText: 'rgba(255, 255, 255, 0.85)',
    colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
    colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
    colorBorder: '#424242',
    colorBorderSecondary: '#303030',
    colorFillQuaternary: 'rgba(255, 255, 255, 0.04)',
  },
};

// 紧凑主题
export const compactTheme: ThemeConfig = {
  ...defaultTheme,
  algorithm: [theme.compactAlgorithm], // Ant Design 的紧凑算法
  token: {
    ...defaultTheme.token,
    sizeStep: 2,
    sizeUnit: 2,
  },
};

// 获取主题配置
export const getThemeConfig = (
  algorithm: 'default' | 'dark' | 'compact',
  colorScheme: keyof typeof colorSchemes = 'turquoise',
): ThemeConfig => {
  let baseThemeConfig: ThemeConfig;

  switch (algorithm) {
    case 'dark':
      baseThemeConfig = darkTheme;
      break;
    case 'compact':
      baseThemeConfig = compactTheme;
      break;
    default:
      baseThemeConfig = defaultTheme;
  }

  // 应用颜色主题
  const colors = colorSchemes[colorScheme];
  return {
    ...baseThemeConfig,
    token: {
      ...baseThemeConfig.token,
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryHover,
      colorPrimaryActive: colors.primaryActive,
    },
  };
};

// 系统主题检测工具
export class SystemThemeDetector {
  private mediaQuery: MediaQueryList;
  private listeners: Array<(isDark: boolean) => void> = [];

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.handleSystemChange = this.handleSystemChange.bind(this);
  }

  // 开始监听系统主题变化
  startListening() {
    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener('change', this.handleSystemChange);
    } else {
      // 兼容旧版本浏览器
      this.mediaQuery.addListener(this.handleSystemChange);
    }
  }

  // 停止监听
  stopListening() {
    if (this.mediaQuery.removeEventListener) {
      this.mediaQuery.removeEventListener('change', this.handleSystemChange);
    } else {
      this.mediaQuery.removeListener(this.handleSystemChange);
    }
  }

  // 获取当前系统主题偏好
  getSystemPreference(): 'dark' | 'light' {
    return this.mediaQuery.matches ? 'dark' : 'light';
  }

  // 添加监听器
  addListener(callback: (isDark: boolean) => void) {
    this.listeners.push(callback);
  }

  // 移除监听器
  removeListener(callback: (isDark: boolean) => void) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private handleSystemChange(event: MediaQueryListEvent) {
    const isDark = event.matches;
    this.listeners.forEach((listener) => listener(isDark));
  }
}

// 主题持久化工具
export class ThemePersistence {
  private static readonly THEME_KEY = 'admin_theme_config';

  static save(config: any) {
    try {
      localStorage.setItem(this.THEME_KEY, JSON.stringify(config));
    } catch (error) {
      console.warn('Failed to save theme config to localStorage:', error);
    }
  }

  static load(): any {
    try {
      const saved = localStorage.getItem(this.THEME_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Failed to load theme config from localStorage:', error);
      return null;
    }
  }

  static clear() {
    try {
      localStorage.removeItem(this.THEME_KEY);
    } catch (error) {
      console.warn('Failed to clear theme config from localStorage:', error);
    }
  }
}

// 向后兼容的简单接口
export const getCurrentTheme = (): ThemeConfig => {
  const themeType = localStorage.getItem('theme') || 'default';

  switch (themeType) {
    case 'dark':
      return darkTheme;
    case 'compact':
      return compactTheme;
    default:
      return defaultTheme;
  }
};

export const switchTheme = (themeType: 'default' | 'dark' | 'compact') => {
  localStorage.setItem('theme', themeType);
  window.location.reload();
};

export type ThemeType = 'default' | 'dark' | 'compact';

// 主题模式类型
export type ThemeMode = 'light' | 'dark' | 'auto';
export type ThemeAlgorithm = 'default' | 'dark' | 'compact';
export type ColorScheme = keyof typeof colorSchemes;

export interface ThemeConfiguration {
  mode: ThemeMode;
  algorithm: ThemeAlgorithm;
  colorScheme: ColorScheme;
}
