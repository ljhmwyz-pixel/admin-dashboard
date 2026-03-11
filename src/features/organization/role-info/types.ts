export interface RoleRecord {
  key: string | number;
  no: number;
  roleName: string;
  platform: {
    app?: boolean;
    web?: boolean;
  };
  members: number;
  status: 'Normal' | 'Deleted';
  description: string;
}

export type StatusFilter = 'all' | 'normal' | 'deleted';

export interface PlatformFilter {
  app?: boolean;
  web?: boolean;
}

export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}
