import { site } from '../../site.config.mjs';
import { esc } from '../layout.mjs';
import { postCard } from '../components.mjs';

export function articlesPage(articles) {
  // 依標籤分組（保留原本「最新在前」的排序）
  const tags = [];
  for (const a of articles) if (a.tag && !tags.includes(a.tag)) tags.push(a.tag);

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
    ${tags.length ? `<p class="section-lead" style="margin-bottom:26px">主題：${tags.map((t) => esc(t)).join('、')}</p>` : ''}
    ${articles.length ? `<div class="post-grid">
      ${articles.map(postCard).join('\n      ')}
    </div>` : '<p class="section-lead">文章準備中，很快就與你見面。</p>'}
  </div>
</section>
`;

  return {
    title: '衛教文章',
    description: `${site.nameZh}的衛教文章：疼痛與再生注射、慢性病照護、常見症狀說明與就診須知，由黃佳君醫師撰寫，把診間裡最常被問到的問題寫成看得懂的說明。`,
    active: '/articles/',
    canonical: '/articles/',
    slug: 'articles',
    body,
  };
}
