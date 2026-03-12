/**
 * 组织权限编码常量
 * 用于控制 UI 元素的访问权限
 */
export const PermissionCode = {
  /**
   * 组织管理
   */
  ORG_MANAGE: 'ORG_MANAGE',

  /**
   * 组织列表
   */
  ORG_LIST: 'ORG_LIST',

  /**
   * 新建子组织
   */
  ORG_CREATE_SUB: 'ORG_CREATE_SUB',

  /**
   * 新建非直属子组织
   */
  ORG_CREATE_NON_DIRECT: 'ORG_CREATE_NON_DIRECT',

  /**
   * 删除本组织
   */
  ORG_DELETE_SELF: 'ORG_DELETE_SELF',

  /**
   * 删除子组织
   */
  ORG_DELETE_SUB: 'ORG_DELETE_SUB',

  /**
   * 组织详情
   */
  ORG_DETAIL: 'ORG_DETAIL',

  /**
   * 编辑组织
   */
  ORG_EDIT: 'ORG_EDIT',

  /**
   * 角色列表
   */
  ORG_ROLE_LIST: 'ORG_ROLE_LIST',

  /**
   * 查看角色
   */
  ORG_ROLE_VIEW: 'ORG_ROLE_VIEW',

  /**
   * 新增角色
   */
  ORG_ROLE_CREATE: 'ORG_ROLE_CREATE',

  /**
   * 编辑角色
   */
  ORG_ROLE_EDIT: 'ORG_ROLE_EDIT',

  /**
   * 删除角色
   */
  ORG_ROLE_DELETE: 'ORG_ROLE_DELETE',

  /**
   * 成员列表
   */
  MEMBER_LIST: 'MEMBER_LIST',

  /**
   * 查看成员
   */
  MEMBER_VIEW: 'MEMBER_VIEW',

  /**
   * 新增成员
   */
  MEMBER_CREATE: 'MEMBER_CREATE',

  /**
   * 编辑成员
   */
  MEMBER_EDIT: 'MEMBER_EDIT',

  /**
   * 禁用成员
   */
  MEMBER_DISABLE: 'MEMBER_DISABLE',

  /**
   * 启用成员
   */
  MEMBER_ENABLE: 'MEMBER_ENABLE',

  /**
   * 通过申请
   */
  MEMBER_APPROVE: 'MEMBER_APPROVE',

  /**
   * 拒绝申请
   */
  MEMBER_REJECT: 'MEMBER_REJECT',

  /**
   * 删除成员
   */
  MEMBER_DELETE: 'MEMBER_DELETE',

  /**
   * 组织类型
   */
  ORG_TYPE_CFG: 'ORG_TYPE_CFG',

  /**
   * 查看组织类型
   */
  ORG_TYPE_VIEW: 'ORG_TYPE_VIEW',

  /**
   * 编辑组织类型
   */
  ORG_TYPE_EDIT: 'ORG_TYPE_EDIT',

  /**
   * 组织类型-BD
   */
  ORG_TYPE_BD: 'ORG_TYPE_BD',

  /**
   * 组织类型-Guest
   */
  ORG_TYPE_GUEST: 'ORG_TYPE_GUEST',

  /**
   * 组织类型-Dealer
   */
  ORG_TYPE_DEALER: 'ORG_TYPE_DEALER',

  /**
   * 组织类型-Installer
   */
  ORG_TYPE_INSTALLER: 'ORG_TYPE_INSTALLER',

  /**
   * 组织类型-Owner
   */
  ORG_TYPE_OWNER: 'ORG_TYPE_OWNER',

  /**
   * 角色管理
   */
  ROLE_MANAGE: 'ROLE_MANAGE',

  /**
   * 角色列表
   */
  SYS_ROLE_LIST: 'SYS_ROLE_LIST',

  /**
   * 查看角色
   */
  SYS_ROLE_VIEW: 'SYS_ROLE_VIEW',

  /**
   * 新增系统预设角色
   */
  SYS_ROLE_CREATE: 'SYS_ROLE_CREATE',

  /**
   * 编辑角色
   */
  SYS_ROLE_EDIT: 'SYS_ROLE_EDIT',

  /**
   * 删除角色
   */
  SYS_ROLE_DELETE: 'SYS_ROLE_DELETE',

  /**
   * 用户管理
   */
  USER_MANAGE: 'USER_MANAGE',

  /**
   * 查看用户
   */
  USER_VIEW: 'USER_VIEW',

  /**
   * 新增用户（访客）
   */
  USER_CREATE_VISITOR: 'USER_CREATE_VISITOR',

  /**
   * 编辑用户（访客）
   */
  USER_EDIT_VISITOR: 'USER_EDIT_VISITOR',

  /**
   * 禁用用户
   */
  USER_DISABLE: 'USER_DISABLE',

  /**
   * 启用用户
   */
  USER_ENABLE: 'USER_ENABLE',

  /**
   * 删除用户
   */
  USER_DELETE: 'USER_DELETE',

  /**
   * 重置密码
   */
  USER_RESET_PWD: 'USER_RESET_PWD',
} as const;
