---
title: "P3RE 风格 Loading 动画二次开发记录"
description: "克隆 GitHub 上的 P3RE Web Effect，拆解海浪幕布和循环视频，移植到博客的多动画切换系统"
date: 2026-07-29
tags: ["CSS", "动画", "P3RE", "视频"]
category: "前端"
draft: false
---

## 缘起

博客已经有了 NieR 风格的加载动画。但在之前调研的时候，我还收藏过一个 P3RE（Persona 3 Reload）风格的 Web 页面效果——蓝色海浪幕布下滑，然后全屏视频循环播放。当时就觉得这个效果也很棒，只是没有现成的方法去集成。

在实现完 NieR 动画之后，我决定把这个 P3RE 效果也加进来，做成一个可以切换的动画选项。

## 拆解原项目

原项目结构很简单：一个 `index.html` + `style.css` + 一些素材文件。

**动画分三层**：

1. **海浪幕布**（0-4s）：蓝色背景 `#469ce5` + 5 层 SVG 波浪叠加。每个波浪层有独立的 `translateY` 浮动动画（周期 3-5 秒不等），整体容器从屏幕顶部向下滑出（`translateY(-10vh)` → `translateY(110vh)`）

2. **视频 1**（4s 后）：`fv_movie1.mp4` 全屏播放一次。幕布滑出后自动开始

3. **视频 2**（视频 1 结束后）：`fv_movie2.mp4` 循环播放。转场后出现 P3RE logo 和 "点击进入" 提示

**素材**：两个 MP4 视频（~2.2MB + ~2.4MB）、5 个 SVG 波浪、1 个 P3RE SVG logo。

## 集成到博客

博客的 LoadingScreen 之前只支持 NieR 和无动画两种模式。需要扩展为三种。

### 避免视频预加载

关键问题：不能把两个视频的 `<source>` 同时写在 HTML 里——浏览器解析 HTML 阶段就会开始下载，即使 JS 立刻移除 DOM，已经发出的请求收不回来。

解决方案：视频 `<source>` 不在 Astro 模板中静态声明。JS 根据 `localStorage` 判断当前模式，只在选中 P3RE 时才通过 `v1.src = '...'` 动态设置。NieR 的 ASCII 素材同理——改为 `import()` 动态加载，不在不需要时占用带宽。

### 海浪动画触发

CSS `animationend` 事件在某些动态显示/隐藏的场景下不可靠。最终使用 `setTimeout(3600ms)` 作为主触发器（刚好是 1s delay + 3s duration 减去 500ms 提前量），`animationend` 作为兜底。这样视频在海浪接近底部时就开始播放，视觉上无缝衔接。

### BASE_URL 陷阱

视频路径需要包含 `/astro-blog` 前缀。第一步用了 `'{import.meta.env.BASE_URL}'` 写在 `<script>` 标签里——但在 Astro 中，`{...}` 模板表达式在 `<script>` 内不会被编译。最后改用 `data-base` HTML 属性传值，JS 通过 `dataset.base` 读取。这个问题在 NieR 动画中同样存在，一并修复。

## 最终效果

三种模式可通过右下角按钮动态切换：

| 模式 | 效果 | 跳过方式 |
|------|------|---------|
| NieR | ASCII 点阵 + 终端打字 | 点击任意位置 |
| P3RE | 海浪幕布 + 双视频循环 | 点击任意位置（视频 2 开始后） |
| 无动画 | 直接进入页面 | — |

选择后自动存入 `localStorage`，刷新即生效。
