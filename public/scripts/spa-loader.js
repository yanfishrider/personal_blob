// spa-loader.js — 文章卡片点击原地加载
(function() {
  var centerView = document.getElementById('center-view');
  if (!centerView) return;

  var listHTML = centerView.innerHTML;

  function backBtn() {
    return '<button id="back-to-list" class="flex items-center gap-1 text-sm text-gray-400 hover:text-[#49B1F5] transition-colors mb-6">' +
      '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>' +
      '返回列表</button>';
  }

  async function loadPost(href) {
    centerView.innerHTML = '<div class="text-center py-20"><span class="text-gray-400 text-sm">加载中...</span></div>';
    try {
      var res = await fetch(href);
      if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + href);
      var html = await res.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      var article = doc.getElementById('post-article');
      if (!article) throw new Error('article#post-article not found in ' + href);

      centerView.innerHTML = backBtn() + article.outerHTML;

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
    }
  });
})();
