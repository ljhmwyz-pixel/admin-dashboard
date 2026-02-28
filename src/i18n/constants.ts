import type { LanguageKey } from './types';

// 默认语言
export const DEFAULT_LANGUAGE: LanguageKey = 'zh-CN';

// 语言包缓存键名前缀
export const LANGUAGE_CACHE_PREFIX = 'i18n_language_';

// 缓存过期时间（24小时）
export const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000;

// 云端API基础URL
export const API_BASE_URL = '/api';

// 语言包API端点
export const LANGUAGE_API_ENDPOINT = `${API_BASE_URL}/languages`;