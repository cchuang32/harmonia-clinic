import { site } from '../../site.config.mjs';
import { esc } from '../layout.mjs';
import { postCard } from '../components.mjs';

// 列表分成兩區：診所公告在上、衛教文章在下。
// 兩者壽命不同——公告會過期（例如開診日期），衛教文章放兩年還是有用；
// 混在一起的話，舊公告會一直佔著最顯眼的位置，來找衛教的人得先跳過它。
// 分區只是版面，沒有另外產生分類頁：文章量還少，薄頁面對搜尋排名反而不利。
// 某一區沒有文章時整區不輸出，版面不會開天窗。
const NOTICE_TAG = '診所公告';

export function articlesPage(articles) {
  // 兩區都保留原本「最新在前」的排序
  const notices = articles.filter((a) => a.tag === NOTICE_TAG);
  const posts = articles.filter((a) => a.tag !== NOTICE_TAG);

  const group = (title, lead, list) => list.length ? `<div class="post-group">
      <div class="section-head">
        <h2 class="section-title">${esc(title)}</h2>
        <p class="section-lead">${esc(lead)}</p>
      </div>
      <div class="post-grid">
        ${list.map(postCard).join('\n        ')}
      </div>
    </div>` : '';

  const body = `
<section class="page-head">
  <div class="wrap">
    <span class="eyebrow">Journal</span>
    <h1>衛教文章</h1>
    <p>門診說不完的，寫在這裡。不推銷任何治療，只把事情說清楚，包括它的限制。</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${articles.length
      ? group('診所公告', '看診時間、休診與服務調整，會先公告在這裡。', notices)
        + group('健康知識', '門診最常被問到的問題，寫成看得懂的說明。', posts)
      : '<p class="section-lead">文章準備中，很快就與你見面。</p>'}
  </div>
</section>
`;

  return {
    title: '衛教文章',
    description: `${site.nameZh}的衛教文章：疼痛與再生注射、慢性病照護、常見症狀說明與就診須知，由黃佳君醫師撰寫，把診間裡最常被問到的問題寫成看得懂的說明。`,
    active: '/articles/',
    canonical: '/articles/',
    slug: 'articles',
    breadcrumb: [{ name: '首頁', path: '/' }, { name: '衛教文章' }],
    body,
  };
}
