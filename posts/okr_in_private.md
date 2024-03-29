---
title: "プライベートにも OKR を取り入れてフォーカスする"
date: "2020-01-13T18:48:26+09:00"
tags: ["okr"]
isCJKLanguage: true
draft: false
---

前回のエントリー [2019年総括 · the world as code](https://chroju.github.io/blog/2019/12/30/looking_back_2019/) で少し触れた「個人OKRの導入」について書く。年始だし目標の話を書くのはちょうど良さそうでもある。

## 個人の生活と OKR

OKR というのは Google が採り入れていることで名高い目標管理メソッドで、最近日本国内でもテック系企業が採用している例が増えている。改めて説明するつもりもないが、以下のような点が特徴だと捉えている。

* 目標を完遂することは求めず、達成確度 70% 程度の定性的な目標を3〜5個掲げて運用する
  * 目標の数を少なく絞り、フォーカスするべき領域を明確にする
  * 目標は数値が入った指標などではなく、人を鼓舞するような定性的な内容にする
  * あえて達成が困難な目標を掲げることで、パフォーマンスの最大化を図る
  * その性質上、人事評価に用いるのは NG とされる
* 各目標について、どのような状況があれば「達成した」と言えるのかを示す定量的な成果指標を3個程度設定する
  * 目標が Objective (O) 、成果指標が Key Result (KR) と呼ばれる
* サイクルは四半期ごとと短く設定し、さらに1週間ごとに進捗の確認を行うことで素早く行動する

基本的には組織や企業の目標管理メソッドなのだが、これをあえて個人の生活に採り入れることを昨年の第2四半期から始めた。自分が注力するべき領域をフォーカスでき、短いスパンで進捗を確認して軌道修正ができることは、個人生活においてもメリットが大きい。クリスティーナ・ウォドキーによる書籍『OKR シリコンバレー式で大胆な目標を達成する方法』（日経BP社 2018）においても、及川卓也氏の解説の中で、個人で OKR を採用するメリットについて触れられている。

> 個人的なタスクが失敗しがちな理由はその優先度を上げずに時間を確保しないということだけが理由ではない。進捗が見えづらいためにモチベーションが維持できないことも、タスクを継続する阻害要因だ。（中略）タスクの優先度を明確にし、継続するためのモチベーションを維持するために、実は OKR が役に立つ。

<div class="amazlet-box" style="margin-bottom:0px;"><div class="amazlet-image" style="float:left;margin:0px 12px 1px 0px;"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B07B2R1ZDL/diary081213-22/ref=nosim/" name="amazletlink" target="_blank"><img src="https://images-fe.ssl-images-amazon.com/images/I/512xkUh8Y8L._SL160_.jpg" alt="OKR（オーケーアール）" style="border: none;" /></a></div><div class="amazlet-info" style="line-height:120%; margin-bottom: 10px"><div class="amazlet-name" style="margin-bottom:10px;line-height:120%"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B07B2R1ZDL/diary081213-22/ref=nosim/" name="amazletlink" target="_blank">OKR（オーケーアール）</a><div class="amazlet-powered-date" style="font-size:80%;margin-top:5px;line-height:120%">posted with <a href="http://www.amazlet.com/" title="amazlet" target="_blank">amazlet</a> at 20.01.13</div></div><div class="amazlet-detail">日経BP (2018-03-15)<br />売り上げランキング: 6,481<br /></div><div class="amazlet-sub-info" style="float: left;"><div class="amazlet-link" style="margin-top: 5px"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B07B2R1ZDL/diary081213-22/ref=nosim/" name="amazletlink" target="_blank">Amazon.co.jpで詳細を見る</a></div></div></div><div class="amazlet-footer" style="clear: left"></div></div>

ちなみにこの本の原題は『RADICAL FOCUS』らしい。

## 具体的な運用

とはいえ組織向けに作られた本来の OKR を、そのまま個人生活に適用するのは難しい。金曜日に互いの成果を称え合う「ウィン・セッション」なんて一人じゃやりようがない。なのでいいとこ取りをしながら、以下のような運用をしている。

* 四半期の最初に OKR を作成する
  * 「O」は2つ、各「O」に「KR」は3つ設ける
    * 「O」は技術者関係で1つ、それ以外で1つ
  * 健全性指標は2つ設ける
* 毎週金曜日にウィン・セッションとチェックインミーティングを合わせたような振り返りを行う
  * その週に実行できたこと、できなかったことの振り返り
  * 各 KR の達成自信度レベルの見直し
  * 向こう4週間の予定確認
  * 翌週に OKR に関してやるべきことの設定

ツールは紙、具体的にはコクヨの測量野帳を使っていた。先の OKR 本では毎週の状況報告をメールで行うこととしていたが、チームで運用しているわけではないのでメールである必要がない。何かデジタルのメモツールというのも考えたが、しっくりくるものがなくて紙にしていた。

## 結果どうだったのか

ぶっちゃけあんまり上手くいっていない。

### 目標設定自体がなかなか難しい

具体的な OKR の内容は本当にプライベートなものも含まれていたりするのであんまり見せたくないのだが、一例として前四半期の「O」の1つは以下のような内容だった。

* O: SRE として部門の半数の人に認知される成果をつくる
  * KR: 毎週1本ブログを書いている
  * KR: 社内全インフラ構成のコードリーディングと、インフラ構成の肝を理解する
  * KR: Terraform のコードリーディングと PR で存在感を強める

目標自体はまぁ良いと思う。今の部門に配属されて3か月経ったタイミングだったので存在感を高めたかったのが理由。半数というのは少ない感じもあるが、部門内にはエンジニア以外の人も相当数いるので妥当と考えた。

ただ KR については今見直すと妥当とは言い難い。ブログを書いたところで部門の人に見てもらっているわけではないし、社内の存在感とはあんまり関係がない。3つ目の KR についても同様と言えるし、2つ目については仕事の話ではあるけれど、これで認知が高まるかというと微妙じゃないだろうか。 KR は「収益を xx% 増加させる」といった定量的な指標であるべきなのだが、どうもこれが上手いものが思いつかない。

### 継続できていない

昨年は第2四半期から3回 OKR を回してみたが、いずれも最後の1か月ぐらいで失速して、毎週欠かさず振り返りを継続できなかった。

あんまり前に進んでいる感触が得られなかったというのが理由として大きい。しばらくいそがしくて、何週間も OKR のためのタスクを実行できなかった頃がある。すると今週は達成できませんでした、来週やります、という中身のない振り返りが何度も続くことになる。これで嫌になってやめてしまうことが少なくなかった。

## 今年の運用

うまくはいかなかったが、個人で OKR を使うことが無意味だとはあまり思っていない。自由に使える時間も限られる中で、自分が何にフォーカスするべきかを定めておく意味は大きいし、短いサイクルで振り返ることで得られるものも（振り返りが継続できなかったりはしたものの）大きいのは確かだという感触はあった。今年は少し運用を替えて継続してみる。

### KR は1つだけ定量的じゃなくても可とする

KR に定量的じゃない目標を1つだけ入れてもいいことにした。思いつかないものをいつまでも考えても仕方ないので、まずは回しやすいルールに替えてみる。

### KR に行動を入れない

これは OKR 本に書いてあったことなのだが、昨年は KR が思いつかない末に苦しみ紛れに入れてしまった。例えば先に挙げた「毎週1本ブログを書いている」だけど、1週でもブログを書かなかったらアウトになるので達成が難しいし、毎週の振り返りが書いたか否かのゼロイチでしかなくなるので、振り返りに意味を感じづらくなる。今年は絶対に行動を入れない。

### 振り返りはデジタルで、毎週時間を予め確保する

振り返りはデジタルに替える。端的に言ってそのほうが書くのが早くてストレスが小さく、継続しやすそうだから。また、振り返りの時間は土曜朝に近所のパン屋で15分でやることにする。その時間が空いているかどうか、前の週の振り返りの際に確認して、空いていなければ代替の時間をあらかじめ確保するようにする。

## 参考資料

OKR とは何か？については市販の本がいろいろ出ているけれど、とりあえず [Google re:Work - ガイド: OKRを設定する](https://rework.withgoogle.com/jp/guides/set-goals-with-okrs/steps/introduction/) に Google 式のやり方が端的にまとまっているので、まずこれを見ると良いと思う。具体的な事例が知りたければ、国内企業ブログがいくつも引っかかる。

個人での OKR 実践については、いくつか事例を探せたので参考にさせていただいている。特に1番目に挙げたエントリーが非常に具体的かつ定量的な目標設定ができていて、目標設定後の日々の運用にも言及していてすごく参考になった。ここではダイエットという定量的に測りやすい目標を掲げているけれど、そもそも定量的評価しやすい目標を逆算的に選ぶのもありかもしれない。

* [ダイエットを支える技術 - OKRとセルフマネジメントで15キロ痩せる - 未来永劫](http://shopetan.hatenablog.com/entry/2018/12/10/000000)
* [2019年の個人OKRをつくってみた - これはただの日記](https://kths.hatenablog.com/entry/2019/01/04/222959)
* [個人開発でOKRを試したいので運用方法を考える - Qiita](https://qiita.com/maKunugi/items/2616e337c259256726b8)

また目標を作るにあたっては、読書猿氏の『アイデア大全』『問題解決大全』を参考にしている。それぞれアイデア出しと問題解決のための古今東西様々な手法が掲載された本で、目標設定の上でも役に立っている。特に活用しているのが「スケーリング・クエスチョン」（今の自分を100点満点で評価し、100点に足りない点数の理由は何か、それを埋めるにはどうしたらいいかを考える）というメソッド。

<div class="amazlet-box" style="margin-bottom:0px;"><div class="amazlet-image" style="float:left;margin:0px 12px 1px 0px;"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4894517450/diary081213-22/ref=nosim/" name="amazletlink" target="_blank"><img src="https://images-fe.ssl-images-amazon.com/images/I/417MFc9ImBL._SL160_.jpg" alt="アイデア大全" style="border: none;" /></a></div><div class="amazlet-info" style="line-height:120%; margin-bottom: 10px"><div class="amazlet-name" style="margin-bottom:10px;line-height:120%"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4894517450/diary081213-22/ref=nosim/" name="amazletlink" target="_blank">アイデア大全</a><div class="amazlet-powered-date" style="font-size:80%;margin-top:5px;line-height:120%">posted with <a href="http://www.amazlet.com/" title="amazlet" target="_blank">amazlet</a> at 20.01.13</div></div><div class="amazlet-detail">読書猿 <br />フォレスト出版 (2017-01-22)<br />売り上げランキング: 29,323<br /></div><div class="amazlet-sub-info" style="float: left;"><div class="amazlet-link" style="margin-top: 5px"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4894517450/diary081213-22/ref=nosim/" name="amazletlink" target="_blank">Amazon.co.jpで詳細を見る</a></div></div></div><div class="amazlet-footer" style="clear: left"></div></div>

<div class="amazlet-box" style="margin-bottom:0px;"><div class="amazlet-image" style="float:left;margin:0px 12px 1px 0px;"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4894517809/diary081213-22/ref=nosim/" name="amazletlink" target="_blank"><img src="https://images-fe.ssl-images-amazon.com/images/I/51eIDa4w4VL._SL160_.jpg" alt="問題解決大全――ビジネスや人生のハードルを乗り越える37のツール" style="border: none;" /></a></div><div class="amazlet-info" style="line-height:120%; margin-bottom: 10px"><div class="amazlet-name" style="margin-bottom:10px;line-height:120%"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4894517809/diary081213-22/ref=nosim/" name="amazletlink" target="_blank">問題解決大全――ビジネスや人生のハードルを乗り越える37のツール</a><div class="amazlet-powered-date" style="font-size:80%;margin-top:5px;line-height:120%">posted with <a href="http://www.amazlet.com/" title="amazlet" target="_blank">amazlet</a> at 20.01.13</div></div><div class="amazlet-detail">読書猿 <br />フォレスト出版 (2017-11-19)<br />売り上げランキング: 60,500<br /></div><div class="amazlet-sub-info" style="float: left;"><div class="amazlet-link" style="margin-top: 5px"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4894517809/diary081213-22/ref=nosim/" name="amazletlink" target="_blank">Amazon.co.jpで詳細を見る</a></div></div></div><div class="amazlet-footer" style="clear: left"></div></div>

