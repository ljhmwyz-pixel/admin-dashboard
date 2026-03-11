import { useCallback, useState } from 'react';
import type { TreeNodeData } from '@pages/organization/dto';
import {
  loadOrganizationData as loadOrganizationDataService,
  validateDeleteOrganization,
} from '@pages/organization/services/organizationService';
import { getNodeByKey } from '@pages/organization/utils';

/**
 * 组织树自定义 Hook
 * 封装组织树的核心业务逻辑
 */
export function useOrganizationTree() {
  // 状态管理
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  const [currentParentNode, setCurrentParentNode] = useState<TreeNodeData>({} as TreeNodeData);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [addDrawerVisible, setAddDrawerVisible] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 加载组织树数据
  const loadTreeData = useCallback(async (searchKeyword?: string) => {
    try {
      setLoading(true);
      await loadOrganizationDataService({
        searchKeyword,
        setData: setTreeData,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // 处理节点选择
  const handleSelect = useCallback(
    (key: string) => {
      setSelectedKey(key);
      setCurrentParentNode(getNodeByKey(treeData, key) as TreeNodeData);
    },
    [treeData],
  );

  // 处理添加组织
  const handleAdd = useCallback((parentNode: TreeNodeData) => {
    setCurrentParentNode(parentNode);
    setAddDrawerVisible(true);
  }, []);

  // 处理删除组织
  const handleDelete = useCallback(
    async (nodeData: TreeNodeData, onFail?: () => void, onSuccess?: () => void) => {
      try {
        setLoading(true);
        const validationResult = await validateDeleteOrganization(nodeData.key);
        setLoading(false);
        if (!validationResult.canDelete) {
          onFail?.();
          return;
        }

        onSuccess?.();
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 关闭添加抽屉
  const closeAddDrawer = useCallback(() => {
    setAddDrawerVisible(false);
    setCurrentParentNode({} as TreeNodeData);
  }, []);

  // 展开/收起节点
  const handleExpand = useCallback((keys: React.Key[]) => {
    setExpandedKeys(keys);
  }, []);

  return {
    // 状态
    treeData,
    currentParentNode,
    selectedKey,
    addDrawerVisible,
    expandedKeys,
    loading,

    // 方法
    setLoading,
    loadTreeData,
    handleSelect,
    handleAdd,
    handleDelete,
    closeAddDrawer,
    handleExpand,
    setTreeData,
    setSelectedKey,
  };
}
