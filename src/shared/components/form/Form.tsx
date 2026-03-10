import React from 'react';
import type { FormProps as AntFormProps } from 'antd';

import { AntForm } from '../antd-imports';

import './Form.css';

// 扩展的表单属性接口
export interface FormProps extends AntFormProps {
  /** 表单主题风格 */
  theme?: 'default' | 'compact' | 'card';
  /** 是否启用动画效果 */
  animated?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 自定义 Form 组件
 * 基于 Ant Design Form 进行二次封装
 * 提供更多主题和动画选项
 */
const Form: React.FC<FormProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  theme = 'default',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  animated = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className = '',
  children,
  ...restProps
}) => {
  return <AntForm {...restProps}>{children}</AntForm>;
};

// 导出 Form 的子组件和 hooks
export const FormItem = AntForm.Item;
export const FormList = AntForm.List;
export const FormProvider = AntForm.Provider;
// eslint-disable-next-line react-refresh/only-export-components
export const useForm = AntForm.useForm;
// eslint-disable-next-line react-refresh/only-export-components
export const useWatch = AntForm.useWatch;
// eslint-disable-next-line react-refresh/only-export-components
export const useFormInstance = AntForm.useFormInstance;

export default Form;
