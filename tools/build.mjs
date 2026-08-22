#!/usr/bin/env node
// ===========================================================================
// 君禾診所 Harmonia Clinic — 網站產生器
//
//   npm run build
//
// 做的事：
//   1. 讀 content/articles/*.md，解析文章資訊
//   2. 比對內容 hash：內容有改 → 自動把「最後更新日」換成今天
//   3. 依「最新在前」重新排序
//   4. 產生 dist/ 底下所有 HTML（首頁卡片是實體 HTML，不靠 JavaScript）
//   5. 複製 assets、產生 config.js / sitemap.xml / robots.txt / 404.html
// ===========================================================================

import { readdir, readFile, writeFile, mkdir, rm, cp, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, supabase } from '../site.config.mjs';
import { page, BASE } from '../src/layout.mjs';
import { markdownToHtml, markdownToText } from './markdown.mjs';
import { homePage } from '../src/pages/home.mjs';
import { servicesPage } from '../src/pages/services.mjs';
import { regenerationPage } from '../src/pages/regeneration.mjs';
import { featuresPage } from '../src/pages/features.mjs';
import { doctorsPage } from '../src/pages/doctors.mjs';
import { articlesPage } from '../src/pages/articles.mjs';
import { locationPage } from '../src/pages/location.mjs';
import { articlePage } from '../src/pages/article.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const ARTICLE_DIR = path.join(ROOT, 'content', 'articles');
const DATE_STATE = path.join(ROOT, 'content', 'article-dates.json');

const PLACEHOLDER_HERO = '/assets/img/placeholder-hero.svg';

const warnings = [];
const ok = (m) => console.log('  \x1b[32m✓\x1b[0m ' + m);
const warn = (m) => { warnings.push(m); console.log('  \x1b[33m!\x1b[0m ' + m); };

/** 今天的日期（依執行機器的當地時區） */
function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const exists = (p) => access(p).then(() => true, () => false);

/* ---------------------------------------------------------------------------
   Front matter 解析（YAML 子集：key: value）
--------------------------------------------------------------------------- */
function parseFrontMatter(raw) {
  const m = raw.replace(/^﻿/, '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };

  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const kv = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    data[kv[1]] = v;
  }
  return { data, body: m[2] };
}

/* ---------------------------------------------------------------------------
   讀文章 + 判斷更新日期
--------------------------------------------------------------------------- */
async function loadArticles() {
  let files = [];
  if (await exists(ARTICLE_DIR)) {
    files = (await readdir(ARTICLE_DIR)).filter((f) => f.endsWith('.md')).sort();
  }

  // 讀上一次建置的狀態（用來偵測文章內容有沒有變）
  let state = {};
  if (await exists(DATE_STATE)) {
    try { state = JSON.parse(await readFile(DATE_STATE, 'utf8')); }
    catch { warn('content/article-dates.json 讀不動，這次重新建立'); }
  }

  const now = today();
  const nextState = {};
  const articles = [];

  for (const file of files) {
    const raw = await readFile(path.join(ARTICLE_DIR, file), 'utf8');
    const { data, body } = parseFrontMatter(raw);

    const slug = data.slug || file.replace(/\.md$/, '');
    if (!data.title) { warn(`${file} 沒有 title，已跳過`); continue; }
    if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      warn(`${file} 的 date 格式要是 YYYY-MM-DD，已跳過`); continue;
    }

    // 內容 hash：標題、作者、圖片、內文任何一項變動都算「更新」
    const hash = createHash('sha1')
      .update([data.title, data.author, data.tag, data.hero, data.excerpt, body].join('\0'))
      .digest('hex')
      .slice(0, 16);

    const prev = state[slug];
    let updated;
    if (data.updated && /^\d{4}-\d{2}-\d{2}$/.test(data.updated)) {
      updated = data.updated;                       // 手動指定，最優先
    } else if (!prev) {
      updated = data.date;                          // 全新文章：更新日 = 發佈日
    } else if (prev.hash !== hash) {
      updated = now;                                // 內容有改：自動換成今天
      ok(`偵測到「${data.title}」內容變更 → 最後更新日 ${now}`);
    } else {
      updated = prev.updated || data.date;          // 沒改：沿用
    }

    nextState[slug] = { hash, date: data.date, updated };

    // HERO 圖片：檔案不在就退回預設圖，不讓版面破掉
    let hero = data.hero || '';
    if (hero) {
      const rel = hero.replace(/^\//, '');
      if (!(await exists(path.join(ROOT, rel)))) {
        warn(`找不到圖片 ${hero}（${file}），先用預設圖代替`);
        hero = PLACEHOLDER_HERO;
      }
    } else {
      hero = PLACEHOLDER_HERO;
    }

    const text = markdownToText(body);
    articles.push({
      slug,
      title: data.title,
      author: data.author || `${site.nameZh}醫療團隊`,
      authorRole: data.authorRole || '',
      tag: data.tag || '',
      date: data.date,
      updated,
      hero,
      heroAlt: data.heroAlt || data.title,
      heroCaption: data.heroCaption || '',
      excerpt: data.excerpt || (text.length > 96 ? text.slice(0, 96) + '…' : text),
      html: markdownToHtml(body),
    });
  }

  // 最新在前：以「發佈日 / 最後更新日」較新的那個為準
  const rank = (a) => (a.updated > a.date ? a.updated : a.date);
  articles.sort((a, b) => (rank(b).localeCompare(rank(a))) || b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

  await writeFile(DATE_STATE, JSON.stringify(nextState, null, 2) + '\n');
  return articles;
}

/* ---------------------------------------------------------------------------
   輸出
--------------------------------------------------------------------------- */
async function emit(relPath, html) {
  const full = path.join(DIST, relPath, 'index.html');
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, html);
}

