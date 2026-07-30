import { topics, type Topic } from '../data/anime-topics';
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

export function updatePreview() {
  const html = getEditorValue('editor-html');
  const css = getEditorValue('editor-css');
  const js = getEditorValue('editor-js');

  const doc = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>${css}</style></head>
<body style="margin:0;padding:24px;font-family:sans-serif;" data-ts="${Date.now()}">
${html}
<script type="module">${js}</` + `script>
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
