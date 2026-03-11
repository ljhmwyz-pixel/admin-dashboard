import SecurityUtils from '@shared/utils/SecurityUtils';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

import useAppModal from '@/components/Modal';
import { authApi } from '@/services/modules/auth/authApi';

// API配置接口
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers?: Record<string, string>;
}

// 默认配置
const DEFAULT_CONFIG: ApiConfig = {
  baseURL: '',
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 创建 Axios 实例
class ApiClient {
  private instance: AxiosInstance;
  // 是否正在刷新 token 的标志
  private isRefreshing = false;
  // 重试队列，存储 token 过期时的请求
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(config: ApiConfig = DEFAULT_CONFIG) {
    this.instance = axios.create(config);
    this.setupInterceptors();
  }

  // 设置拦截器
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: any) => {
        // 添加认证 token
        const accessToken = this.getToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // 添加时间戳防止缓存
        // if (config.method === 'get') {
        //  config.params = {
        //     ...config.params,
        //     _t: Date.now(),
        //   };
        // }

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
        const res = response.data;
        const { error: ModalError } = useAppModal();
        // 统一业务错误处理
        if (res.code && res.code !== 200) {
          ModalError({
            content: res.message || res.msg,
          });
          return Promise.reject(res);
        }
        return res;
      },
      async (error: any) => {
        const { error: ModalError } = useAppModal();

        // 统一错误处理
        if (error.response) {
          const { status, data } = error.response;
          switch (status) {
            case 401:
              // Token 过期或无效，尝试刷新 token
              try {
                const newToken = await this.handleTokenRefresh();

                // 刷新成功后重试原请求
                const originalRequest = error.config;
                if (originalRequest && !originalRequest._retry) {
                  originalRequest._retry = true;

                  // 使用新的 token 重试请求
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                  return this.instance(originalRequest);
                }
              } catch (refreshError) {
                // 刷新失败，清除 token 并跳转登录
                this.clearToken();
                window.location.href = '/login';
                return Promise.reject(refreshError);
              }
              break;

            case 403:
              // 权限不足
              ModalError({
                content: data.msg || '权限不足',
              });
              break;
            case 404:
              // 资源不存在
              ModalError({
                content: data.msg || '资源不存在',
              });
              break;
            case 500:
              // 服务器错误
              ModalError({
                content: data.msg || '服务器错误',
              });
              break;
            default:
              ModalError({
                content: data.msg,
              });
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

  // 处理 token 刷新
  private async handleTokenRefresh(): Promise<string> {
    // 如果已经在刷新中，返回 Promise 等待完成
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshSubscribers.push((token: string) => {
          resolve(token);
        });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshTokenValue = SecurityUtils.getRefreshToken();

      if (!refreshTokenValue) {
        throw new Error('无刷新令牌');
      }

      // 调用刷新 token 的 API
      const res: any = await authApi.refreshToken(refreshTokenValue);
      const { data: response } = res;

      // 更新 token
      let newToken = '';
      if (response.token || response.accessToken) {
        newToken = response.token || response.accessToken;
        SecurityUtils.setToken(newToken);
      }

      // 更新 refreshToken
      if (response.refreshToken) {
        SecurityUtils.setRefreshToken(response.refreshToken);
      }

      // 通知所有等待的请求
      this.refreshSubscribers.forEach((callback) => callback(newToken));
      this.refreshSubscribers = [];

      return newToken;
    } catch (error) {
      // 刷新失败，清除认证信息
      SecurityUtils.clearAuth();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // 获取 token
  private getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // 清除 token
  private clearToken(): void {
    localStorage.removeItem('accessToken');
  }

  // 设置 token
  public setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  // 设置刷新 token
  public setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  // GET 请求
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  // POST 请求
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  // PUT 请求
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }

  // DELETE 请求
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }

  // PATCH 请求
  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }

  // 获取原始 axios 实例（用于特殊情况）
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// 创建默认 API 客户端实例
export const apiClient = new ApiClient();

export default ApiClient;
