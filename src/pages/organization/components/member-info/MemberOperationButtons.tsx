import React from 'react';
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import type { Member } from '@pages/organization/dto';
import { PermissionCode } from '@shared/constants/permissions';
import { Button, Popover, Space, Switch, Tooltip } from 'antd';

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
  /** 所有操作按钮数组，使用 Permission 组件包裹实现权限控制 */
  const allButtons = [
    /** 查看详情按钮 - 需要 MEMBER_VIEW 权限 */
    <Permission key="view" value={PermissionCode.MEMBER_VIEW}>
      <Tooltip title="View details">
        <Button icon={<EyeOutlined />} size="small" onClick={() => onView(member)} />
      </Tooltip>
    </Permission>,

    /** 编辑信息按钮 - 需要 MEMBER_EDIT 权限 */
    <Permission key="edit" value={PermissionCode.MEMBER_EDIT}>
      <Tooltip title="Edit info">
        <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(member)} />
      </Tooltip>
    </Permission>,

    /** 删除按钮 - 需要 MEMBER_DELETE 权限 */
    <Permission key="delete" value={PermissionCode.MEMBER_DELETE}>
      <Tooltip title="Delete">
        <Button danger icon={<DeleteOutlined />} size="small" onClick={() => onDelete(member)} />
      </Tooltip>
    </Permission>,

    /** 启用/禁用按钮 - 需要 MEMBER_DISABLE 或 MEMBER_ENABLE 权限（满足任一即可） */
    <Permission
      key="toggleStatus"
      value={[PermissionCode.MEMBER_DISABLE, PermissionCode.MEMBER_ENABLE]}
      mode="any"
    >
      <Tooltip title={member.status === 'LOCKED' ? 'Enable' : 'Disable'}>
        <div
          className={styles['switch-container']}
          onClick={() => (member.status === 'LOCKED' ? onEnable(member) : onDisable(member))}
        >
          <Switch checked={member.status === 'LOCKED'} />
        </div>
      </Tooltip>
    </Permission>,

    /** 通过申请按钮 - 需要 MEMBER_APPROVE 权限 */
    <Permission key="approve" value={PermissionCode.MEMBER_APPROVE}>
      <Tooltip title="Approve request">
        <Button size="small" onClick={() => onApprove(member)}>
          Approve
        </Button>
      </Tooltip>
    </Permission>,

    /** 拒绝申请按钮 - 需要 MEMBER_REJECT 权限 */
    <Permission key="reject" value={PermissionCode.MEMBER_REJECT}>
      <Tooltip title="Reject request">
        <Button danger size="small" onClick={() => onReject(member)}>
          Reject
        </Button>
      </Tooltip>
    </Permission>,
  ];

  /** 如果按钮数量不超过4个，直接返回所有按钮 */
  if (allButtons.length <= 4) {
    return <>{allButtons}</>;
  }

  /** 如果超过4个按钮，显示前3个按钮，第4个替换为更多按钮 */
  const visibleButtons = allButtons.slice(0, 3);
  const remainingButtons = allButtons.slice(3);

  /** 添加更多按钮，点击展开剩余按钮 */
  visibleButtons.push(
    <Popover
      key="more"
      content={<Space direction="vertical">{remainingButtons}</Space>}
      title="More Actions"
      trigger="click"
    >
      <Tooltip title="More actions">
        <Button icon={<MoreOutlined />} size="small" />
      </Tooltip>
    </Popover>,
  );

  return <>{visibleButtons}</>;
};

export default MemberOperationButtons;
