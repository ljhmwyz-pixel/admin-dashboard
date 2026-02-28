import React from 'react';
import type { ThemeConfig } from 'antd';
import { ConfigProvider } from 'antd';
import type { ReactNode } from 'react';

import { useTheme } from '../hooks/theme';

interface AntdThemeProviderProps {
  children: ReactNode;
}

/**
 * Ant Design 主题 Provider
 * 为所有 Ant Design 组件提供统一的主题配置
 */
export const AntdThemeProvider: React.FC<AntdThemeProviderProps> = ({ children }) => {
  const { themeConfig } = useTheme();

  // 调试日志
  React.useEffect(() => {
    console.log('AntdThemeProvider - themeConfig:', themeConfig);
  }, [themeConfig]);

  // 确保 themeConfig 是有效的 ThemeConfig 对象
  const antdTheme: ThemeConfig = {
    ...(themeConfig || {}),
    components: {
      ...(themeConfig?.components || {}),
      // 可以在这里添加特定组件的自定义配置
      Menu: {
        ...(themeConfig?.components?.Menu || {}),
        // 确保菜单项在暗色模式下有合适的颜色
        itemColor: themeConfig?.token?.colorText,
        itemHoverColor: themeConfig?.token?.colorPrimary,
        itemSelectedColor: themeConfig?.token?.colorPrimary,
      },
      Button: {
        ...(themeConfig?.components?.Button || {}),
        // 确保按钮在不同主题下有合适的外观
        primaryColor: '#fff',
      },
      Input: {
        ...(themeConfig?.components?.Input || {}),
        // 输入框在暗色模式下的适配
        colorText: themeConfig?.token?.colorText,
        colorTextPlaceholder: themeConfig?.token?.colorTextSecondary,
      },
    },
  };

  return (
    <ConfigProvider
      theme={antdTheme}
      // 支持 RTL 布局
      direction="ltr"
      // 组件前缀
      prefixCls="ant"
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdThemeProvider;
