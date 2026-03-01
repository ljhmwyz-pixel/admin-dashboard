import React, { useEffect, useMemo, useState } from 'react';
import { PlayCircleOutlined, ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Progress, Select, Space, Spin, Tabs, Typography } from 'antd';

import OrganizationTree from '../../components/organisms/OrganizationTree/OrganizationTree';
import {
  generatePerformanceTestData,
  getPerformanceStats,
  type OrganizationNode,
} from './mocks/organizationData';

const { Title, Text } = Typography;
const { Option } = Select;

const PerformanceTest: React.FC = () => {
  const [testScale, setTestScale] = useState<'small' | 'medium' | 'large' | 'huge'>('medium');
  const [testData, setTestData] = useState<OrganizationNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('tree');

  // 生成测试数据
  const generateTestData = async () => {
    setLoading(true);
    setRenderTime(null);

    // 记录开始时间
    const startTime = performance.now();

    try {
      // 模拟数据生成延迟，让用户看到加载状态
      await new Promise((resolve) => setTimeout(resolve, 100));

      const data = generatePerformanceTestData(testScale);
      setTestData(data);

      // 计算统计数据
      const stats = getPerformanceStats(data);
      setPerformanceMetrics(stats);

      // 记录渲染时间
      const endTime = performance.now();
      setRenderTime(endTime - startTime);
    } catch (error) {
      console.error('数据生成失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时生成默认数据
  useEffect(() => {
    generateTestData();
  }, []);

  // 计算性能指标
  const performanceIndicators = useMemo(() => {
    if (!performanceMetrics) return null;

    const { totalNodes, maxDepth, avgChildrenPerNode, leafNodes } = performanceMetrics;

    return {
      nodeCount: totalNodes,
      depth: maxDepth,
      avgChildren: avgChildrenPerNode.toFixed(2),
      leafRatio: ((leafNodes / totalNodes) * 100).toFixed(1),
      memoryEstimate: ((totalNodes * 200) / 1024).toFixed(2), // 估算内存占用(KB)
    };
  }, [performanceMetrics]);

  // 渲染性能统计卡片
  const renderStatsCards = () => {
    if (!performanceIndicators) return null;

    const cards = [
      { title: '总节点数', value: performanceIndicators.nodeCount.toLocaleString(), unit: '个' },
      { title: '最大深度', value: performanceIndicators.depth, unit: '层' },
      { title: '平均子节点', value: performanceIndicators.avgChildren, unit: '个' },
      { title: '叶子节点比例', value: performanceIndicators.leafRatio, unit: '%' },
      { title: '估算内存', value: performanceIndicators.memoryEstimate, unit: 'KB' },
      { title: '渲染耗时', value: renderTime?.toFixed(2) || '0', unit: 'ms' },
    ];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {cards.map((card, index) => (
          <Card key={index} size="small">
            <div style={{ textAlign: 'center' }}>
              <Text strong style={{ fontSize: '18px', display: 'block' }}>
                {card.value}
              </Text>
              <Text type="secondary">
                {card.title} ({card.unit})
              </Text>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const tabItems = [
    {
      key: 'tree',
      label: '组织树视图',
      children: (
        <div style={{ height: '600px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Spin size="large" tip="正在生成测试数据..." />
            </div>
          ) : (
            <OrganizationTree
              treeData={testData}
              showSearch={true}
              className="performance-test-tree"
            />
          )}
        </div>
      ),
    },
    {
      key: 'metrics',
      label: '性能指标',
      children: (
        <div>
          {performanceIndicators && (
            <div>
              <Title level={4}>详细统计信息</Title>
              {renderStatsCards()}

              <Card title="性能分析" style={{ marginTop: '24px' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Alert
                    message="性能评估"
                    description={`当前测试使用 ${testScale} 规模数据 (${performanceIndicators.nodeCount} 个节点)，渲染耗时 ${renderTime?.toFixed(2)}ms`}
                    type={renderTime && renderTime < 1000 ? 'success' : 'warning'}
                    showIcon
                  />

                  <div>
                    <Text strong>性能等级：</Text>
                    <Progress
                      percent={Math.min(100, (1000 / (renderTime || 1)) * 20)}
                      status={
                        renderTime && renderTime < 500
                          ? 'success'
                          : renderTime && renderTime < 1000
                            ? 'normal'
                            : 'exception'
                      }
                      format={() =>
                        renderTime && renderTime < 500
                          ? '优秀'
                          : renderTime && renderTime < 1000
                            ? '良好'
                            : '需要优化'
                      }
                    />
                  </div>
                </Space>
              </Card>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2}>
            <ThunderboltOutlined /> 组织树性能测试
          </Title>
          <Text type="secondary">测试不同规模数据下的组件渲染性能和交互体验</Text>
        </div>

        <Space style={{ marginBottom: '24px' }} wrap>
          <Text strong>测试规模：</Text>
          <Select
            value={testScale}
            onChange={setTestScale}
            style={{ width: 120 }}
            disabled={loading}
          >
            <Option value="small">小规模 (50根节点)</Option>
            <Option value="medium">中等规模 (200根节点)</Option>
            <Option value="large">大规模 (1000根节点)</Option>
            <Option value="huge">超大规模 (5000根节点)</Option>
          </Select>

          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={generateTestData}
            loading={loading}
            disabled={loading}
          >
            生成测试数据
          </Button>

          <Button icon={<ReloadOutlined />} onClick={generateTestData} disabled={loading}>
            重新测试
          </Button>
        </Space>

        {renderStatsCards()}

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          tabBarExtraContent={
            <Space>
              <Text type="secondary">数据更新时间: {new Date().toLocaleTimeString()}</Text>
            </Space>
          }
        />
      </Card>
    </div>
  );
};

export default PerformanceTest;
