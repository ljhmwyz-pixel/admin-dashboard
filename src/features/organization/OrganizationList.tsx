import React, { useState } from 'react';
import { Splitter } from 'antd';

import OrganizationDetailPanel from '@/features/organization/organization-info/OrganizationDetailPanel';
import OrganizationTree from '@/features/organization/organization-info/OrganizationTree';
import type { TreeNodeData } from '@/shared/types/organization';

import styles from './OrganizationList.module.scss';

const OrganizationList: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [currentParentNode, setCurrentParentNode] = useState<TreeNodeData>({} as TreeNodeData);
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);

  // 使用模拟数据作为默认树数据

  return (
    <div className={styles.organizationListPage}>
      <Splitter
        className={styles.splitterStyle}
        draggerIcon={
          <svg
            width="15"
            height="28"
            viewBox="0 0 15 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_237_5088)">
              <path
                d="M4 4C4 2.89543 4.89543 2 6 2H9C10.1046 2 11 2.89543 11 4V20C11 21.1046 10.1046 22 9 22H6C4.89543 22 4 21.1046 4 20V4Z"
                fill="#33C2C8"
              />
            </g>
            <path
              d="M6 7.5C6 7.22386 6.22386 7 6.5 7C6.77614 7 7 7.22386 7 7.5V16.5C7 16.7761 6.77614 17 6.5 17C6.22386 17 6 16.7761 6 16.5V7.5Z"
              fill="white"
            />
            <path
              d="M8 7.5C8 7.22386 8.22386 7 8.5 7C8.77614 7 9 7.22386 9 7.5V16.5C9 16.7761 8.77614 17 8.5 17C8.22386 17 8 16.7761 8 16.5V7.5Z"
              fill="white"
            />
            <defs>
              <filter
                id="filter0_d_237_5088"
                x="0"
                y="0"
                width="15"
                height="28"
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
                  result="effect1_dropShadow_237_5088"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_237_5088"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        }
      >
        {/* 左侧面板 - 组织树 */}
        <Splitter.Panel defaultSize="40%" min="20%" max="70%">
          <div className={styles.organizationListPanel}>
            <OrganizationTree
              onSelect={(selectedKey) => {
                setSelectedKey(selectedKey);
              }}
              setCurParentNode={(parentNode: TreeNodeData) => setCurrentParentNode(parentNode)}
              selectedKey={selectedKey}
              setTreeData={(data) => setTreeData(data)}
              treeData={treeData}
            />
          </div>
        </Splitter.Panel>

        {/* 右侧面板 - 组织详情 */}
        <Splitter.Panel>
          <OrganizationDetailPanel
            selectedKey={selectedKey}
            currentParentNode={currentParentNode}
            treeData={treeData}
          />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};

export default OrganizationList;
