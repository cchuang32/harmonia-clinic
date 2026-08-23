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
    <p>診間裡最常被問到的問題、季節性的提醒、還有那些「醫師到底在說什麼」的名詞解釋，都寫在這裡。共 ${articles.length} 篇，最新的排在最前面。</p>
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
    description: `${site.nameZh}的衛教文章：常見症狀說明、慢性病照護、季節保養與就診須知，由診所醫師撰寫。`,
    active: '/articles/',
    canonical: '/articles/',
    slug: 'articles',
    body,
  };
}
