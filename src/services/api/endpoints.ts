// API端点常量定义

// 认证相关
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  PROFILE: '/auth/profile',
} as const;

// 组织管理相关（符合需求文档规范）
export const ORGANIZATION_ENDPOINTS = {
  LIST: '/api/v1/organization/organizations',
  CREATE: '/api/v1/organization/organizations',
  VERIFY_EMAIL: '/api/v1/organization/organizations/verify-email',
  VERIFY: '/api/v1/organization/organizations/verify',

  DETAIL: (id: string | number) => `/api/v1/organization/organizations/${id}`,
  UPDATE: (id: string | number) => `/api/v1/organization/organizations/${id}`,
  DELETE: (id: string | number) => `/api/v1/organization/organizations/${id}`,
  TREE: '/api/v1/organization/organizations/tree',
  TYPES: '/api/v1/organization/organizations/types',
} as const;

// 用户管理相关
export const USER_ENDPOINTS = {
  LIST: '/users',
  DETAIL: (id: string | number) => `/users/${id}`,
  CREATE: '/users',
  UPDATE: (id: string | number) => `/users/${id}`,
  DELETE: (id: string | number) => `/users/${id}`,
  PROFILE: '/users/profile',
} as const;

// 仪表板相关
export const DASHBOARD_ENDPOINTS = {
  STATS: '/dashboard/stats',
  CHARTS: '/dashboard/charts',
  RECENT_ACTIVITY: '/dashboard/recent-activity',
} as const;

// 系统设置相关
export const SYSTEM_ENDPOINTS = {
  SETTINGS: '/system/settings',
  CONFIG: '/system/config',
  LOGS: '/system/logs',
} as const;

// 文件上传相关
export const UPLOAD_ENDPOINTS = {
  SINGLE: '/upload/single',
  MULTIPLE: '/upload/multiple',
  AVATAR: '/upload/avatar',
} as const;

// 导出所有端点
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  ORGANIZATION: ORGANIZATION_ENDPOINTS,
  USER: USER_ENDPOINTS,
  DASHBOARD: DASHBOARD_ENDPOINTS,
  SYSTEM: SYSTEM_ENDPOINTS,
  UPLOAD: UPLOAD_ENDPOINTS,
} as const;

export default API_ENDPOINTS;
