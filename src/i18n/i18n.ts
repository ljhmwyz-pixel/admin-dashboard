import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { cacheManager } from './CacheManager';
import { DEFAULT_LANGUAGE } from './constants';
import type { LanguageKey } from './types';

// 在初始化前优先读取localStorage中的语言设置
const getStoredLanguage = (): LanguageKey => {
  const storedLang = localStorage.getItem('i18nextLng');
  if (storedLang && ['zh-CN', 'en-US', 'de-DE', 'it-IT', 'ja-JP'].includes(storedLang)) {
    return storedLang as LanguageKey;
  }
  return DEFAULT_LANGUAGE;
};

// 导出缓存预热函数，让调用方决定何时执行
export const initializeCacheWarmUp = () => {
  // 延迟到浏览器环境完全准备好后再执行
  setTimeout(() => {
    cacheManager.warmUpCache().catch((error) => {
      console.warn('Cache warm-up failed:', error);
    });
  }, 500); // 增加延迟时间确保环境准备充分
};

const INITIAL_LANGUAGE = getStoredLanguage();

// 初始化i18n实例
i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    // 后端配置
    backend: {
      // 云端语言包API地址
      loadPath: '/api/languages/{{lng}}/{{ns}}',
      // 请求参数
      requestOptions: {
        cache: 'no-cache',
      },
      // 自定义请求处理 - 使用新的缓存管理器
      request: async (
        _options: any,
        url: string,
        _payload: any,
        callback: (error: Error | null, response: { status: number; data: any }) => void,
      ) => {
        // 提取语言代码
        const lng = (url.match(/\/api\/languages\/([^/]+)/)?.[1] ||
          DEFAULT_LANGUAGE) as LanguageKey;

        // try {
        //   // 尝试从缓存加载
        //   const cachedEntry = cacheManager.get(lng);

        //   if (cachedEntry) {
        //     callback(null, { status: 200, data: cachedEntry.resources });
        //     return;
        //   }

        //   // 如果缓存不存在或过期，则请求云端
        //   const response = await fetch(url, {
        //     method: 'GET',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   });

        //   if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        //   }

        //   const data = await response.json();

        //   // 缓存云端数据
        //   cacheManager.set(lng, data, '1.0.0');
        //   callback(null, { status: 200, data });
        // } catch (error) {
        //   console.warn('Language loading failed, using fallback:', error);

        // 降级到本地JSON文件
        try {
          const localResponse = await import(`@assets/locales/${lng}.json`);
          const localData = localResponse.default;
          cacheManager.set(lng, localData, 'local');
          callback(null, { status: 200, data: localData });
        } catch (localError) {
          console.error('Local language file loading failed:', localError);
          // 最后的降级方案 - 使用默认语言的本地文件
          try {
            const defaultResponse = await import(`@assets/locales/${DEFAULT_LANGUAGE}.json`);
            const defaultData = defaultResponse.default;
            cacheManager.set(DEFAULT_LANGUAGE, defaultData, 'default');
            callback(null, { status: 200, data: defaultData });
          } catch (defaultError) {
            console.error('Default language loading failed:', defaultError);
            callback(new Error('Failed to load any language resources'), {
              status: 500,
              data: {},
            });
          }
        }
        // }
      },
    },

    // 检测器配置
    detection: {
      // 检测顺序
      order: ['localStorage', 'navigator'],
      // 缓存位置
      caches: ['localStorage'],
      // localStorage键名
      lookupLocalStorage: 'i18nextLng',
    },

    // 支持的语言
    supportedLngs: ['zh-CN', 'en-US', 'de-DE', 'it-IT', 'ja-JP'],

    // 默认语言 - 使用localStorage中保存的语言或默认语言
    lng: INITIAL_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,

    // 命名空间
    ns: ['translation'],
    defaultNS: 'translation',

    // 调试模式
    debug: false,

    // 插值配置
    interpolation: {
      escapeValue: false, // React已经安全处理
    },

    // React配置
    react: {
      useSuspense: false, // 不使用Suspense
    },
  });

// 语言切换函数
export const changeLanguage = async (lng: LanguageKey): Promise<void> => {
  try {
    // 先保存到localStorage，确保检测器能读取到
    localStorage.setItem('i18nextLng', lng);
    // 再执行语言切换
    await i18n.changeLanguage(lng);
  } catch (error) {
    console.error('Failed to change language:', error);

    throw error;
  }
};

// 获取当前语言
export const getCurrentLanguage = (): LanguageKey => {
  return i18n.language as LanguageKey;
};

// 获取支持的语言列表
export const getSupportedLanguages = () => {
  return [
    { key: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
    { key: 'en-US', name: 'English', flag: '🇺🇸' },
    { key: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
    { key: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
    { key: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  ];
};

// 导出缓存工具
export { cacheManager };

export default i18n;
