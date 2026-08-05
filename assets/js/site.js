/* ==========================================================================
   君禾診所 Harmonia Clinic — 前端行為
   1) 手機選單開闔
   2) Supabase 瀏覽計數器（每頁獨立、首頁卡片同步顯示）
   計數器沒設定或連線失敗時，網站其他功能完全不受影響。
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. 手機選單 ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? '開啟選單' : '關閉選單');
      nav.classList.toggle('is-open', !open);
    });

    // 點選單以外的地方 / 按 Esc 就收起來
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        toggle.focus();
      }
    });
    // 回到桌機寬度時重置狀態
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 2. 瀏覽計數器 ---------- */
  var CFG = window.HARMONIA_CONFIG || {};
  if (!CFG.supabaseUrl || !CFG.supabaseAnonKey) return;

  var API = CFG.supabaseUrl.replace(/\/$/, '') + '/rest/v1';
  var HEADERS = {
    'apikey': CFG.supabaseAnonKey,
    'Authorization': 'Bearer ' + CFG.supabaseAnonKey,
    'Content-Type': 'application/json',
  };

  var pageSlug = document.body.getAttribute('data-page-slug') || 'home';

  // 這一頁需要顯示數字的所有 slug（含首頁卡片上的每篇文章）
  var targets = {};
  var nodes = document.querySelectorAll('[data-count-slug]');
  for (var i = 0; i < nodes.length; i++) {
    var s = nodes[i].getAttribute('data-count-slug');
    if (!s) continue;
    (targets[s] = targets[s] || []).push(nodes[i]);
  }

  function render(slug, value) {
    var list = targets[slug];
    if (!list) return;
    var text = Number(value).toLocaleString('zh-Hant-TW');
    for (var j = 0; j < list.length; j++) {
      list[j].textContent = text;
      var wrap = list[j].closest ? list[j].closest('[data-view-wrap]') : null;
      if (wrap) wrap.setAttribute('data-empty', '0');
    }
  }

  // 同一個瀏覽階段只加一次，重新整理不會灌水
  function shouldCount() {
    try {
      var key = 'hv:' + pageSlug;
      if (sessionStorage.getItem(key)) return false;
      sessionStorage.setItem(key, '1');
      return true;
    } catch (e) {
      return true; // 無痕模式等情況：照算
    }
  }

  function increment() {
    return fetch(API + '/rpc/increment_view', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ page_slug: pageSlug }),
    }).then(function (r) {
      if (!r.ok) throw new Error('rpc ' + r.status);
      return r.json();
    }).then(function (v) {
      render(pageSlug, v);
    });
  }

  function readAll() {
    var slugs = Object.keys(targets);
    if (!slugs.length) return Promise.resolve();
    var list = slugs.map(function (s) { return '"' + s + '"'; }).join(',');
    return fetch(API + '/page_views?select=slug,views&slug=in.(' + encodeURIComponent(list) + ')', {
      headers: HEADERS,
    }).then(function (r) {
      if (!r.ok) throw new Error('read ' + r.status);
      return r.json();
    }).then(function (rows) {
      var seen = {};
      rows.forEach(function (row) { seen[row.slug] = row.views; render(row.slug, row.views); });
      // 資料庫還沒有紀錄的（新文章）顯示 0，避免永遠空白
      slugs.forEach(function (s) { if (!(s in seen)) render(s, 0); });
    });
  }

  var work = shouldCount() ? increment() : Promise.resolve();
  work.then(readAll).catch(function (err) {
    if (window.console && console.debug) console.debug('[view counter]', err.message);
  });
})();
