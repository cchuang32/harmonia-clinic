import { site } from '../../site.config.mjs';
import { url, esc } from '../layout.mjs';
import { icons } from '../components.mjs';

// ---------------------------------------------------------------------------
// 醫師介紹。要新增醫師就往陣列裡再加一個物件。
//
// role 目前寫「麻醉科．疼痛科專科醫師」，依據是下方兩張專科醫師證書。
// 若黃醫師是君禾診所院長，可改成「院長．麻醉科／疼痛科專科醫師」。
//
// quote     ＝ 醫師自述，顯示在姓名下方。留空則不顯示。
// education ＝ 學歷
// experience＝ 經歷（之後若要加年份，直接寫進字串即可，例如
//              '2015–2020　林口長庚醫院麻醉部主治醫師'）
// certifications ＝ 專科證照（份量最重，單獨一欄）
// societies      ＝ 學會會員
// ---------------------------------------------------------------------------
const team = [
  {
    name: '黃佳君 醫師',
    role: '麻醉科．疼痛科專科醫師',
    // 肖像（方形照片）。留空則改用姓氏文字頭像
    photo: '/assets/img/doctor-huang-photo.jpg',
    photoAlt: '黃佳君醫師，身穿君禾診所醫師袍',
    quote: '疼痛很少是一天造成的，所以也很少能一天解決。我希望我幫你看診時看的不只是今天這個痛點，而是它為什麼會來、以後還會不會再來。',
    education: ['長庚大學醫學系'],
    experience: [
      '林口長庚醫院麻醉部主治醫師',
      '花蓮慈濟醫院麻醉部主治醫師',
      '花蓮門諾醫院疼痛科醫師',
    ],
    certifications: [
      '台灣麻醉醫學會專科醫師',
      '台灣疼痛醫學會專科醫師',
    ],
    societies: [
      '台灣增生療法醫學會會員',
      '台灣區域麻醉暨止痛醫學會會員',
      '台灣區域麻醉暨止痛醫學會工作坊講師',
    ],
  },
];

// ---------------------------------------------------------------------------
// 「回湖口開業」——醫師與在地的關係。
// paragraphs 一個元素就是一段，留空陣列則整個區塊不顯示。
// 文字由診所提供。
// ---------------------------------------------------------------------------
const roots = {
  title: '回湖口開業',
  paragraphs: [
    '我在湖口長大，後來離開念書、工作，最後選擇回到這裡開診所。',
    '回來之後發現，即使很多建築的外貌已經改變，有些鄰居長輩甚至已經不在，但我對湖口的記憶其實還很清楚。',
  ],
};

// ---------------------------------------------------------------------------
// 「診間裡，我怎麼做」— 醫師的看診方式。
// 這裡寫的是「過程如何」，不寫療效保證；要加療效相關敘述請先由醫師確認。
// ---------------------------------------------------------------------------
const clinicNotes = [
  {
    icon: 'stethoscope',
    title: '先找到痛的來源，再決定怎麼處理',
    desc: '同樣是膝蓋痛，它的來源可能是關節、可能是肌腱、可能是韌帶、也可能是神經。疼痛來源不同，處理方式就完全不同。所以我習慣先做詳細的理學檢查，再視情況需要是否使用超音波。超音波的好處是沒有輻射，而且即時，我可以一邊請你活動關節，一邊看組織在動作中發生什麼事。',
  },
  {
    icon: 'target',
    title: '注射，全程看著針走',
    desc: '需要注射的時候，我會在超音波導引下進行。這是麻醉科訓練留給我最實用的東西。不憑手感，而是看著針尖到哪裡，避開不該碰的地方，把生長因子送到真正需要的位置。',
  },
  {
    icon: 'eye',
    title: '把螢幕轉過來給你看',
    desc: '我看到的影像，也會轉給你看。哪裡發炎、哪裡磨損，哪裡有撕裂傷，指給你看比講十分鐘更清楚。知道自己的身體發生什麼事，你才有辦法一起做決定。',
  },
];

// ---------------------------------------------------------------------------
// 「持續在學」— 進修與教學紀錄。
//
// ★ 以下三個清單目前都是空的，網頁上只會顯示 intro 那段文字，版面不會破。
//   等資料備齊再往陣列裡加，加了就自動顯示。
//
// lecturing（擔任講師）每一筆：
//   { date: '2024.05', org: '台灣區域麻醉暨止痛醫學會', topic: '超音波導引注射工作坊' }
//   date 可留空字串 ''。
//
// courses（參加過的研討會與課程）每一筆：
//   { date: '2025.06', title: '○○○ 實作課程' }
//   建議由新到舊排列。
//
// photos（教學或進修照片，建議 3:2 橫幅）每一筆：
//   { src: '/assets/img/teaching-01.jpg', alt: '在工作坊示範超音波導引注射', caption: '（可留空）' }
// ---------------------------------------------------------------------------
const learning = {
  intro: '醫療一直在變，尤其疼痛治療這幾年變化很快。我每年固定參加繼續教育與實作課程，也在台灣區域麻醉暨止痛醫學會的工作坊擔任講師。',
  lecturing: [
    { date: '2026.08', org: '台灣區域麻醉暨止痛醫學會', topic: '疼痛擂台 7：真實病人工作坊－決戰上肢（肩／肘／腕）（講師）' },
    { date: '2026.06', org: '台灣區域麻醉暨止痛醫學會', topic: '疼痛擂台 6：真實病人工作坊－腰臀同源（助教）' },
    { date: '2026.04', org: '台灣區域麻醉暨止痛醫學會', topic: '疼痛擂台 5：真實病人工作坊－勁足強膝（助教）' },
    { date: '2026.01', org: '台灣區域麻醉暨止痛醫學會', topic: '疼痛擂台 4：真實病人工作坊－橫掃頸肩（講師）' },
  ],
  courses: [],
  photos: [
    { src: '/assets/img/teaching-workshop.jpg',
      alt: '黃佳君醫師在台灣區域麻醉暨止痛醫學會的真實病人工作坊中，手持超音波探頭示範檢查',
      caption: '真實病人工作坊現場：以超音波探頭示範檢查與定位。' },
    { src: '/assets/img/teaching-cert.jpg',
      alt: '台灣區域麻醉暨止痛醫學會頒給黃佳君醫師的感謝狀，感謝其在疼痛擂台 7 真實病人工作坊中的專業指導',
      caption: '疼痛擂台 7：真實病人工作坊－決戰上肢（肩／肘／腕），台灣區域麻醉暨止痛醫學會頒發。' },
  ],
};

