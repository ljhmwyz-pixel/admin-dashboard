import { useCallback, useEffect, useRef, useState } from 'react';
import type { RoleRecord } from '@pages/organization/dto';
import type { TreeNodeData } from '@pages/organization/dto';
import type { ColumnsType } from 'antd/es/table';

import { Table, Tooltip } from '@/components';
import { useThemeModal } from '@/components/Modal';
import type { OptionItem } from '@/components/Segmented';
import Tag from '@/components/Tag';
import { PRESET_TAGS } from '@/components/Tag/constants';
import OrgRoleApi, {
  type DeleteOrgRoleReq,
  type GetOrgRoleDTO,
  type GetOrgRoleListReq,
  type GetOrgRoleListRes,
  type GetPlatformTypeListItem,
  type GetPlatformTypeListRes,
} from '@/services/modules/organization/organizationRoleApi';
import { AntMessage, AntSpin } from '@/shared/components';
import { useLanguage } from '@/shared/hooks';

import AddRole, { type AddRoleRef } from './components/AddRole';
import RoleHeader from './components/RoleHeader';

import styles from './index.module.scss';

// 定义操作模式类型
export type AddRoleMode = 'add' | 'edit' | 'view';

// 定义状态筛选类型
export type RoleStatusFilter = 'All' | 'Normal' | 'Disabled';

interface RoleInfoProps {
  currentParentNode?: TreeNodeData;
  onBatchEdit?: (records: RoleRecord[]) => void;
  onBatchDelete?: (records: RoleRecord[]) => void;
}

const RoleInfo: React.FC<RoleInfoProps> = ({ currentParentNode }) => {
  return <div />;
};

export default RoleInfo;
