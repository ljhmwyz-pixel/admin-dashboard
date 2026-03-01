// 浏览器环境友好的配置管理

// 简化的配置模式（避免 convict 在浏览器中的问题）
const createConfigSchema = () => {
  const defaults = {
    env: 'development',
    api: {
      baseURL: 'http://localhost:3000',
      timeout: 10000,
      withCredentials: true,
    },
    security: {
      enableCSRF: false,
      enableXSSProtection: false,
      enableCSP: false,
      allowedDomains: ['localhost'],
    },
    performance: {
      enableCodeSplitting: false,
      enableLazyLoading: false,
      enablePrefetch: false,
      bundleAnalyzer: true,
    },
    cache: {
      enableServiceWorker: false,
      cacheVersion: 'dev',
      maxCacheSize: 10485760,
    },
    logging: {
      enableRemoteLogging: false,
      logLevel: 'debug',
      remoteEndpoint: '',
    },
    monitoring: {
      enableAPM: false,
      apmServer: '',
      sampleRate: 1.0,
    },
    thirdParty: {
      analytics: {
        googleAnalyticsId: '',
        enable: false,
      },
      sentry: {
        dsn: '',
        enable: false,
        tracesSampleRate: 1.0,
      },
    },
  };

  // 安全的配置获取方法
  const getConfig = (path: string, defaultValue?: any) => {
    try {
      const keys = path.split('.');
      let current: any = defaults;

      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return defaultValue !== undefined ? defaultValue : null;
        }
      }

      return current;
    } catch (error) {
      console.warn(`Failed to get config for path: ${path}`, error);
      return defaultValue !== undefined ? defaultValue : null;
    }
  };

  return {
    get: getConfig,
    getDefault: () => ({ ...defaults }),
    getProperties: () => ({ ...defaults }),
    // 模拟 convict 的方法
    load: () => {},
    validate: () => {},
  };
};

const configSchema = createConfigSchema();

export default configSchema;
