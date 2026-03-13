import React from 'react';
import { AntTable, AntTag } from '@shared/components';

interface RecordProps {
  member: any;
}

interface OperationRecord {
  key: string;
  no: number;
  changeType: string;
  changedBy: string;
  changedContent: string;
  changedTime: string;
}

/**
 * 成员操作记录组件
 * 展示成员的变更历史记录
 */
const Record: React.FC<RecordProps> = () => {
  // 模拟操作记录数据
  const recordData: OperationRecord[] = [
    {
      key: '1',
      no: 1,
      changeType: 'Add',
      changedBy: 'USR-HE6B-T9W3',
      changedContent: 'First time adding member',
      changedTime: '2026-03-01 10:30:00 UTC+08:00',
    },
    {
      key: '2',
      no: 2,
      changeType: 'Application',
      changedBy: 'USR-HE6B-T9W3',
      changedContent: 'First application to join the organization',
      changedTime: '2026-03-01 10:00:00 UTC+08:00',
    },
    {
      key: '3',
      no: 3,
      changeType: 'Approve',
      changedBy: 'USR-HE6B-T9W3',
      changedContent: 'Approve the member to join the organization',
      changedTime: '2026-03-01 10:30:00 UTC+08:00',
    },
    {
      key: '4',
      no: 4,
      changeType: 'Modify',
      changedBy: 'USR-HE6B-T9W3',
      changedContent: 'Update: Role changed from "Guest" to "Electrician"',
      changedTime: '2026-03-02 14:15:00 UTC+08:00',
    },
    {
      key: '5',
      no: 5,
      changeType: 'Lock',
      changedBy: 'USR-HE6B-T9W3',
      changedContent: 'Lock the member within the current organization',
      changedTime: '2026-03-03 09:45:00 UTC+08:00',
    },
  ];

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

  return (
    <div style={{ padding: '0 16px' }}>
      <AntTable
        dataSource={recordData}
        columns={[
          {
            title: 'No.',
            dataIndex: 'no',
            key: 'no',
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
            dataIndex: 'changedBy',
            key: 'changedBy',
          },
          {
            title: 'Changed Content',
            dataIndex: 'changedContent',
            key: 'changedContent',
          },
          {
            title: 'Changed Time',
            dataIndex: 'changedTime',
            key: 'changedTime',
          },
        ]}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }}
        rowKey="key"
      />
    </div>
  );
};

export default Record;
