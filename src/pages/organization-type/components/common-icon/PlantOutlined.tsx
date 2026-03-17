import React from 'react';

/**
 * 植物图标组件
 * @param props 组件属性
 * @returns 植物图标SVG元素
 */
const PlantOutlined: React.FC<{
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}> = ({ className, color = '#31C47F', style }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      style={style}
    >
      <path
        d="M10.9919 13.3996L9.53659 1.56118C9.51594 1.02424 9.07466 0.599609 8.53733 0.599609H5.46189C4.92456 0.599609 4.48328 1.02424 4.46263 1.56118L3.0073 13.3996M10.9919 13.3996H3.0073M10.9919 13.3996H13.3996M3.0073 13.3996H0.599609M1.99961 4.99963H11.9996"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default PlantOutlined;
