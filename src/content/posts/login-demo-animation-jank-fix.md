---
title: "从「每帧只走 0.1%」到跟手：互动登录动画卡顿的根因与 anime.js 改造"
description: "动画馆互动登录页的角色跟随「又慢又顿」。根因不是 JS 跑得不够快，而是被跟踪的属性上挂着 0.7s ease-in-out 过渡、且每帧都被重启——每帧只走完剩余距离的 0.108%。本文记录定位过程、一次没治根的尝试，以及改用 anime.js 可动画对象后的改造与验证。"
date: 2026-09-10
tags: ["动画", "anime.js", "性能", "CSS", "交互", "前端"]
category: "前端"
draft: false
---

## 缘起

上一篇文章记录了互动登录页的移植与交互定制（动画馆 04 · 互动登录）。用了一段时间后，用户反馈了一个具体问题：

> 鼠标放在其他地方时，小人的聚焦太慢，而且带有卡顿。

现象很明确：鼠标停在远处，眼睛要慢悠悠地"爬"过去；鼠标持续移动时，几乎追不上，而且动作一顿一顿的。

## 一、先定位：不是 JS 慢，是过渡被每帧重启

第一反应通常是"更新频率不够"或"计算太重"，但看了一眼 CSS 就发现关键：

```css
.eyes      { transition: all 0.7s ease-in-out; }  /* 眼睛容器，JS 每帧写它的 left/top 做跟随 */
.character { transition: all 0.7s ease-in-out; }  /* 身体倾斜也是每帧跟踪 */
.bare-pupil{ transition: transform 0.7s ease-in-out; }
.pupil     { transition: transform 0.1s ease-out; }
```

跟随逻辑是每帧把新位置写进 `style.left/top`，而**每次写都会让浏览器把过渡重新起跑**。关键在于：重启不是"接着上次的速度继续"，而是"从当前位置重新走一条完整的 0.7s 曲线"。而 `ease-in-out` 恰好是**两端慢、中间快**的曲线，它的开头几乎是平的。

把 ease-in-out 的贝塞尔 `cubic-bezier(0.42, 0, 0.58, 1)` 代进去算（0.7s 过渡、帧间隔 16.7ms）：

```
每帧处在曲线的 x = 16.7 / 700 = 0.0238
该点曲线进度   y = 0.001083
→ 每帧只走完「剩余距离」的 0.108%
→ 时间常数约 924 帧 ≈ 15.4 秒
```

也就是说：鼠标停下来时，眼睛要用 0.7s 才慢慢到位；鼠标持续移动时，目标每帧都变、过渡每帧被"刹车在起步段"，等于几乎不动。**慢和顿是同一个原因的两面。**

叠加的另外三个因素：

1. **曲线方向反了**：`ease-in-out` 适合"从 A 平稳移到 B"的离散变化，最不适合每帧重定目标的跟随。
2. **写的是 `left/top`**：这是布局属性，每帧触发 layout（不是合成层）。6 只眼 + 3 张嘴 + 4 个身体都在改，每帧 8 次以上强制重排，直接掉帧。
3. **两套时间常数对不上**：眼球容器 0.7s、紫/黑瞳孔 0.1s、橙/黄瞳孔 0.7s。瞳孔几乎瞬间到位，眼白还在爬——瞳孔贴在仍在移动的眼白上，视觉上就是抖。

## 二、第一次尝试：只治了一半

先做的是纯性能优化（不改任何视觉）：

- `mousemove` 用 `requestAnimationFrame` 合并：一帧内不管触发多少次，只跑一次更新
- 缓存元素引用：`updateCharacters()` 内的 `getElementById` 从 22 次降到 0
- 缓存几何：`getBoundingClientRect` 是强制同步重排，改为只在初始化 / resize 时量一次，每次更新的重排次数从 8 次降到 0

这些都有效（中查询次数是实打实降下来的），但**用户反馈依然卡**。原因很清楚：rAF 合并只是把"过渡重启的频率"从每个 mousemove 事件降到每帧——根因是那条过渡本身，没动它就没治根。

## 三、改用 anime.js 的可动画对象

笔记页「自定义 → 可动画」那条正好是这个问题的标准答案：`mousemove` 里反复调 `animatable.x()/.y()`。查了 anime.js 4.4.1 的源码确认语义：

```js
// dist/modules/animatable/animatable.js
this[propName] = (to, duration, ease) => {
  // 从「当前插值到的值」重新指向新目标 —— 不跳变、不需要自己维护状态
  tween._fromNumber = tween._modifier(tween._number);
  tween._toNumber = to;
  if (!isUnd(ease)) tween._ease = parseEase(ease);
  tween._currentTime = 0;
  if (!isUnd(duration)) animation.stretch(duration);
  animation.reset(true).resume();
};
```

三个关键点：每次调用**从当前值续着走**；支持按次覆盖 `(to, duration, ease)`；配置里的 `x: 320` 是该属性的默认时长。

引入方式选了**本地内置**而不是 CDN——这是个作品页，离线可用比省 40KB 重要：

```html
<script type="module">
  import { createAnimatable } from "./anime.esm.min.js";
```

### 改造思路：基准位 + 偏移

原来的代码把绝对坐标写进 `left/top`。要改走 transform，就得先分层：

- **基准位**（`left/top`）：常量，写在 HTML 里，不再变
- **偏移**（`transform`）：跟随用每帧重定目标，状态姿势用固定值 + 0.7s

