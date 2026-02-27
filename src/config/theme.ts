import type { ThemeConfig } from 'antd';

// 默认主题配置
export const defaultTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
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
    },
    Input: {
      borderRadius: 6,
    },
  },
};

// 暗色主题配置
export const darkTheme: ThemeConfig = {
  ...defaultTheme,
  algorithm: 'dark' as unknown as ThemeConfig['algorithm'],
  token: {
    ...defaultTheme.token,
    colorBgBase: '#141414',
    colorBgContainer: '#1d1d1d',
  },
};

// 紧凑主题配置
export const compactTheme: ThemeConfig = {
  ...defaultTheme,
  algorithm: 'compact' as unknown as ThemeConfig['algorithm'],
};

// 获取当前主题
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

// 切换主题
export const switchTheme = (themeType: 'default' | 'dark' | 'compact') => {
  localStorage.setItem('theme', themeType);
  window.location.reload(); // 简单的刷新方式，实际项目中可以使用更优雅的方式
};

// 主题类型定义
export type ThemeType = 'default' | 'dark' | 'compact';