---
title: "文字接龙小游戏实现详解：BFS 与标准杆"
description: "从单词库到邻接图，用 BFS 预计算最短路径——记录一个纯前端 4 字母单词接龙游戏的完整实现思路。"
date: 2026-08-04
tags: ["算法", "BFS", "游戏", "前端"]
category: "前端"
draft: false
---

## 起因

想做一个不用联网、打开就能玩的文字小游戏。要求足够简单——规则三句话能讲清，但玩起来又有深度，最好还能"公平"地给玩家一个挑战目标。

最后选定了经典的字梯游戏（Word Ladder）：给一个起始词和一个目标词，每次只能改一个字母，且每一步都必须是真实单词，看几步能到目标。比如：

```
COLD → CORD → CARD → WARD → WARM
```

规则简单，但"最少需要几步"这个问题，天然适合用图论解决。更妙的是，这个游戏可以完全在前端实现——词库、图、最短路径全部预计算，不需要任何后端。

## 第一步：词库

游戏核心是一个常用 4 字母英文单词库，按字母序组织，大概 500+ 个词：

```ts
const WORDS = [
  'ABLE', 'ACID', 'ACRE', 'AGED', 'AIDE', ...
];
```

词库决定了游戏的"可能性空间"：所有合法单词都是图里的节点。

## 第二步：构建邻接图

两个单词如果能互相转换（只差一个字母），就在它们之间连一条边：

```ts
function diffCount(a: string, b: string): number {
  let d = 0;
  for (let i = 0; i < 4; i++) if (a[i] !== b[i]) d++;
  return d;
}

function buildGraph(words: string[]): Map<string, string[]> {
  const g = new Map<string, string[]>();
  for (const w of words) g.set(w, []);
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      if (diffCount(words[i], words[j]) === 1) {
        g.get(words[i])!.push(words[j]);
        g.get(words[j])!.push(words[i]);
      }
    }
  }
  return g;
}
```

O(n²) 的两两比较，对 500 个词就是 12.5 万次比较，毫秒级完成，构建一次全局复用。

## 第三步：BFS 预计算"标准杆"

这是整个游戏最核心的设计。玩家的目标词是随机选的，每次开新局都要回答一个问题：**从起始词到目标词最少需要几步？**

答案用 BFS（广度优先搜索）从目标词出发，一次性算出到所有词的最近距离，顺便记录父节点（每个词的最优前驱）：

```ts
function bfsParents(target: string) {
  const dist = new Map<string, number>();
  const parent = new Map<string, string>();
  const queue = [target];
  dist.set(target, 0);

  for (let i = 0; i < queue.length; i++) {
    const cur = queue[i];
    const d = dist.get(cur)! + 1;
    for (const next of graph.get(cur) || []) {
      if (!dist.has(next)) {
        dist.set(next, d);
        parent.set(next, cur);
        queue.push(next);
      }
    }
  }
  return { dist, parent };
}
```

为什么从**目标词**出发而不是起始词？因为一次 BFS 就能算出"到目标的最短距离"这张完整地图——任何词到目标的距离都有了。玩家无论从哪个起始词开始，标准杆直接查表：

```ts
function computeGame(target: string) {
  const { dist, parent } = bfsParents(target);
  const startWords = WORDS.filter(w => w !== target && dist.has(w) && dist.get(w)! >= 2);
  return { dist, parent, startWords };
}

export function randomStart(target: string): { word: string; par: number } {
  const { dist, startWords } = computeGame(target);
  const w = startWords[Math.floor(Math.random() * startWords.length)];
  return { word: w, par: dist.get(w)! };
}
```

起始词也不是随便选的——要求它**能到达目标**（`dist.has(w)`）且**距离至少 2 步**（太近了没挑战）。这样每一局都是可解的，且标准杆真实有效。

## 第四步：提示功能 = 走父节点链

提示按钮是"白嫖" BFS 结果的最直接用法：当前词在 parent 图里查一下，直接返回朝目标方向的最优下一步：

```ts
export function getHint(word: string, target: string): string | null {
  const { parent } = computeGame(target);
  return parent.get(word.toUpperCase()) ?? null;
}
```

