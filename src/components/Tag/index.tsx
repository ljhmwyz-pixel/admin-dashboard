import React from 'react';
import type { TagProps } from 'antd';
import classNames from 'classnames';

import { AntTag } from '@/shared/components';

import type { TagConfig } from './constants';

import styles from './index.module.scss';

interface CustomTagProps extends TagProps {
  className?: string;
  backgroundColor?: string;
  tagProps?: TagProps;

  preset?: TagConfig; // 预设标签配置对象
}

const CustomTag: React.FC<CustomTagProps> = ({
  className,
  backgroundColor,
  preset,
  children,
  style, // 接收外部传入的 style
  ...tagProps
}) => {
  // 使用预设配置的颜色和背景色
  const finalColor = preset?.color || tagProps.color;
  const finalBgColor = backgroundColor || preset?.bgColor;

  // YES、NO、PARENT 需要边框
  const hasBorder = preset?.label === 'Yes' || preset?.label === 'No' || preset?.label === 'Parent';

  return (
    <AntTag
      {...tagProps}
      color={finalColor}
      style={{
        background: finalBgColor,
        border: hasBorder ? `1px solid ${finalColor}` : undefined,
        borderRadius: '2px',
        ...style,
      }}
      className={classNames(styles.tagStyle, className)}
    >
      {children || preset?.label}
    </AntTag>
  );
};

export default CustomTag;
