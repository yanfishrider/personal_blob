// hollow-knight-topics.ts — 空洞骑士图标集（笔记页栏目）
// 4 张 AI 生成的 SVG 图标：小骑士 / 生命血 / 寻神者 / 格林
// 图片放 public/hollow-knight/，预览用 <img> 引用（base 前缀由 PreviewPanel 处理）
import type { Topic } from './anime-topics';

const base = import.meta.env.BASE_URL;

export const hollowKnightTopics: Topic[] = [
  {
    id: 'hollow-knight',
    label: '空洞骑士图标集',
    desc: `**空洞骑士**（Hollow Knight）图标集。

AI 工具生成的 4 枚 SVG 图标，左侧导航切换，右侧预览展示：

- **小骑士** — 游戏主角纯矢量剪影
- **生命血** — Lifeblood 图标
- **寻神者** — Godmaster 图标
- **格林** — 格林剧团（Grimm Troupe）图标`,
    html: `<div class="overview">
  <h1>空洞骑士</h1>
  <p>HOLLOW KNIGHT ICONS</p>
  <div class="hk-gallery">
    <img src="${base}/hollow-knight/knight.svg" alt="小骑士" />
    <img src="${base}/hollow-knight/lifeblood.svg" alt="生命血" />
    <img src="${base}/hollow-knight/godmaster.svg" alt="寻神者" />
    <img src="${base}/hollow-knight/grimm.svg" alt="格林" />
  </div>
</div>`,
    css: `.overview { text-align: center; padding: 40px 20px; color: #bbb; font-family: sans-serif; }
.overview h1 { font-size: 32px; color: #ff7b42; margin: 0 0 8px; }
.overview p { font-size: 13px; color: #888; margin: 0 0 28px; letter-spacing: 0.2em; }
.hk-gallery { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
.hk-gallery img { width: 72px; height: 72px; object-fit: contain; }`,
    js: `// 空洞骑士图标集 — 从左侧选择具体图标
console.log('👋 选择一个图标查看');`,
    children: [
      {
        id: 'hk-knight', label: '小骑士',
        desc: `**小骑士**（The Knight）—— 空洞骑士游戏主角。

纯矢量路径绘制的剪影图标（knight.svg），灰白主体 + 蓝灰描边。`,
        html: `<div class="hk-show">
  <img src="${base}/hollow-knight/knight.svg" alt="小骑士" />
  <p class="hk-sub">The Knight</p>
</div>`,
        css: `.hk-show { text-align: center; padding: 60px 20px; font-family: sans-serif; }
.hk-show img { width: 120px; height: 130px; object-fit: contain; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4)); }
.hk-sub { color: #888; font-size: 12px; letter-spacing: 0.15em; }`,
        js: `// 小骑士 — 纯矢量剪影
console.log('The Knight');`,
      },
      {
        id: 'hk-lifeblood', label: '生命血',
        desc: `**生命血**（Lifeblood）—— 空洞骑士中的生命精华图标。

蓝色菱形徽记（lifeblood.svg），内嵌位图渲染。`,
        html: `<div class="hk-show">
  <img src="${base}/hollow-knight/lifeblood.svg" alt="生命血" />
  <p class="hk-sub">Lifeblood</p>
</div>`,
        css: `.hk-show { text-align: center; padding: 60px 20px; font-family: sans-serif; }
.hk-show img { width: 110px; height: 110px; object-fit: contain; filter: drop-shadow(0 4px 12px rgba(76,175,255,0.35)); }
.hk-sub { color: #888; font-size: 12px; letter-spacing: 0.15em; }`,
        js: `// 生命血 — 生命精华
console.log('Lifeblood');`,
      },
      {
        id: 'hk-godmaster', label: '寻神者',
        desc: `**寻神者**（Godmaster）—— 空洞骑士 DLC「寻神者」图标。

神像样式徽记（godmaster.svg），内嵌位图渲染。`,
        html: `<div class="hk-show">
  <img src="${base}/hollow-knight/godmaster.svg" alt="寻神者" />
  <p class="hk-sub">Godmaster</p>
</div>`,
        css: `.hk-show { text-align: center; padding: 60px 20px; font-family: sans-serif; }
.hk-show img { width: 100px; height: 120px; object-fit: contain; filter: drop-shadow(0 4px 12px rgba(255,215,0,0.3)); }
.hk-sub { color: #888; font-size: 12px; letter-spacing: 0.15em; }`,
        js: `// 寻神者 — Godmaster
console.log('Godmaster');`,
      },
      {
        id: 'hk-grimm', label: '格林',
        desc: `**格林**（Grimm）—— 空洞骑士「格林剧团」DLC 图标。

猩红剧团徽记（grimm.svg），内嵌位图渲染。`,
        html: `<div class="hk-show">
  <img src="${base}/hollow-knight/grimm.svg" alt="格林" />
  <p class="hk-sub">Grimm Troupe</p>
</div>`,
        css: `.hk-show { text-align: center; padding: 60px 20px; font-family: sans-serif; }
.hk-show img { width: 100px; height: 115px; object-fit: contain; filter: drop-shadow(0 4px 12px rgba(255,60,60,0.35)); }
.hk-sub { color: #888; font-size: 12px; letter-spacing: 0.15em; }`,
        js: `// 格林 — Grimm Troupe
console.log('Grimm');`,
      },
      {
        id: 'hk-sonhos', label: '梦想',
        desc: `**梦想**（Sonhos）—— 空洞骑士相关图标。

柔光梦境徽记（sonhos.svg），内嵌位图渲染。`,
        html: `<div class="hk-show">
  <img src="${base}/hollow-knight/sonhos.svg" alt="梦想" />
  <p class="hk-sub">Sonhos</p>
</div>`,
        css: `.hk-show { text-align: center; padding: 60px 20px; font-family: sans-serif; }
.hk-show img { width: 105px; height: 110px; object-fit: contain; filter: drop-shadow(0 4px 12px rgba(200,180,255,0.35)); }
.hk-sub { color: #888; font-size: 12px; letter-spacing: 0.15em; }`,
        js: `// 梦想 — Sonhos
console.log('Sonhos');`,
      },
    ],
  },
];
