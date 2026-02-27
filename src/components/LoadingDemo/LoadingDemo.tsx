import React from 'react';
import { Button, Space } from 'antd';
import { useLoading, useAsyncLoading } from '../../hooks/redux';

const LoadingDemo: React.FC = () => {
  const { showLoading, hideLoading, globalLoading } = useLoading();
  const { withLoading } = useAsyncLoading();

  const handleManualLoading = () => {
    showLoading('manual');
    setTimeout(() => {
      hideLoading('manual');
    }, 2000);
  };

  const handleAsyncLoading = async () => {
    await withLoading('async', async () => {
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('异步操作完成');
    });
  };

  const handleMultipleLoading = () => {
    // 同时触发多个loading任务
    showLoading('task1');
    showLoading('task2');
    
    setTimeout(() => hideLoading('task1'), 1000);
    setTimeout(() => hideLoading('task2'), 2000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Redux Loading 状态演示</h2>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <p>全局loading状态: {globalLoading ? '加载中...' : '空闲'}</p>
        </div>
        
        <Space>
          <Button onClick={handleManualLoading}>
            手动控制Loading
          </Button>
          
          <Button onClick={handleAsyncLoading}>
            异步操作Loading
          </Button>
          
          <Button onClick={handleMultipleLoading}>
            多任务Loading
          </Button>
        </Space>
      </Space>
    </div>
  );
};

export default LoadingDemo;