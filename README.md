# 在线视频会议 H5

基于 React 19 + Tailwind 4 + Vite 构建的在线视频会议 H5 应用，使用阿里云音视频服务提供实时音视频通信能力。

## 在线访问

```
https://mini.techx-world.com/html/meeting.html?memberId=10&meetingId=5
```

### URL 参数说明

| 参数        | 说明    | 示例 |
| ----------- | ------- | ---- |
| `memberId`  | 用户 ID | `10` |
| `meetingId` | 会议 ID | `5`  |

## 技术栈

- **框架**: React 19
- **构建工具**: Vite 7
- **样式**: Tailwind CSS 4
- **语言**: TypeScript 5
- **HTTP 客户端**: Axios
- **代码规范**: ESLint + Prettier

## 项目结构

```
h5-alimeeting/
├── src/
│   ├── api/           # API 接口
│   ├── components/    # React 组件
│   │   └── meeting/   # 会议相关组件
│   ├── styles/        # 样式文件
│   ├── types/         # TypeScript 类型定义
│   ├── utils/         # 工具函数
│   ├── App.tsx        # 应用入口
│   └── main.tsx       # React 挂载点
├── public/            # 静态资源
├── index.html         # HTML 模板
├── vite.config.ts     # Vite 配置
└── package.json       # 项目依赖
```

## 核心功能

### 会议流程

1. **参加会议** - 获取会议详情信息
2. **会议准备** - 会前准备与设备检测
3. **会议进行** - 进入会议室进行音视频通话

### 主要组件

- `MeetingAttend` - 会议加入
- `MeetingPreparation` - 会议准备
- `MeetingRoom` - 会议室主体
- `RoomUser` - 参会者展示

## 开发指南

### 安装依赖

```bash
yarn install
```

### 本地开发

```bash
yarn dev
```

访问 `http://localhost:5173/html/meeting.html?memberId=1&meetingId=12`

### 构建生产

```bash
yarn build
```

### 代码检查

```bash
# ESLint 检查
yarn lint

# Prettier 格式化
yarn format
```

### 预览构建

```bash
yarn preview
```

## 配置说明

### Vite 配置

- `base: '/html/'` - 部署子路径配置
- 路径别名 `@` 指向 `src` 目录

### 部署

构建后将 `dist` 目录内容部署至服务器 `/html/` 路径下。

## 浏览器支持

建议使用现代浏览器：

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

## 注意事项

- 需要配置阿里云音视频服务相关参数
- 确保浏览器支持 WebRTC
- 移动端需使用 HTTPS 协议访问
