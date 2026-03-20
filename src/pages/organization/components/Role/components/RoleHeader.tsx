import React from 'react';
import type { StatusFilter } from '@pages/organization/dto';
import { AntSpace } from '@shared/components';
import { useLanguage } from '@shared/hooks/useLanguage';

import { FormButton, SearchInput, Segmented } from '@/components';
import { Permission } from '@/components/Permission';
import type { OptionItem } from '@/components/Segmented';
import { PermissionCode } from '@/shared/constants/permissions';

import styles from './RoleHeader.module.scss';

interface RoleHeaderProps {
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  searchInputRef?: React.RefObject<any>; // 搜索框 ref
  onPressEnter: () => void;
  onAdd: (() => void) | undefined;
  handleReset: () => void;
  statusList: OptionItem[];
}

const RoleHeader: React.FC<RoleHeaderProps> = ({
  statusFilter,
  onStatusChange,
  searchInputRef,
  onPressEnter,
  onAdd,
  handleReset,
  statusList,
}) => {
  const { t } = useLanguage();

  return (
    <div className={styles.roleHeader}>
      {/* 左侧：状态筛选 */}
      <Segmented
        value={statusFilter}
        options={statusList}
        onChange={(value) => onStatusChange(value as StatusFilter)}
      />

      {/* 右侧：搜索 + 操作按钮 */}
      <div className={styles.headerRight}>
        <AntSpace size={20}>
          <SearchInput
            allowClear={false}
            placeholder={t('role.placeholder.search')}
            // 此字段决定是否展示 Tooltip
            searchFields={['Role name']}
            inputRef={searchInputRef}
            onSearch={() => onPressEnter()}
          />
          <FormButton
            color="primary"
            variant="solid"
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 6.99989H13M6.995 13.0049L6.99499 1.00488"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            }
            onClick={onAdd}
            className={styles.addBtn}
          >
            {t('common.action.add')}
          </FormButton>
          <FormButton
            className={styles.refreshBtn}
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.4001 7.0001C13.4001 3.46548 10.5347 0.600098 7.0001 0.600098C3.46548 0.600098 0.600098 3.46548 0.600098 7.0001C0.600098 10.5347 3.46548 13.4001 7.0001 13.4001C8.51148 13.4001 9.90051 12.8762 10.9955 12.0001M10.9955 12.0001L9.80049 11.5001M10.9955 12.0001L10.7706 13.4001M8.00049 7.0001C8.00049 7.55238 7.55277 8.0001 7.00049 8.0001C6.4482 8.0001 6.00049 7.55238 6.00049 7.0001C6.00049 6.44781 6.4482 6.0001 7.00049 6.0001C7.55277 6.0001 8.00049 6.44781 8.00049 7.0001Z"
                  stroke="#191B1F"
                  strokeOpacity="0.4"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            }
            onClick={handleReset}
            title="Refresh"
          />
        </AntSpace>
      </div>
    </div>
  );
};

export default RoleHeader;
