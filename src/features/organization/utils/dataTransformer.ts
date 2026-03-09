import type { ApiOrganization, TreeNodeData } from '@/shared/types/organization';

/**
 * 将API组织数据转换为 antd 树形结构数据
 * @param apiData API返回的组织列表数据
 * @returns antd 树形结构数据
 */
export function transformOrganizationToTreeData(apiData: ApiOrganization[]): TreeNodeData[] {
  // 创建节点映射表
  const nodeMap = new Map<string, TreeNodeData>();

  // 第一步：创建所有节点
  apiData.forEach((org) => {
    const node: TreeNodeData = {
      key: org.orgId, // 使用 orgId 作为 key
      title: org.orgName, // 使用 orgName 作为 title
      children: [],
      type: org.orgType,
      canAdd: true,
      canDelete: org.orgType !== 'PYLONTECH',
      description: org.description,
      status: org.status, // 保持原始状态值
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
      // 扩展字段，用于构建树形结构
      parentOrgId: org.parentOrgId,
    };
    nodeMap.set(org.orgId, node);
  });

  // 第二步：构建树形结构
  const treeData: TreeNodeData[] = [];

  apiData.forEach((org) => {
    const currentNode = nodeMap.get(org.orgId)!;
    const parentNodeId = org.parentOrgId;

    if (parentNodeId) {
      // 有父组织，添加到父组织的 children 中
      const parentNode = nodeMap.get(parentNodeId);
      if (parentNode) {
        if (!parentNode.children) {
          parentNode.children = [];
        }
        parentNode.children.push(currentNode);
      }
    } else {
      // 没有父组织（根节点），直接添加到结果数组
      treeData.push(currentNode);
    }
  });

  return treeData;
}

/**
 * 生成兜底的组织树数据（当 API 调用失败时使用）
 * @param count 生成的节点数量
 * @returns 兜底的树形数据
 */
export function generateFallbackTreeData(count: number = 10): TreeNodeData[] {
  const rootNode: TreeNodeData = {
    key: 'fallback-root',
    title: 'PYLONTECH',
    children: [],
    type: 'PYLONTECH',
    canAdd: true,
    canDelete: false,
    description: '这是兜底数据，API 调用失败时显示',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    parentOrgId: null,
  };

  // 生成子节点
  for (let i = 1; i <= count; i++) {
    const nodeType = i % 3 === 0 ? 'INSTALLER' : i % 2 === 0 ? 'DEALER' : 'PYLONTECH';
    const childNode: TreeNodeData = {
      key: `fallback-${i}`,
      title: `组织${i}`,
      children: [],
      type: nodeType,
      canAdd: true,
      canDelete: nodeType !== 'PYLONTECH', // PYLONTECH 类型不允许删除
      description: `这是第${i}个组织`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentOrgId: i <= 3 ? 'fallback-root' : `fallback-${i % 3 || 3}`,
    };

    if (i <= 3) {
      // 前 3 个组织作为一级子组织
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
      }
    }
  }

  return [rootNode];
}

/**
 * 获取指定节点的父节点信息
 * @param treeData 树形结构数据
 * @param nodeId 目标节点 ID
 * @returns 父节点信息，如果没有父节点则返回 null
 */
export function getParentNode(treeData: TreeNodeData[], nodeId: string): TreeNodeData | null {
  // 方法 1: 使用 Map 缓存父节点关系（推荐，性能最好）
  const parentMap = new Map<string, TreeNodeData>();

  // 构建父节点映射表 - O(n)
  function buildParentMap(nodes: TreeNodeData[]) {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          parentMap.set(child.key, node);
        }
        // 递归处理子节点
        buildParentMap(node.children);
      }
    }
  }

  buildParentMap(treeData);

  // O(1) 查找
  return parentMap.get(nodeId) || null;
}

/**
 * 批量获取多个节点的父节点信息（性能最优）
 * @param treeData 树形结构数据
 * @param nodeIds 目标节点 ID 数组
 * @returns Map<节点 ID, 父节点>
 */
export function getParentNodesBatch(
  treeData: TreeNodeData[],
  nodeIds: string[],
): Map<string, TreeNodeData | null> {
  const parentMap = new Map<string, TreeNodeData>();
  const result = new Map<string, TreeNodeData | null>();

  // 构建父节点映射表 - O(n)
  function buildParentMap(nodes: TreeNodeData[]) {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          parentMap.set(child.key, node);
        }
        buildParentMap(node.children);
      }
    }
  }

  buildParentMap(treeData);

  // O(m) 批量查找
  for (const nodeId of nodeIds) {
    result.set(nodeId, parentMap.get(nodeId) || null);
  }

  return result;
}
