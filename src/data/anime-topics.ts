export interface SubItem {
  id: string; label: string; desc: string; html: string; css: string; js: string;
  children?: SubItem[];
}

export interface Topic {
  id: string; label: string; desc: string;
  html: string; css: string; js: string;
  children?: SubItem[];
}

export const topics: Topic[] = [
  {
    id: 'intro', label: '入门',
    desc: `**anime.js** 是一个轻量级 JavaScript 动画库。

\`anime({ targets, ... })\` 是核心 API：
- **targets**: CSS 选择器，指定要动画的元素
- **属性**: translateX, rotate, scale, backgroundColor...
- **duration**: 动画时长 (ms)
- **easing**: 缓动函数
- **loop**: 是否循环

修改左侧代码，预览区会实时更新。JS 编辑器里按 **Ctrl+Space** 获取补全提示。`,
    html: `<div class="box"></div>\n<div class="box"></div>\n<div class="box"></div>\n<div class="box"></div>\n<div class="box"></div>`,
    css: `.box {\n  width: 40px; height: 40px; border-radius: 8px;\n  display: inline-block; margin: 8px;\n  background: #5b6cff;\n}`,
    js: `import anime from 'https://esm.sh/animejs@3.2.2';

// anime.js 基础 — Ctrl+Space 触发补全
anime({\n  targets: '.box',\n  translateX: 200,\n  scale: [1, 1.4, 1],\n  rotate: '1turn',\n  backgroundColor: ['#5b6cff', '#ff6b6b', '#51cf66', '#ffd43b', '#cc5de8'],\n  duration: 2000,\n  delay: anime.stagger(100),\n  easing: 'easeInOutQuad',\n  loop: true,\n  direction: 'alternate',\n});`,
  },
  {
    id: 'timer', label: '计时器',
    desc: `**计时器** 用于调度和控制定时回调，可作为 setTimeout() 或 setInterval() 的替代方案，以保持动画与回调的同步。

计时器通过从主 \`animejs\` 模块中导入的 \`createTimer()\` 方法创建：
\`\`\`
import { createTimer } from 'animejs';
const timer = createTimer(parameters);
\`\`\`

**参数**: 包含 计时器播放设置 和 计时器回调 的 Object

**返回**: Timer 实例`,
    html: `<div class="docs-demo-html">
  <div class="large centered row">
    <div class="half col">
      <pre class="large log row">
        <span class="label">current time</span>
        <span class="value lcd">0</span>
      </pre>
    </div>
    <div class="half col">
      <pre class="large log row">
        <span class="label">callback fired</span>
        <span class="value lcd">0</span>
      </pre>
    </div>
  </div>
</div>`,
    css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }`,
    js: `import { createTimer, utils } from 'https://esm.sh/animejs';

const fmt = t => (t / 1000).toFixed(3) + 's';
const [ $time, $count ] = utils.$('.value');

createTimer({
  duration: 1000,
  loop: true,
  frameRate: 30,
  onUpdate: self => $time.innerHTML = fmt(self.currentTime),
  onLoop: self => $count.innerHTML = self._currentIteration
});`,
    children: [
      {
        id: 'timer-config', label: '播放设置',
        html: `<div class="info">计时器就绪</div>`,
        css: `.info { color: #ff7b42; font-family: 'Courier New', monospace; font-size: 18px; }`,
        js: `// 播放设置：点击左侧子项查看各参数\nconsole.log('选择一个子项');`,
        children: [
          { id: 't-delay', label: '延迟',
            html: `<div class="docs-demo-html">
  <div class="large centered row">
    <div class="half col">
      <div class="log">
        <span class="label">current time</span>
        <span class="time value lcd">0</span>
      </div>
    </div>
  </div>
</div>`,
            css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }`,
            js: `import { createTimer, utils } from 'https://esm.sh/animejs';

const fmt = t => (t / 1000).toFixed(3) + 's';
const [ $time ] = utils.$('.time');

createTimer({
  delay: 2000,
  onUpdate: self => $time.innerHTML = fmt(self.currentTime)
});` },
          { id: 't-duration', label: '持续时间',
            desc: `**持续时间** 定义定时器的总运行时长（毫秒）。\n\n将持续时间设置为 0 会使定时器在播放时立即完成。\n\n**接受**\n一个大于或等于 0 的 Number 数值。\n\n大于 1e12 的持续时间值将在内部被限制为 1e12（约 32 年）。\n\n**默认值**\n无限`,
            html: `<div class="docs-demo-html">
  <div class="large centered row">
    <div class="half col">
      <div class="log">
        <span class="label">current time</span>
        <span class="time value lcd">0</span>
      </div>
    </div>
  </div>
</div>`,
            css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }`,
            js: `import { createTimer, utils } from 'https://esm.sh/animejs';

const fmt = t => (t / 1000).toFixed(3) + 's';
const [ $time ] = utils.$('.time');

createTimer({
  duration: 2000,
  onUpdate: self => $time.innerHTML = fmt(self.currentTime)
});` },
          { id: 't-loop', label: '循环',
            desc: `**循环** 定义定时器重复播放的次数。\n\n**接受**\n| 值 | 效果 |\n|---|---|\n| 数字 | 循环次数的范围 [0, 无限] |\n| 无限 | 无限循环 |\n| true | 等同于 无限 |\n| -1 | 等同于 无限 |\n\n**默认值**\n0\n\n要全局更改默认值，请更新 engine.defaults 对象：\n\`\`\`\nimport { engine } from 'animejs';\nengine.defaults.loop = true;\n\`\`\``,
            html: `<div class="docs-demo-html">
  <div class="large centered row">
    <div class="col">
      <div class="log">
        <span class="label">loops count</span>
        <span class="loops value">0</span>
      </div>
    </div>
    <div class="col">
      <div class="log">
        <span class="label">iteration time</span>
        <span class="time value lcd">0</span>
      </div>
    </div>
  </div>
</div>`,
            css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }`,
            js: `import { createTimer, utils } from 'https://esm.sh/animejs';

const fmt = t => (t / 1000).toFixed(3) + 's';
const [ $loops ] = utils.$('.loops');
const [ $time ] = utils.$('.time');

let loops = 0;

createTimer({
  loop: true,
  duration: 1000,
  onLoop: () => $loops.innerHTML = ++loops,
  onUpdate: self => $time.innerHTML = fmt(self.iterationCurrentTime)
});` },
          { id: 't-loopdelay', label: '循环延迟',
            desc: `**循环延迟** 定义循环之间的延迟时间（毫秒）。\n\n**接受**\n一个大于或等于 0 的 Number 数值。\n\n**默认值**\n0\n\n要全局更改默认值，请更新 engine.defaults 对象：\n\`\`\`\nimport { engine } from 'animejs';\nengine.defaults.loopDelay = 500;\n\`\`\``,
            html: `<div class="docs-demo-html">
  <div class="large centered row">
    <div class="col">
      <div class="log">
        <span class="label">loops count</span>
        <span class="loops value">0</span>
      </div>
    </div>
    <div class="col">
      <div class="log">
        <span class="label">iteration time</span>
        <span class="time value lcd">0</span>
      </div>
    </div>
  </div>
</div>`,
            css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }`,
            js: `import { createTimer, utils } from 'https://esm.sh/animejs';

const fmt = t => (t / 1000).toFixed(3) + 's';
const [ $loops ] = utils.$('.loops');
const [ $time ] = utils.$('.time');

let loops = 0;

createTimer({
  loop: true,
  loopDelay: 750,
  duration: 250,
  onLoop: () => $loops.innerHTML = ++loops,
  onUpdate: self => $time.innerHTML = fmt(utils.clamp(self.iterationCurrentTime, 0, 250))
});` },
          { id: 't-alternate', label: '交替',
            desc: `**交替** 当 loop 设置为 true 或大于 1 时，定义定时器在每次迭代时是否交替改变播放方向。\n\n**接受**\n布尔值\n\n**默认值**\nfalse\n\n要全局更改默认值，请更新 engine.defaults 对象：\n\`\`\`\nimport { engine } from 'animejs';\nengine.defaults.alternate = true;\n\`\`\``,
            html: `<div class="docs-demo-html">
  <div class="large centered row">
    <div class="col">
      <div class="log">
        <span class="label">loops count</span>
        <span class="loops value">0</span>
      </div>
    </div>
    <div class="col">
      <div class="log">
        <span class="label">iteration time</span>
        <span class="time value lcd">0</span>
      </div>
    </div>
  </div>
</div>`,
            css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }`,
            js: `import { createTimer, utils } from 'https://esm.sh/animejs';

