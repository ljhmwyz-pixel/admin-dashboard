import { apiClient } from '@/services/api/client';
import { ORG_ROLE_ENDPOINTS } from '@/services/api/endpoints';

/**
 * 通用返回接口
 */
export interface CommonRes<T = unknown> {
  /** 响应码 */
  code: number;
  /** 错误响应码 */
  errorCode?: string;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T;
  /**
   * 响应时间戳
   */
  timestamp?: string;
  traceId?: string;
  /** 允许扩展其他字段 */
  [key: string]: any;
}
/** ==============================================组织角色列表-start============================================== */
/** 获取组织角色列表请求参数 */
export interface GetOrgRoleListReq {
  /** 页码 */
  pageNum?: number;

  /** 每页大小 */
  pageSize?: number;

  /** 组织ID */
  orgId?: string;

  /** 关键词（角色名称）*/
  keyword?: string;
  /**
   * 平台筛选
   */
  platform?: ('APP' | 'WEB')[];

  /** 排序字段 */
  sortBy?: 'name' | 'createdAt';

  /** 排序顺序 */
  sortOrder?: 'asc' | 'desc';
  /**
   * 状态筛选
   */
  status?: string;

  [key: string]: any;
}

/**
 * API返回的组织角色数据结构
 */
export interface GetOrgRoleDTO {
  /** 角色ID */
  roleId?: string;

  /** 组织ID */
  orgId?: string;

  /** 角色名称 */
  roleName?: string;

  /** 角色描述 */
  description?: string;

  /** 角色状态（Normal=正常, Disabled=禁用） */
  status?: string;

  /** 成员数量 */
  memberCount?: number;

  /** 权限数量 */
  permissionCount?: number;

  /** 创建时间 */
  createTime?: string;

  /** 允许扩展其他字段 */
  [key: string]: any;
}

export interface OrgRoleListResOrders {
  asc?: boolean;
  column?: string;
  [key: string]: any;
}

/**
 * 组织列表响应数据类型
 */
export type GetOrgRoleListRes = CommonRes<{
  /** 组织记录列表 */
  records: GetOrgRoleDTO[];
  /** 总记录数 */
  total: number;
  /** 每页大小 */
  size: number;
  /** 当前页码 */
  current: number;
  /** orders */
  orders: OrgRoleListResOrders[];
  /** optimizeCountSql */
  optimizeCountSql?: boolean;
  /** searchCount */
  searchCount?: boolean;
  /** optimizeJoinOfCountSql */
  optimizeJoinOfCountSql?: boolean;
  /** maxLimit */
  maxLimit?: number;
  /** countId */
  countId?: string;
}>;
/** ==============================================组织角色列表-end============================================== */
/** ==============================================组织角色新增-start============================================== */
/**
 * 新增组织角色列表请求参数
 */
export interface CreateOrgRoleReq {
  description?: string;
  /**
   * 组织ID
   */
  orgId: string;
  /**
   * 权限Ids
   */
  permissionIds?: string[];
  /**
   * 角色名称
   */
  roleName: string;
  [key: string]: any;
}
/**
 * 组织列表响应数据类型
 */
export type CreateOrgRoleRes = CommonRes<{
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 角色描述
   */
  description?: string;
  /**
   * 成员数量
   */
  memberCount?: number;
  /**
   * 组织ID
   */
  orgId?: string;
  /**
   * 组织名称
   */
  orgName?: string;
  /**
   * 权限Ids
   */
  permissions?: string[];
  /**
   * 角色ID
   */
  roleId?: string;
  /**
   * 角色名称
   */
  roleName?: string;
  /**
   * 角色状态（Normal=正常, Disabled=禁用）
   */
  status?: string;
  /**
   * 更新时间
   */
  updateTime?: string;
  [key: string]: any;
}>;
/** ==============================================组织角色新增-end============================================== */
/** ==============================================组织角色删除-start============================================== */
/**
 * 组织详情请求参数
 */
export interface DeleteOrgRoleReq {
  /**
   * 角色ID
   */
  roleId: string;
  [key: string]: any;
}
/**
 * 组织角色响应数据
 */
export type DeleteOrgRoleRes = CommonRes<{
  [key: string]: any;
}>;
/** ==============================================组织角色删除-end============================================== */
/** ==============================================组织角色详情-start============================================== */
/**
 * 组织详情请求参数
 */
export interface GetOrgRoleDetailReq {
  /**
   * 角色ID
   */
  roleId: string;
  [key: string]: any;
}
/**
 * 组织角色响应数据
 */
export type GetOrgRoleDetailRes = CommonRes<{
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 角色描述
   */
  description?: string;
  /**
   * 成员数量
   */
  memberCount?: number;
  /**
   * 组织ID
   */
  orgId?: string;
  /**
   * 组织名称
   */
  orgName?: string;
  /**
   * 角色权限
   */
  permissions?: string[];
  /**
   * 角色ID
   */
  roleId?: string;
  /**
   * 角色名称
   */
  roleName?: string;
  /**
   * 角色状态（Normal=正常, Disabled=禁用）
   */
  status?: string;
  /**
   * 更新时间
   */
  updateTime?: string;
  [key: string]: any;
}>;
/** ==============================================组织角色详情-end============================================== */
/** ==============================================组织角色权限查询-start============================================== */
/**
 * 新增组织角色列表请求参数
 */
