import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Layout,
    Sidebar,
    Content,
} from './lib';
import { organizationMenuItems } from './lib/navigation/OrganizationMenu';

import './AdminLayout.css';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // 根据当前路径确定选中的菜单项
    const getCurrentMenuKey = () => {
        const path = location.pathname;
        if (path.startsWith('/organization/list')) return 'organization-list';
        if (path.startsWith('/organization/type')) return 'organization-type';
        if (path.startsWith('/role')) return 'role-mgmt';
        if (path.startsWith('/user')) return 'user-mgmt';
        return 'dashboard';
    };

    const [selectedMenuKey, setSelectedMenuKey] = useState('organization-list');

    // 监听路由变化
    useEffect(() => {
        setSelectedMenuKey(getCurrentMenuKey());
    }, [location.pathname]);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const handleMenuClick = (item: any, key: string) => {
        console.log('菜单点击:', item, key);
        console.log('即将跳转到:', getRoutePath(key));
        setSelectedMenuKey(key);

        // 根据菜单项导航到对应页面
        const routePath = getRoutePath(key);
        if (routePath) {
            navigate(routePath);
        } else {
            navigate('/dashboard');
        }
    };

    // 根据菜单key获取对应的路由路径
    const getRoutePath = (key: string): string | null => {
        switch (key) {
            case 'organization-list':
                return '/organization/list';
            case 'organization-type':
                return '/organization/type';
            case 'role-mgmt':
                return '/role';
            case 'user-mgmt':
                return '/user';
            default:
                return null;
        }
    };

    const handleBellClick = () => {
        console.log('通知按钮点击');
    };

    const handleUserClick = () => {
        console.log('用户头像点击');
    };

    // 获取页面标题
    const getPageTitle = () => {
        const titles: Record<string, string> = {
            dashboard: '仪表板',
            users: '用户管理',
            orders: '订单管理',
            products: '商品管理',
            system: '系统设置'
        };
        return titles[selectedMenuKey] || '管理后台';
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* 侧边栏 */}
            <Sidebar
                menuItems={organizationMenuItems}
                collapsed={collapsed}
                onCollapse={setCollapsed}
                selectedKeys={[selectedMenuKey]}
                onItemClick={handleMenuClick}
            />

            {/* 主内容区域 */}
            <Layout
                className="admin-main-layout"
                style={{
                    marginLeft: collapsed ? 80 : 256,
                    transition: 'margin-left 0.3s ease'
                }}
            >

                {/* 内容区域 */}
                <Content className="admin-content">
                    <div className="content-wrapper">
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;