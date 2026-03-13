import type { TablePaginationConfig } from 'antd';
import { Table as AntTable } from 'antd';
import classNames from 'classnames';

import Pagination from './components/Pagination';
import type { BaseTableProps } from './dto';

import styles from './index.module.scss';

function BaseTable<RecordType extends object = any>({
  pagination,
  className,
  ...props
}: BaseTableProps<RecordType>) {
  // 不使用内部 pagination，统一用自定义 Pagination 组件
  const showPagination = pagination !== false;
  const paginationConfig = typeof pagination === 'object' ? pagination : undefined;

  return (
    <div>
      <AntTable
        {...props}
        size="small"
        className={classNames(styles.baseTable, className)}
        pagination={false}
      />
      {showPagination && paginationConfig && (
        <Pagination
          current={paginationConfig.current}
          pageSize={paginationConfig.pageSize}
          total={paginationConfig.total}
          onChange={paginationConfig.onChange}
        />
      )}
    </div>
  );
}

export default BaseTable;
