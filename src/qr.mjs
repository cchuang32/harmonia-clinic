// ---------------------------------------------------------------------------
// QR 碼產生器（零外部套件）。
//
// 為什麼自己寫：網站規定不裝任何外部套件，而且 dist/ 是 Cloudflare 每次 push 後
// 在它的伺服器上重新建置的——QR 碼必須在建置時當場算出來，不能靠手動做好的圖片，
// 否則每加一篇文章就要記得補一張。
//
// 範圍刻意縮小：只做「位元組模式＋錯誤修正等級 M＋版本 1～10」。
// 版本 10 最多可以放 213 個位元組，文章網址約 50 個字元，綽綽有餘。
// 等級 M 可承受約 15% 的污損，螢幕或印出來都夠用。
//
// 演算法依 ISO/IEC 18004 標準；寫法參考 Project Nayuki 的 QR Code generator（MIT）。
// 改動這個檔案之後，務必實際掃描驗證——錯一個模組（黑白小格）就掃不出來。
// ---------------------------------------------------------------------------

// 等級 M 的區塊結構：版本 → [每個區塊的錯誤修正碼數, [[區塊數, 每區塊資料碼數], ...]]
const ECC_M = {
  1: [10, [[1, 16]]],
  2: [16, [[1, 28]]],
  3: [26, [[1, 44]]],
  4: [18, [[2, 32]]],
  5: [24, [[2, 43]]],
  6: [16, [[4, 27]]],
  7: [18, [[4, 31]]],
  8: [22, [[2, 38], [2, 39]]],
  9: [22, [[3, 36], [2, 37]]],
  10: [26, [[4, 43], [1, 44]]],
};

// 對齊圖形（右下那些小方框）的中心座標
const ALIGN = {
  1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
  6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
};

// ---- 有限體 GF(256) 運算，給 Reed-Solomon 錯誤修正碼用 ----
const EXP = new Array(512);
const LOG = new Array(256);
for (let i = 0, x = 1; i < 255; i++) {
  EXP[i] = x;
  LOG[x] = i;
  x <<= 1;
  if (x & 0x100) x ^= 0x11d;
}
for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
const gfMul = (a, b) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);

/** 產生 n 次的 Reed-Solomon 生成多項式（由高次到低次，首項係數為 1） */
function rsGenerator(n) {
  let g = [1];
  for (let i = 0; i < n; i++) {
    const next = new Array(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) {
      next[j] ^= g[j];
      next[j + 1] ^= gfMul(g[j], EXP[i]);
    }
    g = next;
  }
  return g;
}

/** 算出一個資料區塊的錯誤修正碼 */
function rsRemainder(data, n) {
  const g = rsGenerator(n);
  const r = new Array(n).fill(0);
  for (const d of data) {
    const factor = d ^ r.shift();
    r.push(0);
    for (let i = 0; i < n; i++) r[i] ^= gfMul(g[i + 1], factor);
  }
  return r;
}

/** 把文字編成交錯排列好的碼字（資料＋錯誤修正），並決定要用哪個版本 */
function encodeCodewords(text) {
  const bytes = [...new TextEncoder().encode(text)];
  let version = 0;
  let capacity = 0;
  for (let v = 1; v <= 10; v++) {
    const cap = ECC_M[v][1].reduce((s, [count, len]) => s + count * len, 0);
    const countBits = v < 10 ? 8 : 16;
    if (4 + countBits + bytes.length * 8 <= cap * 8) { version = v; capacity = cap; break; }
  }
  if (!version) throw new Error(`QR 碼內容太長（${bytes.length} 位元組），超過版本 10 的容量`);

  // 位元串：模式 0100（位元組）→ 字數 → 資料 → 結束碼 → 補齊整數位元組 → 填充碼
  const bits = [];
  const push = (value, len) => { for (let i = len - 1; i >= 0; i--) bits.push((value >>> i) & 1); };
  push(0b0100, 4);
  push(bytes.length, version < 10 ? 8 : 16);
  for (const b of bytes) push(b, 8);
  push(0, Math.min(4, capacity * 8 - bits.length));
  while (bits.length % 8) bits.push(0);
  const data = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));
  for (let pad = 0xec; data.length < capacity; pad ^= 0xec ^ 0x11) data.push(pad);

  // 切成區塊、各自算錯誤修正碼，再交錯排列
  const [ecLen, groups] = ECC_M[version];
  const blocks = [];
  let k = 0;
  for (const [count, len] of groups) {
    for (let i = 0; i < count; i++) {
      const d = data.slice(k, k + len);
      k += len;
      blocks.push({ d, e: rsRemainder(d, ecLen) });
    }
  }
  const out = [];
  const maxLen = Math.max(...blocks.map((b) => b.d.length));
  for (let i = 0; i < maxLen; i++) for (const b of blocks) if (i < b.d.length) out.push(b.d[i]);
  for (let i = 0; i < ecLen; i++) for (const b of blocks) out.push(b.e[i]);
  return { version, codewords: out };
}

/**
 * 產生 QR 碼的模組矩陣。回傳二維陣列，true 為深色。
 * 座標慣例：m[y][x]，y 是列（由上往下），x 是欄（由左往右）。
 */
