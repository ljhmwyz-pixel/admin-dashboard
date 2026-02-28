import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// 主题模式类型
export type ThemeMode = 'light' | 'dark' | 'auto';
// 主题算法类型
export type ThemeAlgorithm = 'default' | 'dark' | 'compact';
// 颜色主题类型
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red';

// 主题配置接口
export interface ThemeState {
  /** 当前主题模式 */
  mode: ThemeMode;
  /** 当前主题算法 */
  algorithm: ThemeAlgorithm;
  /** 颜色主题 */
  colorScheme: ColorScheme;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 系统偏好主题 */
  systemPreference: 'light' | 'dark';
  /** 用户是否手动设置了主题 */
  isManualOverride: boolean;
}

// 初始状态
const initialState: ThemeState = {
  mode: 'auto',
  algorithm: 'default',
  colorScheme: 'blue',
  isLoading: false,
  systemPreference: 'light',
  isManualOverride: false,
};

// 创建主题切片
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // 设置主题模式
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.isManualOverride = action.payload !== 'auto';
      if (action.payload !== 'auto') {
        // 根据模式设置对应的算法
        state.algorithm = action.payload === 'dark' ? 'dark' : 'default';
      }
    },

    // 设置主题算法
    setThemeAlgorithm: (state, action: PayloadAction<ThemeAlgorithm>) => {
      state.algorithm = action.payload;
    },

    // 设置颜色主题
    setColorScheme: (state, action: PayloadAction<ColorScheme>) => {
      state.colorScheme = action.payload;
    },

    // 设置系统偏好
    setSystemPreference: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.systemPreference = action.payload;
      // 如果是自动模式，更新当前算法
      if (state.mode === 'auto') {
        state.algorithm = action.payload === 'dark' ? 'dark' : 'default';
      }
    },

    // 切换暗色模式
    toggleDarkMode: (state) => {
      const newMode = state.mode === 'dark' ? 'light' : 'dark';
      state.mode = newMode;
      state.algorithm = newMode === 'dark' ? 'dark' : 'default';
      state.isManualOverride = true;
    },

    // 重置为主题自动模式
    resetToAuto: (state) => {
      state.mode = 'auto';
      state.isManualOverride = false;
      state.algorithm = state.systemPreference === 'dark' ? 'dark' : 'default';
    },

    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

// 导出 actions
export const {
  setThemeMode,
  setThemeAlgorithm,
  setColorScheme,
  setSystemPreference,
  toggleDarkMode,
  resetToAuto,
  setLoading,
} = themeSlice.actions;

// 导出 reducer
export default themeSlice.reducer;

// 选择器函数
export const selectTheme = (state: { theme: ThemeState }) => state.theme;
export const selectCurrentAlgorithm = (state: { theme: ThemeState }) => {
  const { mode, algorithm, systemPreference } = state.theme;
  if (mode === 'auto') {
    return systemPreference === 'dark' ? 'dark' : 'default';
  }
  return algorithm;
};
export const selectIsDarkMode = (state: { theme: ThemeState }) => {
  const { mode, systemPreference } = state.theme;
  if (mode === 'auto') {
    return systemPreference === 'dark';
  }
  return mode === 'dark';
};
