// 生产环境配置
export const prodConfig = {
  // API 配置
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.yourdomain.com',
    timeout: 10000,
    withCredentials: true,
  },

  // 安全配置
  security: {
    enableCSRF: true,
    enableXSSProtection: true,
    enableCSP: true,
    allowedDomains: ['yourdomain.com', 'api.yourdomain.com'],
  },

  // 性能优化
  performance: {
    enableCodeSplitting: true,
    enableLazyLoading: true,
    enablePrefetch: true,
    enablePreload: true,
    bundleAnalyzer: false,
  },

  // 缓存配置
  cache: {
    enableServiceWorker: true,
    cacheVersion: 'v1.0.0',
    maxCacheSize: 50 * 1024 * 1024, // 50MB
  },

  // 日志配置
  logging: {
    enableRemoteLogging: true,
    logLevel: 'error',
    remoteEndpoint: import.meta.env.VITE_LOG_ENDPOINT,
  },

  // 监控配置
  monitoring: {
    enableAPM: true,
    apmServer: import.meta.env.VITE_APM_SERVER,
    sampleRate: 0.1, // 10%采样率
  },

  // 第三方服务
  thirdParty: {
    analytics: {
      googleAnalyticsId: import.meta.env.VITE_GA_ID,
      enable: !!import.meta.env.VITE_GA_ID,
    },
    sentry: {
      dsn: import.meta.env.VITE_SENTRY_DSN,
      enable: !!import.meta.env.VITE_SENTRY_DSN,
      tracesSampleRate: 0.1,
    },
  },
};

export default prodConfig;
