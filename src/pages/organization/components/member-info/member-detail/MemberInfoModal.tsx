import React, { useCallback, useEffect, useState } from 'react';
import { OrganizationInfo } from '@pages/organization/components';
import type { Member, MemberDetail } from '@pages/organization/dto';
import type { TreeNodeData } from '@pages/organization/dto';
import { loadMemberDetail } from '@pages/organization/services/organizationService';

import { AntDrawer, AntForm, AntMessage, AntTabs } from '@/shared/components';

import Plants from '../org-tree/Plants';
import BasicInfo from './BasicInfo';
import MemberInfoFooter from './MemberInfoFooter';
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
    } catch (error) {
      AntMessage.error('Failed to load member information');
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
    <AntDrawer
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
      <AntTabs
        defaultActiveKey="basic"
        items={[
          {
            key: 'basic',
            label: 'Basic Info',
            children: (
              <BasicInfo
                member={memberDetail}
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
