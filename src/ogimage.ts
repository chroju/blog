import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { site } from './config.ts'

// OGP画像（1200x630）をビルド時に生成する。
// タイトル内容でキャッシュ（.cache/og/）し、変更のない画像は再生成しない。

const WIDTH = 1200
const HEIGHT = 630
// デザインを変えたらこの値を上げてキャッシュを無効化する
const DESIGN_VERSION = 1

const cacheDir = path.join(process.cwd(), '.cache', 'og')

let fontData: Buffer | null = null

function loadFont(): Buffer {
  if (!fontData) {
    const fontPath = path.join(
      process.cwd(),
      'node_modules',
      '@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-700-normal.woff'
    )
    fontData = fs.readFileSync(fontPath)
  }
  return fontData
}

function fontSizeFor(title: string): number {
  const len = [...title].length
  if (len <= 20) return 72
  if (len <= 40) return 60
  if (len <= 70) return 48
  return 40
}

function el(type: string, style: Record<string, unknown>, children: unknown): unknown {
  return { type, props: { style, children } }
}

async function renderOgSvg(title: string): Promise<string> {
  const tree = el(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 80px',
      backgroundColor: '#15171a',
      backgroundImage: 'linear-gradient(135deg, #15171a 0%, #232830 100%)',
      color: '#e8eaed',
      fontFamily: 'Noto Sans JP',
    },
    [
      el(
        'div',
        {
          display: 'flex',
          fontSize: `${fontSizeFor(title)}px`,
          fontWeight: 700,
          lineHeight: 1.4,
          letterSpacing: '-0.01em',
          wordBreak: 'break-word',
          flexGrow: 1,
          alignItems: 'center',
        },
        title
      ),
      el(
        'div',
        {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '32px',
          color: '#9aa3ad',
        },
        [
          el('div', { display: 'flex' }, site.blogTitle),
          el('div', { display: 'flex' }, site.subTitle),
        ]
      ),
    ]
  )

  return satori(tree as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [{ name: 'Noto Sans JP', data: loadFont(), weight: 700, style: 'normal' }],
  })
}

export async function generateOgImage(title: string, outPath: string): Promise<void> {
  const key = crypto
    .createHash('sha1')
    .update(`v${DESIGN_VERSION}:${title}`)
    .digest('hex')
  const cachePath = path.join(cacheDir, `${key}.png`)

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  if (fs.existsSync(cachePath)) {
    fs.copyFileSync(cachePath, outPath)
    return
  }

  const svg = await renderOgSvg(title)
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng()
  fs.mkdirSync(cacheDir, { recursive: true })
  fs.writeFileSync(cachePath, png)
  fs.writeFileSync(outPath, png)
}
