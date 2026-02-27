import Mock from 'mockjs';

// 设置延迟时间模拟网络请求
Mock.setup({
  timeout: '200-600'
});

// 用户数据模板
const userTemplate = {
  'id|+1': 1,
  name: '@cname',
  email: '@email',
  'age|18-65': 1,
  'status|1': ['active', 'inactive', 'pending'],
  avatar: '@image(100x100, @color, @character)',
  createdAt: '@datetime',
  lastLogin: '@datetime',
  'role|1': ['admin', 'user', 'editor']
};

// 订单数据模板
const orderTemplate = {
  'id|+1': 10001,
  orderNumber: '@guid',
  customerName: '@cname',
  'amount|100-5000.2': 1,
  'status|1': ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  createdAt: '@datetime',
  updatedAt: '@datetime',
  paymentMethod: '@pick(["credit_card", "alipay", "wechat", "paypal"])',
  'items|1-5': [{
    productName: '@ctitle(3, 8)',
    'quantity|1-10': 1,
    'price|10-500.2': 1
  }]
};

// 商品数据模板
const productTemplate = {
  'id|+1': 1001,
  name: '@ctitle(5, 15)',
  description: '@csentence(10, 30)',
  'price|10-1000.2': 1,
  'stock|0-1000': 1,
  'category|1': ['electronics', 'clothing', 'books', 'home', 'sports'],
  'status|1': ['active', 'inactive', 'out_of_stock'],
  imageUrl: '@image(300x300, @color, @character)',
  createdAt: '@datetime',
  updatedAt: '@datetime',
  'rating|1-5.1': 1,
  'salesCount|0-1000': 1
};

// 生成 Mock 数据
export const mockData = {
  // 用户数据
  getUsers: (page = 1, pageSize = 10) => {
    return Mock.mock({
      total: 156,
      page,
      pageSize,
      [`data|${pageSize}`]: [userTemplate]
    });
  },

  // 订单数据
  getOrders: (page = 1, pageSize = 10) => {
    return Mock.mock({
      total: 234,
      page,
      pageSize,
      [`data|${pageSize}`]: [orderTemplate]
    });
  },

  // 商品数据
  getProducts: (page = 1, pageSize = 10) => {
    return Mock.mock({
      total: 89,
      page,
      pageSize,
      [`data|${pageSize}`]: [productTemplate]
    });
  },

  // 统计数据
  getStats: () => {
    return Mock.mock({
      users: {
        total: '@integer(10000, 50000)',
        today: '@integer(50, 200)',
        growth: '@float(-10, 20, 1, 2)'
      },
      orders: {
        total: '@integer(5000, 20000)',
        today: '@integer(20, 100)',
        growth: '@float(-5, 15, 1, 2)'
      },
      revenue: {
        total: '@integer(100000, 500000)',
        today: '@integer(2000, 10000)',
        growth: '@float(-8, 12, 1, 2)'
      },
      conversion: {
        rate: '@float(15, 35, 1, 1)',
        growth: '@float(-3, 8, 1, 2)'
      }
    });
  },

  // 最近活动
  getRecentActivities: () => {
    return Mock.mock({
      'data|10': [{
        'id|+1': 1,
        user: '@cname',
        'action|1': [
          '创建了新订单',
          '更新了用户资料',
          '支付了订单',
          '登录系统',
          '下载了报表',
          '上传了文件',
          '修改了设置',
          '删除了数据'
        ],
        time: '@datetime("MM-dd HH:mm")',
        'type|1': ['order', 'user', 'system', 'file']
      }]
    });
  },

  // 图表数据
  getChartData: () => {
    const dates = [];
    const sales = [];
    const visitors = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(`${date.getMonth() + 1}-${date.getDate()}`);
      sales.push(Mock.Random.integer(1000, 5000));
      visitors.push(Mock.Random.integer(500, 3000));
    }

    return {
      dates,
      sales,
      visitors
    };
  }
};

// 模拟 API 请求函数
export const api = {
  // 用户相关 API
  users: {
    list: (params: any = {}) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const result = mockData.getUsers(params.page || 1, params.pageSize || 10);
          resolve(result);
        }, Mock.Random.integer(200, 600));
      });
    },
    
    getById: (id: number) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = Mock.mock({
            ...userTemplate,
            id
          });
          resolve(user);
        }, Mock.Random.integer(200, 600));
      });
    }
  },

  // 订单相关 API
  orders: {
    list: (params: any = {}) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const result = mockData.getOrders(params.page || 1, params.pageSize || 10);
          resolve(result);
        }, Mock.Random.integer(200, 600));
      });
    }
  },

  // 商品相关 API
  products: {
    list: (params: any = {}) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const result = mockData.getProducts(params.page || 1, params.pageSize || 10);
          resolve(result);
        }, Mock.Random.integer(200, 600));
      });
    }
  },

  // 统计数据 API
  stats: {
    getDashboardStats: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockData.getStats());
        }, Mock.Random.integer(300, 800));
      });
    }
  },

  // 活动数据 API
  activities: {
    getRecent: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockData.getRecentActivities());
        }, Mock.Random.integer(200, 500));
      });
    }
  },

  // 图表数据 API
  charts: {
    getSalesData: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockData.getChartData());
        }, Mock.Random.integer(400, 1000));
      });
    }
  }
};

export default mockData;