---
title: 'Two Forms of Pre-rendering'
date: '2020-01-01'
---

Next.js has two forms of pre-rendering: **Static Generation** and **Server-side Rendering**. The difference is in **when** it generates the HTML for a page.

- **Static Generation** is the pre-rendering method that generates the HTML at **build time**. The pre-rendered HTML is then _reused_ on each request.
- **Server-side Rendering** is the pre-rendering method that generates the HTML on **each request**.

Importantly, Next.js lets you **choose** which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">やっていってる <a href="https://t.co/FLHj1HkvlE">https://t.co/FLHj1HkvlE</a> <a href="https://t.co/XHKzIm1rip">pic.twitter.com/XHKzIm1rip</a></p>&mdash; chroju (@chroju) <a href="https://twitter.com/chroju/status/1343369676932395008?ref_src=twsrc%5Etfw">December 28, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<a href="https://gyazo.com/f3e3f20c100487703ca4ee606c441815"><img src="https://i.gyazo.com/f3e3f20c100487703ca4ee606c441815.jpg" alt="Image from Gyazo" width="2917"/></a>
