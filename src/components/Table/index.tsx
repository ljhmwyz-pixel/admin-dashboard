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
  const paginationConfig = typeof pagination === 'object' ? pagination : undefined;
  const showPagination = pagination !== false && paginationConfig;

  return (
    <div>
      <AntTable
        {...props}
        size="small"
        className={classNames(styles.baseTable, className)}
        pagination={false}
      />
      {showPagination && (
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
