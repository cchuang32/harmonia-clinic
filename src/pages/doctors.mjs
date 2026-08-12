import { site } from '../../site.config.mjs';
import { url, esc } from '../layout.mjs';
import { icons } from '../components.mjs';

// ---------------------------------------------------------------------------
// 醫師介紹。要新增醫師就往陣列裡再加一個物件。
//
// role 目前寫「麻醉科．疼痛科專科醫師」，依據是下方兩張專科醫師證書。
// 若黃醫師是君禾診所院長，可改成「院長．麻醉科／疼痛科專科醫師」。
// ---------------------------------------------------------------------------
const team = [
  {
    name: '黃佳君 醫師',
    role: '麻醉科．疼痛科專科醫師',
    // 插畫肖像（已去背的透明 PNG）。留空則改用姓氏文字頭像
    photo: '/assets/img/doctor-huang.png',
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

export function doctorsPage() {
  const body = `
<section class="page-head">
  <div class="wrap">
    <span class="eyebrow">Our Team</span>
    <h1>醫師介紹</h1>
    <p>認識為你看診的人。看診這件事，最後還是回到「誰在聽你說話」。</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${team.map((t) => `<article class="doctor">
      <div class="doctor-id">
        ${t.photo
          ? `<div class="doctor-photo">
          <img src="${url(t.photo)}" alt="${esc(t.name)}的插畫肖像" width="378" height="560" loading="lazy">
        </div>`
          : `<span class="doctor-avatar" aria-hidden="true">${esc(t.name.slice(0, 1))}</span>`}
        <h2 class="doctor-name">${esc(t.name)}</h2>
        <p class="doctor-role">${esc(t.role)}</p>
      </div>
      <div class="doctor-groups">
        ${credList('學歷', t.education)}
        ${credList('經歷', t.experience)}
        ${credList('專科證照與學會', t.credentials)}
      </div>
    </article>`).join('\n    ')}
  </div>
</section>

<section class="section cta">
  <div class="wrap">
    <h2>想讓醫師看看你的狀況？</h2>
    <p>來電預約門診，或先看看這裡有哪些治療項目。</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="${esc(site.contact.phoneHref)}">${icons.phone} ${esc(site.contact.phone)}</a>
      <a class="btn btn--ghost" href="${url('/services/')}">看看治療項目</a>
    </div>
  </div>
</section>
`;

  return {
    title: '醫師介紹',
    description: `${site.nameZh}由黃佳君醫師看診。台灣麻醉醫學會、台灣疼痛醫學會專科醫師，曾任林口長庚與花蓮慈濟醫院麻醉部主治醫師、花蓮門諾醫院疼痛科醫師。`,
    active: '/doctors/',
    canonical: '/doctors/',
    slug: 'doctors',
    body,
  };
}
