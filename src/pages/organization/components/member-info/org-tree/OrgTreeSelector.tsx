import React, { useCallback, useMemo, useState } from 'react';
import { ApartmentOutlined, SearchOutlined, ThunderboltOutlined } from '@ant-design/icons';
import type { OrgTreeSelectorProps, TreeNode } from '@pages/organization/dto';
import { AntButton, AntEmpty, AntInput, AntSpin, AntTree } from '@shared/components';
import type { TreeProps } from 'antd/es/tree';
import clx from 'classnames';

import styles from './OrgTreeSelector.module.scss';

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
  title = 'Selected Oragnization',
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
  const defaultTitleRender = useCallback((node: TreeNode) => {
    return (
      <span className={styles.treeNode}>
        <span className={styles.treeNodeTitle}>{node.title}</span>
      </span>
    );
  }, []);

  /**
   * 渲染编辑态
   */
  const renderEditable = () => (
    <div className={clx(styles.editableContainer, className)} style={style}>
      {showSearch && (
        <div className={styles.searchHeader}>
          <AntInput
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
        <AntSpin spinning={loading}>
          {filteredTreeData.length === 0 ? (
            <AntEmpty />
          ) : (
            <AntTree
              checkable
              showLine
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
        </AntSpin>
      </div>
      {showSelectAll && editable && (
        <div className={styles.footer}>
          <AntButton type="link" onClick={handleSelectAll} className={styles.selectAllBtn}>
            Select All
          </AntButton>
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
      <div className={clx(styles.readonlyContainer, className)} style={style}>
        <div className={styles.title}>{title}</div>
        {showSearch && (
          <div className={styles.searchHeader}>
            <AntInput
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