async function build() {
  console.log(`\n\x1b[36m建置 ${site.nameZh} ${site.nameEn}\x1b[0m${BASE ? `（base path: ${BASE}）` : ''}\n`);

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  const articles = await loadArticles();
  ok(`讀到 ${articles.length} 篇文章`);

  // 首頁 HERO 照片還沒放上去的話，先用預設圖，版面不會壞
  if (!(await exists(path.join(ROOT, site.hero.image.replace(/^\//, ''))))) {
    warn(`首頁 HERO 照片 ${site.hero.image} 還沒放，先用預設圖代替`);
    site.hero.image = PLACEHOLDER_HERO;
  }

  // --- 固定頁 ---
  await emit('.', page(homePage(articles)));
  await emit('services', page(servicesPage()));
  await emit('regeneration', page(regenerationPage()));
  await emit('features', page(featuresPage()));
  await emit('doctors', page(doctorsPage()));
  await emit('articles', page(articlesPage(articles)));
  await emit('location', page(locationPage()));
  ok('首頁、治療項目、自體骨髓再生注射、本院特色、醫師介紹、衛教文章、地理位置');

  // --- 文章頁：每篇一個獨立網址 /<slug>/ ---
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    await emit(a.slug, page(articlePage(a, { prev: articles[i + 1], next: articles[i - 1] })));
  }
  if (articles.length) ok(`文章頁 ${articles.length} 個（/${articles[0].slug}/ …）`);

  // --- 靜態資源 ---
  await cp(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), { recursive: true });
  ok('複製 assets/');

  // --- 前端設定檔（Supabase 計數器） ---
  await writeFile(
    path.join(DIST, 'assets', 'js', 'config.js'),
    `/* 由 tools/build.mjs 自動產生，請勿手動修改；要改請改 site.config.mjs */\n` +
    `window.HARMONIA_CONFIG = ${JSON.stringify({
      supabaseUrl: supabase.url || '',
      supabaseAnonKey: supabase.anonKey || '',
    }, null, 2)};\n`
  );
  if (supabase.url && supabase.anonKey) ok('瀏覽計數器：已設定 Supabase');
  else warn('瀏覽計數器：site.config.mjs 尚未填 Supabase 設定，數字暫時不顯示');

  // --- 404 ---
  await writeFile(path.join(DIST, '404.html'), page({
    title: '找不到頁面',
    description: '這個網址不存在。',
    active: '',
    canonical: '/404.html',
    slug: '404',
    body: `<section class="section"><div class="wrap measure" style="text-align:center">
  <span class="eyebrow">404</span>
  <h1 class="section-title">這個頁面不在這裡</h1>
  <p class="section-lead" style="margin-inline:auto">網址可能打錯了，或這篇內容已經搬家。</p>
  <div class="btn-row" style="justify-content:center">
    <a class="btn btn--primary" href="${BASE}/">回首頁</a>
    <a class="btn btn--ghost" href="${BASE}/articles/">看衛教文章</a>
  </div>
</div></section>`,
  }));

  // --- sitemap / robots / .nojekyll ---
  const urls = [
    { loc: '/', pri: '1.0' },
    { loc: '/services/', pri: '0.8' },
    { loc: '/regeneration/', pri: '0.8' },
    { loc: '/features/', pri: '0.8' },
    { loc: '/doctors/', pri: '0.8' },
    { loc: '/articles/', pri: '0.8' },
    { loc: '/location/', pri: '0.7' },
    ...articles.map((a) => ({ loc: `/${a.slug}/`, pri: '0.6', lastmod: a.updated })),
  ];
  await writeFile(path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${site.url}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.pri}</priority></url>`).join('\n') +
    `\n</urlset>\n`);
  await writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
  await writeFile(path.join(DIST, '.nojekyll'), '');
  ok('sitemap.xml / robots.txt / 404.html');

  console.log(`\n\x1b[32m完成\x1b[0m → dist/${warnings.length ? `\x1b[33m（${warnings.length} 個提醒，見上方 !）\x1b[0m` : ''}\n`);
}

build().catch((e) => { console.error('\n建置失敗：', e); process.exit(1); });
