import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/mock';

// 统计数据接口
export interface Stats {
  users: {
    total: number;
    today: number;
    growth: number;
  };
  orders: {
    total: number;
    today: number;
    growth: number;
  };
  revenue: {
    total: number;
    today: number;
    growth: number;
  };
  conversion: {
    rate: number;
    growth: number;
  };
}

// 图表数据接口
export interface ChartData {
  dates: string[];
  sales: number[];
  visitors: number[];
}

// 活动数据接口
export interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
  type: string;
}

export interface DashboardState {
  stats: Stats | null;
  chartData: ChartData | null;
  activities: Activity[];
  loading: {
    stats: boolean;
    chart: boolean;
    activities: boolean;
  };
  error: {
    stats: string | null;
    chart: string | null;
    activities: string | null;
  };
}

// 初始状态
const initialState: DashboardState = {
  stats: null,
  chartData: null,
  activities: [],
  loading: {
    stats: false,
    chart: false,
    activities: false
  },
  error: {
    stats: null,
    chart: null,
    activities: null
  }
};

// 异步 thunk
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async () => {
    const response: any = await api.stats.getDashboardStats();
    return response;
  }
);

export const fetchChartData = createAsyncThunk(
  'dashboard/fetchChartData',
  async () => {
    const response: any = await api.charts.getSalesData();
    return response;
  }
);

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchActivities',
  async () => {
    const response: any = await api.activities.getRecent();
    return response.data;
  }
);

// Dashboard slice
export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardData: (state) => {
      state.stats = null;
      state.chartData = null;
      state.activities = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取统计数据
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload as any;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.error.message || '获取统计数据失败';
      })
      // 获取图表数据
      .addCase(fetchChartData.pending, (state) => {
        state.loading.chart = true;
        state.error.chart = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.loading.chart = false;
        state.chartData = action.payload as any;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading.chart = false;
        state.error.chart = action.error.message || '获取图表数据失败';
      })
      // 获取活动数据
      .addCase(fetchRecentActivities.pending, (state) => {
        state.loading.activities = true;
        state.error.activities = null;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.loading.activities = false;
        state.activities = action.payload as any;
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.loading.activities = false;
        state.error.activities = action.error.message || '获取活动数据失败';
      });
  }
});

// 导出 actions
export const { clearDashboardData } = dashboardSlice.actions;

// 导出 reducer
export default dashboardSlice.reducer;