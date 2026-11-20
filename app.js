(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var light = window.matchMedia && matchMedia('(prefers-color-scheme: light)');

  /* ---------- logos con color de marca (legibles en oscuro/claro) ---------- */
  var D = {postgresql:'6B8FF0',php:'8F93D6',nextdotjs:'DEDEDE',rust:'DEDEDE',apachekafka:'DEDEDE',jsonwebtokens:'DEDEDE',wireguard:'E05A5F',mariadb:'C49A6C',flutter:'54C5F8',mysql:'5D9CD6',githubactions:'4C9EFF',k3s:'FFC61C',mapbox:'DEDEDE',linux:'FCC624',openid:'F78C40'};
  var L = {nextdotjs:'171717',rust:'171717',apachekafka:'171717',jsonwebtokens:'171717',react:'087EA4',linux:'171717',k3s:'171717',tailwindcss:'0E7490',mapbox:'171717'};
  function recolor() {
    var map = light && light.matches ? L : D;
    document.querySelectorAll('img[data-slug]').forEach(function (i) {
      var g = i.dataset.slug, c = map[g];
      i.src = 'https://cdn.simpleicons.org/' + g + (c ? '/' + c : '');
    });
  }
  recolor(); if (light && light.addEventListener) light.addEventListener('change', recolor);

  try { lucide.createIcons(); } catch (e) {}

  /* ---------- typing en el kicker ---------- */
  var k = document.querySelector('.kicker');
  if (k && !reduce) {
    var full = k.textContent; k.textContent = ''; k.classList.add('typing'); var n = 0;
    (function t() { k.textContent = full.slice(0, ++n); if (n < full.length) setTimeout(t, 38); else k.classList.remove('typing'); })();
  }

  /* ---------- reveal al hacer scroll + contador ---------- */
  function count(el) {
    var to = parseFloat(el.dataset.count), neg = to < 0, abs = Math.abs(to), t0 = null;
    if (reduce) { el.textContent = (neg ? '−' : '') + abs; return; }
    function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / 1100, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (neg ? '−' : '') + Math.round(abs * e); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (!e.isIntersecting) return; e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(count); io.unobserve(e.target); });
  }, { threshold: .15 }) : null;
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 80 + 'ms';
    if (io && !reduce) io.observe(el); else { el.classList.add('in'); el.querySelectorAll('[data-count]').forEach(count); }
  });

  /* ---------- filtros de proyectos ---------- */
  var cards = [].slice.call(document.querySelectorAll('.pcard'));
  document.querySelectorAll('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.filters button').forEach(function (x) { x.classList.toggle('on', x === b); });
      var f = b.dataset.f;
      cards.forEach(function (c) {
        var show = f === 'all' || c.dataset.cat.split(' ').indexOf(f) > -1;
        if (show) { c.hidden = false; requestAnimationFrame(function () { c.classList.remove('out'); }); }
        else { c.classList.add('out'); setTimeout(function () { if (c.classList.contains('out')) c.hidden = true; }, reduce ? 0 : 220); }
      });
    });
  });

  /* ---------- inclinación 3D al pasar el mouse ---------- */
  if (!reduce && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.pcard, .ccard').forEach(function (c) {
      c.addEventListener('mousemove', function (e) { var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.setProperty('--rx', (-y * 5) + 'deg'); c.style.setProperty('--ry', (x * 6) + 'deg');
        c.style.setProperty('--mx', (x + .5) * 100 + '%'); c.style.setProperty('--my', (y + .5) * 100 + '%'); });
      c.addEventListener('mouseleave', function () { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- panel lateral de detalle ---------- */
  var dw = document.getElementById('drawer'), body = dw && dw.querySelector('.dw-body'), scrim = document.querySelector('.scrim'), last = null;
  function bindTabs(root) {
    root.querySelectorAll('.tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.dataset.t;
        root.querySelectorAll('.tabs button').forEach(function (x) { x.classList.toggle('on', x === b); });
        root.querySelectorAll('.tp').forEach(function (p, j) { p.classList.toggle('on', j === i); });
      });
    });
  }
  function open(card) {
    last = document.activeElement;
    var cover = card.querySelector('.cover'), more = card.querySelector('.more'), h = card.querySelector('h3');
    var link = card.querySelector('.visit');
    body.innerHTML = (cover ? '<div class="dw-cover">' + cover.innerHTML + '</div>' : '') +
      '<h3 id="dw-title">' + h.innerHTML + '</h3>' + more.innerHTML + (link ? '<p><a class="btn primary" target="_blank" rel="noopener" href="' + link.href + '">' + link.textContent + ' ↗</a></p>' : '');
    try { lucide.createIcons(); } catch (e) {}
    recolor(); bindTabs(body);
    if (reduce) body.querySelectorAll('svg').forEach(function (s) { if (s.pauseAnimations) s.pauseAnimations(); });
    scrim.hidden = false; dw.classList.add('open'); dw.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock'); dw.querySelector('.dw-close').focus();
    history.replaceState(null, '', '#' + card.id);
  }
  function close() {
    dw.classList.remove('open'); dw.setAttribute('aria-hidden', 'true'); scrim.hidden = true;
    document.body.classList.remove('lock'); if (last) last.focus();
    history.replaceState(null, '', location.pathname);
  }
  document.querySelectorAll('.pcard, .ccard').forEach(function (c) {
    c.querySelector('.more-btn').addEventListener('click', function () { open(c); });
  });
  if (dw) {
    dw.querySelector('.dw-close').addEventListener('click', close);
    scrim.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dw.classList.contains('open')) close(); });
    var h = location.hash.slice(1), t = h && document.getElementById(h);
    if (t && (t.classList.contains('pcard') || t.classList.contains('ccard'))) open(t);
  }

  if (reduce) document.querySelectorAll('svg').forEach(function (s) { if (s.pauseAnimations) s.pauseAnimations(); });
})();
