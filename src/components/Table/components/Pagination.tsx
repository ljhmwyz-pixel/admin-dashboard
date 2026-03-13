import React from 'react';
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
          icon={
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
          }
          title="First Page"
        />

        <Pagination
          current={current}
          total={total}
          pageSize={pageSize}
          onChange={onChange}
          showLessItems
          showPrevNextJumpers={false}
          showQuickJumper={false}
          showSizeChanger={false}
          itemRender={(page, type, originalElement) => {
            // 自定义上一页按钮
            if (type === 'prev') {
              return (
                <Button
                  size="small"
                  disabled={isFirst}
                  className={styles.iconBtn}
                  onClick={() => onChange?.(current - 1, pageSize)}
                  icon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.5 13L8.56401 10.15C8.47866 10.0672 8.47866 9.93284 8.56401 9.85L11.5 7"
                        stroke="#191B1F"
                        strokeOpacity="0.4"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                />
              );
            }
            // 自定义下一页按钮
            if (type === 'next') {
              return (
                <Button
                  size="small"
                  disabled={isLast}
                  className={styles.iconBtn}
                  onClick={() => onChange?.(current + 1, pageSize)}
                  icon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="20" height="20" rx="4" fill="white" />
                      <path
                        d="M9 13L11.936 10.15C12.0213 10.0672 12.0213 9.93284 11.936 9.85L9 7"
                        stroke="#191B1F"
                        strokeOpacity="0.4"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                />
              );
            }
            return originalElement;
          }}
        />
        {/* 末页按钮 */}
        <Button
          size="small"
          disabled={isLast}
          className={styles.iconBtn}
          style={{ marginRight: 20 }}
          onClick={() => onChange?.(lastPage, pageSize)}
          icon={
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
          }
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
          showSizeChanger={{
            options: [10, 20, 50, 100].map((size) => ({
              label: size,
              value: size,
            })),
            suffixIcon: (
              <svg
                width="8"
                height="5"
                viewBox="0 0 8 5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.600098 0.600098L3.4501 3.53609C3.53294 3.62143 3.66725 3.62143 3.7501 3.53609L6.6001 0.600098"
                  stroke="#191B1F"
                  strokeOpacity="0.4"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            ),
          }}
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
