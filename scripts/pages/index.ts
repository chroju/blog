import { SITE_URL } from '../lib/config.ts'
import { baseLayout } from '../lib/template.ts'
import { write } from '../lib/utils.ts'

export function buildIndex(): void {
  const out = baseLayout({
    title: 'chroju.dev',
    siteTitle: 'chroju.dev',
    ogImage: 'https://og-image.chroju.dev/chroju.dev.png?theme=dark&md=0&fontSize=75px',
    ogUrl: SITE_URL,
    footer: false,
    body: `
<article>
  <ul>
    <li class="list-none my-2"><a href="/blog" class="text-2xl font-extrabold">/blog</a></li>
    <li class="list-none my-2"><a href="/bio" class="text-2xl font-extrabold">/bio</a></li>
    <li class="list-none my-2"><a href="/policy" class="text-2xl font-extrabold">/policy</a></li>
  </ul>
</article>`,
  })
  write('index.html', out)
}
