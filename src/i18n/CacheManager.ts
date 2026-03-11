/**
 * 多语言缓存管理器
 * 负责语言包的缓存、更新和清理
 */

import { CACHE_EXPIRY_TIME, DEFAULT_LANGUAGE, LANGUAGE_CACHE_PREFIX } from './constants';
import type { LanguageKey } from './types';

interface CacheEntry {
  resources: Record<string, string>;
  timestamp: number;
  version: string;
  size: number;
}

interface CacheStats {
  hitRate: number;
  missRate: number;
  totalRequests: number;
  cacheSize: number;
  lastCleanup: number;
}

export class LanguageCacheManager {
  private static instance: LanguageCacheManager;
  private stats: CacheStats = {
    hitRate: 0,
    missRate: 0,
    totalRequests: 0,
    cacheSize: 0,
    lastCleanup: Date.now(),
  };

  private constructor() {}

  static getInstance(): LanguageCacheManager {
    if (!LanguageCacheManager.instance) {
      LanguageCacheManager.instance = new LanguageCacheManager();
    }
    return LanguageCacheManager.instance;
  }

  /**
   * 获取缓存键名
   */
  private getCacheKey(language: LanguageKey): string {
    return `${LANGUAGE_CACHE_PREFIX}${language}`;
  }

  /**
   * 检查缓存是否有效
   */
  private isCacheValid(entry: CacheEntry): boolean {
    const now = Date.now();
    // 对于预加载的内容使用更长的有效期
    const isPreloaded = entry.version.includes('preload');
    const effectiveExpiryTime = isPreloaded
      ? CACHE_EXPIRY_TIME * 7 // 预加载内容7天有效期
      : CACHE_EXPIRY_TIME; // 普通内容24小时有效期

    return now - entry.timestamp < effectiveExpiryTime;
  }

  /**
   * 计算资源大小（字节）
   */
  private calculateSize(resources: Record<string, string>): number {
    return new Blob([JSON.stringify(resources)]).size;
  }

  /**
   * 获取语言包缓存
   */
  get(language: LanguageKey): CacheEntry | null {
    this.stats.totalRequests++;

    try {
      const cacheKey = this.getCacheKey(language);
      const cachedData = localStorage.getItem(cacheKey);

      if (!cachedData) {
        this.stats.missRate =
          (this.stats.missRate * (this.stats.totalRequests - 1) + 1) / this.stats.totalRequests;
        return null;
      }

      const entry: CacheEntry = JSON.parse(cachedData);

      if (this.isCacheValid(entry)) {
        this.stats.hitRate =
          (this.stats.hitRate * (this.stats.totalRequests - 1) + 1) / this.stats.totalRequests;
        return entry;
      } else {
        // 缓存过期，删除旧缓存
        this.remove(language);
        this.stats.missRate =
          (this.stats.missRate * (this.stats.totalRequests - 1) + 1) / this.stats.totalRequests;
        return null;
      }
    } catch (error) {
      console.warn('Cache get error:', error);
      this.stats.missRate =
        (this.stats.missRate * (this.stats.totalRequests - 1) + 1) / this.stats.totalRequests;
      return null;
    }
  }

