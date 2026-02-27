import React, { useEffect } from 'react';
import { Card, PrimaryButton, SuccessButton, WarningButton, DangerButton } from '../components/lib';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  DollarCircleOutlined, 
  BarChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchDashboardStats, fetchChartData, fetchRecentActivities } from '../store/slices/dashboardSlice';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, chartData, activities, loading } = useAppSelector(state => state.dashboard);

  useEffect(() => {
    // 获取仪表板数据
    dispatch(fetchDashboardStats());
    dispatch(fetchChartData());
    dispatch(fetchRecentActivities());
  }, [dispatch]);

  // 统计数据展示
  const statsData = stats ? [
    {
      title: '总用户数',
      value: stats.users.total.toLocaleString(),
      change: `${stats.users.growth > 0 ? '+' : ''}${stats.users.growth.toFixed(1)}%`,
      trend: stats.users.growth > 0 ? 'up' : 'down',
      icon: <UserOutlined />,
      color: '#1890ff',
      today: `今日新增: ${stats.users.today}`
    },
    {
      title: '订单总数',
      value: stats.orders.total.toLocaleString(),
      change: `${stats.orders.growth > 0 ? '+' : ''}${stats.orders.growth.toFixed(1)}%`,
      trend: stats.orders.growth > 0 ? 'up' : 'down',
      icon: <ShoppingCartOutlined />,
      color: '#52c41a',
      today: `今日订单: ${stats.orders.today}`
    },
    {
      title: '总收入',
      value: `¥${stats.revenue.total.toLocaleString()}`,
      change: `${stats.revenue.growth > 0 ? '+' : ''}${stats.revenue.growth.toFixed(1)}%`,
      trend: stats.revenue.growth > 0 ? 'up' : 'down',
      icon: <DollarCircleOutlined />,
      color: '#faad14',
      today: `今日收入: ¥${stats.revenue.today.toLocaleString()}`
    },
    {
      title: '转化率',
      value: `${stats.conversion.rate}%`,
      change: `${stats.conversion.growth > 0 ? '+' : ''}${stats.conversion.growth.toFixed(1)}%`,
      trend: stats.conversion.growth > 0 ? 'up' : 'down',
      icon: <BarChartOutlined />,
      color: '#722ed1',
      today: `增长: ${stats.conversion.growth > 0 ? '+' : ''}${stats.conversion.growth.toFixed(1)}%`
    }
  ] : [];

  if (loading.stats) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div>数据加载中...</div>
        </div>
      </div>
    );
  }

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
                <div className="stat-today">{stat.today}</div>
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
              {loading.chart ? (
                <div className="chart-loading">图表加载中...</div>
              ) : chartData ? (
                <div className="chart-container">
                  <div className="chart-data">
                    <div className="chart-legend">
                      <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: '#1890ff' }}></span>
                        <span>销售额</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: '#52c41a' }}></span>
                        <span>访客数</span>
                      </div>
                    </div>
                    <div className="chart-bars">
                      {chartData.dates.map((date, index) => (
                        <div key={date} className="chart-bar-group">
                          <div className="bar-container">
                            <div 
                              className="bar sales-bar"
                              style={{ height: `${(chartData.sales[index] / Math.max(...chartData.sales)) * 100}%` }}
                            ></div>
                            <div 
                              className="bar visitor-bar"
                              style={{ height: `${(chartData.visitors[index] / Math.max(...chartData.visitors)) * 100}%` }}
                            ></div>
                          </div>
                          <div className="bar-label">{date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chart-placeholder">
                  <BarChartOutlined style={{ fontSize: 48, color: '#ccc' }} />
                  <p>暂无图表数据</p>
                </div>
              )}
            </Card>
          </div>

          {/* 最近活动 */}
          <div className="activity-section">
            <Card title="最近活动" className="activity-card">
              {loading.activities ? (
                <div className="activities-loading">活动加载中...</div>
              ) : (
                <div className="activity-list">
                  {activities.slice(0, 5).map(activity => (
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
              )}
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