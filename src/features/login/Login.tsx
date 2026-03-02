import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { apiClient } from '@/services/api/client';
import { authApi } from '@/services/modules/auth/authApi';

// import styles from './Login.module.scss';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    account: '',
    password: '',
    agreementAccepted: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.account || !form.password) {
      setError('请输入用户名和密码');
      return;
    }

    try {
      setLoading(true);
      // const result = await authApi.login(form);
      // debugger;
      // apiClient.setToken(result.accessToken);
      // apiClient.setRefreshToken(result.refreshToken);
      // TODO: 替换为真实接口
      await new Promise((resolve) => setTimeout(resolve, 800));

      localStorage.setItem('token', 'demo-token');

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>云平台管理系统</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="account"
            placeholder="用户名"
            value={form.account}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="password"
            type="password"
            placeholder="密码"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
  },
  card: {
    width: 360,
    padding: 40,
    borderRadius: 12,
    background: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  input: {
    height: 40,
    padding: '0 12px',
    borderRadius: 6,
    border: '1px solid #ddd',
    outline: 'none',
  },
  button: {
    height: 40,
    borderRadius: 6,
    border: 'none',
    background: '#1677ff',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
  },
  error: {
    color: '#ff4d4f',
    fontSize: 14,
  },
};
