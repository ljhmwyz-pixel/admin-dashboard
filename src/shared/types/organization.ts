// 组织树相关类型定义

export type OrganizationType = 'PYLONTECH' | 'BD' | 'DEALER' | 'INSTALLER' | 'OWNER' | 'GUEST';

export interface TreeNodeData {
  key: string;
  title: string;
  children?: TreeNodeData[];
  type?: OrganizationType;
  canAdd?: boolean;
  canDelete?: boolean;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
  parentOrgId?: string | null;
  [key: string]: any; // 允许扩展其他字段
}

export interface OrganizationFormData {
  organizationName: string;
  organizationType: OrganizationType;
  organizationAddress?: string;
  postalCode?: string;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  description?: string;
}

// 组织树节点类型
export interface OrganizationTreeNode {
  key: string | number;
  title: string;
  value: string | number;
  children?: OrganizationTreeNode[];
}

// 请求参数类型（符合需求文档规范）
export interface OrganizationListParams {
  pageNum?: number; // 页码，默认1
  pageSize?: number; // 每页大小，默认10，最大100
  keyword?: string; // 组织名称关键词（模糊搜索）
  orgType?: OrganizationType; // 组织类型过滤
  status?: 'ACTIVE' | 'INACTIVE'; // 组织状态过滤
  sortBy?: 'name' | 'createdAt'; // 排序字段
  sortOrder?: 'asc' | 'desc'; // 排序顺序
}

// 响应数据类型（符合需求文档规范）
export interface OrganizationListResponse {
  code: number;
  msg: string;
  data: {
    records: ApiOrganization[];
    total: number;
    size: number;
    current: number;
    pages: number;
  };
  timestamp: string;
  traceId: string;
}

// API返回的组织数据结构（符合需求文档规范）
export interface ApiOrganization {
  orgId: string;
  orgName: string;
  orgType: OrganizationType;
  parentOrgId?: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// API 请求参数类型（符合需求文档规范）
export interface CreateOrganizationRequest {
  orgName: string; // 组织名称
  orgType: OrganizationType; // 组织类型
  parentOrgId?: string; // 父组织ID（创建子组织时必填）
  description?: string; // 组织描述
  countryCode?: string; // 国家代码（仅 BD 类型组织必填）
  regionCode?: string; // 地区代码（仅 BD 类型组织必填）
}

export interface CreateOrganizationResponse {
  code: number;
  msg: string;
  data: ApiOrganization;
}

export interface VerifyOrganization {
  isOrganizationExists?: boolean;
  isOrganizationSimilar?: boolean;
  isPhoneExists?: boolean;
  isScope?: boolean;
  timestamp?: number;
}
export interface VerifyResponse {
  code: number;
  msg: string;
  data: VerifyOrganization;
}

export interface VerifyEmailRequest {
  email: string;
}

export interface VerifyEmailResponse {
  code: number;
  msg: string;
  data: {
    userExists: boolean;
    existingUsername: string;
    existingPhone: number;
  };
}
