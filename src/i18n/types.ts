export type LanguageKey = 'zh-CN' | 'en-US' | 'de-DE' | 'it-IT' | 'ja-JP';

export interface LanguageConfig {
  key: LanguageKey;
  name: string;
  flag: string;
}

export interface LanguageState {
  currentLanguage: LanguageKey;
  supportedLanguages: LanguageConfig[];
  isLoading: boolean;
  error: string | null;
}

export interface UseLanguageReturn {
  currentLanguage: LanguageKey;
  supportedLanguages: LanguageConfig[];
  isLoading: boolean;
  error: string | null;
  changeLanguage: (lng: LanguageKey) => Promise<void>;
  t: (key: string, options?: Record<string, any>) => string;
}