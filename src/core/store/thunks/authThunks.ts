import { createAsyncThunk } from '@reduxjs/toolkit';

import { authApi } from '@/services/modules/auth/authApi';
import type { LoginCredentials, RegisterData } from '@/shared/types/auth';
import SecurityUtils from '@/shared/utils/SecurityUtils';

// 登录 thunk
export const loginUser = createAsyncThunk(
  'api/v1/auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      // todo
      localStorage.setItem('loginInfo', JSON.stringify(response));
      // 本地缓存refreshToken
      if (response.refreshToken) {
        SecurityUtils.setRefreshToken(response.refreshToken);
      }
      // accessToken
      if (response.token) {
        SecurityUtils.setToken(response.token);
      }
      debugger;
      // 返回是闪屏问题
      // {
      //   500;
      //   ('代理转发失败: 500 : "{"code":500,"message":"系统内部错误，请联系管理员","timestamp":"2026-03-06T09:55:39.6980488"}"');
      //   false;
      // }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '登录失败');
    }
  },
);

// 注册 thunk
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '注册失败');
    }
  },
);

// 刷新 token thunk
export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (_, { getState: _getState, rejectWithValue }) => {
    try {
      const refreshTokenValue = SecurityUtils.getRefreshToken();
      if (!refreshTokenValue) {
        throw new Error('无刷新令牌');
      }

      const response = await authApi.refreshToken(refreshTokenValue);

      // 更新 refreshToken
      if (response.refreshToken) {
        SecurityUtils.setRefreshToken(response.refreshToken);
      }

      // accessToken
      if (response.token) {
        SecurityUtils.setToken(response.token);
      }

      return response;
    } catch (error: any) {
      // 刷新失败，清除认证信息
      SecurityUtils.clearAuth();
      return rejectWithValue(error.message || '令牌刷新失败');
    }
  },
);

// 获取用户信息 thunk
export const fetchUserInfo = createAsyncThunk(
  'auth/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getUserInfo();

      // 更新用户信息
      SecurityUtils.setUserInfo(response.user);
      SecurityUtils.setPermissions(response.permissions || []);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取用户信息失败');
    }
  },
);

// 登出 thunk
export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = SecurityUtils.getRefreshToken();
    if (refreshToken) {
      await authApi.logout(refreshToken);
    }

    // 清除本地认证信息
    SecurityUtils.clearAuth();

    return true;
  } catch (error: any) {
    // 即使登出API失败，也要清除本地数据
    SecurityUtils.clearAuth();
    return rejectWithValue(error.message || '登出失败');
  }
});

// 检查认证状态 thunk
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      // 检查是否有有效的 token
      if (!SecurityUtils.isAuthenticated()) {
        throw new Error('未认证');
      }

      // 检查 token 是否过期
      if (SecurityUtils.isTokenExpired()) {
        // 尝试刷新 token
        const refreshToken = SecurityUtils.getRefreshToken();
        if (refreshToken) {
          const response = await authApi.refreshToken(refreshToken);
          if (response.token) {
            SecurityUtils.setToken(response.token);
          }
          if (response.refreshToken) {
            SecurityUtils.setRefreshToken(response.refreshToken);
          }
          return { isAuthenticated: true, user: response.user };
        } else {
          throw new Error('令牌已过期且无刷新令牌');
        }
      }

      // Token 有效，获取用户信息
      const userInfo = SecurityUtils.getUserInfo();
      const permissions = SecurityUtils.getPermissions();

      return {
        isAuthenticated: true,
        user: userInfo,
        permissions,
      };
    } catch (error: any) {
      SecurityUtils.clearAuth();
      return rejectWithValue(error.message || '认证状态检查失败');
    }
  },
);

// 修改密码 thunk
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await authApi.changePassword({
        oldPassword,
        newPassword,
        confirmNewPassword: newPassword,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '修改密码失败');
    }
  },
);

// 重置密码 thunk
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    {
      email,
      verificationCode,
      newPassword,
    }: {
      email: string;
      verificationCode: string;
      newPassword: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authApi.resetPassword({
        email,
        verificationCode,
        newPassword,
        confirmNewPassword: newPassword,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '重置密码失败');
    }
  },
);
