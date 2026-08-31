// ===========================================================================
// 君禾診所 Harmonia Clinic — 全站設定
// 只要改這個檔案，全站（頁首、頁尾、SEO、計數器）都會跟著換。
// 改完記得跑：npm run build
// ===========================================================================

export const site = {
  nameZh: '君禾診所',
  nameEn: 'Harmonia Clinic',
  slogan: '君之健康，禾你同行',        // 品牌標語（首頁主視覺）
  tagline: '健康，像深呼吸一樣自然。',  // 頁尾與預設 SEO 描述用

  // 網站正式網址（結尾不要加 /），用於 canonical、og:url 與 sitemap.xml。
  // 之後接上自己的子網域（例如 https://blog.你的網域.tw）時，記得一起改這裡。
  url: 'https://harmoniaclinic.net',

  // 聯絡資訊（請改成診所實際資料）
  contact: {
    phone: '03-5900298',
    phoneHref: 'tel:+88635900298',
    lineId: '@855wbxpl',
    // 加入好友的連結與 QR 碼。兩者都是 LINE 官方網址（lin.ee），
    // QR 碼由 LINE 官方帳號後台產生，沒有經過第三方轉址。
    lineUrl: 'https://lin.ee/symEgb8',
    lineQr: '/assets/img/line-qr.png',
    // email 目前網站上沒有顯示（地理位置頁已移除該欄），保留備用
    email: 'service@harmonia-clinic.tw',
    address: '新竹縣湖口鄉中山路一段 596 號',
    // Google 地圖用的查詢字串（地址或店名）
    mapQuery: '新竹縣湖口鄉中山路一段596號',
  },

  // 看診時間（地理位置頁 + 頁尾使用）
  hours: [
    { day: '星期一 ~ 星期五', time: '09:00–12:00　16:00–18:00　18:30–20:30' },
    { day: '星期六', time: '09:00–12:00' },
    { day: '星期日 / 國定假日', time: '休診' },
  ],

  // 給 Google 看的診所資料（不會顯示在網頁上，寫在原始碼裡）。
  // 上面的 address 或 hours 有改，記得回來一起改這裡。
  seo: {
    // 首頁 <title> 會接在「君禾診所 Harmonia Clinic」後面，讓搜尋看得到地區與科別。
    // 留空字串則不加。其他頁面不受影響。
    homeTitleSuffix: '新竹湖口診所・慢性病與疼痛診療',
    streetAddress: '中山路一段 596 號',
    addressLocality: '湖口鄉',
    addressRegion: '新竹縣',
    postalCode: '303',
    // 看診時間的機器可讀版本。days 用英文星期，時間用 24 小時制。
    openingHours: [
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '12:00' },
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '16:00', closes: '18:00' },
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '18:30', closes: '20:30' },
      { days: ['Saturday'], opens: '09:00', closes: '12:00' },
    ],
  },

  // 頁籤（頁首導覽列）
  nav: [
    { label: '首頁', href: '/' },
    { label: '治療項目', href: '/services/' },
    { label: '自體骨髓及PRP再生注射', href: '/regeneration/' },
    { label: '本院特色', href: '/features/' },
    { label: '醫師介紹', href: '/doctors/' },
    { label: '衛教文章', href: '/articles/' },
    { label: '地理位置', href: '/location/' },
  ],

  // 首頁最上方的 banner。目前放的是診所橫式 logo（等比例顯示，不裁切）。
  // 換圖時要做兩件事：
  //   1. width / height 填新圖的實際像素尺寸，畫面才不會在載入時跳動。
  //   2. 若新圖底色不是橄欖綠 #9cab80，記得同時改 assets/css/style.css 的 --brand。
  hero: {
    image: '/assets/img/logo-horizontal.jpg',
    alt: '君禾診所 Harmonia Clinic',
    width: 1200,
    height: 481,
  },
};

// ---------------------------------------------------------------------------
// Supabase 瀏覽計數器設定
// 到 Supabase 專案 → Project Settings → Data API 取得，貼在下面。
// anon key 是「可公開」的金鑰，放在前端是正常且安全的用法。
// 沒填也不會壞：計數器會安靜地不顯示，網站其他部分照常運作。
// ---------------------------------------------------------------------------
export const supabase = {
  url: '',      // 例：https://abcdefghijkl.supabase.co
  anonKey: '',  // 例：eyJhbGciOi...
};
