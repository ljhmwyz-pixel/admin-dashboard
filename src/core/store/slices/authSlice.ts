import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { UserInfo } from '@/shared/types/auth';

import type { RootState } from '../index';
import {
  changePassword,
  checkAuthStatus,
  fetchPermissions,
  fetchUserInfo,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  resetPassword,
} from '../thunks/authThunks';

// 认证状态接口
export interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  permissions: string[];
  roles: string[];
  loading: boolean;
  error: string | null;
  lastLoginAt: string | null;
}

// 初始状态
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  permissions: [],
  roles: [],
  loading: false,
  error: null,
  lastLoginAt: null,
};

// 认证 slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 设置认证状态
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    // 设置用户信息
    setUser: (state, action: PayloadAction<UserInfo>) => {
      state.user = action.payload;
      state.roles = action.payload.roles || [];
    },

    // 设置权限
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },

    // 清除认证状态
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.permissions = [];
      state.roles = [];
      state.error = null;
      state.lastLoginAt = null;
    },

    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 登录
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || null;
        // state.token = action.payload.token || null;
        // state.refreshToken = action.payload.refreshToken || null;
        // state.permissions = action.payload.permissions || [];
        // state.roles = action.payload.user?.roles || [];
        state.lastLoginAt = new Date().toISOString();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // 获取资源权限
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        debugger;
        state.loading = false;
        state.isAuthenticated = true;
        state.permissions = action.payload.permissions || [];
        state.lastLoginAt = new Date().toISOString();
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // 注册
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || null;
        // state.token = action.payload.token || null;
        // state.refreshToken = action.payload.refreshToken || null;
        state.permissions = action.payload.permissions || [];
        state.roles = action.payload.user?.roles || [];
        state.lastLoginAt = new Date().toISOString();
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 刷新令牌
    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        // state.token = action.payload.token || null;
        // state.refreshToken = action.payload.refreshToken || null;
        // state.user = action.payload.user || null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // 刷新失败时清除认证状态
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      });

    // 获取用户信息
    builder
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        // state.permissions = action.payload.permissions || [];
        // state.roles = action.payload.user.roles || [];
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // 登出
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.permissions = [];
        state.roles = [];
        state.error = null;
        state.lastLoginAt = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
        // 即使失败也要清除本地状态
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.permissions = [];
        state.roles = [];
        state.lastLoginAt = null;
      });

    // 检查认证状态
    builder
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user || null;
        state.permissions = action.payload.permissions || [];
        state.roles = action.payload.user?.roles || [];
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.permissions = [];
        state.roles = [];
      });

    // 修改密码
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 重置密码
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// 导出 actions
export const { setAuthenticated, setUser, setPermissions, clearAuth, clearError } =
  authSlice.actions;

// 导出 selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUserPermissions = (state: RootState) => state.auth.permissions;
export const selectUserRoles = (state: RootState) => state.auth.roles;

// 导出 reducer
export default authSlice.reducer;
