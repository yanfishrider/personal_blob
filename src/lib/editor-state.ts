import { topics, type Topic, type SubItem } from '../data/anime-topics';
import { renderMarkdown } from './markdown';

// ==================== CodeMirror 编辑器实例 ====================
export let editors: Record<string, any> = {};
export let activeTab: 'html' | 'css' | 'js' = 'html';

export function getEditorValue(id: string) { return editors[id]?.state?.doc?.toString() || ''; }

export function setEditorValue(id: string, value: string) {
  const view = editors[id];
  if (!view) return;
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
}

// ==================== 预览 ====================
let previewTimer: any = null;

// 预览 iframe 内自定义光标（与 BaseLayout 全局光标同款 24×24 菱形徽章，热点=SVG顶部 (12,0)）
// iframe 是独立文档，父页面 mousemove 进不去，必须由 iframe 自己驱动
const PREVIEW_CURSOR_CSS = `html, body, body * { cursor: none !important; }
#preview-cursor {
  position: fixed; top: 0; left: 0; z-index: 99999;
  width: 24px; height: 24px;
  pointer-events: none;
  transform: translate(-100px, -100px);
  will-change: transform;
  opacity: 0;
  transition: opacity 0.2s;
}
#preview-cursor svg { display: block; width: 100%; height: 100%; }`;

