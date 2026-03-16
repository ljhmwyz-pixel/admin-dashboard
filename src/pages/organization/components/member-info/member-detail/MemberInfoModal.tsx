import React, { useCallback, useEffect, useState } from 'react';
import { OrganizationInfo } from '@pages/organization/components';
import type { Member, MemberDetail, PreviewMemberPermissionData } from '@pages/organization/dto';
import type { Record as RoleRecord, TreeNodeData } from '@pages/organization/dto';
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

interface MemberInfoModalProps {
  visible: boolean;
  member: Member | null;
  parentNodeData?: TreeNodeData | null;
  onSave: (member: Member, roleIds: string[]) => void;
  onClose: () => void;
  onDelete: (member: Member) => void;
  onLock: (member: Member) => void;
  onModify: (member: Member) => void;
  onApprove?: (member: Member) => void;
  onReject?: (member: Member) => void;
  editMember?: boolean;
}

/**
 * 成员信息查看模态框组件
 * 包含 Basic info、Plants、Record 三个标签页
 */
const MemberInfoModal: React.FC<MemberInfoModalProps> = ({
  visible,
  member,
  parentNodeData,
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
   */
  const loadMemberInfo = useCallback(async () => {
    if (!member?.memberId && !member?.applicationId) {
      setMemberDetail(null);
      return;
    }
    setLoading(true);
    try {
      let res;
      if (member?.memberId) {
        res = await loadMemberDetail(member.memberId);
        const response = await loadMemberPermission(member.memberId);
        if (response?.data) {
          setPermissionList(response.data);
        }
        const roleList = await loadRoles({
          orgId: member.orgId,
          pageNum: 1,
          pageSize: 1000,
        });
        if (roleList?.data?.records) {
          setRoleList(roleList.data.records);
        }
      } else if (member?.applicationId) {
        res = await loadMemberApplicationDetail(member.applicationId);
        // setPermissionList({ appPermissions: res?.data?.permissions || [] });
      }
      if (res?.data) {
        setMemberDetail(res.data);
      }
    } catch (error) {
      AntMessage.error('Failed to load member information');
      console.error('Error loading member information:', error);
    } finally {
      setLoading(false);
    }
  }, [member]);

  const updateMemberPreviewPermission = async (roleIds: string[]) => {
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
      AntMessage.error('Failed to load member information');
      console.error('Error loading member information:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && (member?.memberId || member?.applicationId)) {
      loadMemberInfo();
    } else {
      setMemberDetail(null);
    }
  }, [visible, member, loadMemberInfo]);

  if (!memberDetail) return null;

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
      {parentNodeData && (
        <OrganizationInfo
          orgName={parentNodeData?.title}
          orgType={parentNodeData?.type}
          orgId={parentNodeData?.key}
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
