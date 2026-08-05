#!/usr/bin/env node
// 新增一篇文章：
//   npm run new -- winter-flu "冬天的流感疫苗，什麼時候打最好？"
// 會產生 content/articles/YYYYMMDD-winter-flu.md，接著跑 npm run build 就會出現卡片。

import { writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [rawSlug, ...titleParts] = process.argv.slice(2);

if (!rawSlug) {
  console.log('\n用法：npm run new -- <英文網址代號> "<文章標題>"');
  console.log('範例：npm run new -- winter-flu "冬天的流感疫苗，什麼時候打最好？"\n');
  process.exit(1);
}

const d = new Date();
const p = (n) => String(n).padStart(2, '0');
const ymd = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
const stamp = ymd.replace(/-/g, '');

const key = rawSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
const slug = /^\d{8}-/.test(key) ? key : `${stamp}-${key}`;
const title = titleParts.join(' ') || '請填標題';
const file = path.join(ROOT, 'content', 'articles', `${slug}.md`);

if (await access(file).then(() => true, () => false)) {
  console.error(`\n已經有 ${slug}.md 了，換個代號吧。\n`);
  process.exit(1);
}

await writeFile(file, `---
title: ${title}
slug: ${slug}
author: 黃佳君 醫師
authorRole: 麻醉科．疼痛科專科醫師
tag: 健康知識
date: ${ymd}
hero: /assets/img/hero-${key}.jpg
heroAlt: 請填圖片說明（給看不到圖的人聽的）
heroCaption:
excerpt: 請填 60～100 字的摘要，這段會出現在首頁與文章列表的卡片上。
---

先寫一段開場，讓讀者知道這篇要解決他的什麼問題。

## 第一個小標

段落內容。可以用 **粗體**、[連結](https://example.com)、清單：

- 重點一
- 重點二

## 第二個小標

> 想強調的一句話可以用引言。

---

結尾。
`);

console.log(`\n  建好了：content/articles/${slug}.md`);
console.log(`  圖片請放：assets/img/hero-${key}.jpg`);
console.log(`  寫完之後跑：npm run build\n  網址會是：/${slug}/\n`);
