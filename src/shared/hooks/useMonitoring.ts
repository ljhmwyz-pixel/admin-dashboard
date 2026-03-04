import { useEffect, useRef } from 'react';

import { captureCaughtError, captureError } from '../utils/ModernErrorTracker';
import logger, { performanceLog } from '../utils/ModernLogger';

// 性能监控 Hook
export const usePerformanceMonitoring = (componentName: string) => {
  const mountTimeRef = useRef<number>(0);

  useEffect(() => {
    mountTimeRef.current = performance.now();

    // 记录组件挂载时间
    return () => {
      const unmountTime = performance.now();
      const mountDuration = unmountTime - mountTimeRef.current;

      const perfOp = performanceLog.start(`${componentName}_mount`);
      perfOp.end({ duration: mountDuration });

      logger.info(`Component ${componentName} unmounted`, {
        mountDuration: `${mountDuration.toFixed(2)}ms`,
      });
    };
  }, [componentName]);

  // 返回监控方法
  return {
    recordMetric: (name: string, value: number) => {
      const perfOp = performanceLog.start(`${componentName}_${name}`);
      perfOp.end({ value });

      logger.debug(`Metric recorded for ${componentName}`, {
        metric: name,
        value,
      });
    },
    captureError: (error: unknown, context?: string) => {
      captureCaughtError(error, context);
      logger.error(`Error in ${componentName}`, {
        error: error instanceof Error ? error.message : String(error),
        context,
      });
    },
  };
};

// API调用监控 Hook
export const useApiMonitoring = () => {
  const startApiCall = (apiName: string) => {
    const startTime = performance.now();
    const perfOp = performanceLog.start(`api_${apiName}`);

    return {
      finish: (success: boolean = true, error?: any) => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        perfOp.end({
          success,
          duration: `${duration.toFixed(2)}ms`,
          error: error?.message,
        });

        if (success) {
          logger.info(`API call successful: ${apiName}`, {
            duration: `${duration.toFixed(2)}ms`,
          });
        } else {
          logger.error(`API call failed: ${apiName}`, {
            duration: `${duration.toFixed(2)}ms`,
            error: error?.message,
          });
          if (error) {
            captureError(error, { api: apiName });
          }
        }
      },
    };
  };

  return { startApiCall };
};

// 用户交互监控 Hook
export const useInteractionMonitoring = () => {
  const handleClick = (handler: () => void, actionName: string) => {
    return () => {
      const startTime = performance.now();
      try {
        handler();
        const endTime = performance.now();
        const duration = endTime - startTime;

        const perfOp = performanceLog.start(`interaction_${actionName}`);
        perfOp.end({ duration: `${duration.toFixed(2)}ms` });

        logger.info(`User interaction: ${actionName}`, {
          duration: `${duration.toFixed(2)}ms`,
        });
      } catch (error) {
        captureCaughtError(error, `Interaction: ${actionName}`);
        logger.error(`Interaction failed: ${actionName}`, {
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    };
  };

  return { handleClick };
};
