import React, { useCallback, useEffect, useState } from 'react';
import type { OrganizationTypeItem } from '@shared/types/organizationType';
import { Empty, message, Spin, Typography } from 'antd';

// 引入图标资源
import editIcon from '@/assets/images/org-type/edit.png';
import orgTypeTree from '@/assets/images/org-type/org-type-tree.png';
import uploadIcon from '@/assets/images/org-type/upload.png';
import vectorIcon from '@/assets/images/org-type/vector.png';

// 引入组织类型API服务
import organizationTypeApi from '@/services/modules/organization/organizationTypeApi';

// 引入组织类型详情组件
import OrganizationTypeDetail from './components/organization-detail/index';

import styles from './index.module.scss';

const { Title } = Typography;

const OrganizationType: React.FC = () => {
  /**
   * 组织类型列表
   * 存储从API获取的所有组织类型数据
   */
  const [organizationTypes, setOrganizationTypes] = useState<OrganizationTypeItem[]>([]);

  /**
   * 加载状态
   * 用于控制加载动画的显示
   */
  const [loading, setLoading] = useState(true);

  /**
   * 错误信息
   * 存储API调用过程中发生的错误信息
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * 详情弹窗可见性
   * 控制组织类型详情弹窗的显示和隐藏
   */
  const [detailVisible, setDetailVisible] = useState(false);

  /**
   * 选中的组织类型
   * 存储当前选中的组织类型数据，用于详情弹窗显示
   */
  const [selectedType, setSelectedType] = useState<OrganizationTypeItem | null>(null);

  /**
   * 是否为编辑模式
   * 控制详情弹窗的模式：查看模式或编辑模式
   */
  const [isEditMode, setIsEditMode] = useState(false);

  /**
   * 上传loading状态
   * 用于控制全局上传过程中的loading显示
   */
  const [uploading, setUploading] = useState(false);

  /**
   * 获取组织类型列表
   */
  const fetchOrganizationTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizationTypeApi.getAllOrganizationTypes();
      setOrganizationTypes(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取组织类型失败';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchOrganizationTypes();
  }, [fetchOrganizationTypes]);

  /**
   * 处理卡片点击事件（查看模式）
   * @param type 组织类型
   */
  const handleCardClick = useCallback((type: OrganizationTypeItem) => {
    setSelectedType(type);
    setIsEditMode(false);
    setDetailVisible(true);
  }, []);

  /**
   * 处理编辑按钮点击事件（编辑模式）
   * @param e 鼠标事件
   * @param type 组织类型
   */
  const handleEditClick = useCallback((e: React.MouseEvent, type: OrganizationTypeItem) => {
    e.stopPropagation(); // 阻止事件冒泡
    setSelectedType(type);
    setIsEditMode(true);
    setDetailVisible(true);
  }, []);

  /**
   * 处理上传按钮点击事件
   * @param e 鼠标事件
   * @param type 组织类型
   */
  const handleUploadClick = useCallback(
    (e: React.MouseEvent, type: OrganizationTypeItem) => {
      e.stopPropagation(); // 阻止事件冒泡

      // 创建文件输入元素
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      // 监听文件选择事件
      input.onchange = async (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (file) {
          try {
            // 设置上传loading状态
            setUploading(true);

            // 上传文件
            await organizationTypeApi.uploadOrganizationTypeImage(type.id, file);

            // 上传成功，显示提示
            message.success('图片上传成功');

            // 重新获取组织类型列表，更新图片
            fetchOrganizationTypes();
          } catch (error) {
            // 上传失败，显示错误提示
            message.error('图片上传失败');
            console.error('Failed to upload image:', error);
          } finally {
            // 无论成功失败，都关闭loading状态
            setUploading(false);
          }
        }
      };

      // 触发文件选择对话框
      input.click();
    },
    [fetchOrganizationTypes],
  );

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
                key={type.id}
                className={`${styles.card} ${type.imageUrl ? styles.cardWithBackground : ''}`}
                onClick={() => handleCardClick(type)}
              >
                <div className={styles.cardContent}>
                  {type.imageUrl ? (
                    <img
                      // src="https://p3.toutiaoimg.com/img/tos-cn-i-qvj2lq49k0/90f66eee5d3045268e064485ad4b5926~tplv-tt-shrink:640:0.image"
                      src={type.imageUrl}
                      alt={type.typeName}
                      className={styles.cardBackground}
                    />
                  ) : (
                    <img src={orgTypeTree} alt={type.typeName} className={styles.defaultImage} />
                  )}
                  <div className={styles.typeCount}>{type.organizationCount || 1}</div>
                  <div className={styles.topRightIconContainer}>
                    <img
                      src={uploadIcon}
                      alt={type.typeName}
                      className={styles.orgIcon}
                      onClick={(e) => handleUploadClick(e, type)}
                    />
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.flexCenter}>
                    <img src={vectorIcon} alt={type.typeName} className={styles.orgIcon} />
                    <div className={styles.typeName}>{type.typeName}</div>
                  </div>
                  <img
                    src={editIcon}
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

      {/* 全局上传loading */}
      {uploading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>正在上传图片...</div>
          </div>
        </div>
      )}

      {/* 组织类型详情弹窗 */}
      {detailVisible && selectedType && (
        <OrganizationTypeDetail
          visible={detailVisible}
          onCancel={() => setDetailVisible(false)}
          isDefaultEditMode={isEditMode}
          organizationType={selectedType}
        />
      )}
    </div>
  );
};

export default OrganizationType;
