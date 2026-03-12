import type { OrganizationListParams } from '@pages/organization/dto';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { organizationApi } from '@/services/modules/organization/organizationApi';

import type { RootState } from '../index';

// 组织状态接口
export interface OrganizationState {
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: OrganizationState = {
  loading: false,
  error: null,
};

// 异步thunk动作
export const fetchOrganizations = createAsyncThunk(
  'organization/fetchList',
  async (data: OrganizationListParams, { rejectWithValue }) => {
    try {
      const response = await organizationApi.getList(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取组织列表失败');
    }
  },
);

export const createOrganization = createAsyncThunk(
  'organization/create',
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const organization = await organizationApi.create(data);
      // 创建成功后刷新列表
      const updateDate: OrganizationListParams = {
        pageNum: 1,
        pageSize: 5000,
      };
      dispatch(fetchOrganizations(updateDate));
      return organization;
    } catch (error: any) {
      return rejectWithValue(error.message || '创建组织失败');
    }
  },
);

// 组织slice
const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 获取组织列表
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchOrganizations.rejected, (state) => {
        state.loading = false;
      });

    // 创建组织
    builder
      .addCase(createOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrganization.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createOrganization.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

// 导出selectors

export const selectOrganizationLoading = (state: RootState) => state.organization.loading;
export const selectOrganizationError = (state: RootState) => state.organization.error;

// 导出reducer
export default organizationSlice.reducer;
