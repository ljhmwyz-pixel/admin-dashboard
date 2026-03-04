// 浏览器友好的日志系统
import config from '../../config/ModernConfigManager';

// 简单的浏览器日志实现
const createBrowserLogger = () => {
  const logLevel = config.get('logging.logLevel', 'info');

  const shouldLog = (level: string): boolean => {
    const levels: Record<string, number> = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      verbose: 4,
    };

    return levels[level] <= levels[logLevel];
  };

  const formatMessage = (level: string, message: string, meta?: any): string => {
    const timestamp = new Date().toISOString();
    let formatted = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    if (meta) {
      formatted += ` ${JSON.stringify(meta)}`;
    }

    return formatted;
  };

  return {
    error: (message: string, meta?: any) => {
      if (shouldLog('error')) {
        console.error(formatMessage('error', message, meta));
      }
    },
    warn: (message: string, meta?: any) => {
      if (shouldLog('warn')) {
        console.warn(formatMessage('warn', message, meta));
      }
    },
    info: (message: string, meta?: any) => {
      if (shouldLog('info')) {
        console.info(formatMessage('info', message, meta));
      }
    },
    debug: (message: string, meta?: any) => {
      if (shouldLog('debug')) {
        console.debug(formatMessage('debug', message, meta));
      }
    },
    verbose: (message: string, meta?: any) => {
      if (shouldLog('verbose')) {
        console.log(formatMessage('verbose', message, meta));
      }
    },
  };
};

// 创建浏览器日志实例
const logger = createBrowserLogger();

export default logger;

// 便捷的日志方法
export const log = {
  error: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),
  verbose: (message: string, meta?: any) => logger.verbose(message, meta),
};

// 性能日志专用方法
export const performanceLog = {
  start: (operation: string) => {
    const startTime = performance.now();
    return {
      end: (meta?: any) => {
        const duration = performance.now() - startTime;
        logger.info(`Operation ${operation} completed`, {
          duration: `${duration.toFixed(2)}ms`,
          ...meta,
        });
      },
    };
  },
};
