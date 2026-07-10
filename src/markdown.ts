import { unified, type Processor } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import remarkLinkCard from './linkcard.ts'

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
      .use(rehypeShiki, {
        themes: { light: 'github-light', dark: 'github-dark-dimmed' },
        defaultColor: false,
        fallbackLanguage: 'text',
      })
      .use(rehypeStringify) as unknown as Processor
  }
  return processor
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await getProcessor().process(markdown)
  return String(file)
}
