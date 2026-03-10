import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../index';

// UI状态接口
export interface UIState {
  // 全局加载状态
  globalLoading: boolean;
  // 抽屉状态
  drawers: {
    [key: string]: boolean;
  };
  // 对话框状态
  modals: {
    [key: string]: boolean;
  };
  // 通知状态
  notifications: NotificationItem[];
  // 面包屑路径
  breadcrumbs: BreadcrumbItem[];
  // 页面标题
  pageTitle: string;
  // 侧边栏折叠状态
  siderCollapsed: boolean;
}

// 通知项接口
export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

// 面包屑项接口
export interface BreadcrumbItem {
  path: string;
  title: string;
  icon?: string;
}

// 初始状态
const initialState: UIState = {
  globalLoading: false,
  drawers: {},
  modals: {},
  notifications: [],
  breadcrumbs: [],
  pageTitle: '',
  siderCollapsed: false,
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // 设置全局加载状态
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },

    // 控制抽屉显示/隐藏
    toggleDrawer: (state, action: PayloadAction<{ key: string; visible?: boolean }>) => {
      const { key, visible } = action.payload;
      state.drawers[key] = visible !== undefined ? visible : !state.drawers[key];
    },

    // 控制对话框显示/隐藏
    toggleModal: (state, action: PayloadAction<{ key: string; visible?: boolean }>) => {
      const { key, visible } = action.payload;
      state.modals[key] = visible !== undefined ? visible : !state.modals[key];
    },

    // 添加通知
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id' | 'timestamp'>>) => {
      const notification: NotificationItem = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },

    // 移除通知
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },

    // 清除所有通知
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // 设置面包屑
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.breadcrumbs = action.payload;
    },

    // 设置页面标题
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },

    // 切换侧边栏折叠状态
    toggleSider: (state) => {
      state.siderCollapsed = !state.siderCollapsed;
    },

    // 设置侧边栏折叠状态
    setSiderCollapsed: (state, action: PayloadAction<boolean>) => {
      state.siderCollapsed = action.payload;
    },
  },
});

// 导出actions
export const {
  setGlobalLoading,
  toggleDrawer,
  toggleModal,
  addNotification,
  removeNotification,
  clearNotifications,
  setBreadcrumbs,
  setPageTitle,
  toggleSider,
  setSiderCollapsed,
} = uiSlice.actions;

// 导出selectors
export const selectGlobalLoading = (state: RootState) => state.ui.globalLoading;
export const selectDrawerVisible = (key: string) => (state: RootState) =>
  state.ui.drawers[key] || false;
export const selectModalVisible = (key: string) => (state: RootState) =>
  state.ui.modals[key] || false;
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectBreadcrumbs = (state: RootState) => state.ui.breadcrumbs;
export const selectPageTitle = (state: RootState) => state.ui.pageTitle;
export const selectSiderCollapsed = (state: RootState) => state.ui.siderCollapsed;

// 导出reducer
export default uiSlice.reducer;
