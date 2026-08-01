---
title: "全局徽章光标 — 从笔记页到全站"
description: "把笔记页的 SVG 徽章光标推广到全站：BaseLayout 注入、热点与 transform-origin 计算、页面隔离方案（游戏页用转向版），以及 16×16 → 32×32 的尺寸调整记录。"
date: 2026-08-01
tags: ["SVG", "光标", "Astro", "前端"]
category: "前端"
draft: false
---

## 缘起

笔记页先实现了自定义徽章光标：把一张 12 path 的 SVG 徽章（黑剪影 + 灰部件 + 白部件）内联进页面，`cursor: none` 隐藏系统指针，JS 跟随鼠标移动。效果不错，于是决定推广到全站——除游戏页外所有页面统一使用。

## 规格

- **尺寸**：最初 16×16，后调到 32×32
- **无光晕**：去掉 drop-shadow 白晕，纯徽章剪影
- **默认朝向**：顶部向左偏 30°（`rotate(-30deg)`）

## 热点计算的简化：SVG meet 缩放的中心不变性

光标跟随的核心是"热点对准鼠标"。徽章 viewBox 是 `72.9 8.1 299 432.9`，热点（中心圆）在 viewBox 坐标系 `(149.5, 216.4)`，换算成绝对坐标恰好是图形的几何中心。

关键发现：容器固定宽高 + `preserveAspectRatio="xMidYMid meet"` 时，**图形中心永远落在容器中心**，与容器宽高比无关。于是热点直接取容器中心：

```js
var HOT = 16; // 32×32 容器 → 中心 (16,16)
cursor.style.transformOrigin = HOT + 'px ' + HOT + 'px';
cursor.style.transform =
  'translate(' + (e.clientX - HOT) + 'px,' + (e.clientY - HOT) + 'px) rotate(-30deg)';
```

不用再按 viewBox 比例换算热点偏移。

## 实现：BaseLayout 注入

光标 HTML（SVG 12 path）+ CSS + 跟随脚本全部放进 `BaseLayout.astro`，所有套该布局的页面自动获得：

- `html, body, body * { cursor: none !important }` 全局隐藏系统指针
- `<div id="custom-cursor">` 固定定位，`pointer-events: none` 不挡点击
- 脚本注册 mousemove / mouseleave，首帧显示、移出窗口隐藏

## 页面隔离：游戏页用转向版

`/game` 页面有自己的转向光标（顶部朝最近柱子，动态角度），与全局静态光标冲突。方案：

- 游戏页 CSS 里 `#custom-cursor { display: none !important }` 隐藏全局版
- 游戏页自己的光标改用独立 id `#game-cursor`，逻辑完全独立

两个光标各管各的，互不干扰。

## 清理 notes 页旧实现

notes 页原本内联了自己的光标（32×46、带光晕），全局光标上线后移除，统一走 BaseLayout，避免重复元素和 id 冲突。107 行的页面精简到 49 行。

## 验证

构建产物检查：所有套 BaseLayout 的页面（首页/文章/归档/分类/标签/搜索/转换器/笔记/404）均包含光标 CSS + SVG + 跟随脚本；game 页正确隔离（无静态旋转、有转向逻辑）。导航栏同时新增了"游戏"入口。

## 经验

1. **SVG meet 缩放 + 固定容器 → 热点即容器中心**，省去坐标换算
2. **页面级定制光标 = 隐藏全局版 + 独立 id**，比在全局脚本里做分支干净
3. **`<style>` 写在布局组件内部会被原样内联输出**（不提取进 CSS 文件），可用但要注意产物差异
