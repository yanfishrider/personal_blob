import type { Topic } from './anime-topics';

/**
 * 「js动画学习」—— 全部取自「湖面」那个页面的实现。
 * 每一章都是可以直接跑的最小 demo，按顺序看下来就是湖面的搭建过程。
 */
export const jsAnimTopics: Topic[] = [
  {
    id: 'jsanim',
    label: 'js动画学习',
    desc: `**这里记录的是一套 canvas 动画的搭建方法**，素材全部来自动画馆里的「湖面」。

那一页看着复杂，拆开其实只有九件事：

1. **帧循环与 dt** — 让动画和帧率无关
2. **静态层与动态层** — 把不动的部分预渲染一次
3. **把背景画成水墨** — 模糊只在生成时用一次
4. **透视** — 越远越密、越小、越淡
5. **一笔拆成几段** — 让线有笔锋
6. **雨丝** — 景深、风向、淡入
7. **涟漪** — 椭圆、破碎的弧
8. **击水四拍** — 凹陷、水冠、飞溅、二次涟漪
9. **组装** — 把上面全部拼成湖面

每一章都可以直接改代码，右边实时看效果。

> 全部是原生 canvas 2D，没有任何依赖。`,
    html: `<div class="cover">
  <h1>js 动画学习</h1>
  <p>从一块 canvas 到一片湖面</p>
  <div class="dots"><span></span><span></span><span></span></div>
</div>`,
    css: `.cover {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100vh; gap: 10px;
  background: #fcfbf6; color: #35433f;
  font-family: system-ui, sans-serif;
}
.cover h1 { margin: 0; font-size: 30px; letter-spacing: 0.08em; font-weight: 500; }
.cover p { margin: 0; font-size: 13px; color: #7d8a86; letter-spacing: 0.16em; }
.dots { display: flex; gap: 7px; margin-top: 18px; }
.dots span {
  width: 7px; height: 7px; border-radius: 50%;
  background: #46585a; opacity: 0.3;
  animation: pulse 1.6s ease-in-out infinite;
}
.dots span:nth-child(2) { animation-delay: 0.2s; }
.dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes pulse {
  0%, 100% { opacity: 0.2; transform: translateY(0); }
  50% { opacity: 0.85; transform: translateY(-5px); }
}`,
    js: `// 从左侧目录选一章开始。每章都是独立可运行的。`,
    children: [
      /* ============================================================ */
      {
        id: 'loop',
        label: '01 帧循环与 dt',
        desc: `**问题**：如果用「每帧移动 5px」写动画，在 60Hz 屏上是每秒 300px，在 144Hz 屏上就变成 720px——动画快慢跟着显示器走了。

**解法**：用**时间差**驱动，而不是帧数。

\`\`\`
const dt = (now - last) / 1000;   // 距今多少秒
last = now;
t += dt;                          // 累计时间
\`\`\`

位置写成 \`t\` 的函数，这样无论掉不掉帧，同一时刻的位置都一样。

**两个必须处理的地方**：

- \`dt\` 要**封顶**。切到别的标签页再回来，\`now - last\` 可能是好几秒，物体一下飞出去。封在 0.1s。
- \`raf\` 的回调参数 \`now\` 是 \`performance.now()\`，第一次要初始化 \`last\`。

下面的圆点用 \`t\` 决定位置，改成 30fps 或 144fps 跑，速度都一致。`,
        html: `<canvas id="c"></canvas><div id="hud"></div>`,
        css: `html, body { margin: 0; height: 100%; overflow: hidden; background: #fcfbf6; }
canvas { display: block; width: 100%; height: 100%; }
#hud {
  position: fixed; left: 12px; bottom: 12px;
  font: 11px/1.6 ui-monospace, monospace;
  color: #6d7b78; white-space: pre;
}`,
        js: `const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
const hud = document.getElementById('hud');

let W = 0, H = 0;
function resize() {
  W = cvs.clientWidth;
  H = cvs.clientHeight;
  cvs.width = W;
  cvs.height = H;
}
window.addEventListener('resize', resize);
resize();

let last = 0;
let t = 0;

function frame(now) {
  if (!last) last = now;
  let dt = (now - last) / 1000;
  last = now;

  // 切后台再回来，dt 可能是好几秒，必须封顶
  if (dt > 0.1) dt = 0.1;
  t += dt;

  ctx.clearRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H / 2;
  const r = Math.min(W, H) * 0.3;

  // 位置只由 t 决定 —— 和帧率无关
  const a = t * 1.2;
  const x = cx + Math.cos(a) * r;
  const y = cy + Math.sin(a) * r;

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(54,66,66,0.08)';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#3a4a4a';
  ctx.fill();

  hud.textContent =
    'dt  = ' + (dt * 1000).toFixed(1) + ' ms\\n' +
    't   = ' + t.toFixed(2) + ' s\\n' +
    '位置只取决于 t';

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);`,
      },

      /* ============================================================ */
      {
        id: 'layer',
        label: '02 静态层与动态层',
        desc: `湖面的背景（纸纹、远岸、水色、横向淡墨）**一帧都没变过**，但它由上千个笔触组成。

如果每帧都重画这上千笔，帧率会直接掉一半。

**做法**：把不变的部分画到一块**离屏 canvas**，之后每帧只做一次 \`drawImage\`。

\`\`\`
bg = document.createElement('canvas');
buildBg();                 // 只在 resize 时重建

function frame() {
  ctx.drawImage(bg, 0, 0); // 每帧一次贴图
  drawMovingThings();      // 只画会动的
}
\`\`\`

代价是一块和屏幕等大的内存（1080p 约 8MB），换来的是成百上千倍的绘制量下降。

下面的背景有 600 条静态笔触，但每帧的开销只是一次 drawImage——注意左下角的帧耗时。`,
        html: `<canvas id="c"></canvas><div id="hud"></div>`,
        css: `html, body { margin: 0; height: 100%; overflow: hidden; background: #fcfbf6; }
canvas { display: block; width: 100%; height: 100%; }
#hud {
  position: fixed; left: 12px; bottom: 12px;
  font: 11px/1.6 ui-monospace, monospace;
  color: #6d7b78; white-space: pre;
}`,
        js: `const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
const hud = document.getElementById('hud');

let W = 0, H = 0;
let bg = null;

function buildBg() {
  bg = document.createElement('canvas');
  bg.width = W;
  bg.height = H;
  const g = bg.getContext('2d');

  g.fillStyle = '#fcfbf6';
  g.fillRect(0, 0, W, H);

  // 600 条静态笔触 —— 只在这一刻画一次
  for (let i = 0; i < 600; i++) {
    const t = Math.pow(Math.random(), 1.4);
    const y = H * 0.45 + (H * 0.55) * t;
    const len = 20 + 260 * t;
    g.fillStyle = 'rgba(54,66,66,' + (0.02 + 0.06 * t) + ')';
    g.fillRect(Math.random() * W, y, len * Math.random(), 0.6 + 1.4 * t);
  }
}

function resize() {
  W = cvs.clientWidth;
  H = cvs.clientHeight;
  cvs.width = W;
  cvs.height = H;
  buildBg();
}
window.addEventListener('resize', resize);
resize();

const dots = [];
for (let i = 0; i < 24; i++) {
  dots.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 60 });
}

let last = 0;
let t = 0;
let cost = 0;

function frame(now) {
  if (!last) last = now;
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.1) dt = 0.1;
  t += dt;

  const t0 = performance.now();

  ctx.drawImage(bg, 0, 0);   // 静态层：一次贴图

  for (const d of dots) {
    d.x += d.vx * dt;
    if (d.x < 0) d.x = W;
    if (d.x > W) d.x = 0;
    ctx.beginPath();
    ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(54,66,66,0.5)';
    ctx.fill();
  }

  cost = cost * 0.9 + (performance.now() - t0) * 0.1;

  hud.textContent =
    '静态笔触 600 条\\n' +
    '每帧只做 1 次 drawImage\\n' +
    '绘制耗时 ≈ ' + cost.toFixed(2) + ' ms';

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);`,
      },

      /* ============================================================ */
      {
        id: 'ink',
        label: '03 把背景画成水墨',
        desc: `水墨的质感靠**浓淡**和**洇开**，不是靠平涂。

canvas 里有个很方便但很贵的工具：\`ctx.filter = 'blur(12px)'\`。

**关键判断**：如果它只用在**生成背景**的时候，那它完全不占每帧的开销——因为背景只画一次。反过来，如果每帧都给全屏加一次模糊，帧率会从 60 掉到 13。

湖面的做法：

\`\`\`
g.filter = 'blur(10px)';   // 只在 buildBg 里
for (每一道淡墨) g.fillRect(...)
\`\`\`

先在硬边上画形体，再整体化开，比一层层调透明度更像墨。

下面的背景由「纸纹 + 一条模糊的远岸 + 十几道糊开的横笔」组成，全是预渲染。`,
        html: `<canvas id="c"></canvas><div id="hud"></div>`,
        css: `html, body { margin: 0; height: 100%; overflow: hidden; background: #fcfbf6; }
canvas { display: block; width: 100%; height: 100%; }
#hud {
  position: fixed; left: 12px; bottom: 12px;
  font: 11px/1.6 ui-monospace, monospace;
  color: #6d7b78; white-space: pre;
}`,
        js: `const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
const hud = document.getElementById('hud');
const INK = '54, 66, 66';

let W = 0, H = 0;
let bg = null;
let waterY = 0;

function buildBg() {
  bg = document.createElement('canvas');
  bg.width = W;
  bg.height = H;
  const g = bg.getContext('2d');

  waterY = H * 0.55;

  // 纸
  g.fillStyle = '#fcfbf6';
  g.fillRect(0, 0, W, H);

  // 纸纹
  for (let i = 0; i < Math.round((W * H) / 600); i++) {
    g.fillStyle = Math.random() > 0.5
      ? 'rgba(120,110,88,0.03)'
      : 'rgba(255,255,255,0.05)';
    g.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }

  // 水色底：远浓近淡
  const wg = g.createLinearGradient(0, waterY, 0, H);
  wg.addColorStop(0, 'rgba(56,76,80,0.46)');
  wg.addColorStop(0.4, 'rgba(92,110,112,0.20)');
  wg.addColorStop(1, 'rgba(140,150,144,0.05)');
  g.fillStyle = wg;
  g.fillRect(0, waterY, W, H - waterY);

  // 远岸：一条糊开的墨带
  g.filter = 'blur(3px)';
  const bg2 = g.createLinearGradient(0, waterY - 20, 0, waterY + 4);
  bg2.addColorStop(0, 'rgba(' + INK + ',0)');
  bg2.addColorStop(1, 'rgba(' + INK + ',0.30)');
  g.fillStyle = bg2;
  g.fillRect(0, waterY - 20, W, 24);

  // 横向淡墨：大模糊
  g.filter = 'blur(10px)';
  for (let i = 0; i < 14; i++) {
    const t = Math.pow(Math.random(), 1.3);
    const y = waterY + (H - waterY) * t;
    const a = (0.06 - 0.04 * t) * (0.6 + Math.random() * 0.8);
    g.fillStyle = 'rgba(' + INK + ',' + a + ')';
    g.fillRect(Math.random() * W - W * 0.3, y, W * (0.3 + Math.random() * 0.7), 10 + 40 * t);
  }

  g.filter = 'none';
}

function resize() {
  W = cvs.clientWidth;
  H = cvs.clientHeight;
  cvs.width = W;
  cvs.height = H;
  buildBg();
}
window.addEventListener('resize', resize);
resize();

let last = 0;
let t = 0;

function frame(now) {
  if (!last) last = now;
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.1) dt = 0.1;
  t += dt;

  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(bg, 0, 0);

  // 一点会动的东西，证明它确实是活的
  const x = W * (0.5 + Math.sin(t * 0.6) * 0.3);
  ctx.beginPath();
  ctx.arc(x, waterY + 30, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(54,66,66,0.6)';
  ctx.fill();

  hud.textContent = 'ctx.filter = blur() 只在 buildBg 里用了一次';

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);`,
      },

      /* ============================================================ */
      {
        id: 'depth',
        label: '04 透视：越远越密',
        desc: `湖面是「略高的视角往前看」，所以远处的波纹**又密又小又淡**，近处**又疏又长又重**。

用一个深度参数 \`t\`（0 = 远岸，1 = 最近处）就能表达全部：

\`\`\`
y      = waterY + (H - waterY) * pow(t, 1.5)   // 越远越挤
len    = 30 + 300 * t                          // 越近越长
alpha  = 0.03 + 0.13 * t                       // 越近越浓
flat   = 0.22 + 0.26 * t                       // 圆越扁
\`\`\`

\`t\` 的取值用 \`Math.pow(Math.random(), k)\` 来偏：\`k > 1\` 样本挤向远处，\`k < 1\` 挤向近处。

这里同时画了**平铺**和**按透视收缩**两种，一眼能看出差别。`,
        html: `<canvas id="c"></canvas><div id="hud"></div>`,
        css: `html, body { margin: 0; height: 100%; overflow: hidden; background: #fcfbf6; }
canvas { display: block; width: 100%; height: 100%; }
#hud {
  position: fixed; left: 12px; bottom: 12px;
  font: 11px/1.6 ui-monospace, monospace;
  color: #6d7b78; white-space: pre;
}`,
        js: `const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
const hud = document.getElementById('hud');
const INK = '54,66,66';

let W = 0, H = 0;
let waterY = 0;
const rows = [];

function build() {
  waterY = H * 0.42;
  rows.length = 0;

  for (let i = 0; i < 140; i++) {
    // pow > 1 表示样本挤向远处
    const t = Math.pow(Math.random(), 1.5);
    rows.push({
      t,
      y: waterY + (H - waterY) * Math.pow(t, 1.5),
      x: Math.random() * W,
      len: 20 + 260 * t,
      thick: 0.4 + 1.5 * t,
      alpha: 0.03 + 0.16 * t,
      phase: Math.random() * 6.28,
    });
  }
}

function resize() {
  W = cvs.clientWidth;
  H = cvs.clientHeight;
  cvs.width = W;
  cvs.height = H;
  build();
}
window.addEventListener('resize', resize);
resize();

let last = 0;
let t = 0;

function frame(now) {
  if (!last) last = now;
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.1) dt = 0.1;
  t += dt;

  ctx.clearRect(0, 0, W, H);

  // 远岸
  ctx.fillStyle = 'rgba(' + INK + ',0.18)';
  ctx.fillRect(0, waterY - 3, W, 3);

  // 近处：按透视排布
  for (const r of rows) {
    ctx.beginPath();
    const amp = 0.5 + 3 * r.t;
    for (let x = 0; x <= r.len; x += 8) {
      const yy = r.y + Math.sin(x * 0.02 + r.phase + t * 0.6) * amp;
      if (x === 0) ctx.moveTo(r.x + x, yy);
      else ctx.lineTo(r.x + x, yy);
    }
    ctx.strokeStyle = 'rgba(' + INK + ',' + r.alpha + ')';
    ctx.lineWidth = r.thick;
    ctx.stroke();
  }

  // 远处：等距排布作对比
  for (let i = 0; i < 14; i++) {
    const y = H * 0.50 + i * (H * 0.5 / 14);
    ctx.fillStyle = 'rgba(255,120,80,0.25)';
    ctx.fillRect(0, y, W, 1);
  }

  hud.textContent = '橙线 = 等距（错）   灰纹 = 按 t 收缩（对）';

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);`,
      },

      /* ============================================================ */
      {
        id: 'stroke',
        label: '05 一笔拆成几段',
        desc: `一条 \`ctx.stroke()\` 画出来的线，**从头到尾一样粗**——这是 canvas 的限制，也是「看起来像用尺子画的」的原因。

毛笔的线有起笔、行笔、收笔：中段最粗最重，两端收细变淡。

**技巧**：把一条路径切成几段，每段单独设置 \`lineWidth\` 和透明度。用一个 \`sin\` 包络控制：

\`\`\`
const env = Math.sin((i + 0.5) / segs * Math.PI);   // 0 → 1 → 0
ctx.lineWidth = thick * (0.45 + 0.7 * env);
ctx.strokeStyle = 'rgba(ink,' + alpha * (0.4 + 0.6 * env) + ')';
\`\`\`

配合 \`lineCap = 'round'\`，段与段之间不会有缺口。

左边是一条直线，右边是同一路径切 5 段——放大看边缘，质感完全不同。`,
        html: `<canvas id="c"></canvas><div id="hud"></div>`,
        css: `html, body { margin: 0; height: 100%; overflow: hidden; background: #fcfbf6; }
canvas { display: block; width: 100%; height: 100%; }
#hud {
  position: fixed; left: 12px; bottom: 12px;
  font: 11px/1.6 ui-monospace, monospace;
  color: #6d7b78;
}`,
        js: `const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
const hud = document.getElementById('hud');
const INK = '54,66,66';

let W = 0, H = 0;
function resize() {
  W = cvs.clientWidth;
  H = cvs.clientHeight;
  cvs.width = W;
  cvs.height = H;
}
window.addEventListener('resize', resize);
resize();

function wave(y, phase) {
  const pts = [];
  const n = 40;
  for (let i = 0; i <= n; i++) {
    const x = W * 0.1 + (W * 0.8) * (i / n);
    pts.push([x, y + Math.sin(i / n * Math.PI * 2 + phase) * 14]);
  }
  return pts;
}

function drawPlain(pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = 'rgba(' + INK + ',0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawBrush(pts, segs) {
  const n = pts.length;
  for (let s = 0; s < segs; s++) {
    const a0 = Math.floor((s / segs) * (n - 1));
    const a1 = Math.floor(((s + 1) / segs) * (n - 1));
    if (a1 <= a0) continue;

    // 中段最重，两端收笔
    const env = Math.sin(((s + 0.5) / segs) * Math.PI);

    ctx.beginPath();
    ctx.moveTo(pts[a0][0], pts[a0][1]);
    for (let i = a0 + 1; i <= a1; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.lineWidth = 2 * (0.45 + 1.1 * env);
    ctx.strokeStyle = 'rgba(' + INK + ',' + (0.25 + 0.6 * env) + ')';
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

let last = 0;
let t = 0;

function frame(now) {
  if (!last) last = now;
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.1) dt = 0.1;
  t += dt;

  ctx.clearRect(0, 0, W, H);

  drawPlain(wave(H * 0.3, t * 0.4));
  drawBrush(wave(H * 0.7, t * 0.4), 5);

  ctx.font = '11px ui-monospace, monospace';
  ctx.fillStyle = '#8a938f';
  ctx.fillText('单次 stroke', W * 0.1, H * 0.3 - 34);
  ctx.fillText('切 5 段 + 包络', W * 0.1, H * 0.7 - 34);

  hud.textContent = '粗细与浓淡沿笔势变化';

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);`,
      },

      /* ============================================================ */
      {
        id: 'rain',
        label: '06 雨丝',
        desc: `雨不是「点」，是**线**。而且有三个容易做错的地方：

**① 景深**
远处的雨又短又淡又慢，近处又长又重又快。用一个 \`layer\` 决定这三组参数。

**② 风向**
雨丝是斜的。关键是**落点要沿同一条斜线**，否则看着像横着飘过来的。

\`\`\`
x0 = landX - 下落距离 * wind;   // 起点按落点倒推
x += v * wind * dt;             // 下落时横向同步位移
\`\`\`

**③ 淡入**
如果雨滴直接在某个位置出现，会「啪」地闪一下。给它 0.15 秒的 alpha 斜坡。

这里的雨落地会消失（真正的水花在第八章）。`,
        html: `<canvas id="c"></canvas><div id="hud"></div>`,
        css: `html, body { margin: 0; height: 100%; overflow: hidden; background: #fcfbf6; }
canvas { display: block; width: 100%; height: 100%; }
#hud {
  position: fixed; left: 12px; bottom: 12px;
  font: 11px/1.6 ui-monospace, monospace;
  color: #6d7b78; white-space: pre;
}`,
        js: `const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
const hud = document.getElementById('hud');
const INK = '54,66,66';
const WIND = 0.38;          // 横:纵 ≈ 21 度

let W = 0, H = 0;
function resize() {
  W = cvs.clientWidth;
  H = cvs.clientHeight;
  cvs.width = W;
  cvs.height = H;
}
window.addEventListener('resize', resize);
resize();

const drops = [];

function spawn() {
  const layer = Math.random() < 0.45 ? 0 : (Math.random() < 0.6 ? 1 : 2);
  const landX = W * (0.06 + Math.random() * 0.88);
  const yImp = H * (0.15 + Math.random() * 0.8);
  const v = [200, 450, 780][layer] * (0.9 + Math.random() * 0.2);
  const wind = WIND * (0.85 + Math.random() * 0.3);
  const gap = 120 + Math.random() * 300;

  drops.push({
    x: landX - gap * wind,
    y: yImp - gap,
    landX,
    yImp,
    wind,
    v,
    age: 0,
    len: [14, 24, 44][layer] * (0.85 + Math.random() * 0.3),
    w: [0.7, 1.05, 1.5][layer],
    a: [0.14, 0.20, 0.28][layer],
  });
}

let last = 0, t = 0, next = 0;

function frame(now) {
  if (!last) last = now;
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.1) dt = 0.1;
  t += dt;

  ctx.clearRect(0, 0, W, H);

  if (t > next) {
    spawn();
    next = t + 0.13 + Math.random() * 0.13;
  }

  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i];
    d.y += d.v * dt;
    d.x += d.v * d.wind * dt;
    d.age += dt;

    const fade = Math.min(1, d.age / 0.15);
    const tilt = d.len * d.wind;

    ctx.beginPath();
    ctx.moveTo(d.x, d.y - d.len);
    ctx.lineTo(d.x + tilt, d.y);
    ctx.strokeStyle = 'rgba(' + INK + ',' + d.a * fade + ')';
    ctx.lineWidth = d.w;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 笔头更实一点
    ctx.beginPath();
    ctx.moveTo(d.x + tilt * 0.5, d.y - d.len * 0.4);
    ctx.lineTo(d.x + tilt, d.y);
    ctx.strokeStyle = 'rgba(' + INK + ',' + d.a * 1.45 * fade + ')';
    ctx.lineWidth = d.w * 0.85;
    ctx.stroke();

    if (d.y >= d.yImp) {
      drops.splice(i, 1);
      ctx.beginPath();
      ctx.ellipse(d.landX, d.yImp, 6, 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + INK + ',0.08)';
      ctx.fill();
    }
  }

  hud.textContent =
    '三档景深：远 45% / 中 35% / 近 20%\\n' +
    '风向 ' + WIND + '（约 21°）\\n' +
    '在飞的雨滴：' + drops.length;

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);`,
      },

      /* ============================================================ */
      {
        id: 'ripple',
        label: '07 涟漪',
        desc: `水面的涟漪有三个特征，缺一个就假：

**① 是椭圆**
我们是斜着看水面的，圆在水里会被压扁。扁的程度跟深度有关：

\`\`\`
flat = 0.22 + 0.26 * t     // 远处 0.22，近处 0.48
\`\`\`

**② 不是闭合的**
完整的圆圈像画上去的。真实的波前会被水面打散，只看到一段弧。

\`\`\`
ctx.ellipse(x, y, r, r * flat, 0, gap, gap + span);
\`\`\`

\`gap\` 是起始角（随机），\`span\` 是弧度长度（约 140–250°）。

**③ 生命曲线**
半径越扩越慢，透明度按 \`(1 - u)²\` 衰减——先清楚，然后很快淡掉。

点击水面试试。`,
        html: `<canvas id="c"></canvas><div id="hud"></div>`,
        css: `html, body { margin: 0; height: 100%; overflow: hidden; background: #fcfbf6; cursor: crosshair; }
canvas { display: block; width: 100%; height: 100%; }
#hud {
  position: fixed; left: 12px; bottom: 12px;
  font: 11px/1.6 ui-monospace, monospace;
  color: #6d7b78;
}`,
        js: `const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
const hud = document.getElementById('hud');
const INK = '54,66,66';

let W = 0, H = 0;
function resize() {
  W = cvs.clientWidth;
  H = cvs.clientHeight;
  cvs.width = W;
  cvs.height = H;
}
window.addEventListener('resize', resize);
resize();

const rings = [];

function addRing(x, y, power) {
  const t = Math.max(0, Math.min(1, y / H));
  const flat = 0.22 + 0.26 * t;

  // 两道，第二道稍晚
  for (let i = 0; i < 2; i++) {
    rings.push({
      x, y,
      r: 2 + i * 3,
      flat,
      grow: (26 + 92 * t) * power * (1 - i * 0.2),
      life: -i * 0.17,
      dur: 2.1 + 1.2 * t,
      gap: Math.random() * 6.283,
      span: 2.4 + Math.random() * 1.9,
      a: (0.30 - i * 0.08) * power,
    });
  }
}

cvs.addEventListener('pointerdown', (e) => {
  const r = cvs.getBoundingClientRect();
  addRing(e.clientX - r.left, e.clientY - r.top, 1.2);
});

let last = 0, t = 0, next = 0.5;

function frame(now) {
  if (!last) last = now;
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.1) dt = 0.1;
  t += dt;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fcfbf6';
  ctx.fillRect(0, 0, W, H);

  if (t > next) {
    addRing(Math.random() * W, H * (0.2 + Math.random() * 0.7), 1);
    next = t + 0.5 + Math.random() * 0.9;
  }

  for (let i = rings.length - 1; i >= 0; i--) {
    const g = rings[i];
    g.life += dt;
    if (g.life < 0) continue;

    const u = g.life / g.dur;
    if (u >= 1) { rings.splice(i, 1); continue; }

    g.r += g.grow * dt * (1 - u * 0.7);
    const a = g.a * (1 - u) * (1 - u);

    // 宽而淡的洇
    ctx.beginPath();
    ctx.ellipse(g.x, g.y, g.r, Math.max(0.8, g.r * g.flat), 0, g.gap, g.gap + g.span);
    ctx.strokeStyle = 'rgba(' + INK + ',' + a * 0.4 + ')';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // 细而实的芯
    ctx.beginPath();
    ctx.ellipse(g.x, g.y, g.r, Math.max(0.8, g.r * g.flat), 0, g.gap, g.gap + g.span);
    ctx.strokeStyle = 'rgba(' + INK + ',' + a + ')';
    ctx.lineWidth = 0.9;
    ctx.stroke();
  }

  hud.textContent = '点击水面 · 涟漪数：' + rings.length;

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);`,
      },

      /* ============================================================ */
      {
        id: 'impact',
        label: '08 击水四拍',
        desc: `一滴水砸进水面，其实分四拍发生。按时间铺开就有戏：

| 时间 | 现象 | 画法 |
|---|---|---|
| 0–180ms | **凹陷** | 径向渐变压暗，纵向压扁 |
| 0–500ms | **水冠** | 快速外扩的环，用 sin 包络 |
| 120ms–3s | **涟漪** | 两道错峰展开 |
| 0–600ms | **飞溅** | 抛物线小水珠 |

最容易漏掉的是最后一拍的**二次涟漪**：飞溅的水珠落回水面，会再起一个很小的圈。加上这个小细节，整个击水才「落地」。

凹陷用 \`ctx.scale(1, 0.44)\` 把圆压成椭圆再画径向渐变——因为水面是斜着看的。

点击试试。`,
        html: `<canvas id="c"></canvas><div id="hud"></div>`,
        css: `html, body { margin: 0; height: 100%; overflow: hidden; background: #fcfbf6; cursor: crosshair; }
canvas { display: block; width: 100%; height: 100%; }
#hud {
  position: fixed; left: 12px; bottom: 12px;
  font: 11px/1.6 ui-monospace, monospace;
  color: #6d7b78;
}`,
        js: `const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
const hud = document.getElementById('hud');
const INK = '54,66,66';

let W = 0, H = 0;
function resize() {
  W = cvs.clientWidth;
  H = cvs.clientHeight;
  cvs.width = W;
  cvs.height = H;
}
window.addEventListener('resize', resize);
resize();

const craters = [], crowns = [], rings = [], splashes = [];

function impact(px, py, power) {
  const t = Math.max(0, Math.min(1, py / H));
  const flat = 0.22 + 0.26 * t;

  craters.push({ x: px, y: py, t: 0, dur: 0.18, r: (8 + 16 * t) * power, a: 0.5, flat });

  crowns.push({
    x: px, y: py, t: 0, dur: 0.5,
    grow: (60 + 150 * t) * power,
    flat, a: 0.26,
    gap: Math.random() * 6.283,
    span: 3.6 + Math.random() * 2,
  });

  for (let i = 0; i < 2; i++) {
    rings.push({
      x: px, y: py, r: 2 + i * 3, flat,
      grow: (26 + 92 * t) * power * (1 - i * 0.2),
      life: -i * 0.17,
      dur: 2.1 + 1.2 * t,
      gap: Math.random() * 6.283,
      span: 2.4 + Math.random() * 1.9,
      a: (0.22 - i * 0.06) * power,
    });
  }

  const n = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    splashes.push({
      x: px, y: py,
      vx: (Math.random() - 0.5) * 120,
      vy: -70 - Math.random() * 130,
      land: py, t: 0, dur: 0.5,
      size: 0.8 + 1.6 * t, flat,
    });
  }
}

cvs.addEventListener('pointerdown', (e) => {
  const r = cvs.getBoundingClientRect();
  impact(e.clientX - r.left, e.clientY - r.top, 1.2);
});

let last = 0, t = 0, next = 0.6;

function frame(now) {
  if (!last) last = now;
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.1) dt = 0.1;
  t += dt;

  ctx.fillStyle = '#fcfbf6';
  ctx.fillRect(0, 0, W, H);

  if (t > next) {
    impact(W * (0.2 + Math.random() * 0.6), H * (0.2 + Math.random() * 0.6), 1);
    next = t + 0.8 + Math.random() * 1.2;
  }

  // 凹陷
  for (let i = craters.length - 1; i >= 0; i--) {
    const c = craters[i];
    c.t += dt;
    const u = c.t / c.dur;
    if (u >= 1) { craters.splice(i, 1); continue; }

    const r = c.r * (0.45 + u * 0.85);
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.scale(1, c.flat * 2.2);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, 'rgba(' + INK + ',' + c.a * (1 - u) + ')');
    g.addColorStop(1, 'rgba(' + INK + ',0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 水冠
  for (let i = crowns.length - 1; i >= 0; i--) {
    const c = crowns[i];
    c.t += dt;
    const u = c.t / c.dur;
    if (u >= 1) { crowns.splice(i, 1); continue; }

    const env = Math.sin(Math.min(1, u * 1.5) * Math.PI * 0.9);
    const r = 1 + c.grow * (1 - Math.pow(1 - u, 2.2));

    ctx.beginPath();
    ctx.ellipse(c.x, c.y, r, Math.max(0.7, r * c.flat), 0, c.gap, c.gap + c.span);
    ctx.strokeStyle = 'rgba(' + INK + ',' + c.a * env * 0.55 + ')';
    ctx.lineWidth = 2.4 * env + 0.4;
    ctx.stroke();
  }

  // 涟漪
  for (let i = rings.length - 1; i >= 0; i--) {
    const g = rings[i];
    g.life += dt;
    if (g.life < 0) continue;
    const u = g.life / g.dur;
    if (u >= 1) { rings.splice(i, 1); continue; }

    g.r += g.grow * dt * (1 - u * 0.7);
    const a = g.a * (1 - u) * (1 - u);

    ctx.beginPath();
    ctx.ellipse(g.x, g.y, g.r, Math.max(0.8, g.r * g.flat), 0, g.gap, g.gap + g.span);
    ctx.strokeStyle = 'rgba(' + INK + ',' + a * 0.4 + ')';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(g.x, g.y, g.r, Math.max(0.8, g.r * g.flat), 0, g.gap, g.gap + g.span);
    ctx.strokeStyle = 'rgba(' + INK + ',' + a + ')';
    ctx.lineWidth = 0.9;
    ctx.stroke();
  }

  // 飞溅 + 落地二次涟漪
  for (let i = splashes.length - 1; i >= 0; i--) {
    const s = splashes[i];
    s.t += dt;
    s.vy += 700 * dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;

    const u = s.t / s.dur;
    if (u >= 1 || (s.vy > 0 && s.y >= s.land)) {
      rings.push({
        x: s.x, y: s.y, r: 1, flat: s.flat,
        grow: 12, life: 0, dur: 1.1, a: 0.10,
        gap: Math.random() * 6.283, span: 3.2,
      });
      splashes.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.ellipse(s.x, s.y, s.size, s.size * 1.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + INK + ',' + 0.42 * (1 - u) + ')';
    ctx.fill();
  }

  hud.textContent =
    '凹陷 ' + craters.length + ' · 水冠 ' + crowns.length +
    ' · 涟漪 ' + rings.length + ' · 飞溅 ' + splashes.length;

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);`,
      },

      /* ============================================================ */
      {
        id: 'scene',
        label: '09 组装成湖面',
        desc: `把前八章拼起来，就是动画馆里的那个页面。

结构的顺序很重要：

\`\`\`
静态层（预渲染）
  ↓ drawImage
水纹笔触（动态漂移）
  ↓
凹陷 → 水冠 → 涟漪 → 飞溅
  ↓
雨丝（画在最上层，因为最近）
\`\`\`

**性能三条**（都踩过坑）：

1. \`ctx.filter\` 绝不能出现在每帧里 —— 只在 buildBg 用
2. \`imageSmoothingQuality\` 保持 \`'low'\`，\`'high'\` 会掉到 13fps
3. 遍历数组删除元素时**倒序**循环，\`for (let i = arr.length - 1; i >= 0; i--)\`

这一版是精简过的，省掉了纸纹、远岸、深度渐变，但骨架和原页面完全一样。`,
        html: `<canvas id="c"></canvas><div id="hud"></div>`,
        css: `html, body { margin: 0; height: 100%; overflow: hidden; background: #fcfbf6; }
canvas { display: block; width: 100%; height: 100%; }
#hud {
  position: fixed; left: 12px; bottom: 12px;
  font: 11px/1.6 ui-monospace, monospace;
  color: #6d7b78; white-space: pre;
}`,
        js: `const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
const hud = document.getElementById('hud');
const INK = '54,66,66';
const WIND = 0.38;
const WATER_A = 0.78;

let W = 0, H = 0, waterY = 0;
let bg = null;

const ripples = [];
const rings = [];
const craters = [];
const crowns = [];
const splashes = [];
const drops = [];

function buildBg() {
  bg = document.createElement('canvas');
  bg.width = W;
  bg.height = H;
  const g = bg.getContext('2d');
  waterY = H * 0.6;

  g.fillStyle = '#fcfbf6';
  g.fillRect(0, 0, W, H);

  const wg = g.createLinearGradient(0, waterY, 0, H);
  wg.addColorStop(0, 'rgba(56,76,80,0.52)');
  wg.addColorStop(0.5, 'rgba(96,112,114,0.20)');
  wg.addColorStop(1, 'rgba(140,150,144,0.05)');
  g.fillStyle = wg;
  g.fillRect(0, waterY, W, H - waterY);

  g.filter = 'blur(3px)';
  const shore = g.createLinearGradient(0, waterY - 18, 0, waterY + 4);
  shore.addColorStop(0, 'rgba(' + INK + ',0)');
  shore.addColorStop(1, 'rgba(' + INK + ',0.28)');
  g.fillStyle = shore;
  g.fillRect(0, waterY - 18, W, 22);

  g.filter = 'blur(10px)';
  for (let i = 0; i < 12; i++) {
    const t = Math.pow(Math.random(), 1.3);
    g.fillStyle = 'rgba(' + INK + ',' + (0.05 - 0.03 * t) + ')';
    g.fillRect(Math.random() * W - W * 0.2, waterY + (H - waterY) * t, W * 0.5, 8 + 30 * t);
  }
  g.filter = 'none';

  ripples.length = 0;
  for (let i = 0; i < 90; i++) {
    const t = Math.pow(Math.random(), 0.9);
    ripples.push({
      x: Math.random() * W,
      y: waterY + (H - waterY) * Math.pow(t, 1.45),
      t,
      len: 30 + 260 * t,
      amp: 0.5 + 3 * t,
      thick: 0.5 + 1.3 * t,
      alpha: 0.04 + 0.14 * t,
      phase: Math.random() * 6.28,
      drift: (Math.random() - 0.5) * 12,
    });
  }
}

function resize() {
  W = cvs.clientWidth;
  H = cvs.clientHeight;
  cvs.width = W;
  cvs.height = H;
  buildBg();
}
window.addEventListener('resize', resize);
resize();

function impact(px, py, power) {
  const t = Math.max(0, Math.min(1, (py - waterY) / (H - waterY)));
  const flat = 0.22 + 0.26 * t;

  craters.push({ x: px, y: py, t: 0, dur: 0.18, r: (7 + 15 * t) * power, a: 0.5, flat });
  crowns.push({
    x: px, y: py, t: 0, dur: 0.45, grow: (60 + 150 * t) * power,
    flat, a: 0.24, gap: Math.random() * 6.283, span: 3.6 + Math.random() * 2,
  });

  for (let i = 0; i < 2; i++) {
    rings.push({
      x: px, y: py, r: 2 + i * 3, flat,
      grow: (26 + 92 * t) * power * (1 - i * 0.2),
      life: -i * 0.17, dur: 2.1 + 1.2 * t,
      gap: Math.random() * 6.283, span: 2.4 + Math.random() * 1.9,
      a: (0.20 - i * 0.055) * power,
    });
  }

  for (let i = 0; i < 3; i++) {
    splashes.push({
      x: px, y: py,
      vx: (Math.random() - 0.5) * 110,
      vy: -60 - Math.random() * 120,
      land: py, t: 0, dur: 0.5, size: 0.7 + 1.4 * t, flat,
    });
  }
}

let last = 0, t = 0, nextRain = 0;

function frame(now) {
  if (!last) last = now;
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.1) dt = 0.1;
  t += dt;

  ctx.drawImage(bg, 0, 0);

  // 水纹
  for (const r of ripples) {
    r.x += r.drift * dt;
    if (r.x > W) r.x = -r.len;
    if (r.x + r.len < 0) r.x = W;

    ctx.beginPath();
    for (let x = 0; x <= r.len; x += 8) {
      const y = r.y + Math.sin(x * 0.019 + r.phase + t * 0.45) * r.amp;
      if (x === 0) ctx.moveTo(r.x + x, y);
      else ctx.lineTo(r.x + x, y);
    }
    ctx.strokeStyle = 'rgba(' + INK + ',' + r.alpha + ')';
    ctx.lineWidth = r.thick;
    ctx.stroke();
  }

  // 雨
  if (t > nextRain) {
    const layer = Math.random() < 0.45 ? 0 : (Math.random() < 0.6 ? 1 : 2);
    const yImp = waterY + (H - waterY) * Math.pow(Math.random(), 1.15);
    const landX = W * (0.06 + Math.random() * 0.88);
    const v = [200, 450, 780][layer];
    const wind = WIND * (0.85 + Math.random() * 0.3);
    const gap = 170 + Math.random() * 300;

    drops.push({
      x: landX - gap * wind, y: yImp - gap, landX, yImp, wind, v, age: 0,
      len: [14, 24, 44][layer], w: [0.7, 1.05, 1.5][layer], a: [0.14, 0.20, 0.28][layer],
    });
    nextRain = t + 0.16 + Math.random() * 0.2;
  }

  // 击水
  for (let i = craters.length - 1; i >= 0; i--) {
    const c = craters[i];
    c.t += dt;
    const u = c.t / c.dur;
    if (u >= 1) { craters.splice(i, 1); continue; }

    const r = c.r * (0.45 + u * 0.85);
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.scale(1, c.flat * 2.2);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, 'rgba(' + INK + ',' + c.a * (1 - u) + ')');
    g.addColorStop(1, 'rgba(' + INK + ',0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (let i = crowns.length - 1; i >= 0; i--) {
    const c = crowns[i];
    c.t += dt;
    const u = c.t / c.dur;
    if (u >= 1) { crowns.splice(i, 1); continue; }

    const env = Math.sin(Math.min(1, u * 1.5) * Math.PI * 0.9);
    const r = 1 + c.grow * (1 - Math.pow(1 - u, 2.2));
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, r, Math.max(0.7, r * c.flat), 0, c.gap, c.gap + c.span);
    ctx.strokeStyle = 'rgba(' + INK + ',' + c.a * env * 0.55 + ')';
    ctx.lineWidth = 2.4 * env + 0.4;
    ctx.stroke();
  }

  for (let i = rings.length - 1; i >= 0; i--) {
    const g = rings[i];
    g.life += dt;
    if (g.life < 0) continue;
    const u = g.life / g.dur;
    if (u >= 1) { rings.splice(i, 1); continue; }

    g.r += g.grow * dt * (1 - u * 0.7);
    const a = g.a * (1 - u) * (1 - u);

    ctx.beginPath();
    ctx.ellipse(g.x, g.y, g.r, Math.max(0.8, g.r * g.flat), 0, g.gap, g.gap + g.span);
    ctx.strokeStyle = 'rgba(' + INK + ',' + a * 0.4 + ')';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(g.x, g.y, g.r, Math.max(0.8, g.r * g.flat), 0, g.gap, g.gap + g.span);
    ctx.strokeStyle = 'rgba(' + INK + ',' + a + ')';
    ctx.lineWidth = 0.9;
    ctx.stroke();
  }

  for (let i = splashes.length - 1; i >= 0; i--) {
    const s = splashes[i];
    s.t += dt;
    s.vy += 700 * dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;

    const u = s.t / s.dur;
    if (u >= 1 || (s.vy > 0 && s.y >= s.land)) {
      rings.push({
        x: s.x, y: s.y, r: 1, flat: s.flat,
        grow: 12, life: 0, dur: 1.1, a: 0.09,
        gap: Math.random() * 6.283, span: 3.2,
      });
      splashes.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.ellipse(s.x, s.y, s.size, s.size * 1.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + INK + ',' + 0.42 * (1 - u) + ')';
    ctx.fill();
  }

  // 雨丝在最上层
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i];
    d.y += d.v * dt;
    d.x += d.v * d.wind * dt;
    d.age += dt;

    const fade = Math.min(1, d.age / 0.15);
    const tilt = d.len * d.wind;

    ctx.beginPath();
    ctx.moveTo(d.x, d.y - d.len);
    ctx.lineTo(d.x + tilt, d.y);
    ctx.strokeStyle = 'rgba(' + INK + ',' + d.a * fade + ')';
    ctx.lineWidth = d.w;
    ctx.lineCap = 'round';
    ctx.stroke();

    if (d.y >= d.yImp) {
      impact(d.landX, d.yImp, 1);
      drops.splice(i, 1);
    }
  }

  hud.textContent =
    '雨 ' + drops.length + ' · 涟漪 ' + rings.length +
    ' · 飞溅 ' + splashes.length + '\\n' +
    '全场景 ≈ 200 个活动对象，60fps';

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);`,
      },
    ],
  },
];
