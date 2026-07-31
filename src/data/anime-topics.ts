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
    id: 'animejs', label: 'anime.js 学习',
    desc: `**anime.js** 交互式学习笔记。

左侧导航树展开可浏览各章节，点击条目加载对应代码示例。每个章节包含：
- **HTML** — 页面结构
- **CSS** — 样式
- **JavaScript** — anime.js 动画代码

JS 编辑器中按 **Ctrl+Space** 可获取 API 补全提示。修改代码后预览区自动刷新。`,
    html: `<div class="overview">
  <h1>anime.js</h1>
  <p>轻量级 JavaScript 动画库</p>
  <div class="dots">
    <span></span><span></span><span></span><span></span><span></span>
  </div>
</div>`,
    css: `.overview { text-align: center; padding: 60px 20px; color: #bbb; font-family: sans-serif; }
.overview h1 { font-size: 36px; color: #ff7b42; margin: 0 0 8px; }
.overview p { font-size: 14px; color: #888; margin: 0 0 32px; }
.dots { display: flex; gap: 8px; justify-content: center; }
.dots span { width: 8px; height: 8px; border-radius: 50%; background: #ff7b42; opacity: 0.3; }
.dots span:nth-child(1) { animation: pulse 1s infinite 0s; }
.dots span:nth-child(2) { animation: pulse 1s infinite 0.2s; }
.dots span:nth-child(3) { animation: pulse 1s infinite 0.4s; }
.dots span:nth-child(4) { animation: pulse 1s infinite 0.6s; }
.dots span:nth-child(5) { animation: pulse 1s infinite 0.8s; }
@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.5)} }`,
    js: `// anime.js 学习笔记 — 从左侧导航选择章节\nconsole.log('👋 从左侧选择一个章节开始学习');`,
    children: [
      {
        id: 'intro', label: '入门',
        desc: `**anime.js** 是一个轻量级 JavaScript 动画库。

\`animate({ targets, ... })\` 是核心 API：
- **targets**: CSS 选择器，指定要动画的元素
- **属性**: translateX, rotate, scale, backgroundColor...
- **duration**: 动画时长 (ms)
- **easing**: 缓动函数
- **loop**: 是否循环

修改左侧代码，预览区会实时更新。JS 编辑器里按 **Ctrl+Space** 获取补全提示。`,
        html: `<div class="box"></div>\n<div class="box"></div>\n<div class="box"></div>\n<div class="box"></div>\n<div class="box"></div>`,
        css: `.box {\n  width: 40px; height: 40px; border-radius: 8px;\n  display: inline-block; margin: 8px;\n  background: #5b6cff;\n}`,
        js: `import { animate, stagger } from 'https://esm.sh/animejs';

// anime.js 基础 — Ctrl+Space 触发补全
animate('.box', {
  translateX: 200,
  scale: [1, 1.4, 1],
  rotate: '1turn',
  backgroundColor: ['#5b6cff', '#ff6b6b', '#51cf66', '#ffd43b', '#cc5de8'],
  duration: 2000,
  delay: stagger(100),
  easing: 'easeInOutQuad',
  loop: true,
  direction: 'alternate',
});`,
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
        js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const fmt = t => (t / 1000).toFixed(3) + 's';
const [ $time, $count ] = $('.value');

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
            desc: '',
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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const fmt = t => (t / 1000).toFixed(3) + 's';
const [ $time ] = $('.time');

createTimer({
  delay: 2000,
  onUpdate: self => $time.innerHTML = fmt(self.currentTime)
});`,
                desc: '' },
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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const fmt = t => (t / 1000).toFixed(3) + 's';
const [ $time ] = $('.time');

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const fmt = t => (t / 1000).toFixed(3) + 's';
const [ $loops ] = $('.loops');
const [ $time ] = $('.time');

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const fmt = t => (t / 1000).toFixed(3) + 's';
const [ $loops ] = $('.loops');
const [ $time ] = $('.time');

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const [ $loops ] = $('.loops');
const [ $time ] = $('.time');

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const [ $loops ] = $('.loops');
const [ $time ] = $('.time');

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const [ $range ] = $('.range');
const [ $fps ] = $('.fps');
const [ $time ] = $('.time');

const timer = createTimer({
  frameRate: 60,
  onUpdate: self => $time.innerHTML = self.currentTime,
});

const updateFps = () => {
  const { value } = $range;
  $fps.innerHTML = value;
  timer.fps = value;
};

$range.addEventListener('input', updateFps);`,
                desc: '' },
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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const [ $range ] = $('.range');
const [ $speed ] = $('.speed');
const [ $time ] = $('.time');

const timer = createTimer({
  playbackRate: 2,
  onUpdate: self => $time.innerHTML = utils.round(self.currentTime, 0),
});

const updateSpeed = () => {
  const speed = utils.roundPad(+$range.value, 1);
  $speed.innerHTML = speed;
  utils.sync(() => timer.speed = speed);
};

$range.addEventListener('input', updateSpeed);`,
                desc: '' },
            ],
          },
          {
            id: 'timer-callback', label: '回调',
            html: `<div class="info">选择一个回调</div>`,
            css: `.info { color: #ff7b42; font-family: 'Courier New', monospace; font-size: 18px; }`,
            js: `// 回调：点击左侧子项查看各回调\nconsole.log('选择一个子项');`,
            desc: '',
            children: [
              {
                id: 'cb-onbegin', label: 'onBegin',
                desc: `**onBegin**\n当定时器开始时执行一个函数。\n\n**接受**\n一个函数，其第一个参数是计时器本身\n\n**默认值**\nnoop\n\n要全局更改默认值，请更新 engine.defaults 对象。\n\n\`\`\`\nimport { engine } from 'animejs';\nengine.defaults.onBegin = self => console.log(self.id);\n\`\`\``,
                html: `<div class="large row">
  <div class="col">
    <pre class="large log row">
      <span class="label">began</span>
      <span class="status value">false</span>
    </pre>
  </div>
  <div class="col">
    <pre class="large log row">
      <span class="label">current time</span>
      <span class="time value lcd">0</span>
    </pre>
  </div>
</div>`,
                css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }`,
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const [ $status ] = $('.status');
const [ $time ] = $('.time');

const timer = createTimer({
  delay: 2000,
  duration: 2000,
  onBegin: self => $status.innerHTML = 'true'
});

const logTimer = createTimer({
  duration: 4000,
  onUpdate: self => $time.innerHTML = timer.currentTime
});`,
              },
              {
                id: 'cb-oncomplete', label: 'onComplete',
                desc: `**onComplete**\n当定时器的所有迭代（loop）播放完毕时执行函数。\n\n**接受**\n一个函数，其第一个参数是计时器本身\n\n**默认值**\nnoop\n\n要全局更改默认值，请更新 engine.defaults 对象。\n\n\`\`\`\nimport { engine } from 'animejs';\nengine.defaults.onComplete = self => console.log(self.id);\n\`\`\``,
                html: `<div class="large row">
  <div class="col">
    <pre class="large log row">
      <span class="label">completed</span>
      <span class="status value">false</span>
    </pre>
  </div>
  <div class="col">
    <pre class="large log row">
      <span class="label">current time</span>
      <span class="time value lcd">0</span>
    </pre>
  </div>
</div>`,
                css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }`,
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const [ $status ] = $('.status');
const [ $time ] = $('.time');

const timer = createTimer({
  delay: 2000,
  duration: 2000,
  onComplete: self => $status.innerHTML = 'true'
});

const logTimer = createTimer({
  duration: 5000,
  onUpdate: self => $time.innerHTML = timer.currentTime
});`,
              },
              {
                id: 'cb-onupdate', label: 'onUpdate',
                desc: `**onUpdate**\n在运行中的定时器每一帧执行时，以指定的 frameRate（帧率）调用函数。\n\n**接受**\n一个函数，其第一个参数是计时器本身\n\n**默认值**\nnoop\n\n要全局更改默认值，请更新 engine.defaults 对象。\n\n\`\`\`\nimport { engine } from 'animejs';\nengine.defaults.onUpdate = self => console.log(self.id);\n\`\`\``,
                html: `<div class="large row">
  <div class="col">
    <pre class="large log row">
      <span class="label">updates</span>
      <span class="updates value">0</span>
    </pre>
  </div>
  <div class="col">
    <pre class="large log row">
      <span class="label">current time</span>
      <span class="time value lcd">0</span>
    </pre>
  </div>
</div>`,
                css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }`,
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const [ $updates ] = $('.updates');
const [ $time ] = $('.time');

let updates = 0;

createTimer({
  onUpdate: self => {
    $updates.innerHTML = ++updates;
    $time.innerHTML = self.currentTime;
  }
});`,
              },
              {
                id: 'cb-onloop', label: 'onLoop',
                desc: `**onLoop**\n每次定时器迭代完成时执行一个函数。\n\n**接受**\n一个函数，其第一个参数是计时器本身\n\n**默认值**\nnoop\n\n要全局更改默认值，请更新 engine.defaults 对象。\n\n\`\`\`\nimport { engine } from 'animejs';\nengine.defaults.onLoop = self => console.log(self.id);\n\`\`\``,
                html: `<div class="large row">
  <div class="col">
    <pre class="large log row">
      <span class="label">loops</span>
      <span class="loops value">0</span>
    </pre>
  </div>
  <div class="col">
    <pre class="large log row">
      <span class="label">iteration time</span>
      <span class="time value lcd">0</span>
    </pre>
  </div>
</div>`,
                css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }`,
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const [ $loops ] = $('.loops');
const [ $time ] = $('.time');

let loops = 0;

createTimer({
  loop: true,
  duration: 1000,
  onLoop: self => $loops.innerHTML = ++loops,
  onUpdate: self => $time.innerHTML = self.iterationCurrentTime,
});`,
              },
              {
                id: 'cb-onpause', label: 'onPause',
                desc: `**onPause**\n当运行中的定时器暂停时执行函数。\n\n**接受**\n一个函数，其第一个参数是计时器本身\n\n**默认值**\nnoop\n\n要全局更改默认值，请更新 engine.defaults 对象。\n\n\`\`\`\nimport { engine } from 'animejs';\nengine.defaults.onPause = self => console.log(self.id);\n\`\`\``,
                html: `<div class="large row">
  <div class="col">
    <pre class="large log row">
      <span class="label">paused</span>
      <span class="value paused">0</span>
    </pre>
  </div>
  <div class="col">
    <pre class="large log row">
      <span class="label">elapsed time</span>
      <span class="time value lcd">0</span>
    </pre>
  </div>
</div>
<div class="medium row">
  <fieldset class="controls">
    <button class="button">Resume</button>
    <button class="button">Pause</button>
  </fieldset>
</div>`,
                css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }
