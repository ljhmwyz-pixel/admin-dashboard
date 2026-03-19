import type {
  AddMemberData,
  AddMemberFormData,
  AddMemberRequest,
  AddMemberResponse,
  ListItem,
  Member,
  MemberDetail,
  MemberDetailResponse,
  MemberListParams,
  MemberListResponse,
  MemberUpdateRequest,
  MemberUpdateResponse,
  OrgTreeSelectorProps,
  PreviewMemberPermissionData,
  PreviewMemberPermissionRequest,
  PreviewMemberPermissionResponse,
  Record,
  RecordData,
  RecordListResponse,
  ReviewMemberApplicationResponse,
  Role,
  RoleDataList,
  RoleListResponse,
  SelectedListProps,
  TreeNode,
} from '@pages/organization/types/memberList';
import type { FormInstance } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';

/**
 * 组织类型枚举
 * - PYLONTECH: Pylontech 总部
 * - BD: 业务发展商
 * - DEALER: 经销商
 * - INSTALLER: 安装商
 * - OWNER: 所有者
 * - GUEST: 访客
 */
export type OrganizationType =
  | 'PYLONTECH'
  | 'BD'
  | 'DEALER'
  | 'INSTALLER'
  | 'OWNER'
  | 'GUEST'
  | 'INTERNAL';

/**
 * 组织树节点数据结构
 * 用于展示组织树形结构
 */
export interface TreeNodeData {
  /** 节点唯一标识 */
  key: string;
  /** 节点显示标题 */
  title: string;
  /** 子节点列表 */
  children?: TreeNodeData[];
  /** 组织类型 */
  type?: OrganizationType;
  /** 是否可以添加子节点 */
  canAdd?: boolean;
  /** 是否可以删除 */
  canDelete?: boolean;
  /** 组织描述 */
  description?: string;
  /** 组织状态 */
  status?: 'ACTIVE' | 'INACTIVE';
  /** 创建时间 */
  createdAt?: string;
  /** 更新时间 */
  updatedAt?: string;
  /** 父级组织ID */
  parentOrgId?: string | null;
  /** 权限列表 */
  permissions?: string[];
  /** 允许扩展其他字段 */
  [key: string]: any;
}

/**
 * 组织表单数据结构
 * 用于创建/编辑组织时的表单数据
 */
export interface OrganizationFormData {
  /** 组织名称 */
  organizationName: string;
  /** 组织类型 */
  organizationType: OrganizationType;
  /** 组织地址 */
  organizationAddress?: string;
  /** 邮政编码 */
  postalCode?: string;
  /** 联系人 */
  contactPerson?: string;
  /** 电话号码 */
  phoneNumber?: string;
  /** 邮箱 */
  email?: string;
  /** 描述 */
  description?: string;
}

/**
 * 组织树节点类型
 * 用于下拉选择等场景
 */
export interface OrganizationTreeNode {
  /** 节点唯一标识 */
  key: string | number;
  /** 节点显示标题 */
  title: string;
  /** 节点值 */
  value: string | number;
  /** 子节点列表 */
  children?: OrganizationTreeNode[];
}

/**
 * 组织列表请求参数类型
 * 符合需求文档规范
 */
export interface OrganizationListParams {
  /** 页码，默认1 */
  pageNum?: number;
  /** 每页大小，默认10，最大100 */
  pageSize?: number;
  /** 组织名称关键词（模糊搜索） */
  keyword?: string;
  /** 组织类型过滤 */
  orgType?: OrganizationType;
  /** 组织状态过滤 */
  status?: 'ACTIVE' | 'INACTIVE';
  /** 排序字段 */
  sortBy?: 'name' | 'createdAt';
  /** 排序顺序 */
  sortOrder?: 'asc' | 'desc';
}

/**
 * 组织列表响应数据类型
 * 符合需求文档规范
 */
export interface OrganizationListResponse {
  /** 响应码 */
  code: number;
  /** 响应消息 */
  msg: string;
  /** 响应数据 */
  data: {
    /** 组织记录列表 */
    records: ApiOrganization[];
    /** 总记录数 */
    total: number;
    /** 每页大小 */
    size: number;
    /** 当前页码 */
    current: number;
    /** 总页数 */
    pages: number;
  };
  /** 允许扩展其他字段 */
  [key: string]: any;
}

/**
 * API返回的组织数据结构
 * 符合需求文档规范
 */
export interface ApiOrganization {
  /** 组织ID */
  orgId: string;
  /** 组织名称 */
  orgName: string;
  /** 组织类型 */
  orgType: OrganizationType;
  /** 父级组织ID */
  parentOrgId?: string | null;
  /** 组织状态 */
  status: 'ACTIVE' | 'INACTIVE';
  /** 组织描述 */
  description?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 权限列表 */
  permissions?: string[];
  /** 允许扩展其他字段 */
  [key: string]: any;
}

/**
 * 创建组织请求参数类型
 * 符合需求文档规范
 */
