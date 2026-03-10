// 外部依赖
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { ThemeConfig } from 'antd';

import { getThemeConfig, SystemThemeDetector, ThemePersistence } from '../../config/themes';
// 内部模块
import type { ThemeAlgorithm } from '../../core/store/slices/themeSlice';
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
} from '../../core/store/slices/themeSlice';

// 使用原生防抖实现
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;

  const debouncedFunc = function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  } as T & { cancel: () => void };

  debouncedFunc.cancel = () => {
    clearTimeout(timeout);
  };

  return debouncedFunc;
}

// ThemeState 类型通过 any 断言处理
// 从 themeSlice 导入必要的类型

/**
 * 统一主题管理Hook
 * 整合了所有主题相关功能，提供高性能的主题切换体验
 */
export const useUnifiedTheme = () => {
  const dispatch = useDispatch();
  const themeState = useSelector(selectTheme) as any;
  const currentAlgorithm = useSelector(selectCurrentAlgorithm);
  const isDarkMode = useSelector(selectIsDarkMode);

  // 使用useRef避免重复创建实例
  const systemDetectorRef = useRef<SystemThemeDetector | null>(null);
  const debouncedSaveRef = useRef<ReturnType<typeof debounce> | null>(null);

  // 初始化系统主题检测器
  if (!systemDetectorRef.current) {
    systemDetectorRef.current = new SystemThemeDetector();
  }

  // 初始化防抖保存函数
  if (!debouncedSaveRef.current) {
    debouncedSaveRef.current = debounce((config: any) => {
      ThemePersistence.save(config);
    }, 300);
  }

  // 获取当前主题配置 - 使用useMemo优化性能
  const currentThemeConfig = useMemo<ThemeConfig>(() => {
    const config = getThemeConfig(currentAlgorithm, themeState.colorScheme);
    return config;
  }, [currentAlgorithm, themeState.colorScheme]);

  // 初始化主题 - 只在组件挂载时执行一次
  useEffect(() => {
    const initializeTheme = async () => {
      dispatch(setLoading(true));

      try {
        const detector = systemDetectorRef.current!;

        // 获取系统主题偏好
        const systemPreference = detector.getSystemPreference();
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
        detector.startListening();
        detector.addListener((isDark: boolean) => {
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
      systemDetectorRef.current?.stopListening();
      debouncedSaveRef.current?.cancel();
    };
  }, [dispatch]); // 添加dispatch到依赖数组

  // 监听主题状态变化并防抖保存
  useEffect(() => {
    const configToSave = {
      mode: themeState.mode,
      algorithm: themeState.algorithm,
      colorScheme: themeState.colorScheme,
      isManualOverride: themeState.isManualOverride,
    };

    debouncedSaveRef.current?.(configToSave);
  }, [themeState.mode, themeState.algorithm, themeState.colorScheme, themeState.isManualOverride]);

  // 操作方法 - 使用useCallback优化
  const changeThemeMode = useCallback(
    (mode: ThemeMode) => {
      dispatch(setThemeMode(mode));
    },
    [dispatch],
  );

  const changeThemeAlgorithm = useCallback(
    (algorithm: ThemeAlgorithm) => {
      dispatch(setThemeAlgorithm(algorithm));
    },
    [dispatch],
  );

  const changeColorScheme = useCallback(
    (colorScheme: ColorScheme) => {
      dispatch(setColorScheme(colorScheme));
    },
    [dispatch],
  );

  const toggleDark = useCallback(() => {
    dispatch(toggleDarkMode());
  }, [dispatch]);

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

// 简化版本Hook，用于基本需求
export const useTheme = () => {
  const { mode, isDarkMode, currentThemeConfig, toggleDark, changeColorScheme, isLoading } =
    useUnifiedTheme();

  return {
    mode,
    isDark: isDarkMode,
    themeConfig: currentThemeConfig,
    toggleDarkMode: toggleDark,
    changeColorScheme,
    isLoading,
  };
};

// 上下文版本Hook
export const useThemeContext = () => {
  return useUnifiedTheme();
};
