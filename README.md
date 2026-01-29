# Modular Music Player

**Modular Music Player** 是一款专注于本地音频库播放的音乐播放器，提供极简的界面和高度自定义的功能。

> **“简约、高效，尽在掌控”**

本项目旨在为用户提供一个轻量级、低内存占用的音乐播放器。通过专注于本地音频库管理与播放，用户可以根据自己的需求自由定制播放器的功能模块和外观布局。

---

## 核心特性

- 🎵 **专注本地播放**：支持 MP3, WAV, FLAC 等主流音频格式。
- 🧩 **模块化设计**：所有功能（播放控制、音乐库、播放列表等）均为独立模块，可自由启用/禁用。
- 🏗️ **高度自定义布局**：集成 `react-grid-layout`，支持模块的自由拖拽、缩放和布局持久化。
- 🎨 **深度视觉定制**：支持深色/浅色模式，每个模块的样式（颜色、透明度、字体）均可个性化。
- ⚡ **低内存占用**：采用虚拟化列表（`react-window`）和高效的内存管理，确保流畅体验。
- 📦 **跨平台支持**：基于 Electron 构建，支持 Windows, macOS 和 Linux。

---

## 技术栈

- **核心框架**：[Electron](https://www.electronjs.org/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **音频引擎**：[Howler.js](https://howlerjs.com/)
- **样式方案**：[styled-components](https://styled-components.com/)
- **布局引擎**：[react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)
- **性能优化**：[react-window](https://github.com/bvaughn/react-window)
- **构建工具**：Webpack, Babel

---

## 项目结构

```text
modular-music-player/
├── src/                
│   ├── assets/              # 静态资源（图标、背景等）
│   ├── components/          # 通用 UI 组件（如 ModuleContainer, WindowTitleBar）
│   ├── modules/             # 功能模块（如 MusicLibrary, PlaybackControls, Playlist）
│   ├── services/            # 核心服务（AudioService 播放逻辑）
│   ├── styles/              # 主题定义与全局样式
│   ├── utils/               # 工具函数
│   └── App.tsx              # 主应用入口
├── .gitignore               # Git 忽略配置
├── package.json             # 项目配置与依赖
├── tsconfig.json            # TypeScript 配置
└── webpack.config.js        # Webpack 构建配置
```

---

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发环境
```bash
npm run dev
```

### 3. 构建项目
```bash
npm run build
```

---

## 当前进度

### 🏁 已完成阶段 (Phase 1-3)
- [x] 基础架构搭建 (Electron + React + TS)
- [x] 核心音频播放功能 (Howler.js 集成)
- [x] 基础模块开发 (音乐库、播放列表、控制面板)
- [x] **动态布局系统** (支持自由拖拽与持久化存储)
- [x] **浅色主题适配** 与样式系统优化
- [x] 构建流程优化与类型安全修复

### 🚀 计划中
- [ ] 歌词显示模块
- [ ] 模块样式深度定制界面
- [ ] 插件系统初步设计
- [ ] 性能压测与内存深度优化

---

## 开源协议
本项目采用 [ISC](LICENSE) 协议。