export interface CreateOrganizationRequest {
  /** 组织名称 */
  orgName: string;
  /** 组织类型 */
  orgType: OrganizationType;
  /** 父级组织ID */
  parentOrgId?: string;
  /** 备注 */
  remark?: string;
  /** 描述 */
  description?: string;
  /** 国家代码 */
  countryCode?: string;
  /** 地区代码 */
  regionCode?: string;
  /** 邮政编码 */
  zipCode?: string;
  /** 所有者邮箱 */
  ownerEmail?: string;
  /** 所有者用户名 */
  ownerUserName?: string;
  /** 所有者电话 */
  ownerPhone?: string;
  /** 地址 */
  address?: string;
  /** 纬度 */
  latitude?: number;
  /** 经度 */
  longitude?: number;
  /** BD国家范围 */
  bdCountryScopes?: string;
  /** 联系人 */
  contactPerson?: string;
  /** 联系电话 */
  contactPhone?: string;
  /** 联系邮箱 */
  contactEmail?: string;
  /** 组织ID（更新时使用） */
  orgId?: string;
}

/**
 * 创建组织响应数据类型
 */
export interface CreateOrganizationResponse {
  /** 响应码 */
  code: number;
  /** 响应消息 */
  msg: string;
  /** 组织数据 */
  data: ApiOrganization;
}

/**
 * 组织验证结果数据结构
 */
export interface VerifyOrganization {
  /** 是否验证通过 */
  valid: boolean;
  /** 组织是否已存在 */
  isOrganizationExists?: boolean;
  /** 是否存在相似组织 */
  isOrganizationSimilar?: boolean;
  /** 电话是否已存在 */
  isPhoneExists?: boolean;
  /** 国家是否在范围内 */
  isCountryInScope: boolean;
  /** 所有者类型是否有效 */
  isOwnerTypeValid: boolean;
  /** 组织类型是否允许 */
  isOrgTypeAllowed: boolean;
  /** BD范围是否可用 */
  isBdScopesAvailable: boolean;
  failReasons?: string[];
  timestamp?: number;
  /** 允许扩展其他字段 */
  [key: string]: any;
}

/**
 * 组织验证响应数据类型
 */
export interface VerifyResponse {
  /** 响应码 */
  code: number;
  /** 响应消息 */
  msg: string;
  /** 验证结果数据 */
  data: VerifyOrganization;
}

/**
 * 删除组织响应数据类型
 */
export interface DeleteResponse {
  /** 响应码 */
  code: number;
  /** 响应消息 */
  msg: string;
  /** 时间戳 */
  timestamp: string;
  /** 允许扩展其他字段 */
  [key: string]: any;
}

/**
 * 删除验证结果数据结构
 */
export interface VerifyDelete {
  /** 组织是否未找到 */
  organizationNotFound: boolean;
  /** 是否存在子组织 */
  childOrganizationsExist: boolean;
  /** 子组织数量 */
  childOrganizationCount: number;
  /** 是否可以删除 */
  valid: boolean;
}

/**
 * 删除验证响应数据类型
 */
export interface VerifyDeleteResponse {
  /** 响应码 */
  code: number;
  /** 响应消息 */
  msg: string;
  /** 删除验证结果数据 */
  data: VerifyDelete;
  /** 允许扩展其他字段 */
  [key: string]: any;
}

/**
 * 验证邮箱请求参数类型
 */
export interface VerifyEmailRequest {
  /** 邮箱地址 */
  email: string;
}

/**
 * 验证邮箱结果数据结构
 */
export interface VerifyEmail {
  /** 用户是否存在 */
  exists: boolean;
  /** 用户名 */
  username: string;
  /** 电话 */
  phone: string;
  /** 用户类型 */
  userType?: OrganizationType;
  /** 允许扩展其他字段 */
  [key: string]: any;
}

/**
 * 验证邮箱响应数据类型
 */
export interface VerifyEmailResponse {
  /** 响应码 */
  code: number;
  /** 响应消息 */
  msg: string;
  /** 验证邮箱结果数据 */
  data: VerifyEmail;
}

/**
 * 地图位置点数据结构
 */
export interface LocationPoint {
  /** 纬度 */
  lat: number;
  /** 经度 */
  lng: number;
}

/**
 * 地址数据结构
 * 用于存储完整的地址信息
 */
export interface AddressData {
  /** 显示文本 */
  displayText: string;
  /** 纬度 */
  lat: number | null;
  /** 经度 */
  lng: number | null;
  /** 国家 */
  country: string;
  /** 国家代码 */
  countryCode: string;
  /** 省/州 */
  state: string;
  /** 城市 */
  city: string;
  /** 区/县 */
  district: string;
  /** 街道 */
  street: string;
  /** 门牌号 */
  streetNumber: string;
  /** 邮政编码 */
  postalCode: string;
  /** 原始元数据 */
  rawMeta: any | null;
}

/**
 * 位置信息类型
 * 用于存储位置的详细信息
 */
