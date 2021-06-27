---
title: "このブログの Lighthouse スコアをほぼ満点にした"
date: "2021-06-28T09:19:25+0900"
tags: ["web"]
---

[Lighthouse](https://github.com/GoogleChrome/lighthouse) は Google が公開している、ウェブサイトの監査ツールである。 Performance 、 Accesibility 、 Best Practices 、 SEO 、 PWA という5つの項目に関して監査を実施し、 PWA 以外の4項目については100点満点でのスコアリングを行い、 PWA については機能的な対応状況を確認してくれる。 [Chrome Extension](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=ja) と Node による CLI が提供されており、また Chromium ベースのブラウザであれば、 Devtools 内で実行もできる。なお、現時点においては PWA 機能に重点を置いた監査内容になっている。

今回、このブログの Lighthouse スコア改善に取り組んでみた。背景としては、 [ブログを Next.js + Vercel に移行した - the world as code](https://chroju.dev/blog/blog_with_next_js_vercel) のときに書いた以下の一節がそのまま当てはまる。

> 僕はインフラエンジニア出身の SRE で、経歴を辿るとサーバーや RDB のチューニングでパフォーマンスを維持することには注力してきたけど、フロント側の知識はほぼまったくと言っていいほどない。でも SRE がサイトの信頼性、具体的にはレスポンスの最適化に責務を負っているのに、フロントを理解していないというのはダメだろうと。静的なものを可能な限り CDN に置く時代において、サーバーのインフラ的なチューニングだけの知識だけでは心許なくなった。

ということで、ウェブアプリの品質とはどのような点が見られるのか、理解を深めることを目的としている。

## Before / After

最初にスコアの Before / After を貼っておく。対象は先にも挙げた [ブログを Next.js + Vercel に移行した - the world as code](https://chroju.dev/blog/blog_with_next_js_vercel) のページである。

![score before](/images/2021-06-27/score_before.png)
![score after](/images/2021-06-27/score_after.png)

いずれのスコアも大幅に改善し、ほぼ満点の状態まで引き上げることができた。 Lighthouse の評価ポイントは、 Google が公開している https://web.dev/ にまとめられており、今回のスコア改善にあたっても、主にここを参考として取り組んだ。

ちなみに Best Practices がもともと100点を獲得しているが、 Next.js + Vercel という新しめのフレームワークとデプロイ環境を用いていることもあり、何も考えずともある程度自動的にチューンナップされている面はあるのだと思う。

以下、改善した点を順に見て行く。

## Performance

パフォーマンスでは、主に表示速度の面でのメトリクス6種類が指標になる。表示速度というと、インフラ側の人間としては単に response time という言葉で括って考えがちなのだが、最初に DOM element が表示されるまでの時間を示した First Contentful Paint (FCP) 、 Largest Contentful Paint (LCP) など、実際にページを表示するクライアントの立場から見れば、複数の観点で速度評価が可能なのだということを知った。

### 画像の改善

![score before](/images/2021-06-27/performance_image.png)

Performance で減点材料となったものの1つが画像だった。容量が大きすぎる、あるいは次世代フォーマットである WebP を使うべきだといったものだ。たかがアバター画像で 450KiB は確かに重いかもしれない。

シンプルに WebP 化で改善を図った。 macOS であれば `brew install webp` でインストールされる `cwebp` コマンドで簡単に変換ができる。結果、これだけで効果は抜群だった。

```bash
❯ ls -l profile.*
-rw-r--r--@ 1 chroju  staff  7181  1 17 19:03 profile.jpg
-rw-r--r--  1 chroju  staff   754  6 25 19:47 profile.webp
```

WebP は Safari (iOS/macOS) が2020年になってから標準サポートするなど、まだまだ新しいフォーマットであり、商用のウェブサイトであればきちんと png/jpeg と表示を分けたり、手動変換ではなく [ImageFlux](https://www.sakura.ad.jp/services/imageflux/) などによる自動変換を検討するべきだろう。今回はあくまで個人サイトなので、妥協した方式を採っている。

ちなみに、このブログの画像はアバター以外は基本的に [Gyazo](https://gyazo.com) 上のものをリンクしており、これについては現状もそのままになっている。当然ながら自ドメイン上にホストしたほうが表示は速くなるので、 Gyazo リンクをやめることも検討している（このエントリーでは試験的にやめてみている）。

### Reduce initial server response time

![initial server response time](/images/2021-06-27/performance_initial_response.png)

TTFB (Time to first byte) の改善を促されている。これについてはインフラ面の改善も視野に入ってくるが、このブログではフルマネージドな Vercel を使っているので、その点での改善は望めない。また、無駄に SSR を使っている箇所があれば SSG を使えないか検討するという手もあるが、このブログは全面的に SSG で組んでいるので、その点も問題はなかった。従って打つ手が難しかったのが正直なところ。

ひとつ気になった点として、レスポンスがキャッシュからのものか否かを Lighthouse は考慮していなさそうだという点があった。というのも、一度ページにアクセスして CDN キャッシュを作ってから再度 Lighthouse に掛けると、このスコアが改善したからだ。 response time の改善においては、キャッシュ活用も含めて検討したほうがいいかもしれない。

### Reduce JavaScript execution time

![JavaScript execution time](/images/2021-06-27/performance_js.png)

JavaScript 実行時間の改善も促された。最も実行時間が長いスクリプトを確認したところ、 [FortAwesome/react-fontawesome](https://github.com/FortAwesome/react-fontawesome) であった。使っているアイコンだけではなく、横着してすべてのアイコンを読み込むような設定を書いていたので、これは明確に自分が悪い。これだけで JS の総実行時間が 1.5s -> 0.6s に改善した。

```diff
- import { fab } from '@fortawesome/free-brands-svg-icons'
- import { fas } from '@fortawesome/free-solid-svg-icons'
+ import { faGithub, faKeybase, faSpeakerDeck, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
+ import { faRssSquare, faTags } from '@fortawesome/free-solid-svg-icons'
```

## Accessibility

### Contrast

![Contrast](/images/2021-06-27/accessibility_contrast.png)

Accessibility の点では、色のコントラストで警告が出ていた。エントリーの日付表記の部分はフォントカラーを薄いグレーにしていたのだが、これが背景とのコントラストが十分ではなく、視認性が悪いとのことだった。

![Contrast Devtools](/images/2021-06-27/accessibility_devtools.png)

色のコントラストは Devtools の「Elements」タブで color をクリックすることで、適切な状態を確認できる。適切なコントラストは [WCAG で規定されており](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)、最低でも 4.5:1 を確保したレベル AA 、より望ましくは 7:1 のレベル AAA を満たすべきとされている。上図、グラデーション状態のカラーパレットに波線が引かれているが、このうち上のラインがレベル AA で、下のラインがレベル AAA に当たる。今回はこれを用いてレベル AAA を満たすように文字色を改善した。

### Others

その他、軽微なところで以下の2点を改善している。

* `<html>` に lang 属性が指定されていなかった
* Font Awesome によるリンクアイコンに text の設定がなく、スクリーンリーダーなどに対して Not friendly な状態だった

## Best Practices

ここは当初より100点だったので、改善したポイントはない。主に以下のようなポイントがチェックされる。

* HTTPS を利用している
* ロード時に位置情報取得や通知の許可を求めていない
* パスワードフィールドへの「ペースト」を禁止していない
* フロントエンド JavaScript に既知の脆弱性が存在しない
* 非推奨の機能（[AppCache](https://web.dev/appcache-removal/) や廃止された API）を用いていない
* charset や doctype が正しく宣言されている

## SEO

### Tap targets are not sized appropriately

![SEO tap targets](/images/2021-06-27/seo_tap_targets.png)

タップ可能な要素が小さすぎるという警告。スマートフォンで表示した際の誤タップを防ぐべく、最小でも 48x48px を保つようにとされている。

具体的には、ページ最下部に設置した各種ソーシャルサービスのアイコンであり、必要とされるサイズを確保できるように CSS を書き換えた。

## PWA

PWA に関しては、ここまで見てきた項目のように採点の対象というわけではなく、 PWA として動作するのに必要な設定が成されているかどうかをチェックし、その結果をアイコンで表示するというものになっている。

せっかくなので、今回 PWA 化も施した。モバイルでもデスクトップでも、対応するブラウザで開けばインストールが可能になっている。本当にただ PWA としての要件を満たす状態にしてみた、というだけなので、インストールしたところで更新通知を飛ばしたりとかはしない。オフラインの際に、専用のページへフォールバックさせる、ぐらいのことはしてみている。

![PWA](/images/2021-06-27/pwa.jpg)

Next.js における PWA 化は [shadowwalker/next-pwa](https://github.com/shadowwalker/next-pwa) を使うのが簡単で、 README 内で `Zero Config` を謳っているが、実際のところ2、3ファイルを少し書き換えるだけで PWA 化できるようになっている。

## Impression

少し意外、と言ったらよろしくないかもしれないが、 監査項目において過剰に Google Friendly にするべきだ、というようなものはなく、中立的に Web サイト（Web アプリ）としてクリアしておくべき条件のリストになっていると感じた。例えば AMP に関するチェックが入ってもおかしくはないように思うが、2021年現在においてはすでに下火になりつつあることもあってか、そういった項目はなかった（このあたりの経緯は、折しも昨日 [本サイトの AMP 提供の停止とここまでの振り返り | blog.jxck.io](https://blog.jxck.io/entries/2021-06-26/amp-tone-down.html) というエントリーが出たのでちょうど読んだところだったりする）。もっとも、そうは言ってもあくまで Google の採点である、ということには留意が必要かもしれない。 Performance の項で測られている項目も、 Google が掲げる [Core Web Vitals](https://web.dev/vitals/#core-web-vitals) との重複が大きい。

とはいえ Lighthouse が「より良い Web サイト」を作る上で1つの指標となるのは確かだし、ここに書いた修正項目は、いずれも納得感を持って修正を加えることができた。インフラよりの技術スタックを持っていると、この中で日頃気にしているのは Performance と Best Practices の一部項目ぐらいがメインだった。しかし UX という点では単に Origin からのレスポンスを早く返すだけではなく、 JS の読み込みといった部分も考慮するべきだし、画像も数が増えてくればより優れた配信方式を検討する必要が出てくる。こういった学びは今後に活かしていきたい。
