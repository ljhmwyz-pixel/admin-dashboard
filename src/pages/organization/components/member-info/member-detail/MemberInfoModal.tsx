import React, { useCallback, useEffect, useState } from 'react';
import { OrganizationInfo } from '@pages/organization/components';
import type {
  Member,
  MemberDetail,
  PreviewMemberPermissionData,
  Record as RoleRecord,
  TreeNodeData,
} from '@pages/organization/dto';
import {
  loadMemberApplicationDetail,
  loadMemberDetail,
  loadMemberPermission,
  loadMemberPermissions,
  loadRoles,
} from '@pages/organization/services/organizationService';

import { AntDrawer, AntForm, AntMessage, AntTabs } from '@/shared/components';

import Plants from '../org-tree/Plants';
import BasicInfo from './BasicInfo';
import MemberInfoFooter from './MemberInfoFooter';
import Record from './Record';

/**
 * MemberInfoModal 组件属性接口
 */
interface MemberInfoModalProps {
  /** 模态框是否可见 */
  visible: boolean;
  /** 成员数据 */
  member: Member | null;
  /** 当前父组织节点数据 */
  currentParentNode?: TreeNodeData | null;
  /** 保存回调 */
  onSave: (member: Member, roleIds: string[]) => void;
  /** 关闭回调 */
  onClose: () => void;
  /** 删除回调 */
  onDelete: (member: Member) => void;
  /** 锁定/解锁回调 */
  onLock: (member: Member) => void;
  /** 修改回调 */
  onModify: (member: Member) => void;
  /** 审批通过回调 */
  onApprove?: (member: Member) => void;
  /** 审批拒绝回调 */
  onReject?: (member: Member) => void;
  /** 是否处于编辑状态 */
  editMember?: boolean;
}

/**
 * 成员信息查看模态框组件
 * 包含 Basic info、Plants、Record 三个标签页
 *
 * 功能特性：
 * - 支持查看成员基本信息
 * - 支持查看关联电站
 * - 支持查看操作记录
 * - 支持编辑成员信息（角色、状态）
 * - 支持删除/锁定/解锁成员
 * - 支持审批加入申请
 */
const MemberInfoModal: React.FC<MemberInfoModalProps> = ({
  visible,
  member,
  currentParentNode,
  onClose,
  onDelete,
  onLock,
  onModify,
  onApprove,
  onReject,
  onSave,
  editMember = false,
}) => {
  const [loading, setLoading] = useState(false);

  const [memberDetail, setMemberDetail] = useState<MemberDetail | null>(null);
  const [roleList, setRoleList] = useState<RoleRecord[]>([]);
  const [permissionList, setPermissionList] = useState<PreviewMemberPermissionData>();

  const [form] = AntForm.useForm();

  /**
   * 加载成员详情信息
   * 根据 memberId 或 applicationId 加载不同的数据
   */
  const loadMemberInfo = useCallback(async () => {
    // 参数验证：必须包含 memberId 或 applicationId
    if (!member?.memberId && !member?.applicationId) {
      setMemberDetail(null);
      return;
    }

    setLoading(true);
    try {
      // 正式成员：加载详细信息和权限
      if (member?.memberId) {
        // 加载成员详情
        const detailRes = await loadMemberDetail(member.memberId);
        if (detailRes?.data) {
          setMemberDetail(detailRes.data);
        }

        // 加载成员权限
        const permissionRes = await loadMemberPermission(member.memberId);
        if (permissionRes?.data) {
          setPermissionList(permissionRes.data);
        }

        // 加载角色列表
        const roleListRes = await loadRoles({
          orgId: member.orgId,
          pageNum: 1,
          pageSize: 1000,
        });
        if (roleListRes?.data?.records) {
          setRoleList(roleListRes.data.records);
        }
      }
      // 申请中的成员：仅加载基本信息
      else if (member?.applicationId) {
        const applicationRes = await loadMemberApplicationDetail(member.applicationId);
        if (applicationRes?.data) {
          setMemberDetail(applicationRes.data);
        }
      }
    } catch (error) {
      console.error('Error loading member information:', error);
      AntMessage.error('Failed to load member information');
    } finally {
      setLoading(false);
    }
  }, [member]);

  /**
   * 更新成员权限预览
   * 根据选择的角色 ID 列表加载对应的权限清单
   * @param roleIds - 角色 ID 数组
   */
  const updateMemberPreviewPermission = useCallback(
    async (roleIds: string[]) => {
      // 参数验证：至少需要一个角色 ID
      if (!roleIds?.length) {
        return;
      }

      setLoading(true);
      try {
        const res = await loadMemberPermissions({ roleIds });
        if (res && res.data) {
          setPermissionList(res.data);
        }
      } catch (error) {
        console.error('Error loading member permissions:', error);
        AntMessage.error('Failed to load permissions');
      } finally {
        setLoading(false);
      }
    },
    [], // 不依赖外部变量，使用最新的数据
  );

  /**
   * 监听模态框可见性和成员数据变化
   * 当模态框打开且有有效成员数据时，自动加载成员信息
   */
  useEffect(() => {
    if (visible && (member?.memberId || member?.applicationId)) {
      loadMemberInfo();
    } else {
      // 关闭模态框或没有成员数据时，清空详情
      setMemberDetail(null);
    }
  }, [visible, member, loadMemberInfo]);

  // 如果没有成员详情数据，不渲染内容
  if (!memberDetail) {
    return null;
  }

  return (
    <AntDrawer
      title="Member Info"
      open={visible}
      onClose={onClose}
      placement="right"
      destroyOnHidden
      size="60%"
      footer={
        <MemberInfoFooter
          member={member}
          onClose={onClose}
          onDelete={onDelete}
          onLock={onLock}
          onModify={onModify}
          onApprove={onApprove}
          onReject={onReject}
          editMember={editMember}
          form={form}
        />
      }
    >
      {currentParentNode && (
        <OrganizationInfo
          orgName={currentParentNode?.title}
          orgType={currentParentNode?.type}
          orgId={currentParentNode?.key}
        />
      )}
      <AntTabs
        defaultActiveKey="basic"
        items={[
          {
            key: 'basic',
            label: 'Basic Info',
            children: (
              <BasicInfo
                member={memberDetail}
                permissionList={permissionList}
                updateMemberPreviewPermission={updateMemberPreviewPermission}
                roleOptionList={roleList}
                loading={loading}
                editMember={editMember}
                onSave={onSave}
                form={form}
              />
            ),
          },
          {
            key: 'plants',
            label: 'Plants',
            children: <Plants member={memberDetail} editMember={editMember} />,
          },
          {
            key: 'record',
            label: 'Record',
            children: <Record member={memberDetail} />,
          },
        ]}
      />
    </AntDrawer>
  );
};

export default MemberInfoModal;