const credList = (label, items) => items && items.length ? `<div class="doctor-group">
            <h3 class="doctor-group-title">${esc(label)}</h3>
            <ul class="doctor-list">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
          </div>` : '';

// 有資料才產生區塊；沒資料就回傳空字串，版面自動收合。
const timelineList = (label, rows) => rows && rows.length ? `<div class="learn-block">
      <h3 class="doctor-group-title">${esc(label)}</h3>
      <dl class="info-list">
        ${rows.map((r) => `<div class="info-row">
          <dt>${esc(r.date || '—')}</dt>
          <dd>${esc(r.text)}</dd>
        </div>`).join('\n        ')}
      </dl>
    </div>` : '';

export function doctorsPage() {
  const lecturingRows = learning.lecturing.map((l) => ({
    date: l.date,
    text: [l.org, l.topic].filter(Boolean).join('｜'),
  }));
  const courseRows = learning.courses.map((c) => ({ date: c.date, text: c.title }));

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
    ${team.map((t) => `<div class="doctor-intro">
      <div class="doctor-intro-side">
        ${t.photo
          ? `<div class="doctor-intro-photo">
          <img src="${url(t.photo)}" alt="${esc(t.photoAlt || t.name)}" width="900" height="900" fetchpriority="high">
        </div>`
          : `<span class="doctor-avatar" aria-hidden="true">${esc(t.name.slice(0, 1))}</span>`}
        <p class="doctor-intro-name">${esc(t.name)}</p>
        <p class="doctor-intro-role">${esc(t.role)}</p>
      </div>
      <div class="doctor-intro-body">
        ${roots.paragraphs.length ? `<span class="eyebrow">Local Roots</span>
        <h2 class="doctor-intro-title">${esc(roots.title)}</h2>
        <div class="prose">
          ${roots.paragraphs.map((x) => `<p>${esc(x)}</p>`).join('\n          ')}
        </div>` : ''}
        ${t.quote ? `<blockquote class="doctor-quote">${esc(t.quote)}</blockquote>` : ''}
      </div>
    </div>`).join('\n    ')}
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Profile</span>
      <h2 class="section-title">學經歷</h2>
    </div>
    ${team.map((t) => `<div class="cred-grid">
      ${credList('學歷', t.education)}
      ${credList('經歷', t.experience)}
      ${credList('專科證照', t.certifications)}
      ${credList('學會會員', t.societies)}
    </div>`).join('\n    ')}
  </div>
</section>

<section class="section section--paper">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">In the Clinic</span>
      <h2 class="section-title">診間裡，我怎麼做</h2>
      <p class="section-lead">同樣的症狀，處理方式可以差很多。這裡先說明我看診時的流程與判斷方式。</p>
    </div>
    <div class="grid grid--3">
      ${clinicNotes.map((n) => `<div class="card">
        <div class="card-icon">${icons[n.icon]}</div>
        <h3>${esc(n.title)}</h3>
        <p>${esc(n.desc)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap measure">
    <div class="section-head">
      <span class="eyebrow">Keep Learning</span>
      <h2 class="section-title">持續在學</h2>
    </div>
    <p class="section-lead">${esc(learning.intro)}</p>
    ${timelineList('擔任講師', lecturingRows)}
    ${timelineList('研討會與進修課程', courseRows)}
  </div>
  ${learning.photos.length ? `<div class="wrap">
    <div class="photo-grid photo-grid--${Math.min(learning.photos.length, 3)}">
      ${learning.photos.map((ph) => `<figure class="photo">
        <img src="${url(ph.src)}" alt="${esc(ph.alt)}" loading="lazy">
        ${ph.caption ? `<figcaption>${esc(ph.caption)}</figcaption>` : ''}
      </figure>`).join('\n      ')}
    </div>
  </div>` : ''}
</section>

<section class="section cta">
  <div class="wrap">
    <h2>想讓醫師看看你的狀況？</h2>
    <p>來電預約門診，或先看看再生注射治療是什麼。</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="${esc(site.contact.phoneHref)}">${icons.phone} ${esc(site.contact.phone)}</a>
      <a class="btn btn--ghost" href="${url('/regeneration/')}">了解再生注射治療</a>
      <a class="btn btn--ghost" href="${url('/services/')}">看看治療項目</a>
    </div>
  </div>
</section>
`;

  return {
    title: '黃佳君醫師',
    description: `${site.nameZh}由黃佳君醫師看診。台灣麻醉醫學會、台灣疼痛醫學會專科醫師，曾任林口長庚與花蓮慈濟醫院麻醉部主治醫師、花蓮門諾醫院疼痛科醫師。看診先找出疼痛來源，注射全程以超音波導引進行。`,
    active: '/doctors/',
    canonical: '/doctors/',
    slug: 'doctors',
    body,
  };
}
