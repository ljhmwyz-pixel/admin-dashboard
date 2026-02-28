// 核心配置
export { default as i18n } from './i18n';
export { changeLanguage, getCurrentLanguage, getSupportedLanguages } from './i18n';

// 类型定义
export type { LanguageKey, LanguageConfig, LanguageState, UseLanguageReturn } from './types';

// 常量
export { DEFAULT_LANGUAGE, LANGUAGE_CACHE_PREFIX, CACHE_EXPIRY_TIME } from './constants';

// 缓存工具
export {
  saveLanguageCache,
  loadLanguageResources,
  clearLanguageCache,
  clearAllLanguageCache,
  getCacheStats
} from './cache';