// 组织类型
export interface OrganizationTypeItem {
  id: string; // 组织类型 ID（唯一标识）
  typeCode: string; // 组织类型编码（唯一标识）
  typeName: string; // 组织类型名称
  typeLevel: number; // 组织级别（0=顶级）
  canRegister: number; // 是否可注册（0=否，1=是）
  description: string; // 类型描述
  organizationCount: number; // 关联组织数量
  imageUrl: string; // 组织类型封面图
}

// 组织类型详情-权限项
export interface OrganizationTypePermissionItem {
  permissionId: string | null; // 权限 ID
  permissionCode: string; // 权限编码
  permissionName: string; // 权限名称
  parentPermissionCode: string | null; // 父权限编码（null 表示顶级）
  permissionLevel: number; // 权限层级（1/2/3）
  scopeLevels: {
    SELF: string; // 本组织访问级别：NO_ACCESS / OWNER_ONLY / ASSIGNABLE
    DIRECT_CHILD: string; // 直属下级访问级别：NO_ACCESS / OWNER_ONLY / ASSIGNABLE
    NON_DIRECT_CHILD: string; // 非直属下级访问级别：NO_ACCESS / OWNER_ONLY / ASSIGNABLE
  };
  children?: OrganizationTypePermissionItem[]; // 子权限项（递归）
}
// 数据权限项
export interface OrganizationTypeDataItem {
  dataPermissionCode: string; // 数据权限编码
  dataPermissionName: string; // 数据权限名称
  resourceType: string; // 资源类型：ORGANIZATION / MEMBER / STATION
  resourceTypeName: string; // 资源类型名称
  levels: {
    // 各范围的访问级别
    SELF: string; // 本组织：FULL / MASKED / HIDDEN
    DIRECT_CHILD: string; // 直属下级：FULL / MASKED / HIDDEN
    NON_DIRECT_CHILD: string; // 非直属下级：FULL / MASKED / HIDDEN
  };
}
// 变更记录项
export interface OrganizationTypeRecordItem {
  no: number; // 记录序号
  changeType: string; // 变更类型：UPDATE（变更）
  changedBy: string; // 变更者的 External UID
  changeContent: string; // 变更内容摘要，前缀 [P] 代表功能权限变更、[D] 代表数据权限变更
  changeTime: string; // 变更时间（格式：yyyy-MM-dd HH:mm:ss）
}

// 组织类型详情-权限项
export interface OrganizationTypePermissionItem {
  permissionId: string | null; // 权限 ID
  permissionCode: string; // 权限编码
  permissionName: string; // 权限名称
  parentPermissionCode: string | null; // 父权限编码（null 表示顶级）
  permissionLevel: number; // 权限层级（1/2/3）
  scopeLevels: {
    SELF: string; // 本组织访问级别：NO_ACCESS / OWNER_ONLY / ASSIGNABLE
    DIRECT_CHILD: string; // 直属下级访问级别：NO_ACCESS / OWNER_ONLY / ASSIGNABLE
    NON_DIRECT_CHILD: string; // 非直属下级访问级别：NO_ACCESS / OWNER_ONLY / ASSIGNABLE
  };
  children?: OrganizationTypePermissionItem[]; // 子权限项（递归）
}
// 数据权限项
export interface OrganizationTypeDataItem {
  dataPermissionCode: string; // 数据权限编码
  dataPermissionName: string; // 数据权限名称
  resourceType: string; // 资源类型：ORGANIZATION / MEMBER / STATION
  resourceTypeName: string; // 资源类型名称
  levels: {
    // 各范围的访问级别
    SELF: string; // 本组织：FULL / MASKED / HIDDEN
    DIRECT_CHILD: string; // 直属下级：FULL / MASKED / HIDDEN
    NON_DIRECT_CHILD: string; // 非直属下级：FULL / MASKED / HIDDEN
  };
}
// 变更记录项
export interface OrganizationTypeRecordItem {
  no: number; // 记录序号
  changeType: string; // 变更类型：UPDATE（变更）
  changedBy: string; // 变更者的 External UID
  changeContent: string; // 变更内容摘要，前缀 [P] 代表功能权限变更、[D] 代表数据权限变更
  changeTime: string; // 变更时间（格式：yyyy-MM-dd HH:mm:ss）
}

