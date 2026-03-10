import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MenuProps, PopoverProps } from 'antd';
import { ConfigProvider, Menu, Popover } from 'antd';

import { ImageIcons } from '@/components';
import { useLanguage } from '@/shared/hooks';

import styles from './SiderMenu.module.scss';

interface Props {
  collapsed: boolean;
}

const SiderMenu: React.FC<Props> = ({ collapsed }) => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['orglist']);
  const { t } = useLanguage();

  const handleMenuClick = (key: string) => {
    setSelectedKeys([key]);

    if (key === 'orglist') navigate('/organization/list');
    if (key === 'orgtype') navigate('/organization/type');
    if (key === 'role') navigate('/role');
    if (key === 'user') navigate('/user');
    if (key === 'performance-test') navigate('/performance-test');
  };

  const menuItems: MenuProps['items'] = [
    {
      label: <span className={styles.menuItemLabelStyle}>{t('org.mgmt.title')}</span>,
      key: 'org',
      icon: (
        <img
          src={
            selectedKeys.includes('org') ||
            selectedKeys.includes('orglist') ||
            selectedKeys.includes('orgtype')
              ? ImageIcons.menu.orgActiveIcon
              : ImageIcons.menu.orgDefaultIcon
          }
          className={styles.menu_icon}
        />
      ),
      children: [
        {
          label: t('org.list.title'),
          key: 'orglist',
        },
        {
          label: t('org.type.title'),
          key: 'orgtype',
        },
      ],
    },
    {
      label: <span className={styles.menuItemLabelStyle}>{t('role.mgmt.title')}</span>,
      key: 'role',
      icon: (
        <img
          src={
            selectedKeys.includes('role')
              ? ImageIcons.menu.roleActiveIcon
              : ImageIcons.menu.roleDefaultIcon
          }
          className={styles.menu_icon}
        />
      ),
    },
    {
      label: <span className={styles.menuItemLabelStyle}>{t('user.mgmt.title')}</span>,
      key: 'user',
      icon: (
        <img
          src={
            selectedKeys.includes('user')
              ? ImageIcons.menu.userActiveIcon
              : ImageIcons.menu.userDefaultIcon
          }
          className={styles.menu_icon}
        />
      ),
    },
    {
      label: <span className={styles.menuItemLabelStyle}>Performance Test</span>,
      key: 'performance-test',
      icon: (
        <img
          src={
            selectedKeys.includes('performance-test')
              ? ImageIcons.menu.userActiveIcon
              : ImageIcons.menu.userDefaultIcon
          }
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
          <div className={`${styles.iconOnlyItem} ${isActive && styles.activeIconOnlyItem}`}>
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
          mode="inline"
          items={menuItems}
          selectedKeys={selectedKeys}
          onClick={({ key }) => handleMenuClick(key)}
          expandIcon={({ isOpen }) => (
            <img
              src={isOpen ? ImageIcons.menu.menuIconOpen : ImageIcons.menu.menuIconClose}
              className={styles.expandIcon}
            />
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

export default SiderMenu;