因为 parent 记录的就是"每个词到目标的最短路径上，它的下一个词是谁"。提示不是随机给一个相邻词，而是保证这一步确实在最优解路径上。

## 第五步：合法性校验

玩家每次提交都要校验两件事：输入的是真实单词、且与当前词只差一个字母：

```ts
export function isValidStep(from: string, to: string): boolean {
  return diffCount(from.toUpperCase(), to.toUpperCase()) === 1 && isValidWord(to);
}
```

`isValidWord` 就是查词库集合，O(1) 判断。

## 第六步：星级评分

通关后根据步数与标准杆的差距给星：

```ts
if (steps <= par) setStars(3);          // 达到或优于标准杆
else if (steps <= par + 1) setStars(2); // 标准杆 +1
else if (steps <= par + 2) setStars(1); // 标准杆 +2
else setStars(0);
```

标准杆是 BFS 证明的最优解，所以"步数 ≤ 标准杆"是理论最优——拿到 3 星意味着你找到了最短路径，这个目标明确又公平。

## 交互设计

### 目标词展示

目标词用大色块显示（每字母一格），下方显示标准杆步数。目标词的翻译、例句也一起展示，顺便学单词：

```tsx
{translate(target) && (
  <div className="mt-1.5 text-xs text-gray-500">
    <span className="font-medium text-primary-600">{translate(target)!.def}</span>
    <p className="italic mt-0.5">{translate(target)!.example}</p>
    <p className="text-gray-400">{translate(target)!.exampleZh}</p>
  </div>
)}
```

### 历史步骤可视化

每一步渲染成一行：步数序号 + 4 个字母框 + 小写单词 + 翻译。字母框带颜色反馈——和目标词相同位置的字母绿色高亮，不同位置黄色：

```tsx
if (highlight && ch === target[i]) {
  bg = 'bg-green-500 text-white';       // 位置正确
} else if (highlight) {
  bg = 'bg-yellow-100 text-yellow-800'; // 位置不对
}
```

一眼看出自己离目标还差几个字母。

### 输入框

限制 4 个字母、自动大写、过滤非字母字符，回车提交：

```tsx
onChange={e => setInput(e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 4))}
onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
```

### 词库与翻译

每个词配了中英对照：释义 + 英文例句 + 中文例句。既是游戏也是单词学习工具。翻译数据是独立模块维护的，游戏逻辑只关心词，展示层再查翻译。

## 踩坑记录

1. **标准杆必须预计算**：最初想过"玩家提交后实时 BFS 判断"，但提示按钮和星级都要反复查距离，实时算会有延迟。改成开局时一次 BFS 出整张 dist/parent 地图，后面全是 O(1) 查表。
2. **起始词不能太近**：最开始随机选词当起点，经常出现起始词和目标词只差 1 步，一上来就赢了。加 `dist >= 2` 过滤后挑战性正常。
3. **目标词要固定一批**：目标词从预设列表（FIRE/FOOD/WORD/MIND/LIFE/BOOK/GAME/LOVE/TIME 等）里随机，保证每个目标都保证有足够的可达词，不会出现死局。
4. **字母框高亮方向**：高亮比的是"和目标词同一位置是否相同"，不是"字符是否在目标词中出现过"。前者才是字梯游戏的正确反馈——你更关心位置对不对，而不是字母存不存在。
5. **翻译放手机端要换行**：桌面端翻译跟在单词后面一行显示；手机端空间不够，改成翻译放在单词下方独立一行。

## 小结

这个游戏本质上是"图论 + BFS"的玩具化应用：词库是节点，一次字母差异是边，标准杆是最短路径长度，提示是最短路径方向。

纯前端实现的优势很明显——零后端、零依赖、秒开即玩，而且把"预计算"这个思路用得很彻底：代价最高的一次 BFS 在开局时完成，之后每一次交互（校验、提示、评星）都是常数时间。以后想扩展也很容易：换词库（5 字母版）、加难度（允许 2 字母差异）、加计时模式，底层图算法完全不用动。