```js
const TRACK_MS = 320;   // 跟随：短时长 → 跟得紧
const POSE_MS  = 700;   // 状态姿势：保持原来的节奏感
const BASE = { purpleEyes: [45, 40], blackEyes: [26, 32], /* ... */ };

function track(key, dx, dy) {          // 每帧，走 transform，不碰 layout
  send(key, "x", dx);
  send(key, "y", dy);
}
function pose(key, dx, dy) {           // 状态姿势，按次覆盖成 700ms
  send(key, "x", dx, POSE_MS);
  send(key, "y", dy, POSE_MS);
}
function place(key, left, top) {       // 基准位（常量，同值不重复写）
  const el = els[key];
  if (el.style.left !== left + "px") el.style.left = left + "px";
  if (el.style.top !== top + "px") el.style.top = top + "px";
}
```

所有状态姿势原本是绝对坐标，要换算成相对基准位的偏移（例如紫色眼睛出错态 `left: 30`、基准 45 → 偏移 `-15`）。这一步是纯机械换算，视觉目标位不变。

两个细节：

- **身体的位移用独立的 CSS `translate` 属性**，不注册进 anime 的 transform。原因有二：一是躲开 `transform` 函数顺序问题（原来是 `skewX(...) translateX(40px)`，anime 组合顺序未必一致，会导致位移带上垂直分量）；二是摇头动画 `@keyframes shakeHead` 用的正是 `translate`，两个通道互不覆盖。
- **同值不重复起 tween**：鼠标静止时 `send()` 直接跳过，避免每帧无谓地重启 24 条 tween。

## 四、验证

改动画最怕"手感变了但看不出来"。所以做了三层验证：

**1) 等价性：所有状态的最终位置逐属性比对**

写了个脚本，用同一串事件分别驱动旧版和新版，比对每个元素最终的绝对位置（`基准位 + transform 偏移`）：

```
✅ S1 默认跟随       全部元素最终位置一致
✅ S2 邮箱聚焦       全部元素最终位置一致
✅ S3 密码聚焦       全部元素最终位置一致
✅ S4 密码可见       全部元素最终位置一致
✅ S5 登录出错       全部元素最终位置一致
结论：只改了到达方式，没改去哪
```

**2) 真实跑 anime.js（jsdom）**

浏览器起不来的情况下，用 jsdom 直接把 anime 跑起来量数字。这一步暴露了一个坑：**anime 引擎用 `Date.now()` 计时，而且在模块加载时就捕获了函数引用**——必须在 `import` 之前替换 `Date.now`，否则时间不走、动画永远停在 0。

```
[1] 单帧后：第 1 帧推进到 17.1%   ← 旧的 CSS ease-in-out 是 0.108%
    21 帧后：100%，已到位
[2] 飞行中改目标 10 → 200：下一帧 42.5，从当前值继续，无跳变
[3] 连续每帧重定目标（目标每帧 +0.4px）：轨迹单调递增，滞后仅 1.1px
[4] skewX 与 CSS translate 并存，互不覆盖
[5] 按次覆盖时长：同目标下 320ms 走 26.4%，700ms 走 8.0%，参数生效
```

| 指标 | 旧（CSS 过渡） | 新（anime 可动画） |
| --- | --- | --- |
| 每帧推进（占剩余距离） | 0.108% | 17.1% |
| 到位时间 | 时间常数 ≈ 15 秒 | 21 帧（≈0.35s） |
| 每帧强制重排 | 8 次以上 | 0 |
| 写值通道 | `left/top`（layout） | `transform`（合成层） |
| 眼球 / 瞳孔时间常数 | 0.7s vs 0.1s（错位） | 同一套插值机制 |

**3) 构建 + 引用核对**

`npm run build` 通过（33 页）；脚本里 32 个 id / 选择器逐一核对在 HTML 中存在；并确认角色元素上不再残留任何跟踪类过渡（`.eyes` / `.pupil` / `.bare-pupil` / `.yellow-mouth` 已无 `transition`，`.character` 只保留 `height` 与 `translate`，`.orange-mouth` 只保留 `opacity`）。

## 经验

- **跟着鼠标走的属性，绝不能挂长过渡。** 长过渡 + 每帧重定目标 = 每帧重启 = 永远卡在最慢的起步段。要跟随就用 JS 插值（anime 可动画对象或手写 lerp），把 CSS 过渡留给离散的状态切换。
- **`ease-in-out` 和"跟随"是天生不搭**：它两端慢，适合 A→B；跟随要的是 `out`（起步快、尾段收）。
- **诊断要有数字。** "感觉慢"没有说服力，"每帧只走剩余距离的 0.108%、时间常数 15 秒"才能一眼看出问题有多离谱。
- **只治一半要如实说。** 第一轮的性能优化确实有效（重排 8→0、查询 22→0），但没解决用户报的问题，就该说清"这只治了一半"，而不是拿指标当结论。
- **改动画前先想好怎么验。** "基准位 + 偏移"的等价性脚本是这次敢动手的前提：它能证明改造只改了到达方式、没改目标位置。
- **给作品页做外部依赖时，本地内置比 CDN 稳。** 网络挂掉时，CDN 方案整个演示直接废。

## 踩坑记录

- `place()` 一开始写的是绝对坐标，配上"相对基准位的偏移"就重复计算了（最终位置 = 绝对值 + 偏移）。正确做法：`place()` 只写基准位，位移全部交给 transform。
- anime 引擎用 `Date.now()` 计时且在 import 时捕获引用 → jsdom 测试必须在 import 前替换；另外要把 `NodeList`、`getComputedStyle` 等挂到 `globalThis`，否则模块初始化就报错。
- 替换 200 行函数时，用"按索引切 `<script>` 块整体替换 + 字面量替换逐条断言命中 1 次"的脚本，比逐行打补丁稳（也避免模板字符串里的缩进被改坏）。
