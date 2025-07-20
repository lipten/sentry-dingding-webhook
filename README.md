# Sentry to DingDing Webhook

一个用于将 Sentry 告警转发到钉钉机器人的 Netlify Functions 服务。

## 功能特性

- 🚨 接收 Sentry 告警消息
- 📱 格式化消息并发送到钉钉机器人
- 🌐 支持 CORS，可跨域调用
- ⚡ 基于 Netlify Functions，快速部署
- 🎨 美观的 Markdown 格式消息
- 🔧 支持自定义环境变量配置

## 快速开始

### 1. 部署到 Netlify

#### 方法一：通过 Git 部署

1. 将代码推送到 GitHub/GitLab
2. 在 Netlify 中连接你的仓库
3. 设置构建配置：
   - Build command: `npm run build`
   - Publish directory: `public`
   - Functions directory: `netlify/functions`

#### 方法二：直接上传

1. 下载项目代码
2. 在 Netlify 控制台中选择 "Deploy manually"
3. 上传项目文件夹

### 2. 配置环境变量

在 Netlify 控制台的 "Site settings" → "Environment variables" 中添加：

```
DINGDING_WEBHOOK_URL=https://oapi.dingtalk.com/robot/send?access_token=YOUR_TOKEN
```

### 3. 获取钉钉机器人 Webhook URL

1. 在钉钉群中添加自定义机器人
2. 选择 "自定义" 类型
3. 复制生成的 Webhook URL
4. 将 URL 设置为环境变量 `DINGDING_WEBHOOK_URL`

### 4. 配置 Sentry Webhook

1. 进入 Sentry 项目设置
2. 选择 "Integrations" → "Webhooks"
3. 添加新的 Webhook，URL 设置为：
   ```
   https://your-site.netlify.app/webhook
   ```
4. 选择需要触发的事件类型

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 测试 Webhook

```bash
curl -X POST http://localhost:8888/.netlify/functions/sentry-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "environment": "production",
    "project": {"name": "test-project"},
    "level": "error",
    "datetime": "2024-01-01T12:00:00Z",
    "url": "https://sentry.io/organizations/your-org/issues/123",
    "message": "Test error message",
    "culprit": "test.js:1:1"
  }'
```

## 消息格式

发送到钉钉的消息包含以下信息：

- 🚨 告警标题和级别
- 📍 环境信息
- 🏷️ 项目名称
- ⏰ 时间戳
- 🔍 错误详情
- 👤 用户信息（如果有）
- 🏷️ 相关标签
- 🔗 查看详情链接

## 项目结构

```
sentry-dingding-webhook/
├── netlify/
│   └── functions/
│       └── sentry-webhook.js    # 主要的 webhook 处理函数
├── public/
│   └── index.html              # 项目首页
├── package.json                # 项目依赖
├── netlify.toml               # Netlify 配置
└── README.md                  # 项目说明
```

## 环境变量

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `DINGDING_WEBHOOK_URL` | 钉钉机器人 Webhook URL | 是 |

## 故障排除

### 常见问题

1. **消息发送失败**
   - 检查 `DINGDING_WEBHOOK_URL` 环境变量是否正确设置
   - 确认钉钉机器人 Webhook URL 有效
   - 查看 Netlify Functions 日志

2. **CORS 错误**
   - 服务已配置 CORS 头，支持跨域请求
   - 如果仍有问题，检查请求来源

3. **函数超时**
   - 默认超时时间为 10 秒
   - 如果网络较慢，可能需要调整超时设置

### 查看日志

在 Netlify 控制台的 "Functions" 页面可以查看函数执行日志。

## 许可证

MIT License 