import { site } from '../../site.config.mjs';
import { url, esc } from '../layout.mjs';
import { icons } from '../components.mjs';

// ---------------------------------------------------------------------------
// ★ 請改成診所實際的特色與團隊資料。
// ---------------------------------------------------------------------------
// 診療設備與服務。只列名稱，不加療效描述。
// 要增減項目直接改這個陣列，然後 npm run build。
const facilities = [
  { icon: 'xray', title: '數位 X 光機' },
  { icon: 'ultrasound', title: '肌肉骨骼神經超音波檢查' },
  { icon: 'syringe', title: '自體骨髓再生注射治療' },
  { icon: 'target', title: '超音波導引再生注射治療' },
  { icon: 'shockwave', title: '體外震波治療' },
  { icon: 'iv', title: '營養點滴' },
];

// 敘述型特色，每一項會在「診療設備與服務」下方各自成為一個區塊。
// 陣列留空則整段不顯示。
const pillars = [
  {
    title: '空間像家一樣安心',
    desc: '木質調候診區、柔和照明與充足採光，並保留寬敞動線，讓推車與行動不便的長輩都能自在進出。',
  },
];

// ---------------------------------------------------------------------------
// 醫師介紹。要新增醫師就往陣列裡再加一個物件；陣列留空則整區不顯示。
//
// role 目前只寫「麻醉科．疼痛科專科醫師」，依據是下方兩張專科醫師證書。
// 若黃醫師是君禾診所院長，可改成「院長．麻醉科／疼痛科專科醫師」。
// ---------------------------------------------------------------------------
const team = [
  {
    name: '黃佳君 醫師',
    role: '麻醉科．疼痛科專科醫師',
    education: ['長庚大學醫學系'],
    experience: [
      '林口長庚醫院麻醉部主治醫師',
      '花蓮慈濟醫院麻醉部主治醫師',
      '花蓮門諾醫院疼痛科醫師',
      '新竹菁英診所院長',
    ],
    credentials: [
      '台灣麻醉醫學會專科醫師',
      '台灣疼痛醫學會專科醫師',
      '台灣增生療法醫學會會員',
      '台灣區域麻醉暨止痛醫學會會員',
      '台灣區域麻醉暨止痛醫學會工作坊講師',
    ],
  },
];

const credList = (label, items) => items && items.length ? `<div class="doctor-group">
            <h3 class="doctor-group-title">${esc(label)}</h3>
            <ul class="doctor-list">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
          </div>` : '';

export function featuresPage() {
  const body = `
<section class="page-head">
  <div class="wrap">
    <span class="eyebrow">Why Harmonia</span>
    <h1>本院特色</h1>
    <p>${esc(site.nameZh)}是一間以家醫科與疼痛科為主的診所。「君禾」取自和諧與溫潤之意，英文 Harmonia 也是同一個念頭——我們希望這裡不只是生病才來的地方，而是你想到健康時，第一個信任的名字。</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Facilities</span>
      <h2 class="section-title">診療設備與服務</h2>
    </div>
    <div class="facility-grid">
      ${facilities.map((f) => `<div class="facility">
        <div class="card-icon">${icons[f.icon]}</div>
        <h3>${esc(f.title)}</h3>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

${pillars.map((p) => `<section class="section section--paper">
  <div class="wrap measure">
    <div class="section-head">
      <span class="eyebrow">Our Space</span>
      <h2 class="section-title">${esc(p.title)}</h2>
    </div>
    <p class="section-lead">${esc(p.desc)}</p>
  </div>
</section>`).join('\n')}

${team.length ? `<section class="section section--tint">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Our Team</span>
      <h2 class="section-title">醫師介紹</h2>
      <p class="section-lead">認識為你看診的人。</p>
    </div>
    ${team.map((t) => `<article class="doctor">
      <div class="doctor-id">
        <span class="doctor-avatar" aria-hidden="true">${esc(t.name.slice(0, 1))}</span>
        <h3 class="doctor-name">${esc(t.name)}</h3>
        <p class="doctor-role">${esc(t.role)}</p>
      </div>
      <div class="doctor-groups">
        ${credList('學歷', t.education)}
        ${credList('經歷', t.experience)}
        ${credList('專科證照與學會', t.credentials)}
      </div>
    </article>`).join('\n    ')}
  </div>
</section>` : ''}

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
    description: `${site.nameZh}是以家醫科與疼痛科為主的診所，由黃佳君醫師（台灣麻醉醫學會、台灣疼痛醫學會專科醫師）看診。設有數位 X 光機、肌肉骨骼神經超音波檢查、超音波導引再生注射治療、體外震波治療與營養點滴。`,
    active: '/features/',
    canonical: '/features/',
    slug: 'features',
    body,
  };
}
