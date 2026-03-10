import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// 用户角色类型
export type UserRole = 'admin' | 'manager' | 'user' | 'guest';

// 用户权限类型
export type UserPermission =
  | 'read:users'
  | 'write:users'
  | 'delete:users'
  | 'manage:organizations'
  | 'read:reports'
  | 'write:reports'
  | 'organization:manage'
  | 'organization:type'
  | 'role:manage'
  | 'user:manage';

// 用户信息接口
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  roles: UserRole[];
  permissions: UserPermission[];
  isActive: boolean;
  lastLogin?: string;
}

// 用户状态接口
export interface UserState {
  currentUser: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 开发环境下的默认管理员用户
const DEFAULT_ADMIN_USER: UserInfo = {
  id: 'admin-001',
  username: 'admin',
  email: 'admin@example.com',
  displayName: '系统管理员',
  roles: ['admin'],
  permissions: [
    'read:users',
    'write:users',
    'delete:users',
    'manage:organizations',
    'read:reports',
    'write:reports',
    'organization:manage',
    'organization:type',
    'role:manage',
    'user:manage',
  ],
  isActive: true,
  lastLogin: new Date().toISOString(),
};

// 初始状态
const initialState: UserState = {
  currentUser: import.meta.env.DEV ? DEFAULT_ADMIN_USER : null,
  isAuthenticated: import.meta.env.DEV ? true : false,
  isLoading: false,
  error: null,
};

// 创建用户切片
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 设置用户信息
    setUser: (state, action: PayloadAction<UserInfo>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    // 清除用户信息（登出）
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // 设置错误信息
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // 添加角色
    addRole: (state, action: PayloadAction<UserRole>) => {
      if (state.currentUser) {
        if (!state.currentUser.roles.includes(action.payload)) {
          state.currentUser.roles.push(action.payload);
        }
      }
    },

    // 移除角色
    removeRole: (state, action: PayloadAction<UserRole>) => {
      if (state.currentUser) {
        state.currentUser.roles = state.currentUser.roles.filter((role) => role !== action.payload);
      }
    },

    // 添加权限
    addPermission: (state, action: PayloadAction<UserPermission>) => {
      if (state.currentUser) {
        if (!state.currentUser.permissions.includes(action.payload)) {
          state.currentUser.permissions.push(action.payload);
        }
      }
    },

    // 移除权限
    removePermission: (state, action: PayloadAction<UserPermission>) => {
      if (state.currentUser) {
        state.currentUser.permissions = state.currentUser.permissions.filter(
          (permission) => permission !== action.payload,
        );
      }
    },
  },
});

// 导出 actions
export const {
  setUser,
  clearUser,
  setLoading,
  setError,
  addRole,
  removeRole,
  addPermission,
  removePermission,
} = userSlice.actions;

// 导出 reducer
export default userSlice.reducer;

// 选择器函数
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectIsAuthenticated = (state: { user: UserState }) => state.user.isAuthenticated;
export const selectUserPermissions = (state: { user: UserState }) =>
  state.user.currentUser?.permissions || [];
export const selectUserRoles = (state: { user: UserState }) => state.user.currentUser?.roles || [];
export const selectUserLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
