# 部署指南

## 环境要求

- Node.js >= 18
- pnpm >= 8
- Docker (可选)

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建项目
pnpm run build
```

## 生产部署

### 方法一：直接部署

```bash
# 构建生产版本
pnpm run build:production

# 预览构建结果
pnpm run preview:dist
```

### 方法二：Docker 部署

```bash
# 构建镜像
docker build -t admin-dashboard .

# 运行容器
docker run -d -p 80:80 --name admin-dashboard admin-dashboard
```

### 方法三：云平台部署

#### Vercel 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

#### Netlify 部署

在 Netlify 控制台中：
1. 连接 Git 仓库
2. 设置构建命令：`pnpm run build`
3. 设置发布目录：`dist`

## 环境变量配置

创建 `.env.production` 文件：

```bash
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_LOG_ENDPOINT=https://log.yourdomain.com
VITE_APM_SERVER=https://apm.yourdomain.com
VITE_GA_ID=GA-XXXXXXXXX
VITE_SENTRY_DSN=https://xxxxxxxx@sentry.io/xxxxxx
```

## CI/CD 配置

### GitHub Actions 示例

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
      run: pnpm run build:production
      env:
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
        
    - name: Deploy to S3
      run: |
        aws s3 sync dist/ s3://your-bucket-name/ --delete
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## 监控和日志

### 性能监控

构建后的应用会自动包含：
- 页面加载性能监控
- 用户交互延迟监控
- 资源加载监控

### 错误追踪

集成 Sentry 错误追踪：
- JavaScript 错误自动捕获
- Promise 拒绝错误追踪
- React 组件错误边界

## 安全配置

### CSP 配置

默认启用严格的内容安全策略：
- 限制脚本来源
- 限制样式来源
- 限制图片和字体来源

### 其他安全措施

- CSRF 保护
- XSS 防护
- 点击劫持防护
- 严格的传输安全

## 缓存策略

### 浏览器缓存

- 静态资源缓存 1 年
- HTML 文件不缓存
- Service Worker 缓存支持

### CDN 缓存

推荐使用 CDN 加速：
- Cloudflare
- AWS CloudFront
- 阿里云 CDN

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本
   - 清理 node_modules 重新安装

2. **部署后白屏**
   - 检查路由配置
   - 确认静态资源路径正确

3. **API 请求失败**
   - 检查环境变量配置
   - 确认 CORS 设置

### 调试工具

- 浏览器开发者工具
- React DevTools
- Redux DevTools
- 网络面板监控

## 版本管理

使用语义化版本管理：
- MAJOR: 不兼容的 API 更改
- MINOR: 向后兼容的功能新增
- PATCH: 向后兼容的问题修复

## 回滚策略

- 保留最近 3 个版本的构建产物
- 使用蓝绿部署减少停机时间
- 准备应急回滚脚本