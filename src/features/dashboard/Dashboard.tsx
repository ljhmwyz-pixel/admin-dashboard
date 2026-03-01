import React from 'react';
import { BulbOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Button, Card, Input, Space, Typography } from 'antd';

import { useTheme } from '../../shared/hooks/theme';
import { useThemeContext } from '../../shared/hooks/theme';
import { useLanguage } from '../../shared/hooks/useLanguage';

import './Dashboard.css';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { mode, isDark, toggleDarkMode, changeColorScheme, currentThemeConfig } = useTheme();
  const themeContext = useThemeContext();

  console.log('📊 Dashboard render:', { mode, isDark });

  return (
    <div className="dashboard">
      <Card title={t('sidebar.dashboard')} style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2}>主题测试面板</Title>

          {/* 当前主题状态 */}
          <Card size="small" title="当前主题状态">
            <Space>
              <Text>
                模式: <strong>{mode}</strong>
              </Text>
              <Text>
                是否暗色: <strong>{isDark ? '是' : '否'}</strong>
              </Text>
              <Text>
                主色调: <strong>{currentThemeConfig.token?.colorPrimary}</strong>
              </Text>
            </Space>
          </Card>

          {/* 主题控制按钮 */}
          <Card size="small" title="主题控制">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space wrap>
                <Button
                  icon={<BulbOutlined />}
                  onClick={() => {
                    console.log('🔘 toggleDarkMode clicked');
                    toggleDarkMode();
                  }}
                  type={isDark ? 'primary' : 'default'}
                >
                  切换暗色模式 (当前: {isDark ? '暗色' : '亮色'})
                </Button>

                <Button
                  icon={<SunOutlined />}
                  onClick={() => {
                    console.log('☀️ changeThemeMode light clicked');
                    themeContext.changeThemeMode('light');
                  }}
                >
                  强制亮色模式
                </Button>

                <Button
                  icon={<MoonOutlined />}
                  onClick={() => {
                    console.log('🌙 changeThemeMode dark clicked');
                    themeContext.changeThemeMode('dark');
                  }}
                >
                  强制暗色模式
                </Button>
              </Space>

              <Space>
                <Button onClick={() => changeColorScheme('blue')}>蓝色主题</Button>
                <Button onClick={() => changeColorScheme('green')}>绿色主题</Button>
                <Button type="primary" onClick={() => changeColorScheme('purple')}>
                  紫色主题
                </Button>
              </Space>
            </Space>
          </Card>

          {/* 组件样式测试 */}
          <Card size="small" title="组件样式测试">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <Button type="primary">主要按钮</Button>
                <Button>默认按钮</Button>
                <Button type="dashed">虚线按钮</Button>
                <Button type="link">链接按钮</Button>
              </Space>

              <Space>
                <Input placeholder="请输入内容" />
                <Input.Search placeholder="搜索" />
              </Space>

              <Text type="success">成功文本</Text>
              <Text type="warning">警告文本</Text>
              <Text type="danger">危险文本</Text>
              <Text type="secondary">次要文本</Text>
            </Space>
          </Card>

          {/* 自定义样式测试 */}
          <Card size="small" title="自定义样式测试">
            <div
              style={{
                padding: '20px',
                backgroundColor: 'var(--color-bg-container)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                color: 'var(--color-text)',
              }}
            >
              <Text>这是一个使用CSS变量的自定义容器</Text>
              <div style={{ marginTop: '10px' }}>
                <Text type="secondary">背景色: var(--color-bg-container)</Text>
                <br />
                <Text type="secondary">边框色: var(--color-border)</Text>
                <br />
                <Text type="secondary">文字色: var(--color-text)</Text>
              </div>
            </div>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard;
