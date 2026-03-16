import React from 'react';
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import type { Member } from '@pages/organization/dto';
import { AntButton, AntPopover, AntSpace, AntSwitch, AntTooltip } from '@shared/components';
import { PermissionCode } from '@shared/constants/permissions';

import { Permission } from '@/components/Permission';

import styles from './MemberList.module.scss';

/**
 * MemberOperationButtons 组件属性接口
 */
interface MemberOperationButtonsProps {
  /** 成员数据 */
  member: Member;
  /** 查看成员详情回调 */
  onView: (member: Member) => void;
  /** 编辑成员信息回调 */
  onEdit: (member: Member) => void;
  /** 删除成员回调 */
  onDelete: (member: Member) => void;
  /** 禁用成员回调 */
  onDisable: (member: Member) => void;
  /** 启用成员回调 */
  onEnable: (member: Member) => void;
  /** 通过申请回调 */
  onApprove: (member: Member) => void;
  /** 拒绝申请回调 */
  onReject: (member: Member) => void;
}

/**
 * 成员操作按钮组件
 * 根据权限控制显示操作按钮，支持按钮数量自动折叠
 * - 不超过4个按钮：直接显示所有按钮
 * - 超过4个按钮：显示前3个，第4个替换为"更多"按钮，点击展开剩余按钮
 */
const MemberOperationButtons: React.FC<MemberOperationButtonsProps> = ({
  member,
  onView,
  onEdit,
  onDelete,
  onDisable,
  onEnable,
  onApprove,
  onReject,
}) => {
  /** 根据用户状态生成操作按钮数组，使用 Permission 组件包裹实现权限控制 */
  const getButtonsByStatus = () => {
    const buttons = [];

    // 查看详情按钮 - 所有状态都显示
    buttons.push(
      <Permission key="view" value={PermissionCode.MEMBER_VIEW}>
        <AntTooltip title="View details">
          <AntButton icon={<EyeOutlined />} size="small" onClick={() => onView(member)} />
        </AntTooltip>
      </Permission>,
    );

    switch (member.status) {
      case 'NORMAL':
        // Normal 状态：编辑、禁用、删除
        buttons.push(
          <Permission key="edit" value={PermissionCode.MEMBER_EDIT}>
            <AntTooltip title="Edit info">
              <AntButton icon={<EditOutlined />} size="small" onClick={() => onEdit(member)} />
            </AntTooltip>
          </Permission>,
          <Permission key="delete" value={PermissionCode.MEMBER_DELETE}>
            <AntTooltip title="Delete">
              <AntButton
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => onDelete(member)}
              />
            </AntTooltip>
          </Permission>,
          <Permission key="toggleStatus" value={PermissionCode.MEMBER_DISABLE}>
            <AntTooltip title="Disable">
              <div className={styles['switch-container']} onClick={() => onDisable(member)}>
                <AntSwitch checked={false} />
              </div>
            </AntTooltip>
          </Permission>,
        );
        break;

      case 'LOCKED':
        // Locked 状态：编辑、启用、删除
        buttons.push(
          <Permission key="edit" value={PermissionCode.MEMBER_EDIT}>
            <AntTooltip title="Edit info">
              <AntButton icon={<EditOutlined />} size="small" onClick={() => onEdit(member)} />
            </AntTooltip>
          </Permission>,
          <Permission key="delete" value={PermissionCode.MEMBER_DELETE}>
            <AntTooltip title="Delete">
              <AntButton
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => onDelete(member)}
              />
            </AntTooltip>
          </Permission>,
          <Permission key="toggleStatus" value={PermissionCode.MEMBER_ENABLE}>
            <AntTooltip title="Enable">
              <div className={styles['switch-container']} onClick={() => onEnable(member)}>
                <AntSwitch checked={true} />
              </div>
            </AntTooltip>
          </Permission>,
        );
        break;

      case 'WAITING':
        // Waiting 状态：通过、拒绝
        buttons.push(
          <Permission key="approve" value={PermissionCode.MEMBER_APPROVE}>
            <AntTooltip title="Approve request">
              <AntButton size="small" onClick={() => onApprove(member)}>
                Approve
              </AntButton>
            </AntTooltip>
          </Permission>,
          <Permission key="reject" value={PermissionCode.MEMBER_REJECT}>
            <AntTooltip title="Reject request">
              <AntButton danger size="small" onClick={() => onReject(member)}>
                Reject
              </AntButton>
            </AntTooltip>
          </Permission>,
        );
        break;

      case 'REJECTED':
        // Rejected 状态：只显示查看按钮
        break;

      default:
        break;
    }

    return buttons;
  };

  const allButtons = getButtonsByStatus();

  console.log(allButtons, 'allButtons');

  /** 如果按钮数量不超过4个，直接返回所有按钮 */
  if (allButtons.length <= 4) {
    return <>{allButtons}</>;
  }

  /** 如果超过4个按钮，显示前3个按钮，第4个替换为更多按钮 */
  const visibleButtons = allButtons.slice(0, 3);
  const remainingButtons = allButtons.slice(3);

  /** 添加更多按钮，点击展开剩余按钮 */
  visibleButtons.push(
    <AntPopover
      key="more"
      content={<AntSpace direction="vertical">{remainingButtons}</AntSpace>}
      title="More Actions"
      trigger="click"
    >
      <AntTooltip title="More actions">
        <AntButton icon={<MoreOutlined />} size="small" />
      </AntTooltip>
    </AntPopover>,
  );

  return <>{visibleButtons}</>;
};

export default MemberOperationButtons;
