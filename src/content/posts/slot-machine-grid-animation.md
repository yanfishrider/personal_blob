---
title: "老虎机竖条 × 5×5 网格：排队绕行到中心消失"
description: "动画实验室第七段：竖条步进滚动挤出方块，弹射进 5×5 网格排队绕行，最后在中心缩小淡出。相位驱动状态机 + 多实例生命周期，绕开推箱子逐格陷阱。"
date: 2026-08-22
tags: ["动画", "SVG", "状态机", "前端", "Astro"]
category: "前端"
draft: false
---

## 缘起

动画实验室第七段原本是 3D 魔方，被用户移除后留空。2026-08-21 用户贴了一张示意图并口述新需求：**竖条 + 网格绕行**，配合本段的「循环播放」主题无限循环。

需求定型的四连纠正（先讨论再实现）：

1. 用户明确「不需要螺旋」——是**分层绕行**（外圈一圈 → 内圈一圈 → 中心消失），不是连续螺旋收窄
2. 首版按「推箱子式逐格移动」实现后被否（「不是这种推箱子」「就正常类似平移就行，平滑一点，慢一点」）→ 改**连续平滑滑动**
3. 又加「增加停顿，类似移动一次后延迟 1 秒」→ **步进模式**（移动一格 → 停顿 → 移动下一格）
4. 最终「每个方块到底部后都要弹射」「从右端底部开始」「他们按相同轨迹移动」→ **多实例排队**

## 结构

```html
<svg id="lab-slots" class="lab-arc lab-slots" viewBox="0 0 750 750"></svg>
```

- `slotsLoop` 常驻 rAF 时间驱动（不随滚轮进度），段显示由 `updateProgress` 的 opacity 控制
- 竖条方块、网格格子、弹射方块全部 JS 生成进 SVG

## 竖条步进滚动（相位驱动状态机）

核心思路：**相位驱动 + fresh 防重叠**，替代早期的「模运算 + 滚出隐藏」方案（后者会让竖条残缺）。

```js
var SLOTS = { barX: 200, n: 6, w: 46, h: 46, gap: 8, rx: 10, moveMs: 900, pauseMs: 1400 };
// 方块对象 { el, ph, phStart, fresh }
// ph = 相对顶部偏移（0 顶 ~ (n-1)*step 底）
slotsPhaseT += dt;
if (slotsPhase === 'move') {
  var bottomPh = (nsg.n - 1) * slotsStep;
  // move 第一帧：弹射底部方块（ph > bottomPh），顶部补入 fresh 方块
  if (slotsPhaseT <= dt) {
    slotEject();                          // 弹射副本（从底部槽位中心出发）
    removeChild(底部方块); splice 移除;
    slotBars.push({ el: makeBar(0), ph: 0, phStart: 0, fresh: true });
  }
  var mp = Math.min(slotsPhaseT / nsg.moveMs, 1);
  var easeM = mp * mp * (3 - 2 * mp);     // smoothstep
  // 非 fresh 方块：phStart + step*easeM 平滑下移
  // fresh 方块：y = baseY - step + step*easeM（从竖条上方一格平移滑入顶部）
  if (mp >= 1) {
    // 步完成：非 fresh 方块 ph 推进；全部 fresh = false（下轮参与移动）
    slotsPhase = 'pause'; slotsPhaseT = 0;
  }
} else {
  if (slotsPhaseT >= nsg.pauseMs) { slotsPhase = 'move'; slotsPhaseT = 0; /* 记录 phStart */ }
}
```

**fresh 是防重叠的关键**：补入的方块 ph=0 与还没移动的原顶部 ph=0 方块会重叠，标 fresh 让它在**本步不参与滚动**、从上方滑入，步完成才解除。早期用 opacity 隐藏兜底，最终态是「从上方平移滑入」，彻底不需要隐藏。

**eject 判定必须 `ph > bottomPh` 不能 `>=`**：步进时一个方块到达底部（ph=216）另一个同时滚出（ph=270），若用 `>=` 且只移除第一个，ph=270 的方块永远不会被移除，一路滚出容器（用户报「圆弧容器外存在一个方块」）。

## 弹射方块状态机（多实例排队）