export function qrMatrix(text) {
  const { version, codewords } = encodeCodewords(text);
  const size = version * 4 + 17;
  const m = Array.from({ length: size }, () => new Array(size).fill(false));
  const fn = Array.from({ length: size }, () => new Array(size).fill(false));   // 功能圖形，不放資料、不套遮罩
  const setFn = (x, y, dark) => { m[y][x] = dark; fn[y][x] = true; };

  // 定位線（第 6 列與第 6 欄的黑白交替）
  for (let i = 0; i < size; i++) { setFn(6, i, i % 2 === 0); setFn(i, 6, i % 2 === 0); }

  // 三個角落的定位圖形（含外圍一圈白邊）
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx, y = cy + dy;
        if (x < 0 || y < 0 || x >= size || y >= size) continue;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        setFn(x, y, dist !== 2 && dist !== 4);
      }
    }
  }

  // 對齊圖形（避開三個定位圖形所在的角落）
  const pos = ALIGN[version];
  const last = pos.length - 1;
  pos.forEach((cy, i) => pos.forEach((cx, j) => {
    if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) setFn(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
  }));

  // 格式資訊：等級 M 的代號是 00，後面接遮罩編號，再加 BCH 校驗碼
  const drawFormat = (mask) => {
    const data = (0b00 << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    const bit = (i) => ((bits >>> i) & 1) === 1;
    for (let i = 0; i <= 5; i++) setFn(8, i, bit(i));
    setFn(8, 7, bit(6));
    setFn(8, 8, bit(7));
    setFn(7, 8, bit(8));
    for (let i = 9; i < 15; i++) setFn(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) setFn(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) setFn(8, size - 15 + i, bit(i));
    setFn(8, size - 8, true);   // 固定的深色模組
  };
  drawFormat(0);   // 先佔位，選定遮罩後再重畫

  // 版本資訊（版本 7 以上才有）
  if (version >= 7) {
    let rem = version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const dark = ((bits >>> i) & 1) === 1;
      const a = size - 11 + (i % 3), b = Math.floor(i / 3);
      setFn(a, b, dark);
      setFn(b, a, dark);
    }
  }

  // 依「由右下往上、兩欄一組、之字形」的順序放入資料位元
  let bitIndex = 0;
  const totalBits = codewords.length * 8;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;   // 跳過垂直定位線
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!fn[y][x] && bitIndex < totalBits) {
          m[y][x] = ((codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1) === 1;
          bitIndex++;
        }
      }
    }
  }

  // 八種遮罩，挑「最不容易讓掃描器誤判」的那一種
  const MASKS = [
    (x, y) => (x + y) % 2 === 0,
    (x, y) => y % 2 === 0,
    (x) => x % 3 === 0,
    (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
    (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
    (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
    (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
  ];
  const applyMask = (k) => {
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && MASKS[k](x, y)) m[y][x] = !m[y][x];
  };

  let best = 0;
  let bestScore = Infinity;
  for (let k = 0; k < 8; k++) {
    applyMask(k);
    drawFormat(k);
    const score = penalty(m);
    if (score < bestScore) { bestScore = score; best = k; }
    applyMask(k);   // 再套一次等於還原
  }
  applyMask(best);
  drawFormat(best);
  return m;
}

/** 遮罩評分（分數越低越好）：連續同色、2×2 色塊、類似定位圖形的排列、黑白比例 */
function penalty(m) {
  const size = m.length;
  let score = 0;
  const lines = [];
  for (let i = 0; i < size; i++) {
    lines.push(m[i]);
    lines.push(m.map((row) => row[i]));
  }
  const finderLike = [true, false, true, true, true, false, true];
  for (const line of lines) {
    let run = 1;
    for (let i = 1; i <= size; i++) {
      if (i < size && line[i] === line[i - 1]) run++;
      else { if (run >= 5) score += 3 + (run - 5); run = 1; }
    }
    for (let i = 0; i + 7 <= size; i++) {
      if (!finderLike.every((v, j) => line[i + j] === v)) continue;
      const lightBefore = i >= 4 && [1, 2, 3, 4].every((d) => !line[i - d]);
      const lightAfter = i + 11 <= size && [7, 8, 9, 10].every((d) => !line[i + d]);
      if (lightBefore || lightAfter) score += 40;
    }
  }
  let dark = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (m[y][x]) dark++;
      if (x < size - 1 && y < size - 1) {
        const c = m[y][x];
        if (m[y][x + 1] === c && m[y + 1][x] === c && m[y + 1][x + 1] === c) score += 3;
      }
    }
  }
  const total = size * size;
  score += 10 * Math.floor(Math.abs(dark * 20 - total * 10) / total);
  return score;
}

/**
 * 輸出成 SVG 字串，直接嵌進 HTML。
 * 外圍保留 4 格白邊（規範要求的「靜區」，少了某些掃描器會讀不到）。
 */
export function qrSvg(text, { color = '#000', background = '#fff', quiet = 4 } = {}) {
  const m = qrMatrix(text);
  const n = m.length + quiet * 2;
  let d = '';
  m.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (!row[x]) continue;
      let run = 1;
      while (x + run < row.length && row[x + run]) run++;   // 同一列連續的深色格併成一段，檔案比較小
      d += `M${x + quiet} ${y + quiet}h${run}v1h-${run}z`;
      x += run - 1;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" aria-hidden="true">`
    + `<rect width="${n}" height="${n}" fill="${background}"/><path d="${d}" fill="${color}"/></svg>`;
}
