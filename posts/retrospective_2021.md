---
title: "Retrospective 2021"
date: "2021-12-31T15:28:34+0900"
tags: ["retrospective"]
---

振り返りも7年目。過去の振り返りは [#retrospective](https://chroju.dev/blog/tags/retrospective) から。

## 定量評価

<a href="https://gyazo.com/b5ef90c7d4e80eb8127d61dc2f6d5e6a"><img src="https://i.gyazo.com/b5ef90c7d4e80eb8127d61dc2f6d5e6a.png" alt="Image from Gyazo" width="600"/></a>

* ブログ : 25記事（昨年比 +2）
* GitHub Contributions : 445 (-21)
* 書籍 : 49冊（+12）

毎年定量評価としてこのあたりの数値を見ているけど、別に年間通じて追っているわけでもないし、あんまり意味がない気がしてきた。とりあえず今年もまとめてみたけど、まぁそんなにやっぱり変わってないな、というところ。書籍の数は [ブクログの読書記録](https://booklog.jp/users/chroju/stats) から引っ張ったが、技術書以外も入っているし、逆に雑誌や電子書籍は含まれないのでザックリ。こちらも毎年40〜50冊ぐらいという肌感がある。

ということで、来年からはこれは見ないかもなぁ、と。 GitHub へコントリビュートすることも、ブログを書くこともそこそこ習慣化したので。いやでも、それが失われないことを確認するのがいいのかもなぁ。健康診断みたいなものかも。正常であることを確認するルーチン。

## 定性評価

### 技術領域

年始頃にこのブログを Next.js で作り直したとき、 [JavaScript Primer](https://jsprimer.net/) を読んで JS について学んだりしていた。

また、 Terraform のワークフロー自動化してくれる Atlantis を初めて使って好きになり、 Terraform Advent Calendar にも [Terraform を自動実行したいなら Atlantis - Qiita](https://qiita.com/chroju/items/f77e8391d6ef7c7cb59a) という記事を上げた。

今年、新たに手を出した技術領域はそれぐらい。仕事では Kubernetes にずっと取り組んでいるが、ある程度使用技術が固定化されてきたので、それほど今年1年のなかで新たな何かに手を出した、というものはなかった。 Kubernetes と AWS と Terraform が軸、という感じになっている。

何冊か本は読んでいて、このあたり面白かった。

https://www.amazon.co.jp/-/en/Heather-Adkins/dp/1492083127

https://www.amazon.co.jp/-/en/%E7%94%B0%E4%B8%AD-%E7%A5%A5%E5%B9%B3/dp/4297119250

### SRE / DevOps

SRE としては、常に「何をするべきか」を考えながらずっと従事してきていて、2021年はそれなりの答えがまとまってきた。が、かなり業務内容に沿った話になるので、ここでは書かずに [会社のテックブログ](https://note.com/globis_engineers/) に書けたらな、と思っている。

SRE としての活動を定量的に計測、評価していくことへの関心が今は高くて、本としてはこのへんを読んでいた。

https://www.hanmoto.com/bd/isbn/4295004901

https://www.amazon.co.jp/-/en/Alex-Hidalgo/dp/1492076813

### ソフトスキル

いわゆるリーダースキルとか。

2020年にチームリーダーの立場になり、今年も引き続きこの分野は暗中模索していた。昨年の振り返りで、インプットがこちらに偏りすぎたので2021年は技術のほうへ傾けたいと書いていたが、結局今年もこちらのインプットが多くなった。そのわりに考えをまとめてブログなどに書けていないのは反省点。記事としては [思考のリファクタリングとしてのコーチングの技術 - the world as code](https://chroju.dev/blog/what_is_coaching) ぐらい。

先述したように技術的なチャレンジが今年ちょっと控えめになってしまったのもあるので、一度きちんと考えをまとめてアウトプットして、来年は本当に技術側に傾けたい。将来的にマネジメント方向なのか、テック方面でスペシャリスト方向なのか、という二者択一というより、 SRE という職種は双方バランスよくおさめる必要があると思っている。

あと宣伝ではないんだけど、今勤めている会社が社会人教育を事業としているので、ソフトスキル方面の学習リソースが社内に豊富にあって、助かっている。逆に言えば、それに「あてられて」こちらを重視している向きもなくはない。

### プライベート

取り立てて書くことはなく、2020年の延長戦のような1年だった、という感覚が強い。旅行も去年と同じで1回だけ、あとは気晴らしで近隣のホテルに泊まるぐらいだし、映画、ライブ、美術館博物館のような外出による娯楽も相変わらず少ないままとなっている。健康面も特に問題ない感じ。

来年はさすがに意識的な変化をつけていかないと、いろいろな面で保守的になってしまいそうでこわい。

## やってよかったこと

[今年買ってよかったものと、今年のサブスク 2021 - the world as code](https://chroju.dev/blog/best_buy_subscriptions_2021) に書いた、珈琲豆を手で挽くのと、 nosh は取り入れてよかったです。

### Pixela による習慣化

GitHub の芝のようなビジュアルデータを簡単に作れる API サービス [Pixela](https://pixe.la/ja) というものがあるが、習慣化をする上でとてもよくて今年いろいろ工夫して使っていた。

GitHub のそれが、 Contirubution 回数を記録してくれるのと同様、いつ、何回その行動をしたのかを記録するのにちょうどいい。そして記録を自動化できると尚良し、と考えている。 Pixela は webhook を叩くことで、その日のカウントがインクリメントされるというシンプルな使い方ができるので、自動記録も組みやすい。

<img src="https://pixe.la/v1/users/chroju/graphs/phone-open.svg">

例えばこれはスマホを開いた回数の記録。 [HTTP Request Shortcuts](https://play.google.com/store/apps/details?id=ch.rmy.android.http_shortcuts&hl=en_US&gl=US) と [MacroDroid](https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid&hl=en_US&gl=US) を組み合わせて、スマホを開いたときに自動的に webhook を叩くように設定した。デジタルデトックスの一環で、徐々にこの芝の色が薄くなればと考えている。 iOS であれば、「ショートカット」を使って同様のことができると思う。

macOS も Monterey になってショートカットが使えるようになったので、記録できるものは増えたのではないかと思う。来年はさらに習慣化のために活用していきたい。なるべく、生活に必要なものを「習慣」にまとめてシンプルにしていきたい。

### 週報

[読んだ記事などを「週報」として notion にまとめ始めた - the world as code](https://chroju.dev/blog/journal_with_notion) に書いた通り、週報を書く試みを始めた。今のところ頓挫してしまってはいるんだけど、やろうとしたことは間違っていなかったと思うので再開したい。書く内容を少し減らしたほうがいいのだと思う。

今これを書いていても感じているが、年間など長いスパンで振り返るのは急にできるものでもなくて、週間、月間などそれなりの短いスパンで振り返り、立て直しを図っていくことは習慣化していきたい。

### Slack で Release Note を読む

<a href="https://gyazo.com/1d6cd8f45eda88b4fc81e7d209618b5c"><img src="https://i.gyazo.com/1d6cd8f45eda88b4fc81e7d209618b5c.png" alt="Image from Gyazo" width="600"/></a>

RSS Reader を通勤中の電車内で読む、という習慣がすっかりなくなってしまったのだが、使っている OSS などの Release Note ぐらいはちゃんと押さえておきたくて、確実に目に入る場所として Slack に流すことにした。自分1人用の workspace を設けているので、そこに GitHub Release や各種ブログの RSS を流している。 Google Calendar の予定なども流しているので、朝にその日の予定と、夜の間に出たリリースを眺めたりできてなかなかよい。

## 来年について

まだあんまり考えてないのだが技術〜〜〜って思っている。セキュリティ、 Cloud Native 関連、ソフトウェアデザインあたりに課題感が強い。特に Cloud Native は使っているわりにあん〜〜〜〜まり追えてないので、ちゃんと追っかけることをまずは始めていく。

なかなか時間を無限に使えるという感じでもなくなってきたので、限られた時間に集中して多量にインプットしていくようなスキルを身につけたい。

もうちょい具体的な目標とかは、また年明けたら考えます。