export interface GetOrgRolePermissionReq {
  /**
   * 角色ID
   */
  roleId?: string;
  [key: string]: any;
}
/**
 * 组织列表响应数据类型
 */
export type GetOrgRolePermissionRes = CommonRes<{
  /**
   * 数据权限分类
   */
  dataPermissions?: DataPermissionCategory[];
  /**
   * 数据权限范围
   */
  dataScope?: string;
  /**
   * 数据权限描述
   */
  dataScopeDescription?: string;
  /**
   * 组织类型编码
   */
  orgTypeCode?: string;
  /**
   * 角色ID
   */
  roleId?: string;
  /**
   * 角色名称
   */
  roleName?: string;
  /**
   * 角色类型
   */
  roleType?: string;
  [key: string]: any;
}>;
/**
 * DataPermissionCategory
 */
export interface DataPermissionCategory {
  /**
   * 分类编码
   */
  category?: string;
  /**
   * 分类名称
   */
  categoryName?: string;
  /**
   * 分类项
   */
  items?: DataPermissionItem[];
  [key: string]: any;
}

/**
 * DataPermissionItem
 */
export interface DataPermissionItem {
  /**
   * 数据权限编码
   */
  dataPermissionCode?: string;
  /**
   * 数据权限名称
   */
  dataPermissionName?: string;
  /**
   * 组织类型天花板
   */
  orgTypeCeiling?: ScopeLevels;
  /**
   * 角色当前级别
   */
  roleLevel?: ScopeLevels;
  [key: string]: any;
}
/**
 * ScopeLevels
 * 角色当前级别
 */
export interface ScopeLevels {
  /**
   * 直属下级组织
   */
  directChild?: string;
  /**
   * 非直属下级组织
   */
  nonDirectChild?: string;
  /**
   * 本组织
   */
  self?: string;
  [key: string]: any;
}
/** ==============================================组织角色权限查询-end============================================== */
/**
 * 组织角色管理 API 接口定义
 */
export interface OrgRoleService {
  /** 获取组织角色列表 */
  getOrgRoleList: (params?: GetOrgRoleListReq) => Promise<GetOrgRoleListRes>;
  /** 新增组织角色 */
  createOrgRole: (params?: CreateOrgRoleReq) => Promise<CreateOrgRoleRes>;
  /** 获取组织角色权限 */
  getOrgRolePermission: (params: GetOrgRolePermissionReq) => Promise<GetOrgRolePermissionRes>;
  /** 获取组织角色详情 */
  getOrgRoleDetail: (params: GetOrgRoleDetailReq) => Promise<GetOrgRoleDetailRes>;
  /** 获取组织角色更新日志 */
  getOrgRoleLog: (params: DeleteOrgRoleReq) => Promise<DeleteOrgRoleRes>;
  /** 删除组织角色 */
  deleteOrgRole: (params: any) => Promise<any>;
}

/**
 * 组织角色管理 API 实现类
 */
class OrgRoleApiImpl implements OrgRoleService {
  /**
   * 获取组织角色列表
   * @param params - 查询参数（分页、搜索等）
   * @returns 组织角色列表数据
   */
  async getOrgRoleList(params?: GetOrgRoleListReq): Promise<GetOrgRoleListRes> {
    return apiClient.get(ORG_ROLE_ENDPOINTS.LIST, { params });
  }
  /**
   * 新增组织下的角色
   */
  async createOrgRole(data?: GetOrgRoleListReq): Promise<CreateOrgRoleRes> {
    return apiClient.post(ORG_ROLE_ENDPOINTS.CREATE, data);
  }

  /**
   * 获取组织角色权限
   */
  async getOrgRolePermission(params: GetOrgRolePermissionReq): Promise<GetOrgRolePermissionRes> {
    return apiClient.get(ORG_ROLE_ENDPOINTS.PERMISSIONS, { params });
  }

  /**
   * 获取组织角色详情
   */
  async getOrgRoleDetail(params: GetOrgRoleDetailReq): Promise<GetOrgRoleDetailRes> {
    return apiClient.get(ORG_ROLE_ENDPOINTS.DETAIL(params.roleId), { params });
  }

  /**
   * 获取组织角色更新日志
   */
  async getOrgRoleLog(params: any): Promise<any> {
    return apiClient.get(ORG_ROLE_ENDPOINTS.LOG(params.roleId), { params });
  }

  /**
   * 删除组织角色
   */
  async deleteOrgRole(params: DeleteOrgRoleReq): Promise<DeleteOrgRoleRes> {
    return apiClient.delete(ORG_ROLE_ENDPOINTS.DELETE(params.roleId), { params });
  }
}

// 创建组织 API 实例
export const OrgRoleApi = new OrgRoleApiImpl();

export default OrgRoleApi;
