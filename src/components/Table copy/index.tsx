import React, { useMemo, useState } from 'react';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Space, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import BatchActionBar from './components/BatchActionBar';
import TablePagination from './components/Pagination';
import type { BaseTableProps, OperationAction, PaginationConfig } from './dto';

import styles from './index.module.scss';

function BaseTable<T extends object>({
  rowKey,
  columns,
  batchActions,
  operations,
  paginationConfig,
  showPagination = true,
  tableTitle,
  bordered = true,
  size = 'middle',
  locale,
  pagination,
  selectedCountText,
  rowSelection,
  ...rest
}: BaseTableProps<T>) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 行选择配置（如果外部未提供，则根据 batchActions 自动生成）
  const finalRowSelection = useMemo(() => {
    // 如果外部提供了 rowSelection，优先使用外部的
    if (rowSelection) {
      return rowSelection;
    }
    // 如果没有外部配置且有 batchActions，生成默认的多选配置
    if (batchActions) {
      return {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
      };
    }
    return undefined;
  }, [batchActions, rowSelection, selectedRowKeys]);

  // 生成操作列
  const operationColumn = useMemo<ColumnsType<T>[number] | null>(() => {
    if (!operations || operations.length === 0) return null;

    return {
      title: 'Operation',
      key: 'operation',
      width: 120,
      fixed: 'right',
      render: (_: unknown, record: T) => (
        <Space size={8}>
          {operations.map((op: OperationAction<T>) => {
            const iconMap: Record<string, React.ReactNode> = {
              view: <EyeOutlined />,
              edit: <EditOutlined />,
              delete: <DeleteOutlined />,
            };

            const icon = op.icon || iconMap[op.key.toLowerCase()] || null;

            return (
              <Tooltip key={op.key} title={op.label}>
                <span
                  style={{
                    cursor: op.disabled ? 'not-allowed' : 'pointer',
                    color: op.danger ? '#ff4d4f' : op.disabled ? '#d9d9d9' : '#1677ff',
                    opacity: op.disabled ? 0.5 : 1,
                    fontSize: 16,
                    transition: 'color 0.3s',
                  }}
                  onClick={() => !op.disabled && op.onClick(record)}
                  onMouseEnter={(e) => {
                    if (!op.disabled && !op.danger) {
                      e.currentTarget.style.color = '#4096ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!op.disabled && !op.danger) {
                      e.currentTarget.style.color = '#1677ff';
                    }
                  }}
                >
                  {icon}
                </span>
              </Tooltip>
            );
          })}
        </Space>
      ),
    };
  }, [operations]);

  // 合并列定义
  const finalColumns = useMemo<ColumnsType<T>>(() => {
    if (!operationColumn) return columns || [];
    return [...(columns || []), operationColumn];
  }, [columns, operationColumn]);

  // 默认分页配置
  const defaultPaginationConfig: PaginationConfig = {
    pageSizeOptions: ['10', '20', '50', '100'],
    defaultPageSize: 20,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: number[]) => `${range[0]}-${range[1]} of ${total} items`,
    ...paginationConfig,
  };

  // 空数据提示
  const defaultLocale = {
    emptyText: (
      <div className={styles.emptyText}>
        <span>No Data</span>
      </div>
    ),
    ...locale,
  };

  return (
    <div className={styles.tableWrapper}>
      {/* 表格标题 */}
      {tableTitle && <div className={styles.tableTitle}>{tableTitle}</div>}

      {/* 数据表格 */}
      <Table
        rowKey={rowKey}
        columns={finalColumns}
        rowSelection={rowSelection}
        bordered={bordered}
        size={size as any}
        pagination={false}
        locale={defaultLocale}
        {...rest}
      />

      {/* 自定义分页器 */}
      {/* {showPagination && (
        <TablePagination
          total={pagination?.total}
          page={pagination?.current}
          pageSize={pagination?.pageSize}
          onChange={pagination?.onChange}
          pageSizeOptions={defaultPaginationConfig.pageSizeOptions}
          showQuickJumper={defaultPaginationConfig.showQuickJumper}
        />
      )} */}

      {/* 批量操作栏 */}
      {/* <BatchActionBar
        selectedKeys={selectedRowKeys}
        actions={batchActions}
        onClear={() => setSelectedRowKeys([])}
        selectedCountText={selectedCountText}
      /> */}
    </div>
  );
}

export default BaseTable;
