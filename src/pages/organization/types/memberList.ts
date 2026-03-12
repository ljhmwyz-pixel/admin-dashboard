/**
 * 组织成员列表数据结构
 * 用于展示组织成员列表
 */
export interface Member {
  /** 成员ID */
  memberId: string;
  /** 组织ID */
  orgId: string;
  /** 组织名称 */
  orgName: string;
  /** 用户ID */
  userId: string;
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 角色ID */
  roleId: string;
  /** 角色名称 */
  roleName: string;
  /** 成员状态 */
  status: string;
  /** 加入时间 */
  joinedAt: string;
  /** 申请ID */
  applicationId: string | null;
}

/**
 * 组织成员详情数据结构
 * 用于展示组织成员详细信息
 */
export interface MemberDetail {
  /** 成员ID */
  memberId: string;
  /** 组织ID */
  orgId: string;
  /** 组织名称 */
  orgName: string;
  /** 用户ID */
  userId: string;
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 电话 */
  phone: string;
  /** 用户类型 */
  userType: string;
  /** 角色ID */
  roleId: string;
  /** 角色名称 */
  roleName: string;
  /** 成员状态 */
  status: string;
  /** 加入时间 */
  joinedAt: string;
  /** 申请ID */
  applicationId: string | null;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
}

/**
 * 组织成员详情响应数据类型
 * 用于返回组织成员详情查询结果
 */
export interface MemberDetailResponse {
  /** 响应码 */
  code: number;
  /** 响应数据 */
  data: MemberDetail;
  /** 时间戳 */
  timestamp: string;
}

/**
 * 组织成员列表请求参数类型
 * 用于查询组织成员列表
 */
export interface MemberListParams {
  /** 页码 */
  pageNum: number;
  /** 每页大小 */
  pageSize: number;
  /** 搜索关键词 */
  keyword: string;
  /** 成员状态筛选 */
  status: string;
  /** 排序字段 */
  sortBy: string;
  /** 排序顺序 */
  sortOrder: string;
  /** 组织ID（必填） */
  orgId: string;
}

/**
 * 组织成员列表响应数据类型
 * 用于返回组织成员列表查询结果
 */
export interface MemberListResponse {
  /** 响应码 */
  code: number;
  /** 响应数据 */
  data: {
    /** 成员记录列表 */
    records: Member[];
    /** 总记录数 */
    total: number;
    /** 当前页码 */
    current: number;
    /** 每页大小 */
    size: number;
    /** 总页数 */
    totalPages: number;
  };
  /** 时间戳 */
  timestamp: string;
}

/**
 * 组织成员更新响应数据类型
 * 用于返回组织成员更新结果
 */
export interface MemberUpdateResponse {
  code: number;
  message: string;
  timestamp: string;
}

/**
 * 组织成员更新请求参数类型
 * 用于提交组织成员更新请求
 */
export interface MemberUpdateRequest {
  memberId: string;
  data: {
    status: string;
    roleId: string;
  };
}