  /**
   * 设置语言包缓存
   */
  set(language: LanguageKey, resources: Record<string, string>, version = '1.0.0'): void {
    try {
      const cacheKey = this.getCacheKey(language);
      const entry: CacheEntry = {
        resources,
        timestamp: Date.now(),
        version,
        size: this.calculateSize(resources),
      };

      localStorage.setItem(cacheKey, JSON.stringify(entry));
      this.updateCacheSize();

      // 检查是否需要清理
      this.checkAndClean();
    } catch (error) {
      console.error('Cache set error:', error);
      // 如果是存储空间不足，尝试清理旧缓存
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.cleanOldEntries();
        // 重试一次
        try {
          const cacheKey = this.getCacheKey(language);
          const entry: CacheEntry = {
            resources,
            timestamp: Date.now(),
            version,
            size: this.calculateSize(resources),
          };
          localStorage.setItem(cacheKey, JSON.stringify(entry));
        } catch (retryError) {
          console.error('Retry cache set failed:', retryError);
        }
      }
    }
  }

  /**
   * 删除指定语言缓存
   */
  remove(language: LanguageKey): void {
    try {
      const cacheKey = this.getCacheKey(language);
      localStorage.removeItem(cacheKey);
      this.updateCacheSize();
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  /**
   * 清理所有语言缓存
   */
  clearAll(): void {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(LANGUAGE_CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      this.updateCacheSize();
      this.stats.lastCleanup = Date.now();
    } catch (error) {
      console.error('Cache clear all error:', error);
    }
  }

  /**
   * 清理过期缓存
   */
  cleanExpired(): number {
    let cleanedCount = 0;
    const now = Date.now();

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(LANGUAGE_CACHE_PREFIX)) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const entry: CacheEntry = JSON.parse(data);
            if (now - entry.timestamp >= CACHE_EXPIRY_TIME) {
              localStorage.removeItem(key);
              cleanedCount++;
            }
          }
        } catch {
          // 解析失败的数据也清理掉
          localStorage.removeItem(key);
          cleanedCount++;
        }
      }
    });

    this.updateCacheSize();
    this.stats.lastCleanup = Date.now();
    return cleanedCount;
  }

  /**
   * 清理最旧的缓存条目
   */
  private cleanOldEntries(): void {
    const entries: Array<{ key: string; timestamp: number }> = [];

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(LANGUAGE_CACHE_PREFIX)) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const entry: CacheEntry = JSON.parse(data);
            entries.push({ key, timestamp: entry.timestamp });
          }
        } catch {
          // 无法解析的条目直接删除
          localStorage.removeItem(key);
        }
      }
    });

    // 按时间排序，删除最旧的一半
    entries.sort((a, b) => a.timestamp - b.timestamp);
    const halfPoint = Math.floor(entries.length / 2);

    for (let i = 0; i < halfPoint; i++) {
      localStorage.removeItem(entries[i].key);
    }

    this.updateCacheSize();
  }

  /**
   * 检查并清理缓存
   */
  private checkAndClean(): void {
    const now = Date.now();
    // 每小时检查一次
    if (now - this.stats.lastCleanup > 60 * 60 * 1000) {
      this.cleanExpired();
    }
  }

  /**
   * 更新缓存大小统计
   */
  private updateCacheSize(): void {
    let totalSize = 0;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(LANGUAGE_CACHE_PREFIX)) {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      }
    });
    this.stats.cacheSize = totalSize;
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * 智能预加载常用语言包
   */
  async preloadLanguages(languages: LanguageKey[] = ['en-US', 'zh-CN']): Promise<void> {
    const loadPromises = languages.map(async (lang) => {
      // 即使已有缓存也检查是否需要更新
      try {
        const module = await import(`@assets/locales/${lang}.json`);
        this.set(lang, module.default, 'preload-v1.0');
        console.log(`✅ Preloaded language: ${lang}`);
      } catch (error) {
        console.warn(`⚠️ Failed to preload language ${lang}:`, error);
      }
    });

    await Promise.all(loadPromises);
  }

  /**
   * 基于用户行为的智能预加载
   */
  async smartPreload(): Promise<void> {
    // 获取用户偏好的语言
    const userPreferredLang = this.getUserPreferredLanguage();

    // 获取地理位置相关的语言
    const geoLanguages = this.getGeoBasedLanguages();

    // 获取浏览器语言
    const browserLanguages = this.getBrowserLanguages();

    // 合并并去重，优先级：用户偏好 > 地理位置 > 浏览器设置
    try {
      // 确保所有数组都有默认值
      const safeUserLang = userPreferredLang || 'en-US';
      const safeGeoLangs = Array.isArray(geoLanguages) ? geoLanguages : ['en-US'];
      const safeBrowserLangs = Array.isArray(browserLanguages) ? browserLanguages : ['en-US'];

      const mergedLanguages = [safeUserLang, ...safeGeoLangs, ...safeBrowserLangs].filter(
        (lang): lang is LanguageKey => Boolean(lang) && typeof lang === 'string',
      );

      // 确保 Set 构造不会失败
      const uniqueLanguages = new Set(mergedLanguages);
      const languagesArray = Array.from(uniqueLanguages);

      // 安全的 slice 操作
      const filteredLanguages = languagesArray
        .slice(0, 3)
        .filter((lang): lang is LanguageKey =>
          ['zh-CN', 'en-US', 'de-DE', 'it-IT', 'ja-JP'].includes(lang as LanguageKey),
        );
      const languagesToPreload: LanguageKey[] =
        filteredLanguages.length > 0 ? filteredLanguages : ['en-US'];

      console.log('🤖 Smart preloading languages:', languagesToPreload);
      await this.preloadLanguages(languagesToPreload);
    } catch (error) {
      console.error('Smart preload failed:', error);
      // 降级到默认语言
      await this.preloadLanguages(['en-US']);
    }
  }

  /**
   * 获取用户偏好的语言
   */
  private getUserPreferredLanguage(): LanguageKey {
    // 从localStorage获取用户上次选择的语言
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang && ['zh-CN', 'en-US', 'de-DE', 'it-IT', 'ja-JP'].includes(storedLang)) {
      return storedLang as LanguageKey;
    }
    return DEFAULT_LANGUAGE;
  }

  /**
   * 获取地理位置相关的语言
   */
  private getGeoBasedLanguages(): LanguageKey[] {
    try {
      // 简化的地理位置判断（实际项目中可以从IP地址获取）
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (!timezone) return ['en-US'];

      if (timezone.includes('Asia/Shanghai') || timezone.includes('Asia')) {
        return ['zh-CN', 'en-US'];
      } else if (timezone.includes('Europe')) {
        return ['en-US', 'de-DE', 'it-IT'];
      } else if (timezone.includes('America')) {
        return ['en-US'];
      } else {
        return ['en-US'];
      }
    } catch (error) {
      console.debug('Failed to get geo-based languages:', error);
      return ['en-US'];
    }
  }

  /**
   * 获取浏览器语言设置
   */
  private getBrowserLanguages(): LanguageKey[] {
    try {
      const browserLangs = navigator.languages || (navigator.language ? [navigator.language] : []);

      if (!browserLangs || browserLangs.length === 0) {
        return ['en-US'];
      }

      const supportedLangs: LanguageKey[] = [];

      browserLangs.forEach((lang) => {
        if (typeof lang === 'string') {
          if (lang.startsWith('zh')) {
            supportedLangs.push('zh-CN');
          } else if (lang.startsWith('en')) {
            supportedLangs.push('en-US');
          } else if (lang.startsWith('de')) {
            supportedLangs.push('de-DE');
          } else if (lang.startsWith('it')) {
            supportedLangs.push('it-IT');
          } else if (lang.startsWith('ja')) {
            supportedLangs.push('ja-JP');
          }
        }
      });

      const result = Array.from(new Set(supportedLangs));
      return result.length > 0 ? result : ['en-US'];
    } catch (error) {
      console.debug('Failed to get browser languages:', error);
      return ['en-US'];
    }
  }

  /**
   * 缓存预热 - 在应用启动时预加载关键语言包
   */
  async warmUpCache(): Promise<void> {
    console.log('🔥 Starting cache warm-up...');

    // 首先进行智能预加载
    await this.smartPreload();

    // 预加载所有支持的语言（异步后台加载）
    const allLanguages: LanguageKey[] = ['zh-CN', 'en-US', 'de-DE', 'it-IT', 'ja-JP'];
    const backgroundLoadPromises = allLanguages.map(async (lang) => {
      try {
        // 使用较低优先级加载其他语言
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 延迟加载
        if (!this.get(lang)) {
          // 只有当缓存中没有时才加载
          const module = await import(`@assets/locales/${lang}.json`);
          this.set(lang, module.default, 'background-load');
          console.log(`🌙 Background loaded: ${lang}`);
        }
      } catch (error) {
        console.debug(`Background load failed for ${lang}:`, error);
      }
    });

    // 不等待后台加载完成，让应用快速启动
    Promise.all(backgroundLoadPromises).catch((error) => {
      console.debug('Background cache warming completed with some errors:', error);
    });

    console.log('✅ Cache warm-up initiated');
  }

  /**
   * 获取缓存使用统计
   */
  getCacheStatistics(): {
    totalEntries: number;
    totalSize: number;
    preloadedEntries: number;
    averageEntrySize: number;
  } {
    let totalEntries = 0;
    let totalSize = 0;
    let preloadedEntries = 0;

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(LANGUAGE_CACHE_PREFIX)) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const entry: CacheEntry = JSON.parse(data);
            totalEntries++;
            totalSize += entry.size;
            if (entry.version.includes('preload')) {
              preloadedEntries++;
            }
          }
        } catch (error) {
          console.warn('Failed to parse cache entry:', key, error);
        }
      }
    });

    return {
      totalEntries,
      totalSize,
      preloadedEntries,
      averageEntrySize: totalEntries > 0 ? totalSize / totalEntries : 0,
    };
  }

  /**
   * 获取所有已缓存的语言
   */
  getCachedLanguages(): LanguageKey[] {
    const cachedLanguages: LanguageKey[] = [];

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(LANGUAGE_CACHE_PREFIX)) {
        const lang = key.replace(LANGUAGE_CACHE_PREFIX, '') as LanguageKey;
        if (this.get(lang)) {
          cachedLanguages.push(lang);
        }
      }
    });

    return cachedLanguages;
  }
}

// 导出单例实例
export const cacheManager = LanguageCacheManager.getInstance();
