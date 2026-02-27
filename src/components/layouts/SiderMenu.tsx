import React, { useState } from 'react'
import { Menu, ConfigProvider } from 'antd'
import { useNavigate } from 'react-router-dom';

import orgActiveIcon from '../../../public/org_active_icon.png'
import orgDefaultIcon from '../../../public/org_default_icon.png'
import roleActiveIcon from '../../../public/role_active_icon.png'
import roleDefaultIcon from '../../../public/role_default_icon.png'
import userActiveIcon from '../../../public/user_active_icon.png'
import userDefaultIcon from '../../../public/user_default_icon.png'
import menuIconOpen from '../../../public/menu_icon_open.png'
import menuIconClose from '../../../public/menu_icon_close.png'
import styles from './SiderMenu.module.scss'

interface Props {
  collapsed: boolean
}

const SiderFooter: React.FC<Props> = ({ collapsed }) => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState(['org-list']);
  const menuItems = [
    {
      label: <span className={styles.menuItemLabelStyle}>Organization Mgmt</span>,
      key: 'org',
      icon: <img src={(selectedKeys.includes('org') || selectedKeys.includes('orglist') || selectedKeys.includes('orgtype')) ? orgActiveIcon : orgDefaultIcon} className={styles.menu_icon} />,
      children: [
        {
          label: <span className={styles.subMenuItemLabelStyle}>Organization List</span>,
          key: 'orglist',
        },
        {
          label: <span className={styles.subMenuItemLabelStyle}>Organization Type</span>,
          key: 'orgtype',
        },
      ],
    },
    {
      label: <span className={styles.menuItemLabelStyle}>Role Mgmt</span>,
      key: 'role',
      icon: <img src={selectedKeys.includes('role') ? roleActiveIcon : roleDefaultIcon} className={styles.menu_icon} />,
    },
    {
      label: <span className={styles.menuItemLabelStyle}>User Mgmt</span>,
      key: 'user',
      icon: <img src={selectedKeys.includes('user') ? userActiveIcon : userDefaultIcon} className={styles.menu_icon} />,
    },
  ]

  const handleMenuClick = (e: any) => {
    if (e.key === 'orglist') {
      navigate('/organization/list');
    }
    if (e.key === 'orgtype') {
      navigate('/organization/type');
    }
    if (e.key === 'role') {
      navigate('/role');
    }
    if (e.key === 'user') {
      navigate('/user');
    };
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            // itemSelectedBg: '#33C2C8',     // 选中背景色
            // subMenuItemBg: '#f7f7f7',// 子菜单未选中背景色
            // itemActiveBg: '#33C2C8',
            activeBarBorderWidth: 0,
          },
        },
      }}
    >
      <Menu
        mode="inline"
        items={menuItems}
        onSelect={({ key }) => setSelectedKeys([key])}
        expandIcon={({ isOpen }) => <img src={isOpen ? menuIconOpen : menuIconClose} className={styles.expandIcon} />}
        className={`${styles.menu} ${collapsed ? styles.collapsedMenu : ''}`}
        inlineIndent={16} // padding-left
        onClick={handleMenuClick}
      />
    </ConfigProvider>
  )
}

export default SiderFooter
