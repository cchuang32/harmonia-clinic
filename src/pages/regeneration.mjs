import { site } from '../../site.config.mjs';
import { url, esc } from '../layout.mjs';
import { icons } from '../components.mjs';

// ---------------------------------------------------------------------------
// 自體骨髓及 PRP 再生注射。
//
// 衛教文字的寫法原則（與本院特色頁一致）：只描述「這是什麼、過程如何」，
// 不寫療效保證、不比較優劣，是否適合一律導回醫師評估。
// 若要加入療效、成功率、適應症相關敘述，請先由醫師確認過再放。
// ---------------------------------------------------------------------------
const types = [
  {
    icon: 'syringe',
    title: '自體骨髓再生注射治療',
    desc: '自體骨髓再生治療，是抽取自己少量的骨髓液，不經離心處理，不加入抗凝劑，直接注射到受傷或疼痛的部位，利用骨髓中原有的間質基質細胞、生長因子、與細胞激素等，幫助身體啟動修復。因為使用的是自己的骨髓，不會有異體排斥的問題。至於骨髓從哪裡抽、需要治療幾次、多久一次，會依每個人的病況而不同，由醫師評估後為您說明。',
  },
  {
    icon: 'iv',
    title: 'PRP 再生注射治療',
    desc: 'PRP 再生注射治療，是抽取自己少量的血液，經過離心處理後，分離出富含血小板與生長因子的血漿，再注射到需要治療的部位，幫助受傷組織修復。因為使用的是自己的血液，不會有異體排斥的問題。實際抽血量、治療次數與間隔時間，會依病況不同，由醫師評估後決定。',
  },
  {
    icon: 'target',
    title: '超音波導引定位',
    desc: '注射全程以超音波即時定位，醫師看得到針尖走到哪裡，可以一邊看著影像一邊調整進針方向，把生長因子送到真正需要的位置。相較於憑手感施打，位置更明確，也能減少不必要的傷害。',
  },
];

// 治療的流程（從當天的確認到之後的回診）
const steps = [
  ['再次確認診斷與治療計畫', '確認治療部位、預期目標、替代方案、風險、自費金額，以及治療後的安排。'],
  ['填寫同意書', '以上都確認清楚、你也想過了，再簽名。'],
  ['採集', 'PRP 由手臂靜脈抽血；自體骨髓（BMA）則在局部麻醉後，從骨盆後方採集骨髓液。採集時仍可能出現壓迫、痠脹或短暫疼痛。'],
  ['注射', '依治療位置使用合適的影像導引方式，把注射物送至預定目標。'],
  ['觀察', '治療後在診所休息與觀察。若沒有特殊狀況，可依醫囑返家。'],
  ['回診', '依醫師安排追蹤疼痛、功能與活動能力。療效判斷不只看當天疼痛分數，也會觀察一段時間內的功能變化。'],
];

// 流程下方的提醒方塊：講清楚效果的不確定性
const evidenceNote = '有些人可能在數週至數月內感覺疼痛或功能改善，也有人改善不明顯。研究無法準確預測每個人的起效時間、維持時間或最佳治療次數。症狀改善也不等於影像上的組織已經再生。';

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
  '凝血功能異常，或正在服用抗凝血劑、抗血小板藥物',
  '惡性腫瘤或血液疾病',
  '自體免疫疾病（例如：類風濕性關節炎、僵直性脊椎炎、紅斑性狼瘡、皮肌炎等）',
  '懷孕或哺乳中',
  '對局部麻醉藥曾有不良反應',
  '正在服用的其他藥物與保健食品',
];

// 在決定之前會一起確認的事項（前兩點是臨床條件，後兩點是理解與心理準備）
const beforeDecide = [
  '症狀與診斷相符。',
  '已接受一段時間的運動、復健、生活調整或其他標準治療，但改善有限。',
  '你了解現有證據的限制與不確定性。',
  '你了解治療可能無效，也可能仍需其他治療或手術。',
];

const notice = '以上為一般性衛教說明，僅供了解治療的原理與過程，無法取代醫師的診察與判斷。是否適用、療程次數與費用，須由醫師當面評估後決定。本項目為自費，會在進行前先向你說明。';

export function regenerationPage() {
  const body = `
<section class="page-head">
  <div class="wrap">
    <span class="eyebrow">Regenerative Injection</span>
    <h1>自體骨髓及 PRP 再生注射</h1>
    <p>兩種再生注射，生長因子都來自你自己的身體。這一頁把「東西從哪裡取、怎麼打、當天會發生什麼事」寫清楚，讓你在決定之前就先知道全部流程。</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">What It Is</span>
      <h2 class="section-title">兩種再生注射</h2>
      <p class="section-lead">兩者都是利用自己身體原有的修復能力，幫助受傷組織恢復，差別主要在於來源不同、所含的修復成分也不同；哪一種比較適合，會依受傷部位、程度及個人狀況由醫師評估。</p>
    </div>
    <div class="grid grid--3">
      ${types.map((t) => `<div class="card">
        <div class="card-icon">${icons[t.icon]}</div>
        <h3>${esc(t.title)}</h3>
        <p>${esc(t.desc)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="wrap measure">
    <div class="section-head">
      <span class="eyebrow">Before You Decide</span>
      <h2 class="section-title">在決定之前，我們會一起確認這幾件事</h2>
      <p class="section-lead">適合討論自費注射的情況，可能包括以下幾點。</p>
    </div>
    <ul class="doctor-list">${beforeDecide.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap measure">
    <div class="section-head">
      <span class="eyebrow">The Process</span>
      <h2 class="section-title">治療的流程</h2>
    </div>
    <dl class="info-list">
      ${steps.map(([t, d]) => `<div class="info-row"><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('\n      ')}
    </dl>
    <div class="learn-block">
      <h3 class="doctor-group-title">可能效果與證據限制</h3>
      <p class="article-notice">${esc(evidenceNote)}</p>
    </div>
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
        <p class="service-block-note">以上這些情形會影響醫師的判斷與最後處置方式，如果你有以上任何狀況，請務必主動告知醫師，讓醫師協助評估這項治療是否適合你。</p>
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
    title: '自體骨髓及 PRP 再生注射',
    description: `${site.nameZh}的自體骨髓再生注射與 PRP 再生注射衛教說明：生長因子取自本人、超音波導引定位，從門診評估、採集、注射到回診追蹤的完整流程，以及注射後注意事項與看診前要告知醫師的狀況。`,
    active: '/regeneration/',
    canonical: '/regeneration/',
    slug: 'regeneration',
    body,
  };
}
