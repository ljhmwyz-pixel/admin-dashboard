import { useMemo, useState } from 'react';
import { Button, Space, Table as AntTable } from 'antd';
import classNames from 'classnames';

import { AntSpace } from '@/shared/components';

import BatchActionBar from './components/BatchActionBar';
import HeaderFilter from './components/HeaderFilter';
import Pagination from './components/Pagination';
import type { BaseTableProps } from './dto';

import styles from './index.module.scss';

function BaseTable<RecordType extends object = any>({
  pagination,
  className,
  columns = [],
  dataSource = [],
  filterConfig,
  operations,
  operationWidth,
  ...props
}: BaseTableProps<RecordType>) {
  const [innerSelectedRowKeys, setInnerSelectedRowKeys] = useState<React.Key[]>([]);
  const showPagination = pagination !== false;
  const paginationConfig = typeof pagination === 'object' ? pagination : undefined;
  //  所有 filter 状态统一管理
  const [filters, setFilters] = useState<Record<string, any>>({});

  //自动生成带 HeaderFilter 的 columns
  const finalColumns = useMemo(() => {
    const cols: any[] = columns.map((col: any) => {
      const key = col.dataIndex || col.key;

      if (!filterConfig?.[key]) return col;

      return {
        ...col,
        title: (
          <HeaderFilter
            title={col.title}
            value={filters[key]}
            config={filterConfig[key]}
            onChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                [key]: val,
              }))
            }
          />
        ),
      };
    });

    if (operations?.length) {
      cols.push({
        title: 'Operation',
        key: '__operation',
        width: operationWidth || 180,
        fixed: 'right',

        render: (_: any, record: RecordType) => {
          return (
            <AntSpace size={20}>
              {operations.map((op) => {
                const hidden = typeof op.hidden === 'function' ? op.hidden(record) : op.hidden;

                if (hidden) return null;

                // const disabled =
                //   typeof op.disabled === 'function' ? op.disabled(record) : op.disabled;

                return (
                  <div
                    key={op.key}
                    className={styles.operationButtonItem}
                    onClick={() => op.onClick(record)}
                  >
                    {op.icon}
                  </div>
                );
              })}
            </AntSpace>
          );
        },
      });
    }

    return cols;
  }, [columns, filters, filterConfig, operations, operationWidth]);
  // 自动过滤数据
  const filteredData = useMemo(() => {
    return dataSource.filter((row: any) => {
      return Object.keys(filters).every((key) => {
        const filterVal = filters[key];
        if (!filterVal || filterVal.length === 0) return true;

        const cellVal = row[key];

        // 多选 AND
        if (Array.isArray(filterVal)) {
          return filterVal.every((v) =>
            String(cellVal).toLowerCase().includes(String(v).toLowerCase()),
          );
        }

        // input
        return String(cellVal).toLowerCase().includes(String(filterVal).toLowerCase());
      });
    });
  }, [dataSource, filters]);

  const finalRowSelection = props.rowSelection
    ? {
        ...props.rowSelection,
        selectedRowKeys: props.rowSelection.selectedRowKeys ?? innerSelectedRowKeys,

        onChange: (keys: React.Key[], rows: RecordType[], info: any) => {
          setInnerSelectedRowKeys(keys);

          props.rowSelection?.onChange?.(keys, rows, info);
        },
      }
    : undefined;
  const selectedKeys = finalRowSelection?.selectedRowKeys || innerSelectedRowKeys;
  return (
    <div>
      <AntTable
        {...props}
        rowSelection={finalRowSelection}
        columns={finalColumns}
        dataSource={filteredData}
        size="large"
        className={classNames(styles.baseTable, className)}
        pagination={false}
      />
      {showPagination && paginationConfig && <Pagination {...paginationConfig} />}
      {/* 批量操作栏 */}
      <BatchActionBar
        selectedKeys={selectedKeys}
        actions={props.batchActions}
        onClear={() => setInnerSelectedRowKeys([])}
        selectedCountText={props.selectedCountText}
      />
    </div>
  );
}

export default BaseTable;
