// ===========================================================================
// Cloudflare Worker：把非正式網址 301 轉到正式網域，其餘照常提供網站檔案。
//
// 為什麼需要：同一個網站如果有多個網址都打得開，Google 會視為重複內容，
// 網域權重會被分散。所以只留一個「正式」網址，其他一律轉過去。
//
// 轉址規則：
//   www.harmoniaclinic.net/任何頁面  → harmoniaclinic.net/同一頁
//   *.workers.dev/任何頁面           → harmoniaclinic.net/同一頁
//   （路徑與查詢參數都會保留，不是全部丟到首頁）
//
// 要改正式網域，改下面的 CANONICAL_HOST 就好。
// ===========================================================================

const CANONICAL_HOST = 'harmoniaclinic.net';

// 只轉這些來源，避免萬一多了新網域時造成無限轉址
const shouldRedirect = (host) =>
  host === `www.${CANONICAL_HOST}` || host.endsWith('.workers.dev');

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (shouldRedirect(url.hostname)) {
      url.protocol = 'https:';
      url.hostname = CANONICAL_HOST;
      url.port = '';
      return Response.redirect(url.toString(), 301);
    }

    // 正式網域：照常回傳 dist/ 裡的靜態檔案
    return env.ASSETS.fetch(request);
  },
};
