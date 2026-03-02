// 安全工具类
class SecurityUtils {
  private static readonly TOKEN_KEY = 'accessToken';
  private static readonly USER_INFO_KEY = 'user_info';
  private static readonly PERMISSIONS_KEY = 'user_permissions';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  // Token 管理
  public static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    // 同时设置到 sessionStorage 作为备份
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  public static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  public static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  // Refresh Token 管理
  public static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  public static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  public static removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // 用户信息管理
  public static setUserInfo(userInfo: any): void {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
  }

  public static getUserInfo(): any {
    const userInfoStr = localStorage.getItem(this.USER_INFO_KEY);
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  }

  public static removeUserInfo(): void {
    localStorage.removeItem(this.USER_INFO_KEY);
  }

  // 权限管理
  public static setPermissions(permissions: string[]): void {
    localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(permissions));
  }

  public static getPermissions(): string[] {
    const permissionsStr = localStorage.getItem(this.PERMISSIONS_KEY);
    return permissionsStr ? JSON.parse(permissionsStr) : [];
  }

  public static removePermissions(): void {
    localStorage.removeItem(this.PERMISSIONS_KEY);
  }

  // 检查权限
  public static hasPermission(permission: string): boolean {
    const permissions = this.getPermissions();
    return permissions.includes(permission);
  }

  public static hasAnyPermission(permissions: string[]): boolean {
    const userPermissions = this.getPermissions();
    return permissions.some((permission) => userPermissions.includes(permission));
  }

  public static hasAllPermissions(permissions: string[]): boolean {
    const userPermissions = this.getPermissions();
    return permissions.every((permission) => userPermissions.includes(permission));
  }

  // 角色检查
  public static hasRole(role: string): boolean {
    const userInfo = this.getUserInfo();
    return userInfo?.roles?.includes(role) || false;
  }

  public static hasAnyRole(roles: string[]): boolean {
    const userInfo = this.getUserInfo();
    return roles.some((role) => userInfo?.roles?.includes(role));
  }

  // 清除所有认证信息
  public static clearAuth(): void {
    this.removeToken();
    this.removeRefreshToken();
    this.removeUserInfo();
    this.removePermissions();
  }

  // 检查是否已认证
  public static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Token 过期检查
  public static isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      if (!exp) return true;

      // 提前5分钟判断为过期
      return Date.now() >= exp * 1000 - 5 * 60 * 1000;
    } catch {
      return true;
    }
  }

  // CSRF 保护
  public static generateCSRFToken(): string {
    return btoa(Math.random().toString()).substring(0, 32);
  }

  public static setCSRFToken(token: string): void {
    document.cookie = `csrf_token=${token}; path=/; SameSite=Strict`;
  }

  public static getCSRFToken(): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrf_token') {
        return value;
      }
    }
    return null;
  }

  // 数据加密/解密（简单示例）
  public static encryptData(data: string, key: string): string {
    // 在生产环境中应该使用专业的加密库
    try {
      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(data || '');
      const paddedKey = (key || '').padEnd(32, '0');
      const encodedKey = encoder.encode(paddedKey);
      const keyBytes = encodedKey.length > 0 ? encodedKey.slice(0, 32) : new Uint8Array(32);

      // 简单的 XOR 加密（仅作示例，生产环境请使用 AES 等标准算法）
      const encrypted = new Uint8Array(dataBytes.length);
      for (let i = 0; i < dataBytes.length; i++) {
        encrypted[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
      }

      return btoa(String.fromCharCode(...encrypted));
    } catch {
      return data; // 加密失败时返回原数据
    }
  }

  public static decryptData(encryptedData: string, key: string): string {
    try {
      const encryptedBytes = new Uint8Array(
        atob(encryptedData || '')
          .split('')
          .map((char) => char.charCodeAt(0)),
      );
      const paddedKey = (key || '').padEnd(32, '0');
      const encodedKey = new TextEncoder().encode(paddedKey);
      const keyBytes = encodedKey.length > 0 ? encodedKey.slice(0, 32) : new Uint8Array(32);

      const decrypted = new Uint8Array(encryptedBytes.length);
      for (let i = 0; i < encryptedBytes.length; i++) {
        decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
      }

      return new TextDecoder().decode(decrypted);
    } catch {
      return encryptedData; // 解密失败时返回原数据
    }
  }

  // 输入验证和清理
  public static sanitizeInput(input: string): string {
    // 移除潜在的恶意字符
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  // XSS 防护
  public static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };

    return text.replace(/[&<>"'/]/g, (char) => map[char]);
  }
}

export default SecurityUtils;
