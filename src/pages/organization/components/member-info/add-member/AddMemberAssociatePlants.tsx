import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { PlantTreeDatum } from '@pages/organization/dto';
import { getPlantTree } from '@pages/organization/services/organizationService';
import { AntForm } from '@shared/components';

import OrgTreeSelector from '../org-tree/OrgTreeSelector';
import SelectedList from '../org-tree/SelectedList';

import styles from './AddMemberAssociatePlants.module.scss';

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
const AddMemberAssociatePlants: React.FC<AddMemberAssociatePlantsProps> = ({
  form,
  onSubmit,
  orgId,
}) => {
  /** 左侧搜索关键词 */
  const [leftSearchValue, setLeftSearchValue] = useState('');
  /** 选中的组织keys */
  const [selectedOrgKeys, setSelectedOrgKeys] = useState<React.Key[]>([]);
  /** 选中的组织数据 */
  const [selectedOrgs, setSelectedOrgs] = useState<PlantTreeDatum[]>([]);
  /** 选中的电站keys */
  const [selectedPlantKeys, setSelectedPlantKeys] = useState<React.Key[]>([]);
  /** 选中的电站数据 */
  const [selectedPlants, setSelectedPlants] = useState<PlantTreeDatum[]>([]);
  /** 组织树数据 */
  const [treeData, setTreeData] = useState<PlantTreeDatum[]>([]);
  /** 加载状态 */
  const [loading, setLoading] = useState(false);

  /**
   * 获取指定节点的所有后代节点（包括子组织和电站）
   */
  const getAllDescendants = useCallback((node: PlantTreeDatum): PlantTreeDatum[] => {
    const descendants: PlantTreeDatum[] = [node];
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        descendants.push(...getAllDescendants(child));
      });
    }
    return descendants;
  }, []);

  /**
   * 获取指定节点的所有祖先节点
   */
  const getAncestors = useCallback(
    (nodeId: React.Key, data: PlantTreeDatum[]): PlantTreeDatum[] => {
      const findAncestors = (
        nodes: PlantTreeDatum[],
        currentAncestors: PlantTreeDatum[],
      ): PlantTreeDatum[] => {
        for (const node of nodes) {
          if (node.nodeId === nodeId) {
            return currentAncestors;
          }
          if (node.children && node.children.length > 0) {
            const result = findAncestors(node.children, [...currentAncestors, node]);
            if (result.length > 0) {
              return result;
            }
          }
        }
        return [];
      };
      return findAncestors(data, []);
    },
    [],
  );

  /**
   * 在树中查找指定节点
   */
  const findNodeById = useCallback(
    (nodeId: React.Key, data: PlantTreeDatum[]): PlantTreeDatum | null => {
      for (const node of data) {
        if (node.nodeId === nodeId) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const found = findNodeById(nodeId, node.children);
          if (found) return found;
        }
      }
      return null;
    },
    [],
  );

  /**
   * 构建树形结构的组织数据
   */
  const buildOrgTree = useCallback((orgs: PlantTreeDatum[]): PlantTreeDatum[] => {
    const orgMap = new Map<string, PlantTreeDatum>();
    const rootOrgs: PlantTreeDatum[] = [];

    // 先将所有组织放入 Map
    orgs.forEach((org) => {
      orgMap.set(org.nodeId || '', { ...org, children: [] });
    });

    // 构建树形结构
    orgs.forEach((org) => {
      const orgId = org.nodeId || '';
      const parentId = org.parentId || '';

      if (parentId && orgMap.has(parentId)) {
        // 有父组织，添加到父组织的 children 中
        const parentOrg = orgMap.get(parentId);
        if (parentOrg) {
          parentOrg.children = [...(parentOrg.children || []), orgMap.get(orgId)!];
        }
      } else {
        // 没有父组织，作为根组织
        rootOrgs.push(orgMap.get(orgId)!);
      }
    });

    return rootOrgs;
  }, []);

  /**
   * 处理树选择变化
   * 当勾选父节点时，自动勾选所有子节点
   * 当取消勾选子节点时，父节点的勾选状态也会被取消
   */
  const handleTreeChange = useCallback(
    (checkedNodeIds: React.Key[], checkedNodes: PlantTreeDatum[]) => {
      // 使用 Map 去重，以 nodeId 为 key
      const orgMap = new Map<string, PlantTreeDatum>();
      const plantMap = new Map<string, PlantTreeDatum>();

      // 遍历所有选中的节点
      checkedNodes.forEach((node) => {
        const nodeId = node.nodeId || '';

        if (node.nodeType === 'PLANT') {
          // 电站直接加入
          plantMap.set(nodeId, node);
        } else {
          // 组织需要判断是否是"完全选中"状态
          // 即：该组织本身被勾选，且其所有子组织/电站也都被勾选
          const descendants = getAllDescendants(node);
          const childOrgs = descendants.filter(
            (d) => d.nodeType !== 'PLANT' && d.nodeId !== node.nodeId,
          );
          const childPlants = descendants.filter((d) => d.nodeType === 'PLANT');

          // 检查是否所有后代都在选中列表中
          const allChildrenChecked =
            childOrgs.every((child) => checkedNodeIds.includes(child.nodeId || '')) &&
            childPlants.every((plant) => checkedNodeIds.includes(plant.nodeId || ''));

          // 只有在完全选中状态下，才将组织加入已选列表
          if (allChildrenChecked) {
            orgMap.set(nodeId, node);

            // 将组织下的所有电站也加入电站列表
            childPlants.forEach((plant) => {
              const plantId = plant.nodeId || '';
              plantMap.set(plantId, plant);
            });
          }
          // 如果不是完全选中，不添加当前组织
          // 其子组织和电站会在各自的遍历中被处理
        }
      });

      // 从 Map 中提取去重后的数据
      const orgKeys = Array.from(orgMap.keys());
      const orgValues = Array.from(orgMap.values());
      const plantKeys = Array.from(plantMap.keys());
      const plantValues = Array.from(plantMap.values());

      // 构建树形结构的组织数据
      const treeOrgs = buildOrgTree(orgValues);

      setSelectedOrgKeys(orgKeys);
      setSelectedOrgs(treeOrgs);
      setSelectedPlantKeys(plantKeys);
      setSelectedPlants(plantValues);
    },
    [getAllDescendants, buildOrgTree],
  );

  /**
   * 处理组织列表移除
   * 移除组织时，同时移除该组织下的所有子组织和电站
   * 包括：树结构、扁平 keys、电站列表
   */
  const handleOrgListChange = useCallback(
    (item: PlantTreeDatum) => {
      // 从原始 treeData 中递归查找要移除的组织
      const findOrgInTree = (nodes: PlantTreeDatum[], targetId: string): PlantTreeDatum | null => {
        for (const node of nodes) {
          if (node.nodeId === targetId) {
            return node;
          }
          if (node.children && node.children.length > 0) {
            const found = findOrgInTree(node.children, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      // 在原始 treeData 中找到要移除的组织
      const orgToRemove = findOrgInTree(treeData, item.nodeId || '');
      if (!orgToRemove) return;

      // 获取该组织的所有后代（包括电站）
      const allDescendants = getAllDescendants(orgToRemove);
      const idsToRemove = new Set(
        allDescendants.map((d) => d.nodeId).filter((id): id is string => id !== undefined),
      );

      // 从选中组织中移除（包括树结构和 keys）
      setSelectedOrgKeys((prev) => prev.filter((key) => !idsToRemove.has(key as string)));
      setSelectedOrgs((prev) => {
        // 递归过滤掉要移除的组织及其子组织
        const filterOrgs = (orgs: PlantTreeDatum[]): PlantTreeDatum[] => {
          return orgs
            .filter((org) => !idsToRemove.has(org.nodeId || ''))
            .map((org) => ({
              ...org,
              children: org.children ? filterOrgs(org.children) : undefined,
            }))
            .filter((org) => {
              // 保留有子节点或没有子节点且不在移除列表中的组织
              if (org.children && org.children.length > 0) {
                return true;
              }
              return !idsToRemove.has(org.nodeId || '');
            });
        };
        return filterOrgs(prev);
      });

      // 从选中电站中移除 - 使用 nodeId 进行匹配
      setSelectedPlantKeys((prev) =>
        prev.filter((key) => {
          const nodeId = key as string;
          return !idsToRemove.has(nodeId);
        }),
      );
      setSelectedPlants((prev) => {
        // 过滤掉所有在移除列表中的电站
        return prev.filter((plant) => {
          const plantId = plant.nodeId;
          return plantId && !idsToRemove.has(plantId);
        });
      });
    },
    [getAllDescendants, treeData],
  );

  /**
   * 检查组织是否处于"完全选中"状态
   * 即：该组织本身被勾选，且其所有子组织/电站也都被勾选
   */
  const isOrgFullyChecked = useCallback(
    (org: PlantTreeDatum, currentOrgKeys: React.Key[], currentPlantKeys: React.Key[]): boolean => {
      const descendants = getAllDescendants(org);
      const childOrgs = descendants.filter(
        (d) => d.nodeType !== 'PLANT' && d.nodeId !== org.nodeId,
      );
      const childPlants = descendants.filter((d) => d.nodeType === 'PLANT');

      // 检查是否所有后代都在选中列表中
      return (
        childOrgs.every((child) => currentOrgKeys.includes(child.nodeId || '')) &&
        childPlants.every((plant) => currentPlantKeys.includes(plant.nodeId || ''))
      );
    },
    [getAllDescendants],
  );

  /**
   * 处理电站列表移除
   * 移除电站时，递归移除所有不再"完全选中"的直属上层组织
   * 但保留那些仍有其他子节点被选中的非直属组织
   */
  const handlePlantListChange = useCallback(
    (item: PlantTreeDatum) => {
      // 更新电站列表
      const newPlantKeys = selectedPlantKeys.filter((key) => key !== item.nodeId);
      const newPlants = selectedPlants.filter((plant) => plant.nodeId !== item.nodeId);

      setSelectedPlantKeys(newPlantKeys);
      setSelectedPlants(newPlants);

      // 找到该电站的所有祖先组织
      const ancestors = getAncestors(item.nodeId || '', treeData);

      // 收集需要移除的祖先组织（不再完全选中的）
      const ancestorIdsToRemove = new Set<string>();

      ancestors.forEach((ancestor) => {
        if (selectedOrgKeys.includes(ancestor.nodeId || '')) {
          // 检查移除电站后，该祖先组织是否还保持"完全选中"状态
          const isStillFullyChecked = isOrgFullyChecked(ancestor, selectedOrgKeys, newPlantKeys);
          if (!isStillFullyChecked) {
            ancestorIdsToRemove.add(ancestor.nodeId || '');
          }
        }
      });

      // 如果有需要移除的祖先组织，更新组织列表
      if (ancestorIdsToRemove.size > 0) {
        setSelectedOrgKeys((prev) => prev.filter((key) => !ancestorIdsToRemove.has(key as string)));

        setSelectedOrgs((prev) => {
          // 递归处理组织树：移除不再完全选中的组织，但保留其选中的子节点
          const processOrgs = (orgs: PlantTreeDatum[]): PlantTreeDatum[] => {
            const result: PlantTreeDatum[] = [];

            orgs.forEach((org) => {
              const orgId = org.nodeId || '';

              // 如果当前组织需要移除
              if (ancestorIdsToRemove.has(orgId)) {
                // 递归处理其子节点，保留选中的子组织
                if (org.children && org.children.length > 0) {
                  const processedChildren = processOrgs(org.children);
                  result.push(...processedChildren);
                }
                // 注意：不添加当前组织本身，只添加其选中的子节点
              } else {
                // 当前组织不需要移除，保留并递归处理子节点
                const updatedOrg = {
                  ...org,
                  children: org.children ? processOrgs(org.children) : undefined,
                };
                result.push(updatedOrg);
              }
            });

            return result;
          };

          return processOrgs(prev);
        });
      }
    },
    [selectedPlantKeys, selectedPlants, selectedOrgKeys, getAncestors, treeData, isOrgFullyChecked],
  );

  /**
   * 处理重置
   */
  const handleReset = useCallback(() => {
    setSelectedOrgKeys([]);
    setSelectedOrgs([]);
    setSelectedPlantKeys([]);
    setSelectedPlants([]);
  }, []);

  // 合并选中的keys
  const mergedSelectedKeys = useMemo(
    () => [...selectedOrgKeys, ...selectedPlantKeys],
    [selectedOrgKeys, selectedPlantKeys],
  );

  const loadPlants = useCallback(async () => {
    if (!orgId) return;
    try {
      setLoading(true);
      const response = await getPlantTree({
        orgId: orgId,
        keyword: leftSearchValue,
      });
      if (response?.code === 200) {
        setTreeData(response.data);
      }
    } catch (error) {
      console.error('Failed to get plant tree:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [orgId, leftSearchValue]);

  useEffect(() => {
    setTimeout(() => {
      loadPlants();
    }, 0);
  }, [loadPlants]);

  return (
    <AntForm
      className={styles.form}
      form={form}
      onFinish={() => onSubmit({ organizationKeys: selectedOrgKeys, plantKeys: selectedPlantKeys })}
      layout="vertical"
    >
      <div className={styles.stepContent}>
        <div className={styles.plantsContainer}>
          {/* 左侧组织树选择器 */}
          <div className={styles.treeSelector}>
            <OrgTreeSelector
              treeData={treeData}
              selectedKeys={mergedSelectedKeys}
              onChange={handleTreeChange}
              searchValue={leftSearchValue}
              onSearch={setLeftSearchValue}
              searchPlaceholder="Please enter organization name or ID"
              loading={loading}
            />
          </div>
          <div className={styles.arrowIcon}>
            <svg
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_4474_87601)">
                <path
                  d="M4 4C4 2.89543 4.89543 2 6 2H28C29.1046 2 30 2.89543 30 4V26C30 27.1046 29.1046 28 28 28H6C4.89543 28 4 27.1046 4 26V4Z"
                  fill="#33C2C8"
                />
              </g>
              <path
                d="M13.0195 12L15.9488 14.9293C15.9879 14.9683 15.9879 15.0317 15.9488 15.0707L13.0195 18M18.0195 12L20.9488 14.9293C20.9879 14.9683 20.9879 15.0317 20.9488 15.0707L18.0195 18"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <defs>
                <filter
                  id="filter0_d_4474_87601"
                  x="0"
                  y="0"
                  width="34"
                  height="34"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="2" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.0980392 0 0 0 0 0.105882 0 0 0 0 0.121569 0 0 0 0.06 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_4474_87601"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_4474_87601"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </div>

          {/* 右侧已选列表 */}
          <div className={styles.selectedList}>
            <div className={styles.selectedOrgSection}>
              <SelectedList
                title="Selected Organization"
                data={selectedOrgs}
                selectedKeys={selectedOrgKeys}
                onChange={handleOrgListChange}
                iconType="org"
              />
            </div>
            <div className={styles.selectedPlantSection}>
              <SelectedList
                title="Selected Plants"
                data={selectedPlants}
                selectedKeys={selectedPlantKeys}
                onChange={handlePlantListChange}
                showReset={true}
                onReset={handleReset}
                iconType="plant"
              />
            </div>
          </div>
        </div>
      </div>
    </AntForm>
  );
};

export default AddMemberAssociatePlants;
