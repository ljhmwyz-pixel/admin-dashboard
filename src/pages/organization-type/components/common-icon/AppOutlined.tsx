import React from 'react';

/**
 * 植物图标组件
 * @param props 组件属性
 * @returns 植物图标SVG元素
 */
const AppOutlined: React.FC<{
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
        d="M12 8.40001V2.60001C12 1.49544 11.1046 0.600006 10 0.600006H4C2.89543 0.600006 2 1.49544 2 2.60001V8.40001M12 8.40001V11.4C12 12.5046 11.1046 13.4 10 13.4H4C2.89543 13.4 2 12.5046 2 11.4V8.40001M12 8.40001H2M6.5 11H7.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default AppOutlined;
