import { useState, useEffect, useCallback } from 'react';
import type { ThemeType } from '../config/theme';
import { getCurrentTheme, switchTheme } from '../config/theme';

/**
 * 主题切换Hook
 */
export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('default');
  const [isLoading, setIsLoading] = useState(false);

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType || 'default';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTheme(savedTheme);
  }, []);

  /**
   * 切换主题
   */
  const toggleTheme = useCallback(async (theme: ThemeType) => {
    if (theme === currentTheme) return;
    
    setIsLoading(true);
    
    try {
      // 添加切换动画类
      document.body.classList.add('theme-transition');
      
      // 切换主题
      switchTheme(theme);
      setCurrentTheme(theme);
      
      // 保持动画效果
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
        setIsLoading(false);
      }, 300);
      
    } catch (error) {
      console.error('Failed to switch theme:', error);
      document.body.classList.remove('theme-transition');
      setIsLoading(false);
    }
  }, [currentTheme]);

  /**
   * 切换暗色模式
   */
  const toggleDarkMode = useCallback(() => {
    const newTheme = currentTheme === 'dark' ? 'default' : 'dark';
    toggleTheme(newTheme);
  }, [currentTheme, toggleTheme]);

  return {
    currentTheme,
    isLoading,
    toggleTheme,
    toggleDarkMode,
    themeConfig: getCurrentTheme(),
  };
};