const PREVIEW_CURSOR_HTML = `<div id="preview-cursor" aria-hidden="true">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="72.9 8.1 299 432.9" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
<g transform="translate(0,448) scale(0.1,-0.1)" fill="#000000" stroke="none">
<path d="M2191 4363 c-10 -21 -152 -324 -316 -673 -164 -349 -315 -673 -337 -720 -22 -47 -123 -263 -225 -480 -102 -217 -222 -471 -267 -565 l-81 -170 -3 -244 -3 -245 598 -598 c329 -329 600 -598 603 -598 30 1 31 21 36 516 4 274 7 500 8 501 0 0 12 3 26 5 l25 3 3 -499 c2 -496 4 -526 36 -526 6 0 277 267 603 592 l593 593 0 248 0 248 -402 857 c-220 471 -434 927 -473 1012 -233 499 -354 751 -365 765 -20 24 -38 18 -59 -22z m141 -291 c54 -114 188 -400 298 -637 111 -236 280 -597 376 -800 96 -204 174 -376 174 -383 0 -10 -488 -264 -597 -310 -32 -14 -34 -13 -79 27 -63 55 -139 83 -245 89 -130 7 -220 -24 -311 -106 l-38 -34 -317 162 c-175 89 -319 164 -321 165 -2 2 34 81 79 176 45 96 115 245 155 332 279 596 567 1210 639 1362 31 66 61 130 66 143 5 12 12 22 16 22 5 0 52 -93 105 -208z m-811 -2141 l314 -159 6 -74 c7 -84 17 -113 61 -175 36 -50 130 -117 189 -134 l39 -12 0 -359 c0 -197 -3 -358 -7 -358 -13 0 -1083 1074 -1083 1087 0 16 153 343 160 343 4 0 148 -72 321 -159z m1822 -16 l79 -168 -546 -546 -546 -546 0 363 c0 338 1 362 18 362 34 0 142 60 185 102 65 66 99 142 99 226 l1 68 306 157 c168 86 310 155 316 153 5 -1 44 -78 88 -171z m-1223 -1535 l0 -175 -539 540 -540 540 -3 177 -3 178 543 -542 542 -543 0 -175z m756 361 l-544 -544 -1 177 -2 176 543 543 543 543 3 -175 2 -175 -544 -545z" />
<path d="M740 781 c-16 -30 -14 -612 3 -634 11 -16 36 -17 272 -15 l260 3 3 319 c2 227 -1 323 -9 332 -9 11 -63 14 -265 14 -240 0 -254 -1 -264 -19z m476 -188 l-1 -138 -207 -3 -208 -2 0 140 0 140 209 0 208 0 -1 -137z m-6 -308 l0 -85 -200 0 -200 0 0 85 0 85 200 0 200 0 0 -85z" />
<path d="M3192 792 c-9 -7 -12 -80 -10 -333 l3 -324 265 0 265 0 3 319 c2 227 -1 323 -9 332 -9 11 -61 14 -258 14 -135 0 -252 -4 -259 -8z m468 -202 l0 -140 -210 0 -210 0 0 140 0 140 210 0 210 0 0 -140z m-10 -305 l0 -85 -200 0 -200 0 0 85 0 85 200 0 200 0 0 -85z" />
</g>
<path style="fill:#898d7f;fill-opacity:1;stroke-width:0.732924" d="m 108.10634,559.58773 v -10.99386 h 26.38528 26.38527 v 10.99386 10.99387 h -26.38527 -26.38528 z" transform="scale(0.75)" />
<path style="fill:#898d7f;fill-opacity:1;stroke-width:0.732924" d="m 433.52474,559.58773 v -10.99386 h 26.38528 26.38528 v 10.99386 10.99387 h -26.38528 -26.38528 z" transform="scale(0.75)" />
<path style="fill:#898d7f;fill-opacity:1;stroke-width:0.732924" d="m 311.12638,547.12522 v -23.08713 l 71.71206,-71.70925 71.71206,-71.70926 0.48099,6.77622 c 0.26454,3.72692 0.48098,13.89968 0.48098,22.60612 v 15.82991 l -72.19304,72.19026 -72.19305,72.19025 z" transform="scale(0.75)" />
<path style="fill:#898d7f;fill-opacity:1;stroke-width:0.732924" d="m 210.71575,497.18285 -71.46013,-71.96266 -0.43543,-22.41623 c -0.23949,-12.32893 -0.39034,-22.48526 -0.33523,-22.56962 0.0551,-0.0844 32.49545,32.2431 72.08963,71.83881 l 71.98942,71.99221 -0.19407,22.54007 -0.19407,22.54009 z" transform="scale(0.75)" />
<path style="fill:#ffffff;stroke-width:1.46585" d="m 211.81513,318.65389 c -22.17096,-11.35106 -40.52555,-20.84394 -40.78797,-21.09527 -0.26243,-0.25135 17.08686,-37.95124 38.55396,-83.77755 21.46711,-45.82629 49.71617,-106.22862 62.77571,-134.227396 13.05953,-27.998772 24.13311,-50.920981 24.60796,-50.938242 0.47484,-0.01726 23.84488,48.946286 51.93343,108.807878 74.38772,158.53321 74.28128,158.29661 72.15042,160.39132 -2.8505,2.80216 -76.57576,40.06349 -79.26962,40.06349 -1.32532,0 -5.35023,-2.24457 -8.94424,-4.98793 -9.74341,-7.43732 -19.63475,-10.26317 -36.00042,-10.28494 -11.88646,-0.0158 -15.1159,0.53247 -22.05462,3.74431 -4.47098,2.06955 -10.49475,5.83994 -13.38615,8.37861 -2.89141,2.53869 -6.15947,4.60414 -7.26236,4.58991 -1.10289,-0.0142 -20.14514,-9.31312 -42.3161,-20.66419 z" transform="scale(0.75)" />
<path style="fill:#ffffff;stroke-width:1.46585" d="m 311.49284,461.38485 v -45.78756 l 9.39619,-4.26044 c 10.97764,-4.9775 21.81963,-14.42833 26.18031,-22.82106 1.91753,-3.69056 3.3929,-10.00674 3.90753,-16.72847 l 0.82681,-10.79918 40.31084,-20.28876 c 22.17096,-11.15882 40.66092,-20.31637 41.08879,-20.35011 0.83376,-0.0657 9.08432,16.09118 16.88432,33.06424 l 4.78159,10.40493 -71.68819,71.67699 -71.68819,71.677 z" transform="scale(0.75)" />
<path style="fill:#ffffff;stroke-width:1.46585" d="m 210.60351,436.24753 c -38.83823,-39.01486 -70.61496,-71.55399 -70.61496,-72.30918 0,-2.79956 19.4622,-43.65042 20.79597,-43.65042 0.76152,0 19.73478,9.24171 42.1628,20.53712 l 40.77821,20.53712 1.02938,9.87924 c 0.56616,5.43359 2.20739,12.57674 3.64719,15.87367 4.45947,10.21158 17.57304,21.41484 29.74269,25.40996 l 5.49693,1.80457 -0.17343,42.02947 c -0.0954,23.11621 -0.64062,44.00836 -1.21163,46.42701 -1.01931,4.31759 -2.3223,3.10759 -71.65315,-66.53856 z" transform="scale(0.75)" />
<path style="fill:#ffffff;stroke-width:1.46585" d="m 433.15828,518.91043 v -18.32311 h 27.1182 27.1182 v 18.32311 18.32311 h -27.1182 -27.1182 z" transform="scale(0.75)" />
<path style="fill:#ffffff;stroke-width:1.46585" d="m 107.73988,519.1224 v -18.53508 h 27.1182 27.1182 v 17.59019 17.59018 l -17.22372,0.0104 c -9.47305,0.006 -21.67624,0.43093 -27.1182,0.94489 l -9.89448,0.93448 z" transform="scale(0.75)" />
</svg>
</div>`;

