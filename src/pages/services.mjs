import { site } from '../../site.config.mjs';
import { url, esc } from '../layout.mjs';
import { icons } from '../components.mjs';

// ---------------------------------------------------------------------------
// ★ 請改成診所實際的治療項目。改完跑 npm run build 即可。
// ---------------------------------------------------------------------------
const groups = [
  {
    icon: 'stethoscope',
    title: '一般內科門診',
    lead: '身體突然不對勁的時候，先來這裡。',
    items: [
      '感冒、流感、久咳不癒',
      '腸胃炎、腹痛、消化不良、便祕',
      '頭痛、頭暈、失眠、長期疲倦',
      '過敏性鼻炎、氣喘症狀評估',
      '泌尿道感染與相關不適',
    ],
  },
  {
    icon: 'shield',
    title: '慢性病長期照護',
    lead: '不是每三個月拿一次藥就好，而是把數字真的顧穩。',
    items: [
      '高血壓：血壓紀錄判讀、用藥調整',
      '糖尿病：血糖與糖化血色素追蹤、飲食衛教',
      '高血脂與代謝症候群管理',
      '痛風與高尿酸血症',
      '慢性病連續處方箋',
    ],
  },
  {
    icon: 'heart',
    title: '健康檢查與報告解讀',
    lead: '報告不是一疊數字，是你接下來要怎麼過生活。',
    items: [
      '成人預防保健服務（符合資格者可使用）',
      '自費抽血項目：肝腎功能、血脂、甲狀腺等',
      '公司健檢報告帶來，醫師逐項說明',
      '依年齡與家族史，建議該追加的檢查',
    ],
  },
  {
    icon: 'leaf',
    title: '疫苗接種',
    lead: '打之前先評估，打完知道要注意什麼。',
    items: [
      '流感疫苗（公費／自費）',
      '肺炎鏈球菌疫苗',
      '帶狀疱疹疫苗',
      'B 型肝炎、破傷風等成人疫苗',
    ],
  },
  {
    icon: 'sparkle',
    title: '健康諮詢',
    lead: '還不到生病，但想過得更好的那些事。',
    items: [
      '體重與飲食調整方向',
      '戒菸諮詢與輔助',
      '長輩用藥整合與副作用評估',
      '出國旅遊前的健康準備',
    ],
  },
  {
    icon: 'user',
    title: '轉診協助',
    lead: '需要更進一步時，我們幫你找對的地方。',
    items: [
      '需要影像檢查或手術評估時協助轉診',
      '協助整理病歷摘要與檢查結果',
      '轉診後的追蹤與用藥銜接',
    ],
  },
];

export function servicesPage() {
  const body = `
<section class="page-head">
  <div class="wrap">
    <span class="eyebrow">Services</span>
    <h1>治療項目</h1>
    <p>從急性不適到長期照護，君禾提供的是「一直有人在」的醫療。以下是目前的主要門診項目，若不確定自己該看哪一項，直接打電話問我們也可以。</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="grid grid--2">
      ${groups.map((g) => `<div class="card">
        <div class="card-icon">${icons[g.icon]}</div>
        <h3>${esc(g.title)}</h3>
        <p>${esc(g.lead)}</p>
        <ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap measure">
    <div class="section-head">
      <span class="eyebrow">Before You Come</span>
      <h2 class="section-title">看診前，可以先準備</h2>
    </div>
    <dl class="info-list">
      <div class="info-row"><dt>健保卡</dt><dd>初診請攜帶健保卡與身分證明文件。</dd></div>
      <div class="info-row"><dt>目前用藥</dt><dd>正在服用的藥（含保健食品）請帶藥袋或拍照，避免重複用藥。</dd></div>
      <div class="info-row"><dt>過去報告</dt><dd>近期抽血、影像或他院病歷摘要，帶來能省下不少時間。</dd></div>
      <div class="info-row"><dt>想問的問題</dt><dd>先寫在手機備忘錄裡。看診時很容易忘記，寫下來最實在。</dd></div>
    </dl>
  </div>
</section>

<section class="section cta">
  <div class="wrap">
    <h2>不確定該看哪一科？</h2>
    <p>打給我們，我們幫你判斷。</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="${site.contact.phoneHref}">${icons.phone} ${esc(site.contact.phone)}</a>
      <a class="btn btn--ghost" href="${url('/location/')}">診所位置與時間</a>
    </div>
  </div>
</section>
`;

  return {
    title: '治療項目',
    description: `${site.nameZh}治療項目：一般內科門診、慢性病長期照護、健康檢查與報告解讀、疫苗接種、健康諮詢與轉診協助。`,
    active: '/services/',
    canonical: '/services/',
    slug: 'services',
    body,
  };
}