.controls { border: none; padding: 0; margin: 0; width: 100%; }
.button { margin-right: 8px; padding: 4px 14px; border: 1px solid #ff7b42; background: transparent; color: #ff7b42; border-radius: 6px; cursor: pointer; font-size: 13px; }
.button:hover { background: #ff7b4220; }`,
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const [ $resumeButton, $pauseButton ] = $('.button');
const [ $paused ] = $('.paused');
const [ $time ] = $('.time');

let paused = 0;

const timer = createTimer({
  onPause: () => $paused.innerHTML = ++paused,
  onUpdate: self => $time.innerHTML = self.currentTime
});

const pauseTimer = () => timer.pause();
const resumeTimer = () => timer.resume();

$resumeButton.addEventListener('click', resumeTimer);
$pauseButton.addEventListener('click', pauseTimer);`,
              },
              {
                id: 'cb-then', label: 'then()',
                desc: `**then()**\n返回一个 Promise，当定时器完成时，该 Promise 会解析并执行回调函数。\n\nthen() 方法可以这样直接内联使用\n\n\`\`\`\ncreateTimer({duration: 500}).then(callback);\n\`\`\`\n\n或在 async / await 上下文中使用\n\n\`\`\`\nasync function waitForTimerToComplete() {\n  return createTimer({ duration: 250 })\n}\n\nconst asyncTimer = await waitForTimerToComplete();\n\`\`\`\n\n**参数**\n| 名称 | 类型 |\n|---|---|\n| 回调函数 | 一个函数，其第一个参数是计时器本身 |\n\n**返回**\nPromise`,
                html: `<div class="large row">
  <div class="col">
    <pre class="large log row">
      <span class="label">promise status</span>
      <span class="status value">pending</span>
    </pre>
  </div>
  <div class="col">
    <pre class="large log row">
      <span class="label">current time</span>
      <span class="time value lcd">0</span>
    </pre>
  </div>
</div>`,
                css: `body { background: #2d2117 !important; color: #ff7b42; }
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; }
.lcd { font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; }
.log { background: rgba(0,0,0,0.3); padding: 12px 20px; border-radius: 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 65px; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }`,
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs';

const [ $status ] = $('.status');
const [ $time ] = $('.time');

createTimer({
  duration: 2000,
  onUpdate: self => $time.innerHTML = self.currentTime,
})
.then(() => $status.innerHTML = 'fulfilled');`,
              },
            ],
          },
        ],
      },
      {
        id: 'custom', label: '自定义',
        desc: `**自由发挥** — 在这里试验任意 anime.js 代码。\n\n按 **Ctrl+Space** 获取 API 补全提示。修改 HTML/CSS/JS 后预览区自动刷新。`,
        html: `<div class="box"></div>`,
        css: `.box { width: 60px; height: 60px; border-radius: 12px; background: #ff7b42; }`,
        js: `import { animate, stagger } from 'https://esm.sh/animejs';

// Ctrl+Space 获取补全提示
animate('.box', { translateX: 200, duration: 1000 });`,
        children: [
          {
            id: 'ring-animation', label: '圆环动画',
            desc: `**圆环进度动画** — strokeDashoffset + 旋转圆点。\n\n**原理**\n- SVG stroke-dasharray 设为圆周长，虚线恰好覆盖一整圈\n- stroke-dashoffset 从周长渐变到 0，实现从无到有的描边\n- createDrawable 自动处理 stroke-dashoffset，省去手算\n- 圆点通过独立旋转同步跟随描边头部\n\n两条 anime 动画并行：描边 + 旋转，交替循环。`,
            html: `<div class="ring-container">
  <svg id="1" viewBox="0 0 200 200">
    <circle class="track" cx="100" cy="100" r="70"
      fill="none" stroke="#3a3a3a" stroke-width="6" />
    <circle class="progress" cx="100" cy="100" r="70"
      fill="none" stroke="#ff7b42" stroke-width="6"
      stroke-linecap="round"
      stroke-dasharray="439.8" stroke-dashoffset="439.8" />
  </svg>
  <svg id="2" viewBox="0 0 200 200">
    <circle class="progress-1" cx="100" cy="100" r="80"
      fill="none" stroke="#AAAAAA" stroke-width="10"
      stroke-dasharray="502.7" stroke-dashoffset="502.7" />
  </svg>
  <div class="dot-wrap">
    <div class="dot"></div>
  </div>
</div>`,
            css: `body { background: #1a1a1a !important; }
.ring-container {
  position: relative; width: 200px; height: 200px;
  margin: 0 auto;
}
.ring-container svg {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
}
.progress-1 {
  transform: rotate(90deg);
  transform-origin: 100px 100px;
}
.dot-wrap {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
  transform-origin: center center;
}
.dot {
  width: 12px; height: 12px; border-radius: 50%;
  background: #ff7b42;
  box-shadow: 0 0 8px rgba(255,123,66,0.6);
  position: absolute;
  top: -6px; left: calc(50% - 6px);
}`,
            js: `import { animate } from 'https://esm.sh/animejs';

// 内环描边
animate('circle.progress', {
  strokeDashoffset: 0,
  duration: 2000,
  easing: 'easeInOutQuad',
  loop: true,
  direction: 'alternate',
});
// 外环描边
animate('circle.progress-1', {
  strokeDashoffset: 0,
  duration: 2000,
  easing: 'easeInOutQuad',
  loop: true,
  direction: 'alternate',
});
// 圆点同步旋转
animate('.dot-wrap', {
  rotate: { from: '-2turn', delay: 0 },
  duration: 2000,
  easing: 'easeInOutQuad',
  loop: true,
  direction: 'alternate',
});`,
          },
          {
            id: 'multi-ring', label: '多圆环组合',
            desc: `**多圆环组合** — 6 个同心圆环各自独立旋转，形成层叠交错效果。\n\n- 6 个 SVG 层叠，每个圆环半径递增（r=30/40/50/60/70/90）\n- 每个圆环不同颜色 + 不同起始角度（rotate 偏移）\n- strokeDashoffset 动画交替画满擦除\n- 多条 anime 动画并行，loop + alternate 持续循环`,
            html: `<div class="ring-container">
  <svg viewBox="0 0 200 200">
    <circle class="track" cx="100" cy="100" r="70"
      fill="none" stroke="#3a3a3a" stroke-width="6" />
    <circle class="progress" cx="100" cy="100" r="30"
      fill="none" stroke="#ff7b42" stroke-width="6"
      stroke-linecap="round"
      stroke-dasharray="188.5" stroke-dashoffset="188.5" />
  </svg>
  <svg viewBox="0 0 200 200">
    <circle class="progress-1" cx="100" cy="100" r="40"
      fill="none" stroke="#AAAAAA" stroke-width="10"
      stroke-dasharray="251.3" stroke-dashoffset="251.3" />
  </svg>
  <svg viewBox="0 0 200 200">
    <circle class="progress-2" cx="100" cy="100" r="50"
      fill="none" stroke="#C5FCE7" stroke-width="10"
      stroke-dasharray="314.2" stroke-dashoffset="314.2" />
  </svg>
  <svg viewBox="0 0 200 200">
    <circle class="progress-3" cx="100" cy="100" r="60"
      fill="none" stroke="#B7D8FE" stroke-width="10"
      stroke-dasharray="377.0" stroke-dashoffset="377.0" />
  </svg>
  <svg viewBox="0 0 200 200">
    <circle class="progress-4" cx="100" cy="100" r="70"
      fill="none" stroke="#92C41E" stroke-width="10"
      stroke-dasharray="439.8" stroke-dashoffset="439.8" />
  </svg>
  <svg viewBox="0 0 200 200">
    <circle class="progress-5" cx="100" cy="100" r="90"
      fill="none" stroke="#E9E9E9" stroke-width="10"
      stroke-dasharray="565.5" stroke-dashoffset="565.5" />
  </svg>
</div>`,
            css: `body { background: #1a1a1a !important; }
.ring-container {
  position: relative; width: 250px; height: 250px;
  margin: 0 auto;
}
.ring-container svg {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
}
.progress-1 {
  transform: rotate(130deg);
  transform-origin: 100px 100px;
}
.progress-2 {
  transform: rotate(270deg);
  transform-origin: 100px 100px;
}
.progress-3 {
  transform: rotate(20deg);
  transform-origin: 100px 100px;
}
.progress-4 {
  transform: rotate(-50deg);
  transform-origin: 100px 100px;
}
.progress-5 {
  transform: rotate(160deg);
  transform-origin: 100px 100px;
}`,
            js: `import { animate } from 'https://esm.sh/animejs';

// 6 层描边
animate('circle.progress', {
  strokeDashoffset: 0,
  duration: 2000, easing: 'easeInOutQuad', loop: true, direction: 'alternate',
});
animate('circle.progress-1', {
  strokeDashoffset: 0,
  duration: 2000, easing: 'easeInOutQuad', loop: true, direction: 'alternate',
});
animate('circle.progress-2', {
  strokeDashoffset: 0,
  duration: 2000, easing: 'easeInOutQuad', loop: true, direction: 'alternate',
});
animate('circle.progress-3', {
  strokeDashoffset: 0,
  duration: 2000, easing: 'easeInOutQuad', loop: true, direction: 'alternate',
});
animate('circle.progress-4', {
  strokeDashoffset: 0,
  duration: 2000, easing: 'easeInOutQuad', loop: true, direction: 'alternate',
});
animate('circle.progress-5', {
  strokeDashoffset: 0,
  duration: 2000, easing: 'easeInOutQuad', loop: true, direction: 'alternate',
});`,
          },
        ],
      },
    ],
  },
];
