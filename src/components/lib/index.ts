// 组件库统一导出入口文件
// 这里导出所有自定义组件，方便统一管理和使用

// 基础组件
export { default as Button, PrimaryButton, SecondaryButton, SuccessButton, WarningButton, DangerButton, InfoButton } from './button/Button';
export type { ButtonProps } from './button/Button';

export { default as Input, InputPassword, InputTextArea, InputSearch, InputGroup } from './form/Input';
export type { InputProps } from './form/Input';

export { default as Select } from './form/Select';
export type { SelectProps } from './form/Select';

export { default as Form } from './form/Form';
export type { FormProps } from './form/Form';

// 布局组件
export { default as Card } from './layout/Card';
export type { CardProps } from './layout/Card';

// 导航组件
export { default as Sidebar } from './navigation/Sidebar';
export type { SidebarProps, SidebarMenuItem } from './navigation/Sidebar';

export { default as Layout, Header, Content, Footer, Sider } from './layout/Layout';
export type { LayoutProps } from './layout/Layout';

// Ant Design 原始组件导出（用于未封装的组件）
export {
  // 基础组件
  AntButton,
  AntInput,
  AntSelect,
  AntDatePicker,
  AntTimePicker,
  AntInputNumber,
  AntSwitch,
  AntRadio,
  AntCheckbox,
  AntRate,
  AntSlider,
  
  // 布局组件
  AntLayout,
  AntGrid,
  AntCard,
  AntCollapse,
  AntDivider,
  AntSpace,
  
  // 数据展示组件
  AntTable,
  AntList,
  AntDescriptions,
  AntStatistic,
  AntTag,
  AntBadge,
  AntAvatar,
  AntCalendar,
  AntEmpty,
  AntTimeline,
  AntTree,
  
  // 反馈组件
  AntAlert,
  AntMessage,
  AntNotification,
  AntPopconfirm,
  AntProgress,
  AntResult,
  AntSkeleton,
  AntSpin,
  AntModal,
  
  // 导航组件
  AntBreadcrumb,
  AntDropdown,
  AntMenu,
  AntPagination,
  AntSteps,
  AntTabs,
  
  // 其他组件
  AntAffix,
  AntAnchor,
  AntBackTop,
  AntConfigProvider,
  AntDrawer,
  AntPopover,
  AntTooltip,
  AntTour,
  AntTransfer,
  AntUpload,
  AntForm,
  
  // 图标
  AntIcon
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
  prefixCls: 'custom'
};