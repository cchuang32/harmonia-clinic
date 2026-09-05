import { site } from '../../site.config.mjs';
import { url, esc, jsonLd as ld, CLINIC_ID, PHYSICIAN_ID } from '../layout.mjs';
import { articleMeta, eventNotice } from '../components.mjs';

/**
 * 單篇文章頁
 * @param {object} a     文章資料（含已轉成 HTML 的 html 欄位）
 * @param {object} nav   { prev, next } 相鄰文章（依日期新到舊）
 */
export function articlePage(a, nav = {}) {
  const heroFigure = a.hero
    ? `<figure class="article-hero">
      <img src="${url(a.hero)}" alt="${esc(a.heroAlt || a.title)}" width="1200" height="675" fetchpriority="high">
      ${a.heroCaption ? `<figcaption>${esc(a.heroCaption)}</figcaption>` : ''}
    </figure>`
    : '';

  // 結構化資料，讓 Google／AI 讀得懂這是誰寫的、什麼時候更新的
  // 作者若是本院醫師，就直接指向醫師介紹頁的那個實體編號，不要另外描述一次。
  // Google 才知道寫這篇的人，就是那位有麻醉科專科的黃佳君醫師。
  const byClinicDoctor = a.author.includes('黃佳君');
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    inLanguage: 'zh-Hant-TW',
    datePublished: a.date,
    dateModified: a.updated || a.date,
    author: byClinicDoctor ? { '@id': PHYSICIAN_ID } : { '@type': 'Person', name: a.author },
    ...(byClinicDoctor ? { reviewedBy: { '@id': PHYSICIAN_ID } } : {}),
    publisher: { '@id': CLINIC_ID },
    mainEntityOfPage: `${site.url}/${a.slug}/`,
    ...(a.cover ? { image: site.url + url(a.cover) } : {}),
  };

  const body = `
<article class="article">
  <div class="wrap article-head">
    <nav class="breadcrumb" aria-label="麵包屑">
      <a href="${url('/')}">首頁</a><span>›</span><a href="${url('/articles/')}">衛教文章</a><span>›</span>${esc(a.title)}
    </nav>
    <div class="measure">
      ${a.tag ? `<span class="article-tag">${esc(a.tag)}</span>` : ''}
      <h1 class="article-title">${esc(a.title)}</h1>
      ${articleMeta(a)}
    </div>
    ${heroFigure}
  </div>

  <div class="wrap">
    <div class="article-body">
${eventNotice(a.event)}
${a.html}
    </div>

    <div class="article-foot">
      <p class="article-notice">
        <strong>提醒：</strong>本文為健康資訊參考，內容無法取代醫師的診察、診斷與治療建議。
        若症狀持續或加重，請儘早就醫。有任何疑問，歡迎來電
        <a href="${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a> 詢問${esc(site.nameZh)}。
      </p>

      <nav class="article-nav" aria-label="上下篇文章">
        ${nav.prev ? `<a href="${url('/' + nav.prev.slug + '/')}"><small>← 上一篇</small><strong>${esc(nav.prev.title)}</strong></a>` : '<span></span>'}
        ${nav.next ? `<a class="is-next" href="${url('/' + nav.next.slug + '/')}"><small>下一篇 →</small><strong>${esc(nav.next.title)}</strong></a>` : '<span></span>'}
      </nav>

      <div class="btn-row">
        <a class="btn btn--ghost" href="${url('/articles/')}">回衛教文章列表</a>
      </div>
    </div>
  </div>
</article>
`;

  return {
    title: a.title,
    description: a.excerpt,
    active: '/articles/',
    canonical: `/${a.slug}/`,
    slug: a.slug,
    ogImage: a.cover,
    breadcrumb: [{ name: '首頁', path: '/' }, { name: '衛教文章', path: '/articles/' }, { name: a.title }],
    headExtra: ld(articleLd),
    body,
  };
}
