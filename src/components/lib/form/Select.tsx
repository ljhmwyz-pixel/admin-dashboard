import React from 'react';
import type { SelectProps as AntSelectProps } from 'antd';
import { AntSelect } from '../antd-imports';
import './Select.css';

// 扩展的选择器属性接口
export interface SelectProps extends AntSelectProps {
  /** 选择器主题 */
  theme?: 'default' | 'borderless' | 'filled';
  /** 是否显示搜索框 */
  showSearch?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 子选项 */
  children?: React.ReactNode;
}

/**
 * 自定义 Select 组件
 * 基于 Ant Design Select 进行二次封装
 */
const Select: React.FC<SelectProps> = ({
  theme = 'default',
  showSearch = false,
  className = '',
  children,
  ...restProps
}) => {
  // 构建自定义类名
  const customClassName = [
    'custom-select',
    `custom-select--${theme}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <AntSelect
      className={customClassName}
      showSearch={showSearch}
      {...restProps}
    >
      {children}
    </AntSelect>
  );
};

// 导出 Select 的子组件
export const SelectOption = AntSelect.Option;
export const SelectOptGroup = AntSelect.OptGroup;

export default Select;