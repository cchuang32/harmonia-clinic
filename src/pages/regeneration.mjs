import { site } from '../../site.config.mjs';
import { url, esc } from '../layout.mjs';
import { icons } from '../components.mjs';

// ---------------------------------------------------------------------------
// 自體骨髓再生注射。
//
// 衛教文字的寫法原則（與本院特色頁一致）：只描述「這是什麼、過程如何」，
// 不寫療效保證、不比較優劣，是否適合一律導回醫師評估。
// 若要加入療效、成功率、適應症相關敘述，請先由醫師確認過再放。
// ---------------------------------------------------------------------------
const types = [
  {
    icon: 'syringe',
    title: '自體骨髓再生注射治療',
    desc: '自體骨髓再生治療，是抽取自己少量的骨髓液，不經離心處理，不加入抗凝劑，直接注射到受傷或疼痛的部位，利用骨髓中原有的幹細胞、生長因子、與細胞激素等，幫助身體啟動修復。因為使用的是自己的骨髓，不會有異體排斥的問題。至於骨髓從哪裡抽、需要治療幾次、多久一次，會依每個人的病況而不同，由醫師評估後為您說明。',
  },
  {
    icon: 'target',
    title: '超音波導引定位',
    desc: '注射全程以超音波即時定位，醫師看得到針尖走到哪裡，可以一邊看著影像一邊調整進針方向，把生長因子送到真正需要的位置。相較於憑手感施打，位置更明確，也能減少不必要的傷害。',
  },
];

// 治療當天的流程
const steps = [
  ['門診評估', '醫師問診、理學檢查，必要時安排 X 光或肌肉骨骼超音波，先確認問題出在哪裡、適不適合做。'],
  ['說明與同意', '需要治療幾次、費用多少，會在進行前先講清楚，你同意了才開始。'],
  ['採集', '骨髓液於骨盆處採集，採集前會先局部麻醉。'],
  ['注射', '以超音波即時導引，將生長因子送到目標位置。'],
  ['休息與離開', '注射後在診所稍作休息與觀察，沒有特殊狀況即可自行返家，不需住院。'],
  ['回診追蹤', '依醫師安排回診，評估恢復狀況，再決定後續是否需要下一次。'],
];

// 注射後的注意事項
const aftercare = [
  '針孔處保持清潔乾燥，當天避免泡澡、游泳與三溫暖。',
  '注射部位可能出現痠脹或緊繃感，程度與持續時間因人而異。',
  '治療後數天內避免劇烈運動與重量訓練，日常活動照常即可。',
  '止痛與消炎藥物是否需要暫停，請依醫師指示，不要自行調整。',
  '若出現持續發燒、注射部位紅腫熱痛加劇，請盡快回診。',
];

// 門診時請主動告知的狀況（是否適合一律由醫師判斷）
const tellUs = [
  '目前有感染，或注射部位有傷口、皮膚發炎',
  '凝血功能異常，或正在服用抗凝血、抗血小板藥物',
  '血液疾病，或正在接受腫瘤相關治療',
  '懷孕或哺乳中',
  '對局部麻醉藥曾有不良反應',
  '正在服用的其他藥物與保健食品',
];

const notice = '以上為一般性衛教說明，僅供了解治療的原理與過程，無法取代醫師的診察與判斷。是否適用、療程次數與費用，須由醫師當面評估後決定。本項目為自費，會在進行前先向你說明。';

export function regenerationPage() {
  const body = `
<section class="page-head">
  <div class="wrap">
    <span class="eyebrow">Regenerative Injection</span>
    <h1>自體骨髓再生注射</h1>
    <p>這項治療所用的生長因子，來自你自己的身體。這一頁把「東西從哪裡取、怎麼打、當天會發生什麼事」寫清楚，讓你在決定之前就先知道全部流程。</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">What It Is</span>
      <h2 class="section-title">這項治療是什麼</h2>
      <p class="section-lead">利用自己身體原有的修復能力，幫助受傷組織恢復。是否適合、要做幾次，會依受傷部位、程度及個人狀況由醫師評估。</p>
    </div>
    <div class="grid grid--2">
      ${types.map((t) => `<div class="card">
        <div class="card-icon">${icons[t.icon]}</div>
        <h3>${esc(t.title)}</h3>
        <p>${esc(t.desc)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap measure">
    <div class="section-head">
      <span class="eyebrow">The Process</span>
      <h2 class="section-title">治療當天的流程</h2>
    </div>
    <dl class="info-list">
      ${steps.map(([t, d]) => `<div class="info-row"><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('\n      ')}
    </dl>
  </div>
</section>

<section class="section section--paper">
  <div class="wrap">
    <div class="grid grid--2">
      <div class="card">
        <div class="card-icon">${icons.heart}</div>
        <h3>注射後的注意事項</h3>
        <ul class="doctor-list">${aftercare.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <div class="card-icon">${icons.shield}</div>
        <h3>看診時請主動告訴醫師</h3>
        <ul class="doctor-list">${tellUs.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        <p class="service-block-note">這些狀況不一定不能做，但會影響醫師的判斷與安排，請務必事先說明。</p>
      </div>
    </div>
    <p class="article-notice" style="margin-top:clamp(20px,3vw,28px)">※ ${esc(notice)}</p>
  </div>
</section>

<section class="section cta">
  <div class="wrap">
    <h2>想知道自己適不適合？</h2>
    <p>來門診讓醫師看一看，評估之後再決定，不急著在今天做結論。</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="${esc(site.contact.phoneHref)}">${icons.phone} ${esc(site.contact.phone)}</a>
      <a class="btn btn--ghost" href="${url('/services/')}">看看治療項目</a>
    </div>
  </div>
</section>
`;

  return {
    title: '自體骨髓再生注射',
    description: `${site.nameZh}的自體骨髓再生注射衛教說明：生長因子取自本人、超音波導引定位，從門診評估、採集、注射到回診追蹤的完整流程，以及注射後注意事項與看診前要告知醫師的狀況。`,
    active: '/regeneration/',
    canonical: '/regeneration/',
    slug: 'regeneration',
    body,
  };
}
