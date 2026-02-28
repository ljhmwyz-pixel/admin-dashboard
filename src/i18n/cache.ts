import { LANGUAGE_CACHE_PREFIX, CACHE_EXPIRY_TIME } from './constants';
import type { LanguageKey } from './types';

/**
 * 保存语言包到本地缓存
 */
export const saveLanguageCache = async (language: LanguageKey, resources: Record<string, string>): Promise<void> => {
  try {
    const cacheData = {
      resources,
      timestamp: Date.now(),
      version: '1.0.0'
    };
    
    const cacheKey = `${LANGUAGE_CACHE_PREFIX}${language}`;
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to save language cache:', error);
  }
};

/**
 * 从本地缓存加载语言包
 */
export const loadLanguageResources = async (language: LanguageKey): Promise<Record<string, string> | null> => {
  try {
    const cacheKey = `${LANGUAGE_CACHE_PREFIX}${language}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) {
      return null;
    }
    
    const parsedData = JSON.parse(cachedData);
    
    // 检查缓存是否过期
    const now = Date.now();
    if (now - parsedData.timestamp > CACHE_EXPIRY_TIME) {
      // 缓存过期，清除缓存
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return parsedData.resources;
  } catch (error) {
    console.warn('Failed to load language cache:', error);
    return null;
  }
};

/**
 * 清除特定语言的缓存
 */
export const clearLanguageCache = (language: LanguageKey): void => {
  try {
    const cacheKey = `${LANGUAGE_CACHE_PREFIX}${language}`;
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.warn('Failed to clear language cache:', error);
  }
};

/**
 * 清除所有语言缓存
 */
export const clearAllLanguageCache = (): void => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(LANGUAGE_CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear all language cache:', error);
  }
};

/**
 * 获取缓存统计信息
 */
export const getCacheStats = (): Record<LanguageKey, { exists: boolean; timestamp?: number; size?: number }> => {
  const stats: Record<LanguageKey, any> = {} as any;
  
  try {
    ['zh-CN', 'en-US', 'de-DE', 'it-IT', 'ja-JP'].forEach(lang => {
      const cacheKey = `${LANGUAGE_CACHE_PREFIX}${lang}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          stats[lang as LanguageKey] = {
            exists: true,
            timestamp: parsed.timestamp,
            size: cachedData.length
          };
        } catch {
          stats[lang as LanguageKey] = { exists: false };
        }
      } else {
        stats[lang as LanguageKey] = { exists: false };
      }
    });
  } catch (error) {
    console.warn('Failed to get cache stats:', error);
  }
  
  return stats;
};