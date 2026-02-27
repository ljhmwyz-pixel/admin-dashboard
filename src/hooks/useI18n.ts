import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * 自定义国际化Hook
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  /**
   * 切换语言
   */
  const changeLanguage = useCallback(async (lng: string) => {
    try {
      // 显示加载状态
      document.body.style.cursor = 'wait';
      
      // 异步切换语言
      await i18n.changeLanguage(lng);
      
      // 更新本地存储
      localStorage.setItem('i18nextLng', lng);
      
      // 完成后恢复光标
      document.body.style.cursor = 'default';
    } catch (error) {
      console.error('Failed to change language:', error);
      document.body.style.cursor = 'default';
    }
  }, [i18n]);

  /**
   * 预加载语言包
   */
  const preloadLanguages = useCallback((languages: string[]) => {
    languages.forEach(lng => {
      i18n.loadLanguages([lng]).catch(console.error);
    });
  }, [i18n]);

  return {
    t,
    i18n,
    currentLanguage: i18n.language,
    changeLanguage,
    preloadLanguages,
  };
};