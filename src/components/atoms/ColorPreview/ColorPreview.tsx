import React from 'react';

interface ColorPreviewProps {
  /** 颜色值 */
  color: string;
  /** 尺寸大小 */
  size?: number;
  /** 自定义类名 */
  className?: string;
}

/**
 * 颜色预览原子组件
 * 用于显示颜色的小圆点
 */
const ColorPreview: React.FC<ColorPreviewProps> = ({ color, size = 16, className = '' }) => {
  return (
    <div
      className={`color-preview ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        border: '1px solid #d9d9d9',
      }}
    />
  );
};

export default ColorPreview;
