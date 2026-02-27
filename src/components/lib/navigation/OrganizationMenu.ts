// 组织管理菜单数据结构
export const organizationMenuItems = [
  {
    key: 'organization-mgmt',
    icon: 'appstore',
    label: 'Organization Mgmt',
    children: [
      {
        key: 'organization-list',
        label: 'Organization List',
        path: '/organization/list'
      },
      {
        key: 'organization-type',
        label: 'Organization Type',
        path: '/organization/type'
      }
    ]
  },
  {
    key: 'role-mgmt',
    icon: 'team',
    label: 'Role Mgmt',
    path: '/role'
  },
  {
    key: 'user-mgmt',
    icon: 'user',
    label: 'User Mgmt',
    path: '/user'
  }
];

// 用户信息数据
export const currentUserInfo = {
  name: 'Leyu.song',
  role: 'Admin',
  avatar: '/assets/images/avatar.png' // 可以替换为实际的头像路径
};