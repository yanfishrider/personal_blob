---
title: "导航栏文字动画实现详解：3D 翻转与逐字上滚"
description: "用 anime.js splitText 给导航栏 Logo 做文字动画的完整记录：astro-blog 的 3D 平滑往返翻转、manda-website 的逐字上滚，以及 perspective 抖动、transform-origin 位移、loop 跳变三大坑。"
date: 2026-08-05
tags: ["anime.js", "splitText", "SVG", "动画", "踩坑", "导航栏"]
category: "前端"
draft: false
---

## 缘起

想给导航栏左侧的 Logo 文字加一个 anime.js 文字动画，两个项目都做了：
- **astro-blog**（摸鱼骑士 知识库）→ 3D 平滑往返翻转
- **manda-website**（曼大优学 - 专注教育）→ 逐字上滚（clip 包裹）

同样基于 `splitText`，最终选了两种不同方向。本文记录两种实现的完整代码和踩坑过程。

## 基础：splitText 三面模板

3D 翻转的核心是 `splitText` 的自定义 chars 模板——把每个字符包成三层"面"，构成一枚立体的硬币：

```html
<span class="char-3d word-{i}">
  <em class="face face-top">{value}</em>    <!-- 顶面：rotateX(-90°) 立起来 -->
  <em class="face-front">{value}</em>       <!-- 正面：平放正对观众 -->
  <em class="face face-bottom">{value}</em> <!-- 底面：rotateX(90°) 折下去 -->
</span>
```

- `{value}` 是字符内容，`{i}` 是字符索引
- CSS 用 `transform-style: preserve-3d` 让三个面在同一 3D 空间

```css
.char-3d {
  position: relative;
  transform-style: preserve-3d;
  transform-origin: 50% 50% 1.1rem;
}
.face { position: absolute; left: 0; opacity: 0.5; }
.face-bottom { top: 100%; transform-origin: 50% 0%; transform: rotateX(90deg); }
.face-top { bottom: 100%; transform-origin: 50% 100%; transform: rotateX(-90deg); }
```

## 坑一：perspective 透视投影放大变形

最早给容器加了 `perspective: 800px`，翻转时字符"抖动"明显。

**原因**：透视投影是近大远小——字符翻转时朝向观众的一端放大、远离的一端缩小，边缘持续伸缩。而笔记页预览（无 perspective）是正交投影，字符只均匀压扁，平滑。

**结论**：小空间（导航栏）里不要用透视，或把视距拉到 2000px+ 让变形几乎不可感知。

## 坑二：transform-origin 的 Z 值决定翻转位移

`transform-origin: 50% 50% 1.1rem` 里第三个值（Z）是旋转中心在字符前方的偏移。rotateX(-90°) 时字符绕这个偏心轴转，**字符中心会垂直移动约 Z 的距离**（1.1rem ≈ 17.6px）。

位移是固定像素，但感知强度取决于占比：
- 24px 大字 + 60vh 容器 → 占比小，平滑
- 18px 小字 + 56px 导航栏 → 占比近 100%，突兀

改 Z 只能调位移幅度（0.5rem ≈ 8px），但治标不治本。

## 坑三（关键）：loop 循环重置的瞬时跳变

最初用 `createTimeline` 顺序播放：翻转 -90° → 换面 → loop 把状态**瞬间跳回 0°**。从 -90° 跳回 0° 是突变，视觉上就是"抖一下"。这是循环动画抖动的主因，与 Z 值无关。

**修复**：改成"平滑往返"——rotateX 0 → -90° → 0（有去有回），终点=起点，loop 重置时状态无缝衔接。

## astro-blog 最终版：3D 平滑往返

```js
import { animate, stagger, splitText } from 'https://esm.sh/animejs@4.4.1';

splitText('p', {
  chars: `<span class="char-3d word-{i}">
  <em class="face face-top">{value}</em>
  <em class="face-front">{value}</em>
  <em class="face face-bottom">{value}</em>
</span>`,
});

const charsStagger = stagger(100, { start: 0 });

// 4 组动画同步：翻转 + 三面透明度同步往返，终点=起点，loop 无跳变
animate('.char-3d', {
  rotateX: [
    { to: -90, duration: 750, ease: 'out(3)' },
    { to: 0, duration: 750, ease: 'in(3)' },
  ],
  delay: charsStagger,
  loop: true,
});
animate('.char-3d .face-top', {
  opacity: [
    { to: 0, duration: 750, ease: 'out(3)' },
    { to: 0.5, duration: 750, ease: 'in(3)' },
  ],
  delay: charsStagger,
  loop: true,
});
animate('.char-3d .face-front', {
  opacity: [
    { to: 0.5, duration: 750, ease: 'out(3)' },
    { to: 1, duration: 750, ease: 'in(3)' },
  ],
  delay: charsStagger,
  loop: true,
});
animate('.char-3d .face-bottom', {
  opacity: [
    { to: 1, duration: 750, ease: 'out(3)' },
    { to: 0.5, duration: 750, ease: 'in(3)' },
  ],
  delay: charsStagger,
  loop: true,
});
```

配套 CSS 见上文（transform-origin 1.1rem，无 perspective）。

**集成方式**（astro-blog，Astro 项目）：在 BaseLayout.astro 里用 `<script is:inline>` 原样输出，动态 `import('https://esm.sh/animejs@4.4.1')`，包一层 `try/catch`，失败时文字保持静态可读。

**React 项目注意**：Header 是 `'use client'` 组件时，splitText 会破坏 React 维护的 DOM。解决方案是把 Logo 文字抽成独立 `React.memo` 组件，props 只有静态文本——Header 的滚动/菜单状态变化不会触发它 re-render，splitText 拆分的 DOM 得以保留。

## manda-website 最终版：逐字上滚（clip）

导航栏空间小，纯上下移动比 3D 翻转更稳。用 `chars: { wrap: 'clip' }`——每个字符包在裁剪容器里，滑动时溢出部分隐藏：

```js
import { animate, splitText, stagger } from 'https://esm.sh/animejs@4.4.1';

const { chars } = splitText('p', {
  chars: { wrap: 'clip' },
});

// 逐字：从下方滑入原位 → 停顿 750ms → 向上滑出，循环
animate(chars, {
  y: [
    { to: ['100%', '0%'] },
    { to: '-100%', delay: 750, ease: 'in(3)' },
  ],
  duration: 750,
  ease: 'out(3)',
  delay: stagger(50),
  loop: true,
});
```

无倾斜、无透视问题，位移完全由动画控制，可精确适配小空间。

## 小结

| 维度 | 3D 翻转（astro-blog） | 逐字上滚（manda） |
|---|---|---|
| 观感 | 立体、炫 | 干净、轻快 |
| 抖动风险 | 高（透视/位移/loop） | 低 |
| 适用空间 | 大空间 | 小空间（导航栏） |
| 关键坑 | loop 跳变 > perspective > Z 位移 | 无 |

做文字动画前先想清楚场景：**小空间优先纯移动，大空间才考虑 3D**。如果一定要 3D，记住三件事：不要透视、Z 值按字号比例、动画必须"有去有回"闭环。
