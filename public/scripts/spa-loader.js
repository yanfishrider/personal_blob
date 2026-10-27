// spa-loader.js — 首页文章卡片原地加载（保留左右栏，避免整页重载）
// 覆盖：标题 / meta / OG / 右侧栏 / TOC 重建 / 滚动复位 / 前进后退
(function () {
  var centerView = document.getElementById('center-view');
  if (!centerView) return;

  var rail = document.getElementById('rail-content');
  var listHTML = centerView.innerHTML;
  var railHTML = rail ? rail.innerHTML : '';
  var listTitle = document.title;
  var listDesc = meta('description')?.getAttribute('content') || '';
  var listUrl = location.href;

  var MIN_LOADING_MS = 400;
  var seq = 0;
  var controller = null;

  function meta(name) {
    return document.querySelector('meta[name="' + name + '"]');
  }
  function og(prop) {
    return document.querySelector('meta[property="og:' + prop + '"]');
  }
  function setMeta(el, value) {
    if (el && value != null) el.setAttribute('content', value);
  }

  function applyHead(doc) {
    if (!doc) return;
    if (doc.title) document.title = doc.title;
    var d = doc.querySelector('meta[name="description"]');
    var t = doc.querySelector('meta[property="og:title"]');
    var od = doc.querySelector('meta[property="og:description"]');
    setMeta(meta('description'), d && d.getAttribute('content'));
    setMeta(og('title'), t && t.getAttribute('content'));
    setMeta(og('description'), od && od.getAttribute('content'));
    setMeta(og('url'), doc.querySelector('meta[property="og:url"]')?.getAttribute('content'));
  }

  function restoreHead() {
    document.title = listTitle;
    setMeta(meta('description'), listDesc);
    setMeta(og('title'), listTitle);
    setMeta(og('description'), listDesc);
    setMeta(og('url'), listUrl);
  }

  function swapIn(articleHtml, railHtml, doc) {
    centerView.innerHTML = articleHtml;
    if (rail && railHtml != null) rail.innerHTML = railHtml;
    applyHead(doc);
    document.dispatchEvent(new CustomEvent('astro:spa-navigate'));
  }

  function setLoading(on) {
    if (window.setCursorState) window.setCursorState(on ? 'loading' : 'default');
  }

  async function loadPost(href, options) {
    var opts = options || {};
    var mySeq = ++seq;
    if (controller) controller.abort();
    controller = new AbortController();

    setLoading(true);
    if (!opts.silent) {
      centerView.innerHTML = '<div class="text-center py-24 text-[13px] text-[var(--ink-4)]">加载中…</div>';
    }
    var started = Date.now();

    try {
      var res = await fetch(href, { signal: controller.signal });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var html = await res.text();
      var doc = new DOMParser().parseFromString(html, 'text/html');

      var article = doc.getElementById('post-article');
      if (!article) throw new Error('post-article not found');

      swapIn(article.outerHTML, doc.getElementById('rail-content')?.innerHTML, doc);

      var btn = document.getElementById('back-to-list');
      if (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          if (history.state && history.state.view === 'post') history.back();
          else location.href = btn.getAttribute('href');
        });
      }

      if (!opts.fromHistory) {
        history.pushState({ view: 'post', href: href }, '', href);
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      console.error('loadPost failed:', err);
      if (mySeq === seq) {
        centerView.innerHTML =
          '<div class="empty-state">加载失败，请检查网络后重试。<br><br>' +
          '<a class="btn" href="' + href + '">直接打开这篇文章</a></div>';
      }
    } finally {
      if (mySeq === seq) {
        var remain = MIN_LOADING_MS - (Date.now() - started);
        if (remain > 0) setTimeout(function () { if (mySeq === seq) setLoading(false); }, remain);
        else setLoading(false);
      }
    }
  }

  centerView.addEventListener('click', function (e) {
    var card = e.target.closest('a.post-card');
    if (!card) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    history.replaceState(
      Object.assign({}, history.state, { view: 'list', scrollY: window.scrollY }),
      '',
      location.href
    );
    loadPost(card.getAttribute('href'));
  });

  window.addEventListener('popstate', function (e) {
    var state = e.state;
    if (state && state.view === 'post') {
      loadPost(state.href, { fromHistory: true, silent: true });
      return;
    }
    centerView.innerHTML = listHTML;
    if (rail) rail.innerHTML = railHTML;
    restoreHead();
    setLoading(false);
    document.dispatchEvent(new CustomEvent('astro:spa-navigate'));
    if (state && typeof state.scrollY === 'number') {
      window.scrollTo({ top: state.scrollY, behavior: 'auto' });
    }
  });
})();
