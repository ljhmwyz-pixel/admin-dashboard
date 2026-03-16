import React from 'react';
import type { Member } from '@pages/organization/dto';
import { AntSpace, AntSpin, AntTable, AntTag } from '@shared/components';
import type { TableColumnsType, TablePaginationConfig } from 'antd';

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
  onTableChange: (pagination: TablePaginationConfig, sorter: any) => void;
}

/**
 * 状态映射配置
 * 将状态码映射为显示文本和颜色
 */
const statusMap = {
  NORMAL: { text: 'Normal', color: 'green' },
  WAITING: { text: 'Waiting', color: 'blue' },
  LOCKED: { text: 'Locked', color: 'orange' },
  REJECTED: { text: 'Rejected', color: 'red' },
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
}) => {
  const handleClickRole = (role: string) => {
    console.log(role);
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
      dataIndex: 'roleName',
      key: 'roleName',
      render: (roleList) => {
        // todo 处理角色列表，展示多个角色
        // return roleList.map((role: string) => (
        //   <span key={role} className={styles.role} onClick={() => handleClickRole(role)}>
        //     {role}
        //   </span>
        // ));
        return <div>{roleList}</div>;
      },
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (_, member) => (
        <AntSpace>
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
        </AntSpace>
      ),
    },
  ];

  return (
    <AntSpin spinning={loading}>
      <AntTable
        columns={columns}
        dataSource={members}
        showSorterTooltip={false}
        rowKey="memberId"
        pagination={{
          current,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `1-${Math.min(current * pageSize, total)} of ${total} items`,
        }}
        onChange={onTableChange}
      />
    </AntSpin>
  );
};

export default MemberTable;
