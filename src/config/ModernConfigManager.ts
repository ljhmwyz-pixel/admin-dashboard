import configSchema from './schema';

class ModernConfigManager {
  private static instance: ModernConfigManager;
  private config: any;

  private constructor() {
    this.config = configSchema.getProperties();
  }

  public static getInstance(): ModernConfigManager {
    if (!ModernConfigManager.instance) {
      ModernConfigManager.instance = new ModernConfigManager();
    }
    return ModernConfigManager.instance;
  }

  public getConfig(): any {
    return this.config;
  }

  public get<T>(path: string, defaultValue?: T): T {
    const keys = path.split('.');
    let result = this.config;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return defaultValue as T;
      }
    }

    return result as T;
  }

  public isDevelopment(): boolean {
    return this.get('env') === 'development';
  }

  public isProduction(): boolean {
    return this.get('env') === 'production';
  }

  public getEnv(): string {
    return this.get('env', 'development');
  }

  // 获取API基础URL
  public getApiBaseUrl(): string {
    return this.get('api.baseURL', 'http://localhost:3000');
  }

  // 获取超时时间
  public getApiTimeout(): number {
    return this.get('api.timeout', 5000);
  }

  // 检查是否启用某个功能
  public isFeatureEnabled(featurePath: string): boolean {
    return this.get(`features.${featurePath}`, false);
  }

  // 获取第三方服务配置
  public getThirdPartyConfig(service: string): any {
    return this.get(`thirdParty.${service}`, {});
  }
}

// 创建全局配置实例
const modernConfigManager = ModernConfigManager.getInstance();

// 方便使用的快捷方法
export const getConfig = modernConfigManager.getConfig.bind(modernConfigManager);
export const get = modernConfigManager.get.bind(modernConfigManager);
export const isDev = modernConfigManager.isDevelopment.bind(modernConfigManager);
export const isProd = modernConfigManager.isProduction.bind(modernConfigManager);
export const getEnv = modernConfigManager.getEnv.bind(modernConfigManager);

export default modernConfigManager;
