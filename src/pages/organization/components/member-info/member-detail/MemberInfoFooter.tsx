import React from 'react';
import type { FieldProps } from '@pages/organization/dto';
import type { Member } from '@pages/organization/types/memberList';
import clx from 'classnames';

import { FormButton } from '@/components';
import { AntSpace } from '@/shared/components';

import styles from './MemberInfoFooter.module.scss';

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
  /** 自定义类名 */
  className?: string;
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
  className,
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
      <FormButton
        key="cancel"
        className={clx(styles.cancelButton, styles.button)}
        onClick={onClose}
      >
        Cancel
      </FormButton>,
    ];

    // 如果没有成员数据，只返回取消按钮
    if (!member || member?.isOwner) {
      return buttons;
    }

    // 根据成员状态和编辑状态生成不同的按钮
    if (member.status === 'NORMAL' || member.status === 'LOCKED') {
      if (!editMember) {
        buttons.push(
          <FormButton
            key="delete"
            className={clx(styles.deleteButton, styles.button)}
            onClick={() => handleButtonClick(onDelete)}
          >
            Delete
          </FormButton>,
          <FormButton
            key={member.status === 'LOCKED' ? 'unlock' : 'lock'}
            className={clx(styles.lockButton, styles.button)}
            onClick={() => handleButtonClick(onLock)}
          >
            {member.status === 'LOCKED' ? 'Unlock' : 'Lock'}
          </FormButton>,
        );
        if (!member?.isOwner) {
          buttons.push(
            <FormButton
              key="modify"
              type="primary"
              variant="solid"
              className={clx(styles.modifyButton, styles.button)}
              onClick={() => handleButtonClick(onModify)}
            >
              Modify
            </FormButton>,
          );
        }
      } else {
        buttons.push(
          <FormButton
            key="save"
            type="primary"
            variant="solid"
            className={clx(styles.confirmButton, styles.button)}
            onClick={() => form.submit()}
          >
            Confirm
          </FormButton>,
        );
      }
    } else if (member.status === 'WAITING') {
      buttons.push(
        <FormButton
          key="reject"
          className={clx(styles.rejectButton, styles.button)}
          onClick={() => handleButtonClick(onReject as (member: Member) => void)}
        >
          Reject
        </FormButton>,
        <FormButton
          key="approve"
          type="primary"
          variant="solid"
          className={clx(styles.approveButton, styles.button)}
          onClick={() => handleButtonClick(onApprove as (member: Member) => void)}
        >
          Approve
        </FormButton>,
      );
    }

    return buttons;
  };

  return (
    <AntSpace size={30} className={className}>
      {renderButtons()}
    </AntSpace>
  );
};

export default MemberInfoFooter;
