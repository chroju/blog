---
title: "認知負荷を抑えたお金の管理"
date: "2021-08-09T09:19:38+0900"
tags: ["money"]
---

なんか急にお金の話が書きたくなったので書く。

10年ぐらい前から「現金は極力使わない」「なるべく処理を自動化して認知負荷を減らす」というモットーで仕組み作ってきたけど、どこかに書き記したことはなかったので書いてみる。ここは一応技術ブログなのだが、特にプログラミング的な要素は何もない（昔はあったんだけど）し、わりとみなさん良くやっている方法だとは思っている。極力自動化する、認知負荷（運用負荷）減らす、みたいな考え方はIT系というか SRE っぽいかもしれない。

<a href="https://gyazo.com/40d05a3043da3c8eee6faded0c6289d5"><img src="https://i.gyazo.com/40d05a3043da3c8eee6faded0c6289d5.jpg" alt="Image from Gyazo" width="600"/></a>

ざっくり図にすると、現状のお金の流れはこんな感じ。要素ごとに説明してみる。

## 銀行関連

### 住信 SBI ネット銀行をハブにする

https://www.netbk.co.jp/contents/

ハブとして使っている銀行。すべてのお金はここに入ってきてから、いろんなところへ流れていく。

もう10年ぐらいは使っているし、特に不満もないので乗り換える予定もない。 ATM 手数料関連で「改悪」と何度か言われてきてはいるけれど、給与受け取り口座にして、デビットを月3万円分使っていれば、毎月10回は ATM 入出金無料になるので、別に不満はない。最近は現金をあまり使わないので、毎月の出金機会は1、2回ぐらいだし。

また、SBI証券との「ハイブリッド口座」の機能があり、お金の移し替えが簡単なのも大きい。貯金に回せるお金は全部ここへ入れていて、さらに投資に回したりもしている。微々たるところではあるが、ハイブリッド口座の金利は2021年8月現在0.01%で、普通の銀行に眠らせるよりはマシになる。

他にも自動定額振り込みの機能、スマホアプリがあればキャッシュカードなしで ATM 取引ができるサービスなど、いろいろ便利に使わせてもらっている。最近はアプリだけで振り込みから何から全部完結するようになった。

### 銀行を使い分ける

他、何かのためにとメガバンクとゆうちょの口座は取りあえず押さえている。いずれも積極的には使っていない。

用途別で銀行口座を分けてはいて、ゆうちょのほうは現状「引き落とし用口座」になっている。毎月のクレジットカード利用料や、 iDeCo の支払いはここからになっており、 SBI 銀から手動で必要額を振り込んでいる。別に SBI 銀から直接引き落としてもいいんだよね、と感じてはいる。ほぼ惰性でこうなっている。

メガバンクのほうは、現在2人暮らしなので家のお金をストックする場所としていたが、最近後述する Kyash の共有口座を使い始めたので休眠状態になりつつある。結果、「銀行を使い分ける」必要性はあまり感じなくなってきたところではある。認知負荷のことを考えると、このあたりはそろそろ見直してよさそう。

## 支払い手段

支払いは基本的にキャッシュレス。優先順位は QUICPay > モバイル Suica > Kyash Card > 現金としている。

### FeliCa / NFC 決済が好き

最も速い決済手段がスマホでの FeliCa / NFC 決済だと思っているのでこれが最優先。 QR 決済サービスも、友人との送金用途を考えて使ってはいるものの、支払いのときにアプリを立ち上げるのがどうにも面倒であまり使っていない。特に、バーコードをこちらで読み込んで、金額を自分で入力するタイプの支払いだと使うのにだいぶ抵抗がある。何も考えずにタッチして「ピッ」が一番楽。

優先しているのは、後述の Kyash と連携した QUICPay だが、たまに使えない店舗もあるので、その場合はモバイル Suica が次点。

### クレジットカードではなくデビットを使う

クレジットカードを使わないことにして、デビットカードを代わりに使っている。 MoneyForward を使っているので、クレカの利用額がわからなくなるを気にしているわけではないのだが、使ったお金がすぐに手元から消えるほうが精神衛生的に楽。ポイント還元率などでクレカのほうが得な場合が多いのは理解していて、一時期どのクレカがお得か、みたいなことをやってもいたが、あんまりそこに時間使いたくないなという気にもなってきて、 SBI のデビットだけ使うことにした。

