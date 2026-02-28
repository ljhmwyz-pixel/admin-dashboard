/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import {
  BulbOutlined,
  CheckOutlined,
  MoonOutlined,
  SettingOutlined,
  SunOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';

import type { ColorScheme } from '../../config/themes';
import { useTheme, useThemeContext } from '../../hooks/theme';

import './ThemeSwitcher.css';

interface ThemeSwitcherProps {
  /** 是否显示文本标签 */
  showText?: boolean;
  /** 按钮大小 */
  size?: 'small' | 'middle' | 'large';
  /** 自定义类名 */
  className?: string;
}

/**
 * 主题切换器组件
 * 提供完整的主题切换功能，包括模式、颜色主题等
 * 使用React.memo优化性能
 */
const ThemeSwitcher: React.FC<ThemeSwitcherProps> = React.memo(
  ({ showText = false, size = 'middle', className = '' }) => {
    const { mode, isDarkMode: isDark, changeColorScheme, isLoading, colorScheme } = useTheme();
    const themeContext = useThemeContext();

    const [open, setOpen] = useState(false);

    // 使用useMemo优化静态数据
    const colorOptions = useMemo<Array<{ key: ColorScheme; label: string; color: string }>>(
      () => [
        { key: 'blue', label: '蓝色', color: '#1677ff' },
        { key: 'green', label: '绿色', color: '#52c41a' },
        { key: 'purple', label: '紫色', color: '#722ed1' },
        { key: 'orange', label: '橙色', color: '#fa8c16' },
        { key: 'red', label: '红色', color: '#f5222d' },
      ],
      [],
    );

    // 主题模式菜单项 - 使用useMemo优化
    const themeModeItems = useMemo<MenuProps['items']>(
      () => [
        {
          key: 'auto',
          label: (
            <Space>
              <BulbOutlined />
              跟随系统
              {mode === 'auto' && <CheckOutlined />}
            </Space>
          ),
          onClick: () => {
            themeContext.resetToSystemTheme();
            setOpen(false);
          },
        },
        {
          key: 'light',
          label: (
            <Space>
              <SunOutlined />
              浅色模式
              {mode === 'light' && <CheckOutlined />}
            </Space>
          ),
          onClick: () => {
            themeContext.changeThemeMode('light');
            setOpen(false);
          },
        },
        {
          key: 'dark',
          label: (
            <Space>
              <MoonOutlined />
              深色模式
              {mode === 'dark' && <CheckOutlined />}
            </Space>
          ),
          onClick: () => {
            themeContext.changeThemeMode('dark');
            setOpen(false);
          },
        },
      ],
      [mode, themeContext],
    );

    // 颜色主题菜单项 - 使用useMemo优化
    const colorItems = useMemo<MenuProps['items']>(
      () =>
        colorOptions.map(({ key, label, color }) => ({
          key,
          label: (
            <Space>
              <div className="color-preview" style={{ backgroundColor: color }} />
              {label}
              {colorScheme === key && <CheckOutlined />}
            </Space>
          ),
          onClick: () => {
            changeColorScheme(key);
            setOpen(false);
          },
        })),
      [colorOptions, colorScheme, changeColorScheme],
    );

    // 主菜单项 - 使用useMemo优化
    const menuItems = useMemo<MenuProps['items']>(
      () => [
        {
          key: 'mode',
          label: '主题模式',
          icon: <SettingOutlined />,
          children: themeModeItems,
        },
        {
          key: 'color',
          label: '主题颜色',
          icon: <BulbOutlined />,
          children: colorItems,
        },
      ],
      [themeModeItems, colorItems],
    );

    const handleOpenChange = (flag: boolean) => {
      setOpen(flag);
    };

    const getDisplayIcon = () => {
      if (mode === 'auto') return <BulbOutlined />;
      return isDark ? <MoonOutlined /> : <SunOutlined />;
    };

    const getDisplayText = () => {
      if (!showText) return '';
      if (mode === 'auto') return '自动';
      return isDark ? '深色' : '浅色';
    };

    return (
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button
          className={`theme-switcher ${className}`}
          size={size}
          icon={getDisplayIcon()}
          loading={isLoading}
        >
          {getDisplayText()}
        </Button>
      </Dropdown>
    );
  },
);

export default ThemeSwitcher;

// 为React.memo添加displayName以满足ESLint要求
ThemeSwitcher.displayName = 'ThemeSwitcher';
