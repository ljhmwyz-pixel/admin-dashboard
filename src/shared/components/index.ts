// Ant Design 原始组件导出（用于未封装的组件）
export {
  // 其他组件
  AntAffix,
  // 反馈组件
  AntAlert,
  AntAnchor,
  AntAutoComplete,
  AntAvatar,
  AntBackTop,
  AntBadge,
  // 导航组件
  AntBreadcrumb,
  // 基础组件
  AntButton,
  AntCalendar,
  AntCard,
  AntCheckbox,
  AntCol,
  AntCollapse,
  AntConfigProvider,
  AntDatePicker,
  AntDescriptions,
  AntDivider,
  AntDrawer,
  AntDropdown,
  AntEmpty,
  AntForm,
  AntGrid,
  // 图标
  AntIcon,
  AntInput,
  AntInputNumber,
  // 布局组件
  AntLayout,
  AntList,
  AntMenu,
  AntMessage,
  AntModal,
  AntNotification,
  AntPagination,
  AntPopconfirm,
  AntPopover,
  AntProgress,
  AntRadio,
  AntRate,
  AntResult,
  AntRow,
  AntSelect,
  AntSkeleton,
  AntSlider,
  AntSpace,
  AntSpin,
  AntSplitter,
  AntStatistic,
  AntSteps,
  AntSwitch,
  // 数据展示组件
  AntTable,
  AntTabs,
  AntTag,
  AntTimeline,
  AntTimePicker,
  AntTooltip,
  AntTour,
  AntTransfer,
  AntTree,
  AntTypography,
  AntUpload,
} from './antd-imports';

// 组件库版本信息
export const COMPONENT_LIBRARY_VERSION = '1.0.0';

// 组件库配置
export interface ComponentLibraryConfig {
  /** 默认主题 */
  defaultTheme?: 'light' | 'dark' | 'blue';
  /** 是否启用动画效果 */
  animationsEnabled?: boolean;
  /** 组件前缀 */
  prefixCls?: string;
}

// 默认配置
export const defaultComponentConfig: ComponentLibraryConfig = {
  defaultTheme: 'light',
  animationsEnabled: true,
  prefixCls: 'custom',
};
