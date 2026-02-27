# PNPM 开发指南

## 项目概述
这是一个使用 PNPM 管理的现代化后台管理平台，基于 React + TypeScript + Vite 构建。

## 环境要求
- Node.js >= 18.0.0
- PNPM >= 10.0.0

## 常用命令

### 开发相关
```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 类型检查
pnpm type-check

# 代码检查
pnpm lint
```

### 依赖管理
```bash
# 安装所有依赖
pnpm install

# 添加新依赖
pnpm add <package-name>

# 添加开发依赖
pnpm add -D <package-name>

# 移除依赖
pnpm remove <package-name>

# 更新依赖到最新版本
pnpm deps:update

# 检查过期依赖
pnpm deps:check

# 清理构建缓存
pnpm clean
```

## 项目结构
```
src/
├── components/           # React组件
│   ├── Layout/          # 布局组件
│   └── Dashboard/       # 仪表板组件
├── config/             # 配置文件
│   ├── i18n.ts         # 国际化配置
│   └── theme.ts        # 主题配置
├── hooks/              # 自定义Hooks
├── styles/             # 样式文件
├── utils/              # 工具函数
└── types/              # TypeScript类型定义
```

## 技术栈
- **构建工具**: Vite 7.x
- **包管理器**: PNPM 10.x
- **框架**: React 19.x + TypeScript 5.x
- **UI库**: Ant Design 6.x
- **样式**: Tailwind CSS 4.x + CSS Modules
- **国际化**: i18next + react-i18next
- **图表**: Recharts 3.x

## 特性
✅ 组件与逻辑文件分离（TSX/TS）
✅ 国际化支持（云端语言包 + 本地缓存）
✅ 主题切换（Ant Design主题系统）
✅ REM响应式适配
✅ Tailwind + CSS Modules混合使用
✅ 首屏加载优化
✅ 类型安全

## 注意事项
1. 所有样式必须使用CSS Modules，避免全局污染
2. 组件文件使用.tsx扩展名，逻辑文件使用.ts扩展名
3. 国际化资源从云端加载，具有本地缓存机制
4. 使用REM单位进行响应式设计
5. 主题配置基于Ant Design的themeConfig