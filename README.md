# Admin Dashboard

现代化的企业级管理后台系统，基于 React 19 + TypeScript 5 + Vite 7 + Ant Design 6 构建。

## 特性

- 🚀 **现代化技术栈** - React 19, TypeScript 5, Vite 7
- 🎨 **企业级UI** - Ant Design 6 组件库
- 🛠️ **完整架构** - 模块化设计，清晰的目录结构
- 🔧 **专业工具链** - Winston日志，Sentry错误追踪，Convict配置管理
- 🌐 **国际化支持** - 多语言(i18n)支持
- 📊 **性能监控** - 完整的性能和错误监控体系
- 🛡️ **安全保障** - 完善的安全机制和权限控制
- 🐳 **容器化部署** - Docker支持和CI/CD配置

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 10.0.0

### 安装依赖

```bash
pnpm install
```

### 环境配置

复制环境变量模板：

```bash
cp .env.example .env
```

根据需要修改 `.env` 文件中的配置。

### 开发模式

```bash
pnpm dev
```

访问 [http://localhost:5173](http://localhost:5173)

### 构建生产版本

```bash
pnpm build
```

### 代码检查

```bash
# 类型检查
pnpm type-check

# 代码规范检查
pnpm lint

# 自动修复代码规范问题
pnpm lint:fix
```

## 项目架构

```
src/
├── core/                 # 核心模块
│   ├── router/          # 路由配置
│   ├── store/           # 状态管理
│   └── providers/       # 全局提供者
├── features/            # 功能模块
│   ├── dashboard/       # 仪表板
│   ├── organization/    # 组织管理
│   └── user/           # 用户管理
├── shared/              # 共享资源
│   ├── components/      # 共享组件
│   ├── hooks/          # 共享Hooks
│   ├── utils/          # 工具函数
│   └── types/          # 共享类型
├── config/             # 配置文件
└── assets/             # 静态资源
```

## 技术亮点

### 配置管理
使用 Convict 进行类型安全的配置管理，支持环境变量覆盖。

### 日志系统
基于 Winston 构建的多传输日志系统，支持控制台、文件和远程日志。

### 错误追踪
集成 Sentry 进行实时错误监控和用户行为追踪。

### 性能监控
完整的性能指标收集和分析体系。

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t admin-dashboard .

# 运行容器
docker run -p 8080:80 admin-dashboard
```

### 环境变量

关键环境变量说明：

- `VITE_API_BASE_URL` - API服务地址
- `VITE_SENTRY_DSN` - Sentry监控DSN
- `VITE_GA_ID` - Google Analytics ID
- `VITE_LOG_LEVEL` - 日志级别

## 开发规范

- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 和 Prettier 代码规范
- 组件采用函数式组件和 Hooks
- 状态管理使用 Redux Toolkit
- 样式使用 CSS Modules

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License
