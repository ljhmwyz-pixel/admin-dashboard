import React from 'react';
import type { SpaceProps as AntSpaceProps } from 'antd';

import { AntSpace } from '../antd-imports';

// 扩展的空间属性接口
export interface SpaceProps extends AntSpaceProps {
  /** 空间主题风格 */
  theme?: 'default' | 'compact' | 'loose';
  /** 是否启用动画效果 */
  animated?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 自定义 Space 组件
 * 基于 Ant Design Space 进行二次封装
 * 提供更多间距和动画选项
 */
const Space: React.FC<SpaceProps> = ({
  theme = 'default',
  animated = true,
  className = '',
  children,
  ...restProps
}) => {
  // 构建自定义类名
  const customClassName = [
    'custom-space',
    `custom-space--${theme}`,
    animated ? 'custom-space--animated' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AntSpace className={customClassName} {...restProps}>
      {children}
    </AntSpace>
  );
};

export default Space;
