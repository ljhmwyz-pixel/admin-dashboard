import React from 'react';
import { AntSegmented } from '@shared/components';
import type { SegmentedProps } from 'antd';
import classNames from 'classnames';

import styles from './index.module.scss';

export interface OptionItem {
  label: React.ReactNode;
  value: string | number;
  icon?: React.ReactNode;
  iconSelected?: React.ReactNode;
  disabled?: boolean;
  color?: string; // 可选的颜色属性，用于标识选项状态
}

interface Props extends Omit<SegmentedProps, 'options' | 'value'> {
  options: OptionItem[];
  className?: string;
  value: SegmentedProps['value']; // 必传，用于控制选中状态的颜色
}

const Segmented: React.FC<Props> = ({ options, className, value, ...rest }) => {
  // 获取当前选中项的颜色
  const selectedColor = React.useMemo(() => {
    return options.find((item) => item.value === value)?.color;
  }, [options, value]);

  // 创建带颜色状态的 label 渲染函数
  const renderLabel = (item: OptionItem) => {
    const isSelected = value === item.value;
    // 如果选中且有 selectedIcon，使用 selectedIcon，否则使用普通 icon
    const displayIcon = isSelected && item.iconSelected ? item.iconSelected : item.icon;

    return (
      <div className={styles.label}>
        {displayIcon && <div className={styles.icon}>{displayIcon}</div>}
        <span>{item.label}</span>
      </div>
    );
  };

  const formattedOptions = options.map((item) => ({
    label: renderLabel(item),
    value: item.value,
    disabled: item.disabled,
  }));
  return (
    <div
      className={classNames(styles.segmented, className)}
      style={
        {
          '--segmented-selected-color': selectedColor || 'rgba(51, 194, 200, 1)',
        } as React.CSSProperties
      }
    >
      <AntSegmented {...rest} options={formattedOptions} />
    </div>
  );
};

export default Segmented;
