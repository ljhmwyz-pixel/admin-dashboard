import React from 'react';
import type { FieldProps } from '@pages/organization/dto';
import type { Member } from '@pages/organization/types/memberList';

import { AntButton, AntSpace } from '@/shared/components';

interface MemberInfoFooterProps {
  /** 成员数据 */
  member: Member | null;
  /** 是否处于编辑状态 */
  editMember: boolean;
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
  /** 表单实例 */
  form: FieldProps['form'];
}

/**
 * 成员信息模态框底部按钮组件
 * 根据成员状态和编辑状态动态显示不同的操作按钮
 */
const MemberInfoFooter: React.FC<MemberInfoFooterProps> = ({
  member,
  editMember,
  onClose,
  onDelete,
  onLock,
  onModify,
  onApprove,
  onReject,
  form,
}) => {
  // 处理按钮点击事件，确保 member 不为 null
  const handleButtonClick = (callback: (member: Member) => void) => {
    if (member) {
      callback(member);
    }
  };

  // 生成按钮数组
  const renderButtons = () => {
    const buttons = [
      <AntButton key="cancel" onClick={onClose}>
        Cancel
      </AntButton>,
    ];

    // 如果没有成员数据，只返回取消按钮
    if (!member || member?.isOwner) {
      return buttons;
    }

    // 根据成员状态和编辑状态生成不同的按钮
    if (member.status === 'NORMAL' || member.status === 'LOCKED') {
      if (!editMember) {
        buttons.push(
          <AntButton key="delete" danger onClick={() => handleButtonClick(onDelete)}>
            Delete
          </AntButton>,
          <AntButton
            key={member.status === 'LOCKED' ? 'unlock' : 'lock'}
            onClick={() => handleButtonClick(onLock)}
          >
            {member.status === 'LOCKED' ? 'Unlock' : 'Lock'}
          </AntButton>,
        );
        if (!member?.isOwner) {
          buttons.push(
            <AntButton key="modify" type="primary" onClick={() => handleButtonClick(onModify)}>
              Modify
            </AntButton>,
          );
        }
      } else {
        buttons.push(
          <AntButton key="save" type="primary" onClick={() => form.submit()}>
            Confirm
          </AntButton>,
        );
      }
    } else if (member.status === 'WAITING') {
      buttons.push(
        <AntButton
          key="reject"
          danger
          onClick={() => handleButtonClick(onReject as (member: Member) => void)}
        >
          Reject
        </AntButton>,
        <AntButton
          key="approve"
          type="primary"
          onClick={() => handleButtonClick(onApprove as (member: Member) => void)}
        >
          Approve
        </AntButton>,
      );
    }

    return buttons;
  };

  return (
    <AntSpace style={{ width: '100%', justifyContent: 'flex-end' }}>{renderButtons()}</AntSpace>
  );
};

export default MemberInfoFooter;
