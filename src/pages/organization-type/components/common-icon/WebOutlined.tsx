import React from 'react';

/**
 * 植物图标组件
 * @param props 组件属性
 * @returns 植物图标SVG元素
 */
const WebOutlined: React.FC<{
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
        d="M0.999976 6H13M2.99998 4H3.09998M5.09959 4H5.19958M7.19919 4H7.29919M2.59998 12H11.4C12.5045 12 13.4 11.1046 13.4 10V4C13.4 2.89543 12.5045 2 11.4 2H2.59998C1.49541 2 0.599976 2.89543 0.599976 4V10C0.599976 11.1046 1.49541 12 2.59998 12Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default WebOutlined;
