import React from 'react';
import type { Member } from '@pages/organization/dto';
import { AntSpace, AntTooltip } from '@shared/components';
import { PermissionCode } from '@shared/constants/permissions';

import { Permission } from '@/components/Permission';

/**
 * 操作按钮图标组件
 */
const ViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15.3141 8.00028C15.3141 8.78346 12.0394 13.1431 7.99983 13.1431C3.96026 13.1431 0.685547 8.78346 0.685547 8.00028C0.685547 7.2171 3.96026 2.85742 7.99983 2.85742C12.0394 2.85742 15.3141 7.2171 15.3141 8.00028Z"
      stroke="#191B1F"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M10.2858 7.99958C10.2858 9.26195 9.26243 10.2853 8.00007 10.2853C6.7377 10.2853 5.71436 9.26195 5.71436 7.99958C5.71436 6.73722 6.7377 5.71387 8.00007 5.71387"
      stroke="#33C2C8"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.59171 1.82879C9.22289 0.735546 10.6208 0.360973 11.7141 0.992156C12.8073 1.62334 13.1819 3.02126 12.5507 4.1145L8.73416 10.7249C8.63121 10.9032 8.48202 11.0504 8.30233 11.1509L5.01355 12.9905C4.86239 13.0751 4.67577 12.9673 4.67342 12.7941L4.62218 9.02617C4.61938 8.82031 4.67224 8.61751 4.77518 8.4392L8.59171 1.82879Z"
      stroke="#191B1F"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path d="M0.685547 15.3105H15.314" stroke="#33C2C8" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.4289 2.97126V1.8284C11.4289 1.19722 10.9172 0.685547 10.286 0.685547H5.7146C5.08342 0.685547 4.57174 1.19722 4.57174 1.8284V2.97126M0.686035 3.42841H15.3146M2.28603 3.42841H13.7146V13.0284C13.7146 14.2908 12.6912 15.3141 11.4289 15.3141H4.57174C3.30938 15.3141 2.28603 14.2908 2.28603 13.0284V3.42841Z"
      stroke="#191B1F"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M6.28564 6.85742V11.886M9.71422 6.85742V11.886"
      stroke="#F45858"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const DisableIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 4.68555C4 2.47641 5.79086 0.685547 8 0.685547C10.2091 0.685547 12 2.47641 12 4.68555V6.17125H4V4.68555Z"
      stroke="#F45858"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path d="M8 9.71387V11.9996" stroke="#F45858" strokeWidth="1.2" strokeLinecap="round" />
    <path
      d="M0.685547 8.45759C0.685547 7.19522 1.7089 6.17188 2.97126 6.17188H13.0284C14.2908 6.17188 15.3141 7.19522 15.3141 8.45759V13.029C15.3141 14.2914 14.2908 15.3147 13.0284 15.3147H2.97126C1.7089 15.3147 0.685547 14.2914 0.685547 13.029V8.45759Z"
      stroke="#191B1F"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const EnableIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 5.14268V4.68555C4 2.47641 5.79086 0.685547 8 0.685547C9.30865 0.685547 10.4705 1.31399 11.2003 2.28554"
      stroke="#33C2C8"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M7.99983 9.71474V12.0005M2.97126 15.3147H13.0284C14.2908 15.3147 15.3141 14.2914 15.3141 13.029V8.45759C15.3141 7.19522 14.2908 6.17188 13.0284 6.17188H2.97126C1.7089 6.17188 0.685547 7.19522 0.685547 8.45759V13.029C0.685547 14.2914 1.7089 15.3147 2.97126 15.3147Z"
      stroke="#33C2C8"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M13.0284 6.17188H2.97126C1.7089 6.17188 0.685547 7.19522 0.685547 8.45759V13.029C0.685547 14.2914 1.7089 15.3147 2.97126 15.3147H13.0284C14.2908 15.3147 15.3141 14.2914 15.3141 13.029V8.45759C15.3141 7.19522 14.2908 6.17188 13.0284 6.17188Z"
      stroke="#191B1F"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const ApproveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.99184 1.49837C9.47786 0.99593 8.776 0.685547 8.00028 0.685547C7.22429 0.685547 6.52176 0.99587 6.0075 1.49847C5.69185 1.80697 5.25322 1.98863 4.81189 1.99378C4.09301 2.00216 3.37709 2.27972 2.8284 2.8284C2.27972 3.37709 2.00217 4.09301 1.99378 4.81189C1.98863 5.25322 1.80696 5.69185 1.49847 6.0075C0.995869 6.52176 0.685547 7.22429 0.685547 8.00028C0.685547 8.776 0.995929 9.47786 1.49837 9.99184C1.80694 10.3075 1.9885 10.7463 1.99355 11.1877C2.00177 11.9069 2.27948 12.6232 2.8284 13.1722C3.37706 13.7208 4.0928 13.9978 4.81157 14.0059C5.25307 14.0109 5.69184 14.1927 6.00747 14.5014C6.52164 15.0044 7.22407 15.315 8.00028 15.315C8.77622 15.315 9.47798 15.0043 9.99187 14.5015C10.3075 14.1927 10.7464 14.011 11.188 14.0061C11.9071 13.9982 12.6233 13.7211 13.1722 13.1722C13.7211 12.6233 13.9982 11.9071 14.0061 11.188C14.011 10.7464 14.1927 10.3075 14.5015 9.99187C15.0043 9.47798 15.315 8.77622 15.315 8.00028C15.315 7.22407 15.0044 6.52164 14.5014 6.00747C14.1927 5.69184 14.0109 5.25307 14.0059 4.81158C13.9978 4.0928 13.7208 3.37706 13.1722 2.8284C12.6232 2.27948 11.9069 2.00177 11.1877 1.99355C10.7463 1.9885 10.3075 1.80694 9.99184 1.49837Z"
      stroke="#191B1F"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M4.57129 7.76479L6.95024 10.2551C6.98867 10.2954 7.05187 10.2954 7.09029 10.2551L11.4284 5.71387"
      stroke="#33C2C8"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const RejectIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.39861 1.05271C8.98556 0.819062 8.50856 0.685547 7.99979 0.685547C7.49066 0.685547 7.01315 0.819133 6.59969 1.05297C5.83133 1.48751 4.92783 1.86172 4.07732 2.09805C3.6198 2.22518 3.18787 2.46845 2.82792 2.8284C2.46796 3.18836 2.2247 3.62029 2.09756 4.07781C1.86123 4.92831 1.48702 5.83182 1.05248 6.60018C0.818645 7.01364 0.685059 7.49115 0.685059 8.00028C0.685059 8.50905 0.818572 8.98604 1.05222 9.3991C1.48689 10.1675 1.86099 11.0712 2.09721 11.9219C2.22434 12.3797 2.46775 12.812 2.82792 13.1722C3.18772 13.532 3.61938 13.7749 4.07664 13.9018C4.92752 14.138 5.83126 14.5124 6.59976 14.9474C7.01314 15.1813 7.49059 15.315 7.99979 15.315C8.50863 15.315 8.98557 15.1814 9.39855 14.9476C10.1671 14.5125 11.071 14.1383 11.9221 13.9022C12.3797 13.7753 12.8116 13.5322 13.1717 13.1722C13.5317 12.8121 13.7748 12.3802 13.9017 11.9226C14.1378 11.0715 14.5121 10.1676 14.9471 9.39903C15.1809 8.98606 15.3145 8.50912 15.3145 8.00028C15.3145 7.49108 15.1808 7.01363 14.9469 6.60025C14.5119 5.83175 14.1375 4.92801 13.9014 4.07713C13.7744 3.61988 13.5315 3.18821 13.1717 2.8284C12.8115 2.46824 12.3793 2.22483 11.9214 2.0977C11.0707 1.86148 10.1671 1.48738 9.39861 1.05271Z"
      stroke="#191B1F"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M5.58252 5.55957L7.72378 7.70083L10.4179 10.4217"
      stroke="#F45858"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 操作按钮组件
 */