const PREVIEW_CURSOR_JS = `(function () {
  var cursor = document.getElementById('preview-cursor');
  if (!cursor) return;
  var HOT_X = 12, HOT_Y = 0;
  cursor.style.transformOrigin = HOT_X + 'px ' + HOT_Y + 'px';
  var shown = false;
  var hideTimer = null;

  // 核心光标的显示与移动逻辑
  function moveCursor(e) {
    if (!shown) { cursor.style.opacity = 1; shown = true; }
    cursor.style.transform =
      'translate(' + (e.clientX - HOT_X) + 'px,' + (e.clientY - HOT_Y) + 'px) rotate(-30deg)';
  }

  // 1. 进入 iframe 文档的瞬间立即激活光标（用 mouseenter 事件自带坐标定位）
  // 解决「进入 iframe 后必须等第一次 mousemove 才有光标」的无光标盲区
  document.addEventListener('mouseenter', function (e) {
    clearTimeout(hideTimer);
    console.log('[preview-cursor] mouseenter 进入 iframe，立即显示 (' + e.clientX + ',' + e.clientY + ')');
    moveCursor(e);
  });

  // 2. 鼠标移动跟随
  document.addEventListener('mousemove', function (e) {
    if (!shown) console.log('[preview-cursor] 首次 mousemove，显示光标');
    moveCursor(e);
  });

  // 3. 离开 iframe 时延迟隐藏（与父页面光标切换衔接，避免瞬间消失闪烁）
  document.addEventListener('mouseleave', function () {
    console.log('[preview-cursor] mouseleave 离开 iframe，100ms 后隐藏');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      console.log('[preview-cursor] iframe 光标已隐藏');
      cursor.style.opacity = 0;
      shown = false;
    }, 100);
  });
})();`;

export function updatePreview() {
  const html = getEditorValue('editor-html');
  const css = getEditorValue('editor-css');
  const js = getEditorValue('editor-js');

  const doc = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>${css}</style>
<style>${PREVIEW_CURSOR_CSS}</style></head>
<body style="margin:0;padding:24px;font-family:sans-serif;" data-ts="${Date.now()}">
${PREVIEW_CURSOR_HTML}
${html}
<script type="module">${js}</` + `script>
<script>${PREVIEW_CURSOR_JS}</` + `script>
</body></html>`;

  const frame = document.getElementById('preview-frame') as HTMLIFrameElement;
  if (frame) frame.srcdoc = doc;
}

export function debouncedUpdatePreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(updatePreview, 400);
}

// ==================== 信息面板 ====================
export function showInfo(text: string) {
  const panel = document.getElementById('info-panel');
  if (!panel) return;
  panel.innerHTML = renderMarkdown(text);
}

// ==================== 主题加载 ====================
export function loadTopic(id: string) {
  const t = topics.find(t => t.id === id);
  if (!t) return;
  setEditorValue('editor-html', t.html);
  setEditorValue('editor-css', t.css);
  setEditorValue('editor-js', t.js);
  showInfo(t.desc);
  updatePreview();
}

export function loadSubTopic(parentId: string, subId: string) {
  const parent = topics.find(t => t.id === parentId);
  const sub = parent?.children?.find(s => s.id === subId);
  if (!sub) return;
  setEditorValue('editor-html', sub.html);
  setEditorValue('editor-css', sub.css);
  setEditorValue('editor-js', sub.js);
  showInfo(sub.desc || parent?.desc || '');
  updatePreview();
}

export function loadSubSubTopic(parentId: string, subId: string, ssId: string) {
  const parent = topics.find(t => t.id === parentId);
  const sub = parent?.children?.find(s => s.id === subId);
  const ss = sub?.children?.find(s => s.id === ssId);
  if (!ss) return;
  setEditorValue('editor-html', ss.html);
  setEditorValue('editor-css', ss.css);
  setEditorValue('editor-js', ss.js);
  showInfo(ss.desc || parent?.desc || '');
  updatePreview();
}

// ==================== 标签切换 ====================
export function switchTab(tab: 'html' | 'css' | 'js') {
  if (tab === activeTab) return;
  activeTab = tab;

  ['editor-html', 'editor-css', 'editor-js'].forEach(id => {
    const el = document.getElementById(id)!;
    el.classList.toggle('hidden', id !== `editor-${tab}`);
  });

  document.querySelectorAll('.editor-tab').forEach(btn => {
    const isActive = (btn as HTMLElement).dataset.tab === tab;
    (btn as HTMLElement).style.color = isActive ? '#ff7b42' : '';
    (btn as HTMLElement).style.borderColor = isActive ? '#ff7b42' : 'transparent';
  });

  editors[`editor-${tab}`]?.requestMeasure();
}

// ==================== 递归查找（支持任意深度） ====================
function collectAll(items: (Topic | SubItem)[]): (Topic | SubItem)[] {
  const result: (Topic | SubItem)[] = [];
  for (const item of items) {
    result.push(item);
    if ('children' in item && item.children) {
      result.push(...collectAll(item.children));
    }
  }
  return result;
}

export function findItemById(id: string): Topic | SubItem | undefined {
  return collectAll(topics).find(t => t.id === id);
}

export function loadItemById(id: string) {
  const item = findItemById(id);
  if (!item) return;
  setEditorValue('editor-html', item.html);
  setEditorValue('editor-css', item.css);
  setEditorValue('editor-js', item.js);
  showInfo(item.desc || '');
  updatePreview();
}
