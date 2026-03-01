import React, { useEffect, useState } from 'react';

import { organizationApi } from '../../../services/modules/organization/organizationApi';
import { AntInput, AntTree } from '../../../shared/components/antd-imports';
import type { TreeNodeData } from '../../../shared/types/organization';
import { generateMassiveOrganizationTreeData } from '../mocks/organizationData';
import AddOrganizationDrawer from './AddOrganizationDrawer';
import styles from './OrganizationTree.module.less';
import TreeNodeTitle from './TreeNodeTitle';

interface OrganizationTreeProps {
  onSelect?: (selectedKey: string) => void;
  selectedKey?: string;
}

const OrganizationTree: React.FC<OrganizationTreeProps> = ({ onSelect, selectedKey = '' }) => {
  const [addDrawerVisible, setAddDrawerVisible] = useState(false);
  const [currentParentNode, setCurrentParentNode] = useState<any>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);

  // 初始化加载顶层组织树数据
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await organizationApi.getList();
        const largeOrganizationData = generateMassiveOrganizationTreeData(10000);
        setTreeData(largeOrganizationData);
      } catch (error) {
        console.error('Failed to load organization tree:', error);
      }
    };

    loadInitialData();
  }, []);

  // 搜索处理 - 调用API接口
  const handleSearch = async () => {
    // const keyword = e.target.value;
    // setSearchValue(keyword);
    // try {
    //     setLoading(true);
    //     const data = await searchOrganizations(keyword);
    //     setTreeData(data);
    // } catch (error) {
    //     console.error('Search failed:', error);
    // } finally {
    //     setLoading(false);
    // }
  };

  // 处理树节点选择
  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const key = selectedKeys[0] as string;
      if (onSelect) {
        onSelect(key);
      }
    }
  };

  // 处理节点添加事件
  const handleNodeAdd = (nodeData: TreeNodeData, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentParentNode(nodeData);
    setAddDrawerVisible(true);
  };

  return (
    <div className={styles.organizationTreeContainer} style={{ flex: 1, overflow: 'auto' }}>
      <div className={styles.organizationTreeSearch}>
        <AntInput
          prefixCls={styles.organizationTreeSearchPrefix}
          name="search"
          placeholder="Please enter role name"
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
          prefix={
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.6001 13.6L10.1001 10.1M11.6001 6.1C11.6001 9.13757 9.13766 11.6 6.1001 11.6C3.06253 11.6 0.600098 9.13757 0.600098 6.1C0.600098 3.06243 3.06253 0.6 6.1001 0.6C9.13766 0.6 11.6001 3.06243 11.6001 6.1Z"
                stroke="#191B1F"
                strokeOpacity="0.4"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          }
          onPressEnter={handleSearch}
          className={styles.organizationTreeSearchInput}
        />
      </div>

      <AntTree
        className={styles.organizationTree}
        treeData={treeData}
        onSelect={handleTreeSelect}
        selectedKeys={[selectedKey]}
        showLine
        height={(window && window?.innerHeight - 74) || 400}
        blockNode
        virtual={true}
        titleRender={(nodeData: TreeNodeData) => (
          <TreeNodeTitle
            nodeData={nodeData}
            onAdd={handleNodeAdd}
            //   onDelete={(nodeData, e) => handleNodeDelete?.(nodeData, e)}
          />
        )}
      />

      {/* 添加组织抽屉 */}
      <AddOrganizationDrawer
        visible={addDrawerVisible}
        onClose={() => {
          setAddDrawerVisible(false);
          setCurrentParentNode(null);
        }}
        onAdd={(values) => {
          console.log('添加组织:', values);
          // 这里可以调用API添加组织
          // onNodeAdd?.(currentParentNode, {} as any);
          setAddDrawerVisible(false);
        }}
        parentNode={currentParentNode as any}
      />
    </div>
  );
};

export default OrganizationTree;
