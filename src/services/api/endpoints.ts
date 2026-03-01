// API端点常量定义

// 认证相关
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  PROFILE: '/auth/profile',
} as const;

// 组织管理相关
export const ORGANIZATION_ENDPOINTS = {
  LIST: '/organizations',
  DETAIL: (id: string | number) => `/organizations/${id}`,
  CREATE: '/organizations',
  UPDATE: (id: string | number) => `/organizations/${id}`,
  DELETE: (id: string | number) => `/organizations/${id}`,
  TREE: '/organizations/tree',
  TYPES: '/organizations/types',
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
