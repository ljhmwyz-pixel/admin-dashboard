// 组织类型相关类型
export interface OrganizationTypeItem {
  typeCode: string; // 组织类型编码（唯一标识）
  typeName: string; // 组织类型名称
  typeLevel: number; // 组织级别（0=顶级）
  canRegister: number; // 是否可注册（0=否，1=是）
  description: string; // 类型描述
  organizationCount: number; // 关联组织数量
  coverImage: string; // 组织类型封面图
}

/**
 * 组织类型列表响应体
 */
export interface OrganizationTypeListResponse {
  code: number;
  data: OrganizationTypeItem[];
  timestamp: Date; // 响应时间
}
