import type {
  AuthResponse,
  ChangePasswordData,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  VerificationCodeRequest,
} from '../../../shared/types/auth';
import { apiClient } from '../../api/client';

class AuthApi {
  // 登录
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response;
  }

  // 注册
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response;
  }

  // 刷新令牌
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    return response;
  }

  // 登出
  async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/auth/logout', { refreshToken });
  }

  // 获取用户信息
  async getUserInfo(): Promise<{ user: any; permissions: string[] }> {
    const response = await apiClient.get('/auth/user-info');
    return response;
  }

  // 修改密码
  async changePassword(data: ChangePasswordData): Promise<void> {
    await apiClient.put('/auth/change-password', data);
  }

  // 重置密码
  async resetPassword(data: ResetPasswordData): Promise<void> {
    await apiClient.post('/auth/reset-password', data);
  }

  // 发送验证码
  async sendVerificationCode(data: VerificationCodeRequest): Promise<void> {
    await apiClient.post('/auth/send-code', data);
  }

  // 验证验证码
  async verifyCode(email: string, code: string): Promise<boolean> {
    const response = await apiClient.post('/auth/verify-code', { email, code });
    return response.valid;
  }

  // 检查用户名是否可用
  async checkUsername(username: string): Promise<boolean> {
    const response = await apiClient.get(`/auth/check-username/${username}`);
    return response.available;
  }

  // 检查邮箱是否可用
  async checkEmail(email: string): Promise<boolean> {
    const response = await apiClient.get(`/auth/check-email/${email}`);
    return response.available;
  }
}

export const authApi = new AuthApi();
