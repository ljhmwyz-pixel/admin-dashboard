/**
 * 预设标签配置
 * 包含常用的标签类型及其样式
 */

export interface TagConfig {
  label: string;
  color: string;
  bgColor: string;
}

/**
 * 预设标签映射表
 */
export const PRESET_TAGS = {
  NORMAL: {
    label: 'Normal',
    color: '#31C47F',
    bgColor: '#31C47F1A',
  } as TagConfig,
  ACTIVE: {
    label: 'Active',
    color: '#31C47F',
    bgColor: '#31C47F1A',
  } as TagConfig,
  DELETED: {
    label: 'Deleted',
    color: '#F45858',
    bgColor: '#F458581A',
  } as TagConfig,
  PENDING: {
    label: 'Pending',
    color: '#4083C6',
    bgColor: '#4083C61A',
  } as TagConfig,
  APPROVED: {
    label: 'Approved',
    color: '#31C47F',
    bgColor: '#31C47F1A',
  } as TagConfig,
  SUSPENDED: {
    label: 'Suspended',
    color: '#F4AA58',
    bgColor: '#F4AA581A',
  } as TagConfig,

  WAITING: {
    label: 'Waiting',
    color: '#4083C6',
    bgColor: '#4083C61A',
  } as TagConfig,
  DEACTIVATED: {
    label: 'Deactivated',
    color: '#A3A4A6',
    bgColor: '#A3A4A61A',
  } as TagConfig,

  REJECTED: {
    label: 'Rejected',
    color: '#F45858',
    bgColor: '#F458581A',
  } as TagConfig,

  LOCKED: {
    label: 'Locked',
    color: '#F4AA58',
    bgColor: '#F4AA581A',
  } as TagConfig,

  MODIFY: {
    label: 'Modify',
    color: '#4083C6',
    bgColor: '#4083C61A',
  } as TagConfig,
  ADD: {
    label: 'Add',
    color: '#31C47F',
    bgColor: '#31C47F1A',
  } as TagConfig,
  PYLONTECH: {
    label: 'Pylontech',
    color: '#33C2C8',
    bgColor: '#33C2C81A',
  } as TagConfig,
  PERSONAL: {
    label: 'Personal',
    color: '#F4AA58',
    bgColor: '#F4AA581A',
  } as TagConfig,
  ORGANIZATION: {
    label: 'Organization',
    color: '#4083C6',
    bgColor: '#4083C6',
  } as TagConfig,

  PARENT: {
    label: 'Parent',
    color: '#4083C6',
    bgColor: '#ffffff',
  } as TagConfig,
  YES: {
    label: 'Yes',
    color: '#31C47F',
    bgColor: '#ffffff',
  } as TagConfig,
  NO: {
    label: 'No',
    color: '#F4AA58',
    bgColor: '#ffffff',
  } as TagConfig,
};

/**
 * 获取预设标签配置（已废弃，建议直接使用 PRESET_TAGS.XXX）
 * @param key - 标签 key
 * @returns 标签配置对象
 * @deprecated
 */
export const getPresetTag = (key: string): TagConfig | undefined => {
  return PRESET_TAGS[key as keyof typeof PRESET_TAGS];
};

/**
 * 根据标签文本获取配置（已废弃，建议直接使用 PRESET_TAGS.XXX）
 * @param label - 标签文本
 * @returns 标签配置对象
 * @deprecated
 */
export const getPresetTagByLabel = (label: string): TagConfig | undefined => {
  const normalizedLabel = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  return PRESET_TAGS[normalizedLabel as keyof typeof PRESET_TAGS];
};
