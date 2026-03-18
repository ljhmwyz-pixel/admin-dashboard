export interface Role {
  roleId: string;
  roleName: string;
}

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
  /** 组织类型 */
  orgType: string;
  /** 用户ID */
  userId: string;
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 角色列表 */
  roleList: Role[];
  /** 成员状态 */
  status: string;
  /** 加入时间 */
  joinedAt: string;
  /** 申请ID */
  applicationId: string | null;
  /** 是否是组织所有者 */
  isOwner: boolean;
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
  /** 用户唯一标识 */
  uid: string;
  /** 组织类型 */
  orgType: string;
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 电话 */
  phone: string;
  /** 用户类型 */
  userType: string;
  /** 角色列表 */
  roleList: Role[];
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
  /** 是否是组织所有者 */
  isOwner: boolean;
  /** 申请原因 */
  applyReason?: string;
  /** 拒绝原因 */
  rejectReason?: string;
  /** 审核人 */
  reviewedBy?: string;
  /** 预分配角色 */
  preAssignedRole?: string;
  permissions?: {
    module: string;
    permissionCode: string;
    permissionName: string;
  }[];
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
  message: string;
  success: boolean;
  traceId: string;
}

/**
 * 组织成员列表请求参数类型
 * 用于查询组织成员列表
 */
