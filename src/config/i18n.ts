import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// 缓存配置
const CACHE_KEY = 'i18n_resources';
const CACHE_TIMESTAMP_KEY = 'i18n_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

// 先配置i18n实例
i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next);

// 初始化配置
const initConfig = {
  fallbackLng: 'zh-CN',
  debug: import.meta.env.DEV,
  
  interpolation: {
    escapeValue: false,
  },

  backend: {
    loadPath: '/api/locales/{{lng}}/{{ns}}.json',
    requestOptions: {
      cache: 'no-store', // 禁用HTTP缓存，使用自定义缓存机制
    },
  },

  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
  },

  // 自定义缓存机制
  react: {
    useSuspense: false,
  },

  // 预加载常用命名空间
  ns: ['common', 'dashboard', 'users'],
  defaultNS: 'common',
};

// 在i18n初始化完成后添加缓存控制
i18n.init(initConfig).then(() => {
  // 添加缓存控制
  if (i18n.services?.backendConnector?.backend) {
    i18n.services.backendConnector.backend.read = function(
      language: string,
      namespace: string,
      callback: (error: Error | null, data: unknown) => void
    ) {
  const cacheKey = `${CACHE_KEY}_${language}_${namespace}`;
  const timestampKey = `${CACHE_TIMESTAMP_KEY}_${language}_${namespace}`;
  
  // 检查本地缓存
  const cachedData = localStorage.getItem(cacheKey);
  const cachedTimestamp = localStorage.getItem(timestampKey);
  
  if (cachedData && cachedTimestamp) {
    const now = Date.now();
    const cacheTime = parseInt(cachedTimestamp);
    
    // 如果缓存未过期，直接使用缓存
    if (now - cacheTime < CACHE_DURATION) {
      try {
        const resources = JSON.parse(cachedData);
        callback(null, resources);
        return;
      } catch {
        // 解析失败，清除缓存
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(timestampKey);
      }
    }
  }
  
  // 缓存过期或不存在，从服务器获取
  fetch(`/api/locales/${language}/${namespace}.json`)
    .then(response => response.json())
    .then(data => {
      // 存储到本地缓存
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(timestampKey, Date.now().toString());
      callback(null, data);
    })
    .catch(error => {
      console.error('Failed to load translations:', error);
      callback(error, null);
    });
  };
}
}).catch((error) => {
  console.error('Failed to initialize i18n:', error);
});

export default i18n;