const [ $loops ] = utils.$('.loops');
const [ $time ] = utils.$('.time');

let loops = 0;

createTimer({
  loop: true,
  duration: 1000,
  alternate: true,
  onLoop: () => $loops.innerHTML = ++loops,
  onUpdate: self => $time.innerHTML = self.iterationCurrentTime
});` },
          { id: 't-reverse', label: '反向',
            desc: `**反向** 反转定时器的播放方向。\n\n启用反向后，定时器以相反方向播放（例如从终点回到起点）。可以与循环结合使用。\n\n**接受**\n一个 Boolean。默认值 false。`,
            html: `<div class="docs-demo-html">
  <div class="large centered row">
    <div class="col">
      <div class="log">
        <span class="label">loops count</span>
        <span class="loops value">0</span>
      </div>
    </div>
    <div class="col">
      <div class="log">
        <span class="label">iteration time</span>
        <span class="time value lcd">0</span>
      </div>
    </div>
  </div>
</div>`,
            css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }`,
            js: `import { createTimer, utils } from 'https://esm.sh/animejs';

const [ $loops ] = utils.$('.loops');
const [ $time ] = utils.$('.time');

let loops = 0;

createTimer({
  duration: 1000,
  loop: true,
  reversed: true,
  onLoop: () => $loops.innerHTML = ++loops,
  onUpdate: self => $time.innerHTML = self.iterationCurrentTime
});` },
          { id: 't-framerate', label: '帧率',
            html: `<div class="docs-demo-html">
  <div class="large centered row">
    <div class="col">
      <div class="log">
        <span class="label">fps</span>
        <span class="fps value">60</span>
      </div>
    </div>
    <div class="col">
      <div class="log">
        <span class="label">current time</span>
        <span class="time value lcd">0</span>
      </div>
    </div>
  </div>
  <div class="medium row">
    <fieldset class="controls">
      <input type="range" min=0 max=120 value=60 step=1 class="range" />
    </fieldset>
  </div>
</div>`,
            css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }
