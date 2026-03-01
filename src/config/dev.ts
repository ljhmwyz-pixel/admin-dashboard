// 开发环境配置
export const devConfig = {
  // API 配置
  api: {
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    withCredentials: true,
  },

  // 安全配置
  security: {
    enableCSRF: false,
    enableXSSProtection: false,
    enableCSP: false,
    allowedDomains: ['localhost'],
  },

  // 性能优化
  performance: {
    enableCodeSplitting: false,
    enableLazyLoading: false,
    enablePrefetch: false,
    enablePreload: false,
    bundleAnalyzer: true,
  },

  // 缓存配置
  cache: {
    enableServiceWorker: false,
    cacheVersion: 'dev',
    maxCacheSize: 10 * 1024 * 1024, // 10MB
  },

  // 日志配置
  logging: {
    enableRemoteLogging: false,
    logLevel: 'debug',
    remoteEndpoint: null,
  },

  // 监控配置
  monitoring: {
    enableAPM: false,
    apmServer: null,
    sampleRate: 1.0, // 100%采样率
  },

  // 功能开关
  features: {
    mockData: true,
    debugPanel: true,
    performanceMonitoring: true,
    errorTracking: true,
  },

  // 第三方服务
  thirdParty: {
    analytics: {
      googleAnalyticsId: null,
      enable: false,
    },
    sentry: {
      dsn: null,
      enable: false,
      tracesSampleRate: 1.0,
    },
  },
};

export default devConfig;
