import { site } from '../../site.config.mjs';
import { url, esc } from '../layout.mjs';
import { icons } from '../components.mjs';

// ---------------------------------------------------------------------------
// ★ 請改成診所實際的特色與團隊資料。
// ---------------------------------------------------------------------------
const pillars = [
  {
    num: 'ONE', icon: 'clock', title: '看診不趕時間',
    desc: '我們刻意把每位病人的門診時間拉長。三分鐘看完一個人，很難聽出真正的問題；把話說完，醫師才有辦法做出對的判斷。',
  },
  {
    num: 'TWO', icon: 'user', title: '一位醫師，長期陪伴',
    desc: '固定主治醫師制。你的病史、體質、工作型態與生活習慣，不需要每次重講一遍；醫師記得你，照顧才接得起來。',
  },
  {
    num: 'THREE', icon: 'heart', title: '把話說成聽得懂的話',
    desc: '不用醫學名詞把人擋在門外。檢查數字代表什麼、藥為什麼要這樣吃、什麼情況要立刻回診，我們會講到你點頭為止。',
  },
  {
    num: 'FOUR', icon: 'leaf', title: '空間像家一樣安心',
    desc: '木質調候診區、柔和照明與充足採光，並保留寬敞動線，讓推車與行動不便的長輩都能自在進出。',
  },
  {
    num: 'FIVE', icon: 'shield', title: '感染管控不打折',
    desc: '診間與器械依標準流程消毒，候診區定時換氣。呼吸道症狀者提供分流動線，讓每個人都安心候診。',
  },
  {
    num: 'SIX', icon: 'sparkle', title: '看完診，照顧不中斷',
    desc: '慢性病追蹤提醒、檢查報告通知、用藥調整回覆，透過電話與 LINE 持續聯繫，不讓治療斷在離開診所那一刻。',
  },
];

// ★ 請改成實際的醫師資料
const team = [
  {
    name: '王君禾 醫師', role: '院長．家庭醫學專科',
    bio: '相信醫療的價值不只在治好一次病，而是讓人有能力照顧自己。門診中最常做的事，是把複雜的醫學翻譯成病人能實踐的日常。',
    tags: ['家庭醫學專科醫師', '慢性病照護', '成人預防保健'],
  },
  {
    name: '李和安 醫師', role: '主治醫師．內科',
    bio: '專注慢性病與代謝問題的長期管理，習慣從飲食、作息與工作型態一起找原因，而不只是調整藥量。',
    tags: ['內科專科醫師', '糖尿病衛教', '代謝症候群'],
  },
];

export function featuresPage() {
  const body = `
<section class="page-head">
  <div class="wrap">
    <span class="eyebrow">Why Harmonia</span>
    <h1>本院特色</h1>
    <p>「君禾」取自和諧與溫潤之意，英文 Harmonia 也是同一個念頭。我們希望這裡不只是生病才來的地方，而是你想到健康時，第一個信任的名字。</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="grid grid--3">
      ${pillars.map((p) => `<div class="card card--num">
        <div class="card-icon">${icons[p.icon]}</div>
        <span class="card-num">${esc(p.num)}</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.desc)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Our Team</span>
      <h2 class="section-title">醫師團隊</h2>
      <p class="section-lead">認識為你看診的人。</p>
    </div>
    <div class="grid grid--2">
      ${team.map((t) => `<div class="card">
        <h3>${esc(t.name)}</h3>
        <p style="color:var(--gold-600);font-weight:500;margin-top:4px">${esc(t.role)}</p>
        <p>${esc(t.bio)}</p>
        <ul>${t.tags.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="wrap measure">
    <div class="section-head">
      <span class="eyebrow">Our Promise</span>
      <h2 class="section-title">我們對自己的要求</h2>
    </div>
    <dl class="info-list">
      <div class="info-row"><dt>不過度醫療</dt><dd>不需要的檢查不做、不需要的藥不開。該轉診的時候，我們會直接告訴你。</dd></div>
      <div class="info-row"><dt>資訊透明</dt><dd>自費項目在做之前一定先說明內容與費用，你同意了我們才進行。</dd></div>
      <div class="info-row"><dt>尊重隱私</dt><dd>診間一次一位病人，病情討論不在櫃台進行。</dd></div>
      <div class="info-row"><dt>持續學習</dt><dd>醫療會進步，我們也要。團隊定期參與繼續教育與個案討論。</dd></div>
    </dl>
  </div>
</section>

<section class="section cta">
  <div class="wrap">
    <h2>把健康交給願意花時間的人</h2>
    <p>歡迎預約門診，或直接來診所走走。</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="${site.contact.phoneHref}">${icons.phone} ${esc(site.contact.phone)}</a>
      <a class="btn btn--ghost" href="${url('/services/')}">看看治療項目</a>
    </div>
  </div>
</section>
`;

  return {
    title: '本院特色',
    description: `${site.nameZh}的看診理念、空間規劃與醫師團隊介紹。看診不趕時間、一位醫師長期陪伴、把話說成聽得懂的話。`,
    active: '/features/',
    canonical: '/features/',
    slug: 'features',
    body,
  };
}
