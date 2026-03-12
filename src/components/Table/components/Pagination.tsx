import React from 'react';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import classNames from 'classnames';

import styles from './Pagination.module.scss';

export interface BasePaginationProps extends PaginationProps {
  showTotalText?: boolean;
}

const BasePagination: React.FC<BasePaginationProps> = ({
  className,
  current = 1,
  pageSize = 10,
  total = 0,
  onChange,
  showTotalText = true,
  ...rest
}) => {
  const lastPage = Math.ceil(total / pageSize);

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

      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        showSizeChanger
        showPrevNextJumpers
        showLessItems
        showQuickJumper
        onChange={onChange}
        itemRender={(page, type, original) => {
          if (type === 'prev') {
            return (
              <div className={styles.jumpContainer}>
                <div
                  className={styles.jumpBtn}
                  onClick={() => current !== 1 && onChange?.(1, pageSize)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="20" height="20" rx="4" fill="white" />
                    <path
                      d="M9 13L6.06401 10.15C5.97866 10.0672 5.97866 9.93284 6.06401 9.85L9 7"
                      stroke="#191B1F"
                      strokeOpacity="0.4"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14 13L11.064 10.15C10.9787 10.0672 10.9787 9.93284 11.064 9.85L14 7"
                      stroke="#191B1F"
                      strokeOpacity="0.4"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>{original}</div>
              </div>
            );
          }

          if (type === 'next') {
            return (
              <div className={styles.jumpContainer}>
                <div>{original}</div>
                <div
                  className={styles.jumpBtn}
                  onClick={() => current !== lastPage && onChange?.(lastPage, pageSize)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="20" height="20" rx="4" fill="white" />
                    <path
                      d="M6 13L8.93599 10.15C9.02134 10.0672 9.02134 9.93284 8.93599 9.85L6 7"
                      stroke="#191B1F"
                      strokeOpacity="0.4"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M11 13L13.936 10.15C14.0213 10.0672 14.0213 9.93284 13.936 9.85L11 7"
                      stroke="#191B1F"
                      strokeOpacity="0.4"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            );
          }

          return original;
        }}
        {...rest}
      />
    </div>
  );
};

export default BasePagination;
