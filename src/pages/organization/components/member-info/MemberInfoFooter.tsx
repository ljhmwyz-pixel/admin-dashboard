import React from 'react';
import type { Member } from '@pages/organization/types/memberList';
import { Button, type FormInstance, Space } from 'antd';

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
  form: FormInstance;
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

  console.log(member, editMember);

  // 生成按钮数组
  const renderButtons = () => {
    const buttons = [
      <Button key="cancel" onClick={onClose}>
        Cancel
      </Button>,
    ];

    // 如果没有成员数据，只返回取消按钮
    if (!member) {
      return buttons;
    }

    // 根据成员状态和编辑状态生成不同的按钮
    if (member.status === 'NORMAL' || member.status === 'LOCKED') {
      if (!editMember) {
        buttons.push(
          <Button key="delete" danger onClick={() => handleButtonClick(onDelete)}>
            Delete
          </Button>,
          <Button
            key={member.status === 'LOCKED' ? 'unlock' : 'lock'}
            onClick={() => handleButtonClick(onLock)}
          >
            {member.status === 'LOCKED' ? 'Unlock' : 'Lock'}
          </Button>,
          <Button key="modify" type="primary" onClick={() => handleButtonClick(onModify)}>
            Modify
          </Button>,
        );
      } else {
        buttons.push(
          <Button key="save" type="primary" onClick={() => form.submit()}>
            Confirm
          </Button>,
        );
      }
    } else if (member.status === 'WAITING') {
      buttons.push(
        <Button
          key="approve"
          type="primary"
          onClick={() => handleButtonClick(onApprove as (member: Member) => void)}
        >
          Approve
        </Button>,
        <Button
          key="reject"
          danger
          onClick={() => handleButtonClick(onReject as (member: Member) => void)}
        >
          Reject
        </Button>,
      );
    }

    return buttons;
  };

  return <Space style={{ width: '100%', justifyContent: 'flex-end' }}>{renderButtons()}</Space>;
};

export default MemberInfoFooter;
