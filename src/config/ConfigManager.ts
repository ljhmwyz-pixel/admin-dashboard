// 环境配置管理器
import { devConfig } from './dev';
import { prodConfig } from './prod';

class ConfigManager {
  private static instance: ConfigManager;
  private config: any;

  private constructor() {
    this.initConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private initConfig(): void {
    const isDev = import.meta.env.DEV;
    this.config = isDev ? devConfig : prodConfig;
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
    return import.meta.env.DEV;
  }

  public isProduction(): boolean {
    return import.meta.env.PROD;
  }

  public getEnv(): string {
    return import.meta.env.MODE || 'development';
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
const configManager = ConfigManager.getInstance();

// 方便使用的快捷方法
export const getConfig = configManager.getConfig.bind(configManager);
export const get = configManager.get.bind(configManager);
export const isDev = configManager.isDevelopment.bind(configManager);
export const isProd = configManager.isProduction.bind(configManager);
export const getEnv = configManager.getEnv.bind(configManager);

export default configManager;
