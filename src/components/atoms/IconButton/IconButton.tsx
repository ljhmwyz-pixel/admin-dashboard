import React from 'react';
import type { ButtonProps } from 'antd';
import { Button } from 'antd';

interface IconButtonProps extends Omit<ButtonProps, 'shape'> {
  /** 图标元素 */
  icon: React.ReactNode;
  /** 按钮形状，默认为圆形 */
  shape?: 'circle' | 'round';
  /** 是否只显示图标，不显示文字 */
  iconOnly?: boolean;
}

/**
 * 图标按钮原子组件
 * 基础的带图标的按钮组件
 */
const IconButton: React.FC<IconButtonProps> = ({
  icon,
  shape = 'circle',
  iconOnly = true,
  children,
  ...restProps
}) => {
  return (
    <Button icon={icon} shape={shape} {...restProps}>
      {!iconOnly && children}
    </Button>
  );
};

export default IconButton;
