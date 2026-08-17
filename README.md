# 智能旅游助手 Travel-Assistant

> 基于 AI 大模型的智能旅游行程规划与对话咨询系统

用户输入目的地、预算和天数后，由大语言模型（LLM）生成结构化的详细旅行行程；同时支持与 AI 进行 SSE 流式实时对话，咨询任意旅游相关问题。

---

## 目录

- [项目简介](#项目简介)
- [项目结构](#项目结构)
- [技术栈](#技术栈)
- [核心功能](#核心功能)
- [快速开始](#快速开始)
- [环境变量配置](#环境变量配置)
- [API 接口文档](#api-接口文档)
- [前端页面说明](#前端页面说明)
- [组件说明](#组件说明)
- [数据结构](#数据结构)
- [构建与部署](#构建与部署)
- [常见问题](#常见问题)

---

## 项目简介

智能旅游助手是一个前后端分离的 AI 应用项目，旨在为用户提供个性化的旅游规划服务。项目由两部分组成：

- **travel-h5**：移动端 H5 前端应用，基于 Vue 3 + Vant 4 构建，提供友好的用户交互界面
- **travel-server**：后端服务，基于 Node.js + Express + LangChain，封装大模型调用逻辑，对外提供行程规划与 AI 对话接口

### 核心价值

- 🤖 **AI 驱动**：基于大语言模型生成结构化行程，避免传统模板生成的千篇一律
- ⚡ **流式响应**：AI 对话采用 SSE（Server-Sent Events）实时推送，逐字输出体验流畅
- 📱 **移动优先**：基于 Vant 组件库，专为移动端 H5 场景设计
- 🔌 **多模型支持**：可在 SiliconFlow 与 DeepSeek 之间自由切换

---

## 项目结构

```
travel/
├── travel-h5/                        # 前端 Vue 3 H5 应用
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/                   # 静态资源
│   │   │   ├── hero.png
│   │   │   ├── vite.svg
│   │   │   └── vue.svg
│   │   ├── components/               # 公共组件
│   │   │   ├── BudgetTable.vue       # 预算明细表
│   │   │   ├── ChatBubble.vue        # 聊天气泡（含 Markdown 解析）
│   │   │   └── SpotItem.vue          # 景点信息项
│   │   ├── router/
│   │   │   └── index.js              # 路由配置
│   │   ├── styles/
│   │   │   └── common.css            # 全局样式
│   │   ├── utils/
│   │   │   └── request.js            # Axios 封装 + Fetch 流式请求
│   │   ├── views/                    # 页面视图
│   │   │   ├── Home.vue              # 首页（行程规划表单）
│   │   │   ├── Detail.vue            # 行程详情页
│   │   │   ├── Chat.vue              # AI 对话页
│   │   │   └── Profile.vue           # 个人中心
│   │   ├── App.vue
│   │   └── main.js
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── travel-server/                    # 后端 Node.js 服务
│   ├── src/
│   │   ├── routes/
│   │   │   └── travel.js             # 路由定义
│   │   ├── service/
│   │   │   └── travelService.js      # 业务逻辑（LLM 调用封装）
│   │   ├── utils/
│   │   │   └── streamUtils.js        # SSE 流式响应工具
│   │   └── index.js                  # 应用入口
│   ├── .env                          # 环境变量（不提交，含密钥）
│   ├── .env-example                  # 环境变量示例
│   ├── nodemon.json                  # 热重载配置
│   └── package.json
└── README.md
```

---

## 技术栈

### 前端 travel-h5

| 技术 | 版本 | 说明 |
| --- | --- | --- |
| Vue 3 | ^3.5.40 | 渐进式 JavaScript 框架（使用 `<script setup>` 语法） |
| Vite | ^8.2.0 | 下一代前端构建工具 |
| Vue Router | ^4.3.0 | 官方路由管理器 |
| Vant | ^4.10.0 | 轻量、可靠的移动端 Vue 组件库 |
| @vant/auto-import-resolver | ^1.3.0 | Vant 组件按需自动引入 |
| unplugin-vue-components | ^32.1.0 | 组件自动注册插件 |
| Axios | ^1.19.0 | HTTP 请求库（用于普通接口） |
| Fetch API | - | 原生 API（用于 SSE 流式接口） |

### 后端 travel-server

| 技术 | 版本 | 说明 |
| --- | --- | --- |
| Node.js | >= 18 | JavaScript 运行时 |
| Express | ^4.19.2 | Web 应用框架 |
| @langchain/openai | ^1.5.7 | LangChain OpenAI 兼容接口 |
| @langchain/core | ^1.2.7 | LangChain 核心库 |
| dotenv | ^16.4.5 | 环境变量加载 |
| cors | ^2.8.6 | 跨域资源共享中间件 |
| nodemon | ^3.1.14 | 开发热重载工具 |

### 大模型支持

通过环境变量 `MODEL_PROVIDER` 切换：

| Provider | 默认模型 | 接入方式 |
| --- | --- | --- |
| `SILICONFLOW` | Qwen/Qwen3.6-35B-A3B | OpenAI 兼容接口 |
| `DEEPSEEK` | deepseek-chat | OpenAI 兼容接口 |

---

## 核心功能

### 1. 智能行程规划

用户在首页填写目的地、预算、天数，后端调用大模型生成结构化行程 JSON：

- 每日**上午 / 下午 / 晚上**三个时段的活动安排
- 每个景点包含**名称、游览时长、门票价格、交通方式、详细介绍**
- **预算明细**：住宿、餐饮、交通、门票、其他
- **温馨提示** 与 **注意事项** 列表

### 2. AI 流式对话

- 基于 SSE（Server-Sent Events）的流式响应
- 前端逐字渲染 AI 回复，模拟打字机效果
- 支持常见问题快捷提问
- 聊天气泡内置轻量级 Markdown 解析器（支持标题、加粗、斜体、列表、代码）

### 3. 热门目的地

内置 17 个国内热门城市可选，含 8 个快捷选择标签：

```
北京、上海、广州、深圳、成都、杭州、西安、重庆
```

### 4. 行程详情展示

- 折叠面板（Collapse）按天展示行程
- 预算明细表格
- 景点信息卡片（时长、门票、交通图标直观展示）
- 一键跳转 AI 对话咨询该城市详情

---

## 快速开始

### 前置要求

- Node.js >= 18
- npm >= 9 （或使用 pnpm / yarn）
- SiliconFlow 或 DeepSeek 的 API Key

### 1. 启动后端服务

```bash
cd travel-server

# 安装依赖
npm install

# 复制环境变量示例并配置
cp .env-example .env
# 编辑 .env 填入真实 API Key

# 启动开发服务（支持热重载）
npm run dev
```

服务默认运行于 `http://localhost:3300`。

### 2. 启动前端应用

```bash
cd travel-h5

# 安装依赖
npm install

# 启动开发服务
npm run dev
```

前端默认运行于 Vite 提供的本地地址（如 `http://localhost:5173`）。

### 3. 访问应用

浏览器打开前端开发地址，即可使用全部功能。

> ⚠️ 前端请求 baseURL 默认指向 `http://127.0.0.1:3300/api/travel`，请确保后端服务已先启动。

---

## 环境变量配置

后端环境变量位于 `travel-server/.env`，参考示例文件 `.env-example`：

```env
# 服务配置
PORT=3300

# 大模型的配置
MODEL_PROVIDER=SILICONFLOW

# SiliconFlow（默认）
SILICONFLOW_API_KEY=your_siliconflow_api_key
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
SILICONFLOW_MODEL=Qwen/Qwen3.6-35B-A3B

# DeepSeek（备选）
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.cn/v1
DEEPSEEK_MODEL=deepseek-chat
```

| 变量名 | 说明 |
| --- | --- |
| `PORT` | 后端服务端口 |
| `MODEL_PROVIDER` | 大模型提供方：`SILICONFLOW` 或 `DEEPSEEK` |
| `*_API_KEY` | 对应平台的 API Key |
| `*_BASE_URL` | 对应平台的 API 基础地址 |
| `*_MODEL` | 使用的具体模型名称 |

> 🔒 安全提示：`.env` 文件已加入 `.gitignore`，请勿提交到 Git 仓库。

---

## API 接口文档

### 基础信息

- Base URL：`http://localhost:3300/api/travel`
- 请求格式：`application/json`
- 跨域：已通过 `cors` 中间件允许所有来源跨域

### 1. 生成行程规划

**接口**：`POST /api/travel/recommend`

**请求参数**：

```json
{
  "city": "北京",
  "budget": 5000,
  "days": 3
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| city | string | 是 | 目的地城市 |
| budget | number | 是 | 预算金额（元，>= 100） |
| days | number | 是 | 旅行天数（1-30） |

**响应示例**：

```json
{
  "success": true,
  "city": "北京",
  "days": 3,
  "totalBudget": 5000,
  "dailyItinerary": [
    {
      "day": 1,
      "date": "第1天",
      "morning": {
        "spot": "故宫",
        "duration": "3小时",
        "ticket": "60元",
        "transportation": "地铁1号线天安门东站",
        "description": "故宫又称紫禁城..."
      },
      "afternoon": { ... },
      "evening": { ... }
    }
  ],
  "budgetBreakdown": {
    "accommodation": 1500,
    "food": 1000,
    "transportation": 800,
    "tickets": 1200,
    "other": 500
  },
  "tips": ["建议提前在网上预约门票", ...],
  "warnings": ["节假日人流量大，注意保管财物", ...]
}
```

### 2. AI 流式对话

**接口**：`POST /api/travel/chat`

**请求参数**：

```json
{
  "message": "北京有哪些必去的景点？"
}
```

**响应**：`text/event-stream`（SSE 流式）

每条数据格式为 `data: {JSON}\n\n`，包含以下类型：

| type | 说明 |
| --- | --- |
| `chunk` | 流式片段，字段 `content` 为本次增量内容 |
| `complete` | 流式结束，字段 `data` 为完整响应对象 |
| `error` | 错误信息 |

**前端消费示例**：

```javascript
fetchStream('chat', { message: '你好' },
  (chunk) => { /* 收到增量内容 */ },
  (data) => { /* 流式结束 */ },
  (err) => { /* 错误处理 */ }
)
```

### 3. 健康检查

**接口**：`POST /heartbeat`

用于快速验证服务是否正常运行。

---

## 前端页面说明

### 路由配置

| 路由路径 | 名称 | 页面组件 | 说明 |
| --- | --- | --- | --- |
| `/` | Home | Home.vue | 首页：行程规划表单 |
| `/detail` | Detail | Detail.vue | 行程详情展示 |
| `/chat` | Chat | Chat.vue | AI 对话 |
| `/profile` | Profile | Profile.vue | 个人中心 |

### 页面详解

#### 🏠 Home 首页

- 行程规划表单：目的地选择（Picker）、预算输入、天数输入
- 表单校验：城市必选、预算 >= 100、天数 1-30
- 热门目的地快捷标签（8 个城市）
- 快捷入口：AI 对话、个人中心

#### 📋 Detail 行程详情

- 加载状态、错误重试机制
- 行程概览卡片（城市、天数、预算）
- 按天折叠面板（上午 / 下午 / 晚上时段区分颜色）
- 预算明细表格
- 温馨提示与注意事项列表
- 底部固定按钮：咨询 AI 助手（带城市上下文跳转）

#### 💬 Chat AI 对话

- 流式渲染 AI 回复，模拟打字机效果
- "AI 正在思考中..." 加载指示器
- 常见问题快捷标签
- 聊天容器自动滚动到底部
- 错误提示 Toast

#### 👤 Profile 个人中心

- 用户信息展示（头像、昵称）
- 功能菜单：我的收藏、历史记录、设置（开发中）
- 关于我们对话框
- 版本信息

---

## 组件说明

### BudgetTable 预算明细表

展示行程预算明细，支持中英文键名映射：

```vue
<BudgetTable :data="tripData.budgetBreakdown" :total="tripData.totalBudget" />
```

| Prop | 类型 | 说明 |
| --- | --- | --- |
| data | Object | 预算明细对象 |
| total | Number/String | 总预算 |

字段映射：`accommodation` → 住宿、`food` → 餐饮、`transportation` → 交通、`tickets` → 门票、`other` → 其他。

### ChatBubble 聊天气泡

支持用户与 AI 双向消息展示，AI 消息内置轻量级 Markdown 解析：

```vue
<ChatBubble :message="msg" />
```

| Prop | 类型 | 说明 |
| --- | --- | --- |
| message | Object | 消息对象（含 role、content、timestamp） |

内置 Markdown 解析支持：
- 标题 `# ~ ######`
- 加粗 `**text**`
- 斜体 `*text*`
- 行内代码 `` `code` ``
- 无序列表 `- item` / `* item`
- 有序列表 `1. item`
- 自动转义 HTML 防 XSS

### SpotItem 景点信息项

展示单个景点/活动的详细信息：

```vue
<SpotItem :data="day.morning" />
```

| Prop | 类型 | 说明 |
| --- | --- | --- |
| data | Object | 景点数据 |

展示字段：名称、时长（时钟图标）、门票（票图标）、交通（物流图标）、描述。

---

## 数据结构

### 行程规划响应结构

```typescript
interface TripRecommendation {
  success: boolean
  city: string
  days: number
  totalBudget: number
  dailyItinerary: DailyItinerary[]
  budgetBreakdown: BudgetBreakdown
  tips: string[]
  warnings: string[]
}

interface DailyItinerary {
  day: number
  date: string
  morning: SpotDetail
  afternoon: SpotDetail
  evening: SpotDetail
}

interface SpotDetail {
  spot: string
  duration: string
  ticket: string
  transportation: string
  description: string
}

interface BudgetBreakdown {
  accommodation: number
  food: number
  transportation: number
  tickets: number
  other: number
}
```

### 聊天消息结构

```typescript
interface ChatMessage {
  id: number
  role: 'user' | 'ai'
  content: string
  timestamp: string  // ISO 8601
}
```

### SSE 流式数据格式

```
data: {"type":"chunk","content":"你好"}

data: {"type":"chunk","content":"，请问"}

data: {"type":"complete","data":{"success":true,"reply":"你好，请问..."}}

event: end
data: {"done": true}
```

---

## 构建与部署

### 前端构建

```bash
cd travel-h5

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

构建产物输出至 `travel-h5/dist/`，可部署至任意静态文件服务器（Nginx、Vercel、Netlify、GitHub Pages 等）。

### 后端部署

```bash
cd travel-server

# 安装依赖（生产环境）
npm install --production

# 启动服务
npm start
```

建议使用 [PM2](https://pm2.keymetrics.io/) 进行进程管理：

```bash
npm install -g pm2
pm2 start src/index.js --name travel-server
pm2 save
pm2 startup
```

### Nginx 反向代理示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态资源
    location / {
        root /var/www/travel-h5/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://localhost:3300;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        # SSE 必需配置
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 300s;
    }
}
```

> ⚠️ SSE 流式接口必须配置 `proxy_buffering off;`，否则响应会被 Nginx 缓冲导致流式失效。

---

## 常见问题

### Q1：AI 对话没有流式效果，全部一次性返回？

**原因**：Nginx 或代理服务器开启了响应缓冲。

**解决**：在 Nginx 配置中添加 `proxy_buffering off;` 和 `proxy_cache off;`。

### Q2：行程规划接口返回 JSON 解析失败？

**原因**：大模型返回的内容未严格遵循 JSON 格式。

**解决**：后端 `travelService.js` 已实现多种 JSON 提取正则匹配（``` ```json ``` 代码块、``` ``` ``` 代码块、裸 JSON），若仍失败会返回 `success: false` 与原始响应供调试。可尝试更换模型或调整提示词。

### Q3：前端请求跨域失败？

**原因**：开发环境前后端端口不同。

**解决**：后端已通过 `cors` 中间件允许所有来源跨域，正常情况下无需额外配置。若仍失败，检查是否有反向代理拦截了 `OPTIONS` 预检请求。

### Q4：如何切换大模型？

修改 `travel-server/.env` 中的 `MODEL_PROVIDER` 值为 `SILICONFLOW` 或 `DEEPSEEK`，重启服务即可。

### Q5：API Key 暴露了怎么办？

1. 立即到对应平台控制台吊销并重新生成 Key
2. 更新 `.env` 中的 Key
3. 若 Key 已提交到 Git 历史，使用 `git filter-repo` 清理：
   ```bash
   pip install git-filter-repo
   git filter-repo --path travel-server/.env --invert-paths
   git push origin --force --all
   ```

### Q6：本地启动后访问不到接口？

检查清单：
- 后端是否启动：`curl http://localhost:3300/heartbeat`
- 端口是否被占用：`netstat -ano | findstr 3300`
- 防火墙是否放行端口
- 前端 `request.js` 中 baseURL 是否与后端实际地址一致

---

## 许可证

本项目仅用于学习交流，不得用于商业用途。

## 致谢

- [Vue.js](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Vant](https://vant-ui.github.io/vant/)
- [Express](https://expressjs.com/)
- [LangChain](https://js.langchain.com/)
- [SiliconFlow](https://siliconflow.cn/)
- [DeepSeek](https://www.deepseek.com/)
