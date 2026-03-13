import React, { useCallback, useMemo, useState } from 'react';
import { ApartmentOutlined, SearchOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Input, Tree } from 'antd';
import type { TreeProps } from 'antd/es/tree';

import styles from './OrgTreeSelector.module.scss';

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
}

/**
 * 组织树选择器组件
 * 支持编辑态（树形选择）和展示态（列表展示）
 *
 * 功能特性：
 * - 支持搜索过滤
 * - 支持全选操作
 * - 支持编辑态和展示态切换
 * - 支持自定义节点渲染
 * - 支持多选/单选
 * - 支持勾选模式
 */
const OrgTreeSelector: React.FC<OrgTreeSelectorProps> = ({
  treeData,
  selectedKeys,
  onChange,
  searchValue: controlledSearchValue,
  onSearch,
  editable = true,
  showSearch = true,
  searchPlaceholder = 'Please enter organization name or ID',
  showSelectAll = true,
  onSelectAll,
  className = '',
  style,
  defaultExpandAll = false,
  expandedKeys: controlledExpandedKeys,
  onExpand,
  loading = false,
  emptyText = 'No data available',
}) => {
  /** 内部搜索状态 */
  const [internalSearchValue, setInternalSearchValue] = useState('');
  /** 内部展开状态 */
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<React.Key[]>([]);

  /** 是否受控搜索 */
  const isSearchControlled = controlledSearchValue !== undefined;
  const searchValue = isSearchControlled ? controlledSearchValue : internalSearchValue;

  /** 是否受控展开 */
  const isExpandControlled = controlledExpandedKeys !== undefined;
  const expandedKeys = isExpandControlled ? controlledExpandedKeys : internalExpandedKeys;

  /**
   * 过滤后的树形数据
   */
  const filteredTreeData = useMemo(() => {
    if (!searchValue) return treeData;

    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .map((node) => {
          const match = node.title.toLowerCase().includes(searchValue.toLowerCase());
          const filteredChildren = node.children ? filterNodes(node.children) : [];

          if (match || filteredChildren.length > 0) {
            return {
              ...node,
              children: filteredChildren,
            };
          }
          return null;
        })
        .filter(Boolean) as TreeNode[];
    };

    return filterNodes(treeData);
  }, [treeData, searchValue]);

  /**
   * 处理搜索变化
   */
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!isSearchControlled) {
        setInternalSearchValue(value);
      }
      onSearch?.(value);
    },
    [isSearchControlled, onSearch],
  );

  /**
   * 处理树节点勾选变化
   */
  const handleTreeCheck: TreeProps['onCheck'] = useCallback(
    (checked: any) => {
      const keys = checked;
      // 获取选中的节点数据
      const selectedNodes: TreeNode[] = [];
      const findNodes = (nodes: TreeNode[], targetKeys: string | string[]) => {
        nodes.forEach((node) => {
          if (targetKeys.includes(node.key)) {
            selectedNodes.push(node);
          }
          if (node.children) {
            findNodes(node.children, targetKeys);
          }
        });
      };
      findNodes(treeData, keys);
      onChange(keys, selectedNodes);
    },
    [onChange, treeData],
  );

  /**
   * 处理展开变化
   */
  const handleExpand = useCallback(
    (keys: React.Key[]) => {
      if (!isExpandControlled) {
        setInternalExpandedKeys(keys);
      }
      onExpand?.(keys);
    },
    [isExpandControlled, onExpand],
  );

  /**
   * 获取所有节点keys
   */
  const getAllKeys = useCallback((nodes: TreeNode[]): string[] => {
    const keys: string[] = [];
    nodes.forEach((node) => {
      keys.push(node.key);
      if (node.children) {
        // eslint-disable-next-line react-hooks/immutability
        keys.push(...getAllKeys(node.children));
      }
    });
    return keys;
  }, []);

  /**
   * 处理全选
   */
  const handleSelectAll = useCallback(() => {
    if (onSelectAll) {
      onSelectAll();
      return;
    }

    const allKeys = getAllKeys(treeData);
    const allNodes: TreeNode[] = [];
    const collectNodes = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        allNodes.push(node);
        if (node.children) {
          collectNodes(node.children);
        }
      });
    };
    collectNodes(treeData);
    onChange(allKeys, allNodes);
  }, [treeData, onChange, onSelectAll, getAllKeys]);

  /**
   * 默认标题渲染
   */
  const defaultTitleRender = useCallback(
    (node: TreeNode) => {
      const isPlant = node.isPlant;
      const icon = isPlant ? (
        <ThunderboltOutlined className={styles.plantIcon} />
      ) : (
        <ApartmentOutlined className={styles.orgIcon} />
      );

      if (searchValue && node.title.toLowerCase().includes(searchValue.toLowerCase())) {
        const index = node.title.toLowerCase().indexOf(searchValue.toLowerCase());
        const before = node.title.slice(0, index);
        const match = node.title.slice(index, index + searchValue.length);
        const after = node.title.slice(index + searchValue.length);

        return (
          <span className={styles.treeNodeTitle}>
            {icon}
            <span>
              {before}
              <span className={styles.highlight}>{match}</span>
              {after}
            </span>
          </span>
        );
      }

      return (
        <span className={styles.treeNodeTitle}>
          {icon}
          <span>{node.title}</span>
        </span>
      );
    },
    [searchValue],
  );

  /**
   * 渲染编辑态
   */
  const renderEditable = () => (
    <div className={`${styles.editableContainer} ${className}`} style={style}>
      {showSearch && (
        <div className={styles.searchHeader}>
          <Input
            prefix={<SearchOutlined />}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            className={styles.searchInput}
            allowClear
          />
        </div>
      )}
      <div className={styles.treeContainer}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : filteredTreeData.length === 0 ? (
          <div className={styles.empty}>{emptyText}</div>
        ) : (
          <Tree
            checkable
            treeData={filteredTreeData as any}
            checkedKeys={selectedKeys}
            expandedKeys={expandedKeys}
            onCheck={handleTreeCheck}
            onExpand={handleExpand}
            titleRender={(node) => defaultTitleRender(node as TreeNode)}
            className={styles.tree}
            defaultExpandAll={defaultExpandAll}
          />
        )}
      </div>
      {showSelectAll && editable && (
        <div className={styles.footer}>
          <Button type="link" onClick={handleSelectAll} className={styles.selectAllBtn}>
            Select All
          </Button>
        </div>
      )}
    </div>
  );

  /**
   * 渲染展示态
   */
  const renderReadonly = () => {
    // 获取选中的节点数据
    const selectedNodes: TreeNode[] = [];
    const findNodes = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (selectedKeys.includes(node.key)) {
          selectedNodes.push(node);
        }
        if (node.children) {
          findNodes(node.children);
        }
      });
    };
    findNodes(treeData);

    return (
      <div className={`${styles.readonlyContainer} ${className}`} style={style}>
        {showSearch && (
          <div className={styles.searchHeader}>
            <Input
              prefix={<SearchOutlined />}
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              className={styles.searchInput}
              allowClear
            />
          </div>
        )}
        <div className={styles.listContainer}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : selectedNodes.length === 0 ? (
            <div className={styles.empty}>{emptyText}</div>
          ) : (
            selectedNodes.map((node) => {
              const isPlant = node.isPlant;
              const icon = isPlant ? (
                <ThunderboltOutlined className={styles.plantIcon} />
              ) : (
                <ApartmentOutlined className={styles.orgIcon} />
              );

              return (
                <div key={node.key} className={styles.listItem}>
                  {icon}
                  <span className={styles.itemText}>{node.title}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return editable ? renderEditable() : renderReadonly();
};

export default OrgTreeSelector;
