import React from 'react';
import { BulbOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';

import IconButton from '../../atoms/IconButton/IconButton';

interface ThemeModeSelectorProps {
  /** 当前主题模式 */
  mode: 'light' | 'dark' | 'auto';
  /** 选中状态回调 */
  onSelect: (mode: 'light' | 'dark' | 'auto') => void;
  /** 是否垂直布局 */
  vertical?: boolean;
}

/**
 * 主题模式选择器分子组件
 * 包含自动、浅色、深色三种模式选择
 */
const ThemeModeSelector: React.FC<ThemeModeSelectorProps> = ({ mode, vertical = false }) => {
  const getCurrentIcon = () => {
    if (mode === 'auto') return <BulbOutlined />;
    return mode === 'dark' ? <MoonOutlined /> : <SunOutlined />;
  };

  const getCurrentLabel = () => {
    if (mode === 'auto') return '自动';
    return mode === 'dark' ? '深色' : '浅色';
  };

  return (
    <div className={`theme-mode-selector ${vertical ? 'vertical' : 'horizontal'}`}>
      <IconButton icon={getCurrentIcon()} size="middle" title={getCurrentLabel()} />
    </div>
  );
};

export default ThemeModeSelector;
