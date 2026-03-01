// 认证相关类型定义

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  captcha?: string;
}

export interface UserInfo {
  id: string | number;
  username: string;
  email: string;
  avatar?: string;
  nickname?: string;
  phone?: string;
  roles: string[];
  permissions: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: UserInfo;
  permissions: string[];
  expiresIn?: number;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordData {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface VerificationCodeRequest {
  email: string;
  type: 'register' | 'reset_password' | 'change_phone';
}
