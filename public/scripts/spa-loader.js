// spa-loader.js — 文章卡片点击原地加载
(function() {
  var centerView = document.getElementById('center-view');
  if (!centerView) return;

  var listHTML = centerView.innerHTML;

  var MIN_LOADING_MS = 400; // 加载圆环最小展示时长，避免加载太快像闪烁
  var loadSeq = 0; // 请求序号，防止快速连点时旧请求的 setTimeout 误复位光标

  async function loadPost(href) {
    var seq = ++loadSeq;
    if (window.setCursorState) window.setCursorState('loading');
    var loadStart = Date.now();
    centerView.innerHTML = '<div class="text-center py-20"><span class="text-gray-400 text-sm">加载中...</span></div>';
    try {
      var res = await fetch(href);
      if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + href);
      var html = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      var article = doc.getElementById('post-article');
      if (!article) throw new Error('article#post-article not found in ' + href);

      centerView.innerHTML = article.outerHTML;

      // 返回列表按钮是文章页自带的（整页刷新时是真实链接回首页），
      // SPA 场景接管为 history.back() 返回列表
      var btn = document.getElementById('back-to-list');
      if (btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          history.back();
        });
      }

      history.pushState({ view: 'post', href: href }, '', href);
    } catch (err) {
      console.error('loadPost failed:', err);
      centerView.innerHTML = '<div class="text-center py-20 text-gray-400 text-sm">加载失败，请刷新重试</div>';
    }
    // 保证圆环至少展示 MIN_LOADING_MS，不足则补齐；仅当仍是最新请求时才复位
    var elapsed = Date.now() - loadStart;
    var remain = MIN_LOADING_MS - elapsed;
    if (remain > 0) {
      setTimeout(function() {
        if (seq === loadSeq && window.setCursorState) window.setCursorState('default');
      }, remain);
    } else {
      if (seq === loadSeq && window.setCursorState) window.setCursorState('default');
    }
  }

  centerView.addEventListener('click', function(e) {
    var card = e.target.closest('a.post-card');
    if (!card) return;
    e.preventDefault();
    loadPost(card.getAttribute('href'));
  });

  window.addEventListener('popstate', function(e) {
    if (e.state && e.state.view === 'post') {
      loadPost(e.state.href);
    } else {
      centerView.innerHTML = listHTML;
      if (window.setCursorState) window.setCursorState('default');
    }
  });
})();
