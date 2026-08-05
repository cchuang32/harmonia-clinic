import { site } from '../../site.config.mjs';
import { esc } from '../layout.mjs';
import { icons } from '../components.mjs';

// ★ 請改成診所實際的交通方式
const transport = [
  { icon: 'train', title: '捷運', desc: '古亭站 5 號出口，沿和平東路步行約 6 分鐘；科技大樓站步行約 8 分鐘。' },
  { icon: 'bus', title: '公車', desc: '「和平龍安街口」站下車即達。可搭 3、15、18、236、278、662、663 等路線。' },
  { icon: 'car', title: '開車／機車', desc: '診所大樓地下室有付費停車場，機車可停放於騎樓旁停車格。假日車位較少，建議多留 10 分鐘。' },
];

export function locationPage() {
  const mapQ = encodeURIComponent(site.contact.mapQuery);
  const body = `
<section class="page-head">
  <div class="wrap">
    <span class="eyebrow">Location</span>
    <h1>地理位置</h1>
    <p>${esc(site.contact.address)}<br>找不到路的時候，直接打電話給我們，我們會在電話裡帶你走。</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="map-frame">
      <iframe
        title="${esc(site.nameZh)}地圖位置"
        src="https://maps.google.com/maps?q=${mapQ}&hl=zh-TW&z=17&output=embed"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen></iframe>
    </div>
    <div class="btn-row">
      <a class="btn btn--primary" href="https://www.google.com/maps/search/?api=1&query=${mapQ}" target="_blank" rel="noopener">${icons.pin} 用 Google 地圖導航</a>
      <a class="btn btn--ghost" href="${esc(site.contact.phoneHref)}">${icons.phone} 撥打電話 ${esc(site.contact.phone)}</a>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    <div class="grid grid--2">
      <div>
        <div class="section-head">
          <span class="eyebrow">Hours</span>
          <h2 class="section-title">看診時間</h2>
        </div>
        <dl class="info-list">
          ${site.hours.map((h) => `<div class="info-row"><dt>${esc(h.day)}</dt><dd>${esc(h.time)}</dd></div>`).join('\n          ')}
        </dl>
        <p class="section-lead" style="font-size:14.5px">※ 國定假日與颱風天看診時間請以本站公告為準。掛號於每節門診結束前 30 分鐘截止。</p>
      </div>

      <div>
        <div class="section-head">
          <span class="eyebrow">Getting Here</span>
          <h2 class="section-title">怎麼過來</h2>
        </div>
        <div class="transport">
          ${transport.map((t) => `<div class="transport-item">
            <div class="card-icon">${icons[t.icon]}</div>
            <div>
              <h3>${esc(t.title)}</h3>
              <p>${esc(t.desc)}</p>
            </div>
          </div>`).join('\n          ')}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="wrap measure">
    <div class="section-head">
      <span class="eyebrow">Contact</span>
      <h2 class="section-title">聯絡方式</h2>
    </div>
    <dl class="info-list">
      <div class="info-row"><dt>電話</dt><dd><a href="${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a></dd></div>
      <div class="info-row"><dt>LINE</dt><dd>${esc(site.contact.lineId)}（可線上詢問掛號與門診異動）</dd></div>
      <div class="info-row"><dt>Email</dt><dd><a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a></dd></div>
      <div class="info-row"><dt>地址</dt><dd>${esc(site.contact.address)}</dd></div>
      <div class="info-row"><dt>無障礙</dt><dd>大樓設有電梯與斜坡道，輪椅可直接進入診間。</dd></div>
    </dl>
  </div>
</section>
`;

  return {
    title: '地理位置',
    description: `${site.nameZh}地址：${site.contact.address}。看診時間、捷運公車路線、停車資訊與聯絡方式。`,
    active: '/location/',
    canonical: '/location/',
    slug: 'location',
    body,
  };
}
