import { site } from '../../site.config.mjs';
import { url, esc } from '../layout.mjs';
import { icons } from '../components.mjs';

// ---------------------------------------------------------------------------
// 就醫須知：看診原則、掛號方式、收費說明。
// 原稿是診所提供的《君禾診所-就醫須知-網頁版.html》，2026-09-15 依討論修正後放上：
//   ・法條引用改成不會被抓語病的寫法（醫師法第 11 條有但書；醫療法 63／64 條不直接引用）
//   ・健保卡補卡期限依網站主人指示寫 10 日
//   ・代領不需委託書；LINE 與 Google 預約尚未開放
// 內文可以用 <strong>，所以 rules / fees 的文字不經過 esc()，改字時注意不要打出 < 或 &。
//
// ★ 網址 /notice/ 已經印成 QR 碼貼在診所牆上（A3 精簡版），不可以改網址或刪掉這一頁。
//   這裡的規定有改時，也要重做 A4 完整版、A3 精簡版兩份紙本，不然現場和網站會對不上。
// ---------------------------------------------------------------------------

const rules = [
  {
    q: '依序看診，急重症優先',
    a: '每位病人的狀況不同，需要的時間也不同。若前面的病人需要較長的說明或處置，難免會有等候，請多包涵。遇有急重症、明顯外傷或生命徵象不穩定者，本所會優先處理，謝謝您的體諒。',
  },
  {
    q: '請全程配戴口罩',
    a: '本所空間有限，且有許多長期追蹤的慢性病與疼痛患者，因此請您在診所內全程配戴口罩，保護自己，也保護身邊的人。若因身體狀況無法配戴，請先告知櫃檯，我們會另行安排。',
  },
  {
    q: '看診與開立處方，須由病人本人到場',
    a: '依醫師法規定，醫師原則上須親自診察，才能施行治療、開給方劑或交付診斷書。本所<strong>目前未提供線上看診或通訊診療，也無法僅憑家屬轉述病情就開藥</strong>。這不是服務態度的問題，而是為了避免誤判，保障您的用藥安全。',
  },
  {
    q: '已看診過的病人，藥品與證明可請親友代領',
    a: '已調劑完成的藥品、已開立完成的診斷書或各式證明，可由親友持<strong>病人健保卡及代領人身分證件</strong>代為領取。',
  },
  {
    q: '未滿 18 歲，建議由家長或監護人陪同',
    a: '病情解釋與治療風險說明，需要家長或監護人在場才能完整進行。若涉及<strong>注射、侵入性檢查或處置</strong>，本所需由家長或監護人到場簽署同意書。若確實無法陪同，請事先來電與我們討論。',
  },
  {
    q: '本所的服務範圍',
    a: '君禾診所以<strong>疼痛治療（脊椎、四肢關節與肌肉骨骼）</strong>、<strong>慢性病長期追蹤（糖尿病、高血壓、高血脂等）</strong>，以及<strong>感冒、過敏、腸胃不適等急性症狀</strong>為主。若您的狀況需要本所不具備的檢查或設備，例如需要住院、緊急手術，或需要其他專科處置，我們會誠實告知，並協助您轉診到更合適的院所，讓您少走冤枉路。',
  },
  {
    q: '尊重隱私',
    a: '未叫到姓名前，請勿逕自進入診間。診所內未經同意，請勿錄音、錄影或拍照，這是保護每一位在場病人的隱私。',
  },
  {
    q: '進入診間請收妥手機並轉為靜音',
    a: '讓醫師與您都能專心在病情上。',
  },
  {
    q: '其他小提醒',
    a: '衣著請盡量寬鬆，方便檢查與治療；除導盲犬、導聾犬、肢體輔助犬外，請勿攜帶寵物進入診所。',
  },
];

// 掛號管道。LINE 或 Google 預約開放後，把 soon 拿掉、desc 改成實際說明，
// 並記得回頭改首頁與地理位置頁的 LINE 按鈕文字、tools/build.mjs 的 llms.txt。
const channels = [
  { title: '現場掛號', desc: '自各診次開診時間起開放，額滿或該診次結束前 15 分鐘停止掛號。' },
  { title: '電話掛號', desc: `${site.contact.phone}，看診時間內由櫃檯人員為您服務。` },
  { title: 'LINE 預約', desc: '目前請以現場或電話掛號。', soon: true },
  { title: 'Google 預約', desc: '目前請以現場或電話掛號。', soon: true },
];

const notes = [
  '請攜帶<strong>健保卡</strong>；初診請一併攜帶<strong>身分證件</strong>。',
  '未帶健保卡或健保卡無法讀取時，需先收取自費押金，並請於 10 日內補卡退費。更重要的是，我們將<strong>無法查詢您的雲端用藥與檢查紀錄</strong>，這會直接影響用藥安全與治療判斷，所以請盡量隨身攜帶。',
  '<strong>已預約的病人，請於該診次結束前至少 15 分鐘完成報到</strong>，逾時將無法為您看診，敬請見諒。',
  '預約後若無法前來，請提前來電取消，把名額留給其他等候的病人。',
  '遇醫師臨時有事、天候因素等特殊狀況需調整診次時，會於官網與診所門口公告，並盡快通知已預約的病人。',
];

