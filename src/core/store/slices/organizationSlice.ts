import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { organizationApi } from '../../../services/modules/organization/organizationApi';
import type { Organization, OrganizationTreeNode } from '../../../shared/types/organization';
import type { RootState } from '../index';

// 组织状态接口
export interface OrganizationState {
  organizations: Organization[];
  treeData: OrganizationTreeNode[];
  currentOrganization: Organization | null;
  loading: boolean;
  treeLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  filters: {
    keyword: string;
    status: 'all' | 'active' | 'inactive';
    parentId: string | number | null;
  };
}

// 初始状态
const initialState: OrganizationState = {
  organizations: [],
  treeData: [],
  currentOrganization: null,
  loading: false,
  treeLoading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  filters: {
    keyword: '',
    status: 'all',
    parentId: null,
  },
};

// 异步thunk动作
export const fetchOrganizations = createAsyncThunk(
  'organization/fetchList',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { pagination, filters } = state.organization;

      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: filters.keyword || undefined,
        status: filters.status === 'all' ? undefined : filters.status,
        parentId: filters.parentId || undefined,
      };

      const response = await organizationApi.getList(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取组织列表失败');
    }
  },
);

export const fetchOrganizationTree = createAsyncThunk(
  'organization/fetchTree',
  async (_, { rejectWithValue }) => {
    try {
      const treeData = await organizationApi.getTree();
      return treeData;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取组织树失败');
    }
  },
);

export const fetchOrganizationDetail = createAsyncThunk(
  'organization/fetchDetail',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const organization = await organizationApi.getDetail(id);
      return organization;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取组织详情失败');
    }
  },
);

export const createOrganization = createAsyncThunk(
  'organization/create',
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const organization = await organizationApi.create(data);
      // 创建成功后刷新列表
      dispatch(fetchOrganizations());
      return organization;
    } catch (error: any) {
      return rejectWithValue(error.message || '创建组织失败');
    }
  },
);

export const updateOrganization = createAsyncThunk(
  'organization/update',
  async ({ id, data }: { id: string | number; data: any }, { dispatch, rejectWithValue }) => {
    try {
      const organization = await organizationApi.update(id, data);
      // 更新成功后刷新列表
      dispatch(fetchOrganizations());
      return organization;
    } catch (error: any) {
      return rejectWithValue(error.message || '更新组织失败');
    }
  },
);

export const deleteOrganization = createAsyncThunk(
  'organization/delete',
  async (id: string | number, { dispatch, rejectWithValue }) => {
    try {
      await organizationApi.delete(id);
      // 删除成功后刷新列表
      dispatch(fetchOrganizations());
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || '删除组织失败');
    }
  },
);

// 组织slice
const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setCurrentOrganization: (state, action: PayloadAction<Organization | null>) => {
      state.currentOrganization = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<OrganizationState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1; // 重置页码
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    // 获取组织列表
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload.data;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 获取组织树
    builder
      .addCase(fetchOrganizationTree.pending, (state) => {
        state.treeLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationTree.fulfilled, (state, action) => {
        state.treeLoading = false;
        state.treeData = action.payload;
      })
      .addCase(fetchOrganizationTree.rejected, (state, action) => {
        state.treeLoading = false;
        state.error = action.payload as string;
      });

    // 获取组织详情
    builder.addCase(fetchOrganizationDetail.fulfilled, (state, action) => {
      state.currentOrganization = action.payload;
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
      .addCase(createOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 更新组织
    builder
      .addCase(updateOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrganization.fulfilled, (state) => {
        state.loading = false;
        state.currentOrganization = null;
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 删除组织
    builder
      .addCase(deleteOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrganization.fulfilled, (state) => {
        state.loading = false;
        state.currentOrganization = null;
      })
      .addCase(deleteOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// 导出actions
export const {
  setCurrentOrganization,
  setFilters,
  setPage,
  setPageSize,
  clearError,
  resetFilters,
} = organizationSlice.actions;

// 导出selectors
export const selectOrganizations = (state: RootState) => state.organization.organizations;
export const selectOrganizationTree = (state: RootState) => state.organization.treeData;
export const selectCurrentOrganization = (state: RootState) =>
  state.organization.currentOrganization;
export const selectOrganizationLoading = (state: RootState) => state.organization.loading;
export const selectOrganizationTreeLoading = (state: RootState) => state.organization.treeLoading;
export const selectOrganizationError = (state: RootState) => state.organization.error;
export const selectOrganizationPagination = (state: RootState) => state.organization.pagination;
export const selectOrganizationFilters = (state: RootState) => state.organization.filters;

// 导出reducer
export default organizationSlice.reducer;