const OperationButton = ({
  children,
  onClick,
  title,
  permission,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  permission: string;
}) => (
  <Permission value={permission}>
    <AntTooltip title={title} placement="bottom">
      <span onClick={onClick}>{children}</span>
    </AntTooltip>
  </Permission>
);

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
      <OperationButton
        key="view"
        onClick={() => onView(member)}
        title="View"
        permission={PermissionCode.MEMBER_VIEW}
      >
        <ViewIcon />
      </OperationButton>,
    );

    switch (member.status) {
      case 'NORMAL':
        // Normal 状态：编辑、禁用、删除
        buttons.push(
          <OperationButton
            key="edit"
            onClick={() => onEdit(member)}
            title="Edit"
            permission={PermissionCode.MEMBER_EDIT}
          >
            <EditIcon />
          </OperationButton>,
          <OperationButton
            key="toggleStatus"
            onClick={() => onDisable(member)}
            title="Unlock"
            permission={PermissionCode.MEMBER_DISABLE}
          >
            <EnableIcon />
          </OperationButton>,
          <OperationButton
            key="delete"
            onClick={() => onDelete(member)}
            title="Delete"
            permission={PermissionCode.MEMBER_DELETE}
          >
            <DeleteIcon />
          </OperationButton>,
        );
        break;

      case 'LOCKED':
        // Locked 状态：编辑、启用、删除
        buttons.push(
          <OperationButton
            key="edit"
            onClick={() => onEdit(member)}
            title="Edit"
            permission={PermissionCode.MEMBER_EDIT}
          >
            <EditIcon />
          </OperationButton>,
          <OperationButton
            key="toggleStatus"
            onClick={() => onEnable(member)}
            title="Lock"
            permission={PermissionCode.MEMBER_ENABLE}
          >
            <DisableIcon />
          </OperationButton>,
          <OperationButton
            key="delete"
            onClick={() => onDelete(member)}
            title="Delete"
            permission={PermissionCode.MEMBER_DELETE}
          >
            <DeleteIcon />
          </OperationButton>,
        );
        break;

      case 'WAITING':
        // Waiting 状态：通过、拒绝
        buttons.push(
          <OperationButton
            key="approve"
            onClick={() => onApprove(member)}
            title="Approve"
            permission={PermissionCode.MEMBER_APPROVE}
          >
            <ApproveIcon />
          </OperationButton>,
          <OperationButton
            key="reject"
            onClick={() => onReject(member)}
            title="Reject"
            permission={PermissionCode.MEMBER_REJECT}
          >
            <RejectIcon />
          </OperationButton>,
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

  return <AntSpace size={20}>{allButtons}</AntSpace>;
};

export default MemberOperationButtons;
