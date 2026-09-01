import { site } from '../../site.config.mjs';
import { url, esc } from '../layout.mjs';
import { icons } from '../components.mjs';

// ---------------------------------------------------------------------------
// 診所外觀照片：幫病人在現場認出門面，比地圖更實用。
// 留空 → 整區不顯示，版面不變。建議 3:2 橫幅，第一張放正面招牌。
//   { src: '/assets/img/place-front.jpg', alt: '君禾診所正面招牌', caption: '（可留空）' }
// ---------------------------------------------------------------------------
const exterior = [];

// 交通方式。要新增項目就往陣列裡再加一筆，圖示可用 train / bus / car。
// 已確認沒有可直達診所的公車路線，因此不列公車項目，改在清單下方說明。
const transport = [
  { icon: 'train', title: '火車', desc: '最近的車站為台鐵湖口車站，距離約 1 公里。實際步行時間會依路線、天候與個人行動狀況而異；行動不便或天候不佳時，可考慮轉乘計程車。' },
  { icon: 'car', title: '開車／機車', desc: '可使用診所大樓後方的湖口鄉王爺壟停車場。停車規則、費率與開放狀況可能異動，出發前可先確認現場公告。' },
];

// ---------------------------------------------------------------------------
// 從停車場走到診所的實景照片，由遠而近。三張都已裁成 3:2，並清除 GPS 等中繼資料。
// ★ 王爺壟停車場為民間業者經營，與診所無關，說明文字務必保留這一點。
// ---------------------------------------------------------------------------
const parkingWalk = [
  {
    src: '/assets/img/walk-1-parking-lot.jpg',
    alt: '王爺壟停車場實景：診所大樓後方的平面停車場，可見出入口柵欄、自動繳費機與費率看板，後方為住宅大樓。',
    caption: '王爺壟停車場，位於診所大樓後方。',
  },
  {
    src: '/assets/img/walk-2-pay-station.jpg',
    alt: '停車場的自動繳費機與出口柵欄，繳費機上方掛有 CBM Parking 自動繳費機布條。',
    caption: '出場前先在自動繳費機繳費。',
  },
  {
    src: '/assets/img/walk-3-passage.jpg',
    alt: '兩棟大樓之間的通道入口，左側設有附扶手的斜坡道，通道盡頭通往中山路。',
    caption: '沿兩棟大樓之間的通道往前走，即可通往中山路上的診所正門。通道口設有無障礙坡道。',
  },
];

export function locationPage() {
  const mapQ = encodeURIComponent(site.contact.mapQuery);
  const body = `
<section class="page-head">
  <div class="wrap">
    <span class="eyebrow">Location</span>
    <h1>地理位置</h1>
    <p>${esc(site.contact.address)}<br>診所在住宅大樓的一樓，可能不是一眼就看得到的店面。找不到就打給我們，我們照你眼前的招牌告訴你往哪走。</p>
  </div>
</section>

${exterior.length ? `<section class="section">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Our Place</span>
      <h2 class="section-title">認得出這個門面</h2>
      <p class="section-lead">到了中山路一段，看到這裡就是了。</p>
    </div>
    <div class="photo-grid photo-grid--${Math.min(exterior.length, 3)}">
      ${exterior.map((ph) => `<figure class="photo">
        <img src="${url(ph.src)}" alt="${esc(ph.alt)}" loading="lazy">
        ${ph.caption ? `<figcaption>${esc(ph.caption)}</figcaption>` : ''}
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>` : ''}

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

    <figure class="area-map">
      <div class="area-map-scroll">
      <img src="${url('/assets/img/area-map.svg')}" width="1120" height="760" loading="lazy"
        alt="君禾診所周邊示意圖：診所位於中山路一段東側的湖心花園大樓，正對面為蝦皮店到店湖口湖心店，西南斜對面為石二鍋，西北斜對面為星巴克湖口竹笪門市。大樓後方為王爺壟停車場，可沿湖心花園與新傳遠景之間的通道步行至診所正門。台鐵湖口車站位於北方約 1 公里。">
      </div>
      <figcaption>停車場位於大樓後方。停好車後，可沿兩棟大樓之間的通道步行至診所正門。示意地圖只呈現相對方位，不代表實際距離與比例。<span class="only-narrow">（手機可左右滑動看細節）</span></figcaption>
    </figure>

    <div class="learn-block">
      <h3 class="doctor-group-title">從停車場走到診所</h3>
      <p class="section-lead" style="font-size:15px">停好車之後的路線，照片由遠而近。<strong>王爺壟停車場為民間業者經營，與君禾診所無關</strong>；診所無法提供停車優惠，也無法代為處理停車相關事宜。</p>
      <div class="photo-grid photo-grid--3">
        ${parkingWalk.map((ph) => `<figure class="photo">
          <img src="${url(ph.src)}" alt="${esc(ph.alt)}" width="1200" height="800" loading="lazy">
          <figcaption>${esc(ph.caption)}</figcaption>
        </figure>`).join('\n        ')}
      </div>
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
        <p class="section-lead" style="font-size:14.5px">※ 國定假日與颱風天看診時間可能異動，出發前建議先來電 <a href="${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a> 確認。</p>
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
        <p class="section-lead" style="font-size:14.5px">※ 目前查無可直達診所的公車路線，建議開車、騎車，或由湖口車站轉乘計程車。公車路線可能調整，請以新竹縣即時交通資訊或地圖服務當日資料為準。</p>
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
      <div class="info-row"><dt>LINE</dt><dd>${esc(site.contact.lineId)}（可線上掛號）</dd></div>
      <div class="info-row"><dt>地址</dt><dd>${esc(site.contact.address)}</dd></div>
      <div class="info-row"><dt>無障礙</dt><dd>從後方停車場過來，兩棟大樓之間的通道設有無障礙坡道。輪椅可進入診所；若需要移位、上下診療床或其他協助，建議掛號時先告訴我們。</dd></div>
    </dl>

    ${site.contact.lineQr ? `<div class="line-card">
      <img class="line-qr" src="${url(site.contact.lineQr)}" alt="${esc(site.nameZh)} LINE 官方帳號加入好友 QR 碼" width="600" height="600" loading="lazy">
      <div class="line-card-body">
        <h3>加入 LINE 好友</h3>
        <p>加入好友之後，就可以直接在 LINE 上線上掛號。用電腦看這一頁的話，請拿手機掃描左邊的 QR 碼；用手機看的話，直接按下面的按鈕就可以。</p>
        <a class="btn btn--primary" href="${esc(site.contact.lineUrl)}" target="_blank" rel="noopener">加入好友</a>
        <p class="line-id">LINE ID：${esc(site.contact.lineId)}</p>
      </div>
    </div>` : ''}
  </div>
</section>
`;

  return {
    title: '地理位置',
    description: `${site.nameZh}地址：${site.contact.address}，電話 ${site.contact.phone}。看診時間、交通方式、停車資訊與聯絡方式。`,
    active: '/location/',
    canonical: '/location/',
    slug: 'location',
    breadcrumb: [{ name: '首頁', path: '/' }, { name: '地理位置' }],
    body,
  };
}
