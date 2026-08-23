import { site } from '../../site.config.mjs';
import { url, esc } from '../layout.mjs';
import { icons, postCard } from '../components.mjs';

const services = [
  { icon: 'shield', title: '慢性病', desc: '糖尿病、高血壓、高血脂。' },
  { icon: 'stethoscope', title: '急性症狀', desc: '感冒、呼吸道、腸胃道、皮膚、過敏。' },
  { icon: 'bone', title: '肌肉骨骼神經疼痛', desc: '肩頸痠痛、腰痠背痛、坐骨神經痛、五十肩、網球肘、膝退化性關節炎等項目。' },
  // href：填了就整張卡片可以點，並在卡片下方出現「看完整說明 →」
  { icon: 'syringe', title: '再生注射治療', desc: '自體骨髓再生注射治療。（自費項目，門診評估後說明）', href: '/regeneration/', more: '看完整說明' },
  { icon: 'heart', title: '其他', desc: '預防保健、疫苗施打、抽血健康檢查、慢性疲勞調理。' },
];

const features = [
  { icon: 'xray', title: '數位 X 光機' },
  { icon: 'ultrasound', title: '肌肉骨骼神經超音波檢查' },
  { icon: 'syringe', title: '自體骨髓再生注射治療' },
  { icon: 'target', title: '超音波導引再生注射治療' },
  { icon: 'shockwave', title: '體外震波治療' },
  { icon: 'iv', title: '營養點滴' },
];

export function homePage(articles) {
  const latest = articles.slice(0, 6);

  const body = `
<section class="hero">
  <div class="hero-banner">
    <img src="${url(site.hero.image)}" alt="${esc(site.hero.alt)}" width="${site.hero.width}" height="${site.hero.height}" fetchpriority="high">
  </div>
  <div class="hero-body">
    <div class="wrap">
      <div class="hero-inner">
        <h1 class="hero-slogan">${esc(site.slogan)}</h1>
        <p class="hero-lead">位於新竹湖口，以家醫科與疼痛科為主的診所。<br class="only-wide">看診不只是解決眼前的不舒服，而是理解你的生活，一起找到走得長久的方式。</p>
        <div class="btn-row">
          <a class="btn btn--primary" href="${site.contact.phoneHref}">${icons.phone} 預約掛號 ${esc(site.contact.phone)}</a>
          <a class="btn btn--ghost" href="${esc(site.contact.lineUrl)}" target="_blank" rel="noopener">${icons.chat} LINE 線上掛號</a>
          <a class="btn btn--ghost" href="${url('/services/')}">看看治療項目</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section creed">
  <div class="wrap">
    <div class="creed-card">
      <p class="creed-lead">健康，像深呼吸一樣自然。</p>
      <p class="creed-body">
        從手心的陪伴到溫馨的空間，用專業與溫度，陪你把健康過成最安心的日常。<br>
        在君禾，我們不止步於治療，更陪伴您活出充滿能量的自己。
      </p>
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="wrap">
    <div class="section-head section-head--center">
      <span class="eyebrow">Services</span>
      <h2 class="section-title">我們看什麼</h2>
      <p class="section-lead">${esc(site.nameZh)}以家醫科與疼痛科為主。從全家人的各種急性症狀與慢性病追蹤，到肩頸腰背與關節的疼痛問題，都在同一個診間處理。</p>
    </div>
    <div class="grid grid--3">
      ${services.map((s) => s.href
        ? `<a class="card card--link" href="${url(s.href)}">
        <div class="card-icon">${icons[s.icon]}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.desc)}</p>
        <span class="card-more">${esc(s.more || '看完整說明')}<span aria-hidden="true">→</span></span>
      </a>`
        : `<div class="card">
        <div class="card-icon">${icons[s.icon]}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.desc)}</p>
      </div>`).join('\n      ')}
    </div>
    <div class="btn-row" style="justify-content:center">
      <a class="btn btn--ghost" href="${url('/services/')}">完整治療項目</a>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Why Harmonia</span>
      <h2 class="section-title">本院特色</h2>
      <p class="section-lead">診斷靠得住，治療才有方向。診所備有影像與超音波檢查設備，以及多種疼痛治療選擇。</p>
    </div>
    <div class="facility-grid">
      ${features.map((f) => `<div class="facility">
        <div class="card-icon">${icons[f.icon]}</div>
        <h3>${esc(f.title)}</h3>
      </div>`).join('\n      ')}
    </div>
    <div class="btn-row">
      <a class="btn btn--ghost" href="${url('/features/')}">更認識君禾</a>
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Journal</span>
      <h2 class="section-title">最新衛教文章</h2>
      <p class="section-lead">把診間裡最常被問到的問題，寫成你在家也讀得懂的說明。</p>
    </div>
    ${latest.length ? `<div class="post-grid">
      ${latest.map(postCard).join('\n      ')}
    </div>
    <div class="btn-row">
      <a class="btn btn--ghost" href="${url('/articles/')}">看全部衛教文章</a>
    </div>` : '<p class="section-lead">文章準備中，很快就與你見面。</p>'}
  </div>
</section>

<section class="section cta">
  <div class="wrap">
    <h2>身體有狀況，別自己猜</h2>
    <p>來一趟君禾，讓醫師陪你把問題看清楚。</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="${site.contact.phoneHref}">${icons.phone} ${esc(site.contact.phone)}</a>
      <a class="btn btn--ghost" href="${url('/location/')}">${icons.pin} 診所位置與交通</a>
    </div>
    <div class="stat-bar">
      <span class="meta-item" data-view-wrap data-empty="1">${icons.eye}<span>本站瀏覽 <span class="view-count" data-count-slug="home">—</span> 次</span></span>
    </div>
  </div>
</section>
`;

  return {
    title: '',
    description: `${site.nameZh} ${site.nameEn}｜${site.slogan}。位於新竹縣湖口鄉，以家醫科與疼痛科為主的診所。健康，像深呼吸一樣自然——用專業與溫度，陪你把健康過成最安心的日常。`,
    active: '/',
    canonical: '/',
    slug: 'home',
    body,
  };
}