// 组织类型详情-权限项
export interface OrganizationTypePermissionItem {
  permissionId: string | null; // 权限 ID
  permissionCode: string; // 权限编码
  permissionName: string; // 权限名称
  parentPermissionCode: string | null; // 父权限编码（null 表示顶级）
  permissionLevel: number; // 权限层级（1/2/3）
  scopeLevels: {
    SELF: string; // 本组织访问级别：NO_ACCESS / OWNER_ONLY / ASSIGNABLE
    DIRECT_CHILD: string; // 直属下级访问级别：NO_ACCESS / OWNER_ONLY / ASSIGNABLE
    NON_DIRECT_CHILD: string; // 非直属下级访问级别：NO_ACCESS / OWNER_ONLY / ASSIGNABLE
  };
  children?: OrganizationTypePermissionItem[]; // 子权限项（递归）
}
// 数据权限项
export interface OrganizationTypeDataItem {
  dataPermissionCode: string; // 数据权限编码
  dataPermissionName: string; // 数据权限名称
  resourceType: string; // 资源类型：ORGANIZATION / MEMBER / STATION
  resourceTypeName: string; // 资源类型名称
  levels: {
    // 各范围的访问级别
    SELF: string; // 本组织：FULL / MASKED / HIDDEN
    DIRECT_CHILD: string; // 直属下级：FULL / MASKED / HIDDEN
    NON_DIRECT_CHILD: string; // 非直属下级：FULL / MASKED / HIDDEN
  };
}
// 变更记录项
export interface OrganizationTypeRecordItem {
  no: number; // 记录序号
  changeType: string; // 变更类型：UPDATE（变更）
  changedBy: string; // 变更者的 External UID
  changeContent: string; // 变更内容摘要，前缀 [P] 代表功能权限变更、[D] 代表数据权限变更
  changeTime: string; // 变更时间（格式：yyyy-MM-dd HH:mm:ss）
}

/**
 * 组织类型列表响应体
 */
export interface OrganizationTypeListResponse {
  code: number;
  data: OrganizationTypeItem[];
  timestamp: Date; // 响应时间
}
/**
 * 组织类型详情-功能响应体
 */
export interface OrganizationTypeDetailFunctionalResponse {
  code: number;
  data: OrganizationTypeItem & {
    functionalPermissions: OrganizationTypePermissionItem[]; // 功能权限列表
  };
  timestamp: Date; // 响应时间
}
/**
 * 组织类型详情-数据响应体
 */
export interface OrganizationTypeDetailDataResponse {
  code: number;
  data: OrganizationTypeItem & {
    records: OrganizationTypeDataItem[]; // 数据权限列表
    total: number; // 总记录数
    size: number; // 每页大小
    current: number; // 当前页码
    pages: number; // 总页数
  };
  timestamp: Date; // 响应时间
}

// 组织类型权限响应
export interface OrganizationTypePermissionResponse {
  code: number;
  data: {
    orgTypeCode: string; // 组织类型编码
    orgTypeName: string; // 组织类型名称
    functionalPermissions?: OrganizationTypePermissionItem[]; // 功能权限列表
    dataPermissions?: OrganizationTypeDataItem[]; // 数据权限列表
    timestamp: string; // 时间戳（格式：`yyyy-MM-ddTHH:mm:ss`）
  };
}
// 组织类型记录响应
export interface OrganizationTypeRecordResponse {
  code: number;
  data: {
    records: OrganizationTypeRecordItem[]; // 变更记录列表
    total: number; // 总记录数
    size: number; // 每页大小
    current: number; // 当前页码
    pages: number; // 总页数
  };
  timestamp: string; // 时间戳（格式：`yyyy-MM-ddTHH:mm:ss`）
}
