import { unified, type Processor, type Plugin } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import type { Root as HastRoot, Element, ElementContent } from 'hast'
import remarkLinkCard from './linkcard.ts'

export interface Heading {
  depth: number
  id: string
  text: string
}

export interface RenderedMarkdown {
  html: string
  headings: Heading[]
}

function textOf(node: ElementContent): string {
  if (node.type === 'text') return node.value
  const children = (node as Element).children
  return children ? children.map(textOf).join('') : ''
}

// h2/h3 に「#」アンカーリンクを付け、TOC用に見出し一覧を vfile.data へ収集する。
// id は rehype-slug（GitHub互換、見出しテキスト由来）が付与済み。
const headingAnchors: Plugin<[], HastRoot> = () => {
  return (tree, file) => {
    const headings: Heading[] = []
    visit(tree, 'element', (node: Element) => {
      if (!/^h[23]$/.test(node.tagName)) return
      const id = node.properties?.id
      if (typeof id !== 'string') return
      const depth = Number(node.tagName[1])
      headings.push({ depth, id, text: node.children.map(textOf).join('') })
      // Markdown準拠: 見出しレベルに応じた個数の#を先頭に付ける（## / ###）
      node.children.unshift({
        type: 'element',
        tagName: 'a',
        properties: { className: ['heading-anchor'], href: `#${id}`, ariaLabel: 'この見出しへのリンク' },
        children: [{ type: 'text', value: '#'.repeat(depth) }],
      })
    })
    ;(file.data as { headings?: Heading[] }).headings = headings
  }
}

let processor: Processor | null = null

function getProcessor() {
  if (!processor) {
    processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkLinkCard)
      // allowDangerousHtml + rehype-raw で記事中の生HTML（画像埋め込み等）を保持する
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSlug)
      .use(headingAnchors)
      .use(rehypeShiki, {
        themes: { light: 'github-light', dark: 'github-dark-dimmed' },
        defaultColor: false,
        fallbackLanguage: 'text',
        transformers: [
          {
            // コピー用JSと言語ラベル表示のために言語名を残す
            pre(node: { properties: Record<string, unknown> }) {
              const lang = (this as unknown as { options: { lang?: string } }).options.lang
              if (lang && lang !== 'text') node.properties['data-lang'] = lang
            },
          },
        ],
      })
      .use(rehypeStringify) as unknown as Processor
  }
  return processor
}

export async function renderMarkdown(markdown: string): Promise<RenderedMarkdown> {
  const file = await getProcessor().process(markdown)
  return {
    html: String(file),
    headings: ((file.data as { headings?: Heading[] }).headings ?? []),
  }
}
