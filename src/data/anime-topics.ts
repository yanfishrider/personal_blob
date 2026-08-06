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
        js: `import { animate, stagger } from 'https://esm.sh/animejs@4.4.1';

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
        js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
                js: `import { createTimer, utils, $ } from 'https://esm.sh/animejs@4.4.1';

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
        js: `import { animate, stagger } from 'https://esm.sh/animejs@4.4.1';

// Ctrl+Space 获取补全提示
animate('.box', { translateX: 200, duration: 1000 });`,
        children: [
          {
            id: 'ring-animation', label: '圆环动画',
            desc: `**圆环进度动画** — strokeDashoffset + 旋转圆点。\n\n**原理**\n- SVG pathLength=100 归一化周长，dasharray 恒为 100\n- stroke-dashoffset 从 100 渐变到 0，实现从无到有的描边\n- 圆点通过独立旋转同步跟随描边头部\n\n两条 anime 动画并行：描边 + 旋转，交替循环。`,
            html: `<div class="ring-container">
  <svg id="1" viewBox="0 0 200 200">
    <circle class="track" cx="100" cy="100" r="70"
      fill="none" stroke="#3a3a3a" stroke-width="6" />
    <circle class="progress" cx="100" cy="100" r="70"
      fill="none" stroke="#ff7b42" stroke-width="6"
      stroke-linecap="round"
      pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
  </svg>
  <svg id="2" viewBox="0 0 200 200">
    <circle class="progress-1" cx="100" cy="100" r="80"
      fill="none" stroke="#AAAAAA" stroke-width="10"
      pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
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
            js: `import { animate } from 'https://esm.sh/animejs@4.4.1';

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
  rotate: [0, 360],
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
      pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
    <circle class="progress-1" cx="100" cy="100" r="40"
      fill="none" stroke="#AAAAAA" stroke-width="10"
      pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
    <circle class="progress-2" cx="100" cy="100" r="50"
      fill="none" stroke="#C5FCE7" stroke-width="10"
      pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
    <circle class="progress-3" cx="100" cy="100" r="60"
      fill="none" stroke="#B7D8FE" stroke-width="10"
      pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
    <circle class="progress-4" cx="100" cy="100" r="70"
      fill="none" stroke="#92C41E" stroke-width="10"
      pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
    <circle class="progress-5" cx="100" cy="100" r="90"
      fill="none" stroke="#E9E9E9" stroke-width="10"
      pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
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
            js: `import { animate, stagger } from 'https://esm.sh/animejs@4.4.1';

// 定义每个圆环的动画参数
const configs = [
  { selector: 'circle.progress',   start: 0, end: 100, isReverse: false },  // 正向填充
  { selector: 'circle.progress-1', start: 100, end: 0 },
  { selector: 'circle.progress-2', start: 100, end: 0 },
  { selector: 'circle.progress-3', start: 100, end: 0 },
  { selector: 'circle.progress-4', start: 100, end: 0 },
  { selector: 'circle.progress-5', start: 0, end: 100, isReverse: true }   // 反向（擦除）
];

configs.forEach(({ selector, start, end }) => {
  animate(selector, {
    strokeDashoffset: [start, end],   // 明确起始和结束
    duration: 2000,
    easing: 'easeInOutQuad',
    loop: true,
    direction: 'alternate'
  });
});`,
          },
          {
            id: 'ring-text', label: '圆环文字组合',
            desc: `**圆环 + 文字组合** — 多圆环描边动画 + splitText 逐字动画。\n\n**splitText** 将文本拆分为独立字符元素，配合 stagger 实现逐字弹跳。\n- \`splitText(el, { words: false, chars: true })\` 拆成字符\n- 每个字符独立动画：y 弹跳 + rotate 旋转 + 颜色渐变\n- stagger(50) 让字符依次延迟，形成波浪效果`,
            html: `<div class="ring-container">
  <svg viewBox="0 0 200 200">
    <circle class="track" cx="100" cy="100" r="70"
      fill="none" stroke="#3a3a3a" stroke-width="6" />
    <circle class="progress" cx="100" cy="100" r="30"
      fill="none" stroke="#ff7b42" stroke-width="6"
      stroke-linecap="round"
      pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
    <circle class="progress-1" cx="100" cy="100" r="40"
      fill="none" stroke="#AAAAAA" stroke-width="10"
      pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
    <circle class="progress-2" cx="100" cy="100" r="50"
      fill="none" stroke="#C5FCE7" stroke-width="10"
      pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
    <circle class="progress-3" cx="100" cy="100" r="60"
      fill="none" stroke="#B7D8FE" stroke-width="10"
      pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
    <circle class="progress-4" cx="100" cy="100" r="70"
      fill="none" stroke="#92C41E" stroke-width="10"
      pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
    <circle class="progress-5" cx="100" cy="100" r="90"
      fill="none" stroke="#E9E9E9" stroke-width="10"
      pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
  </svg>

  <div class="text-container">
    <a class="text-xl" id='1'>摸鱼</a>
    <a class="text-xl" id='2'>骑士</a>
  </div>

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
}
.text-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
}
.text-xl {
  font-size: 1.1rem;
  color: #ffffff;
  letter-spacing: 0.06em;
}`,
            js: `import { animate, stagger, splitText } from 'https://esm.sh/animejs@4.4.1';

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
});

// 获取两个元素
const el1 = document.getElementById('1');
const el2 = document.getElementById('2');
const { chars } = splitText(el1, { words: false, chars: true });
animate(chars, {
  // Property keyframes
  y: [
    { to: '1.5rem', ease: 'outExpo', duration: 600 },
    { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
  ],
  // Property specific parameters
  rotate: {
    from: '-1turn',
    delay: 0
  },
  backgroundColor: ['#5b6cff', '#ff6b6b', '#263C47'],
  color: ['#FF6B6B', '#4D96FF'],
  delay: stagger(50),
  ease: 'inOutCirc',
  loopDelay: 1000,
  loop: true
});
const { chars: chars2 } = splitText(el2, { words: false, chars: true });
animate(chars2, {
  // Property keyframes
  y: [
    { to: '-1.5rem', ease: 'outExpo', duration: 600 },
    { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
  ],
  // Property specific parameters
  rotate: {
    from: '-1turn',
    delay: 0
  },
  backgroundColor: ['#5b6cff', '#51cf66', '#cc5de8'],
  color: ['#FF6B6B', '#57F695'],
  delay: stagger(50),
  ease: 'inOutCirc',
  loopDelay: 1000,
  loop: true
});`,
          },
          {
            id: 'animatable', label: '可动画',
            desc: `**可动画对象（createAnimatable）** — 创建一个可反复"调用"触发动画的对象。

**与 animate() 的区别**
- \`animate()\`：一次性播放，播完即止
- \`createAnimatable()\`：返回 Animatable 实例，每个可动画属性变成同名方法，随时调用即可让元素动画到新目标值

**用法**
\`\`\`
import { createAnimatable, utils } from 'animejs';
const animatable = createAnimatable('.square', {
  x: 500,   // x 动画时长 500ms
  y: 500,   // y 动画时长 500ms
  ease: 'out(3)',
});
animatable.x(200);  // 触发：500ms 内动画到 x=200
\`\`\`

**本例**：监听 mousemove，鼠标移动时计算相对容器中心的偏移，反复调用 .x()/.y() 让方块平滑跟随光标，超出容器范围用 utils.clamp 夹取。

**ease: 'out(3)'** — 幂次缓动：out + 指数 3（即 easeOutCubic）。`,
            html: `<div class="large centered row">
  <div class="col">
    <div class="square"></div>
  </div>
</div>
<div class="small centered row">
  <span class="label">Move cursor around</span>
</div>`,
            css: `body { background: #2d2117 !important; color: #ff7b42; }
.row { display: flex; gap: 16px; align-items: stretch; margin: 8px 0; }
.col { flex: 1 1 0; min-width: 0; }
.large.centered.row { min-height: 200px; align-items: center; }
.centered { justify-content: center; }
.small.centered.row { justify-content: center; }
.square {
  width: 60px; height: 60px; border-radius: 8px;
  background: #ff7b42;
  box-shadow: 0 0 24px rgba(255,123,66,0.45);
}
.label { font-size: 11px; color: #8b7355; text-transform: uppercase; letter-spacing: 1px; display: block; text-align: center; }`,
            js: `import { createAnimatable, utils } from 'https://esm.sh/animejs@4.4.1';

const $demo = document.querySelector('.large.centered.row');

let bounds = $demo.getBoundingClientRect();
const refreshBounds = () => bounds = $demo.getBoundingClientRect();

// 创建可动画对象：x/y 动画时长 500ms，out(3) 缓动
const animatableSquare = createAnimatable('.square', {
  x: 500,
  y: 500,
  ease: 'out(3)',
});

const onMouseMove = e => {
  const { width, height, left, top } = bounds;
  const hw = width / 2;
  const hh = height / 2;
  // 光标相对容器中心的偏移，夹取在容器范围内
  const x = utils.clamp(e.clientX - left - hw, -hw, hw);
  const y = utils.clamp(e.clientY - top - hh, -hh, hh);
  animatableSquare.x(x);  // 500ms 内动画到 x
  animatableSquare.y(y);  // 500ms 内动画到 y
};

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('resize', refreshBounds);`,
          },
          {
            id: 'svg-cursor', label: 'SVG 光标',
            desc: `**SVG 光标矢量图** — Inkscape 染色版（黑色剪影 + 灰色部件）。

**结构**
- 黑色菱形徽章剪影（中心圆、辐条、底部凹槽镂空）
- 底部两侧灰色方块（#898d7f，Inkscape 添加的染色部件）

**说明**：在纯黑剪影基础上用 Inkscape 添加了灰色染色层，浅色背景衬托。

**动画**：整体缓慢上下浮动（translateY 交替）。`,
            html: `<div class="cursor-wrap">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 448" width="100%" height="100%">
    <g transform="translate(0,448) scale(0.1,-0.1)" fill="#000000" stroke="none">
      <path d="M2191 4363 c-10 -21 -152 -324 -316 -673 -164 -349 -315 -673 -337 -720 -22 -47 -123 -263 -225 -480 -102 -217 -222 -471 -267 -565 l-81 -170 -3 -244 -3 -245 598 -598 c329 -329 600 -598 603 -598 30 1 31 21 36 516 4 274 7 500 8 501 0 0 12 3 26 5 l25 3 3 -499 c2 -496 4 -526 36 -526 6 0 277 267 603 592 l593 593 0 248 0 248 -402 857 c-220 471 -434 927 -473 1012 -233 499 -354 751 -365 765 -20 24 -38 18 -59 -22z m141 -291 c54 -114 188 -400 298 -637 111 -236 280 -597 376 -800 96 -204 174 -376 174 -383 0 -10 -488 -264 -597 -310 -32 -14 -34 -13 -79 27 -63 55 -139 83 -245 89 -130 7 -220 -24 -311 -106 l-38 -34 -317 162 c-175 89 -319 164 -321 165 -2 2 34 81 79 176 45 96 115 245 155 332 279 596 567 1210 639 1362 31 66 61 130 66 143 5 12 12 22 16 22 5 0 52 -93 105 -208z m-811 -2141 l314 -159 6 -74 c7 -84 17 -113 61 -175 36 -50 130 -117 189 -134 l39 -12 0 -359 c0 -197 -3 -358 -7 -358 -13 0 -1083 1074 -1083 1087 0 16 153 343 160 343 4 0 148 -72 321 -159z m1822 -16 l79 -168 -546 -546 -546 -546 0 363 c0 338 1 362 18 362 34 0 142 60 185 102 65 66 99 142 99 226 l1 68 306 157 c168 86 310 155 316 153 5 -1 44 -78 88 -171z m-1223 -1535 l0 -175 -539 540 -540 540 -3 177 -3 178 543 -542 542 -543 0 -175z m756 361 l-544 -544 -1 177 -2 176 543 543 543 543 3 -175 2 -175 -544 -545z" />
      <path d="M740 781 c-16 -30 -14 -612 3 -634 11 -16 36 -17 272 -15 l260 3 3 319 c2 227 -1 323 -9 332 -9 11 -63 14 -265 14 -240 0 -254 -1 -264 -19z m476 -188 l-1 -138 -207 -3 -208 -2 0 140 0 140 209 0 208 0 -1 -137z m-6 -308 l0 -85 -200 0 -200 0 0 85 0 85 200 0 200 0 0 -85z" />
      <path d="M3192 792 c-9 -7 -12 -80 -10 -333 l3 -324 265 0 265 0 3 319 c2 227 -1 323 -9 332 -9 11 -61 14 -258 14 -135 0 -252 -4 -259 -8z m468 -202 l0 -140 -210 0 -210 0 0 140 0 140 210 0 210 0 0 -140z m-10 -305 l0 -85 -200 0 -200 0 0 85 0 85 200 0 200 0 0 -85z" />
    </g>
    <path style="fill:#898d7f;fill-opacity:1;stroke-width:0.732924" d="m 108.10634,559.58773 v -10.99386 h 26.38528 26.38527 v 10.99386 10.99387 h -26.38527 -26.38528 z" transform="scale(0.75)" />
    <path style="fill:#898d7f;fill-opacity:1;stroke-width:0.732924" d="m 433.52474,559.58773 v -10.99386 h 26.38528 26.38528 v 10.99386 10.99387 h -26.38528 -26.38528 z" transform="scale(0.75)" />
    <path style="fill:#898d7f;fill-opacity:1;stroke-width:0.732924" d="m 311.12638,547.12522 v -23.08713 l 71.71206,-71.70925 71.71206,-71.70926 0.48099,6.77622 c 0.26454,3.72692 0.48098,13.89968 0.48098,22.60612 v 15.82991 l -72.19304,72.19026 -72.19305,72.19025 z" transform="scale(0.75)" />
    <path style="fill:#898d7f;fill-opacity:1;stroke-width:0.732924" d="m 210.71575,497.18285 -71.46013,-71.96266 -0.43543,-22.41623 c -0.23949,-12.32893 -0.39034,-22.48526 -0.33523,-22.56962 0.0551,-0.0844 32.49545,32.2431 72.08963,71.83881 l 71.98942,71.99221 -0.19407,22.54007 -0.19407,22.54009 z" transform="scale(0.75)" />
  </svg>
</div>`,
            css: `body { background: #1a1a1a !important; }
.cursor-wrap {
  width: 240px;
  margin: 40px auto;
}
body { background: #e6e8eb !important; }
.cursor-wrap {
  width: 240px;
  margin: 40px auto;
}
.cursor-wrap svg {
  display: block;
  width: 100%;
  height: auto;
}`,
            js: `import { animate } from 'https://esm.sh/animejs@4.4.1';

// SVG 元素同样支持 CSS transform 动画：缓慢上下浮动
animate('.cursor-wrap svg', {
  translateY: [-8, 8],
  easing: 'easeInOutSine',
  duration: 1600,
  direction: 'alternate',
  loop: true,
  });`,
          },
          {
            id: 'svg-line-draw', label: 'SVG 变化',
            desc: `**SVG 线条绘制动画** — svg.createDrawable() 把 SVG 路径包装成可动画对象，draw 属性逐笔绘制粗线条字。

**原理**
- \`svg.createDrawable('.line')\` 收集所有 .line 路径（path / polyline 均可）
- **draw** 属性接受 [起点, 终点] 关键帧，数值为路径长度比例（0~1）：
- \`'0 0'\` — 未绘制
- \`'0 1'\` — 从起点画到终点
- \`'1 1'\` — 整条线完成
- \`stagger(100)\` 让每条线依次延迟 100ms，形成逐笔书写效果

这正是**图形方式**的粗线条字：每个字母是独立的 SVG 路径，可以逐笔画动画。`,
            html: `<svg viewBox="0 0 304 112">
<g stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
<path class="line" d="M59 90V56.136C58.66 46.48 51.225 39 42 39c-9.389 0-17 7.611-17 17s7.611 17 17 17h8.5v17H42C23.222 90 8 74.778 8 56s15.222-34 34-34c18.61 0 33.433 14.994 34 33.875V90H59z"/>
<polyline class="line" points="59 22.035 59 90 76 90 76 22 59 22"/>
<path class="line" d="M59 90V55.74C59.567 36.993 74.39 22 93 22c18.778 0 34 15.222 34 34v34h-17V56c0-9.389-7.611-17-17-17-9.225 0-16.66 7.48-17 17.136V90H59z"/>
<polyline class="line" points="127 22.055 127 90 144 90 144 22 127 22"/>
<path class="line" d="M127 90V55.74C127.567 36.993 142.39 22 161 22c18.778 0 34 15.222 34 34v34h-17V56c0-9.389-7.611-17-17-17-9.225 0-16.66 7.48-17 17.136V90h-17z"/>
<path class="line" d="M118.5 22a8.5 8.5 0 1 1-8.477 9.067v-1.134c.283-4.42 3.966-7.933 8.477-7.933z"/>
<path class="line" d="M144 73c-9.389 0-17-7.611-17-17v-8.5h-17V56c0 18.778 15.222 34 34 34V73z"/>
<path class="line" d="M178 90V55.74C178.567 36.993 193.39 22 212 22c18.778 0 34 15.222 34 34v34h-17V56c0-9.389-7.611-17-17-17-9.225 0-16.66 7.48-17 17.136V90h-17z"/>
<path class="line" d="M263 73c-9.389 0-17-7.611-17-17s7.611-17 17-17c9.18 0 16.58 7.4 17 17h-17v17h34V55.875C296.433 36.994 281.61 22 263 22c-18.778 0-34 15.222-34 34s15.222 34 34 34V73z"/>
<path class="line" d="M288.477 73A8.5 8.5 0 1 1 280 82.067v-1.134c.295-4.42 3.967-7.933 8.477-7.933z"/>
</g>
</svg>`,
            css: `body { background: #1a1a1a !important; }
svg {
display: block; margin: 32px auto;
color: #ff7b42; width: 100%; max-width: 300px;
}`,
            js: `import { animate, svg, stagger } from 'https://esm.sh/animejs@4.4.1';

// 逐笔绘制粗线条字：每条 .line 依次画出，然后整体消失循环
animate(svg.createDrawable('.line'), {
draw: ['0 0', '0 1', '1 1'],
ease: 'inOutQuad',
duration: 2000,
delay: stagger(100),
loop: true
});`,
          },
          {
            id: 'text-custom-template', label: '文本自定义模板',
            desc: `**splitText 自定义 HTML 模板** — splitText 的 chars 参数支持模板字符串，每个字符用自定义 HTML 包裹，实现 3D 翻转文字。

**原理**
- \`chars\` 模板：\`{value}\` 是字符内容、\`{i}\` 是索引占位符，会被逐个替换
- 每个字符生成 3 个 \`<em>\` 面：face-top / face-front / face-bottom，构成 3D 立方体字
- **createTimeline** 按顺序添加动画：先旋转整字（rotateX: -90），再依次切换三个面的透明度，形成翻转循环
- 3D 效果依赖 \`transform-style: preserve-3d\` + 各面 rotateX 定位`,
            html: `<div class="large centered row">
<p class="text-xl">Custom HTML template.</p>
</div>`,
            css: `body { background: #1a1a1a !important; }
.text-xl {
font-size: 1.5rem;
color: #ffffff;
letter-spacing: 0.06em;
font-family: sans-serif;
}
.char-3d {
position: relative;
transform-style: preserve-3d;
transform-origin: 50% 50% 1rem;
}
.face {
position: absolute;
left: 0;
}
.face-bottom {
top: 100%;
transform-origin: 50% 0%;
transform: rotateX(90deg);
}
.face-top {
bottom: 100%;
transform-origin: 50% 100%;
transform: rotateX(-90deg);
}
.large.centered.row {
display: flex;
justify-content: center;
align-items: center;
min-height: 60vh;
}`,
            js: `import { createTimeline, stagger, splitText } from 'https://esm.sh/animejs@4.4.1';

splitText('p', {
chars: \`<span class="char-3d word-{i}">
<em class="face face-top">{value}</em>
<em class="face-front">{value}</em>
<em class="face face-bottom">{value}</em>
</span>\`,
});

const charsStagger = stagger(100, { start: 0 });

createTimeline({ defaults: { ease: 'linear', loop: true, duration: 750 }})
.add('.char-3d', { rotateX: -90 }, charsStagger)
.add('.char-3d .face-top', { opacity: [.5, 0] }, charsStagger)
.add('.char-3d .face-front', { opacity: [1, .5] }, charsStagger)
.add('.char-3d .face-bottom', { opacity: [.5, 1] }, charsStagger);`,
          },
          {
            id: 'nav-logo-3d', label: '导航栏 3D 翻转',
            desc: `**导航栏 Logo 3D 翻转（平滑往返版）** — 模拟本博客导航栏当前效果。

**实现要点**
- \`splitText\` 拆字：每字生成 face-top / face-front / face-bottom 三个面，构成 3D 硬币
- **平滑往返**：rotateX 0 → -90° → 0（有去有回），终点=起点，loop 重置无跳变
- 4 组动画同步：翻转 + 三个面透明度同步往返
- 关键坑：timeline 顺序版（转完再换面）loop 会从 -90° 跳回 0° 产生抖动；perspective 透视投影在小空间放大变形感，导航栏已去掉

**参数**：每段 750ms，stagger(100) 逐字错开，transform-origin Z=1.1rem（位移大但往返闭环后无跳变）`,
            html: `<div class="large centered row">
<p class="text-xl">摸鱼骑士知识库</p>
</div>`,
            css: `body { background: #1a1a1a !important; }
.text-xl {
font-size: 1.5rem;
color: #ffffff;
letter-spacing: 0.06em;
font-family: sans-serif;
}
.char-3d {
position: relative;
transform-style: preserve-3d;
transform-origin: 50% 50% 1.1rem;
}
.face {
position: absolute;
left: 0;
opacity: 0.5;
}
.face-bottom {
top: 100%;
transform-origin: 50% 0%;
transform: rotateX(90deg);
}
.face-top {
bottom: 100%;
transform-origin: 50% 100%;
transform: rotateX(-90deg);
}
.large.centered.row {
display: flex;
justify-content: center;
align-items: center;
min-height: 60vh;
}`,
            js: `import { animate, stagger, splitText } from 'https://esm.sh/animejs@4.4.1';

splitText('p', {
chars: \`<span class="char-3d word-{i}">
<em class="face face-top">{value}</em>
<em class="face-front">{value}</em>
<em class="face face-bottom">{value}</em>
</span>\`,
});

const charsStagger = stagger(100, { start: 0 });

// 平滑往返：终点=起点，loop 无跳变
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
});`,
          },
          {
            id: 'text-clone', label: '文本克隆',
            desc: `**splitText 文本克隆** — 无缝向上滚动的文字流。

**原理**
- wrap: 'clip'：每个字符外包裁切容器（overflow hidden），滚动时上下溢出被裁掉
- clone: 'bottom'：每个原字符底部复制一份，原字滚出、克隆滚入，视觉上无限衔接
- 动画作用于全部字符 y: -100%：滚过一个字高正好与克隆对齐，loop 重置无跳变
- stagger(150, { from: 'center' })：从中间向两侧逐字延迟，形成波纹扩散`,
            html: `<div class="large centered row">
<p class="text-xl">Split and clone text.</p>
</div>
<div class="small row"></div>`,
            css: `body { background: #1a1a1a !important; }
.text-xl {
font-size: 1.5rem;
color: #ffffff;
letter-spacing: 0.06em;
font-family: sans-serif;
white-space: nowrap;
}
.large.centered.row {
display: flex;
justify-content: center;
align-items: center;
min-height: 60vh;
}
.small.row {
height: 0;
}`,
            js: `import { createTimeline, stagger, splitText } from 'https://esm.sh/animejs@4.4.1';

const { chars } = splitText('p', {
chars: {
wrap: 'clip',
clone: 'bottom'
},
});

createTimeline()
.add(chars, {
y: '-100%',
loop: true,
loopDelay: 350,
duration: 750,
ease: 'inOut(2)',
}, stagger(150, { from: 'center' }));`
          },
          {
            id: 'text-hover-color', label: '颜色调整',
            desc: `**splitText hover 变色 + resize 重排** — hover 单词随机变色，行上下浮动，容器宽度变化自动重新分行。

**原理**
- splitText('p', { lines: true }) 按行拆分，lines 数组是每一行
- **addEffect** 注册效果：第一个动画 lines 上下浮动（loop alternate + stagger(400) 逐行错开）；第二个给每个单词绑 pointerenter 随机变色
- **addEffect 返回值 = cleanup**：每次 re-split（resize 时）先执行，保存当前各单词颜色，重拆后恢复
- splitText 内置 **ResizeObserver**：容器宽度变化 150ms 防抖后自动 re-split；CSS resize: both 可拖右下角改宽度演示`,
            html: `<div class="iframe-content resizable">
<div class="medium centered row">
<p class="text-l">Hover the words to animate their color, then resize the text.</p>
</div>
</div>`,
            css: `body { background: #1a1a1a !important; }
.iframe-content.resizable {
width: 100%;
min-height: 55vh;
display: flex;
justify-content: center;
align-items: center;
resize: both;
overflow: hidden;
}
.medium.centered.row {
display: flex;
justify-content: center;
align-items: center;
padding: 1rem;
text-align: center;
}
.text-l {
font-size: 1.8rem;
color: #ffffff;
letter-spacing: 0.05em;
line-height: 1.7;
font-family: sans-serif;
margin: 0;
}`,
            js: `import { animate, utils, stagger, splitText } from 'https://esm.sh/animejs@4.4.1';

const colors = [];

splitText('p', {
lines: true,
})
/* Registering an animation to the split */
.addEffect(({ lines }) => animate(lines, {
y: ['50%', '-50%'],
loop: true,
alternate: true,
delay: stagger(400),
ease: 'inOutQuad',
}))
/* Registering a callback to the split */
.addEffect(split => {
split.words.forEach(($el, i) => {
const color = colors[i];
if (color) utils.set($el, { color });
$el.addEventListener('pointerenter', () => {
animate($el, {
color: utils.randomPick(['#FF4B4B', '#FFCC2A', '#B7FF54', '#57F695']),
duration: 250,
})
});
});
return () => {
/* Called between each split */
split.words.forEach((w, i) => colors[i] = utils.get(w, 'color'));
};
});`
          },
        ],
      },
    ],
  },
];

