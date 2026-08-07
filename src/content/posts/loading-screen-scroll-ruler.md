---
title: "NieR 加载动画改造：首屏滚动进入 + 右下角滚动刻度尺"
date: 2026-08-07
description: "把 NieR 开场动画从「播放完淡出」改造成「停留为首屏，滚轮实时翻转进入」，右下角常驻横向刻度尺显示整页滚动进度——文档流首屏 + sticky 翻转 + scroll 驱动的完整实现。"
tags: ["anime.js", "滚动", "加载动画", "CSS 3D"]
category: "技术实现"
---

# NieR 加载动画改造：首屏滚动进入 + 右下角滚动刻度尺

## 起因

站点的 NieR 开场动画原本是「播放完 → 整层淡出移除」的全屏遮罩。想改成更沉浸的交互：动画播完**不消失**，停留成为页面首屏；用户向下滚动时，整屏像之前的文字 3D 翻转一样**向后翻倒隐藏**，露出正常的博客内容；右下角常驻一个**横向带刻度的滚动进度尺**，滑块随整页滚动 0→100% 移动。

先在独立测试页（完整视口）验证了 onScroll 驱动的翻转效果，再回填到站点组件。核心思路一句话：**把加载动画从 fixed 遮罩改成文档流首屏，用 scroll 驱动 transform 翻转，刻度尺显示整页进度**。

## 核心思路

### 1. 结构：fixed 遮罩 → 文档流首屏

原实现是 `fixed inset-0 z-[9999]` 全屏遮罩，播完淡出 `remove()`。新结构占 100vh 文档流、永驻页面顶部：

```html
<!-- #nier-loading 占 100vh 文档流；#nier-stage sticky 钉在视口顶部 -->
<div id="nier-loading" class="relative z-[60]" style="height:100vh;">
  <div id="nier-stage" class="sticky top-0 overflow-hidden" style="height:100vh; ...">
    <canvas id="nier-grid-art" ...></canvas>
    <div id="nier-lines" ...></div>
  </div>
</div>
```

关键点：

- `#nier-loading` 是普通文档流元素（100vh），**不 remove**——刷新后它仍在页面顶部
- `#nier-stage` 用 `sticky top-0`：滚动时钉在视口顶部，滚过 100vh 后自然让位给下方内容
- `z-[60]` 高于 fixed 导航栏的 `z-50`，首屏期间盖住导航栏，滚走后导航栏自然浮现

### 2. 播放完不淡出：亮出刻度尺 + 挂滚动驱动

原 `run()` 末尾是 `opacity 0` + `remove()`。改为 `showEnterHint()`：

```js
function showEnterHint() {
  hintEl.style.opacity = '1';
  window.addEventListener('scroll', onScrollFlip, { passive: true });
  onScrollFlip();
}
```

### 3. 滚动驱动翻转（实时跟随、可逆）

用户选定「实时跟随滚动：滚多少翻多少，刻度尺即进度」。核心在 `onScrollFlip`：

```js
function onScrollFlip() {
  var vh = window.innerHeight;
  // 首屏翻转：前 100vh 内完成 0 → -90°
  var flip = Math.min(window.scrollY / vh, 1);
  nierEl.style.transform = 'rotateX(' + (-90 * flip) + 'deg)';
  // 刻度尺：整个文档滚动进度 0 → 100%
  var doc = document.documentElement;
  var maxScroll = doc.scrollHeight - vh;
  var page = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
  rulerKnob.style.left = (page * 100) + '%';
  if (rulerFill) rulerFill.style.width = (page * 100) + '%';
  // 提示文字随首屏翻走淡出
  hintLabel.style.opacity = String(Math.max(0, 1 - flip * 3));
}
```

两个进度是**不同维度**：

- `flip`（首屏翻转）= `scrollY / vh`，前一个视口高度内翻完
- `page`（刻度尺）= `scrollY / (scrollHeight - vh)`，整页 0→100%

翻转沿用之前 3D 翻转的调参结论：**无 perspective**（透视投影在小空间会抖动，正交投影只均匀压扁、平滑），`transform-origin: 50% 50%`，终点 `-90°` 即水平不可见。**监听不解除**（原版 progress≥1 解绑），所以向上滚动时 transform 反向恢复——首屏翻回来，向上滚能看到完整加载动画。

### 4. 刷新行为：首屏不销毁，靠浏览器原生恢复位置

`runNier(quick)` 双分支：

- `quick=false`（首次进入，sessionStorage 无 done）：播放打字动画 → 播完 `showEnterHint()`
- `quick=true`（刷新/回访，已 done）：跳过打字，`fillAllLines()` 直接填满终端行 + 立即亮刻度尺

