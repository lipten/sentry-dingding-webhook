# 部署指南

## 项目概述

这是一个用于将 Sentry 告警转发到钉钉机器人的 Netlify Functions 项目。项目已经配置完成，可以直接部署到 Netlify。

## 部署步骤

### 1. 准备钉钉机器人

1. 在钉钉群中添加自定义机器人：
   - 进入钉钉群 → 群设置 → 智能群助手 → 添加机器人 → 自定义
   - 设置机器人名称和头像
   - 复制生成的 Webhook URL

2. 钉钉机器人 Webhook URL 格式：
   ```
   https://oapi.dingtalk.com/robot/send?access_token=YOUR_ACCESS_TOKEN
   ```

### 2. 部署到 Netlify

#### 方法一：通过 Git 仓库部署（推荐）

1. **创建 Git 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **推送到 GitHub/GitLab**
   ```bash
   git remote add origin https://github.com/your-username/sentry-dingding-webhook.git
   git push -u origin main
   ```

3. **在 Netlify 中部署**
   - 访问 [Netlify](https://app.netlify.com/)
   - 点击 "New site from Git"
   - 选择你的 Git 提供商（GitHub/GitLab）
   - 选择 `sentry-dingding-webhook` 仓库
   - 设置构建配置：
     - Build command: `npm run build`
     - Publish directory: `public`
   - 点击 "Deploy site"

#### 方法二：直接上传部署

1. **打包项目**
   ```bash
   # 确保在项目根目录
   cd /Users/lipten/works/sentry-dingding-webhook
   
   # 创建部署包
   tar -czf sentry-dingding-webhook.tar.gz \
     --exclude=node_modules \
     --exclude=.git \
     --exclude=.netlify \
     .
   ```

2. **在 Netlify 中上传**
   - 访问 [Netlify](https://app.netlify.com/)
   - 点击 "New site from Git" → "Deploy manually"
   - 拖拽项目文件夹或上传压缩包
   - 设置构建配置（同上）

### 3. 配置环境变量

部署完成后，在 Netlify 控制台中配置环境变量：

1. 进入站点设置：`Site settings` → `Environment variables`
2. 添加环境变量：
   - **Key**: `DINGDING_WEBHOOK_URL`
   - **Value**: 你的钉钉机器人 Webhook URL
3. 点击 "Save"

### 4. 获取 Webhook 端点

部署完成后，你的 Webhook 端点将是：
```
https://your-site-name.netlify.app/webhook
```

### 5. 配置 Sentry

1. **进入 Sentry 项目设置**
   - 登录 [Sentry](https://sentry.io/)
   - 选择你的项目

2. **配置 Webhook**
   - 进入 `Settings` → `Integrations` → `Webhooks`
   - 点击 "Add integration"
   - 选择 "Webhooks"
   - 配置 Webhook：
     - **URL**: `https://your-site-name.netlify.app/webhook`
     - **Events**: 选择需要触发的事件（如 Error、Warning 等）
   - 保存配置

## 测试部署

### 1. 测试 Webhook 端点

使用 curl 命令测试：

```bash
curl -X POST https://your-site-name.netlify.app/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "environment": "production",
    "project": {"name": "test-project"},
    "level": "error",
    "datetime": "2024-01-01T12:00:00Z",
    "url": "https://sentry.io/organizations/your-org/issues/123",
    "message": "Test error message",
    "culprit": "test.js:1:1",
    "user": {
      "id": "12345",
      "email": "test@example.com"
    },
    "tags": {
      "release": "v1.0.0",
      "browser": "Chrome"
    }
  }'
```

### 2. 检查钉钉消息

如果配置正确，你应该能在钉钉群中看到格式化的告警消息。

### 3. 查看函数日志

在 Netlify 控制台的 `Functions` 页面可以查看函数执行日志，帮助调试问题。

## 故障排除

### 常见问题

1. **环境变量未设置**
   - 错误：`DingDing webhook URL not configured`
   - 解决：检查 Netlify 环境变量配置

2. **钉钉 Webhook URL 无效**
   - 错误：网络请求失败
   - 解决：检查钉钉机器人 Webhook URL 是否正确

3. **CORS 错误**
   - 错误：跨域请求被阻止
   - 解决：函数已配置 CORS 头，检查请求来源

4. **函数超时**
   - 错误：请求超时
   - 解决：检查网络连接，函数默认 10 秒超时

### 调试技巧

1. **查看函数日志**
   - Netlify 控制台 → Functions → 查看执行日志

2. **本地测试**
   ```bash
   npx netlify dev
   ```

3. **检查环境变量**
   - 确保 `DINGDING_WEBHOOK_URL` 已正确设置

## 自定义配置

### 修改消息格式

编辑 `netlify/functions/sentry-webhook.js` 中的 `formatSentryMessage` 函数来自定义消息格式。

### 添加更多字段

可以在消息中添加更多 Sentry 数据字段，如：
- 堆栈跟踪
- 面包屑导航
- 上下文信息

### 安全配置

1. **添加认证**
   - 在函数中添加 API 密钥验证
   - 验证请求来源

2. **限制访问**
   - 配置 IP 白名单
   - 添加请求频率限制

## 维护

### 更新部署

1. 修改代码后推送到 Git 仓库
2. Netlify 会自动重新部署

### 监控

1. 定期检查 Netlify 函数日志
2. 监控钉钉消息发送状态
3. 设置告警通知

## 支持

如果遇到问题，可以：
1. 查看 Netlify 函数日志
2. 检查钉钉机器人配置
3. 验证 Sentry Webhook 设置 