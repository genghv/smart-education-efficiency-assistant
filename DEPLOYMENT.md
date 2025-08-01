# 部署指南

## 部署前检查清单

### 1. 代码检查
- [ ] 运行 `npm run build` 确保构建成功
- [ ] 检查所有页面是否正常加载
- [ ] 测试倒计时动画功能
- [ ] 验证SEO优化是否生效

### 2. 环境配置
- [ ] 更新 `app/layout.tsx` 中的域名配置
- [ ] 更新 `public/sitemap.xml` 中的域名
- [ ] 更新 `public/robots.txt` 中的域名

### 3. 部署方案

#### 方案A：Vercel（推荐）
1. 注册 Vercel 账号：https://vercel.com
2. 连接 GitHub 仓库
3. 导入项目，Vercel 会自动检测 Next.js
4. 部署完成，获得域名

#### 方案B：传统服务器
1. 在服务器上安装 Node.js 18+
2. 上传项目文件
3. 运行 `npm install`
4. 运行 `npm run build`
5. 运行 `npm start`
6. 配置 Nginx 反向代理

### 4. 生产环境优化
- [ ] 启用 HTTPS
- [ ] 配置 CDN
- [ ] 设置监控和日志
- [ ] 配置备份策略

### 5. SEO 和监控
- [ ] 提交 sitemap 到搜索引擎
- [ ] 配置 Google Analytics
- [ ] 设置错误监控
- [ ] 测试页面加载速度

## 常见问题解决

### 1. 构建失败
- 检查依赖版本兼容性
- 清理 node_modules 重新安装
- 检查 TypeScript 错误

### 2. 运行时错误
- 检查环境变量配置
- 验证 API 端点
- 检查浏览器兼容性

### 3. 性能问题
- 启用 gzip 压缩
- 优化图片大小
- 使用 CDN 加速 