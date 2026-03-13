# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在本代码仓库中工作时提供指导。

## 常用命令

```bash
# 开发
pnpm dev              # 启动开发服务器 http://localhost:5173
pnpm build            # 生产环境构建
pnpm preview          # 本地预览生产构建

# 代码质量
pnpm type-check       # TypeScript 类型检查
pnpm lint             # ESLint 检查
pnpm lint:fix         # ESLint 自动修复
pnpm clean            # 清理 dist, .vite 缓存, logs

# 依赖
pnpm install          # 安装依赖（克隆项目后执行）
```

## 项目架构

这是一个基于 React 19 + TypeScript 5 + Vite 7 + Ant Design 6 构建的企业级管理后台系统。

### 路径别名 (vite.config.ts)

- `@` → `./src`
- `@shared` → `./src/shared`
- `@pages` → `./src/pages`
- `@config` → `./src/config`
- `@core` → `./src/core`
- `@assets` → `./src/assets`

### 目录结构

```
src/
├── core/                  # 核心应用基础设施
│   ├── providers/        # React Context 提供者 (主题、认证、Antd)
│   ├── router/           # 路由系统（包含守卫和权限过滤）
│   │   ├── config/routes.ts  # 路由定义（包含权限）
│   │   └── guards/           # AuthGuard, GuestRoute 组件
│   └── store/            # Redux Toolkit 状态管理
│       ├── slices/           # Redux 切片 (auth, theme, user, org, ui)
│       └── thunks/           # 异步操作 (authThunks.ts)
├── pages/                # 功能页面（懒加载）
│   ├── dashboard/        # 仪表板页面
│   ├── login/            # 登录页面
│   ├── register/         # 注册页面
│   ├── organization/      # 组织管理
│   ├── organization-type/ # 组织类型配置
│   ├── role/             # 角色管理
│   └── user/             # 用户管理
├── components/           # 应用级组件
│   ├── layouts/          # BaseLayout, SiderMenu, SiderHeader, SiderFooter
│   ├── Form*             # 表单包装组件 (Input, Select, Button 等)
│   ├── Modal/            # 模态框包装器
│   ├── Permission/       # 权限控制组件
│   └── ThemeSwitcher/    # 主题切换 UI
├── services/             # API 层
│   ├── api/              # Axios 客户端（拦截器和 token 刷新）
│   └── modules/          # 功能特定的 API 服务 (auth, organization)
├── shared/               # 共享工具和类型
│   ├── components/       # ErrorBoundary, GlobalLoading, ColorPreview
│   ├── hooks/            # 自定义 Hooks (useTheme, usePermission, useMonitoring)
│   ├── utils/            # 工具函数 (SecurityUtils, ModernLogger 等)
│   ├── types/            # 共享 TypeScript 类型
│   ├── constants/        # 常量（包括权限码）
│   └── styles/           # 全局样式
├── config/               # 配置文件（主题、错误追踪）
├── i18n/                 # 国际化（5种语言：zh-CN, en-US, de-DE, it-IT, ja-JP）
└── assets/               # 静态资源（包括语言包 JSON 文件）
```

### 核心架构模式

**1. 基于权限的路由**
- 路由在 `src/core/router/config/routes.ts` 中定义，包含权限码
- `filterRoutesByPermission()` 根据用户权限过滤可访问的路由
- `ProtectedRoute` 组件保护已认证页面
- `GuestRoute` 组件防止已登录用户访问认证页面

**2. 状态管理 (Redux Toolkit)**
- 切片：`authSlice`, `themeSlice`, `userSlice`, `organizationSlice`, `uiSlice`
- Thunks：异步操作如登录/登出在 `authThunks.ts` 中
- Store 在 `src/core/store/index.ts` 中配置

**3. API 层**
- `apiClient`（位于 `src/services/api/client.ts`）处理所有 HTTP 请求
- 自动从 localStorage 注入 Bearer token
- 401 响应自动触发 token 刷新
- 统一的错误处理和模态框通知

**4. 主题系统**
- `ThemeContext` 为整个应用提供主题状态
- 浅色/深色模式，支持 5 种配色方案（蓝、绿、紫、橙、红）
- 使用 `useUnifiedTheme()` hook 进行主题管理
- 与 Ant Design 主题提供者集成

**5. 国际化 (i18n)**
- 使用 i18next 和 react-i18next
- 5 种支持语言：zh-CN, en-US, de-DE, it-IT, ja-JP
- 语言包缓存管理器
- 本地 JSON 降级方案位于 `src/assets/locales/`

**6. 路由代码分割**
- 所有页面组件使用 React.lazy() 懒加载
- 在 `routes.ts` 配置中定义

### 重要开发注意事项

**导入顺序（ESLint 强制执行）**
1. React 及相关库 (react, react-dom, react-router-dom, react-redux)
2. 第三方库
3. 图片资源 (@/assets/images/)
4. 绝对路径别名 (@/, @shared 等)
5. 相对路径 (./, ../)
6. 样式文件 (*.css, *.scss)

**表单组件**
- 存在自定义的表单包装组件用于常见的 Ant Design 表单项
- 位于 `src/components/Form*` (FormInput, FormSelect, FormButton 等)
- 这些组件封装了 Ant Design 组件并提供统一样式和验证

**认证流程**
- Token 存储在 localStorage (accessToken, refreshToken)
- API 客户端自动注入 Bearer token
- 401 响应通过 refresh token 自动触发 token 刷新
- 认证状态在 authSlice 中管理

**权限**
- 权限码定义在 `src/shared/constants/permissions.ts`
- 使用 `usePermission()` 或 `useHasPermission()` hooks 检查权限
- `Permission` 组件用于渲染条件内容
