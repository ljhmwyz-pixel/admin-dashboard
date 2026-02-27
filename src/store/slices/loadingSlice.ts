import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  globalLoading: boolean;
  loadingCounts: Record<string, number>;
}

const initialState: LoadingState = {
  globalLoading: false,
  loadingCounts: {},
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    showLoading: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      state.loadingCounts[key] = (state.loadingCounts[key] || 0) + 1;
      state.globalLoading = true;
    },
    hideLoading: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      if (state.loadingCounts[key]) {
        state.loadingCounts[key] -= 1;
        if (state.loadingCounts[key] <= 0) {
          delete state.loadingCounts[key];
        }
      }
      
      // 检查是否还有其他loading任务
      state.globalLoading = Object.keys(state.loadingCounts).length > 0;
    },
    clearAllLoading: (state) => {
      state.loadingCounts = {};
      state.globalLoading = false;
    },
  },
});

export const { showLoading, hideLoading, clearAllLoading } = loadingSlice.actions;

export default loadingSlice.reducer;