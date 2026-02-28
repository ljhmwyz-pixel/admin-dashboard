import type { CardProps as AntCardProps } from 'antd';
import React from 'react';

import { AntCard } from '../antd-imports';

import './Card.css';

// 扩展的卡片属性接口
export interface CardProps extends AntCardProps {
  /** 卡片主题 */
  theme?: 'default' | 'shadow' | 'bordered' | 'gradient';
  /** 是否启用悬停效果 */
  hoverable?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 自定义 Card 组件
 * 基于 Ant Design Card 进行二次封装
 * 提供更多主题和动画效果
 */
const Card: React.FC<CardProps> = ({
  theme = 'default',
  hoverable = false,
  className = '',
  children,
  ...restProps
}) => {
  // 构建自定义类名
  const customClassName = [
    'custom-card',
    `custom-card--${theme}`,
    hoverable ? 'custom-card--hoverable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AntCard className={customClassName} {...restProps}>
      {children}
    </AntCard>
  );
};

export default Card;
