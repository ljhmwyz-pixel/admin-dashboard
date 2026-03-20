import React from 'react';
import type { Member } from '@pages/organization/dto';
import { AntSpin, AntTag } from '@shared/components';
import type { TableColumnsType } from 'antd';
import { uniqueId } from 'lodash-es';

import { Table } from '@/components';

import type { AddRoleRef } from '../../Role/components/AddRole';
import MemberOperationButtons from './MemberOperationButtons';

import styles from './MemberList.module.scss';

/**
 * MemberTable 组件属性接口
 */
interface MemberTableProps {
  /** 加载状态 */
  loading: boolean;
  /** 成员列表数据 */
  members: Member[];
  /** 当前页码 */
  current: number;
  /** 每页大小 */
  pageSize: number;
  /** 总记录数 */
  total: number;
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
  /** 表格变更回调 */
  onTableChange: (p: number, ps: number) => void;
  /** 角色详情实例 */
  roleModalRef: React.RefObject<AddRoleRef>;
}

/**
 * 状态映射配置
 * 将状态码映射为显示文本和颜色
 */
const statusMap = {
  NORMAL: { text: 'Normal', color: '#31C47F' },
  WAITING: { text: 'Waiting', color: '#4083C6' },
  LOCKED: { text: 'Locked', color: '#F4AA58' },
  REJECTED: { text: 'Rejected', color: '#F45858' },
};

/**
 * 成员表格组件
 * 展示成员列表，支持分页、排序、操作按钮等功能
 */
const MemberTable: React.FC<MemberTableProps> = ({
  loading,
  members,
  current,
  pageSize,
  total,
  onView,
  onEdit,
  onDelete,
  onDisable,
  onEnable,
  onApprove,
  onReject,
  onTableChange,
  roleModalRef,
}) => {
  const handleClickRole = (role: { roleId: string; roleName: string }) => {
    roleModalRef?.current?.open({ roleId: role?.roleId }, 'view');
  };
  /** 表格列定义 */
  const columns: TableColumnsType<Member> = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => (current - 1) * pageSize + index + 1,
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => {
        const nameA = (a.username || '').toLowerCase();
        const nameB = (b.username || '').toLowerCase();
        return nameA.localeCompare(nameB);
      },
      defaultSortOrder: undefined,
    },
    {
      title: 'UID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusInfo = statusMap[status as keyof typeof statusMap];
        return statusInfo ? <AntTag color={statusInfo.color}>{statusInfo.text}</AntTag> : status;
      },
    },
    {
      title: 'Role',
      dataIndex: 'roleList',
      key: 'roleList',
      width: 200,
      render: (roleList) => {
        return roleList.map((role: { roleId: string; roleName: string }) => (
          <span key={role.roleId} className={styles.role} onClick={() => handleClickRole(role)}>
            {role.roleName}
          </span>
        ));
      },
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (_, member) => (
        <MemberOperationButtons
          member={member}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onDisable={onDisable}
          onEnable={onEnable}
          onApprove={onApprove}
          onReject={onReject}
        />
      ),
    },
  ];

  return (
    <AntSpin spinning={loading}>
      <Table
        columns={columns}
        dataSource={members}
        showSorterTooltip={false}
        rowKey={() => uniqueId('member')}
        pagination={{
          current,
          pageSize,
          total,
          pageSizeOptions: [5, 10, 15, 20, 25, 30],
          onChange: onTableChange,
        }}
      />
    </AntSpin>
  );
};

export default MemberTable;
