// ===========================================================================
// Cloudflare Worker：把非正式網址 301 轉到正式網域，其餘照常提供網站檔案。
//
// 為什麼需要：同一個網站如果有多個網址都打得開，Google 會視為重複內容，
// 網域權重會被分散。所以只留一個「正式」網址，其他一律轉過去。
//
// 轉址規則：
//   http://任何頁面                  → https://同一頁
//   www.harmoniaclinic.net/任何頁面  → harmoniaclinic.net/同一頁
//   *.workers.dev/任何頁面           → harmoniaclinic.net/同一頁
//   /頁面（少了結尾斜線）             → /頁面/
//   （路徑與查詢參數都會保留，不是全部丟到首頁）
//
// 為什麼結尾斜線要自己處理：Cloudflare 內建的補斜線是 307「暫時」轉址，
// 對 Google 的意思是「原網址才是本尊」，於是它可能把沒有斜線的版本當成
// 正版，我們宣告 canonical 的那一頁反而被判為重複。改成 301「永久」才對。
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

    const wrongHost = shouldRedirect(url.hostname);
    // 沒有這一段的話，http:// 與 https:// 兩個版本都會回 200：
    // 對訪客是未加密連線（瀏覽器顯示「不安全」），對 Google 則是兩個不同的網址。
    const insecure = url.protocol === 'http:';

    if (wrongHost || insecure) {
      url.protocol = 'https:';
      if (wrongHost) {
        url.hostname = CANONICAL_HOST;
        url.port = '';
      }
      return Response.redirect(url.toString(), 301);
    }

    // 補上結尾斜線，並且用 301（永久）而不是 Cloudflare 內建的 307（暫時）。
    // 只有「看起來像頁面」的路徑要處理：不是根目錄、結尾沒有斜線、也不是檔案
    //（副檔名判斷，例如 .jpg、.svg、.pdf 就跳過）。
    // 先確認加了斜線之後真的有東西，才轉址；否則不存在的網址會變成
    // 「先轉址、再 404」，比直接回 404 差。
    const path = url.pathname;
    if (path !== '/' && !path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path)) {
      const slashed = new URL(url);
      slashed.pathname = path + '/';
      const probe = await env.ASSETS.fetch(new Request(slashed.toString(), { method: 'GET' }));
      if (probe.status === 200) return Response.redirect(slashed.toString(), 301);
    }

    // 正式網域：照常回傳 dist/ 裡的靜態檔案
    return env.ASSETS.fetch(request);
  },
};
