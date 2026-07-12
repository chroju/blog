---
title: "ブログをNext.js依存から脱却させ独自ビルド方式にした"
date: "2026-07-12T11:59:08+0900"
tags: ["blog", "ai"]
---

[ブログを Next.js + Vercel に移行した - chroju.dev](https://chroju.dev/blog/blog_with_next_js_vercel) 以来、5年半ぶりにブログの構成を全面刷新した。

当時、流行りに乗ってNext.jsを選択したものの、ブログのSSGとして使うには明らかに過剰であり、どこかで脱却したいなとは1〜2年ぐらい考えつつ、そこまで困っているわけでもないため腰が重くなっていたのだが、 [Claude Fable 5の使用量が急にリセットされて](https://x.com/claudedevs/status/2075279141352706215?s=46&t=x6fN6QShgg_BNwMyDl5yZw) ちょっと持て余してしまったので、雑に投げてみたところ1時間もせずに改修できてしまった。3月ぐらいに別のモデルへ依頼したときは結構労力がかかりそうだったのだが、今回は速かったのはモデルの進歩なのか。

何か他のフレームワークを使ってもよかったのだが、単にMarkdownからHTMLを生成したいだけであれば大仰なものを使う必要もないし、ビルド方式は独自のものとしている。昨今のサプライチェーンリスクを鑑みても、依存するパッケージはあまり多くないほうがいいのかなという感覚が強くなっている。手ですべてのコードを書いていた頃なら迷わずフレームワークを使ったのだろうが、AIに任せられるのならスクラッチもありかな、という形に意識が変わってきた。

機能面についても多少細々とした変更を加えている。ひとつ大きなものとしては、AI対応みたいなところを少しだけ考えて、 https://chroju.dev/llms.txt を配置した。各ブログ記事については、URL末尾に `.md` を付与するとRaw Markdownにアクセスできるようにして、 `llms.txt` にもMarkdownのほうへのリンクを掲載している。別にGEO的なことを真剣に考えているわけでもないし、llms.txtは現状標準化された仕様ではないので期待値も正直あまり高くはなく、半ば遊びのような感覚ではある。

他で施したものとしてはこんなところ。

- ダークモード対応
- `h` 要素を使っている記事にはTOCと見出しへのanchorを追加
- OG image生成で [vercel/og-image](https://github.com/vercel/og-image) という古いものを使っていたので、 [vercel/satori](https://github.com/vercel/satori) へ移管
  - satoriはSVGを生成するので、SVGからPNGへの変換には [linebender/resvg](https://github.com/linebender/resvg) を使っている
- コードブロックにCopyボタンを追加
  - コードハイライトは [prism.js](https://prismjs.com/) から [Shiki](https://shiki.style/) へ移行
- PWA対応は廃止
- ホスト先をVercelからCloudflare Workersへ変更

デザインについてもAnthropicの [frontend-design](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) と対話を繰り返して、従来のものを踏襲しつつもブラッシュアップした。スマホでもPCでも、以前より読みやすくなったと自負しており、だいぶ満足している。

