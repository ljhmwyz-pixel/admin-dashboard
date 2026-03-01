import { useEffect, useRef } from 'react';

import ErrorTracker from '../utils/ErrorTracker';
import PerformanceMonitor from '../utils/PerformanceMonitor';

// 性能监控 Hook
export const usePerformanceMonitoring = (componentName: string) => {
  const mountTimeRef = useRef<number>(0);

  useEffect(() => {
    mountTimeRef.current = performance.now();

    // 记录组件挂载时间
    return () => {
      const unmountTime = performance.now();
      const mountDuration = unmountTime - mountTimeRef.current;
      PerformanceMonitor.recordMetric(`${componentName}_mount_duration`, mountDuration);
    };
  }, [componentName]);

  // 返回监控方法
  return {
    recordMetric: (name: string, value: number) => {
      PerformanceMonitor.recordMetric(`${componentName}_${name}`, value);
    },
    captureError: (error: unknown, context?: string) => {
      ErrorTracker.captureCaughtError(error, `${componentName}: ${context}`);
    },
  };
};

// API调用监控 Hook
export const useApiMonitoring = () => {
  const startApiCall = (apiName: string) => {
    const startTime = performance.now();

    return {
      finish: (success: boolean = true) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        PerformanceMonitor.recordMetric(
          `api_${apiName}_${success ? 'success' : 'failure'}`,
          duration,
        );
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
        PerformanceMonitor.recordMetric(`interaction_${actionName}`, endTime - startTime);
      } catch (error) {
        ErrorTracker.captureCaughtError(error, `Interaction: ${actionName}`);
        throw error;
      }
    };
  };

  return { handleClick };
};
