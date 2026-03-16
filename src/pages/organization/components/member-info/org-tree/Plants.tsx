import React, { useCallback, useMemo, useState } from 'react';
import type { ListItem, TreeNode } from '@pages/organization/dto';
import type { MemberDetail } from '@pages/organization/types/memberList';

import OrgTreeSelector from './OrgTreeSelector';
import SelectedList from './SelectedList';

import styles from './Plants.module.scss';

/**
 * Plants 组件属性接口
 */
interface PlantsProps {
  /** 成员详情数据 */
  member: MemberDetail;
  /** 是否为编辑状态 */
  editMember?: boolean;
}

/**
 * 成员 Plants 信息组件
 * 展示成员可访问的组织和电站信息
 *
 * 组件结构：
 * - 左侧：OrgTreeSelector（组织树选择器）
 * - 右侧上：SelectedList（已选组织列表）
 * - 右侧下：SelectedList（已选电站列表）
 *
 * 功能说明：
 * - 查看状态：分为左右两部分，分别展示已筛选的组织和已筛选的电站
 * - 编辑状态：左侧为树形穿梭框主体，右侧分为上下两部分，分别接收穿梭框筛选的组织和电站
 *   - 电站属于组织内部，选中组织会自动包含其下的电站
 *   - 左侧底部支持全选按钮
 *   - 右侧底部支持重置按钮
 */
const Plants: React.FC<PlantsProps> = ({ editMember = false }) => {
  /** 左侧搜索关键词 */
  const [leftSearchValue, setLeftSearchValue] = useState('');
  /** 右侧组织搜索关键词 */
  const [rightOrgSearchValue, setRightOrgSearchValue] = useState('');
  /** 右侧电站搜索关键词 */
  const [rightPlantSearchValue, setRightPlantSearchValue] = useState('');
  /** 选中的组织keys */
  const [selectedOrgKeys, setSelectedOrgKeys] = useState<React.Key[]>([]);
  /** 选中的电站keys */
  const [selectedPlantKeys, setSelectedPlantKeys] = useState<React.Key[]>([]);

  /**
   * 模拟组织和电站数据
   * 实际项目中应该从接口获取
   */
  const treeData: TreeNode[] = useMemo(
    () => [
      {
        key: 'pylontech',
        title: 'Pylontech',
        children: [
          {
            key: 'dealer-1a',
            title: 'Dealer 1-A',
            parentId: 'pylontech',
            children: [
              {
                key: 'plant-1a-1',
                title: 'Plant 1 (PRG-NMXW-64kW)',
                parentId: 'dealer-1a',
                isPlant: true,
              },
              {
                key: 'plant-1a-2',
                title: 'Plant 2 (PRG-NMXW-64kW)',
                parentId: 'dealer-1a',
                isPlant: true,
              },
            ],
          },
          {
            key: 'dealer-1b',
            title: 'Dealer 1-B',
            parentId: 'pylontech',
            children: [
              {
                key: 'plant-1b-1',
                title: 'Plant 1 (PRG-NMXW-64kW)',
                parentId: 'dealer-1b',
                isPlant: true,
              },
            ],
          },
          {
            key: 'dealer-1c',
            title: 'Dealer 1-C',
            parentId: 'pylontech',
            children: [],
          },
        ],
      },
    ],
    [],
  );

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
    const orgKeys: string[] = [];
    const plantKeys: string[] = [];

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
    <div className={styles.container}>
      {editMember ? (
        // 编辑状态
        <div className={styles.editContainer}>
          {/* 左侧：树形选择器 */}
          <div className={styles.leftSection}>
            <OrgTreeSelector
              treeData={treeData}
              selectedKeys={mergedSelectedKeys}
              onChange={handleTreeChange}
              searchValue={leftSearchValue}
              onSearch={setLeftSearchValue}
              editable={true}
              showSearch={true}
              searchPlaceholder="Please enter organization name or ID"
              showSelectAll={true}
              className={styles.fullHeight}
            />
          </div>

          {/* 中间：穿梭箭头 */}
          <div className={styles.transferArrow}>
            <div className={styles.arrowIcon}>&gt;&gt;</div>
          </div>

          {/* 右侧：已选列表 */}
          <div className={styles.rightSection}>
            <div className={styles.selectedOrgSection}>
              <SelectedList
                title="Selected Organization"
                data={selectedOrgs}
                selectedKeys={selectedOrgKeys}
                onChange={handleOrgListChange}
                searchValue={rightOrgSearchValue}
                onSearch={setRightOrgSearchValue}
                editable={true}
                showSearch={true}
                searchPlaceholder="Please enter organization name..."
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
                searchValue={rightPlantSearchValue}
                onSearch={setRightPlantSearchValue}
                editable={true}
                showSearch={true}
                searchPlaceholder="Please enter plant name or ID"
                showReset={true}
                onReset={handleReset}
                iconType="plant"
                emptyText="No selected plants"
              />
            </div>
          </div>
        </div>
      ) : (
        // 查看状态
        <div className={styles.viewContainer}>
          {/* 左侧：已选组织 */}
          <div className={styles.viewSection}>
            <OrgTreeSelector
              treeData={treeData}
              selectedKeys={selectedOrgKeys}
              onChange={handleTreeChange}
              editable={false}
              showSearch={true}
              searchPlaceholder="Search organization..."
              showSelectAll={false}
              className={styles.fullHeight}
              emptyText="No selected organizations"
            />
          </div>

          {/* 右侧：已选电站 */}
          <div className={styles.viewSection}>
            <SelectedList
              title="Selected Plants"
              data={selectedPlants}
              selectedKeys={selectedPlantKeys}
              onChange={handlePlantListChange}
              editable={false}
              showSearch={true}
              searchPlaceholder="Search plant..."
              showReset={false}
              iconType="plant"
              emptyText="No selected plants"
              className={styles.fullHeight}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Plants;
