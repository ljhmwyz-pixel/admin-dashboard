import type { OptionItem } from '@/components/Segmented';

import {
  AppOutlined,
  OrganizationOutlined,
  PlantOutlined,
  UserOutlined,
  WebOutlined,
} from '../components/common-icon/index';

// 平台选项
export const PLATFORM_OPTIONS = [
  {
    label: 'Web',
    value: 'WEB',
    color: '#31C47F',
    icon: <WebOutlined color="#191B1F66" />,
    iconSelected: <WebOutlined color="#31C47F" />,
  },
  {
    label: 'App',
    value: 'APP',
    color: '#33C2C8',
    icon: <AppOutlined color="#191B1F66" />,
    iconSelected: <AppOutlined color="#33C2C8" />,
  },
];

// 数据平台选项
export const DATA_PLATFORM_OPTIONS: OptionItem[] = [
  {
    label: 'Organization',
    value: 'ORGANIZATION',
    color: '#31C47F',
    icon: <OrganizationOutlined color="#191B1F66" />,
    iconSelected: <OrganizationOutlined color="#31C47F" />,
  },
  {
    label: 'Members',
    value: 'USER',
    color: '#F4AA58',
    icon: <UserOutlined color="#191B1F66" />,
    iconSelected: <UserOutlined color="#F4AA58" />,
  },
  {
    label: 'Plants',
    value: 'PLANT',
    color: '#33C2C8',
    icon: <PlantOutlined color="#191B1F66" />,
    iconSelected: <PlantOutlined color="#33C2C8" />,
  },
];

// 记录平台选项
export const RECORD_PLATFORM_OPTIONS = [
  {
    label: 'Organization',
    value: 'DATA_ORGANIZATION',
    color: '#31C47F',
    icon: <OrganizationOutlined color="#191B1F66" />,
    iconSelected: <OrganizationOutlined color="#31C47F" />,
  },
  {
    label: 'Members',
    value: 'DATA_USER',
    color: '#F4AA58',
    icon: <UserOutlined color="#191B1F66" />,
    iconSelected: <UserOutlined color="#F4AA58" />,
  },
  {
    label: 'Plants',
    value: 'DATA_PLANT',
    color: '#33C2C8',
    icon: <PlantOutlined color="#191B1F66" />,
    iconSelected: <PlantOutlined color="#33C2C8" />,
  },
];

// 功能权限选项
export const FUNCTIONAL_PERMISSION_OPTIONS = [
  { label: 'Assignable', value: 'ASSIGNABLE' },
  { label: 'Owner Only', value: 'OWNER_ONLY' },
  { label: 'No Access', value: 'NO_ACCESS' },
];

// 数据权限选项
export const DATA_PERMISSION_OPTIONS = [
  { label: 'Unmasked', value: 'FULL' },
  { label: 'Masked', value: 'MASKED' },
  { label: 'Hidden', value: 'HIDDEN' },
];
