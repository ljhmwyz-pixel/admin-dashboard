import React from 'react';
import type { InputProps as AntInputProps } from 'antd';
import { AntInput } from '../antd-imports';
import './Input.css';

// 扩展的输入框属性接口
export interface InputProps extends AntInputProps {
  /** 输入框主题 */
  theme?: 'default' | 'underlined' | 'filled';
  /** 是否显示边框 */
  bordered?: boolean;
  /** 自定义前缀图标 */
  prefixIcon?: React.ReactNode;
  /** 自定义后缀图标 */
  suffixIcon?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
}

/**
 * 自定义 Input 组件
 * 基于 Ant Design Input 进行二次封装
 */
const Input: React.FC<InputProps> = ({
  theme = 'default',
  bordered = true,
  prefixIcon,
  suffixIcon,
  className = '',
  ...restProps
}) => {
  // 构建自定义类名
  const customClassName = [
    'custom-input',
    `custom-input--${theme}`,
    bordered ? '' : 'custom-input--no-border',
    className
  ].filter(Boolean).join(' ');

  return (
    <AntInput
      className={customClassName}
      prefix={prefixIcon}
      suffix={suffixIcon}
      bordered={bordered}
      {...restProps}
    />
  );
};

// 导出不同类型的输入框
export const InputPassword = AntInput.Password;
export const InputTextArea = AntInput.TextArea;
export const InputSearch = AntInput.Search;
export const InputGroup = AntInput.Group;

export default Input;