import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { ThemeConfig } from 'antd';

import type { ColorScheme, ThemeAlgorithm, ThemeMode } from '../config/themes';
import { getThemeConfig, SystemThemeDetector, ThemePersistence } from '../config/themes';
import {
  resetToAuto,
  selectCurrentAlgorithm,
  selectIsDarkMode,
  selectTheme,
  setColorScheme,
  setLoading,
  setSystemPreference,
  setThemeAlgorithm,
  setThemeMode,
  toggleDarkMode,
} from '../store/slices/themeSlice';

/**
 * 高级主题切换Hook
 * 提供完整的主题管理功能，包括系统主题检测、状态持久化等
 */
export const useAdvancedTheme = () => {
  const dispatch = useDispatch();
  const themeState = useSelector(selectTheme);
  const currentAlgorithm = useSelector(selectCurrentAlgorithm);
  const isDarkMode = useSelector(selectIsDarkMode);

  // 初始化系统主题检测器
  const systemDetector = useMemo(() => new SystemThemeDetector(), []);

  // 获取当前主题配置
  const currentThemeConfig = useMemo<ThemeConfig>(() => {
    const config = getThemeConfig(currentAlgorithm, themeState.colorScheme);
    console.log('useAdvancedTheme - generating theme config:', {
      algorithm: currentAlgorithm,
      colorScheme: themeState.colorScheme,
      config,
    });
    return config;
  }, [currentAlgorithm, themeState.colorScheme]);

  // 初始化主题
  useEffect(() => {
    const initializeTheme = async () => {
      dispatch(setLoading(true));

      try {
        // 获取系统主题偏好
        const systemPreference = systemDetector.getSystemPreference();
        dispatch(setSystemPreference(systemPreference));

        // 加载保存的主题配置
        const savedConfig = ThemePersistence.load();
        if (savedConfig) {
          if (savedConfig.mode) {
            dispatch(setThemeMode(savedConfig.mode));
          }
          if (savedConfig.colorScheme) {
            dispatch(setColorScheme(savedConfig.colorScheme));
          }
        }

        // 开始监听系统主题变化
        systemDetector.startListening();
        systemDetector.addListener((isDark) => {
          dispatch(setSystemPreference(isDark ? 'dark' : 'light'));
        });
      } catch (error) {
        console.error('Failed to initialize theme:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeTheme();

    // 清理函数
    return () => {
      systemDetector.stopListening();
    };
  }, [dispatch, systemDetector]);

  // 监听主题状态变化并保存到本地存储
  useEffect(() => {
    const saveThemeConfig = () => {
      const configToSave = {
        mode: themeState.mode,
        algorithm: themeState.algorithm,
        colorScheme: themeState.colorScheme,
        isManualOverride: themeState.isManualOverride,
      };
      ThemePersistence.save(configToSave);
    };

    // 使用防抖保存，避免频繁写入
    const timeoutId = setTimeout(saveThemeConfig, 100);
    return () => clearTimeout(timeoutId);
  }, [themeState.mode, themeState.algorithm, themeState.colorScheme, themeState.isManualOverride]);

  // 切换主题模式
  const changeThemeMode = useCallback(
    (mode: ThemeMode) => {
      dispatch(setThemeMode(mode));
    },
    [dispatch],
  );

  // 切换主题算法
  const changeThemeAlgorithm = useCallback(
    (algorithm: ThemeAlgorithm) => {
      dispatch(setThemeAlgorithm(algorithm));
    },
    [dispatch],
  );

  // 切换颜色主题
  const changeColorScheme = useCallback(
    (colorScheme: ColorScheme) => {
      dispatch(setColorScheme(colorScheme));
    },
    [dispatch],
  );

  // 切换暗色模式（快捷方法）
  const toggleDark = useCallback(() => {
    dispatch(toggleDarkMode());
  }, [dispatch]);

  // 重置为自动模式
  const resetToSystemTheme = useCallback(() => {
    dispatch(resetToAuto());
  }, [dispatch]);

  // 获取主题相关的CSS类名
  const getThemeClassNames = useCallback(() => {
    const classes = ['theme-transition'];

    if (isDarkMode) {
      classes.push('dark-theme');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      classes.push('light-theme');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    classes.push(`color-scheme-${themeState.colorScheme}`);

    return classes.join(' ');
  }, [isDarkMode, themeState.colorScheme]);

  // 应用主题到DOM
  const applyThemeToDOM = useCallback(() => {
    const classNames = getThemeClassNames();
    document.body.className = classNames;
  }, [getThemeClassNames]);

  // 在主题变化时应用到DOM
  useEffect(() => {
    applyThemeToDOM();
  }, [applyThemeToDOM]);

  return {
    // 当前状态
    ...themeState,
    currentAlgorithm,
    isDarkMode,
    currentThemeConfig,

    // 操作方法
    changeThemeMode,
    changeThemeAlgorithm,
    changeColorScheme,
    toggleDark,
    resetToSystemTheme,

    // 工具方法
    getThemeClassNames,
    applyThemeToDOM,
  };
};

/**
 * 简化的主题Hook，用于只需要基本功能的场景
 */
export const useSimpleTheme = () => {
  const { mode, isDarkMode, currentThemeConfig, toggleDark, changeColorScheme } =
    useAdvancedTheme();

  return {
    mode,
    isDark: isDarkMode,
    themeConfig: currentThemeConfig,
    toggleDarkMode: toggleDark,
    changeColorScheme,
  };
};
