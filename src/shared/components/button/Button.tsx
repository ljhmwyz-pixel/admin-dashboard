import React from 'react';
import type { ButtonProps as AntButtonProps } from 'antd';

import { AntButton } from '../antd-imports';

import './Button.css';

// 扩展的按钮属性接口
export interface ButtonProps extends Omit<AntButtonProps, 'loading'> {
  /** 自定义加载状态 */
  loading?: boolean | { delay?: number };
  /** 按钮主题 */
  theme?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  /** 按钮尺寸 */
  size?: 'small' | 'middle' | 'large';
  /** 是否为圆角按钮 */
  rounded?: boolean;
  /** 是否为块级按钮 */
  block?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 自定义 Button 组件
 * 基于 Ant Design Button 进行二次封装
 * 提供更多自定义选项和主题支持
 */
const Button: React.FC<ButtonProps> = ({
  theme = 'primary',
  size = 'middle',
  rounded = false,
  block = false,
  className = '',
  children,
  ...restProps
}) => {
  // 构建自定义类名
  const customClassName = [
    'custom-button',
    `custom-button--${theme}`,
    `custom-button--${size}`,
    rounded ? 'custom-button--rounded' : '',
    block ? 'custom-button--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AntButton className={customClassName} size={size} block={block} {...restProps}>
      {children}
    </AntButton>
  );
};

// 导出不同类型的按钮变体
export const PrimaryButton: React.FC<Omit<ButtonProps, 'theme'>> = (props) => (
  <Button theme="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'theme'>> = (props) => (
  <Button theme="secondary" {...props} />
);

export const SuccessButton: React.FC<Omit<ButtonProps, 'theme'>> = (props) => (
  <Button theme="success" {...props} />
);

export const WarningButton: React.FC<Omit<ButtonProps, 'theme'>> = (props) => (
  <Button theme="warning" {...props} />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'theme'>> = (props) => (
  <Button theme="danger" {...props} />
);

export const InfoButton: React.FC<Omit<ButtonProps, 'theme'>> = (props) => (
  <Button theme="info" {...props} />
);

export default Button;
