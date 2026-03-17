import React from 'react';

/**
 * 植物图标组件
 * @param props 组件属性
 * @returns 植物图标SVG元素
 */
const OrganizationOutlined: React.FC<{
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
        d="M4.57774 9.24961L4.15586 6.99961M6.60131 5.24431L9.37971 6.80717M9.37971 9.14109L7.18966 10.3204M6.59961 3.59961C6.59961 5.25646 5.25646 6.59961 3.59961 6.59961C1.94276 6.59961 0.599609 5.25646 0.599609 3.59961C0.599609 1.94276 1.94276 0.599609 3.59961 0.599609C5.25646 0.599609 6.59961 1.94276 6.59961 3.59961ZM13.3996 7.99961C13.3996 9.10418 12.5042 9.99961 11.3996 9.99961C10.295 9.99961 9.39961 9.10418 9.39961 7.99961C9.39961 6.89504 10.295 5.99961 11.3996 5.99961C12.5042 5.99961 13.3996 6.89504 13.3996 7.99961ZM6.99961 11.3996C6.99961 12.5042 6.10418 13.3996 4.99961 13.3996C3.89504 13.3996 2.99961 12.5042 2.99961 11.3996C2.99961 10.2951 3.89504 9.39963 4.99961 9.39963C6.10418 9.39963 6.99961 10.2951 6.99961 11.3996Z"
        stroke={color}
        className={className}
        style={style}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default OrganizationOutlined;
