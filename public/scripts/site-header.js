// site-header.js — 导航栏滚动动画
(function() {
  var header = document.getElementById('site-header');
  if (!header) return;
  var brand = document.getElementById('brand');
  var linksEl = document.getElementById('nav-links');
  if (!brand || !linksEl) return;
  var links = linksEl.querySelectorAll('a');
  var scrolled = false;

  window.addEventListener('scroll', function() {
    var y = window.scrollY;
    if (y > 50 && !scrolled) {
      scrolled = true;
      header.style.background = 'rgba(255,255,255,0.95)';
      header.style.backdropFilter = 'blur(12px)';
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
      header.style.borderBottom = '1px solid rgba(0,0,0,0.06)';
      header.style.transform = 'translateY(0)';
      brand.style.color = '#1f2937';
      links.forEach(function(a) {
        a.style.color = '#6b7280';
        a.onmouseenter = function() { a.style.color = '#1f2937'; };
        a.onmouseleave = function() { a.style.color = '#6b7280'; };
      });
    } else if (y <= 50 && scrolled) {
      scrolled = false;
      header.style.background = 'transparent';
      header.style.backdropFilter = 'none';
      header.style.boxShadow = 'none';
      header.style.borderBottom = '1px solid transparent';
      header.style.transform = 'translateY(-8px)';
      brand.style.color = 'rgba(80,120,125,0.8)';
      links.forEach(function(a) {
        a.style.color = 'rgba(80,120,125,0.6)';
        a.onmouseenter = function() { a.style.color = '#fff'; };
        a.onmouseleave = function() { a.style.color = 'rgba(80,120,125,0.6)'; };
      });
    }
  });
})();
