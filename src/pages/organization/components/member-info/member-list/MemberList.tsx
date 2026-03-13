import React, { useState } from 'react';
import type { Member, TreeNodeData } from '@pages/organization/dto';
import { useMemberList } from '@pages/organization/hooks';
import { updateMember } from '@pages/organization/services/organizationService';
import { getParentNode } from '@pages/organization/utils';
import { AntMessage } from '@shared/components';

import AddMemberDrawer from '../add-member/AddMemberDrawer';
import MemberInfoModal from '../member-info/MemberInfoModal';
import MemberListHeader from './MemberListHeader';
import MemberTable from './MemberTable';

import styles from './MemberList.module.scss';

/**
 * MemberList 组件属性接口
 */
interface MemberListProps {
  /** 组织ID，用于查询成员列表 */
  orgId: string;
  /** 当前节点*/
  currentParentNode?: TreeNodeData;
  /** 树数据 */
  treeData?: TreeNodeData[];
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

  // 获取父节点信息
  const parentNodeData =
    currentParentNode?.key && treeData ? getParentNode(treeData, currentParentNode.key) : null;

  /**
   * 处理查看成员详情操作
   * 完整展示成员的基本信息、平台权限范围和数据权限范围
   */
  const handleView = (member: Member) => {
    setSelectedMember(member);
    setInfoModalVisible(true);
  };

  /**
   * 处理成员信息模态框关闭
   */
  const handleInfoModalClose = () => {
    if (editMember) {
      setEditMember(false);
      return;
    }
    setInfoModalVisible(false);
    setEditMember(false);
    setSelectedMember(null);
  };

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
  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    if (!infoModalVisible) {
      setInfoModalVisible(true);
    }
    setEditMember(true);
  };

  /**
   * 处理模态框中的保存操作
   */
  const handleSaveMember = async (member: Member) => {
    try {
      // 调用更新接口
      const { memberId, status, roleId } = member;
      const result = await updateMember(memberId, { status, roleId });
      if (result.success) {
        AntMessage.success('更新成功');
        setEditMember(false);
        handleSearch();
      } else {
        AntMessage.error(result.message || '更新失败');
      }
    } catch (error) {
      console.error('Error updating member:', error);
      AntMessage.error('更新失败');
    }
  };

  /**
   * 处理删除成员操作
   * 限制组织所有者不可被删除
   */
  const handleDelete = (member: Member) => {
    if (member.roleName === 'Organization Owner') {
      AntMessage.error('Organization owner cannot be deleted');
      return;
    }
    // TODO: 实现确认对话框，提示删除后的数据处理规则及不可恢复性
    AntMessage.info(`Deleting member: ${member.username}`);
  };

  /**
   * 处理禁用成员操作
   * 禁用后成员无法登录系统及使用相关功能
   */
  const handleDisable = (member: Member) => {
    AntMessage.info(`Disabling member: ${member.username}`);
    // TODO: 实现禁用功能并记录操作日志
  };

  /**
   * 处理启用成员操作
   * 启用后恢复正常访问权限
   */
  const handleEnable = (member: Member) => {
    AntMessage.info(`Enabling member: ${member.username}`);
    // TODO: 实现启用功能并记录操作日志
  };

  /**
   * 处理通过加入组织申请操作
   * 审批通过后需将成员状态更新为正常，并分配默认权限
   */
  const handleApprove = (member: Member) => {
    AntMessage.info(`Approving member: ${member.username}`);
    // TODO: 实现审批通过功能，更新状态为正常并分配默认权限
  };

  /**
   * 处理拒绝加入组织申请操作
   * 拒绝时需填写拒绝原因（可选），操作后将成员状态更新为拒绝状态并通知申请人
   */
  const handleReject = (member: Member) => {
    AntMessage.info(`Rejecting member: ${member.username}`);
    // TODO: 实现拒绝功能，填写拒绝原因并更新状态
  };

  /**
   * 处理新增成员按钮点击
   */
  const handleAdd = () => {
    setAddDrawerVisible(true);
  };

  /**
   * 处理新增成员成功
   */
  const handleAddSuccess = () => {
    setAddDrawerVisible(false);
    handleSearch();
    AntMessage.success('新增成员成功');
  };

  return (
    <div className={styles.container}>
      {/* 成员列表头部：状态筛选、搜索框、新增和重置按钮 */}
      <MemberListHeader
        status={status}
        keyword={keyword}
        onStatusChange={handleStatusChange}
        onSearch={handleSearch}
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
        parentNodeData={parentNodeData}
        editMember={editMember}
      />

      {/* 新增成员抽屉 */}
      <AddMemberDrawer
        visible={addDrawerVisible}
        onClose={() => setAddDrawerVisible(false)}
        onSuccess={handleAddSuccess}
        orgId={orgId}
        parentNodeData={parentNodeData}
      />
    </div>
  );
};

export default MemberList;
