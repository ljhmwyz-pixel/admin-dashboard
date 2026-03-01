import React from 'react';
import type { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';

import { addBreadcrumb, captureError } from '../utils/ModernErrorTracker';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, componentStack: string) => void;
}

// 默认错误降级组件
const DefaultFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  // 确保error是Error类型
  const errorObj = error instanceof Error ? error : new Error(String(error));

  return (
    <div
      style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#fff5f5',
        border: '1px solid #fed7d7',
        borderRadius: '0.5rem',
        margin: '1rem',
      }}
    >
      <h2 style={{ color: '#c53030', marginBottom: '1rem' }}>😅 页面出现了一些问题</h2>
      <p style={{ color: '#822727', marginBottom: '1rem' }}>
        我们已经记录了这个问题，正在努力修复中。
      </p>
      <div>
        <button
          onClick={resetErrorBoundary}
          style={{
            backgroundColor: '#c53030',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '1rem',
            marginRight: '1rem',
          }}
        >
          🔄 重试
        </button>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#4a5568',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          🔄 刷新页面
        </button>
      </div>

      {/* 开发环境下显示详细错误信息 */}
      {process.env.NODE_ENV === 'development' && (
        <details style={{ marginTop: '1rem', textAlign: 'left' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            🔍 错误详情 (开发环境)
          </summary>
          <pre
            style={{
              backgroundColor: '#2d3748',
              color: '#e2e8f0',
              padding: '1rem',
              borderRadius: '0.25rem',
              marginTop: '0.5rem',
              overflow: 'auto',
              fontSize: '0.875rem',
              maxHeight: '200px',
            }}
          >
            <code>{errorObj.toString()}</code>
            <br />
            <br />
            <strong>Error Stack:</strong>
            <br />
            <code>{errorObj.stack || 'No stack trace available'}</code>
          </pre>
        </details>
      )}
    </div>
  );
};

/**
 * 基于 react-error-boundary 的全局错误边界组件
 * 集成 Sentry 错误追踪和现代化的错误处理
 */
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, fallback, onError }) => {
  // 错误处理回调
  const handleError = (error: unknown, info: React.ErrorInfo) => {
    const componentStack = info.componentStack || '';
    const errorObj = error instanceof Error ? error : new Error(String(error));
    // 记录错误到 Sentry
    captureError(errorObj, {
      componentStack: info.componentStack,
      errorBoundary: true,
      timestamp: new Date().toISOString(),
    });

    // 添加面包屑记录
    addBreadcrumb({
      category: 'error',
      message: 'React Error Boundary triggered',
      level: 'error',
      data: {
        componentName: errorObj.name,
        errorMessage: errorObj.message,
        timestamp: new Date().toISOString(),
      },
    });

    // 调用自定义错误处理函数
    if (onError) {
      onError(errorObj, componentStack);
    }

    // 开发环境下输出错误信息
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 React Error Boundary');
      console.error('Error:', errorObj);
      console.error('Component Stack:', info.componentStack);
      console.groupEnd();
    }
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : DefaultFallback}
      onError={handleError}
      onReset={() => {
        // 重置状态时的回调
        console.info('🔄 Error boundary reset');
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
