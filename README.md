# 君禾診所 Harmonia Clinic 官方網站

純靜態網站，不需要資料庫也不需要後台。文章寫成 Markdown，跑一次 `npm run build`
就會產生整個網站——包含首頁上的文章卡片（**直接寫進 HTML**，不是用 JavaScript 讀 JSON 生出來的）。

---

## 一分鐘上手

```bash
npm run build     # 產生網站到 dist/
npm run dev       # 建置 + 開本機預覽 http://localhost:4321
```

---

## 資料夾說明

| 路徑 | 放什麼 |
| --- | --- |
| `site.config.mjs` | **診所基本資料**：電話、地址、看診時間、頁籤、Supabase 金鑰 |
| `content/articles/*.md` | **文章原稿**。一個檔案 = 一篇文章 = 一個網址 |
| `content/article-dates.json` | 自動產生的日期紀錄，**不要手動改，但要一起 commit** |
| `assets/img/` | 照片（HERO 圖、文章圖） |
| `assets/css/style.css` | 全站樣式 |
| `src/pages/*.mjs` | 固定頁面的內容（治療項目、本院特色、地理位置…） |
| `tools/build.mjs` | 網站產生器 |
| `dist/` | 產生出來的網站，**不進 git**，由 CI 自動建置 |

---

## 一、新增一篇文章

```bash
npm run new -- winter-flu "冬天的流感疫苗，什麼時候打最好？"
```

會產生 `content/articles/20260805-winter-flu.md`，網址就是 `/20260805-winter-flu/`。

打開檔案，最上面那段是文章資訊：

```yaml
---
title: 冬天的流感疫苗，什麼時候打最好？   # 文章標題
slug: 20260805-winter-flu                # 網址（改了網址就會變，通常不用動）
author: 黃佳君 醫師                       # 作者，會顯示在文章與卡片上
authorRole:                               # 作者頭銜（可留空，例如「院長．家庭醫學專科」）
tag: 健康知識                             # 分類標籤
date: 2026-08-05                          # 發佈日期
hero: /assets/img/hero-winter-flu.jpg     # HERO 照片
heroAlt: 護理師正在準備疫苗                # 圖片說明（給看不到圖的人聽的，請務必填）
heroCaption: 流感疫苗建議每年接種一次       # 圖片下方的小字（可留空）
excerpt: 這段會出現在首頁卡片上，60～100 字。
---
```

底下用 Markdown 寫內文，支援：`## 小標題`、`- 清單`、`1. 編號`、`**粗體**`、
`[連結](網址)`、`> 引言`、`---` 分隔線、表格。

寫完：

```bash
npm run build
```

首頁與文章頁的卡片就會自動多一張，排在最前面。

### 照片怎麼放

把照片放進 `assets/img/`，檔名對應 front matter 裡的 `hero:` 欄位即可。

- 建議尺寸 **1600×900**（16:9），JPG 或 WebP
- 檔案控制在 300KB 以內，手機載入才快
- **照片還沒準備好也沒關係**：build 會自動換成預設圖，版面不會壞掉，
  終端機會提醒你「找不到圖片 ⋯⋯」

文章頁的 HERO 圖片會**等比例縮放，寬度剛好等於內文寬度**，不會超出去。

---

## 二、修改一篇文章

直接改 `content/articles/` 底下的 `.md`，然後 `npm run build`。

系統會自動：

1. 偵測到內容變了 → 把「最後更新日」改成**今天**
2. 文章頁與卡片上出現「更新 2026.08.05」標記
3. 首頁卡片**重新排序，最新的排到最前面**

> 排序規則：以「發佈日」和「最後更新日」較新的那個為準。
> 如果想讓某篇文章固定顯示某個更新日期，在 front matter 加一行
> `updated: 2026-08-01` 就會以你寫的為準。

---

## 三、改診所資料（電話、地址、時間）

改 `site.config.mjs`，全站頁首、頁尾、地圖、SEO 會一起更新。

各頁面的**內容文字**在下面這些檔案，一頁一個檔：

| 頁籤 | 網址 | 檔案 |
| --- | --- | --- |
| 首頁 | `/` | `src/pages/home.mjs` |
| 治療項目 | `/services/` | `src/pages/services.mjs` |
| 自體骨髓及PRP再生注射 | `/regeneration/` | `src/pages/regeneration.mjs` |
| 本院特色（診療設備與服務） | `/features/` | `src/pages/features.mjs` |
| 醫師介紹 | `/doctors/` | `src/pages/doctors.mjs` |
| 衛教文章 | `/articles/` | `src/pages/articles.mjs` |
| 地理位置 | `/location/` | `src/pages/location.mjs` |

