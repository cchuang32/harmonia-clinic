#!/usr/bin/env node
// 本機預覽用的小型靜態伺服器：npm run dev
// 支援乾淨網址（/20260802-introduction/ → dist/20260802-introduction/index.html）

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT) || 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const rel = path.normalize(clean).replace(/^(\.\.[/\\])+/, '');
  const target = path.join(DIST, rel);
  if (!target.startsWith(DIST)) return null;             // 擋住目錄跳脫

  try {
    const s = await stat(target);
    if (s.isDirectory()) return path.join(target, 'index.html');
    return target;
  } catch {
    // /foo → /foo/index.html
    try {
      const idx = path.join(target, 'index.html');
      await stat(idx);
      return idx;
    } catch { return null; }
  }
}

createServer(async (req, res) => {
  const file = await resolveFile(req.url || '/');
  if (file) {
    try {
      const buf = await readFile(file);
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      return res.end(buf);
    } catch { /* 落到 404 */ }
  }
  try {
    const nf = await readFile(path.join(DIST, '404.html'));
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(nf);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 — 先跑 npm run build');
  }
}).listen(PORT, () => {
  console.log(`\n  君禾診所本機預覽：\x1b[36mhttp://localhost:${PORT}/\x1b[0m`);
  console.log('  按 Ctrl+C 結束\n');
});
