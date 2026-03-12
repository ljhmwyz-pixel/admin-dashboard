import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AntLayout } from '@shared/components';
import GlobalLoading from '@shared/components/GlobalLoading';
import { useGlobalLoading } from '@shared/hooks';

import SiderFooter from './SiderFooter';
import SiderHeader from './SiderHeader';
import SiderMenu from './SiderMenu';

import styles from './BaseLayout.module.scss';

const BaseLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isLoading: globalLoading } = useGlobalLoading();
  const { Sider, Content } = AntLayout;

  return (
    <AntLayout className={styles.siderLayout}>
      {/* 侧边栏 */}
      <Sider
        collapsible
        trigger={null}
        collapsed={collapsed}
        width={220}
        collapsedWidth={56}
        className={`${styles.sidebar} ${collapsed && styles.collapsed}`}
      >
        <div className={`${styles.siderInner} ${collapsed && styles.siderInnerCollapsed}`}>
          {/* Logo + 折叠按钮 */}
          <SiderHeader collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
          {/* 菜单 */}
          <SiderMenu collapsed={collapsed} />
          {/* 左下角用户区域 */}
          <SiderFooter collapsed={collapsed} />
        </div>
      </Sider>

      {/* 主内容区域 */}
      <AntLayout
        className={styles.adminMainLayout}
        style={{
          marginLeft: collapsed ? 80 : 256,
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* 内容区域 */}
        <Content className={styles.adminContent}>
          <div className={styles.contentWrapper}>
            {/* 全局loading组件 */}
            <GlobalLoading visible={globalLoading} tip="加载中..." />
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default BaseLayout;
