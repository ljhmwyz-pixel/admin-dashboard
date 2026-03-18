import React, { type SetStateAction, useCallback, useEffect, useState } from 'react';
import type { MemberDetail, RecordData } from '@pages/organization/dto';
import { loadMemberChangeLogs } from '@pages/organization/services/organizationService';
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
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  const loadRecordList = useCallback(async () => {
    if (!member?.memberId) return;
    const res = await loadMemberChangeLogs(member.memberId, { pageNum, pageSize });
    console.log(res, 'res');
    if (res) {
      setRecordData(res.data);
      setTotal(res.data.total);
    }
  }, [member, pageNum, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
