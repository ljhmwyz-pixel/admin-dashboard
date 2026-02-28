// 组织数据模拟文件
// 根据图1的树形结构创建模拟数据

export interface OrganizationNode {
  key: string;
  title: string;
  children?: OrganizationNode[];
  isLeaf?: boolean;
  type?: 'company' | 'dealer' | 'installer';
  canAdd?: boolean;
  canDelete?: boolean;
}

export const organizationTreeData: OrganizationNode[] = [
  {
    key: 'p001',
    title: 'Pylontech',
    type: 'company',
    canAdd: true,
    canDelete: true,
    children: [
      {
        key: 'd001',
        title: 'Dealer 1-A',
        type: 'dealer',
        canAdd: true,
        canDelete: true,
        children: [
          {
            key: 'i001',
            title: 'Installer 1-B',
            type: 'installer',
            canAdd: false,
            canDelete: true,
          },
        ],
      },
      {
        key: 'd002',
        title: 'Dealer 1-C',
        type: 'dealer',
        canAdd: true,
        canDelete: true,
        children: [
          {
            key: 'i002',
            title: 'Installer 2-A',
            type: 'installer',
            canAdd: true,
            canDelete: true,
            children: [
              {
                key: 'i003',
                title: 'Installer 2-A',
                type: 'installer',
                canAdd: false,
                canDelete: true,
              },
            ],
          },
        ],
      },
      {
        key: 'd003',
        title: 'Dealer 1-D',
        type: 'dealer',
        canAdd: false,
        canDelete: true,
      },
      {
        key: 'd004',
        title: 'Dealer 1-E',
        type: 'dealer',
        canAdd: false,
        canDelete: true,
      },
      {
        key: 'd005',
        title: 'Dealer 1-F',
        type: 'dealer',
        canAdd: false,
        canDelete: true,
      },
      {
        key: 'd006',
        title: 'Dealer 1-G',
        type: 'dealer',
        canAdd: false,
        canDelete: true,
      },
      {
        key: 'd007',
        title: 'Dealer 1-H',
        type: 'dealer',
        canAdd: false,
        canDelete: true,
      },
      {
        key: 'd008',
        title:
          'Dealer 1-IJKMNMNMONMONMONMONMONMONMONMONMONMONIJKMNMNMONMONMONMONMONMONMONMONMONMON',
        type: 'dealer',
        canAdd: false,
        canDelete: true,
      },
    ],
  },
];

// 生成大量组织树数据的方法
export const generateMassiveOrganizationTreeData = (
  rootNodeCount: number = 100,
  maxDepth: number = 4,
  avgChildrenPerNode: number = 3,
): OrganizationNode[] => {
  let nodeIdCounter = 1;

  // 生成随机标题
  const generateTitle = (level: number, index: number): string => {
    const prefixes = [
      'Pylontech',
      'Tesla Energy',
      'BYD',
      'CATL',
      'LG Chem',
      'Panasonic',
      'Samsung SDI',
      '宁德时代',
      '比亚迪',
      '国轩高科',
    ];

    const dealerNames = [
      'Regional Dealer',
      'Area Distributor',
      'Zone Partner',
      'Territory Manager',
      'District Representative',
      'Sales Partner',
      'Business Associate',
      'Market Specialist',
    ];

    const installerNames = [
      'Professional Installer',
      'Certified Technician',
      'Master Electrician',
      'Solar Specialist',
      'Energy Systems Expert',
      'Renewable Tech',
      'Power Solutions Pro',
      'Grid Integration Specialist',
    ];

    if (level === 0) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

      return `${prefix} ${String.fromCharCode(65 + (index % 26))}${Math.floor(index / 26) + 1}`;
    } else if (level === 1) {
      const dealer = dealerNames[Math.floor(Math.random() * dealerNames.length)];

      return `${dealer} ${index + 1}`;
    } else {
      const installer = installerNames[Math.floor(Math.random() * installerNames.length)];

      return `${installer} ${index + 1}`;
    }
  };

  // 确定节点类型
  const getNodeType = (level: number): 'company' | 'dealer' | 'installer' => {
    if (level === 0) return 'company';
    if (level === 1) return 'dealer';

    return 'installer';
  };

  // 确定权限
  const getNodePermissions = (
    level: number,
    maxLevel: number,
  ): { canAdd: boolean; canDelete: boolean } => {
    if (level === 0) {
      // 根节点：不能删除，可以添加
      return { canAdd: true, canDelete: false };
    } else if (level === maxLevel) {
      // 叶子节点：不能添加，可以删除
      return { canAdd: false, canDelete: true };
    } else {
      // 中间节点：可以添加和删除
      return { canAdd: true, canDelete: true };
    }
  };

  // 递归生成子节点
  const generateChildren = (
    parentId: string,
    level: number,
    remainingDepth: number,
  ): OrganizationNode[] => {
    if (remainingDepth <= 0) return [];

    const childrenCount = Math.max(1, Math.floor(Math.random() * avgChildrenPerNode * 2));
    const children: OrganizationNode[] = [];

    for (let i = 0; i < childrenCount; i++) {
      const nodeId = `${parentId}-${String(nodeIdCounter++).padStart(3, '0')}`;
      const title = generateTitle(level, i);
      const type = getNodeType(level);
      const permissions = getNodePermissions(level, maxDepth - 1);

      const node: OrganizationNode = {
        key: nodeId,
        title: title,
        type: type,
        canAdd: permissions.canAdd,
        canDelete: permissions.canDelete,
        isLeaf: remainingDepth === 1,
      };

      // 递归生成孙节点
      if (remainingDepth > 1) {
        node.children = generateChildren(nodeId, level + 1, remainingDepth - 1);
        node.isLeaf = node.children.length === 0;
      }

      children.push(node);
    }

    return children;
  };

  // 生成根节点
  const rootNodes: OrganizationNode[] = [];
  for (let i = 0; i < rootNodeCount; i++) {
    const nodeId = `root-${String(nodeIdCounter++).padStart(3, '0')}`;
    const title = generateTitle(0, i);
    const permissions = getNodePermissions(0, maxDepth - 1);

    const rootNode: OrganizationNode = {
      key: nodeId,
      title: title,
      type: 'company',
      canAdd: permissions.canAdd,
      canDelete: permissions.canDelete,
      isLeaf: maxDepth === 1,
    };

    // 生成子节点
    if (maxDepth > 1) {
      rootNode.children = generateChildren(nodeId, 1, maxDepth - 1);
      rootNode.isLeaf = rootNode.children.length === 0;
    }

    rootNodes.push(rootNode);
  }

  return rootNodes;
};

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
    comment: 'Root organization of Pylontech Cloud 2.0',
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
    comment: 'Primary dealer for North China region',
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
    comment: 'Premium dealer for East China region',
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
    comment: 'Certified installer for residential projects',
  },
};
