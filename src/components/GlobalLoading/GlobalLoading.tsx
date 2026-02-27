import React from 'react';
import { Spin } from 'antd';
import { useAppSelector } from '../../hooks/redux';
import styles from './GlobalLoading.module.css';

const GlobalLoading: React.FC = () => {
  const globalLoading = useAppSelector((state) => state.loading.globalLoading);

  if (!globalLoading) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}>
        <Spin size="large" />
        <div className={styles.text}>加载中...</div>
      </div>
    </div>
  );
};

export default GlobalLoading;