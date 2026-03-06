/**
 * 组织权限编码常量
 * 用于控制 UI 元素的访问权限
 */
export const OrganizationPermissions = {
  /** 组织列表页面访问权限 */
  ORG_LIST: 'ORG_LIST',

  /** "新增组织"按钮权限 */
  ORG_CREATE_SUB: 'ORG_CREATE_SUB',

  /** 组织名称可点击查看详情权限 */
  ORG_DETAIL: 'ORG_DETAIL',

  /** "编辑"按钮权限 */
  ORG_EDIT: 'ORG_EDIT',

  /** "删除"按钮权限（本组织） */
  ORG_DELETE_SELF: 'ORG_DELETE_SELF',

  /** "删除"按钮权限（子组织） */
  ORG_DELETE_SUB: 'ORG_DELETE_SUB',

  /** 角色管理 Tab 可见权限 */
  ORG_ROLE_LIST: 'ORG_ROLE_LIST',

  /** "新增角色"按钮权限 */
  ORG_ROLE_CREATE: 'ORG_ROLE_CREATE',

  /** 角色"编辑"按钮权限 */
  ORG_ROLE_EDIT: 'ORG_ROLE_EDIT',

  /** 角色"删除"按钮权限 */
  ORG_ROLE_DELETE: 'ORG_ROLE_DELETE',

  /** 组织类型权限配置页面访问权限 */
  ORG_TYPE_VIEW: 'ORG_TYPE_VIEW',

  /** 权限配置"编辑"按钮权限 */
  ORG_TYPE_EDIT: 'ORG_TYPE_EDIT',
} as const;

// 权限编码类型
export type OrganizationPermissionCode =
  (typeof OrganizationPermissions)[keyof typeof OrganizationPermissions];

// 权限描述映射
export const OrganizationPermissionDescriptions: Record<OrganizationPermissionCode, string> = {
  ORG_LIST: '组织列表页面访问权限',
  ORG_CREATE_SUB: '"新增组织"按钮权限',
  ORG_DETAIL: '组织名称可点击查看详情',
  ORG_EDIT: '"编辑"按钮权限',
  ORG_DELETE_SELF: '"删除"按钮权限（本组织）',
  ORG_DELETE_SUB: '"删除"按钮权限（子组织）',
  ORG_ROLE_LIST: '角色管理 Tab 可见权限',
  ORG_ROLE_CREATE: '"新增角色"按钮权限',
  ORG_ROLE_EDIT: '角色"编辑"按钮权限',
  ORG_ROLE_DELETE: '角色"删除"按钮权限',
  ORG_TYPE_VIEW: '组织类型权限配置页面访问权限',
  ORG_TYPE_EDIT: '权限配置"编辑"按钮权限',
};
