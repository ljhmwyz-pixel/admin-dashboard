import React, { useState, useEffect } from 'react';
import { AntTree, AntInput, AntButton } from '../lib/antd-imports';
import { searchOrganizations } from '../../services/organizationService';

interface OrganizationTreeProps {
  onSelect?: (selectedKey: string) => void;
  selectedKey?: string;
}

const OrganizationTree: React.FC<OrganizationTreeProps> = ({ 
  onSelect, 
  selectedKey = 'p001' 
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [treeData, setTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 初始化加载组织树数据
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const data = await searchOrganizations('');
        setTreeData(data);
      } catch (error) {
        console.error('Failed to load organization tree:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // 搜索处理 - 调用API接口
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchValue(keyword);
    
    try {
      setLoading(true);
      const data = await searchOrganizations(keyword);
      setTreeData(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理树节点选择
  const handleTreeSelect = (selectedKeys: any[], info: any) => {
    if (selectedKeys.length > 0) {
      const key = selectedKeys[0] as string;
      if (onSelect) {
        onSelect(key);
      }
    }
  };

  return (
    <div className="organization-tree-container" style={{ flex: 1, overflow: 'auto' }}>
      <div className="organization-tree-search">
        <AntInput
          placeholder="Please enter role name"
          value={searchValue}
          onChange={handleSearch}
          style={{ width: '100%' }}
          disabled={loading}
        />
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="ant-spin ant-spin-lg ant-spin-spinning">
            <span className="ant-spin-dot">
              <i className="ant-spin-dot-item"></i>
              <i className="ant-spin-dot-item"></i>
              <i className="ant-spin-dot-item"></i>
              <i className="ant-spin-dot-item"></i>
            </span>
          </div>
        </div>
      ) : treeData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No matching nodes found
        </div>
      ) : (
        <AntTree
          treeData={treeData}
          onSelect={handleTreeSelect}
          selectedKeys={[selectedKey]}
          showLine
          style={{ padding: '16px' }}
          titleRender={(nodeData) => (
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <span>{nodeData.title}</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <AntButton 
                  type="text" 
                  icon={<span className="anticon anticon-edit" style={{ fontSize: '14px' }}>⊕</span>}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    // 编辑逻辑
                  }}
                />
                <AntButton 
                  type="text" 
                  icon={<span className="anticon anticon-delete" style={{ fontSize: '14px' }}>×</span>}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    // 删除逻辑
                  }}
                />
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default OrganizationTree;