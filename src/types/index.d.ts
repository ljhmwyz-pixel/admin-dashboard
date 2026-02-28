// CSS Modules 类型声明
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// 环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;

  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 主题相关类型
type ThemeMode = 'light' | 'dark' | 'auto';
type ColorScheme = 'blue' | 'green' | 'purple' | 'red';

interface ThemeSettings {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  borderRadius: number;
  fontSize: 'small' | 'medium' | 'large';
}