import { site } from '../site.config.mjs';

// 部署到子目錄時（例如 GitHub Pages 專案站台 /repo-name/）用 BASE_PATH 前綴。
// Cloudflare Pages 是根目錄，留空即可。
export const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '');

/** 內部連結一律經過這裡，才能同時支援根目錄與子目錄部署 */
export const url = (p) => (p.startsWith('/') ? BASE + p : p);

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** 2026-08-02 → 2026 年 8 月 2 日 */
export function formatDate(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return `${y} 年 ${m} 月 ${d} 日`;
}

function navHtml(active) {
  return site.nav.map((n) => {
    const on = n.href === active ? ' class="is-active" aria-current="page"' : '';
    return `<li><a href="${url(n.href)}"${on}>${esc(n.label)}</a></li>`;
  }).join('');
}

/**
 * 診所的結構化資料（JSON-LD）。
 *
 * 這段不會顯示在網頁上，是寫在原始碼裡給 Google 看的：診所名稱、地址、
 * 電話、看診時間與科別。Google 靠它判斷「這是新竹縣湖口鄉的一間診所」，
 * 是地區搜尋（例如「湖口 診所」）最重要的一塊。
 *
 * 資料全部來自 site.config.mjs，改那邊這裡就會跟著變，不用動這個函式。
 */
function clinicSchema() {
  const s = site.seo || {};
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: site.nameZh,
    alternateName: site.nameEn,
    description: site.tagline,
    url: site.url + '/',
    image: site.url + url(site.hero.image),
    telephone: site.contact.phoneHref.replace('tel:', ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.streetAddress,
      addressLocality: s.addressLocality,
      addressRegion: s.addressRegion,
      postalCode: s.postalCode,
      addressCountry: 'TW',
    },
    // schema.org 規定的代號：基層照護（指照護層級，非家醫專科）、麻醉、肌肉骨骼
    medicalSpecialty: ['PrimaryCare', 'Anesthesia', 'Musculoskeletal'],
    openingHoursSpecification: (s.openingHours || []).map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

/**
 * 產生完整 HTML 頁面
 * @param {object} o
 * @param {string} o.title      <title> 用
 * @param {string} o.description meta description
 * @param {string} o.active     目前頁籤 href
 * @param {string} o.body       頁面主體 HTML
 * @param {string} [o.canonical] 本頁路徑，例如 /articles/
 * @param {string} [o.ogImage]  分享縮圖路徑
 * @param {string} [o.headExtra] 額外塞進 <head> 的內容
 * @param {string} [o.bodyClass]
 */
export function page(o) {
  const title = o.title
    ? `${esc(o.title)}｜${esc(site.nameZh)} ${esc(site.nameEn)}`
    : `${esc(site.nameZh)} ${esc(site.nameEn)}${site.seo.homeTitleSuffix ? `｜${esc(site.seo.homeTitleSuffix)}` : ''}`;
  const canonical = site.url + (o.canonical || '/');
  const ogImage = site.url + url(o.ogImage || site.hero.image);

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${esc(o.description || site.tagline)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${o.canonical && o.canonical !== '/' ? 'article' : 'website'}">
<meta property="og:site_name" content="${esc(site.nameZh)}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${esc(o.description || site.tagline)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#9cab80">
<link rel="icon" href="${url('/assets/img/favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@600;700&display=swap">
<link rel="stylesheet" href="${url('/assets/css/style.css')}">
${clinicSchema()}
${o.headExtra || ''}
</head>
<body${o.bodyClass ? ` class="${o.bodyClass}"` : ''} data-page-slug="${esc(o.slug || 'home')}">
<a class="skip-link" href="#main">跳到主要內容</a>

<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${url('/')}">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="brand-text">
        <span class="brand-zh">${esc(site.nameZh)}</span>
        <span class="brand-en">${esc(site.nameEn)}</span>
      </span>
    </a>

    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="開啟選單">
      <span class="nav-toggle-bar" aria-hidden="true"></span>
      <span class="nav-toggle-bar" aria-hidden="true"></span>
      <span class="nav-toggle-bar" aria-hidden="true"></span>
    </button>

    <nav id="site-nav" class="site-nav" aria-label="主選單">
      <ul>${navHtml(o.active)}</ul>
    </nav>
  </div>
</header>

<main id="main">
${o.body}
</main>

<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-col">
      <p class="footer-brand">${esc(site.nameZh)}<span>${esc(site.nameEn)}</span></p>
      <p class="footer-tagline">${esc(site.tagline)}</p>
    </div>
    <div class="footer-col">
      <h2 class="footer-title">聯絡我們</h2>
      <p><a href="${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a></p>
      <p>LINE：${esc(site.contact.lineId)}</p>
      <p class="footer-addr">${esc(site.contact.address)}</p>
    </div>
    <div class="footer-col">
      <h2 class="footer-title">看診時間</h2>
      ${site.hours.map((h) => `<p class="footer-hours"><span>${esc(h.day)}</span>${esc(h.time)}</p>`).join('\n      ')}
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>© ${new Date().getFullYear()} ${esc(site.nameZh)} ${esc(site.nameEn)}．本網站內容僅供健康資訊參考，不能取代醫師診斷與治療。</p>
  </div>
</footer>

<script src="${url('/assets/js/config.js')}"></script>
<script src="${url('/assets/js/site.js')}" defer></script>
</body>
</html>
`;
}
