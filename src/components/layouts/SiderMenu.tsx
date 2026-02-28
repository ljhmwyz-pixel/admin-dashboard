import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MenuProps, PopoverProps } from 'antd';
import { ConfigProvider, Menu, Popover } from 'antd';

import menuIconClose from '@/assets/images/layout/menu_icon_close.png';
import menuIconOpen from '@/assets/images/layout/menu_icon_open.png';
import orgActiveIcon from '@/assets/images/layout/org_active_icon.png';
import orgDefaultIcon from '@/assets/images/layout/org_default_icon.png';
import roleActiveIcon from '@/assets/images/layout/role_active_icon.png';
import roleDefaultIcon from '@/assets/images/layout/role_default_icon.png';
import userActiveIcon from '@/assets/images/layout/user_active_icon.png';
import userDefaultIcon from '@/assets/images/layout/user_default_icon.png';

import styles from './SiderMenu.module.scss';

interface Props {
  collapsed: boolean;
}

const SiderFooter: React.FC<Props> = ({ collapsed }) => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['orglist']);

  const handleMenuClick = (key: string) => {
    setSelectedKeys([key]);

    if (key === 'orglist') navigate('/organization/list');
    if (key === 'orgtype') navigate('/organization/type');
    if (key === 'role') navigate('/role');
    if (key === 'user') navigate('/user');
  };

  const menuItems: MenuProps['items'] = [
    {
      label: <span className={styles.menuItemLabelStyle}>Organization Mgmt</span>,
      key: 'org',
      icon: (
        <img
          src={
            selectedKeys.includes('org') ||
            selectedKeys.includes('orglist') ||
            selectedKeys.includes('orgtype')
              ? orgActiveIcon
              : orgDefaultIcon
          }
          className={styles.menu_icon}
        />
      ),
      children: [
        {
          label: 'Organization List',
          key: 'orglist',
        },
        {
          label: 'Organization Type',
          key: 'orgtype',
        },
      ],
    },
    {
      label: <span className={styles.menuItemLabelStyle}>Role Mgmt</span>,
      key: 'role',
      icon: (
        <img
          src={selectedKeys.includes('role') ? roleActiveIcon : roleDefaultIcon}
          className={styles.menu_icon}
        />
      ),
    },
    {
      label: <span className={styles.menuItemLabelStyle}>User Mgmt</span>,
      key: 'user',
      icon: (
        <img
          src={selectedKeys.includes('user') ? userActiveIcon : userDefaultIcon}
          className={styles.menu_icon}
        />
      ),
    },
  ];

  /* =======================
     collapsed 自定义渲染
  ======================== */

  const renderCollapsedMenu = () => {
    return menuItems?.map((item: any) => {
      const hasChildren = item.children?.length > 0;

      const stylesFn: PopoverProps['styles'] = (info) => {
        if (!info.props.arrow) {
          return {
            container: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              padding: 0,
            },
          } satisfies PopoverProps['styles'];
        }

        return {};
      };
      const isActive =
        selectedKeys.includes(item.key) ||
        item.children?.some((sub: any) => selectedKeys.includes(sub.key));

      return (
        <Popover
          key={item.key}
          placement="right"
          trigger="hover"
          arrow={false}
          styles={stylesFn}
          align={{
            offset: [10, 0],
          }}
          content={
            <div className={styles.subMenuCollapsedStyle}>
              {hasChildren ? (
                item.children.map((sub: any) => (
                  <div
                    key={sub.key}
                    className={styles.subMenuItem}
                    onClick={() => handleMenuClick(sub.key)}
                  >
                    {sub.label}
                  </div>
                ))
              ) : (
                <div className={styles.subMenuItem} onClick={() => handleMenuClick(item.key)}>
                  {item.label}
                </div>
              )}
            </div>
          }
        >
          <div className={`${styles.iconOnlyItem} ${isActive ? styles.activeIconOnlyItem : ''}`}>
            {item.icon}
            {isActive && <div className={styles.activeBar} />}
          </div>
        </Popover>
      );
    });
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            activeBarBorderWidth: 0,
          },
        },
      }}
    >
      {!collapsed ? (
        <Menu
          theme="light"
          mode="inline"
          items={menuItems}
          selectedKeys={selectedKeys}
          onClick={({ key }) => handleMenuClick(key)}
          expandIcon={({ isOpen }) => (
            <img src={isOpen ? menuIconOpen : menuIconClose} className={styles.expandIcon} />
          )}
          className={styles.menu}
          inlineIndent={16}
        />
      ) : (
        <div className={styles.collapsedWrapper}>{renderCollapsedMenu()}</div>
      )}
    </ConfigProvider>
  );
};

export default SiderFooter;