export interface MemberListParams {
  /** 页码 */
  pageNum?: number;
  /** 每页大小 */
  pageSize?: number;
  /** 搜索关键词 */
  keyword?: string;
  /** 成员状态筛选 */
  status?: string;
  /** 排序字段 */
  sortBy?: string;
  /** 排序顺序 */
  sortOrder?: string;
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

/**
 * 列表项数据类型
 */
export interface ListItem {
  /** 唯一标识 */
  key: string;
  /** 标题 */
  title: string;
  /** 是否为电站 */
  isPlant?: boolean;
  /** 额外数据 */
  [key: string]: any;
}

/**
 * SelectedList 组件属性接口
 */
export interface SelectedListProps {
  /** 列表标题 */
  title: string;
  /** 列表数据 */
  data: ListItem[];
  /** 选中的keys */
  selectedKeys: React.Key[];
  /** 选中变化回调 */
  onChange: (selectedKeys: React.Key[]) => void;
  /** 搜索关键词 */
  searchValue?: string;
  /** 搜索变化回调 */
  onSearch?: (value: string) => void;
  /** 是否可编辑 */
  editable?: boolean;
  /** 是否展示搜索框 */
  showSearch?: boolean;
  /** 搜索框占位符 */
  searchPlaceholder?: string;
  /** 是否展示重置按钮 */
  showReset?: boolean;
  /** 重置回调 */
  onReset?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 加载状态 */
  loading?: boolean;
  /** 空状态展示 */
  emptyText?: React.ReactNode;
  /** 图标类型 */
  iconType?: 'org' | 'plant';
}

/**
 * 树节点数据类型
 */
export interface TreeNode {
  /** 节点唯一标识 */
  key: string;
  /** 节点标题 */
  title: string;
  /** 子节点列表 */
  children?: TreeNode[];
  /** 是否为电站 */
  isPlant?: boolean;
  /** 父节点ID */
  parentId?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可选 */
  selectable?: boolean;
  /** 是否可勾选 */
  checkable?: boolean;
}

/**
 * OrgTreeSelector 组件属性接口
 */
export interface OrgTreeSelectorProps {
  /** 树形数据 */
  treeData: TreeNode[];
  /** 选中的节点keys */
  selectedKeys: React.Key[];
  /** 选中变化回调 */
  onChange: (selectedKeys: React.Key[], selectedNodes: TreeNode[]) => void;
  /** 搜索关键词 */
  searchValue?: string;
  /** 搜索变化回调 */
  onSearch?: (value: string) => void;
  /** 是否可编辑 */
  editable?: boolean;
  /** 是否展示搜索框 */
  showSearch?: boolean;
  /** 搜索框占位符 */
  searchPlaceholder?: string;
  /** 是否展示全选按钮 */
  showSelectAll?: boolean;
  /** 全选回调 */
  onSelectAll?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 是否默认展开所有节点 */
  defaultExpandAll?: boolean;
  /** 展开的节点keys */
  expandedKeys?: React.Key[];
  /** 展开变化回调 */
  onExpand?: (expandedKeys: React.Key[]) => void;
  /** 加载状态 */
  loading?: boolean;
  /** 空状态展示 */
  emptyText?: React.ReactNode;
  /** 标题 */
  title?: string;
}

/**
 * 新增成员表单数据接口
 */
export interface AddMemberFormData {
  /** 基本信息 */
  basicInfo: {
    /** 邮箱 */
    orgEmail: string;
    /** 用户名 */
    orgUsername: string;
    /** 电话号码 */
    orgPhone: string;
  };
  /** 角色信息 */
  role: string[];
  /** 电站信息 */
  plants: {
    /** 组织ID列表 */
    organizationKeys: string[];
    /** 电站ID列表 */
    plantKeys: string[];
  };
}

/**
 * 预览组织成员权限请求参数类型
 * 用于提交预览组织成员权限请求
 */
export interface PreviewMemberPermissionRequest {
  /** 角色ID列表 */
  roleIds: string[];
}

/**
 * 预览组织成员权限响应数据类型
 * 用于返回预览组织成员权限结果
 */
export interface PreviewMemberPermissionResponse {
  code: number;
  errorCode: string;
  message: string;
  data: PreviewMemberPermissionData;
  timestamp: string;
  traceId: string;
}

export interface PreviewMemberPermissionData {
  webPermissions: Permission[];
  appPermissions: Permission[];
}

export interface Permission {
  permissionId: string;
  permissionCode: string;
  permissionName: string;
  parentId: string;
  permissionType: string;
  level: number;
  sortOrder: number;
  roles: Role[];
  children: PreviewMemberPermissionData;
}

export interface RoleListResponse {
  code: number;
  message: string;
  data: RoleDataList;
}

export interface RoleDataList {
  records: Record[];
  total: number;
  size: number;
  current: number;
}

export interface Record {
  roleId: string;
  orgId?: string;
  roleName: string;
  description?: string;
  status: string;
  memberCount: number;
  permissionCount: number;
  createTime?: Date;
}

export interface RecordListResponse {
  code: number;
  errorCode: string;
  message: string;
  data: RecordData;
  timestamp: string;
  traceId: string;
}

export interface RecordData {
  records: RecordList[];
  total: number;
  size: number;
  current: number;
  orders: Order[];
  optimizeCountSql: boolean;
  searchCount: boolean;
  optimizeJoinOfCountSql: boolean;
  maxLimit: number;
  countId: string;
}

export interface Order {
  column: string;
  asc: boolean;
}

export interface RecordList {
  changeType: string;
  changeContent: string;
  operatorUid: string;
  operatorName: string;
  changedAt: string;
  batchId: string;
}

export interface AddMemberRequest {
  orgId: string;
  email: string;
  username: string;
  phone: string;
  roleIds: string[];
}

export interface AddMemberResponse {
  code: number;
  errorCode: string;
  message: string;
  data: AddMemberData;
  timestamp: string;
  traceId: string;
}

export interface AddMemberData {
  memberId: string;
  orgId: string;
  orgName: string;
  orgCode: string;
  orgType: string;
  uid: string;
  userId: string;
  username: string;
  email: string;
  phone: string;
  userType: string;
  roleList: RoleList[];
  status: string;
  isOwner: boolean;
  applicationId: string;
  joinedAt: Date;
  createTime: Date;
  updateTime: Date;
  availableActions: string;
}

export interface RoleList {
  roleId: string;
  roleName: string;
}

export interface ReviewMemberApplicationResponse {
  code: number;
  errorCode: string;
  message: string;
  data: {
    applicationId: string;
    status: string;
    reviewedAt: {
      dateTime: string;
      offset: {
        totalSeconds: number;
      };
    };
    message: string;
  };
  timestamp: string;
  traceId: string;
}

/**
 * 电站树请求参数类型
 * 符合需求文档规范
 */
export interface PlantTreeParams {
  /** 电站ID */
  orgId: string;
  /** 组织名称关键词（模糊搜索） */
  keyword?: string;
}

export interface PlantTreeResponse {
  code: number;
  errorCode: string;
  message: string;
  data: PlantTreeDatum[];
  timestamp: string;
  traceId: string;
}

export interface PlantTreeDatum {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  parentId: string;
  plantId: string;
  plantStatus: string;
  hasOrgScope: boolean;
  children: PlantTreeDatum[];
}