每个滚出的方块是一个独立实例，沿**同一条轨迹**（SLOT_PATH）前后跟随：

```js
// 实例状态机：squeeze(变扁) → fly(弹射) → grid(逐格平移) → vanish(中心缩小淡出)
for (var fi = slotFlies.length - 1; fi >= 0; fi--) {   // 倒序遍历
  var f = slotFlies[fi];
  if (f.phase === 'squeeze') {
    var hh = nsg.h * (1 - 0.78 * sq);       // 高度 46 → 10（宽度不变）
    if (sq >= 1) { f.phase = 'fly'; f.t0 = t; }
  } else if (f.phase === 'fly') {
    var fe = 1 - Math.pow(1 - fp, 2);       // ease-out 弹射到网格外圈起点
    // 同时高度 0.22 → 1 恢复
  } else if (f.phase === 'grid') {
    // 每格 smoothstep 平移（moveMs）→ 停顿（pauseMs）→ 下一格
    // 相邻格坐标插值；到达最后格 → vanish
  } else if (f.phase === 'vanish') {
    // 中心点缩小 + opacity 衰减；完成 removeChild + splice
  }
}
```

- **每个到底部的方块都弹射**：不做单飞锁，间距由「弹射触发间隔（=moveMs+pauseMs）vs 每格移动时长」自然形成排队
- **弹射落点 = 网格底部**（SLOT_PATH[0] 的格中心），不是固定左上角
- **弹射的是副本**（新 rect），竖条原方块继续滚动
- 变扁只改 height，`y = sy - hh/2` 保持底边贴底

## 网格路径

```js
var SLOT_PATH = [
  // 5×5 外圈：从底部 (0,4) 起 → 右 → 上 → 左 绕一圈（16 格）
  [0,4],[1,4],[2,4],[3,4],[4,4],[4,3],[4,2],[4,1],[4,0],[3,0],[2,0],[1,0],[0,0],[0,1],[0,2],[0,3],
  // 内圈 3×3 边（8 格）→ 中心 (2,2)
  [1,3],[2,3],[3,3],[3,2],[3,1],[2,1],[1,1],[1,2],
  [2,2]
];
```

- 格坐标 → 格中心：`slotCellPos(c, r) = 网格左上角 + c*格距 + cell/2`。**必须返回格中心**，调用方按「中心 − 半宽」设 x/y——返回左上角会导致方块中心偏在格子左上角差半格（用户报「轨迹和背景线条方框没有重合」）
- **5×5 用 `-2*cs` 偏移**（4×4 时代才用 `-1.5*cs`）
- vanish 消失中心必须 = `slotCellPos(2,2)`（5×5 中心格），4×4 时代的 (1.5,1.5) 会偏左上
- 网格默认填满（25 格暗紫 fill + 描边），轨迹亮方块覆盖其上——「右边区域默认也是填满状态」

## 实战踩坑（务必按最终版做）

1. **`nsg.slotsStep` = undefined → 整段 NaN**：slotsStep/slotsBaseY 是独立全局变量（在 SLOTS 对象外赋值），误写成 `nsg.slotsStep` 得 undefined → 所有方块 y 变 NaN → 整段空白。重构后必须 grep 确认无 `nsg.slotsStep` 残留
2. **move 阶段底部方块必须停驻**（`if (phStart >= bottomPh) y 固定`），否则滚出容器底部（「竖条方块不见了」）
3. **fresh 方块最终形态 = 从上方平移滑入**（`y = baseY − step + step×easeM`），取代 v13 的 opacity 隐藏
4. **var 闭包陷阱**：for 循环 + `var cell` + 事件回调 → 回调全指向最后一个格子。必须 IIFE 捕获 `(function(cc){...})(cell)`
5. **速度调慢链**：用户连续多轮嫌快，最终 moveMs 900 / pauseMs 1400 / squeezeDur 700 / flyDur 1100 / vanishDur 650——每次说「太快了」把所有时长参数整体加 50%~80%，不要只调一个

## 验证

- Node 模拟每步后 positions 必须 = {0,step,2step,...,(n-1)step} 无重复（排序 + Set 判重），模拟 12 步全 OK
- npm run build 27 页通过
