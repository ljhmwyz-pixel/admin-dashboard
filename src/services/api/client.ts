import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

// API配置接口
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers?: Record<string, string>;
}

// 默认配置
const DEFAULT_CONFIG: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 创建Axios实例
class ApiClient {
  private instance: AxiosInstance;

  constructor(config: ApiConfig = DEFAULT_CONFIG) {
    this.instance = axios.create(config);
    this.setupInterceptors();
  }

  // 设置拦截器
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: any) => {
        // 添加认证token
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加时间戳防止缓存
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now(),
          };
        }

        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 统一处理响应数据
        return response.data;
      },
      (error: any) => {
        // 统一错误处理
        if (error.response) {
          const { status, data } = error.response;

          switch (status) {
            case 401:
              // 未授权，清除token并跳转登录
              this.clearToken();
              window.location.href = '/login';
              break;
            case 403:
              // 权限不足
              console.error('权限不足:', data.message);
              break;
            case 404:
              // 资源不存在
              console.error('请求资源不存在:', data.message);
              break;
            case 500:
              // 服务器错误
              console.error('服务器内部错误:', data.message);
              break;
            default:
              console.error('请求失败:', data.message);
          }
        } else if (error.request) {
          // 网络错误
          console.error('网络连接失败，请检查网络设置');
        } else {
          console.error('请求配置错误:', error.message);
        }

        return Promise.reject(error);
      },
    );
  }

  // 获取token
  private getToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  // 清除token
  private clearToken(): void {
    localStorage.removeItem('auth-token');
  }

  // 设置token
  public setToken(token: string): void {
    localStorage.setItem('auth-token', token);
  }

  // GET请求
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  // POST请求
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  // PUT请求
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }

  // DELETE请求
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }

  // PATCH请求
  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }

  // 获取原始axios实例（用于特殊情况）
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// 创建默认API客户端实例
export const apiClient = new ApiClient();

export default ApiClient;
