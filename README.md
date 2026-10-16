# Quiz 后台管理系统

基于 **Vue 2 + Element UI** 的考试题目后台管理系统，包含登录、首页数据概览、用户管理、题目管理、系统信息等模块。

## 技术栈

- Vue 2.7
- Element UI 2.15
- Vue Router 3
- Vuex 3
- Vue CLI 5（Webpack）

## 功能模块

| 模块 | 说明 |
| --- | --- |
| 登录 | 账号 admin / 密码 123456 |
| 首页 | 用户数、题目数等统计卡片 + 最新题目列表 |
| 用户管理 | 用户的查询 / 添加 / 编辑 / 删除，分页展示 |
| 题目管理 | 单选、多选、判断、填空、简答五类题型的增删改查，支持章节、难度配置 |
| 系统信息 | 技术栈与功能说明 |

> 演示环境使用浏览器 localStorage 存储数据，无需后端即可完整运行。

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（端口 7000）
npm run serve

# 编译打包（生成 dist 目录，可部署到任意静态服务器 / Vercel）
npm run build
```

## 目录结构

```
quiz-admin
├── public
│   └── index.html
├── src
│   ├── layout            # 后台布局（侧边栏 + 顶栏）
│   ├── router            # 路由配置
│   ├── store             # Vuex 状态管理（auth / users / questions）
│   ├── styles            # 全局样式
│   ├── utils             # 工具函数
│   └── views
│       ├── login         # 登录页
│       ├── dashboard     # 首页
│       ├── user          # 用户管理
│       ├── question      # 题目管理
│       └── system        # 系统信息
├── vue.config.js
├── babel.config.js
└── package.json
```
