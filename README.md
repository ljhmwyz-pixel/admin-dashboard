# Admin Dashboard

现代化的企业级管理后台系统，基于 React 19 + TypeScript 5 + Vite 7 + Ant Design 6 构建。

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-purple.svg)](https://vitejs.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-6.3.1-green.svg)](https://ant.design/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌟 特性概览

- 🚀 **现代化技术栈** - React 19, TypeScript 5, Vite 7
- 🎨 **企业级UI** - Ant Design 6 组件库
- 🛠️ **完整架构** - 模块化设计，清晰的目录结构
- 🔧 **专业工具链** - Winston日志，Sentry错误追踪，Convict配置管理
- 🌐 **国际化支持** - 多语言(i18n)支持 (中文、英文、德语、意大利语、日语)
- 📊 **性能监控** - 完整的性能和错误监控体系
- 🛡️ **安全保障** - 完善的安全机制和RBAC权限控制
- 🐳 **容器化部署** - Docker支持和CI/CD配置
- 🎯 **主题定制** - 深色/浅色模式，多种配色方案
- ⚡ **高性能** - 代码分割，懒加载，性能优化

## 📋 目录

- [快速开始](#快速开始)
- [技术架构](#技术架构)
- [核心功能](#核心功能)
- [开发指南](#开发指南)
- [部署说明](#部署说明)
- [项目结构](#项目结构)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 10.0.0
- Git

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd admin-dashboard

# 安装依赖
pnpm install
```

### 环境配置

复制环境变量模板：

```bash
cp .env.example .env
```

根据需要修改 `.env` 文件中的配置：

```bash
# 应用环境配置
NODE_ENV=development

# API 配置
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

# 日志配置
VITE_LOG_ENDPOINT=
VITE_LOG_LEVEL=debug

# 监控配置
VITE_APM_SERVER=
VITE_APP_VERSION=1.0.0

# 第三方服务
VITE_GA_ID=
VITE_SENTRY_DSN=

# 构建配置
VITE_ANALYZE=false
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

访问 [http://localhost:5173](http://localhost:5173)

### 代码质量检查

```bash
# 类型检查
pnpm type-check

# 代码规范检查
pnpm lint

# 自动修复代码规范问题
pnpm lint:fix

# 清理缓存和构建文件
pnpm clean
```

## 🏗️ 技术架构

### 核心技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2.0 | 前端框架 |
| TypeScript | 5.9.3 | 类型安全 |
| Vite | 7.3.1 | 构建工具 |
| Ant Design | 6.3.1 | UI组件库 |
| Redux Toolkit | 2.11.2 | 状态管理 |
| React Router | 7.13.1 | 路由管理 |
| i18next | 25.8.13 | 国际化 |
| Winston | 3.19.0 | 日志系统 |
| Sentry | 10.40.0 | 错误追踪 |

### 架构模式

```
src/
├── core/                 # 核心模块
│   ├── router/          # 路由配置和守卫
│   ├── store/           # Redux状态管理
│   └── providers/       # 全局提供者
├── features/            # 功能模块
│   ├── dashboard/       # 仪表板
│   ├── organization/    # 组织管理
│   ├── user/           # 用户管理
│   └── role/           # 角色管理
├── shared/              # 共享资源
│   ├── components/      # 共享组件
│   ├── hooks/          # 自定义Hooks
│   ├── utils/          # 工具函数
│   └── types/          # 共享类型定义
├── config/             # 配置文件
├── services/           # API服务层
├── i18n/               # 国际化配置
└── assets/             # 静态资源
```

## 🔧 核心功能

### 🔐 认证与授权

- **RBAC权限控制**：基于角色的访问控制
- **JWT Token管理**：安全的认证令牌处理
- **权限路由守卫**：页面级别的权限验证
- **细粒度权限控制**：组件和功能级别的权限管理

### 🎨 主题系统

- **深色/浅色模式**：一键切换主题
- **多种配色方案**：蓝、绿、紫、橙、红五种主题色
- **跟随系统主题**：自动适配操作系统主题偏好
- **主题持久化**：用户主题偏好本地存储

### 🌐 国际化支持

支持5种语言：
- 🇨🇳 简体中文 (zh-CN)
- 🇺🇸 English (en-US)
- 🇩🇪 Deutsch (de-DE)
- 🇮🇹 Italiano (it-IT)
- 🇯🇵 日本語 (ja-JP)

特性：
- 语言包缓存机制
- 云端语言包支持
- 实时语言切换
- RTL语言支持规划中

### 📊 性能监控

- **前端性能监控**：页面加载、组件渲染性能
- **错误追踪**：JavaScript错误自动捕获
- **用户体验监控**：用户行为分析
- **资源加载监控**：网络请求性能分析

### 🛡️ 安全机制

- **XSS防护**：输入验证和输出编码
- **CSRF保护**：跨站请求伪造防护
- **内容安全策略**：CSP头部配置
- **安全头设置**：HTTP安全响应头

## 💻 开发指南

### 项目约定

#### 代码规范
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 和 Prettier 代码规范
- 组件采用函数式组件和 Hooks
- 状态管理使用 Redux Toolkit

#### 目录结构规范
```
features/
└── moduleName/
    ├── components/        # 模块特定组件
    ├── services/          # 模块API服务
    ├── mocks/             # 模拟数据
    ├── utils/             # 模块工具函数
    └── *.tsx             # 主要页面组件
```

#### 命名规范
- 组件文件：PascalCase (`UserProfile.tsx`)
- 工具函数：camelCase (`formatDate.ts`)
- 常量：UPPER_SNAKE_CASE (`API_ENDPOINTS`)
- 类型定义：PascalCase (`UserInterface`)

### 开发工具

#### Git Hooks
项目集成了 Husky 和 lint-staged：
- 提交前自动运行 ESLint 检查
- 自动格式化代码风格
- 类型检查前置验证

#### 调试工具
- React DevTools 浏览器扩展
- Redux DevTools 浏览器扩展
- 浏览器开发者工具
- 网络面板监控API请求

### 环境变量

不同环境的配置文件：
- `.env.development` - 开发环境
- `.env.production` - 生产环境
- `.env.test` - 测试环境

### 性能优化

#### 代码分割
```typescript
// 路由级别的代码分割
const Dashboard = lazy(() => import('../features/dashboard/Dashboard'));

// 组件级别的代码分割
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

#### 缓存策略
- HTTP缓存头配置
- Service Worker缓存
- 本地存储优化
- 内存缓存机制

## ☁️ 部署说明

### Docker 部署

```bash
# 构建镜像
docker build -t admin-dashboard .

# 运行容器
docker run -d -p 80:80 --name admin-dashboard admin-dashboard
```

### 云平台部署

#### Vercel 部署
```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署到生产环境
vercel --prod
```

#### Netlify 部署
在 Netlify 控制台中：
1. 连接 Git 仓库
2. 设置构建命令：`pnpm run build`
3. 设置发布目录：`dist`

### CI/CD 配置

GitHub Actions 示例配置：
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install pnpm
      run: npm install -g pnpm
      
    - name: Install dependencies
      run: pnpm install
      
    - name: Build
      run: pnpm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
        
    - name: Deploy
      run: |
        # 部署脚本
```

## 📁 项目结构详解

```
src/
├── App.tsx                    # 应用根组件
├── main.tsx                   # 应用入口
├── core/                      # 核心模块
│   ├── router/               # 路由系统
│   │   ├── config/routes.ts  # 路由配置
│   │   ├── guards/AuthGuard.tsx  # 路由守卫
│   │   └── AppRoutes.tsx     # 路由组件
│   ├── store/                # 状态管理
│   │   ├── slices/           # Redux切片
│   │   ├── thunks/           # 异步操作
│   │   └── hooks/            # Store Hooks
│   └── providers/            # 全局提供者
│       ├── ThemeContext.tsx  # 主题上下文
│       └── AntdThemeProvider.tsx  # Ant Design主题
├── features/                 # 功能模块
│   ├── dashboard/            # 仪表板
│   ├── organization/         # 组织管理
│   ├── user/                 # 用户管理
│   └── role/                 # 角色管理
├── shared/                   # 共享资源
│   ├── components/           # 共享组件库
│   ├── hooks/                # 自定义Hooks
│   ├── utils/                # 工具函数
│   ├── types/                # 类型定义
│   └── styles/               # 全局样式
├── config/                   # 配置文件
│   ├── theme.ts             # 主题配置
│   ├── schema.ts            # 配置模式
│   └── errorTracking.ts     # 错误追踪配置
├── services/                 # API服务层
│   ├── api/                 # API客户端
│   └── modules/             # 模块化API
├── i18n/                     # 国际化
│   ├── locales/             # 语言包
│   └── i18n.ts              # i18n配置
└── assets/                   # 静态资源
    └── images/              # 图片资源
```

## 🤝 贡献指南

### 开发流程

1. **Fork 项目**
2. **创建特性分支**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **提交更改**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **推送到分支**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **开启 Pull Request**

### 代码规范

#### 提交信息规范
使用 conventional commits 格式：
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

#### 分支命名规范
```
feature/功能名称      # 新功能开发
fix/问题描述        # Bug修复
hotfix/紧急修复      # 紧急修复
docs/文档更新       # 文档修改
```

### 测试要求

- 新增功能必须包含相应的单元测试
- 修改现有功能需要确保测试通过
- PR合并前必须通过所有自动化检查

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。