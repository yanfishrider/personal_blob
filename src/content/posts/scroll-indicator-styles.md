---
title: "滚动指示器多样式：圆形表盘时针 + 样式选择器"
date: 2026-08-07
description: "把右下角滚动指示器从横条刻度尺扩展为「横条 / 圆形表盘时针」双样式，用 localStorage + 工具栏下拉菜单做样式选择器。圆形表盘由 JS 动态生成 SVG：60 条刻度线 + 时针绕圆心旋转，扫过的刻度高亮，滚动 0→360° 转满一圈。"
tags: ["anime.js", "滚动", "SVG", "样式选择器"]
category: "技术实现"
---

# 滚动指示器多样式：圆形表盘时针 + 样式选择器

## 起因

上一版把加载动画改造成「首屏滚动进入」时，右下角做了一个**横条刻度尺**指示器：密集装饰刻度 + 高亮填充层 + 竖线滑块，随整页滚动 0→100% 移动。用户看到后提出两个升级需求：

1. 想要**圆形**的指示器，类似**时针样式**——一个表盘，指针绕圆心旋转表示进度
2. 两种样式都要，做成**样式选择器**切换

方案：SVG 表盘完全由代码动态生成（`createElementNS` 画刻度线 + 时针），不依赖任何图片文件；样式切换复用工具栏「切换开场动画」的菜单模式（localStorage 持久化）。

## 核心思路

### 1. 表盘几何：60 条刻度线循环生成

SVG 里没有现成的「刻度盘」，用 JS 循环算角度逐条创建 `<line>`：

```js
var NS = 'http://www.w3.org/2000/svg';
var cx = 36, cy = 36, R = 30; // 圆心 + 刻度半径（72px 表盘）
for (var i = 0; i < 60; i++) {
  var a = (i * 6 - 90) * Math.PI / 180; // 每格 6°，从 12 点方向开始（-90° 偏移）
  var isMajor = (i % 5 === 0);           // 每 5 格一条主刻度
  var r1 = isMajor ? R - 9 : R - 5;      // 主刻度长、次刻度短（向圆心延伸更多）
  var line = document.createElementNS(NS, 'line');
  line.setAttribute('x1', cx + r1 * Math.cos(a));
  line.setAttribute('y1', cy + r1 * Math.sin(a));
  line.setAttribute('x2', cx + R * Math.cos(a));
  line.setAttribute('y2', cy + R * Math.sin(a));
  line.setAttribute('stroke', isMajor ? 'rgba(34,211,238,.75)' : 'rgba(34,211,238,.3)');
  line.setAttribute('stroke-width', isMajor ? '1.6' : '1');
  clockSvg.appendChild(line);
  clockTicks.push(line); // 存引用，滚动时改色
}
```

关键点：**`-90°` 偏移**让第一格落在 12 点方向（`cos(-90°)=0, sin(-90°)=-1` 指向正上方），否则从 3 点方向开始。刻度分主次：主刻度更长更亮，形成表盘节奏感。

### 2. 时针：一根 line + rotate

时针就是从圆心指向 12 点的一根 `<line>`，旋转由滚动进度驱动：

```js
clockHand = document.createElementNS(NS, 'line');
clockHand.setAttribute('x1', cx); clockHand.setAttribute('y1', cy);
clockHand.setAttribute('x2', cx); clockHand.setAttribute('y2', cy - 20);
clockHand.setAttribute('stroke', '#7FF3FF');
clockHand.setAttribute('stroke-width', '2.5');
clockHand.setAttribute('stroke-linecap', 'round');
// SVG 元素旋转必须显式设 transform-origin（默认 0,0 会绕左上角转）
clockHand.style.transformOrigin = cx + 'px ' + cy + 'px';
clockHand.style.transition = 'transform .08s linear'; // 转动顺滑
```

滚动驱动里一行更新角度：

```js
clockHand.style.transform = 'rotate(' + (page * 360) + 'deg)'; // 0 → 360° 转满一圈
```

**踩坑**：SVG 子元素的 `transform-origin` 不能用 CSS 类的默认值——SVG 坐标系原点在左上角，必须显式 `style.transformOrigin = '36px 36px'`（圆心），否则时针绕 (0,0) 甩飞。

### 3. 扫过的刻度高亮（保留「走过的路亮了」语义）

横向版有「已滚过区域高亮填充」，圆形版对应做成**时针扫过的刻度线变亮**：

