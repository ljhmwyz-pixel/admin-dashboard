import { createRoot } from 'react-dom/client';

import { i18n } from '@/i18n';
import { setDayjsLocale } from '@/shared/utils/FormatTime';

import './index.module.scss';
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = {
    env: {
      NODE_ENV: import.meta.env.MODE || 'development',
    },
  };
}

setDayjsLocale(i18n.language);

// 添加全局错误监听器来捕获slice相关错误
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('slice')) {
    console.error('🚨 Slice Error Detected:', {
      message: event.error.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error.stack,
    });
  }
});

import App from './App';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
