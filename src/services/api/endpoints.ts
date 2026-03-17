// API端点常量定义

// 认证相关
export const AUTH_ENDPOINTS = {
  /** 用户登录 */
  LOGIN: '/auth/login',
  /** 用户登出 */
  LOGOUT: '/auth/logout',
  /** 刷新令牌 */
  REFRESH: '/auth/refresh',
  /** 获取用户信息 */
  PROFILE: '/auth/profile',
} as const;

// 组织管理相关（符合需求文档规范）
export const ORGANIZATION_ENDPOINTS = {
  /** 获取组织列表 */
  LIST: '/api/v1/organization/organizations',
  /** 创建组织 */
  CREATE: '/api/v1/organization/organizations',
  /** 更新组织信息 */
  UPDATE: (orgId: string) => `/api/v1/organization/organizations/${orgId}`,
  /** 获取组织详情 */
  DETAIL: (orgId: string) => `/api/v1/organization/organizations/${orgId}`,
  /** 获取组织成员列表 */
  MEMBERS: '/api/v1/organization/members',
  /** 获取组织成员详情 */
  MEMBER_DETAIL: (memberId: string) => `/api/v1/organization/members/${memberId}`,
  /** 更新组织成员信息 */
  MEMBER_UPDATE: (memberId: string) => `/api/v1/organization/members/${memberId}`,
  /** 验证邮箱是否存在 */
  VERIFY_EMAIL: ' /api/v1/organization/users/lookup-by-email',
  /** 验证组织信息（创建时） */
  VERIFY: '/api/v1/organization/organizations/validate',
  /** 验证组织信息（更新时） */
  VERIFY_UPDATE: (orgId: string) => `/api/v1/organization/organizations/${orgId}/validate-update`,
  /** 删除组织 */
  DELETE: (id: string | number) => `/api/v1/organization/organizations/${id}`,
  /** 验证删除组织 */
  VERIFY_DELETE: (id: string | number) =>
    `/api/v1/organization/organizations/${id}/validate-delete`,
  /** 获取组织类型列表 */
  ORGANIZATION_TYPES: '/api/v1/organization/organization-types',
} as const;

// 用户管理相关
export const USER_ENDPOINTS = {
  /** 获取用户列表 */
  LIST: '/users',
  /** 获取用户详情 */
  DETAIL: (id: string | number) => `/users/${id}`,
  /** 创建用户 */
  CREATE: '/users',
  /** 更新用户信息 */
  UPDATE: (id: string | number) => `/users/${id}`,
  /** 删除用户 */
  DELETE: (id: string | number) => `/users/${id}`,
  /** 获取当前用户信息 */
  PROFILE: '/users/profile',
} as const;

// 仪表板相关
export const DASHBOARD_ENDPOINTS = {
  /** 获取统计数据 */
  STATS: '/dashboard/stats',
  /** 获取图表数据 */
  CHARTS: '/dashboard/charts',
  /** 获取最近活动记录 */
  RECENT_ACTIVITY: '/dashboard/recent-activity',
} as const;

// 系统设置相关
export const SYSTEM_ENDPOINTS = {
  /** 获取系统设置 */
  SETTINGS: '/system/settings',
  /** 获取系统配置 */
  CONFIG: '/system/config',
  /** 获取系统日志 */
  LOGS: '/system/logs',
} as const;

// 文件上传相关
export const UPLOAD_ENDPOINTS = {
  /** 单文件上传 */
  SINGLE: '/upload/single',
  /** 多文件上传 */
  MULTIPLE: '/upload/multiple',
  /** 头像上传 */
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

// 组织管理角色相关（符合需求文档规范）
export const ORG_ROLE_ENDPOINTS = {
  /** 获取组织列表 */
  LIST: '/api/v1/organization/roles',
  CREATE: '/api/v1/organization/roles',
  DETAIL: (roleId: string) => `/api/v1/organization/roles/${roleId}`,
  DELETE: (roleId: string) => `/api/v1/organization/roles/${roleId}`,
  LOG: (roleId: string) => `/api/v1/xxx/xxx/${roleId}`,
  PERMISSIONS: (roleId: string) => `/api/v1/permission/roles/${roleId}/data-permissions`,
} as const;

export default API_ENDPOINTS;
