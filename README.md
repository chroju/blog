Blog
====

https://chroju.dev

## Tech Stack

フレームワーク非依存の自作静的サイトジェネレーター（Node.js + TypeScript）。

- Node.js 24+（native TypeScript type stripping で `src/*.ts` を直接実行）
- Markdown 処理: unified / remark / rehype
  - シンタックスハイライト: Shiki（ビルド時、ライト/ダーク両テーマ）
  - リンクカード: 自作 remark プラグイン（`src/linkcard.ts`、OGP メタを `.cache/linkcards.json` に永続キャッシュ）
- OGP 画像: satori + resvg-js でビルド時に生成（`dist/og/*.png`）
- RSS: `rss` パッケージで全文入り `feed.xml` を生成
- CSS: 素の CSS + カスタムプロパティ（`styles/site.css`、`prefers-color-scheme` によるダークモード対応）
- ホスティング: Cloudflare Workers (static assets)

## Development

```bash
npm run dev
```

Opens at http://localhost:3000. `posts/`, `src/`, `styles/` の変更を監視して自動で再ビルドする（OGP 画像の生成はスキップされる）。

## Build

```bash
npm run build
```

`dist/` に静的サイト一式（HTML, feed.xml, OGP 画像）を出力する。

- パーマリンクを末尾スラッシュなしで維持するため、ページは `blog/{slug}.html` 形式のフラットなファイルで出力される（Cloudflare の `html_handling: drop-trailing-slash` と対応）
- リンクカードの OGP 情報は `.cache/linkcards.json` にキャッシュされ、新規 URL のみフェッチする。このファイルはコミットする
- OGP 画像は `.cache/og/` にキャッシュされる（gitignore 済み）

```bash
npm run preview  # ビルド済み dist/ を配信のみ（再ビルドなし）
```

## Writing a Post

```bash
make post title=YYYY-MM-DD-slug
```

This will:
1. Create a git branch named after the title
2. Generate `posts/<title>.md` with front matter scaffolding
3. Open the file in VS Code
4. Start the dev server and open the preview in a browser

### Front matter

```yaml
---
title: "Post title"
date: "2006-01-02T15:04:05+09:00"
tags: []
---
```

`draft: true` を付けると一覧・タグ・RSS から除外される（ページ自体は生成される）。

### Lint

textlint is configured for Japanese writing style rules (`.textlintrc`).

```bash
npx textlint posts/<file>.md
```

## Deploy

main ブランチへの push で GitHub Actions が `npm run build` → `wrangler deploy` を実行し、Cloudflare Workers (static assets) へデプロイする。

## Dependency Updates

Renovate runs every Friday and auto-merges minor/patch updates and devDependency updates.
