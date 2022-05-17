---
title: "Tailwind CSSでブログのデザインを刷新した"
date: "2022-05-17T19:21:28+0900"
tags: ["css", "design", "tailwindcss"]
---

このブログのCSSは、最初に [Next.jsのチュートリアル](https://nextjs.org/learn/basics/create-nextjs-app) で書いたものを継ぎ足しながら使ってきており、どこかのタイミングでちゃんと書き直したいなと思っていたので、この度 [Tailwind CSS](https://tailwindcss.com/) に差し替えて全部書き直した。

## Tailwind CSS

CSSに関しては基本的な文法は知っているという程度だし、デザインの知識も修めていない門外漢なので、Bootstrapのような楽にそこそこいい感じにできるフレームワークを探したところ、Tailwindが見つかったというところ。そのためTailwindが良いのか悪いのかという判断もできる立場にはないが、とりあえず形にはなったし、使いやすかったんだろうなと思っている。

Tailwindの一番の特徴は [Utility-First](https://tailwindcss.com/docs/utility-first) という考え方にあるそうだ。例えば `blog-subtitle` のようなclassをつくり、これに対してmarginやらfont-sizeやらという各種の要素をくっつけて、同じclass名であればサイト内どこでも同じデザインになるようにする、というのが定番のパターンだし、僕の認識していたCSSの使い方。一方でUtility-Firstは文字を大きくする `text-xl` や、パディングを6pxにする `p-6` といったclassが最初から定義してあって、これを組み合わせて各HTMLタグにclassとして振ることにより、欲しいデザインを作って行く方式。

CSSはすでに定義済みで、そこから必要なclass名を引っ張ってきてHTMLに書き入れるだけなので、HTMLだけを見ていれば良いという点では、デザインに慣れていない人間にはとても楽だった。ドロップシャドウも `shadow-hoge` のように書くだけで簡単にかけられるし、CSSテクニックを知らなくてもそこそこいい感じに出来る。

ただ、個々の要素をどう組み合わせるかは結局センス頼みになるので、これだけ使っていれば必ず良い感じになるってわけでもないな、とも思う。また、Utility-Firstだと結局inlineでCSSを書くのと似た感覚になり、この規模のサイトなら良いけど、大規模になってくるとメンテナンス大変なんじゃないかなーという感想を抱いた。 [Tailwind CSSのメリットとデメリット | コリス](https://coliss.com/articles/build-websites/operation/css/a-look-at-tailwind-css.html) とか [Tailwind CSSが私には合わなかった理由 | コリス](https://coliss.com/articles/build-websites/operation/css/why-tailwind-css-is-not-for-me.html) を読んでなるほどなーと思ったりしていた。

いい感じのデザインにするために [Tailblocks — Ready-to-use Tailwind CSS blocks](https://tailblocks.cc/) も活用した。サンプルコードが豊富にあり、いくつか参考にさせてもらった。

## before / after

<a href="https://gyazo.com/93f5bab1325a0c02b01f55ed7a18db4d"><img src="https://i.gyazo.com/93f5bab1325a0c02b01f55ed7a18db4d.jpg" alt="Image from Gyazo" width="500"/></a>

<a href="https://gyazo.com/fc5f8137a4c6c46beaed948bbf3d5315"><img src="https://i.gyazo.com/fc5f8137a4c6c46beaed948bbf3d5315.png" alt="Image from Gyazo" width="500"/></a>

改めてbefore / afterを並べると、結構間の抜けたデザインだったのがシュッとした感じになったなぁ、と思う。文字サイズが小さくなったのでリーダビリティが下がったかもしれないので、妥協点を探しながらまた徐々に改善したい。

Tailwindを使ってレスポンシブも簡単にできたのでこれも良かった。

<a href="https://gyazo.com/135c6fca92c3472713f22c3a3af3f27d"><img src="https://i.gyazo.com/135c6fca92c3472713f22c3a3af3f27d.gif" alt="Image from Gyazo" width="500"/></a>

不具合などまだまだある気がするので、何か見つけたらプルリクやissueを投げていただければ対応します。
