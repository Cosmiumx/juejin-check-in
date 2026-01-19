<div align="center">

# 掘金签到助手

<img src="https://unpkg.com/cosmium@0.0.6/images/other/juejin.png" alt="掘金签到助手" width="200"/>

**一款便捷的浏览器扩展，帮助您在掘金平台完成每日签到任务**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://www.google.com/chrome/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)

[功能特性](#-功能特性) • [安装方法](#-安装方法) • [使用说明](#-使用说明) • [技术架构](#-技术架构) • [常见问题](#-常见问题)

</div>

---

## ⚠️ 免责声明

> **本项目仅供学习和技术交流使用**
>
> - 本项目是为了学习浏览器扩展开发技术而创建的个人学习项目
> - 使用本工具产生的任何后果由使用者自行承担
> - 请遵守掘金平台的用户协议和使用规范
> - 作者不对使用本工具导致的任何问题负责
> - 建议仅在个人学习环境中使用，不建议用于生产环境

---

## 📋 目录

- [掘金签到助手](#掘金签到助手)
  - [⚠️ 免责声明](#️-免责声明)
  - [📋 目录](#-目录)
  - [✨ 功能特性](#-功能特性)
  - [📦 安装方法](#-安装方法)
    - [方法一：开发者模式安装（推荐）](#方法一开发者模式安装推荐)
  - [📖 使用说明](#-使用说明)
    - [基本使用流程](#基本使用流程)
    - [状态提示说明](#状态提示说明)
  - [🛠 技术架构](#-技术架构)
    - [核心组件](#核心组件)
    - [技术栈](#技术栈)
  - [📁 项目结构](#-项目结构)
  - [✅ 使用条件](#-使用条件)
  - [❓ 常见问题](#-常见问题)
  - [🤝 贡献指南](#-贡献指南)
  - [📄 许可证](#-许可证)
  - [📮 联系方式](#-联系方式)

---

## ✨ 功能特性

- ✨ **一键签到** - 点击按钮即可完成每日签到
- 🤖 **自动签到** - 支持自动模式，在每天首次打开浏览器时自动签到
- 👁️ **状态监控** - 实时显示今日签到状态
- ⏰ **定时提醒** - 内置定时机制，确保不错过签到
- 🔔 **记录追踪** - 记录最近一次签到时间
- 🎨 **简洁界面** - 清晰直观的用户界面设计

---

## 📦 安装方法

### 方法一：开发者模式安装（推荐）

1. 克隆或下载此仓库到本地
   ```bash
   git clone https://github.com/Cosmiumx/juejin-check-in.git
   ```

2. 打开 Chrome 浏览器，访问 `chrome://extensions/`

3. 开启右上角的 **"开发者模式"**

4. 点击 **"加载已解压的扩展程序"**

5. 选择项目文件夹即可完成安装

---

## 📖 使用说明

### 基本使用流程

1. **登录掘金账户**
   > ⚠️ **重要**：确保您已经在 [掘金网站](https://juejin.cn) 登录了账户

2. **打开扩展程序**
   - 点击浏览器工具栏中的扩展图标
   - 在弹窗中可以看到今日签到状态

3. **选择签到模式**
   - **手动模式**：需要手动点击"手动签到"按钮进行签到
   - **自动模式**：每天首次打开浏览器时会自动签到

4. **完成签到**
   - 点击"手动签到"按钮完成签到
   - 或等待自动签到（如已开启自动模式）

### 状态提示说明

| 状态     | 颜色       | 说明             |
| -------- | ---------- | ---------------- |
| ✅ 已签到 | 🟢 绿色背景 | 今日已完成签到   |
| ❌ 未签到 | 🔴 红色背景 | 今日尚未签到     |
| 🔄 检查中 | ⚪ 灰色背景 | 正在检查签到状态 |

---

## 🛠 技术架构

此扩展基于 **Manifest V3** 架构开发，采用现代化的浏览器扩展开发规范。

### 核心组件

| 组件             | 文件                      | 功能说明                         |
| ---------------- | ------------------------- | -------------------------------- |
| 🔧 Service Worker | `service-worker.js`       | 后台服务，处理定时签到和模式管理 |
| 📄 Content Script | `content-script.js`       | 在掘金页面上执行实际的签到操作   |
| 🖼️ Popup          | `popup.html` / `popup.js` | 扩展弹窗界面，提供用户交互功能   |
| 💾 Storage        | Chrome Storage API        | 存储签到状态和用户设置           |

### 技术栈

- **Manifest V3** - Chrome 扩展最新规范
- **JavaScript (ES6+)** - 现代化 JavaScript 开发
- **Chrome Extensions API** - 浏览器扩展 API
- **Chrome Storage API** - 数据持久化

---

## 📁 项目结构

```
juejin-check-in/
├── 📄 manifest.json       # 扩展配置文件（Manifest V3）
├── 🖼️ popup.html          # 弹窗界面 HTML
├── 🎨 popup.js            # 弹窗界面逻辑
├── 📜 content-script.js   # 页面内容脚本
├── ⚙️ service-worker.js   # 后台服务脚本
├── 📋 constants.js        # 常量定义
├── 🔧 common-actions.js   # 公共动作函数
├── 🛠️ utils.js            # 工具函数
├── 📁 icons/              # 图标文件夹
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── 📖 README.md           # 项目说明文档
```

---

## ✅ 使用条件

在使用本扩展前，请确保满足以下条件：

- ✅ 已安装 Chrome 或其他 Chromium 内核浏览器（如 Edge、Brave 等）
- ✅ 已在掘金网站登录账户
- ✅ 授予扩展对 `https://juejin.cn/*` 的访问权限
- ✅ 确保网络可以正常访问掘金网站

---

## ❓ 常见问题

<details>
<summary><b>Q: 为什么签到失败？</b></summary>

A: 请检查以下几点：
- 确保已在掘金网站登录账户
- 检查网络连接是否正常
- 尝试手动访问掘金网站确认可以正常访问
- 尝试重新安装扩展
</details>

<details>
<summary><b>Q: 自动签到没有生效？</b></summary>

A: 自动签到功能仅在以下情况触发：
- 每天首次打开浏览器时
- 确保扩展处于启用状态
- 建议重启浏览器后观察是否正常工作
</details>

<details>
<summary><b>Q: 扩展是否会收集我的个人信息？</b></summary>

A: 本扩展不会收集任何个人信息，所有数据仅存储在本地浏览器中。您可以查看源代码进行验证。
</details>

<details>
<summary><b>Q: 是否支持其他浏览器？</b></summary>

A: 理论上支持所有 Chromium 内核的浏览器（如 Edge、Brave、Opera 等），但主要在 Chrome 上测试。
</details>

---

## 🤝 贡献指南

欢迎提出问题和贡献代码！

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源协议。

---

## 📮 联系方式

如有问题或建议，欢迎：

- 提交 [Issue](https://github.com/Cosmiumx/juejin-check-in/issues)
- 发起 [Pull Request](https://github.com/Cosmiumx/juejin-check-in/pulls)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，欢迎给个 Star ⭐**

Made with ❤️ for learning purposes

</div>