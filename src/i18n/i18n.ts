import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// 默认语言
type LanguageKey = 'zh-CN' | 'en-US' | 'de-DE' | 'it-IT' | 'ja-JP';
const DEFAULT_LANGUAGE: LanguageKey = 'zh-CN';

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
      // 自定义请求处理
      request: async (
        _options: any,
        url: string,
        _payload: any,
        callback: (error: Error | null, response: { status: number; data: any }) => void,
      ) => {
        // 提取语言代码
        const lng = url.match(/\/api\/languages\/([^/]+)/)?.[1] || DEFAULT_LANGUAGE;

        try {
          // 尝试从localStorage缓存加载
          const cacheKey = `i18n_language_${lng}`;
          const cachedData = localStorage.getItem(cacheKey);

          if (cachedData) {
            try {
              const parsedData = JSON.parse(cachedData);
              // 检查缓存是否过期（24小时）
              const now = Date.now();
              if (now - parsedData.timestamp < 24 * 60 * 60 * 1000) {
                callback(null, { status: 200, data: parsedData.resources });
                return;
              }
            } catch (parseError) {
              console.warn('Cache parse error:', parseError);
            }
          }

          // 如果缓存不存在或过期，则请求云端
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          // 缓存云端数据
          const cacheData = {
            resources: data,
            timestamp: Date.now(),
            version: '1.0.0',
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));

          callback(null, { status: 200, data });
        } catch (error) {
          console.warn('Language loading failed, using fallback:', error);

          // 降级到本地JSON文件
          try {
            const localResponse = await import(`../locales/${lng}.json`);
            const localData = localResponse.default;
            callback(null, { status: 200, data: localData });
          } catch (localError) {
            console.error('Local language file loading failed:', localError);
            // 最后的降级方案 - 使用默认语言的本地文件
            try {
              const defaultResponse = await import(`../locales/${DEFAULT_LANGUAGE}.json`);
              const defaultData = defaultResponse.default;
              callback(null, { status: 200, data: defaultData });
            } catch (defaultError) {
              console.error('Default language loading failed:', defaultError);
              callback(new Error('Failed to load any language resources'), {
                status: 500,
                data: {},
              });
            }
          }
        }
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

    // 默认语言
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
    await i18n.changeLanguage(lng);
    // 保存到localStorage
    localStorage.setItem('i18nextLng', lng);
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

export default i18n;
