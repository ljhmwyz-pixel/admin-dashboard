import React, { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import type { AddMemberFormData, Member, TreeNodeData } from '@pages/organization/dto';
import { useMemberList } from '@pages/organization/hooks';
import {
  addMember,
  changeMemberStatus,
  deleteMember,
  reviewMemberApplication,
  updateMember,
} from '@pages/organization/services/organizationService';

import { useThemeModal } from '@/components/Modal';
import { selectCurrentUser } from '@/core/store/slices/authSlice';
import { useLanguage } from '@/shared/hooks';

import DeleteConfirmInput from '../../organization-tree/DeleteConfirmInput';
import AddRole, { type AddRoleRef } from '../../Role/components/AddRole';
import AddMemberDrawer from '../add-member/AddMemberDrawer';
import MemberInfoModal from '../member-detail/MemberInfoModal';
import MemberListHeader from './MemberListHeader';
import MemberTable from './MemberTable';

import styles from './MemberList.module.scss';

/**
 * MemberList 组件属性接口
 */
interface MemberListProps {
  /** 组织 ID，用于查询成员列表 */
  orgId: string;
  /** 当前节点 */
  currentParentNode: TreeNodeData;
  /** 树数据 */
  treeData: TreeNodeData[];
}

/**
 * 成员列表主组件
 * 负责组织成员列表的整体展示和业务逻辑处理
 *
 * 组件结构：
 * - 使用 useMemberList Hook 管理状态和数据加载
 * - 使用 MemberListHeader 组件展示筛选和操作区域
 * - 使用 MemberTable 组件展示成员列表表格
 * - 处理具体的业务操作（查看、编辑、删除等）
 *
 * 功能特性：
 * - 支持成员列表分页查询
 * - 支持按状态和关键词筛选
 * - 支持新增成员（三步流程）
 * - 支持查看/编辑/删除成员
 * - 支持锁定/解锁成员
 * - 支持审批加入申请
 */
const MemberList: React.FC<MemberListProps> = ({ orgId, currentParentNode, treeData }) => {
  /** 使用自定义 Hook 管理成员列表的状态和数据加载 */
  const {
    loading,
    members,
    total,
    current,
    pageSize,
    status,
    keyword,
    handleStatusChange,
    handleKeywordChange,
    handleSearch,
    handleReset,
    handleTableChange,
  } = useMemberList({ orgId });

  /** 成员信息模态框状态 */
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editMember, setEditMember] = useState<boolean>(false);

  /** 新增成员抽屉状态 */
  const [addDrawerVisible, setAddDrawerVisible] = useState(false);

  const { warning, confirm, success, error, warningConfirm } = useThemeModal();
  const roleModalRef = useRef<AddRoleRef>(null);
  const { t } = useLanguage();
  const user = useSelector(selectCurrentUser);

  /**
   * 处理查看成员详情操作
   * 完整展示成员的基本信息、平台权限范围和数据权限范围
   */
  const handleView = useCallback((member: Member) => {
    setSelectedMember(member);
    setInfoModalVisible(true);
  }, []);

  /**
   * 处理成员信息模态框关闭
   */
  const handleInfoModalClose = useCallback(() => {
    if (editMember) {
      setEditMember(false);
      return;
    }
    setEditMember(false);
    setSelectedMember(null);
    setInfoModalVisible(false);
    setAddDrawerVisible(false);
  }, [editMember]);

  /**
   * 处理模态框中的删除操作
   */
  const handleInfoDelete = (member: Member) => {
    handleDelete(member);
    setInfoModalVisible(false);
    setSelectedMember(null);
  };

  /**
   * 处理模态框中的锁定/解锁操作
   */
  const handleInfoLock = (member: Member) => {
    if (member.status === 'LOCKED') {
      handleEnable(member);
    } else {
      handleDisable(member);
    }
    setInfoModalVisible(false);
    setSelectedMember(null);
  };

  /**
   * 处理编辑成员信息操作
   * 支持修改基本信息、平台权限范围和数据权限范围
   */
  const handleEdit = useCallback(
    (member: Member) => {
      setSelectedMember(member);
      if (!infoModalVisible) {
        setInfoModalVisible(true);
      }
      if (!member?.isOwner) {
        setEditMember(true);
      }
    },
    [infoModalVisible],
  );

  /**
   * 处理模态框中的保存操作
   */
  const handleSaveMember = useCallback(
    async (member: Member, roleIds: string[]) => {
      try {
        // 调用更新接口
        const { memberId, status } = member;
        const result = await updateMember(memberId, { status, roleIds });
        if (result.success) {
          success({
            title: 'Success !',
            content: 'Member modify successfully.',
          });
          handleSearch();
          handleInfoModalClose();
        } else {
          error({
            title: 'Error !',
            content: result.message || '更新失败',
          });
        }
      } catch (error) {
        console.error('Error updating member:', error);
      }
    },
    [handleInfoModalClose, handleSearch, success, error],
  );

  /**
   * 处理删除成员操作
   * 限制组织所有者不可被删除
   */
  const handleDelete = useCallback(
    async (member: Member) => {
      if (user?.userId === member.userId) {
        warning({
          title: 'Error !',
          content: 'You can’t disable your own account.',
        });
        return;
      }
      let confirmUid = '';
      const modalInstance = confirm({
        title: 'Confirm Removal !',
        content: (
          <DeleteConfirmInput
            placeholder="Please enter UID to confirm removal"
            onChange={(value) => {
              confirmUid = value;
              if (modalInstance) {
                modalInstance.update({
                  okButtonProps: {
                    danger: true,
                    disabled: value !== member.userId,
                    className: styles.okConfirm,
                  },
                });
              }
            }}
            confirmText="Are you sure you want to remove this member? This action cannot be undone."
            member={member}
          />
        ),
        okText: t('common.action.delete'),
        cancelText: t('common.action.cancel'),
        okButtonProps: {
          danger: true,
          disabled: true,
        },
        onOk: async () => {
          try {
            // 调用删除接口
            const result = await deleteMember(member.memberId, { confirmUid });
            if (result?.code === 200) {
              success({
                title: 'Success !',
                content: 'Member removed successfully.',
              });
              handleSearch();
            } else {
              error({
                title: 'Error !',
                content: result?.message || 'Failed to remove member.',
              });
            }
          } catch (err) {
            console.error('Error deleting member:', err);
            error({
              title: 'Error !',
              content: 'Failed to remove member.',
            });
          }
        },
      });
    },
    [user, confirm, t, warning, success, handleSearch, error],
  );

  /**
   * 处理禁用成员操作
   * 禁用后成员无法登录系统及使用相关功能
   */
  const handleDisable = useCallback(
    (member: Member) => {
      let reason = '';
      let confirmUid = '';
      const modalInstance = warningConfirm({
        title: 'Confirm Disable !',
        content: (
          <DeleteConfirmInput
            textAreaPlaceholder="Please enter reason"
            placeholder="Please enter UID to confirm disable"
            confirmText="Are you sure you want to lock this member?"
            member={member}
            showTextArea={true}
            onTextAreaChange={(value) => {
              reason = value;
            }}
            onChange={(value) => {
              confirmUid = value;
              if (modalInstance) {
                modalInstance.update({
                  okButtonProps: {
                    disabled: value !== member?.userId,
                    className: styles.okConfirm,
                  },
                });
              }
            }}
          />
        ),
        okText: 'Lock',
        cancelText: 'Cancel',
        onOk: async () => {
          if (!member.memberId) return;
          try {
            const result = await changeMemberStatus(member.memberId, {
              status: 'INACTIVE',
              confirmUid,
              reason,
            });
            if (result?.code === 200) {
              success({
                title: 'Success !',
                content: 'Member disabled successfully.',
              });
              handleSearch();
              handleInfoModalClose();
            } else {
              error({
                title: 'Error !',
                content: result?.message || 'Failed to disable member.',
              });
            }
          } catch (err) {
            console.error('Error disable member:', err);
            error({
              title: 'Error !',
              content: 'Failed to disable member.',
            });
          }
        },
      });
    },
    [warningConfirm, success, handleSearch, handleInfoModalClose, error],
  );

  /**
   * 处理启用成员操作
   * 启用后恢复正常访问权限
   */
  const handleEnable = useCallback(
    (member: Member) => {
      let reason = '';
      let confirmUid = '';
      const modalInstance = warningConfirm({
        title: 'Confirm Disable !',
        content: (
          <DeleteConfirmInput
            textAreaPlaceholder="Please enter reason"
            placeholder="Please enter UID to confirm disable"
            confirmText="Are you sure you want to lock this member?"
            member={member}
            showTextArea={true}
            onTextAreaChange={(value) => {
              reason = value;
            }}
            onChange={(value) => {
              confirmUid = value;
              if (modalInstance) {
                modalInstance.update({
                  okButtonProps: {
                    disabled: value !== member?.userId,
                    className: styles.okConfirm,
                  },
                });
              }
            }}
          />
        ),
        okText: 'UnLock',
        cancelText: 'Cancel',
        onOk: async () => {
          if (!member.memberId) return;
          try {
            const result = await changeMemberStatus(member.memberId, {
              status: 'ACTIVE',
              confirmUid,
              reason,
            });
            if (result?.code === 200) {
              success({
                title: 'Success !',
                content: 'Member disabled successfully.',
              });
              handleSearch();
              handleInfoModalClose();
            } else {
              error({
                title: 'Error !',
                content: result?.message || 'Failed to disable member.',
              });
            }
          } catch (err) {
            console.error('Error disable member:', err);
            error({
              title: 'Error !',
              content: 'Failed to disable member.',
            });
          }
        },
      });
    },
    [warningConfirm, success, handleSearch, handleInfoModalClose, error],
  );

  /**
   * 处理通过加入组织申请操作
   * 审批通过后需将成员状态更新为正常，并分配默认权限
   */
  const handleApprove = useCallback(
    (member: Member) => {
      warningConfirm({
        title: 'Confirm Approval !',
        content: (
          <DeleteConfirmInput
            placeholder="Please enter UID to confirm removal"
            showInput={false}
            showUid={false}
            confirmText="Are you sure you want to approval this request? Once approved, the user will be added to the organization and granted access based on the assigned role."
            member={member}
          />
        ),
        okText: 'Approve',
        cancelText: 'Cancel',
        onOk: async () => {
          if (!member.applicationId) return;
          try {
            const result = await reviewMemberApplication(member.applicationId, {
              status: member?.status,
            });
            if (result?.code === 200) {
              success({
                title: 'Success !',
                content: 'Member approved successfully.',
              });
              handleSearch();
              handleInfoModalClose();
            } else {
              error({
                title: 'Error !',
                content: result?.message || 'Failed to approve member.',
              });
            }
          } catch (err) {
            console.error('Error approving member:', err);
            error({
              title: 'Error !',
              content: 'Failed to approve member.',
            });
          }
        },
      });
    },
    [error, handleInfoModalClose, handleSearch, success, warningConfirm],
  );

  /**
   * 处理拒绝加入组织申请操作
   * 拒绝时需填写拒绝原因（可选），操作后将成员状态更新为拒绝状态并通知申请人
   */
  const handleReject = useCallback(
    (member: Member) => {
      let confirmValue = '';
      const modalInstance = confirm({
        title: 'Confirm Rejection !',
        content: (
          <DeleteConfirmInput
            textAreaPlaceholder="Please enter UID to confirm removal"
            showInput={false}
            showUid={false}
            confirmText="Are you sure you want to approval this request? Once approved, the user will be added to the organization and granted access based on the assigned role."
            member={member}
            showTextArea={true}
            onTextAreaChange={(value) => {
              confirmValue = value;
              if (modalInstance) {
                modalInstance.update({
                  okButtonProps: {
                    danger: true,
                    disabled: !value,
                    className: styles.okConfirm,
                  },
                });
              }
            }}
          />
        ),
        okText: 'Reject',
        cancelText: 'Cancel',
        onOk: async () => {
          if (!member.applicationId) return;
          try {
            // 调用审核接口
            const result = await reviewMemberApplication(member.applicationId, {
              status: member?.status,
              reason: confirmValue,
            });
            if (result?.code === 200) {
              success({
                title: 'Success !',
                content: 'Member rejected successfully.',
              });
              handleSearch();
              handleInfoModalClose();
            } else {
              error({
                title: 'Error !',
                content: result?.message || 'Failed to reject member.',
              });
            }
          } catch (err) {
            console.error('Error rejecting member:', err);
            error({
              title: 'Error !',
              content: 'Failed to reject member.',
            });
          }
        },
      });
    },
    [confirm, success, handleSearch, handleInfoModalClose, error],
  );

  /**
   * 处理新增成员按钮点击
   */
  const handleAdd = useCallback(() => {
    setAddDrawerVisible(true);
  }, []);

  /**
   * 处理新增成员成功
   */
  const handleAddSuccess = useCallback(
    async (formData: AddMemberFormData) => {
      if (!currentParentNode?.key) return;
      if (!formData.role?.length) return;
      try {
        const { basicInfo, role } = formData || {};
        const requestParams = {
          email: basicInfo?.orgEmail || '',
          username: basicInfo?.orgUsername || '',
          phone: basicInfo?.orgPhone || '',
          roleIds: role || [],
          orgId: currentParentNode.key,
        };
        const result = await addMember(requestParams);
        if (result?.code === 200) {
          success({
            title: 'Success !',
            content: 'The user has been successfully added.',
          });
          handleSearch();
          setAddDrawerVisible(false);
        } else {
          error({
            title: 'Error !',
            content: result?.message || 'Failed to add member.',
          });
        }
      } catch (err) {
        console.error('Error adding member:', err);
        error({
          title: 'Error !',
          content: 'Failed to add member.',
        });
      }
    },
    [currentParentNode, handleSearch, success, error],
  );

  return (
    <div className={styles.container}>
      {/* 成员列表头部：状态筛选、搜索框、新增和重置按钮 */}
      <MemberListHeader
        status={status}
        keyword={keyword}
        onStatusChange={handleStatusChange}
        onReset={handleReset}
        onKeywordChange={handleKeywordChange}
        onAdd={handleAdd}
      />

      {/* 成员列表表格 */}
      <MemberTable
        loading={loading}
        members={members}
        current={current}
        pageSize={pageSize}
        total={total}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDisable={handleDisable}
        onEnable={handleEnable}
        onApprove={handleApprove}
        onReject={handleReject}
        onTableChange={handleTableChange}
        roleModalRef={roleModalRef as React.RefObject<AddRoleRef>}
      />

      {/* 成员信息模态框 */}
      <MemberInfoModal
        visible={infoModalVisible}
        member={selectedMember}
        onClose={handleInfoModalClose}
        onDelete={handleInfoDelete}
        onLock={handleInfoLock}
        onModify={handleEdit}
        onApprove={handleApprove}
        onReject={handleReject}
        onSave={handleSaveMember}
        currentParentNode={currentParentNode}
        editMember={editMember}
      />

      {/* 新增成员抽屉 */}
      <AddMemberDrawer
        visible={addDrawerVisible}
        onClose={() => setAddDrawerVisible(false)}
        onSuccess={handleAddSuccess}
        orgId={orgId}
        currentParentNode={currentParentNode}
      />

      <AddRole ref={roleModalRef} currentParentNode={currentParentNode} treeData={treeData} />
    </div>
  );
};

export default MemberList;
