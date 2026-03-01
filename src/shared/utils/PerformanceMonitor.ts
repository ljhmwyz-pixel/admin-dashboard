// 性能监控工具
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: MutationObserver[] = [];

  private constructor() {
    this.initPerformanceMonitoring();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // 初始化性能监控
  private initPerformanceMonitoring(): void {
    // 监控页面加载性能
    this.monitorPageLoad();

    // 监控资源加载
    this.monitorResourceLoading();

    // 监控用户交互延迟
    this.monitorInteractionDelay();
  }

  // 监控页面加载性能
  private monitorPageLoad(): void {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType(
          'navigation',
        )[0] as PerformanceNavigationTiming;
        if (perfData) {
          this.recordMetric('page_load_time', perfData.loadEventEnd - perfData.fetchStart);
          this.recordMetric(
            'dom_content_loaded',
            perfData.domContentLoadedEventEnd - perfData.fetchStart,
          );
          this.recordMetric('first_paint', perfData.responseStart - perfData.fetchStart);
        }
      });
    }
  }

  // 监控资源加载
  private monitorResourceLoading(): void {
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.recordMetric(
              `resource_${resourceEntry.initiatorType}_load`,
              resourceEntry.duration,
            );
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  // 监控用户交互延迟
  private monitorInteractionDelay(): void {
    let lastInteractionTime = Date.now();

    const interactionHandler = () => {
      const currentTime = Date.now();
      const delay = currentTime - lastInteractionTime;
      this.recordMetric('interaction_delay', delay);
      lastInteractionTime = currentTime;
    };

    ['click', 'keydown', 'touchstart'].forEach((event) => {
      document.addEventListener(event, interactionHandler, { passive: true });
    });
  }

  // 记录指标
  public recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)?.push(value);

    // 限制存储的数据量
    const values = this.metrics.get(name)!;
    if (values.length > 1000) {
      values.shift();
    }
  }

  // 获取平均值
  public getAverage(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;

    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  // 获取统计数据
  public getStats(name: string): { average: number; min: number; max: number; count: number } {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) {
      return { average: 0, min: 0, max: 0, count: 0 };
    }

    return {
      average: this.getAverage(name),
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
    };
  }

  // 获取所有指标
  public getAllMetrics(): Record<string, number[]> {
    const result: Record<string, number[]> = {};
    this.metrics.forEach((values, key) => {
      result[key] = [...values];
    });
    return result;
  }

  // 清除数据
  public clearMetrics(): void {
    this.metrics.clear();
  }

  // 销毁监控器
  public destroy(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

export default PerformanceMonitor.getInstance();