const fees = [
  {
    q: '健保部分負擔',
    a: ['依中央健康保險署規定收取。'],
  },
  {
    q: '自費項目',
    a: [
      '非健保給付的項目，例如自費藥品、自費檢查、自體骨髓再生注射等再生治療、各式證明書，均採自費收取，收費標準依主管機關核定。',
      '凡屬自費項目，我們一律<strong>在執行前先向您說明內容、預期效果、可能風險與確切金額</strong>，經您同意並簽署自費同意書後才會進行。您隨時都可以先回去考慮，不會有任何壓力。',
      '請特別留意，自費治療所使用的藥品、耗材與檢體<strong>一經製備即無法回復，已製備的部分無法退費</strong>；尚未製備的部分，可依實際情況辦理退費。請務必在簽署同意書前，確認自己已充分理解治療內容並完成決定；若還有任何疑慮，請先暫緩，我們很樂意再為您說明一次。',
    ],
  },
  {
    q: '付款方式',
    a: ['本所<strong>僅收現金</strong>，恕不提供刷卡、行動支付或賒欠。每筆費用均開立收據，請當場核對並妥善保存；補開收據需憑身分證明辦理。'],
  },
];

const faqItems = (list) => list.map((r) => `<div class="faq-item">
        <h3 class="faq-q">${esc(r.q)}</h3>
        ${[].concat(r.a).map((p) => `<p class="faq-a">${p}</p>`).join('\n        ')}
      </div>`).join('\n      ');

export function noticePage() {
  const body = `
<section class="page-head">
  <div class="wrap">
    <span class="eyebrow">Patient Guide</span>
    <h1>就醫須知</h1>
    <p>看診原則、掛號方式與收費說明。請您在就診前花兩分鐘看過，讓我們把時間留給您的病情。</p>
  </div>
</section>

<section class="section">
  <div class="wrap measure">
    <div class="section-head">
      <span class="eyebrow">Principles</span>
      <h2 class="section-title">我們的看診原則</h2>
    </div>
    <div class="faq">
      ${faqItems(rules)}
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap measure">
    <div class="section-head">
      <span class="eyebrow">Hours &amp; Registration</span>
      <h2 class="section-title">看診時間與掛號方式</h2>
    </div>
    <dl class="info-list">
      ${site.hours.map((h) => `<div class="info-row"><dt>${esc(h.day)}</dt><dd>${esc(h.time)}</dd></div>`).join('\n      ')}
    </dl>

    <h3 class="doctor-group-title notice-subtitle">掛號方式</h3>
    <dl class="info-list">
      ${channels.map((c) => `<div class="info-row"><dt>${esc(c.title)}</dt><dd>${c.soon ? '<span class="notice-soon">即將開放</span> ' : ''}${esc(c.desc)}</dd></div>`).join('\n      ')}
    </dl>

    <div class="article-notice notice-callout">
      <p><strong>掛號完成，不等於立刻看診</strong></p>
      <p>看診順序由現場櫃檯人員統一安排，會視當診人數、病情緩急，以及是否需要檢查或處置而調整，並非一律照掛號先後叫號。完成掛號後，請在候診區稍候叫號，勿逕自進入診間詢問。這樣安排，是為了讓真正緊急的病人能先被處理，也讓每一位病人都有完整的看診時間。</p>
    </div>

    <ul class="doctor-list notice-notes">
      ${notes.map((n) => `<li>${n}</li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="section">
  <div class="wrap measure">
    <div class="section-head">
      <span class="eyebrow">Fees</span>
      <h2 class="section-title">收費方式</h2>
    </div>
    <div class="faq">
      ${faqItems(fees)}
    </div>
  </div>
</section>

<section class="section cta">
  <div class="wrap">
    <h2>還有不清楚的地方，直接問我們</h2>
    <p>對於看診、收費或治療內容有任何疑問，都歡迎詢問醫師或櫃檯人員。若您對就醫過程有任何意見，也請告訴我們——比起您默默不再回診，我們更希望有機會把事情處理好。</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="${esc(site.contact.phoneHref)}">${icons.phone} ${esc(site.contact.phone)}</a>
      <a class="btn btn--ghost" href="${url('/location/')}">${icons.pin} 診所位置與交通</a>
    </div>
  </div>
</section>
`;

  return {
    title: '就醫須知',
    description: `${site.nameZh}就醫須知：看診原則、看診時間、掛號方式與收費說明。${site.contact.address}，電話 ${site.contact.phone}。`,
    active: '/notice/',
    canonical: '/notice/',
    slug: 'notice',
    breadcrumb: [{ name: '首頁', path: '/' }, { name: '就醫須知' }],
    body,
  };
}
