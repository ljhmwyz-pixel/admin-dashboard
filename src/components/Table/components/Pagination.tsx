import React from 'react';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import type { PaginationProps } from 'antd';
import { Button, Pagination } from 'antd';

import styles from './Pagination.module.scss';

export interface BasePaginationProps extends PaginationProps {
  showTotalText?: boolean;
}

const BasePagination: React.FC<BasePaginationProps> = ({
  current = 1,
  pageSize = 10,
  total = 0,
  onChange,
}) => {
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const isFirst = current === 1;
  const isLast = current === lastPage;
  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  return (
    <div className={styles.paginationBar}>
      {/* 左侧 total */}
      <span className={styles.totalText}>
        {start}-{end} of {total} items
      </span>

      {/* 中间分页区 */}
      <div className={styles.centerPager}>
        <Button
          size="small"
          disabled={isFirst}
          className={styles.iconBtn}
          onClick={() => onChange?.(1, pageSize)}
          icon={<DoubleLeftOutlined />}
          title="First Page"
        />

        <Pagination
          current={current}
          total={total}
          pageSize={pageSize}
          onChange={onChange}
          showLessItems
          showPrevNextJumpers
          showQuickJumper={false}
          showSizeChanger={false}
        />
        {/* 末页按钮 */}
        <Button
          size="small"
          disabled={isLast}
          className={styles.iconBtn}
          style={{ marginRight: 20 }}
          onClick={() => onChange?.(lastPage, pageSize)}
          icon={<DoubleRightOutlined />}
          title="Last Page"
        />
      </div>

      {/* 右侧 options */}
      <div className={styles.optionsWrap}>
        <Pagination
          className={styles.optionPagination}
          current={current}
          total={total}
          pageSize={pageSize}
          onChange={onChange}
          showQuickJumper
          showSizeChanger
          locale={{
            jump_to: 'to',
            page: 'Page',
          }}
        />
      </div>
    </div>
  );
};

export default BasePagination;
