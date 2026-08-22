---
title: "风水转盘：8 同心环 × 8 段弧的联动复位解谜"
description: "动画实验室第八段：点击圆环让弧段顺时针移动，联动环跟着转，目标是把每个环转回与外层颜色对齐。对齐基准打乱、入度限制、环形命中层、对齐提亮反馈。"
date: 2026-08-22
tags: ["动画", "SVG", "交互", "解谜", "Astro"]
category: "前端"
draft: false
---

## 缘起

第八段主题是「驱动引擎」，用户提出新玩法：**风水转盘**（参考鬼谷八荒堪舆风水的同心圆环解密）。8 个同心圆环，每环 8 段弧，颜色与外层 8 段圆弧对应但顺序打乱；点击圆环让弧顺时针转动，通过一步步点击把每环转回对齐状态。

需求确认的要点：

- 每个环的弧颜色 = 外层弧色（对齐基准），**以对齐为基础打乱**
- 点击环 → 该环转 1 格，联动的环转 k 格（k ∈ {1,2} 随机）
- **8 环中必定 1 个、最多 2 个独立环**（转动不影响其他环，但可以被其他环带动）
- **每个环最多只被 1 个环关联**（入度 ≤ 1），单向关联
- 鼠标移到环上显示数字提示：源环 +1，被联动环 +k

## 结构

```html
<svg id="lab-fengshui" class="lab-arc lab-fengshui" viewBox="0 0 750 750"></svg>
```

- `fsLoop` 常驻 rAF 时间驱动，段显示由 `updateProgress` 的 opacity 控制
- 每环 = 槽位暗弧（8 段固定不转）+ 彩色弧组（group rotate 驱动）+ 数字 label + 环形命中层

## 同心环与弧段

8 环半径等差分布：rMin 25 → rMax 249（步进 32），弧宽 18、环间距 14，最外环直径 498（收在 660 内圈内）。

每环 8 段弧用 circle + stroke-dasharray 分段（同引擎仪表盘做法）：

```js
var arcC = 2 * Math.PI * r;
var segDeg = (360 - segGap * 8) / 8;      // 每段弧角度（留段间空隙）
var segLen = arcC * segDeg / 360;
var segStep = segDeg + segGap;
seg.setAttribute('stroke-dasharray', segLen + ' ' + (arcC - segLen));
seg.setAttribute('stroke-dashoffset', -arcC * (i * segStep) / 360);   // 每段错开
```

**槽位暗弧**（rgba 白 0.08）直接挂 SVG 不转；**彩色弧组**（8 段弧，颜色 = 外层顺序）挂 group，转动 = `group.setAttribute('transform', 'rotate(deg cx cy)')`。8 段弧均匀分布，rotate 45° = 每段颜色移到下一槽位——视觉上"弧在槽位间滑动"，槽位不动。

## 对齐基准打乱（复位解谜的关键）

**不**打乱颜色序列，而是**固定外层顺序 + 初始旋转错位**：

```js
var fcolors = a.colors.slice();          // 固定外层顺序 = 对齐基准
var foff = Math.floor(Math.random() * 8);  // 打乱格数 0~7
var foffDeg = foff * FS.stepDeg;         // 每环初始 rotate = offset × 45°
fring.spin.cur = foffDeg; fring.spin.target = foffDeg;
```

这样每个环的"正确答案"都是转回 `cur % 360 ≡ 0`（颜色与外层一一对应），而视觉上各环错位不同、看起来是乱的。点击只能顺时针 +45°，配合联动步数，形成解谜。

## 联动生成（入度 ≤ 1）

```js
var indepN = 1 + Math.floor(Math.random() * 2);   // 独立环 1~2 个
var indepSet = {};                                  // 独立环无出边
var usedTarget = {};                                // 入度 ≤ 1 去重
for (var lki = 0; lki < 8; lki++) {
  if (indepSet[lki]) continue;
  var cands = [];
  for (var cdi = 0; cdi < 8; cdi++)
    if (cdi !== lki && !usedTarget[cdi]) cands.push(cdi);
  if (!cands.length) continue;                      // 极端情况：此环不联动
  var lt2 = cands[Math.floor(Math.random() * cands.length)];
  usedTarget[lt2] = true;
  fsLink[lki] = { target: lt2, steps: (Math.random() < 0.5) ? 1 : 2 };
}
```

- 目标随机 ≠ 自己，可以指向独立环（独立环只是不出边，可以被带动）
- 步数 1/2 随机
- 5000 次模拟验证：入度 > 1 零违规，平均联动 6.5 条

## 交互：命中层、数字提示、转动

### 命中层（踩坑记录）

**首版用实心透明圆**（fill transparent + pointer-events auto）做命中区域——最外环半径最大、最后 append 在最上层，**把内部 7 环全部挡住**，点击任何位置都只命中最外环（用户报「鼠标选中仅转动了最外侧」）。

修复：改为**环形 stroke 带**：

```js
var fhit = document.createElementNS(NS, 'circle');
fhit.setAttribute('r', fr);
fhit.setAttribute('fill', 'none');
fhit.setAttribute('stroke', 'rgba(255,255,255,0.001)');
fhit.setAttribute('stroke-width', fsg.width + 3);   // 命中带宽 < 半径步进，避免相邻环重叠
fhit.style.pointerEvents = 'stroke';                // 只命中描边区域
```

`.lab-arc` 全局 `pointer-events: none`，命中层单独 `stroke` 才能收到事件；命中带宽必须小于半径步进，否则相邻环点击区域重叠。

### 数字提示

hover 环 → 该环 label 显示 +1，联动目标环 label 显示 +steps，其他隐藏；移开全部隐藏。label 是 `<text>`，位置在环正上方 12 点方向（不同半径不重叠），`pointer-events: none` 不挡点击。

### 转动动画

```js
function fsAddSpin(ring, steps) {
  var sp = ring.spin;
  sp.from = sp.cur;                 // 从当前显示角平滑续转（连续点击不跳变）
  sp.t0 = performance.now();
  sp.target += FS.stepDeg * steps;
  sp.spinning = true;
}
// rAF：smoothstep 缓动 420ms，cur 逼近 target
```

连续点击时 `from = cur` 续转，动画自然衔接。

## 对齐反馈

```js
function fsCheckAligned() {
  var cal = (Math.abs(ring.spin.cur % 360) < 0.01);   // 复位判定
  if (cal !== ring.aligned) {                          // 状态变化才改样式
    ring.aligned = cal;
    // 对齐: brightness(2) 提亮; 未对齐: brightness(1.25)
  }
}
```

- 转动中不判定（`spinning` 时跳过），动画结束才检查
- 对齐的环一眼看出已复位，转走就变暗
- 初始 offset=0 的环立即亮起

## 尺寸迭代记录

用户多轮调整，最终态：整体缩小 25% → 弧宽增加 1.5 倍 → 再整体缩小 25% → 只缩半径加宽弧 → **半径最小约 25、最大约 250，弧宽 18**。每轮调整都要重算命中带宽与半径步进的关系，避免点击区域重叠。

## 验证

- Node 模拟：入度 ≤ 1 零违规、所有环可单独复位（≤8 次点击）、几何不重叠
- npm run build 27 页通过
- 交互实测：点击任意环（内外）独立响应 + 联动 + 对齐提亮
