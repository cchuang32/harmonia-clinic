import { site } from '../../site.config.mjs';
import { url, esc } from '../layout.mjs';
import { icons } from '../components.mjs';

// ---------------------------------------------------------------------------
// 診所主治項目。要增減項目，直接改下面的 items 陣列，然後 npm run build。
// ---------------------------------------------------------------------------
const groups = [
  {
    icon: 'shield',
    title: '慢性病',
    items: ['糖尿病', '高血壓', '高血脂'],
  },
  {
    icon: 'stethoscope',
    title: '急性症狀',
    items: ['感冒', '呼吸道', '腸胃道', '皮膚', '過敏'],
  },
  {
    icon: 'bone',
    title: '肌肉骨骼神經疼痛',
    wide: true,
    items: [
      '肩頸痠痛', '腰痠背痛', '坐骨神經痛', '椎間盤突出', '脊椎滑脫', '脊椎狹窄',
      '骨刺', '五十肩', '肩夾擠', '肩旋轉肌腱撕裂傷', '網球肘', '媽媽手',
      '腕隧道症候群', '板機指', '膝退化性關節炎', '十字韌帶撕裂傷',
      '膝半月板撕裂傷', '足底筋膜炎', '扭拉挫傷', '痛風', '手術後疼痛', '運動傷害',
    ],
  },
  {
    icon: 'syringe',
    title: '再生注射治療',
    items: ['自體骨髓再生注射治療', 'PRP 再生注射治療'],
    note: '自費項目。是否適合、療程次數與費用，由醫師於門診評估後說明。',
    // link：填了就在區塊底部出現一行連結
    link: { href: '/regeneration/', label: '看自體骨髓及 PRP 再生注射的完整說明' },
  },
  {
    icon: 'heart',
    title: '其他',
    items: ['預防保健', '疫苗施打', '抽血健康檢查', '慢性疲勞調理', '營養點滴'],
    note: '部分項目為自費，由醫師於門診評估後說明。',
  },
];

const block = (g) => `<div class="card service-block${g.wide ? ' service-block--wide' : ''}">
        <div class="service-block-head">
          <div class="card-icon">${icons[g.icon]}</div>
          <h3>${esc(g.title)}</h3>
        </div>
        <ul class="chip-list">${g.items.map((i) => `<li class="chip">${esc(i)}</li>`).join('')}</ul>
        ${g.note ? `<p class="service-block-note">${esc(g.note)}</p>` : ''}
        ${g.link ? `<a class="service-block-link" href="${url(g.link.href)}">${esc(g.link.label)}<span aria-hidden="true">→</span></a>` : ''}
      </div>`;

export function servicesPage() {
  const body = `
<section class="page-head">
  <div class="wrap">
    <span class="eyebrow">Services</span>
    <h1>治療項目</h1>
    <p>從慢性病的長期追蹤、突發的急性症狀，到肩頸腰背與關節的疼痛問題，都是我們看診的範圍。不確定自己該看哪一項，直接打電話問我們也可以。</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="service-grid">
      ${groups.map(block).join('\n      ')}
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
      <div class="info-row"><dt>健保卡與身分證明</dt><dd>請攜帶健保卡及身分證明文件。</dd></div>
      <div class="info-row"><dt>過去檢查資料</dt><dd>若有近期抽血、X 光、超音波、核磁共振、或他院病歷摘要，可以一起帶來。</dd></div>
      <div class="info-row"><dt>疼痛問題</dt><dd>建議穿著寬鬆、方便活動的衣物。可以事先記下疼痛位置、發生時間、加重動作、曾接受的治療及目前用藥。</dd></div>
      <div class="info-row"><dt>想問的問題</dt><dd>把問題先記在手機裡。看診時逐一確認，通常比回家後才想起來更實用。</dd></div>
    </dl>
  </div>
</section>

<section class="section cta">
  <div class="wrap">
    <h2>有想問的，來門診慢慢說</h2>
    <p>預約掛號，或先打電話讓我們了解你的狀況。</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="${esc(site.contact.phoneHref)}">${icons.phone} ${esc(site.contact.phone)}</a>
      <a class="btn btn--ghost" href="${url('/location/')}">診所位置與時間</a>
    </div>
  </div>
</section>
`;

  return {
    title: '治療項目',
    description: '門診範圍：慢性病追蹤（糖尿病、高血壓、高血脂）、感冒、過敏與腸胃不適等急性症狀、肩頸腰背與關節疼痛、再生注射、預防保健與疫苗施打。新竹湖口，星期一至六看診。',
    active: '/services/',
    canonical: '/services/',
    slug: 'services',
    breadcrumb: [{ name: '首頁', path: '/' }, { name: '治療項目' }],
    body,
  };
}
