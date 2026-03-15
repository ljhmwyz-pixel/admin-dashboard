import type { PaginationProps, TableProps } from 'antd';

// 批量操作动作
export interface BatchAction {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick: (keys: React.Key[]) => void;
  disabled?: boolean;
  danger?: boolean;
}

// 行操作动作
export interface OperationAction<T> {
  // key: string;
  // label: React.ReactNode;
  // icon?: React.ReactNode;
  // onClick: (record: T) => void;
  // disabled?: boolean;
  // danger?: boolean;
  // divider?: boolean;
  key: string;
  label: React.ReactNode;
  onClick: (record: T) => void;

  danger?: boolean;
  disabled?: boolean | ((record: T) => boolean);
  hidden?: boolean | ((record: T) => boolean);

  icon?: React.ReactNode;
}

// 分页配置
export interface PaginationConfig extends PaginationProps {
  pageSizeOptions?: string[];
  defaultPageSize?: number;
  showQuickJumper?: boolean;
}

// 分页状态配置
export interface PaginationState {
  current?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
}

/** 单列过滤配置 */
export type ColumnFilterConfig<T = any> = {
  type: 'select';
  options: {
    label: React.ReactNode;
    value: any;
  }[];
  multiple?: boolean;
  allowClear?: boolean;
  onFilter?: (value: any, record: T) => boolean;
};

export type TableFilterConfig<T = any> = Partial<Record<keyof T | string, ColumnFilterConfig<T>>>;

// 表格基础配置
export interface BaseTableProps<T> extends Omit<TableProps<T>, 'pagination' | 'size'> {
  /** 批量操作配置 */
  batchActions?: BatchAction[];

  /** 行操作配置 */
  operations?: OperationAction<T>[];
  operationWidth?: number;

  /** 分页配置 */
  paginationConfig?: PaginationConfig;

  /** 是否显示分页 */
  showPagination?: boolean;

  /** 分页状态配置 */
  pagination?: PaginationState | boolean;

  /** 表格标题 */
  tableTitle?: React.ReactNode;

  /** 表格边框 */
  bordered?: boolean;

  /** 紧凑模式 */
  size?: 'default' | 'middle' | 'small';

  /** 空数据提示 */
  locale?: TableProps<T>['locale'];

  /** 已选择的项目数量提示文本 */
  selectedCountText?: (count: number) => string;

  filterConfig?: TableFilterConfig<T>;
}
