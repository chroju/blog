---
title: "Alfred で書籍を検索する Workflow を作った"
date: "2021-11-15T23:28:47+0900"
tags: ["alfred"]
---

書籍を紹介するとき、つい Amazon の URL を使ってしまうのだが、購入先に関してなるべく中立でありたいという思いもあり、できれば [版元ドットコム](https://hanmoto.com/) を使いたい、と常々思っていた。しかし、なかなか書籍名でウェブ検索をかけても版元ドットコムのページは上位に出てこなくて忘れてしまうので、書籍を検索する Alfred Workflow を作った。

## 版元ドットコムとは

[版元ドットコムとは | 版元ドットコム](http://www.hanmoto.com/about_hanmotodotcom) に詳細は譲りたいが、版元 = 出版社が寄り集まって作っている団体と、その団体が作っているウェブ上の書籍データベースを指す。

参加していない版元による書籍については、当然ながらデータが存在しないし、また検索機能があるものの、それほど強力ではない（例えばアルファベットはケースセンシティブで検索されるっぽい）など弱点も見受けられる。が、サイト内に直接的な購入導線がなく、その点で中立的な書籍データベースとして利用できる。

## workflow の構成

<a href="https://gyazo.com/fbdc2befca2917f48eda6aaf13cd8871"><img src="https://i.gyazo.com/fbdc2befca2917f48eda6aaf13cd8871.png" alt="Image from Gyazo" width="640"/></a>

書籍検索の API を叩いて書籍を探し、確定したらそこから ISBN-10 を抽出して `https://www.hanmoto.com/bd/isbn/$ISBN` に渡して開いている。同様に ISBN を URL に渡すことで書籍のページを開ける、 Amazon.co.jp と [ブクログ](https://booklog.jp/) にも対応させている。

また、書籍の情報を参考文献のフォーマットでコピーできる機能も用意した。これは大学でレポートを書く上で以前から欲しいと思っていた機能。例えば [『SRE サイトリライアビリティエンジニアリング』](https://www.hanmoto.com/bd/isbn/4873117917) をコピーすると、 `Betsy Beyer, Chris Jones, Jennifer Peto, Niall Murphy (Sky株式会社 玉川 竜司 訳) . SRE サイトリライアビリティエンジニアリング. オライリー・ジャパン, 2017, 592p.` となる。

<a href="https://gyazo.com/8e395ffd192dff934fe710f770ea4902"><img src="https://i.gyazo.com/8e395ffd192dff934fe710f770ea4902.gif" alt="Image from Gyazo" width="600"/></a>

## 書籍検索API

書籍情報を検索できる API はいくつか存在しており、今回3つほど試したがどれも一長一短だった。1つ目は版元ドットコムとカーリルが共同で提供している [openBD API](https://openbd.jp/) 、2つ目は [Google Books APIs](https://developers.google.com/books/) 、3つ目は [楽天ブックス系API](https://webservice.rakuten.co.jp/document/) 。

### openBD API

* GET は ISBN 指定でしかできない（検索の機能はない）
* 書誌情報は版元ドットコムによるものと JPRO によるものの2つが同梱されており、充実している
  * JRPO の書誌情報は独特のフォーマットであり、 http://jpo.or.jp/topics/data/20160113a_jpoinfo.pdf で仕様を確認できる
* 認証は不要

### Google Books APIs

* 検索と、 Google Books 内での ID 指定による get に対応
* 書誌情報は充実しているが、難あり
  * ISBN など基本的な項目含めてアトランダムに「抜け」が見られる
* 認証は不要

### 楽天ブックス系API

* 各種パラメータ（書名、著者、ISBNなど）指定により GET を行い、複数マッチすれば複数の書籍情報が返る
* 書誌情報は比較的充実しているが、難あり
  * ISBN-13 が振られている場合、 ISBN-10 の情報は抜けている
  * 著者名の姓名分かち書きなどに統一性がない
* 和書、洋書で API が分かれている
* 認証が必要

結論としては Google Books APIs を使うことにした。 openBD は検索ができない時点で用途に見合わず、楽天は和書、洋書の一括検索ができない、 ISBN-10 が取得できない場合があるなど、難が多かった。 Google については ISBN がそもそも取得できないという大きな欠点もあるものの、一旦そのような書籍は検索結果から除外する形で妥協している。

## Conclusion

[円城塔『プロローグ』](https://www.hanmoto.com/bd/isbn/4167910195) にこんな一節がある。

> なんでも良いがいい加減このくらいの代物は、出典の URL を明記できるくらいの形でどこかに公的なテキストデータとして蓄えておいてもらいたい。『古事記』だよ。勘弁してよ。 (p.17)

今回、いくつかの書籍情報 API を調べて、なかなかこれといったものがなく悩んでいた際に、この一節を思い出した。書籍情報の絶対的なパーマリンクが欲しい。いつかこのあたり、仕事で少し噛めたらな、とはちょっと思っている。

それはそれとして、Alfred Workflow をサッと作れるようになっておくとやはり便利だな、ということを改めて感じた。この Workflow は完全に個人的なものなので、以下のリンク先で公開してはいるが、 PR などを受け付けるつもりはない。 ISBN で URL を開けるようなサイトなら、 Amazon やブクログ以外にも応用可能と思うので、もし自分なりに使いたいという方がいたら fork してみてほしい。

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://github.com/chroju/alfred-book-search" data-iframely-url="//cdn.iframe.ly/xtD41Bg?card=small"></a></div></div><script async src="//cdn.iframe.ly/embed.js" charset="utf-8"></script>
