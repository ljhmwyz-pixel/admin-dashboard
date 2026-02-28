import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/mock';

// 用户状态接口
export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  status: 'active' | 'inactive' | 'pending';
  avatar: string;
  createdAt: string;
  lastLogin: string;
  role: 'admin' | 'user' | 'editor';
}

export interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

// 初始状态
const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  }
};

// 异步 thunk
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: { page?: number; pageSize?: number }) => {
    const response = await api.users.list(params);
    return response;
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: number) => {
    const response = await api.users.getById(id);
    return response;
  }
);

// 用户 slice
export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取用户列表
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = (action.payload as any).data;
        state.pagination = {
          page: (action.payload as any).page,
          pageSize: (action.payload as any).pageSize,
          total: (action.payload as any).total
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取用户列表失败';
      })
      // 获取单个用户
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload as any;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取用户详情失败';
      });
  }
});

// 导出 actions
export const { setCurrentUser, clearCurrentUser, updateUser } = userSlice.actions;

// 导出 reducer
export default userSlice.reducer;