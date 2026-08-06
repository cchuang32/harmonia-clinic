import { site } from '../../site.config.mjs';
import { url, esc } from '../layout.mjs';
import { icons } from '../components.mjs';

// ---------------------------------------------------------------------------
// ★ 請改成診所實際的特色與團隊資料。
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// 診療設備與服務。
//
// 衛教文字的寫法原則：只描述「這是什麼、過程如何」，不寫療效保證，
// 是否適用一律導回醫師評估。這是醫療廣告規範下最安全的寫法，
// 若要加入療效相關敘述，請先由醫師確認過再放。
// ---------------------------------------------------------------------------
const facilities = [
  {
    icon: 'xray', title: '數位 X 光機',
    desc: '用數位感測器取代傳統底片，拍完幾秒內影像就出現在螢幕上，醫師可以當場放大、調整對比，跟你一起看。輻射劑量比傳統 X 光低，也省去沖洗等待。主要用來觀察骨骼結構，例如關節間隙、骨刺、脊椎排列與骨折。',
  },
  {
    icon: 'ultrasound', title: '肌肉骨骼神經超音波檢查',
    desc: '沒有輻射，能即時看見肌肉、肌腱、韌帶與周邊神經的狀態。最大的特點是「會動」——醫師可以一邊請你活動關節，一邊觀察組織在動作中的變化，這是靜態影像看不到的。檢查時只需在皮膚塗上凝膠，不會疼痛。',
  },
  {
    icon: 'syringe', title: '自體骨髓再生注射治療',
    desc: '抽取自己的骨髓後，不經離心處理，直接注射到病灶部位。因為取自本人，沒有排斥的問題。抽取部位、注射次數與間隔會因人而異，是否適合須由醫師評估後說明。',
  },
  {
    icon: 'target', title: '超音波導引再生注射治療',
    desc: '注射全程以超音波即時定位，醫師看得到針尖走到哪裡，能避開血管與神經，把藥物送到真正需要的位置。相較於憑手感施打，位置更明確，也能減少不必要的疼痛。',
  },
  {
    icon: 'shockwave', title: '體外震波治療',
    desc: '將聲波能量從體表傳入深層組織，不需開刀、不用麻醉，治療結束即可自行離開。單次約十幾分鐘，通常安排數次為一個療程。過程中會有痠脹感，強度會依你的耐受度調整。',
  },
  {
    icon: 'iv', title: '營養點滴',
    desc: '依個人狀況調配的靜脈輸液，讓水分、電解質與維生素等營養素直接進入血液循環。配方與是否需要施打須由醫師評估，並非人人適用；有慢性疾病或正在服藥者，請務必先告知醫師。',
  },
];

// 這段說明會出現在設備清單下方
const facilityNotice = '以上為一般性說明，僅供了解各項檢查與治療的原理與過程，無法取代醫師的診察與判斷。是否適用、療程次數與費用，須由醫師當面評估後決定；部分項目為自費，會在進行前先向你說明。';

// 敘述型特色，每一項會在「診療設備與服務」下方各自成為一個區塊。
// 陣列留空則整段不顯示。
const pillars = [
  {
    title: '空間像家一樣安心',
    desc: '木質調候診區、柔和照明與充足採光，並保留寬敞動線，讓推車與行動不便的長輩都能自在進出。',
  },
];

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
      <p class="section-lead">每一項檢查或治療在做什麼、過程是什麼樣子，先在這裡說清楚。</p>
    </div>
    <div class="grid grid--2">
      ${facilities.map((f) => `<div class="card">
        <div class="card-icon">${icons[f.icon]}</div>
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.desc)}</p>
      </div>`).join('\n      ')}
    </div>
    <p class="article-notice" style="margin-top:clamp(20px,3vw,28px)">※ ${esc(facilityNotice)}</p>
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
    description: `${site.nameZh}的診療設備與服務說明：數位 X 光機、肌肉骨骼神經超音波檢查、自體骨髓再生注射治療、超音波導引再生注射治療、體外震波治療與營養點滴，各項原理與過程一次說清楚。`,
    active: '/features/',
    canonical: '/features/',
    slug: 'features',
    body,
  };
}
