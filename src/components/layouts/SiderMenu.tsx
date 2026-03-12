import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PermissionCode } from '@shared/constants/permissions';
import { useLanguage } from '@shared/hooks';
import { usePermission } from '@shared/hooks/usePermission';
import type { MenuProps, PopoverProps } from 'antd';
import { ConfigProvider, Menu, Popover } from 'antd';

import { ImageIcons } from '@/components';

import styles from './SiderMenu.module.scss';

interface Props {
  collapsed: boolean;
}

const SiderMenu: React.FC<Props> = ({ collapsed }) => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([PermissionCode.ORG_LIST]);
  const { t } = useLanguage();
  const { hasPermission } = usePermission();
  const handleMenuClick = (key: string) => {
    setSelectedKeys([key]);

    if (key === PermissionCode.ORG_LIST) navigate('/organization/list');
    if (key === PermissionCode.ORG_TYPE_CFG) navigate('/organization/type');
    if (key === PermissionCode.ROLE_MANAGE) navigate('/role');
    if (key === PermissionCode.USER_MANAGE) navigate('/user');
  };

  const menuItems: MenuProps['items'] = [
    {
      label: <span className={styles.menuItemLabelStyle}>{t('org.mgmt.title')}</span>,
      key: PermissionCode.ORG_MANAGE,
      icon: (
        <img
          src={
            selectedKeys.includes(PermissionCode.ORG_MANAGE) ||
            selectedKeys.includes(PermissionCode.ORG_LIST) ||
            selectedKeys.includes(PermissionCode.ORG_TYPE_CFG)
              ? ImageIcons.menu.orgActiveIcon
              : ImageIcons.menu.orgDefaultIcon
          }
          className={styles.menu_icon}
        />
      ),
      children: [
        {
          label: t('org.list.title'),
          key: PermissionCode.ORG_LIST,
        },
        {
          label: t('org.type.title'),
          key: PermissionCode.ORG_TYPE_CFG,
        },
      ],
    },
    {
      label: <span className={styles.menuItemLabelStyle}>{t('role.mgmt.title')}</span>,
      key: PermissionCode.ROLE_MANAGE,
      icon: (
        <img
          src={
            selectedKeys.includes(PermissionCode.ROLE_MANAGE)
              ? ImageIcons.menu.roleActiveIcon
              : ImageIcons.menu.roleDefaultIcon
          }
          className={styles.menu_icon}
        />
      ),
    },
    {
      label: <span className={styles.menuItemLabelStyle}>{t('user.mgmt.title')}</span>,
      key: PermissionCode.USER_MANAGE,
      icon: (
        <img
          src={
            selectedKeys.includes(PermissionCode.USER_MANAGE)
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

  // menu权限过滤
  const filteredMenuItems = menuItems.filter((item: any) => {
    if (hasPermission(item?.key)) return true;
    return false;
  });

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
          items={filteredMenuItems}
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