```js
if (!sessionStorage.getItem('nier-intro-done')) {
  sessionStorage.setItem('nier-intro-done', '1');
  runNier(false);
} else {
  runNier(true);  // 刷新/回访：跳过动画直接完成态（首屏不销毁，向上滚可见）
}
```

刷新时浏览器原生 scroll restoration 决定停留位置：刷新时在首屏（scrollY=0）→ 看到加载动画完成态；刷新时在首页内容区 → 停留首页，向上滚能看到顶部加载动画。

### 5. 右下角刻度尺：整页进度 + 高亮填充 + 竖线滑块

```html
<div id="nier-scroll-hint" class="fixed z-[70] flex flex-col items-center" style="right:10%; bottom:10%; ...">
  <div id="nier-hint-label" ...>向下滚动</div>
  <div id="nier-ruler" class="relative" style="width:240px; height:22px; background-image:
      repeating-linear-gradient(90deg, rgba(34,211,238,.4) 0 1.5px, transparent 1.5px 16px),
      repeating-linear-gradient(90deg, rgba(34,211,238,.22) 0 1px, transparent 1px 4px); ...">
    <div id="nier-ruler-fill" class="absolute left-0" style="width:0%; ..."></div>
    <div id="nier-ruler-knob" class="absolute" style="top:-5.5px; left:0; width:2px; height:19.5px; ..."></div>
  </div>
</div>
```

设计要点：

- **密集装饰刻度**：双层 `repeating-linear-gradient`——主刻度 16px 间隔（1.5px 宽、13px 高）、次刻度 4px 间隔（1px 宽、7px 高）。**刻度不代表页面数**，纯装饰，进度由滑块表达
- **已滚区域高亮**：`#nier-ruler-fill` 宽度随进度更新（与滑块同步 `width = page×100%`），盖在暗淡刻度线上——「走过的路亮了」。用 `mask-image: linear-gradient(90deg, #000, rgba(0,0,0,.92))` 做右端渐变收尾
- **竖线滑块**：不是圆点，是 2px 宽的亮青竖线（`#7FF3FF`，比刻度 `#22D3EE` 更亮），高度 19.5px = 主刻度 13px × **1.5 倍**，`top:-5.5px` 使底部与主刻度线底边（y=14px）精确对齐
- **固定右下角**：`right:10%; bottom:10%`，透明背景，深色首屏和浅色内容区都可见

### 6. 重播按钮：从 reload 改为滚动定位

首屏常驻后，右下角工具栏的「重播开场动画」不再需要 `location.reload()`——直接平滑滚回顶部即看到加载动画：

```js
document.getElementById('btn-replay')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
```

## 交互细节

- 点击首屏任意位置 = `scrollTo({ top: innerHeight, behavior: 'smooth' })` 平滑滚到进入点（替代原「点击跳过」）
- 刻度尺 `pointer-events:none` 不挡内容交互；`z-[70]` 高于首屏
- 「向下滚动」提示随首屏翻转进度淡出（`1 - flip×3`）
- `none` / `p3re` 模式仍会连刻度尺一起移除，互不影响

## 踩坑记录

1. **fixed 遮罩不占文档流**：`fixed inset-0` 时页面内容从视口顶部开始，首屏无法「停留在上方供向上滚动查看」。必须改成文档流 100vh 容器 + 内部 `sticky` 层
2. **翻转监听 progress≥1 解绑 = 向上滚翻不回来**：初版在 `progress >= 1` 时 `removeEventListener`，首屏停在 -90° 一条线，向上滚也看不到完整动画。去掉解绑后 transform 由 scroll 双向驱动，可逆
3. **刻度「一格一屏」的误导**：最初刻度 32px 间隔 = 10 格，视觉上像每格对应一页。改为密集双层刻度（16px/4px），明确纯装饰
4. **竖线滑块太长**：2 倍高（26px）超出刻度线太多，用户要求 1.5 倍（19.5px）且底部与刻度线底边对齐——`top:-5.5px` 是算出来的：主刻度从 y=1px 起、13px 高（底边 y=14px），19.5px 高竖线底部对齐 y=14px → `top = 14 - 19.5 = -5.5px`
5. **刷新行为靠原生 scroll restoration**：不需要手动记录滚动位置，浏览器刷新后自动恢复到之前位置——前提是首屏元素不销毁（在 DOM 中占位）

## 小结

这次改造把「一次性开场动画」升级成「常驻首屏 + 滚动进入」的沉浸式体验：文档流首屏保证刷新不丢失，scroll 驱动 transform 保证翻转实时可逆，右下角刻度尺用「高亮填充 + 竖线滑块 + 密集刻度」把整页进度可视化。核心模式——**滚动即状态**：scrollY 同时驱动两个维度（首屏翻转 0→1、整页进度 0→1），一个监听函数全部搞定，可复用到任意滚动联动场景。
