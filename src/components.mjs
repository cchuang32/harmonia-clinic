import { url, esc, formatDate } from './layout.mjs';

/* ---------- 圖示（inline SVG，不依賴外部圖檔） ---------- */
const ic = (d, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}${extra}</svg>`;

export const icons = {
  calendar: ic('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>'),
  refresh: ic('<path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/>'),
  user: ic('<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v1"/>'),
  eye: ic('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'),
  heart: ic('<path d="M12 20s-7-4.6-9.2-9A5.1 5.1 0 0 1 12 6.6 5.1 5.1 0 0 1 21.2 11c-2.2 4.4-9.2 9-9.2 9Z"/>'),
  stethoscope: ic('<path d="M6 3v5a5 5 0 0 0 10 0V3"/><path d="M6 3H4M16 3h2"/><path d="M11 13v2a6 6 0 0 0 6 6 4 4 0 0 0 4-4v-2"/><circle cx="21" cy="13" r="2"/>'),
  shield: ic('<path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6Z"/><path d="m9 12 2 2 4-4"/>'),
  sparkle: ic('<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m6.3 6.3 2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8"/>'),
  leaf: ic('<path d="M4 20C4 11 10 5 20 4c1 10-5 16-14 16Z"/><path d="M4 20c4-4 7-6 12-8"/>'),
  bone: ic('<path d="m8.6 15.4 6.8-6.8"/><circle cx="6.3" cy="17.7" r="2.3"/><circle cx="8.7" cy="15.3" r="2.3"/><circle cx="15.3" cy="8.7" r="2.3"/><circle cx="17.7" cy="6.3" r="2.3"/>'),
  syringe: ic('<path d="m15 3 6 6"/><path d="m17.5 5.5-9 9L4 20l1-5 9-9"/><path d="m10.5 8.5 5 5"/>'),
  xray: ic('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 7v10"/><path d="M9 10c2 1.1 4 1.1 6 0"/><path d="M9 14c2-1.1 4-1.1 6 0"/>'),
  ultrasound: ic('<rect x="9" y="2" width="6" height="6.5" rx="2"/><path d="M5.5 12.5a9 9 0 0 1 13 0"/><path d="M8 16a5.5 5.5 0 0 1 8 0"/><path d="M10.6 19.4a2.2 2.2 0 0 1 2.8 0"/>'),
  target: ic('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>'),
  shockwave: ic('<path d="M2 12h3l2.5-6.5L12 18l2.5-6H17"/><path d="M19.5 8a6.5 6.5 0 0 1 0 8"/><path d="M21.8 5.5a10 10 0 0 1 0 13"/>'),
  iv: ic('<rect x="8" y="2" width="8" height="9" rx="2"/><path d="M12 11v5"/><path d="M12 22a2 2 0 0 1-2-2c0-1.2 2-3 2-3s2 1.8 2 3a2 2 0 0 1-2 2Z"/>'),
  clock: ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  pin: ic('<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>'),
  train: ic('<rect x="5" y="3" width="14" height="13" rx="4"/><path d="M5 11h14"/><circle cx="9" cy="13.5" r="1"/><circle cx="15" cy="13.5" r="1"/><path d="m7 20 2-3M17 20l-2-3"/>'),
  bus: ic('<rect x="4" y="4" width="16" height="12" rx="3"/><path d="M4 11h16"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/><path d="M7 16v3M17 16v3"/>'),
  car: ic('<path d="M4 15h16v-3l-1.8-4.2A2 2 0 0 0 16.4 6H7.6a2 2 0 0 0-1.8 1.2L4 12Z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>'),
  phone: ic('<path d="M5 3h3.5l1.8 4.5-2.2 1.4a12 12 0 0 0 5.5 5.5l1.4-2.2L19.5 14V17a2 2 0 0 1-2.2 2A15.8 15.8 0 0 1 3 5.2 2 2 0 0 1 5 3Z"/>'),
};

/** 2026-08-02 → 2026.08.02（卡片用的短日期） */
export const shortDate = (iso) => String(iso).replace(/-/g, '.');

/** 中繼資料小標（圖示 + 文字） */
export const metaItem = (icon, text, cls = '') =>
  `<span class="meta-item ${cls}">${icons[icon]}<span>${text}</span></span>`;

/** 瀏覽數（數字由 site.js 從 Supabase 填入；數字還沒到之前整塊隱藏，不留空位） */
export const viewCounter = (slug) =>
  `<span class="meta-item" data-view-wrap data-empty="1">${icons.eye}<span class="view-count" data-count-slug="${esc(slug)}">—</span></span>`;

/**
 * 文章卡片 — 首頁與文章列表共用。
 * 由 build 腳本直接寫進 HTML，不靠 JavaScript 產生。
 */
export function postCard(a) {
  const link = url('/' + a.slug + '/');
  const media = a.hero
    ? `<img src="${url(a.hero)}" alt="${esc(a.heroAlt || a.title)}" loading="lazy" width="1200" height="675">`
    : `<img src="${url('/assets/img/placeholder-card.svg')}" alt="" loading="lazy" width="1200" height="675">`;

  const isUpdated = a.updated && a.updated !== a.date;

  return `<article class="post-card">
        <a class="post-card-media" href="${link}" tabindex="-1" aria-hidden="true">
          ${media}
          ${a.tag ? `<span class="post-card-tag">${esc(a.tag)}</span>` : ''}
        </a>
        <div class="post-card-body">
          <h3><a href="${link}">${esc(a.title)}</a></h3>
          <p class="post-card-excerpt">${esc(a.excerpt)}</p>
          <div class="post-card-foot">
            ${metaItem('calendar', shortDate(a.date))}
            ${isUpdated ? metaItem('refresh', '更新 ' + shortDate(a.updated), 'meta-updated') : ''}
            ${metaItem('user', esc(a.author))}
            ${viewCounter(a.slug)}
          </div>
        </div>
      </article>`;
}

/** 文章頁的作者 / 日期 / 瀏覽數列 */
export function articleMeta(a) {
  const initial = (a.author || '').replace(/\s*(醫師|醫生|營養師|護理師|藥師|物理治療師)\s*$/, '').slice(0, 1) || '禾';
  const isUpdated = a.updated && a.updated !== a.date;
  return `<div class="article-meta">
      <span class="article-author">
        <span class="article-author-avatar" aria-hidden="true">${esc(initial)}</span>
        <span>
          <span class="article-author-name">${esc(a.author)}</span>
          ${a.authorRole ? `<span class="article-author-role">${esc(a.authorRole)}</span>` : ''}
        </span>
      </span>
      ${metaItem('calendar', '發佈於 ' + formatDate(a.date))}
      ${isUpdated ? metaItem('refresh', '最後更新 ' + formatDate(a.updated), 'meta-updated') : ''}
      <span class="meta-item" data-view-wrap data-empty="1">${icons.eye}<span>瀏覽 <span class="view-count" data-count-slug="${esc(a.slug)}">—</span> 次</span></span>
    </div>`;
}
