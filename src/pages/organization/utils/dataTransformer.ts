import type { ApiOrganization, TreeNodeData } from '@pages/organization/dto';

/**
 * 比较函数：按组织名称首字母升序排列
 * 排序规则：A-Z > 0-9 > 特殊符号
 * @param a 第一个组织名称
 * @param b 第二个组织名称
 * @returns 比较结果
 */
function compareByFirstChar(a: string, b: string): number {
  const getSortPriority = (char: string): number => {
    const lowerChar = char.toLowerCase();
    // A-Z: 0-25
    if (lowerChar >= 'a' && lowerChar <= 'z') {
      return lowerChar.charCodeAt(0) - 97;
    }
    // 0-9: 26-35
    if (lowerChar >= '0' && lowerChar <= '9') {
      return 26 + (lowerChar.charCodeAt(0) - 48);
    }
    // 特殊符号: 36+
    return 36;
  };

  const charA = a.charAt(0).toLowerCase();
  const charB = b.charAt(0).toLowerCase();
  const priorityA = getSortPriority(charA);
  const priorityB = getSortPriority(charB);

  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  // 相同优先级时，按字母顺序排序
  return a.localeCompare(b);
}

/**
 * 对树节点数组进行排序
 * 按组织名称首字母升序排列（A-Z > 0-9 > 特殊符号）
 * @param nodes 树节点数组
 * @returns 排序后的树节点数组
 */
function sortTreeNodes(nodes: TreeNodeData[]): TreeNodeData[] {
  // 先对当前层级的节点进行排序
  const sortedNodes = [...nodes].sort((a, b) => compareByFirstChar(a.title, b.title));

  // 递归排序子节点
  for (const node of sortedNodes) {
    if (node.children && node.children.length > 0) {
      node.children = sortTreeNodes(node.children);
    }
  }

  return sortedNodes;
}

/**
 * 将API组织数据转换为 antd 树形结构数据
 * @param apiData API 返回的组织列表数据
 * @returns antd 树形结构数据（已按名称首字母升序排列）
 */
export function transformOrganizationToTreeData(apiData: ApiOrganization[]): TreeNodeData[] {
  // 创建节点映射表
  const nodeMap = new Map<string, TreeNodeData>();

  // 第一步：创建所有节点
  for (const org of apiData) {
    const node: TreeNodeData = {
      key: org.orgId,
      title: org.orgName,
      children: [],
      type: org.orgType,
      canAdd: true,
      canDelete: org.orgType !== 'PYLONTECH',
      description: org.description,
      status: org.status,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
      parentOrgId: org.parentOrgId,
    };
    nodeMap.set(org.orgId, node);
  }

  // 第二步：构建树形结构
  const treeData: TreeNodeData[] = [];

  for (const org of apiData) {
    const currentNode = nodeMap.get(org.orgId)!;
    const parentNodeId = org.parentOrgId;

    if (parentNodeId) {
      const parentNode = nodeMap.get(parentNodeId);
      if (parentNode) {
        if (!parentNode.children) {
          parentNode.children = [];
        }
        parentNode.children.push(currentNode);
      } else {
        treeData.push(currentNode);
      }
    } else {
      treeData.push(currentNode);
    }
  }

  // 第三步：对树形结构进行排序（每层按首字母升序排列）
  return sortTreeNodes(treeData);
}

/**
 * 构建父节点映射表（迭代方式）
 * @param treeData 树形结构数据
 * @returns 父节点映射表
 */
function buildParentMap(treeData: TreeNodeData[]): Map<string, TreeNodeData> {
  const parentMap = new Map<string, TreeNodeData>();
  const stack = [...treeData];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        parentMap.set(child.key, node);
        stack.push(child);
      }
    }
  }

  return parentMap;
}

/**
 * 构建节点映射表（迭代方式）
 * @param treeData 树形结构数据
 * @returns 节点映射表
 */
function buildNodeMap(treeData: TreeNodeData[]): Map<string, TreeNodeData> {
  const nodeMap = new Map<string, TreeNodeData>();
  const stack = [...treeData];

  while (stack.length > 0) {
    const node = stack.pop()!;
    nodeMap.set(node.key, node);
    if (node.children && node.children.length > 0) {
      stack.push(...node.children);
    }
  }

  return nodeMap;
}

/**
 * 获取指定节点的父节点信息
 * @param treeData 树形结构数据
 * @param nodeId 目标节点 ID
 * @returns 父节点信息，如果没有父节点则返回 null
 */
export function getParentNode(treeData: TreeNodeData[], nodeId: string): TreeNodeData | null {
  const parentMap = buildParentMap(treeData);
  return parentMap.get(nodeId) || null;
}

/**
 * 批量获取多个节点的父节点信息
 * @param treeData 树形结构数据
 * @param nodeIds 目标节点 ID 数组
 * @returns Map<节点 ID, 父节点>
 */
export function getParentNodesBatch(
  treeData: TreeNodeData[],
  nodeIds: string[],
): Map<string, TreeNodeData | null> {
  const parentMap = buildParentMap(treeData);
  const result = new Map<string, TreeNodeData | null>();

  for (const nodeId of nodeIds) {
    result.set(nodeId, parentMap.get(nodeId) || null);
  }

  return result;
}

/**
 * 根据节点 key获取节点完整信息
 * @param treeData 树形结构数据
 * @param key 目标节点 key
 * @returns 节点完整信息，如果未找到则返回 null
 */
export function getNodeByKey(treeData: TreeNodeData[], key: string): TreeNodeData | null {
  const nodeMap = buildNodeMap(treeData);
  return nodeMap.get(key) || null;
}

/**
 * 批量获取多个节点的完整信息
 * @param treeData 树形结构数据
 * @param keys 目标节点 key 数组
 * @returns Map<节点 key, 节点信息>
 */
export function getNodesByKeysBatch(
  treeData: TreeNodeData[],
  keys: string[],
): Map<string, TreeNodeData | null> {
  const nodeMap = buildNodeMap(treeData);
  const result = new Map<string, TreeNodeData | null>();

  for (const key of keys) {
    result.set(key, nodeMap.get(key) || null);
  }

  return result;
}
