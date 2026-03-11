import { EnhancedErrorTracker, enhanceSentryConfig } from '@config/errorTracking';
import config from '@config/ModernConfigManager';
import * as Sentry from '@sentry/react';

class ModernErrorTracker {
  private static instance: ModernErrorTracker;
  private initialized: boolean = false;

  private constructor() {
    this.initSentry();
  }

  public static getInstance(): ModernErrorTracker {
    if (!ModernErrorTracker.instance) {
      ModernErrorTracker.instance = new ModernErrorTracker();
    }
    return ModernErrorTracker.instance;
  }

  private initSentry(): void {
    // 应用增强配置
    const enhancedSuccess = enhanceSentryConfig();

    if (enhancedSuccess) {
      this.initialized = true;
      console.info('✅ Modern Error Tracker initialized with enhanced configuration');
    } else {
      // 回退到基础配置
      const sentryConfig = config.getThirdPartyConfig('sentry');

      if (!sentryConfig.enable || !sentryConfig.dsn) {
        console.warn('❌ Sentry not configured or disabled');
        return;
      }

      Sentry.init({
        dsn: sentryConfig.dsn,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: false,
            blockAllMedia: false,
          }),
        ],
        tracesSampleRate: sentryConfig.tracesSampleRate || 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        environment: config.getEnv(),
        release: import.meta.env.VITE_APP_VERSION || 'dev',

        beforeSend: (event, hint) => {
          // 过滤掉开发环境的一些噪音错误
          if (config.isDevelopment()) {
            const error = hint.originalException as Error;
            if (
              error &&
              (error.message.includes('ResizeObserver loop') ||
                error.message.includes('Script error'))
            ) {
              return null;
            }
          }
          return event;
        },
      });

      this.initialized = true;
      console.info('✅ Modern Error Tracker initialized with basic configuration');
    }
  }

  public captureError(error: Error, context?: Record<string, any>): void {
    if (!this.initialized) {
      console.error('❌ Error captured (Sentry not initialized):', error, context);
      return;
    }

    // 使用增强的错误捕获功能
    EnhancedErrorTracker.captureError(error, {
      ...context,
      app: {
        environment: config.getEnv(),
        version: import.meta.env.VITE_APP_VERSION || 'unknown',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
    });
  }

  public captureMessage(
    message: string,
    level: Sentry.SeverityLevel = 'info',
    context?: Record<string, any>,
  ): void {
    if (!this.initialized) {
      // 使用类型安全的方式调用console方法
      switch (level) {
        case 'fatal':
        case 'error':
          console.error('❌ Message captured (Sentry not initialized):', message, context);
          break;
        case 'warning':
          console.warn('⚠️ Message captured (Sentry not initialized):', message, context);
          break;
        case 'log':
        case 'info':
        case 'debug':
        default:
          console.log('ℹ️ Message captured (Sentry not initialized):', message, context);
          break;
      }
      return;
    }

    // 使用增强的消息捕获功能
    EnhancedErrorTracker.captureInfo(message, {
      level,
      ...context,
      app: {
        environment: config.getEnv(),
        version: import.meta.env.VITE_APP_VERSION || 'unknown',
        timestamp: new Date().toISOString(),
      },
    });
  }

  public captureCaughtError(error: unknown, componentStack?: string): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));

    if (componentStack) {
      errorObj.stack = `${errorObj.stack}\nComponent stack:\n${componentStack}`;
    }

    this.captureError(errorObj, {
      react: {
        componentStack,
      },
    });
  }

  public setUser(userInfo: { id: string; email?: string; username?: string }): void {
    if (this.initialized) {
      EnhancedErrorTracker.setUser({
        id: userInfo.id,
        email: userInfo.email,
        username: userInfo.username,
      });
      console.info('👤 User context set:', userInfo);
    }
  }

  public clearUser(): void {
    if (this.initialized) {
      EnhancedErrorTracker.clearUser();
      console.info('🧹 User context cleared');
    }
  }

  public addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
    if (this.initialized) {
      EnhancedErrorTracker.addBreadcrumb(breadcrumb);
      console.debug('🍞 Breadcrumb added:', breadcrumb);
    }
  }

  public startTransaction(_name: string, _op?: string): any {
    if (!this.initialized) return null;

    // 注意：在新版本的Sentry中，事务API可能有所不同
    // 这里返回any类型以避免类型错误
    console.warn('Transaction tracking may not be available in current Sentry version');
    return null;
  }

  public withScope<T>(callback: (scope: Sentry.Scope) => T): T | undefined {
    if (!this.initialized) {
      console.warn('Sentry not initialized, scope operation skipped');
      return undefined;
    }

    return Sentry.withScope(callback);
  }

  public isInitialized(): boolean {
    return this.initialized;
  }
}

// 创建全局实例
const modernErrorTracker = ModernErrorTracker.getInstance();

// 便捷的导出方法
export const captureError = modernErrorTracker.captureError.bind(modernErrorTracker);
export const captureMessage = modernErrorTracker.captureMessage.bind(modernErrorTracker);
export const captureCaughtError = modernErrorTracker.captureCaughtError.bind(modernErrorTracker);
export const setUser = modernErrorTracker.setUser.bind(modernErrorTracker);
export const clearUser = modernErrorTracker.clearUser.bind(modernErrorTracker);
export const addBreadcrumb = modernErrorTracker.addBreadcrumb.bind(modernErrorTracker);
export const startTransaction = modernErrorTracker.startTransaction.bind(modernErrorTracker);
export const withScope = modernErrorTracker.withScope.bind(modernErrorTracker);
export const isSentryInitialized = modernErrorTracker.isInitialized.bind(modernErrorTracker);

export default modernErrorTracker;
