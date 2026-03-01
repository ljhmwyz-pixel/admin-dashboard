// 错误追踪和上报系统
class ErrorTracker {
  private static instance: ErrorTracker;
  private errorBuffer: Array<{
    error: Error;
    info?: string;
    timestamp: number;
    url: string;
    userAgent: string;
  }> = [];
  private isOnline: boolean = navigator.onLine;

  private constructor() {
    this.initErrorTracking();
    this.setupNetworkMonitoring();
  }

  public static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  // 初始化错误追踪
  private initErrorTracking(): void {
    // 全局 JavaScript 错误
    window.addEventListener('error', (event) => {
      this.captureError(event.error, 'Global JavaScript Error');
    });

    // Promise 拒绝错误
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(event.reason), 'Unhandled Promise Rejection');
    });
  }

  // 设置网络监控
  private setupNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorBuffer();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // 捕获错误
  public captureError(error: Error, info?: string): void {
    const errorInfo = {
      error,
      info,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // 存储到缓冲区
    this.errorBuffer.push(errorInfo);

    // 限制缓冲区大小
    if (this.errorBuffer.length > 50) {
      this.errorBuffer.shift();
    }

    // 如果在线则立即上报
    if (this.isOnline) {
      this.reportError(errorInfo);
    }

    // 开发环境下打印错误
    if (import.meta.env.DEV) {
      console.error('Error captured:', errorInfo);
    }
  }

  // 上报单个错误
  private reportError(errorInfo: any): void {
    const payload = {
      error: {
        name: errorInfo.error.name,
        message: errorInfo.error.message,
        stack: errorInfo.error.stack,
      },
      info: errorInfo.info,
      timestamp: errorInfo.timestamp,
      url: errorInfo.url,
      userAgent: errorInfo.userAgent,
      environment: import.meta.env.MODE,
    };

    // 模拟上报（实际项目中替换为真实API调用）
    console.log('Reporting error:', payload);
  }

  // 批量上报错误
  private flushErrorBuffer(): void {
    while (this.errorBuffer.length > 0 && this.isOnline) {
      const errorInfo = this.errorBuffer.shift();
      if (errorInfo) {
        this.reportError(errorInfo);
      }
    }
  }

  // 手动捕获错误（用于 try-catch 块）
  public captureCaughtError(error: unknown, context?: string): void {
    if (error instanceof Error) {
      this.captureError(error, context);
    } else {
      this.captureError(new Error(String(error)), context);
    }
  }

  // 获取错误统计
  public getErrorStats(): {
    totalErrors: number;
    recentErrors: number;
    errorTypes: Record<string, number>;
  } {
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    const recentErrors = this.errorBuffer.filter((error) => error.timestamp > oneHourAgo).length;

    const errorTypes: Record<string, number> = {};
    this.errorBuffer.forEach((error) => {
      const typeName = error.error.name || 'UnknownError';
      errorTypes[typeName] = (errorTypes[typeName] || 0) + 1;
    });

    return {
      totalErrors: this.errorBuffer.length,
      recentErrors,
      errorTypes,
    };
  }

  // 清除错误缓冲区
  public clearBuffer(): void {
    this.errorBuffer = [];
  }

  // 销毁错误追踪器
  public destroy(): void {
    this.errorBuffer = [];
  }
}

export default ErrorTracker.getInstance();
