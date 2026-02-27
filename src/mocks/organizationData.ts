// 组织数据模拟文件
// 根据图1的树形结构创建模拟数据

export interface OrganizationNode {
  key: string;
  title: string;
  children?: OrganizationNode[];
  isLeaf?: boolean;
  type?: 'company' | 'dealer' | 'installer';
}

export const organizationTreeData: OrganizationNode[] = [
  {
    key: 'p001',
    title: 'Pylontech',
    type: 'company',
    children: [
      {
        key: 'd001',
        title: 'Dealer 1-A',
        type: 'dealer',
        children: [
          {
            key: 'i001',
            title: 'Installer 1-B',
            type: 'installer'
          }
        ]
      },
      {
        key: 'd002',
        title: 'Dealer 1-C',
        type: 'dealer',
        children: [
          {
            key: 'i002',
            title: 'Installer 2-A',
            type: 'installer',
            children: [
              {
                key: 'i003',
                title: 'Installer 2-A',
                type: 'installer'
              }
            ]
          }
        ]
      },
      {
        key: 'd003',
        title: 'Dealer 1-D',
        type: 'dealer'
      },
      {
        key: 'd004',
        title: 'Dealer 1-E',
        type: 'dealer'
      },
      {
        key: 'd005',
        title: 'Dealer 1-F',
        type: 'dealer'
      },
      {
        key: 'd006',
        title: 'Dealer 1-G',
        type: 'dealer'
      },
      {
        key: 'd007',
        title: 'Dealer 1-H',
        type: 'dealer'
      },
      {
        key: 'd008',
        title: 'Dealer 1-IJKMNMNMONMONMONMONMONMONMONMONMONMON...',
        type: 'dealer'
      }
    ]
  }
];

// 组织详情数据
export interface OrganizationDetail {
  id: string;
  name: string;
  type: 'company' | 'dealer' | 'installer';
  address: string;
  postalCode: string;
  email: string;
  adminName: string;
  country: string;
  phoneNumber: string;
  comment: string;
}

export const organizationDetails: Record<string, OrganizationDetail> = {
  p001: {
    id: 'p001',
    name: 'Pylontech',
    type: 'company',
    address: 'No.300 Miaqiao Road, Pudong, Shanghai',
    postalCode: '201315',
    email: 'm*****g@pylontech.com.cn',
    adminName: 'Mark Tong',
    country: 'China',
    phoneNumber: '--',
    comment: 'Root organization of Pylontech Cloud 2.0'
  },
  d001: {
    id: 'd001',
    name: 'Dealer 1-A',
    type: 'dealer',
    address: 'No.123 Main Street, Beijing',
    postalCode: '100000',
    email: 'dealer1a@example.com',
    adminName: 'John Smith',
    country: 'China',
    phoneNumber: '010-12345678',
    comment: 'Primary dealer for North China region'
  },
  d002: {
    id: 'd002',
    name: 'Dealer 1-C',
    type: 'dealer',
    address: 'No.456 Commerce Ave, Shanghai',
    postalCode: '200000',
    email: 'dealer1c@example.com',
    adminName: 'Jane Doe',
    country: 'China',
    phoneNumber: '021-87654321',
    comment: 'Premium dealer for East China region'
  },
  i001: {
    id: 'i001',
    name: 'Installer 1-B',
    type: 'installer',
    address: 'No.789 Tech Park, Shenzhen',
    postalCode: '518000',
    email: 'installer1b@example.com',
    adminName: 'Mike Johnson',
    country: 'China',
    phoneNumber: '0755-11223344',
    comment: 'Certified installer for residential projects'
  }
};