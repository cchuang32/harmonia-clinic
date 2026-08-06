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
  url: 'https://harmonia-clinic.cc-huang32.workers.dev',

  // 聯絡資訊（請改成診所實際資料）
  contact: {
    phone: '03-5900298',
    phoneHref: 'tel:+88635900298',
    lineId: '@harmonia',
    email: 'service@harmonia-clinic.tw',
    address: '新竹縣湖口鄉中山路一段 596 號',
    // Google 地圖用的查詢字串（地址或店名）
    mapQuery: '新竹縣湖口鄉中山路一段596號',
  },

  // 看診時間（地理位置頁 + 頁尾使用）
  hours: [
    { day: '星期一 ~ 星期五', time: '09:00–12:00　16:00–20:30' },
    { day: '星期六', time: '09:00–12:00' },
    { day: '星期日 / 國定假日', time: '休診' },
  ],

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

  // 首頁 HERO 主視覺（請把照片放到 assets/img/ 之後改這裡的檔名）
  hero: {
    image: '/assets/img/hero-home.jpg',
    alt: '君禾診所明亮溫馨的候診空間',
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
