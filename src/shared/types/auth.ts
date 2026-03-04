// 认证相关类型定义

export interface LoginCredentials {
  account: string;
  password: string;
  agreementAccepted?: boolean;
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

export interface PersonalIdentity {
  type: 'PERSONAL';
  displayName: string;
}

export type OrganizationType = 'INSTALLER' | 'DEALER' | 'GUEST' | 'BD';

export interface OrganizationIdentity {
  type: 'ORGANIZATION';
  orgId: string;
  orgName: string;
  orgType: OrganizationType;
  roles: string[];
}
export type Identity = PersonalIdentity | OrganizationIdentity;
export type SelectedIdentity =
  | {
      type: 'PERSONAL';
    }
  | {
      type: 'ORGANIZATION';
      orgId: string;
    };
export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  tokenType: 'Bearer';
  expiresIn: number;
  uid: string;
  userName: string;
  identities: Identity[];
  lastSelectedIdentity?: SelectedIdentity;
  requireIdentitySelection: boolean;
  // 兼容旧的字段名
  token?: string;
  user?: UserInfo;
  permissions?: string[];
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
