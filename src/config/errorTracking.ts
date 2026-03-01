// 错误追踪增强配置
import * as Sentry from '@sentry/react';

import config from './ModernConfigManager';

// 错误追踪增强配置
export const enhanceSentryConfig = () => {
  const sentryConfig = config.getThirdPartyConfig('sentry');

  if (!sentryConfig.enable || !sentryConfig.dsn) {
    console.info('❌ Sentry not enabled or configured');
    return false;
  }

  try {
    // 增强现有的Sentry配置
    Sentry.init({
      dsn: sentryConfig.dsn,
      environment: config.getEnv(),
      release: import.meta.env.VITE_APP_VERSION || 'dev',
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

      // 错误过滤
      ignoreErrors: ['ResizeObserver loop', 'Script error', 'Network Error', 'Failed to fetch'],

      // 增强的错误处理
      beforeSend: (event, hint) => {
        // 添加应用上下文
        event.contexts = {
          ...event.contexts,
          app: {
            version: import.meta.env.VITE_APP_VERSION || 'unknown',
            environment: config.getEnv(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString(),
          },
        };

        // 过滤开发环境噪音
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

    console.info('✅ Sentry enhanced configuration applied');
    return true;
  } catch (error) {
    console.error('❌ Failed to enhance Sentry config:', error);
    return false;
  }
};

// 错误追踪工具类
export class EnhancedErrorTracker {
  static captureError(error: Error | string, context?: Record<string, any>) {
    if (typeof error === 'string') {
      Sentry.captureMessage(error, {
        level: 'error',
        contexts: context ? { custom: context } : undefined,
      });
    } else {
      Sentry.captureException(error, {
        contexts: context ? { custom: context } : undefined,
      });
    }
  }

  static captureInfo(message: string, context?: Record<string, any>) {
    Sentry.captureMessage(message, {
      level: 'info',
      contexts: context ? { custom: context } : undefined,
    });
  }

  static setUser(userInfo: { id: string; email?: string; username?: string }) {
    Sentry.setUser({
      id: userInfo.id,
      email: userInfo.email,
      username: userInfo.username,
    });
  }

  static clearUser() {
    Sentry.setUser(null);
  }

  static addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
    Sentry.addBreadcrumb(breadcrumb);
  }

  static isInitialized(): boolean {
    try {
      return typeof Sentry !== 'undefined';
    } catch {
      return false;
    }
  }
}

export default EnhancedErrorTracker;