檔案最上面都有一段 `★ 請改成診所實際的⋯⋯` 的註解，照著改就好。

### 新增一個頁籤要動三個地方

1. `src/pages/新頁.mjs` — 寫頁面內容，匯出一個回傳 `{ title, description, active, canonical, slug, body }` 的函式
2. `tools/build.mjs` — `import` 進來、加一行 `await emit('網址', page(新頁()))`、在 sitemap 的 `urls` 補一筆
3. `site.config.mjs` 的 `nav` — 加上頁籤

> **頁籤名稱不要太長。** 導覽列是一整列橫排，太長會擠到左上角的診所名稱。
> 目前 1000px 以下會切換成漢堡選單（`assets/css/style.css` 的 `@media (max-width: 1000px)`），
> 若之後頁籤再變多或名稱再變長，這個斷點要跟著往上調。

### 醫療文案的寫法原則

衛教內容一律**只描述「這是什麼、過程如何」，不寫療效、不寫成功率**，適不適合一律導回
「由醫師門診評估後說明」，自費項目要標明。這是醫療廣告規範下最安全的寫法。
任何新增的療效相關敘述，**上線前請醫師確認過**。

---

## 四、瀏覽計數器（Supabase）

每篇文章有各自的計數器，首頁也有自己的。首頁卡片上顯示的數字，就是那篇文章的實際瀏覽數。

### 設定步驟

1. 到 [supabase.com](https://supabase.com) 建立一個免費專案
2. 左側 **SQL Editor → New query**，把 `supabase/schema.sql` 整份貼上，按 **Run**
3. 左側 **Project Settings → Data API**，複製兩個值：
   - `Project URL`
   - `anon` `public` key
4. 貼進 `site.config.mjs`：

```js
export const supabase = {
  url: 'https://你的專案.supabase.co',
  anonKey: 'eyJhbGciOi...',
};
```

5. `npm run build`，數字就會出現。

**沒設定也不會壞**：計數器區塊會自動隱藏，網站其他部分完全正常。

### 關於安全性

`anon key` 是 Supabase 設計來公開放在前端的金鑰，放進 git 是正常做法。
真正的防線是 `schema.sql` 裡的 RLS 政策：外部只能「讀次數」和「呼叫函式 +1」，
無法竄改或刪除資料。

同一個瀏覽階段（sessionStorage）只會計算一次，重新整理不會灌水。

---

## 五、部署

推上 `main` 之後，兩邊都會自動重新建置：

| 平台 | 網址 | 怎麼觸發 |
| --- | --- | --- |
| Cloudflare（正式站） | https://harmonia-clinic.cc-huang32.workers.dev | Cloudflare 偵測到 GitHub 有新 commit，自動拉下來重建 |
| GitHub Pages（備援） | https://cchuang32.github.io/harmonia-clinic/ | `.github/workflows/deploy.yml` |

Cloudflare 端的建置設定：

| 項目 | 值 |
| --- | --- |
| Build command | `node tools/build.mjs` |
| Build output directory | `dist` |
| Node 版本 | 由 repo 根目錄的 `.node-version`（20）決定 |

> Cloudflare 目前是用新版的 **Workers + 靜態資源**（不是舊的 Pages 專案），
> 所以網址結尾是 `.workers.dev` 而不是 `.pages.dev`。兩者對這個網站來說功能相同。
>
> GitHub Pages 掛在 `/harmonia-clinic/` 子目錄底下，所以 workflow 會帶入
> `BASE_PATH` 讓連結自動加上前綴；Cloudflare 是根目錄，不需要前綴。

所以日常流程就是：

```bash
npm run build          # 本機確認一下
git add -A
git commit -m "新增文章：冬天的流感疫苗"
git push
```

推完之後 Cloudflare 大約要 **1～2 分鐘**才重建完成，期間打開網站看到的還是舊版，
不用重推。想確認新版上線了沒，可以直接查頁面內容：

```bash
curl -s https://harmonia-clinic.cc-huang32.workers.dev/ | grep -o '要找的那句話'
```

---

## 六、文章網址規則

一篇文章 = 同一個網域底下的一個獨立網址：

```
https://你的網域/20260802-introduction/
https://你的網域/20260728-blood-pressure-at-home/
```

之後要接自己的子網域（例如 `blog.你的網域.tw`），在 Cloudflare Pages 的
**Custom domains** 加上去即可，文章網址的格式不會變。