```js
var passed = Math.round(page * 60);
for (var i = 0; i < 60; i++) {
  var isMajorT = (i % 5 === 0);
  clockTicks[i].setAttribute('stroke', i <= passed
    ? (isMajorT ? '#22D3EE' : 'rgba(34,211,238,.8)')   // 扫过：亮
    : (isMajorT ? 'rgba(34,211,238,.75)' : 'rgba(34,211,238,.3)')); // 未扫：暗
}
```

`passed = round(page × 60)` 把进度换算成「第几根刻度线」，时针指到哪、哪之前的刻度全亮——与横条的填充层语义一致。

### 4. 样式选择器：localStorage + 工具栏菜单

**数据层**：`localStorage['scroll-indicator-style']`，默认 `'ruler'`，合法值 `'ruler' | 'clock'`。

**LoadingScreen 侧**：两种样式 DOM 都渲染（`#nier-indicator-ruler` / `#nier-indicator-clock`），JS 读 localStorage 后 `display` 切换显隐：

```js
var indicatorStyle = localStorage.getItem('scroll-indicator-style') || 'ruler';
if (indicatorStyle !== 'ruler' && indicatorStyle !== 'clock') indicatorStyle = 'ruler';

function applyIndicatorStyle() {
  if (indicatorStyle === 'clock') {
    indRuler.style.display = 'none';
    indClock.style.display = '';
  } else {
    indRuler.style.display = '';
    indClock.style.display = 'none';
  }
}
```

滚动驱动里按样式分支更新：

```js
if (indicatorStyle === 'clock' && clockHand) {
  clockHand.style.transform = 'rotate(' + (page * 360) + 'deg)';
  // ...刻度高亮
} else {
  rulerKnob.style.left = (page * 100) + '%';
  if (rulerFill) rulerFill.style.width = (page * 100) + '%';
}
```

**SideToolbar 侧**：新增「指示器样式」按钮 + 下拉菜单（与「切换开场动画」菜单同款 UI）：

```js
// 选择后存 localStorage + reload（LoadingScreen 读取生效）
indMenu?.querySelectorAll('button[data-indicator]').forEach((b) => {
  b.addEventListener('click', () => {
    localStorage.setItem('scroll-indicator-style', b.dataset.indicator);
    indMenu.classList.add('hidden');
    location.reload();
  });
});
```

菜单项用 `indicator-dot` 圆点标记当前选择（`●`/`○`），点击外部关闭菜单——完全复用开场动画菜单的交互模式。

## 交互细节

- 表盘 72px、刻度半径 30px、圆心 (36,36)；主刻度 1.6px 亮青、次刻度 1px 暗淡
- 中心轴：6px 圆点（HTML div 覆盖在 SVG 上，`translate(-50%,-50%)` 居中）
- 时针 2.5px 亮青 `#7FF3FF`（比刻度 `#22D3EE` 亮一档），圆头
- 底部「SCROLL」小字 + 表盘上方「向下滚动」提示（与横条版一致），随首屏翻转淡出
- 表盘生成放在 `showEnterHint()` 里（`buildClock()`），ruler 样式时只跑显隐切换
- 位置不变：`right:10%; bottom:10%` 固定右下角，`pointer-events:none` 不挡交互

## 踩坑记录

1. **SVG transform-origin 默认 (0,0)**：时针 rotate 若不设 `transformOrigin` 会绕 SVG 左上角转，必须 `style.transformOrigin = cx + 'px ' + cy + 'px'`。CSS 类里写 `transform-origin: 36px 36px` 也可以，但内联 style 更直观且随圆心变量走
2. **刻度起始方向**：第一格默认在 3 点（角度 0 = 正右），表盘必须从 12 点起——角度计算加 `-90°` 偏移
3. **SVG 动态创建必须 `createElementNS`**：`document.createElement('line')` 创建的是 HTML 元素，append 进 SVG 不渲染。命名空间必须是 `http://www.w3.org/2000/svg`
4. **时针 transition 要短**：`.08s linear` 让跟随滚动几乎实时又有轻微阻尼感；太长（>0.2s）会滞后于滚动，看起来指针「追」进度
5. **样式切换依赖 reload**：LoadingScreen 在页面加载时读一次 localStorage，切换后必须 `location.reload()` 生效——这点与「切换开场动画」菜单一致（那个也要 reload）

## 小结

圆形表盘 + 时针把滚动进度从「横条填充」变成了「指针绕圈」的形态：60 条代码生成的刻度线 + 一根 rotate 的时针 + 扫过高亮，几何全部由 `createElementNS` 算出来，零图片资产。样式选择器则展示了「双 DOM 预置 + localStorage 切换」的通用模式——想加第三种样式（比如进度环 ring），只需再加一个 `#nier-indicator-ring` 容器 + 菜单项 + onScrollFlip 分支，三处改动即可扩展。
