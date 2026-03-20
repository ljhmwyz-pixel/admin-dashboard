import React, { useCallback, useEffect, useState } from 'react';
import type { MemberDetail, RecordData } from '@pages/organization/dto';
import {
  loadMemberApplicationChangeLogs,
  loadMemberChangeLogs,
} from '@pages/organization/services/organizationService';
import { AntTable, AntTag } from '@shared/components';

interface RecordProps {
  member: MemberDetail;
}

/**
 * 成员操作记录组件
 * 展示成员的变更历史记录
 */
const Record: React.FC<RecordProps> = ({ member }) => {
  const [recordData, setRecordData] = useState<RecordData>();
  const [pageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadRecordList = useCallback(async () => {
    if (!member?.memberId && !member.applicationId) return;
    try {
      setLoading(true);
      if (member.memberId) {
        const res = await loadMemberChangeLogs(member.memberId, { pageNum, pageSize });
        if (res) {
          setRecordData(res.data);
          setTotal(res.data.total);
        }
      } else if (member.applicationId) {
        console.log('member.applicationId', member.applicationId);
        const res = await loadMemberApplicationChangeLogs(member.applicationId, {
          pageNum,
          pageSize,
        });
        if (res) {
          setRecordData(res.data);
          setTotal(res.data.total);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [member, pageNum, pageSize]);

  useEffect(() => {
    loadRecordList();
  }, [loadRecordList]);
  /**
   * 获取变更类型对应的标签颜色
   */
  const getChangeTypeColor = (changeType: string): string => {
    switch (changeType) {
      case 'Add':
        return 'green';
      case 'Application':
        return 'blue';
      case 'Approve':
        return 'purple';
      case 'Reject':
        return 'orange';
      case 'Modify':
        return 'cyan';
      case 'Lock':
        return 'red';
      default:
        return 'default';
    }
  };

  const handleTableChange = (pagination: {
    current: React.SetStateAction<number>;
    pageSize: React.SetStateAction<number>;
  }) => {
    if (pagination.current) setCurrent(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);
  };
  return (
    <div style={{ padding: '0 16px' }}>
      <AntTable
        dataSource={recordData?.records || []}
        loading={loading}
        columns={[
          {
            title: 'No.',
            dataIndex: 'no',
            key: 'index',
            render: (_, __, index) => (current - 1) * pageSize + index + 1,
          },
          {
            title: 'Change Type',
            dataIndex: 'changeType',
            key: 'changeType',
            render: (changeType: string) => (
              <AntTag color={getChangeTypeColor(changeType)}>{changeType}</AntTag>
            ),
          },
          {
            title: 'Changed By',
            dataIndex: 'operatorName',
            key: 'operatorName',
          },
          {
            title: 'Changed Content',
            dataIndex: 'changeContent',
            key: 'changeContent',
          },
          {
            title: 'Changed Time',
            dataIndex: 'changedAt',
            key: 'changedAt',
          },
        ]}
        pagination={{
          current,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `1-${Math.min(current * pageSize, total)} of ${total} items`,
        }}
        onChange={(pagination) => {
          handleTableChange({
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
          });
        }}
        rowKey="key"
      />
    </div>
  );
};

export default Record;
