// 组件库统一导出入口文件
// 这里导出所有自定义组件，方便统一管理和使用

// 基础组件
export type { ButtonProps } from './button/Button';
export {
  default as Button,
  DangerButton,
  InfoButton,
  PrimaryButton,
  SecondaryButton,
  SuccessButton,
  WarningButton,
} from './button/Button';
export type { FormProps } from './form/Form';
export {
  default as Form,
  FormItem,
  FormList,
  FormProvider,
  useForm,
  useFormInstance,
  useWatch,
} from './form/Form';
export type { InputProps } from './form/Input';
export {
  default as Input,
  InputGroup,
  InputPassword,
  InputSearch,
  InputTextArea,
} from './form/Input';
export type { SelectProps } from './form/Select';
export { default as Select } from './form/Select';

// 布局组件
export type { CardProps } from './layout/Card';
export { default as Card } from './layout/Card';
export type { DrawerProps } from './layout/Drawer';
export { default as Drawer } from './layout/Drawer';
export type { SpaceProps } from './layout/Space';
export { default as Space } from './layout/Space';

// 导航组件
export type { LayoutProps } from './layout/Layout';
export { Content, Footer, Header, default as Layout, Sider } from './layout/Layout';
export type { SidebarMenuItem, SidebarProps } from './navigation/Sidebar';
export { default as Sidebar } from './navigation/Sidebar';

// Ant Design 原始组件导出（用于未封装的组件）
export {
  // 其他组件
  AntAffix,
  // 反馈组件
  AntAlert,
  AntAnchor,
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

export { default as DeleteConfirmInput } from './DeleteConfirmInput';
