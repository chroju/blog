---
title: "Corne Cherryを愛用した4年の後、Corne V4を購入した"
date: "2024-04-05T23:40:51+0900"
tags: ["keyboard"]
---

[![Corne V4とCorne V3](https://i.gyazo.com/7454c52f2a0f813050858ac44df5a855.jpg)](https://gyazo.com/7454c52f2a0f813050858ac44df5a855)

Corne Cherryを約4年前に手に入れて以来はずっとこれを使っていて、もう日常的に使うキーボードを買い替える必要はなかろう、ぐらいに溺愛しているのだが、そのCorneの新版V4が出たので購入した。何が変わったのか？という点は遊舎工房の商品ページを参照されたい。

https://shop.yushakobo.jp/products/8961

一番の違いとして **「半田付けが不要になった」** という点があり、キースイッチとキーキャップを買って植えて、あとはネジ留めさえすればすぐ使えるので、半田付けを敬遠していた方にも勧められそう。

## ケース付きで音が変わる

もともと使っていたのはCorne V3に [IMK Corne Case](https://imkulio.com/) というサードパーティのアルミ製ケースを合わせたものであり、この時点でもだいぶ完成度が高いと感じていた。

[![サンドイッチ構造とケース](https://i.gyazo.com/cc39bd19b7cdf20b3d8a276815ba3cb6.jpg)](https://gyazo.com/cc39bd19b7cdf20b3d8a276815ba3cb6)

一方でCorne V4についても、自作キーボードで一般的なサンドイッチ構造（キースイッチを半田付けする基盤を、アクリルプレート2枚で挟み込むように構成したもの、写真左）とは異なり、ケースが搭載されている。IMK Corne Caseのような金属製ではなくプラスチック製ではあるが、非常に質感が良くて触ってて気持ちがいい。

金属製ケースだと少し甲高い音がしていたのだが、プラスチック製になって低めの静かな音に変わった。良い録音機材を持っていないので音を届けることはできないが、コトコトと良い音を立てていてすごく気に入っている。個人的にはもう少し静音性が欲しいので、遊舎工房の [フォームカットサービス](https://shop.yushakobo.jp/products/keyboard_foam?_pos=2&_sid=40c908672&_ss=r) を使うつもりでいる。

なお、キースイッチは [Kailh Deep Sea Silent Box Switch Islet](https://talpkeyboard.net/items/644369821c72b409e0ad9d2d) を使っている。今回のために新しく購入したが、静音性も然る事ながら、ブレが少なくてこれも非常に良い。

## 追加された4つのキーをどう使うか

[![ProMicroと追加キー](https://i.gyazo.com/ff54d737646f2deba2f011a818760d22.jpg)](https://gyazo.com/ff54d737646f2deba2f011a818760d22)

V4ではProMicroが不要となったことで、空いたスペースにキーが左右2つずつ追加された。Corneのキー数は「ギリギリ足りる」という感覚でいたので、この変更はとても嬉しく感じていたのだが、結果から言うと現状あまり活用できていない。

そもそものCorneの配列が、改めて考えると完璧だったのだ、ということに気付いている。ホームポジションから1つ隣へ指を伸ばすだけですべてのキーに届くので、とても収まりが良いのだ。これに慣れると、今回追加されたキーはホームポジションから2つ隣というだけなのだが、それでも遠く感じる。文章を打つときにここまで指を伸ばすのが意外とつらい。

そのためタイピング時以外で活用できる、マクロなどを割り当てるのが良いかなと考えている。1つは画面ロックに設定してみているが、これはなかなかいい。他も使い道を模索したいところ。

また、これも意外だったのだが、打ち間違いが増えた。今使っているキーキャップが、ホームポジションのf, jキーに突起がないこともあり、意外とキーを見ながら打っていたらしく、「右から2番目のキーがf」という具合に視覚的に認識していたのが、キーが増えたことで目算が狂うようになったらしい。ただ、慣れの問題ではあり、徐々に打ち間違いは減っている。

## Vialでのキー設定

近年はQMK Firmwareをコマンドラインでビルドする、という手段を用いず、GUIからキーマップを設定できるツールが増えた。

そのなかの1つに [Vial](https://get.vial.today/) がある。これは設定変更のたびにファームウェアをフラッシュする必要がない（GUI上でキーマップを変更すると即時反映される）、[Tap Dance](https://docs.qmk.fm/#/feature_tap_dance) などの若干特殊な機能もGUIから設定ができる、といった特徴があるのだが、利用するにはQMK Firmwareからforkされた、 [vial-qmk](https://github.com/vial-kb/vial-qmk) というファームウェアを焼いておく必要がある。

Corne V4にデフォルトで焼かれているのはQMK Firmwareだが、ありがたいことに設計者であるfoostanさんのレポジトリ [foostan/crkbd](https://github.com/foostan/crkbd) でVial向けのファームウェアが配布されているので、これを焼けばVialが使えるようになる。

Tap Danceは僕にとってCorneを使う上でのキラー機能に近い。右親指下のキーで、Single TapでIME OFF、Double TapでIME ON、Holdでレイヤー切り替えという設定をしている。トグルではない形でIMEを切り替えられるのは精神衛生にいい。従来、QMK Firmwareだとこのあたりを設定するのにちょっとしたコードを書かなければならなかったが、VialならGUIから設定できるのでだいぶ気軽になった。

Vialで1点だけ気になる点としては、Tap DanceでHoldがうまく認識されず、Single Tap扱いになることがたびたびあること。この点、調整可能なのかも怪しい気がしているが、もう少し粘ってみたい。

https://github.com/vial-kb/vial-gui/issues/108

## 2度目のEND GAME

自作キーボード界隈で、自分の究極の理想とするキーボードへたどり着くことをEND GAMEと言うが、2度目のEND GAMEかもしれない。

冒頭に書いた通り半田付け不要になったことで、リーチする層が広がり、分離型キーボードを買う上で市販のものに並ぶようなかなり有力な製品になったんじゃないかとすら思う。