import React, { useCallback, useMemo, useState } from 'react';
import { AntForm } from '@shared/components';

import type { ListItem, TreeNode } from '@/pages/organization/dto';

import OrgTreeSelector from '../org-tree/OrgTreeSelector';
import SelectedList from '../org-tree/SelectedList';

import styles from './AddMember.module.scss';

/**
 * 模拟组织树数据
 */
const mockTreeData: TreeNode[] = [
  {
    key: 'org-1',
    title: 'Organization A',
    children: [
      {
        key: 'plant-1',
        title: 'Plant A1',
        isPlant: true,
      },
      {
        key: 'plant-2',
        title: 'Plant A2',
        isPlant: true,
      },
    ],
  },
  {
    key: 'org-2',
    title: 'Organization B',
    children: [
      {
        key: 'plant-3',
        title: 'Plant B1',
        isPlant: true,
      },
      {
        key: 'plant-4',
        title: 'Plant B2',
        isPlant: true,
      },
    ],
  },
];

/**
 * AddMemberAssociatePlants 组件属性接口
 */
interface AddMemberAssociatePlantsProps {
  /** 表单实例 */
  form: any;
  /** 提交回调 */
  onSubmit: (values: any) => void;
  /** 组织ID */
  orgId: string;
}

/**
 * 新增成员第三步：关联电站
 * 使用 OrgTreeSelector 和 SelectedList 组件实现组织和电站的选择
 */
const AddMemberAssociatePlants: React.FC<AddMemberAssociatePlantsProps> = ({ form, onSubmit }) => {
  /** 左侧搜索关键词 */
  const [leftSearchValue, setLeftSearchValue] = useState('');
  /** 右侧搜索关键词 */
  const [rightSearchValue, setRightSearchValue] = useState('');
  /** 选中的组织keys */
  const [selectedOrgKeys, setSelectedOrgKeys] = useState<React.Key[]>([]);
  /** 选中的电站keys */
  const [selectedPlantKeys, setSelectedPlantKeys] = useState<React.Key[]>([]);
  /** 组织树数据 */
  const [treeData] = useState<TreeNode[]>(mockTreeData);

  /**
   * 已选中的组织数据
   */
  const selectedOrgs: ListItem[] = useMemo(() => {
    const orgs: ListItem[] = [];
    const findOrgs = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (!node.isPlant && selectedOrgKeys.includes(node.key)) {
          orgs.push({
            key: node.key,
            title: node.title,
            isPlant: false,
          });
        }
        if (node.children) {
          findOrgs(node.children);
        }
      });
    };
    findOrgs(treeData);
    return orgs;
  }, [treeData, selectedOrgKeys]);

  /**
   * 已选中的电站数据
   */
  const selectedPlants: ListItem[] = useMemo(() => {
    const plants: ListItem[] = [];
    const findPlants = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (node.isPlant && selectedPlantKeys.includes(node.key)) {
          plants.push({
            key: node.key,
            title: node.title,
            isPlant: true,
          });
        }
        if (node.children) {
          findPlants(node.children);
        }
      });
    };
    findPlants(treeData);
    return plants;
  }, [treeData, selectedPlantKeys]);

  /**
   * 处理树选择变化
   */
  const handleTreeChange = useCallback((keys: React.Key[], nodes: TreeNode[]) => {
    const orgKeys: React.Key[] = [];
    const plantKeys: React.Key[] = [];

    nodes.forEach((node) => {
      if (node.isPlant) {
        plantKeys.push(node.key);
      } else {
        orgKeys.push(node.key);
      }
    });

    setSelectedOrgKeys(orgKeys);
    setSelectedPlantKeys(plantKeys);
  }, []);

  /**
   * 处理组织列表变化
   */
  const handleOrgListChange = useCallback((keys: React.Key[]) => {
    setSelectedOrgKeys(keys);
  }, []);

  /**
   * 处理电站列表变化
   */
  const handlePlantListChange = useCallback((keys: React.Key[]) => {
    setSelectedPlantKeys(keys);
  }, []);

  /**
   * 处理重置
   */
  const handleReset = useCallback(() => {
    setSelectedOrgKeys([]);
    setSelectedPlantKeys([]);
  }, []);

  // 合并选中的keys
  const mergedSelectedKeys = useMemo(
    () => [...selectedOrgKeys, ...selectedPlantKeys],
    [selectedOrgKeys, selectedPlantKeys],
  );

  return (
    <AntForm
      form={form}
      onFinish={() => onSubmit({ organizationKeys: selectedOrgKeys, plantKeys: selectedPlantKeys })}
      layout="vertical"
    >
      <div className={styles.stepContent}>
        <h3>Associate Plants</h3>
        <p>Please select the plants that the new member can access.</p>

        <div className={styles.plantsContainer}>
          {/* 左侧组织树选择器 */}
          <div className={styles.treeSelector}>
            <OrgTreeSelector
              treeData={treeData}
              selectedKeys={mergedSelectedKeys}
              onChange={handleTreeChange}
              searchValue={leftSearchValue}
              onSearch={setLeftSearchValue}
              editable
              showSearch
              searchPlaceholder="Search organizations or plants..."
              showSelectAll
            />
          </div>

          {/* 右侧已选列表 */}
          <div className={styles.selectedList}>
            <div className={styles.selectedOrgSection}>
              <SelectedList
                title="Selected Organization"
                data={selectedOrgs}
                selectedKeys={selectedOrgKeys}
                onChange={handleOrgListChange}
                searchValue={rightSearchValue}
                onSearch={setRightSearchValue}
                editable
                showSearch
                searchPlaceholder="Search selected organizations..."
                showReset={false}
                iconType="org"
                emptyText="No selected organizations"
              />
            </div>
            <div className={styles.selectedPlantSection}>
              <SelectedList
                title="Selected Plants"
                data={selectedPlants}
                selectedKeys={selectedPlantKeys}
                onChange={handlePlantListChange}
                searchValue={rightSearchValue}
                onSearch={setRightSearchValue}
                editable
                showSearch
                searchPlaceholder="Search selected plants..."
                showReset
                onReset={handleReset}
                iconType="plant"
                emptyText="No selected plants"
              />
            </div>
          </div>
        </div>
      </div>
    </AntForm>
  );
};

export default AddMemberAssociatePlants;
