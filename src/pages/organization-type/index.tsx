import React, { useEffect, useState } from 'react';
import type { OrganizationTypeItem } from '@shared/types/organizationType';
import { Empty, message, Spin, Typography } from 'antd';

import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

import styles from './index.module.scss';

const { Title } = Typography;

const OrganizationType: React.FC = () => {
  const [organizationTypes, setOrganizationTypes] = useState<OrganizationTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取组织类型列表
  useEffect(() => {
    const fetchOrganizationTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await organizationTypeApi.getAllOrganizationTypes();
        setOrganizationTypes(response.data);
      } catch (err) {
        setError('获取组织类型失败');
        console.error('Failed to fetch organization types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationTypes();
  }, []);

  // 处理卡片点击事件
  const handleCardClick = (type: any) => {
    console.log('Edit organization type:', type);
  };
  // 处理卡片点击事件
  const handleEditClick = (e: React.MouseEvent, type: any) => {
    e.stopPropagation(); // 阻止事件冒泡
    console.log('Edit organization type:', type);
  };

  // 处理上传按钮点击事件
  const handleUploadClick = (e: React.MouseEvent, type: any) => {
    e.stopPropagation(); // 阻止事件冒泡
    console.log('Upload image for organization type:', type);
    // 这里可以打开上传组件
  };

  return (
    <div className={styles.container}>
      <Title level={3}>Organization Type</Title>

      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : organizationTypes.length === 0 ? (
        <Empty description="暂无组织类型" />
      ) : (
        <div className={styles.flexContainer}>
          {organizationTypes.map((type) => {
            return (
              <div
                key={type.typeCode}
                className={`${styles.card} ${type.coverImage ? styles.cardWithBackground : ''}`}
                onClick={() => handleCardClick(type)}
              >
                <div className={styles.cardContent}>
                  {type.coverImage ? (
                    <img
                      src={type.coverImage}
                      alt={type.typeName}
                      className={styles.cardBackground}
                    />
                  ) : (
                    <img
                      src="/src/assets/images/org-type/org-type-tree.png"
                      alt={type.typeName}
                      className={styles.defaultImage}
                    />
                  )}
                  <div className={styles.typeCount}>{type.organizationCount || 1}</div>
                  <div className={styles.topRightIconContainer}>
                    <img
                      src="/src/assets/images/org-type/upload.png"
                      alt={type.typeName}
                      className={styles.orgIcon}
                      onClick={(e) => handleUploadClick(e, type)}
                    />
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.flexCenter}>
                    <img
                      src="/src/assets/images/org-type/vector.png"
                      alt={type.typeName}
                      className={styles.orgIcon}
                    />
                    <div className={styles.typeName}>{type.typeName}</div>
                  </div>
                  <img
                    src="/src/assets/images/org-type/edit.png"
                    alt={type.typeName}
                    className={styles.orgIcon}
                    onClick={(e) => handleEditClick(e, type)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrganizationType;
