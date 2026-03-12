import React from 'react';
import { Pagination } from 'antd';

import styles from './Pagination.module.scss';

interface Props {
  total?: number;
  page?: number;
  pageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  pageSizeOptions?: string[];
  showQuickJumper?: boolean;
}

const TablePagination: React.FC<Props> = ({
  total = 0,
  page = 1,
  pageSize = 20,
  onChange,
  pageSizeOptions = ['10', '20', '50', '100'],
  showQuickJumper = true,
}) => {
  return (
    <div className={styles.pagination}>
      <Pagination
        current={page}
        pageSize={pageSize}
        total={total}
        showSizeChanger
        pageSizeOptions={pageSizeOptions}
        showQuickJumper={showQuickJumper}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
        onChange={onChange}
        showLessItems
      />
    </div>
  );
};

export default TablePagination;
