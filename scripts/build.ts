import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { OUT_DIR } from './lib/config.ts'
import { copyDir } from './lib/utils.ts'
import { getSortedPosts } from './lib/posts.ts'
import { buildRss } from './lib/rss.ts'
import { buildIndex } from './pages/index.ts'
import { buildBlogIndex, buildTagPages, buildAllPosts } from './pages/blog.ts'
import { buildBio } from './pages/bio.ts'
import { buildPolicy } from './pages/policy.ts'

async function main(): Promise<void> {
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  copyDir(path.join(process.cwd(), 'public'), OUT_DIR)

  const posts = getSortedPosts()

  buildIndex()
  buildBlogIndex(posts)
  buildTagPages(posts)
  buildBio()
  buildPolicy()
  buildRss(posts)
  await buildAllPosts(posts)

  execSync('npx tailwindcss -i ./styles/global.css -o ./dist/styles.css', { stdio: 'inherit' })

  console.log(`Built ${posts.length} posts → dist/`)
}

main().catch(err => { console.error(err); process.exit(1) })