ただ、デビットが使えない場面というのがあるので、クレカも持ってはいる。いくつかの定期的な支払いで使っている。

### Kyash で支払いを集約する

https://www.kyash.co/

SBI 銀が入金側のハブなら、支払い側は Kyash がハブになっている。 Kyash で Kyash Card と呼ばれるリアルカードを発行し、 QUICPay に紐つけてそちらをメイン決済手段に。カードのほうも持ち歩いて、 FeliCa / NFC 決済が使えないときの代替に。入金手段は SBI デビット。これで Kyash から支払えば、その場で銀行口座から引き落とされるようになる。

Kyash もまたサービス変更でいろいろ言われているが、当初「クレカやペイジーから入金できて、それを送金にも決済にも使えるし、決済時2%還元しますよ（参考：[送金を身近に　リアルカードで決済シーンも拡大　「Kyash」の戦略を聞く：モバイル決済の裏側を聞く（1/3 ページ） - ITmedia Mobile](https://www.itmedia.co.jp/mobile/articles/1808/15/news030.html)）」と言っていたのに、銀行連携が中心のバンキングサービスへ趣旨換えしてしまったので、僕のようなクレカ（デビット）連携をメインとしていた初期ユーザーは、それは混乱するであろうというところ。「改悪」というよりは、サービスのターゲット自体が変わったよね、と認識している。

ただ、それでも利点は多いので使用をやめる予定はない。利点の1つは、最近「[共有口座](https://www.kyash.co/features/share-account)」と呼ばれる、他の Kyash ユーザーと共同で入出金できる口座機能。現在、家庭のお金はここに入れてここから払うことにしている。従来は共有用の銀行口座を設けて、デビットカードを作って支払っていたものの、デビットは複数人複数名義で持てないので、カードを持っていないほうが支払うのには使えず不便だった。 Kyash なら1つの口座から各々のカードで支払いができてすごく見通しがいい。

もう1つは、クレカ / デビットのプロキシとしての役割期待がある。手持ちのカードはなんであれ、 Kyash に紐つけておけば決済の口がここに集約されるのが気持ちとして楽であり、仮に Kyash の番号が流出だとか不正利用されても、 Kyash さえ停めれば本体側には被害が及ばない。また Kyash と連携さえすれば、どのカードであっても QUICPay 化できる。実際のところ、 SBI デビットは現状 Google Pay には対応しておらず、 Kyash 連携で初めて QUICPay 化できている。このあたりが使っている理由として大きい。

つまるところは「支払い手段の集約」というところに魅力を感じている。送金、カード決済、非接触決済、すべてが Kyash に集まっているというシンプルさが気に入っている。

## 投資はほったらかし

投資は大したことをしていなくて、[山崎元『全面改訂 超簡単 お金の運用術』](https://www.amazon.co.jp/dp/B00F3VLSZW) を読んでください、それが全てです、というところ。もうそこそこ古い本になってしまっており、状況や制度が変わった部分もあるが、基本路線は同じ。

一言で言えば iDeCo と（つみたて）NISA には全振り、インデックスファンド中心に買って短期的な売り買いはせず、基本ほったらかし。個別株を買わないわけではないけれど、買うときはリターンを目的とはしていなくて、応援のつもりとか、株主優待目的とかにしている。

長期での投資しか考えていないので、基本的に路線を変えるつもりはない。とはいえまだ始めて10年経つか経たないかぐらいで、今は株高もあって儲かってはいる状態だというのはあるので、将来的に変動要素があれば何か見直しはかけるかもしれない。

## 集計は MoneyForward

https://moneyforward.com/

最後に、集計には MoneyForward 。昔はパスワードを渡すことを忌避していた時期もあったけど、現在は API 連携できる銀行も多いし、便利に使っている。そして一度使うと手放せない。現金を使う機会は月間で先月が5回、先々月が3回だったので、ほぼ全自動ですべてのお金の履歴がここに蓄積されている。

## Conclusion

お金まわりで、ちょっとした得をする手段というのはいくつもあるんだけど、そのために労力をかけたり何か考えることは基本的に捨て去っている。その代わりに入金はSBI銀、出金は Kyash という具合に集約してシンプルにすることで、認知負荷、運用負荷を下げることに「得」を感じるというのが自分のスタイル。考えることを増やさないようにこれからも運用を続けていくつもり。
