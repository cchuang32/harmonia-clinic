import { site } from '../../site.config.mjs';
import { esc } from '../layout.mjs';
import { icons } from '../components.mjs';

// ★★ 待填：以下是待補欄位，不是實際交通資訊。
//    請填入湖口診所真正的轉乘方式、公車路線與停車資訊，填好後跑 npm run build。
const transport = [
  { icon: 'train', title: '火車', desc: '最近的車站為台鐵湖口車站，下車後可轉乘公車或計程車。（請補上實際車程與轉乘方式）' },
  { icon: 'bus', title: '公車', desc: '（請補上實際可搭乘的公車路線與下車站名）' },
  { icon: 'car', title: '開車／機車', desc: '（請補上停車資訊：診所是否有專屬停車位、附近停車場位置、機車停放處）' },
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
    description: `${site.nameZh}地址：${site.contact.address}，電話 ${site.contact.phone}。看診時間、交通方式、停車資訊與聯絡方式。`,
    active: '/location/',
    canonical: '/location/',
    slug: 'location',
    body,
  };
}