.controls { border: none; padding: 0; margin: 0; width: 100%; }
.range { width: 100%; accent-color: #ff7b42; }`,
            js: `import { createTimer, utils } from 'https://esm.sh/animejs';

const [ $range ] = utils.$('.range');
const [ $fps ] = utils.$('.fps');
const [ $time ] = utils.$('.time');

const timer = createTimer({
  frameRate: 60,
  onUpdate: self => $time.innerHTML = self.currentTime,
});

const updateFps = () => {
  const { value } = $range;
  $fps.innerHTML = value;
  timer.fps = value;
};

$range.addEventListener('input', updateFps);` },
          { id: 't-speed', label: '播放速率',
            html: `<div class="docs-demo-html">
  <div class="large centered row">
    <div class="col">
      <div class="log">
        <span class="label">speed</span>
        <span class="speed value">2.0</span>
      </div>
    </div>
    <div class="col">
      <div class="log">
        <span class="label">current time</span>
        <span class="time value lcd">0</span>
      </div>
    </div>
  </div>
  <div class="medium row">
    <fieldset class="controls">
      <input type="range" min=0 max=10 value=2 step=.1 class="range" />
    </fieldset>
  </div>
</div>`,
            css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }
.controls { border: none; padding: 0; margin: 0; width: 100%; }
.range { width: 100%; accent-color: #ff7b42; }`,
            js: `import { createTimer, utils } from 'https://esm.sh/animejs';

const [ $range ] = utils.$('.range');
const [ $speed ] = utils.$('.speed');
const [ $time ] = utils.$('.time');

const timer = createTimer({
  playbackRate: 2,
  onUpdate: self => $time.innerHTML = utils.round(self.currentTime, 0),
});

const updateSpeed = () => {
  const speed = utils.roundPad(+$range.value, 1);
  $speed.innerHTML = speed;
  utils.sync(() => timer.speed = speed);
};

$range.addEventListener('input', updateSpeed);` },
        ],
      },
      {
        id: 'timer-callback', label: '回调',
        html: `<div class="log"></div>`,
        css: `.log { font-family: 'Courier New', monospace; color: #ff7b42; font-size: 14px; }`,
        js: `const log = document.querySelector('.log');\nconst start = performance.now();\nlet done = false;\nfunction tick() {\n  const t = performance.now() - start;\n  log.textContent = 'onUpdate: ' + Math.floor(t) + 'ms';\n  if (t < 2000) { requestAnimationFrame(tick); }\n  else if (!done) { done = true; log.textContent += '\\nonComplete: 计时结束!'; }\n}\ntick();`,
      },
      {
        id: 'timer-methods', label: '方法',
        html: `<button class="btn" id="btn-play">▶ 播放</button>\n<button class="btn" id="btn-pause">⏸ 暂停</button>\n<div class="time-display"><span id="timer-val">0</span>ms</div>`,
        css: `.btn { margin: 4px; padding: 4px 12px; border: 1px solid #ff7b42; background: transparent; color: #ff7b42; border-radius: 6px; cursor: pointer; font-size: 14px; }\n.btn:hover { background: #ff7b4220; }\n.time-display { font-size: 24px; color: #ff7b42; margin-top: 8px; font-family: 'Courier New', monospace; }`,
        js: `const el = document.getElementById('timer-val');\nlet running = false, start = 0, elapsed = 0, raf;\nfunction tick() {\n  el.textContent = Math.floor(elapsed + performance.now() - start);\n  raf = requestAnimationFrame(tick);\n}\ndocument.getElementById('btn-play').onclick = () => {\n  if (running) return; running = true; start = performance.now(); tick();\n};\ndocument.getElementById('btn-pause').onclick = () => {\n  running = false; elapsed += performance.now() - start;\n  cancelAnimationFrame(raf); el.textContent = Math.floor(elapsed);\n};`,
      },
      {
        id: 'timer-props', label: '属性',
        html: `<div class="info">duration: <span id="dur">0</span>ms</div>\n<div class="info">progress: <span id="prog">0</span>%</div>`,
        css: `.info { font-size: 16px; color: #ff7b42; font-family: 'Courier New', monospace; margin: 6px 0; }`,
        js: `const DUR = 2000;\nconst start = performance.now();\nconst durEl = document.getElementById('dur');\nconst progEl = document.getElementById('prog');\nfunction tick() {\n  const t = performance.now() - start;\n  durEl.textContent = Math.min(Math.floor(t), DUR);\n  progEl.textContent = Math.min(Math.floor(t / DUR * 100), 100);\n  if (t < DUR) requestAnimationFrame(tick);\n}\ntick();`,
      },
    ],
  },
  {
    id: 'keyframes', label: '关键帧',
    desc: `**关键帧动画** 将动画分解为多个阶段。

使用数组定义每个阶段的 \`value\` 和 \`duration\`：
\`\`\`
translateX: [
  { value: 250, duration: 800 },
  { value: 0, duration: 800 },
]
\`\`\`
每个元素按顺序执行，适合复杂运动轨迹。`,
    html: `<div class="ball"></div>`,
    css: `.ball { width: 60px; height: 60px; border-radius: 50%; background: #ff7b42; }`,
    js: `import anime from 'https://esm.sh/animejs@3.2.2';

anime({ targets: '.ball',
  translateX: [
    { value: 250, duration: 800 },
    { value: 0, duration: 800 },
    { value: -250, duration: 800 },
    { value: 0, duration: 800 },
  ],
  scale: [{ value: 1.5, duration: 400 }, { value: 1, duration: 400 }],
  easing: 'easeInOutSine', loop: true, duration: 3200,
});`,
  },
  {
    id: 'timeline', label: '时间轴',
    desc: `**时间轴** 按顺序串联多个动画。

\`anime.timeline()\` 创建时间轴实例，通过 \`.add()\` 依次添加动画，支持 \`'-=600'\` 偏移让动画重叠执行。`,
    html: `<div class="box b1"></div>\n<div class="box b2"></div>\n<div class="box b3"></div>`,
    css: `.box { width: 40px; height: 40px; border-radius: 8px; display: inline-block; margin: 8px; }\n.b1 { background: #5b6cff; } .b2 { background: #8b5cf6; } .b3 { background: #d946ef; }`,
    js: `import anime from 'https://esm.sh/animejs@3.2.2';

const tl = anime.timeline({ easing: 'easeOutExpo', loop: true });
tl.add({ targets: '.b1', translateX: 250, duration: 800 })
  .add({ targets: '.b2', translateY: -80, duration: 600 }, '-=500')
  .add({ targets: '.b3', translateX: -250, duration: 800 }, '-=500')
  .add({ targets: '.b1,.b2,.b3', scale: 1.5, duration: 600 })
  .add({ targets: '.b1,.b2,.b3', translateX: 0, translateY: 0, scale: 1, rotate: '1turn', duration: 1200 });`,
  },
  {
    id: 'stagger', label: 'Stagger',
    desc: `**Stagger** 逐项延迟，让多个元素依次动画。

\`anime.stagger(value, options)\` 返回延迟值数组：
- \`grid\`: [列, 行] 网格布局
- \`from\`: 'first' | 'center' | 'last'
- \`direction\`: 'normal' | 'reverse'`,
    html: `<div class="bar"></div><div class="bar"></div><div class="bar"></div>\n<div class="bar"></div><div class="bar"></div><div class="bar"></div>\n<div class="bar"></div><div class="bar"></div><div class="bar"></div>\n<div class="bar"></div><div class="bar"></div><div class="bar"></div>`,
    css: `.bar { width: 20px; height: 20px; border-radius: 4px; background: #5b6cff; display: inline-block; margin: 4px; }`,
    js: `import anime from 'https://esm.sh/animejs@3.2.2';

anime({ targets: '.bar',
  translateX: [{ value: 200, duration: 600 }, { value: 0, duration: 600 }],
  delay: anime.stagger(80, { start: 0, grid: [4, 3], from: 'center' }),
  scale: [{ value: 1.5, duration: 300 }, { value: 1, duration: 300 }],
  easing: 'easeInOutBack(1.5)', loop: true,
});`,
  },
  {
    id: 'custom', label: '自定义',
    desc: `**自由发挥** — 在这里试验任意 anime.js 代码。

按 **Ctrl+Space** 获取 API 补全提示。修改 HTML/CSS/JS 后预览区自动刷新。`,
    html: `<div class="box"></div>`,
    css: `.box { width: 60px; height: 60px; border-radius: 12px; background: #ff7b42; }`,
    js: `import anime from 'https://esm.sh/animejs@3.2.2';

// Ctrl+Space 获取补全提示
anime({ targets: '.box', translateX: 200, duration: 1000 });`,
  },
];
