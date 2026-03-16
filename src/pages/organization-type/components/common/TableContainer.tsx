import React from 'react';
import { Spin, Table } from 'antd';

import styles from './TableContainer.module.scss';

interface TableContainerProps {
  loading: boolean;
  error: string | null;
  dataSource: any[];
  columns: any[];
  rowKey: string;
  emptyText?: string;
  scroll?: { x?: number | string; y?: number | string };
}

const TableContainer: React.FC<TableContainerProps> = ({
  loading,
  error,
  dataSource,
  columns,
  rowKey,
  emptyText = '无数据',
  scroll,
}) => {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowKey={rowKey}
        locale={{ emptyText }}
        scroll={scroll}
      />
    </div>
  );
};

export default TableContainer;
