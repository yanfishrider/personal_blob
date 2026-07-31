---
title: "anime.js 交互式学习笔记 — 内嵌编辑器开发记录"
description: "在 Astro 博客中搭建 CodeMirror 三编辑器 + iframe 实时预览 + 四级导航树的 anime.js 交互学习页面，踩坑与架构记录。"
date: 2026-07-31
tags: ["anime.js", "CodeMirror", "Astro", "前端"]
category: "前端"
draft: false
---

## 缘起

想在博客里学 anime.js，翻文档、复制粘贴、切到 CodePen 验证——太割裂了。不如直接在博客里嵌入一个可运行的编辑器：左边写代码，右边看结果，旁边还有结构化的章节导航。这篇文章记录整个搭建过程。

## 架构概览

页面的主体由四个组件构成：

```
src/pages/notes.astro          — 页面入口，全局样式 + 布局适配
src/components/notes/
├── SideNav.astro              — 左侧四级导航树
├── CodeEditor.astro           — CodeMirror 6 三编辑器
└── PreviewPanel.astro         — iframe 实时预览
src/data/anime-topics.ts       — 章节数据（树形结构）
src/lib/editor-state.ts        — 编辑器状态管理 + 递归查找
```

布局采用 Astro 的三栏插槽模式：`SideNav` 填入 `sidebar` 插槽，`CodeEditor` 填入默认 `main`，`PreviewPanel` 填入 `rightSidebar`。页面撑满视口，`overflow: hidden` 禁止整体滚动。

## 编辑器核心：CodeMirror 6

三个编辑器（HTML / CSS / JavaScript）共享同一个容器，通过 tab 切换 `hidden` 类来控制显隐。每个编辑器独立创建 `EditorView` 实例，挂载到对应的 DOM 节点。

### 关键实现

**编辑器工厂函数**：根据语言类型加载不同的扩展——`html()` / `css()` / `javascript()`。JS 编辑器额外注入 anime.js 的 `autocompletion`，供 `Ctrl+Space` 触发补全。

**暗色主题**：通过 `EditorView.theme()` 定制，背景 `#1e1e1e`，光标 `#ff7b42`，选中区域 `#264f7840`，与博客整体暗色风格一致。

**实时预览**：`EditorView.updateListener` 监听文档变化，400ms 防抖后调用 `updatePreview()`，将三个编辑器的内容拼接成完整 HTML，写入 iframe 的 `srcdoc`。

```js
const doc = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>${css}</style></head>
<body>${html}<script type="module">${js}</` + `script></body></html>`;
frame.srcdoc = doc;
```

## 导航树：从三级到四级

最初导航是扁平的——入门、计时器、关键帧、时间轴等条目并列展示。重构后变成了四级嵌套：

```
anime.js 学习              ← 第 1 层（Topic）
├── 入门                   ← 第 2 层（SubItem，叶子）
├── 计时器                 ← 第 2 层（有子节点）
│   ├── 播放设置           ← 第 3 层（有子节点）
│   │   ├── 延迟           ← 第 4 层（叶子）
│   │   ├── 持续时间
│   │   └── ...
│   └── 回调               ← 第 3 层（有子节点）
│       ├── onBegin        ← 第 4 层（叶子）
│       ├── onComplete
│       └── ...
└── 自定义                 ← 第 2 层（叶子）
```

### SideNav 渲染逻辑

DOM 结构完全由 `buildNav()` 动态生成。每一层的可展开节点后紧跟一个 `nav-sub-wrap` 容器，点击时通过 `nextElementSibling` 找到对应容器并切换 `hidden` 类。箭头 `▸` 通过 CSS `transform: rotate(90deg)` 实现展开动画。

**第四层加载的关键**：原有 `loadSubSubTopic` 只能找三层节点。新增了 `loadItemById()`，通过递归 `collectAll()` 遍历整棵 topic 树，支持任意深度查找。

## 数据驱动的章节系统

`anime-topics.ts` 导出 `Topic[]` 数组，每个节点包含：

- `html` / `css` / `js`：三面板的初始代码
- `desc`：Markdown 格式的文档说明（渲染到信息面板）
- `children`：递归子节点

新增章节只需在数组中追加一个对象，导航树和编辑器内容自动生效，零 UI 代码改动。

## 踩坑实录

### 1. anime.js 的 ESM 导入

anime.js v4 在 esm.sh 上的导入路径不是裸标识符，必须写完整 URL：

```js
// ❌ 错误
import anime from 'animejs';

// ✅ 正确
import anime from 'https://esm.sh/animejs@3.2.2';
import { createTimer, utils } from 'https://esm.sh/animejs';
```

这是因为 iframe 的 `srcdoc` 中 `<script type="module">` 运行在浏览器原生模块环境，无法使用构建工具的裸导入解析。

### 2. 计时器章节的 CSS 覆盖

计时器示例需要独立的深棕色背景（`#2d2117`）和特殊的字体、间距。由于这些 CSS 直接写入 iframe 的 `<style>` 标签，不会与博客全局样式冲突。每个章节的 `css` 字段完全自治。

### 3. 嵌套导航的渲染缺失

将"播放设置"和"回调"从顶层 Topic 下移到计时器的子项后，它们的孙子节点（如 t-delay、onBegin 等）消失了——原 SideNav 代码只渲染了三级。修复方法是扩展内层循环，让 `ss` 节点也检查 `children` 并递归生成子容器。

## 最终效果

- 15 个页面静态生成，构建时间约 5 秒
- 笔记页零客户端路由，所有交互纯 DOM 操作
- 支持 6 个回调（onBegin / onComplete / onUpdate / onLoop / onPause / then()）和 8 个播放参数
- 自定义章节可自由编写任意 anime.js 代码

源码在 [GitHub](https://github.com/yanfishrider/personal_blob) 的 `main` 分支，`/notes` 路径可直接访问。