export type LocationInfo = {
  /** 原始地址 */
  rawAddress: string;
  /** 显示地址 */
  displayAddress: string;
  /** 纬度 */
  lat: number;
  /** 经度 */
  lng: number;
  /** 国家 */
  country?: string;
  /** 国家代码 */
  countryCode?: string;
  /** 省/州 */
  province?: string;
  /** 城市 */
  city?: string;
  /** 区/县 */
  district?: string;
  /** 邮政编码 */
  postalCode?: string;
  /** 路线/街道 */
  route?: string;
  /** 门牌号 */
  streetNumber?: string;
  /** 地点ID */
  placeId?: string;
  /** 原始数据 */
  raw?: unknown;
};

/**
 * 字段映射类型
 * 用于配置地址字段与表单字段的映射关系
 */
export type FieldMap = {
  /** 地址字段名 */
  address: string;
  /** 纬度字段名 */
  lat?: string;
  /** 经度字段名 */
  lng?: string;
  /** 国家字段名 */
  country?: string;
  /** 国家代码字段名 */
  countryCode?: string;
  /** 省/州字段名 */
  province?: string;
  /** 城市字段名 */
  city?: string;
  /** 区/县字段名 */
  district?: string;
  /** 邮政编码字段名 */
  postalCode?: string;
  /** 路线/街道字段名 */
  route?: string;
  /** 门牌号字段名 */
  streetNumber?: string;
};

/**
 * Google 地点预测数据结构
 */
export type GooglePrediction = {
  /** 文本信息 */
  text?: { text?: string };
  /** 主要文本 */
  mainText?: { text?: string };
  /** 次要文本 */
  secondaryText?: { text?: string };
  /** 转换为地点的方法 */
  toPlace?: () => {
    /** 格式化地址 */
    formattedAddress?: string;
    /** 地址组件 */
    addressComponents?: GooglePlaceAddressComponent[];
    /** 位置坐标 */
    location?: google.maps.LatLng | google.maps.LatLngLiteral;
    /** 地点ID */
    id?: string;
    /** 获取字段方法 */
    fetchFields: (params: {
      fields: Array<'formattedAddress' | 'location' | 'addressComponents' | 'id'>;
    }) => Promise<void>;
  };
};

/**
 * Google 建议项数据结构
 */
export type GoogleSuggestionItem = {
  /** 地点预测数据 */
  placePrediction?: GooglePrediction;
};

/**
 * Google 地点地址组件数据结构
 */
export type GooglePlaceAddressComponent = {
  /** 类型列表 */
  types?: string[];
  /** 长文本 */
  longText?: string;
  /** 短文本 */
  shortText?: string;
};

/**
 * Google 选项类型
 * 扩展 antd 默认选项类型
 */
export type GoogleOption = DefaultOptionType & {
  /** 原始建议数据 */
  rawSuggestion?: GoogleSuggestionItem;
};

/**
 * 搜索范围类型
 * - main: 主搜索
 * - popup: 弹窗搜索
 */
export type SearchScope = 'main' | 'popup';

/**
 * 基础位置信息类型
 * 排除显示地址字段
 */
export type BaseLocationInfo = Omit<LocationInfo, 'displayAddress'>;

/**
 * 字段属性接口
 * 用于表单字段组件
 */
export interface FieldProps {
  /** 表单实例 */
  form: FormInstance;
}

/**
 * 角色记录数据结构
 * 用于角色列表展示
 */
export interface RoleRecord {
  /** 记录唯一标识 */
  key: string | number;
  /** 序号 */
  no: number;
  /** 角色名称 */
  roleName: string;
  /** 平台信息 */
  platform: {
    /** 是否支持 App */
    app?: boolean;
    /** 是否支持 Web */
    web?: boolean;
  };
  /** 成员数量 */
  members: number;
  /** 角色状态 */
  status: 'Normal' | 'Deleted';
  /** 角色描述 */
  description: string;
}

/**
 * 状态筛选类型
 */
export type StatusFilter = 'All' | 'Normal' | 'Disabled';

/**
 * 平台筛选接口
 */
export interface PlatformFilter {
  /** 是否筛选 App */
  app?: boolean;
  /** 是否筛选 Web */
  web?: boolean;
}

/**
 * 分页接口
 */
export interface Pagination {
  /** 当前页码 */
  current: number;
  /** 每页大小 */
  pageSize: number;
  /** 总记录数 */
  total: number;
}

/**
 * 组织成员数据结构
 * 用于展示组织成员列表
 */
export type {
  AddMemberData,
  AddMemberFormData,
  AddMemberRequest,
  AddMemberResponse,
  ListItem,
  Member,
  MemberDetail,
  MemberDetailResponse,
  MemberListParams,
  MemberListResponse,
  MemberUpdateRequest,
  MemberUpdateResponse,
  OrgTreeSelectorProps,
  PreviewMemberPermissionData,
  PreviewMemberPermissionRequest,
  PreviewMemberPermissionResponse,
  Record,
  RecordData,
  RecordListResponse,
  ReviewMemberApplicationResponse,
  Role,
  RoleDataList,
  RoleListResponse,
  SelectedListProps,
  TreeNode,
};
