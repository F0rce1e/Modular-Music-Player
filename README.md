# Modular Music Player

**Modular Music Player** 是一款专注于本地音频库播放的音乐播放器，提供极简的界面和高度自定义的功能。

> **“简约、高效，尽在掌控”**

本项目旨在为用户提供一个轻量级、低内存占用的音乐播放器。通过专注于本地音频库管理与播放，用户可以根据自己的需求自由定制播放器的功能模块和外观布局。

---

## 核心特性

- 🎵 **专注本地播放**：支持 MP3, WAV, FLAC 等主流音频格式。
- 🧩 **模块化设计**：核心功能与工具面板均为独立模块，可自由启用/禁用与重命名。
- 🏗️ **高度自定义布局**：集成 `react-grid-layout`，支持模块自由拖拽、缩放、重置与布局持久化。
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
│   ├── modules/             # 功能模块（如 MusicLibrary, Playlist, NowPlaying, Favorites）
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

## 模块清单

### 核心播放与导航

- Music Library：本地曲库浏览与搜索
- Playlist：当前播放队列管理与拖拽排序
- Playback Controls：基础播放控制
- Sidebar：导航与播放列表入口

### 体验与状态

- Now Playing：当前播放信息与状态
- Player Details：专辑封面与详情视图
- Recent Plays：最近播放列表
- Favorites：收藏列表与快捷播放
- Library Stats：曲库统计概览

### 音效与工具

- Equalizer：均衡器面板（UI 级，便于后续接入音效处理）

---

## 业务逻辑与数据流

- **本地库导入**：通过系统文件选择器导入音频，解析元信息并加入曲库。
- **播放控制**：播放/暂停与进度控制由 AudioService 统一驱动。
- **队列排序**：播放队列支持拖拽排序，保持当前播放索引一致性。
- **布局持久化**：模块的布局与显隐状态持久化到本地存储。
- **收藏与最近播放**：收藏与最近播放自动记录并持久化，跨会话保持一致。

---

## 当前进度

### 🏁 已完成阶段 (Phase 1-3)

- [X] 基础架构搭建 (Electron + React + TS)
- [X] 核心音频播放功能 (Howler.js 集成)
- [X] 基础模块开发 (音乐库、播放列表、控制面板)
- [X] **动态布局系统** (支持自由拖拽与持久化存储)
- [X] **模块管理与扩展** (新增 NowPlaying、Recent、Favorites、Equalizer、Stats)
- [X] **浅色主题适配** 与样式系统优化
- [X] 构建流程优化与类型安全修复

### 🚀 计划中

- [ ] 歌词显示模块
- [ ] 模块样式深度定制界面
- [ ] 音效处理接入（均衡器与效果链）
- [ ] 插件系统初步设计
- [ ] 性能压测与内存深度优化

---

## 开源协议

本项目采用 MIT协议。
