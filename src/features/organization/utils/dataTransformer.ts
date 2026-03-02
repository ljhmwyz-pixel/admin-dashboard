import type { Organization, TreeNodeData } from '../../../shared/types/organization';

// API返回的组织数据类型（根据接口文档）
export interface ApiOrganization {
  orgId: string;
  orgName: string;
  orgType: string;
  parentOrgId: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 兼容现有Organization类型的转换函数
export interface CompatibleOrganization extends Organization {
  orgId?: string;
  orgName?: string;
  parentOrgId?: string | null;
}

// API分页响应结构
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: {
    records: T[];
    total: number;
    size: number;
    current: number;
    pages: number;
  };
  timestamp: string;
  traceId: string;
}

/**
 * 将API组织数据转换为树形结构数据
 * @param apiData API返回的组织列表数据
 * @returns 树形结构数据
 */
export function transformOrganizationToTreeData(
  apiData: ApiOrganization[] | Organization[],
): TreeNodeData[] {
  // 类型守卫：判断是ApiOrganization还是Organization
  const isApiOrganization = (item: any): item is ApiOrganization => {
    return 'orgId' in item && 'orgName' in item;
  };

  // 首先创建所有节点
  const nodeMap = new Map<string, TreeNodeData>();

  apiData.forEach((org) => {
    const nodeId = isApiOrganization(org) ? org.orgId : String(org.id);
    const nodeTitle = isApiOrganization(org) ? org.orgName : org.name;

    const node: TreeNodeData = {
      key: nodeId,
      title: nodeTitle,
      children: [],
      isLeaf: true, // 初始设为叶子节点，后续会更新
      type: isApiOrganization(org) ? mapOrgTypeToNodeType(org.orgType) : 'company',
      canAdd: isApiOrganization(org) ? org.status === 'ACTIVE' : org.status === 'active',
      canDelete: isApiOrganization(org)
        ? org.status === 'ACTIVE' && org.parentOrgId !== null
        : org.status === 'active' && org.parentId !== undefined,
      description: isApiOrganization(org) ? org.description : org.description,
      status: isApiOrganization(org) ? org.status.toLowerCase() : org.status,
      createdAt: isApiOrganization(org) ? org.createdAt : org.createdAt,
      updatedAt: isApiOrganization(org) ? org.updatedAt : org.updatedAt,
    };
    nodeMap.set(nodeId, node);
  });

  // 构建树形结构
  const treeData: TreeNodeData[] = [];

  apiData.forEach((org) => {
    const nodeId = isApiOrganization(org) ? org.orgId : String(org.id);
    const parentNodeId = isApiOrganization(org) ? org.parentOrgId : org.parentId;
    const currentNode = nodeMap.get(nodeId)!;

    if (parentNodeId) {
      // 有父组织，添加到父组织的children中
      const parentNode = nodeMap.get(String(parentNodeId));
      if (parentNode) {
        if (!parentNode.children) {
          parentNode.children = [];
        }
        parentNode.children.push(currentNode);
        parentNode.isLeaf = false; // 父节点不再是叶子节点
      }
    } else {
      // 没有父组织，作为根节点
      treeData.push(currentNode);
    }
  });

  return treeData;
}

/**
 * 组织类型映射
 * @param orgType API返回的组织类型
 * @returns 组件使用的节点类型
 */
function mapOrgTypeToNodeType(orgType: string): TreeNodeData['type'] {
  const typeMap: Record<string, TreeNodeData['type']> = {
    PYLONTECH: 'company',
    BD: 'company',
    DEALER: 'dealer',
    INSTALLER: 'installer',
    OWNER: 'dealer',
    GUEST: 'installer',
    // 兼容现有类型
    company: 'company',
    dealer: 'dealer',
    installer: 'installer',
  };

  return typeMap[orgType] || 'company';
}

/**
 * 生成兜底的组织树数据（当API调用失败时使用）
 * @param count 生成的节点数量
 * @returns 兜底的树形数据
 */
export function generateFallbackTreeData(count: number = 10): TreeNodeData[] {
  const rootNode: TreeNodeData = {
    key: 'fallback-root',
    title: '组织架构',
    children: [],
    isLeaf: false,
    type: 'company',
    canAdd: true,
    canDelete: false,
    description: '这是兜底数据，API调用失败时显示',
  };

  // 生成子节点
  for (let i = 1; i <= count; i++) {
    const childNode: TreeNodeData = {
      key: `fallback-${i}`,
      title: `组织${i}`,
      children: [],
      isLeaf: true,
      type: i % 3 === 0 ? 'installer' : i % 2 === 0 ? 'dealer' : 'company',
      canAdd: true,
      canDelete: true,
      description: `这是第${i}个组织`,
    };

    if (i <= 3) {
      // 前3个组织作为一级子组织
      rootNode.children?.push(childNode);
    } else {
      // 其他组织随机分配给前三级组织
      const parentIndex = i % 3;
      const parent = rootNode.children?.[parentIndex];
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(childNode);
        parent.isLeaf = false;
      }
    }
  }

  return [rootNode];
}

/**
 * 处理API响应数据
 * @param response API响应
 * @returns 转换后的树形数据
 */
export function handleApiResponse(response: ApiResponse<ApiOrganization>): TreeNodeData[] {
  if (response.code === 0 && response.data.records) {
    return transformOrganizationToTreeData(response.data.records);
  } else {
    console.error('API调用失败:', response.msg);
    return generateFallbackTreeData();
  }
}
