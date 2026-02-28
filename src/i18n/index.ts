// 核心配置
export { default as i18n } from './i18n';
export { changeLanguage, getCurrentLanguage, getSupportedLanguages } from './i18n';

// 类型定义
export type { LanguageConfig, LanguageKey, LanguageState, UseLanguageReturn } from './types';

// 常量
export { CACHE_EXPIRY_TIME, DEFAULT_LANGUAGE, LANGUAGE_CACHE_PREFIX } from './constants';

// 缓存工具
export {
  clearAllLanguageCache,
  clearLanguageCache,
  getCacheStats,
  loadLanguageResources,
  saveLanguageCache,
} from './cache';
