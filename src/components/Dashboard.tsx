import React from 'react';
import { Card, PrimaryButton, SuccessButton, WarningButton, DangerButton } from './lib';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  DollarCircleOutlined, 
  BarChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  // 模拟统计数据
  const statsData = [
    {
      title: '总用户数',
      value: '12,345',
      change: '+12.5%',
      trend: 'up',
      icon: <UserOutlined />,
      color: '#1890ff'
    },
    {
      title: '订单总数',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: <ShoppingCartOutlined />,
      color: '#52c41a'
    },
    {
      title: '总收入',
      value: '¥123,456',
      change: '-2.1%',
      trend: 'down',
      icon: <DollarCircleOutlined />,
      color: '#faad14'
    },
    {
      title: '转化率',
      value: '24.8%',
      change: '+3.7%',
      trend: 'up',
      icon: <BarChartOutlined />,
      color: '#722ed1'
    }
  ];

  // 模拟最近活动数据
  const recentActivities = [
    { id: 1, user: '张三', action: '创建了新订单', time: '2分钟前' },
    { id: 2, user: '李四', action: '更新了用户资料', time: '5分钟前' },
    { id: 3, user: '王五', action: '支付了订单', time: '10分钟前' },
    { id: 4, user: '赵六', action: '登录系统', time: '15分钟前' },
    { id: 5, user: '钱七', action: '下载了报表', time: '20分钟前' }
  ];

  return (
    <div className="dashboard">
      {/* 统计卡片区域 */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <Card 
            key={index}
            className="stat-card"
            theme="shadow"
            hoverable
          >
            <div className="stat-content">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <h3 className="stat-title">{stat.title}</h3>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.trend}`}>
                  {stat.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {stat.change}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="dashboard-content">
        <div className="content-row">
          {/* 图表区域 */}
          <div className="chart-section">
            <Card title="销售趋势" className="chart-card">
              <div className="chart-placeholder">
                <BarChartOutlined style={{ fontSize: 48, color: '#ccc' }} />
                <p>图表区域 - 可集成 ECharts 或 Recharts</p>
              </div>
            </Card>
          </div>

          {/* 最近活动 */}
          <div className="activity-section">
            <Card title="最近活动" className="activity-card">
              <div className="activity-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-avatar">
                      <UserOutlined />
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>{activity.user}</strong> {activity.action}
                      </div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* 快捷操作区域 */}
        <div className="quick-actions">
          <Card title="快捷操作" className="actions-card">
            <div className="actions-grid">
              <PrimaryButton block size="large">
                <UserOutlined /> 添加用户
              </PrimaryButton>
              <SuccessButton block size="large">
                <ShoppingCartOutlined /> 创建订单
              </SuccessButton>
              <WarningButton block size="large">
                <DollarCircleOutlined /> 查看报表
              </WarningButton>
              <DangerButton block size="large">
                <BarChartOutlined /> 系统设置
              </DangerButton>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;