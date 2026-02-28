import React from 'react';
import type { ThemeConfig } from 'antd';
import { ConfigProvider } from 'antd';
import type { ReactNode } from 'react';

import { useUnifiedTheme } from '../hooks/useUnifiedTheme';

interface AntdThemeProviderProps {
  children: ReactNode;
}

/**
 * Ant Design 主题 Provider
 * 为所有 Ant Design 组件提供统一的主题配置
 */
export const AntdThemeProvider: React.FC<AntdThemeProviderProps> = ({ children }) => {
  const { currentThemeConfig: themeConfig } = useUnifiedTheme();

  // 简化的主题配置
  const antdTheme: ThemeConfig = {
    ...themeConfig,
    components: {
      ...themeConfig.components,
      Menu: {
        ...themeConfig.components?.Menu,
        itemColor: themeConfig.token?.colorText,
        itemHoverColor: themeConfig.token?.colorPrimary,
        itemSelectedColor: themeConfig.token?.colorPrimary,
      },
      Button: {
        ...themeConfig.components?.Button,
        primaryColor: '#fff',
      },
      Input: {
        ...themeConfig.components?.Input,
        colorText: themeConfig.token?.colorText,
        colorTextPlaceholder: themeConfig.token?.colorTextSecondary,
      },
    },
  };

  return (
    <ConfigProvider theme={antdTheme} direction="ltr" prefixCls="ant">
      {children}
    </ConfigProvider>
  );
};

export default AntdThemeProvider;
