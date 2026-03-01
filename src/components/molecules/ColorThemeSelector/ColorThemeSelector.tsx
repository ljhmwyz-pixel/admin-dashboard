import React from 'react';

import ColorPreview from '../../atoms/ColorPreview/ColorPreview';

interface ColorOption {
  key: string;
  label: string;
  color: string;
}

interface ColorThemeSelectorProps {
  /** 当前选中的颜色主题 */
  currentColor: string;
  /** 颜色选项列表 */
  colorOptions: ColorOption[];
  /** 选中回调 */
  onSelect: (colorKey: string) => void;
  /** 是否垂直布局 */
  vertical?: boolean;
}

/**
 * 颜色主题选择器分子组件
 * 提供多种预设颜色主题的选择
 */
const ColorThemeSelector: React.FC<ColorThemeSelectorProps> = ({
  currentColor,
  colorOptions,
  onSelect,
  vertical = false,
}) => {
  return (
    <div className={`color-theme-selector ${vertical ? 'vertical' : 'horizontal'}`}>
      {/* 这里可以渲染颜色选择的UI */}
      <div className="color-options">
        {colorOptions.map(({ key, label, color }) => (
          <button
            key={key}
            className={`color-option ${currentColor === key ? 'selected' : ''}`}
            onClick={() => onSelect(key)}
            title={label}
          >
            <ColorPreview color={color} size={24} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorThemeSelector;
