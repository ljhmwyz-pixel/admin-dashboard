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
  permissions?: string[];
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
  [key: string]: any; // 允许扩展其他字段
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
  permissions?: string[];
  [key: string]: any; // 允许扩展其他字段
}

// API 请求参数类型（符合需求文档规范）
export interface CreateOrganizationRequest {
  orgName: string;
  orgType: OrganizationType;
  parentOrgId?: string;
  remark?: string;
  description?: string;
  countryCode?: string;
  regionCode?: string;
  zipCode?: string;
  ownerEmail?: string;
  ownerUserName?: string;
  ownerPhone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  bdCountryScopes?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  orgId: string;
}

export interface CreateOrganizationResponse {
  code: number;
  msg: string;
  data: ApiOrganization;
}

export interface VerifyOrganization {
  valid: boolean;
  isOrganizationExists?: boolean;
  isOrganizationSimilar?: boolean;
  isPhoneExists?: boolean;
  isCountryInScope: boolean;
  isOwnerTypeValid: boolean;
  isOrgTypeAllowed: boolean;
  isBdScopesAvailable: boolean;
  timestamp?: number;
  [key: string]: any; // 允许扩展其他字段
}
export interface VerifyResponse {
  code: number;
  msg: string;
  data: VerifyOrganization;
}

export interface DeleteResponse {
  code: number;
  msg: string;
  timestamp: string;
  [key: string]: any; // 允许扩展其他字段
}

export interface VerifyDelete {
  organizationNotFound: boolean;
  childOrganizationsExist: boolean;
  childOrganizationCount: number;
  valid: boolean;
}

export interface VerifyDeleteResponse {
  code: number;
  msg: string;
  data: VerifyDelete;
  [key: string]: any; // 允许扩展其他字段
}

export interface VerifyEmailRequest {
  email: string;
}

export interface VerifyEmail {
  exists: boolean;
  username: string;
  phone: string;
  userType: string;
  [key: string]: any; // 允许扩展其他字段
}

export interface VerifyEmailResponse {
  code: number;
  msg: string;
  data: VerifyEmail;
}

// 地图地址相关类型
export interface LocationPoint {
  lat: number;
  lng: number;
}

export interface AddressData {
  displayText: string;
  lat: number | null;
  lng: number | null;
  country: string;
  countryCode: string;
  state: string;
  city: string;
  district: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  rawMeta: any | null;
}
