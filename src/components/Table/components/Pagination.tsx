import React from 'react';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import type { PaginationProps } from 'antd';
import { Button, Pagination } from 'antd';
import classNames from 'classnames';

import styles from './Pagination.module.scss';

export interface BasePaginationProps extends PaginationProps {
  showTotalText?: boolean;
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
  pageSizeOptions?: (string | number)[];
}

const BasePagination: React.FC<BasePaginationProps> = ({
  className,
  current = 1,
  pageSize = 10,
  total = 0,
  onChange,
  showTotalText = true,
  showQuickJumper = true,
  showSizeChanger = true,
  pageSizeOptions = ['10', '20', '50', '100'],
  ...rest
}) => {
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const isFirst = current === 1;
  const isLast = current === lastPage;

  return (
    <div className={classNames(styles.paginationWrapper, className)}>
      {showTotalText && (
        <div className={styles.total}>
          {total === 0
            ? '0 items'
            : `${(current - 1) * pageSize + 1}-${Math.min(
                current * pageSize,
                total,
              )} of ${total} items`}
        </div>
      )}

      <div className={styles.paginationGroup}>
        {/* 首页按钮 */}
        <Button
          size="small"
          disabled={isFirst}
          className={styles.iconBtn}
          onClick={() => onChange?.(1, pageSize)}
          icon={<DoubleLeftOutlined />}
          title="First Page"
        />

        {/* Ant Design Pagination */}
        <Pagination
          {...rest}
          current={current}
          pageSize={pageSize}
          total={total}
          showQuickJumper={false}
          showSizeChanger={false}
          onChange={onChange}
          // itemRender={(page, type, originalElement) => {
          //   if (type === 'prev') {
          //     return (
          //       <Button
          //         size="small"
          //         disabled={isFirst}
          //         className={styles.iconBtn}
          //         icon={
          //           <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          //             <path
          //               d="M6.5 8.5L3 5L6.5 1.5"
          //               stroke="currentColor"
          //               strokeWidth="1.5"
          //               strokeLinecap="round"
          //               strokeLinejoin="round"
          //             />
          //           </svg>
          //         }
          //       />
          //     );
          //   }
          //   if (type === 'next') {
          //     return (
          //       <Button
          //         size="small"
          //         disabled={isLast}
          //         className={styles.iconBtn}
          //         icon={
          //           <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          //             <path
          //               d="M3.5 1.5L7 5L3.5 8.5"
          //               stroke="currentColor"
          //               strokeWidth="1.5"
          //               strokeLinecap="round"
          //               strokeLinejoin="round"
          //             />
          //           </svg>
          //         }
          //       />
          //     );
          //   }
          //   return originalElement;
          // }}
        />

        {/* 末页按钮 */}
        <Button
          size="small"
          disabled={isLast}
          className={styles.iconBtn}
          onClick={() => onChange?.(lastPage, pageSize)}
          icon={<DoubleRightOutlined />}
          title="Last Page"
        />

        {/* 快速跳转 */}
        {showQuickJumper && (
          <div className={styles.quickJumper}>
            <span>to</span>
            <input
              type="number"
              min="1"
              max={lastPage}
              value={current}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1 && val <= lastPage) {
                  onChange?.(val, pageSize);
                }
              }}
            />
            <span>Page</span>
          </div>
        )}

        {/* 每页条数选择器 */}
        {showSizeChanger && (
          <div className={styles.pageSize}>
            <select
              value={pageSize}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                onChange?.(1, val);
              }}
            >
              {pageSizeOptions.map((option) => {
                const numValue = parseInt(option);
                return (
                  <option key={option} value={numValue}>
                    {numValue}
                  </option>
                );
              })}
            </select>
            <span>/Page</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasePagination;
