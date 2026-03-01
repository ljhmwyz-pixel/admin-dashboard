import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';

import type { TreeNodeData } from '../../../shared/types/organization';

interface OrganizationTreeProps {
  /** 树形数据 */
  treeData: TreeNodeData[];
  /** 选中节点的回调 */
  onSelect?: (selectedKeys: React.Key[], info: any) => void;
  /** 展开节点的回调 */
  onExpand?: (expandedKeys: React.Key[]) => void;
  /** 当前选中的key */
  selectedKey?: React.Key;
  /** 加载状态 */
  loading?: boolean;
  /** 默认展开的节点key */
  defaultExpandedKeys?: React.Key[];
  /** 是否显示搜索框 */
  showSearch?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 组织机构树有机体组件
 * 包含搜索功能的完整组织机构树
 */
const OrganizationTree: React.FC<OrganizationTreeProps> = ({
  treeData,
  onSelect,
  onExpand,
  selectedKey,
  defaultExpandedKeys = [],
  showSearch = true,
  className = '',
}) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(defaultExpandedKeys);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  // 直接使用传入的树形数据，因为已经是 TreeNodeData 格式
  const treeDataConverted = treeData.map((node) => ({
    key: node.key,
    title: node.title,
    children: node.children
      ? node.children.map((child) => ({
          key: child.key,
          title: child.title,
          children: child.children
            ? child.children.map((grandChild) => ({
                key: grandChild.key,
                title: grandChild.title,
                children: undefined,
              }))
            : undefined,
        }))
      : undefined,
  }));

  // 搜索过滤逻辑
  const filterTreeNode = (node: DataNode): boolean => {
    if (!searchValue) return true;
    // 递归检查节点及其子节点
    const checkNode = (n: DataNode): boolean => {
      if (String(n.title).toLowerCase().includes(searchValue.toLowerCase())) {
        return true;
      }
      if (n.children) {
        return n.children.some(checkNode);
      }
      return false;
    };
    return checkNode(node);
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const handleExpand = (keys: React.Key[]) => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
    onExpand?.(keys);
  };

  // 调试信息
  console.log('原始treeData:', treeData);
  console.log('转换后treeDataConverted:', treeDataConverted);
  return (
    <div className={`organization-tree ${className}`}>
      {showSearch && (
        <div className="tree-search">
          <Input
            placeholder="搜索组织机构"
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={onSearchChange}
            allowClear
          />
        </div>
      )}

      <div className="tree-container">
        <Tree
          className="organization-tree-view"
          treeData={treeDataConverted}
          selectedKeys={selectedKey ? [selectedKey] : []}
          onSelect={onSelect}
          onExpand={handleExpand}
          height={(window && window?.innerHeight - 74) || 400}
          blockNode
          virtual
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          filterTreeNode={filterTreeNode}
          showLine
          showIcon={false}
        />
      </div>
    </div>
  );
};

export default OrganizationTree;
