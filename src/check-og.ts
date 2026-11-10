import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { renderOgImage } from './ogimage.ts'

// OGP画像のスナップショット検証。固定のタイトルで描画し、コミット済みの基準画像と比較する。
// satori等の更新でレイアウトが崩れたことを検知するためにCIで実行する。
// デザインを意図して変えたときは `node src/check-og.ts --update` で基準画像を更新する。

const snapshotDir = path.join(process.cwd(), 'src', 'og-snapshots')

const cases: { name: string; title: string; date?: string }[] = [
  { name: 'short', title: 'Short Title', date: '2026-01-01' },
  { name: 'wrap', title: 'メアドやクレカ番号を「使い捨てる」生活', date: '2026-11-09' },
  { name: 'long', title: '未読も、読み終えた記事も「管理」しない、最近のRSS購読とその運用についての長いタイトル', date: '2026-10-03' },
  { name: 'no-date', title: 'Tags - chroju.dev/blog' },
]

// 各チャンネルの差がこの値を超えたピクセルを「異なる」とみなす（環境差によるアンチエイリアスの揺れを許容する）
const CHANNEL_TOLERANCE = 32
// 異なるピクセルがこの割合を超えたら失敗とする
const MAX_DIFF_RATIO = 0.001

// resvgが出力するPNG（8bit RGBA・非インターレース）だけを想定した最小限のデコーダー
function decodePng(buf: Buffer): { width: number; height: number; pixels: Buffer } {
  let offset = 8
  let width = 0
  let height = 0
  const idat: Buffer[] = []
  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset)
    const type = buf.toString('ascii', offset + 4, offset + 8)
    const data = buf.subarray(offset + 8, offset + 8 + length)
    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      if (data[8] !== 8 || data[9] !== 6 || data[12] !== 0) {
        throw new Error('unsupported PNG format (expected 8-bit RGBA, non-interlaced)')
      }
    } else if (type === 'IDAT') {
      idat.push(data)
    }
    offset += 12 + length
  }

  const raw = zlib.inflateSync(Buffer.concat(idat))
  const bpp = 4
  const stride = width * bpp
  const pixels = Buffer.alloc(stride * height)
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]
    const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1))
    const row = pixels.subarray(y * stride, (y + 1) * stride)
    const prev = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride)
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? row[x - bpp] : 0
      const b = prev[x]
      const c = x >= bpp ? prev[x - bpp] : 0
      let v: number
      switch (filter) {
        case 0: v = 0; break
        case 1: v = a; break
        case 2: v = b; break
        case 3: v = (a + b) >> 1; break
        case 4: {
          const p = a + b - c
          const pa = Math.abs(p - a)
          const pb = Math.abs(p - b)
          const pc = Math.abs(p - c)
          v = pa <= pb && pa <= pc ? a : pb <= pc ? b : c
          break
        }
        default: throw new Error(`unsupported PNG filter: ${filter}`)
      }
      row[x] = (src[x] + v) & 0xff
    }
  }
  return { width, height, pixels }
}

const update = process.argv.includes('--update')
const errors: string[] = []

for (const c of cases) {
  const image = await renderOgImage(c.title, c.date)
  const snapshotPath = path.join(snapshotDir, `${c.name}.png`)

  if (update) {
    fs.mkdirSync(snapshotDir, { recursive: true })
    fs.writeFileSync(snapshotPath, image.asPng())
    console.log(`updated: ${path.relative(process.cwd(), snapshotPath)}`)
    continue
  }

  if (!fs.existsSync(snapshotPath)) {
    errors.push(`${c.name}: snapshot not found (run with --update)`)
    continue
  }

  const expected = decodePng(fs.readFileSync(snapshotPath))
  if (expected.width !== image.width || expected.height !== image.height) {
    errors.push(`${c.name}: size mismatch ${image.width}x${image.height} (expected ${expected.width}x${expected.height})`)
    continue
  }

  const actual = image.pixels
  let diff = 0
  for (let i = 0; i < actual.length; i += 4) {
    for (let ch = 0; ch < 4; ch++) {
      if (Math.abs(actual[i + ch] - expected.pixels[i + ch]) > CHANNEL_TOLERANCE) {
        diff++
        break
      }
    }
  }
  const ratio = diff / (image.width * image.height)
  if (ratio > MAX_DIFF_RATIO) {
    const actualPath = path.join(snapshotDir, `${c.name}.actual.png`)
    fs.writeFileSync(actualPath, image.asPng())
    errors.push(`${c.name}: ${(ratio * 100).toFixed(2)}% of pixels differ (written to ${path.relative(process.cwd(), actualPath)})`)
  }
}

if (errors.length > 0) {
  console.error(`OG image snapshot check failed (${errors.length}):`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
if (!update) console.log(`OG image snapshot check passed (${cases.length} cases)`)
