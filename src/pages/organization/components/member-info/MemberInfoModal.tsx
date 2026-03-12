import React, { useCallback, useEffect, useState } from 'react';
import type { Member, MemberDetail } from '@pages/organization/dto';
import type { TreeNodeData } from '@pages/organization/dto';
import { loadMemberDetail } from '@pages/organization/services/organizationService';
import { message } from 'antd';
import { Drawer, Tabs } from 'antd';

import { AntForm } from '@/shared/components';

import OrganizationInfo from '../organization-info/OrganizationInfo';
import BasicInfo from './BasicInfo';
import MemberInfoFooter from './MemberInfoFooter';
import Plants from './Plants';
import Record from './Record';

interface MemberInfoModalProps {
  visible: boolean;
  member: Member | null;
  parentNodeData?: TreeNodeData | null;
  onSave: (member: Member) => void;
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
  const [webPermissions, setWebPermissions] = useState<any[]>([]);
  const [phonePermissions, setPhonePermissions] = useState<any[]>([]);

  const [memberDetail, setMemberDetail] = useState<MemberDetail | null>(null);

  const [form] = AntForm.useForm();

  /**
   * 加载成员详情信息
   */
  const loadMemberInfo = useCallback(async () => {
    if (!member) return;

    setLoading(true);
    try {
      const detail = await loadMemberDetail(member.memberId);
      if (detail) {
        setMemberDetail(detail);
      }

      const mockPermissions = [
        { permission: 'Dashboard', roles: ['FAE'] },
        { permission: 'Large Screen', roles: ['FAE', 'CED'] },
        { permission: 'Plants Management', roles: ['FAE', 'CED'] },
        { permission: 'View Plants List', roles: ['FAE', 'CED'] },
        { permission: 'Export Plants List', roles: ['FAE', 'CED'] },
        { permission: 'Plants Overview', roles: ['CED'] },
        { permission: 'Energy Statistics', roles: ['CED'] },
        { permission: 'Device Management', roles: ['CED'] },
        { permission: 'Remote Control', roles: ['CED'] },
      ];

      const mockPhonePermissions = [
        { permission: 'Dashboard1111', roles: ['FAE'] },
        { permission: 'Large Screen', roles: ['FAE', 'CED'] },
        { permission: 'Plants Management', roles: ['FAE', 'CED'] },
        { permission: 'View Plants List', roles: ['FAE', 'CED'] },
        { permission: 'Export Plants List', roles: ['FAE', 'CED'] },
        { permission: 'Plants Overview', roles: ['CED'] },
        { permission: 'Energy Statistics', roles: ['CED'] },
        { permission: 'Device Management', roles: ['CED'] },
        { permission: 'Remote Control', roles: ['CED'] },
      ];
      setWebPermissions(mockPermissions);
      setPhonePermissions(mockPhonePermissions);
    } catch (error) {
      message.error('Failed to load member information');
      console.error('Error loading member information:', error);
    } finally {
      setLoading(false);
    }
  }, [member]);

  useEffect(() => {
    if (visible && member) {
      loadMemberInfo();
    }
  }, [visible, member, loadMemberInfo]);

  if (!memberDetail) return null;

  return (
    <Drawer
      title="Member Info"
      open={visible}
      onClose={onClose}
      placement="right"
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
      <Tabs
        defaultActiveKey="basic"
        items={[
          {
            key: 'basic',
            label: 'Basic Info',
            children: (
              <BasicInfo
                member={memberDetail}
                loading={loading}
                webPermissions={webPermissions}
                phonePermissions={phonePermissions}
                editMember={editMember}
                onSave={onSave}
                form={form}
              />
            ),
          },
          {
            key: 'plants',
            label: 'Plants',
            children: <Plants member={memberDetail} />,
          },
          {
            key: 'record',
            label: 'Record',
            children: <Record member={memberDetail} />,
          },
        ]}
      />
    </Drawer>
  );
};

export default MemberInfoModal;
