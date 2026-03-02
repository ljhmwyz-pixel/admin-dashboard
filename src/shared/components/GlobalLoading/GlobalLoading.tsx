import React from 'react';
import type { SpinProps } from 'antd';
import { Spin } from 'antd';

import styles from './GlobalLoading.module.scss';

export interface GlobalLoadingProps {
  /** 是否显示loading */
  visible?: boolean;
  /** loading文本 */
  tip?: string;
  /** Spin组件的其他属性 */
  spinProps?: SpinProps;
  /** 自定义样式 */
  className?: string;
  /** 自定义内联样式 */
  style?: React.CSSProperties;
}

/**
 * 全局Loading组件
 * 用于在页面上显示全局loading遮罩
 */
const GlobalLoading: React.FC<GlobalLoadingProps> = ({
  visible = false,
  tip = '加载中...',
  spinProps,
  className = '',
  style,
}) => {
  if (!visible) return null;

  return (
    <div className={`${styles.globalLoadingOverlay} ${className}`} style={style}>
      <div className={styles.loadingContent}>
        <Spin size="large" tip={tip} {...spinProps} />
      </div>
    </div>
  );
};

export default GlobalLoading;
