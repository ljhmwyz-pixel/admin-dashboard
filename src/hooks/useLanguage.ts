import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type SimpleLanguageKey = 'zh-CN' | 'en-US' | 'de-DE' | 'it-IT' | 'ja-JP';

interface SimpleUseLanguageReturn {
  currentLanguage: SimpleLanguageKey;
  supportedLanguages: Array<{ key: SimpleLanguageKey; name: string; flag: string }>;
  isLoading: boolean;
  error: string | null;
  changeLanguage: (lng: SimpleLanguageKey) => Promise<void>;
  t: (key: string, options?: Record<string, any>) => string;
}

/**
 * 简化版语言管理Hook
 */
export const useLanguage = (): SimpleUseLanguageReturn => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<SimpleLanguageKey>('zh-CN');

  // 监听语言变化
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguage(lng as SimpleLanguageKey);
    };

    // 监听i18n语言变化事件
    if (i18n && i18n.on) {
      i18n.on('languageChanged', handleLanguageChanged);
    }

    // 设置初始语言
    setCurrentLanguage((i18n.language || 'zh-CN') as SimpleLanguageKey);

    // 清理监听器
    return () => {
      if (i18n && i18n.off) {
        i18n.off('languageChanged', handleLanguageChanged);
      }
    };
  }, [i18n]);

  /**
   * 切换语言
   */
  const changeLanguage = async (lng: SimpleLanguageKey): Promise<void> => {
    if (lng === currentLanguage) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 执行语言切换
      if (i18n && i18n.changeLanguage) {
        await i18n.changeLanguage(lng);
      }

      // 保存到localStorage
      localStorage.setItem('i18nextLng', lng);

      // 更新状态
      setCurrentLanguage(lng);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change language';
      setError(errorMessage);
      console.error('Language change error:', err);

      // 如果切换失败，尝试回滚到默认语言
      try {
        if (i18n && i18n.changeLanguage) {
          await i18n.changeLanguage('zh-CN');
        }
        setCurrentLanguage('zh-CN');
      } catch (rollbackError) {
        console.error('Rollback to default language failed:', rollbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentLanguage,
    supportedLanguages: [
      { key: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
      { key: 'en-US', name: 'English', flag: '🇺🇸' },
      { key: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
      { key: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
      { key: 'ja-JP', name: '日本語', flag: '🇯🇵' },
    ],
    isLoading,
    error,
    changeLanguage,
    t,
  };
};
