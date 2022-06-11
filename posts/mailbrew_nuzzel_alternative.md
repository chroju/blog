---
title: "Twitterの話題はMailbrewで収集する"
date: "2022-06-11T10:24:22+0900"
tags: ["productivity"]
---

ここ数年、Twitterを見る時間はなるべく減らすようにしていて、通知は受け取らないようにしているし、見る場合も「タイムライン」ではなくて必要最低限に絞ったリストを使うようにしたりなど、いろいろ工夫している。

それでもTwitterを完全に見ない、というのもなかなか難しくて、あれの良いところとしては「なんとなく眺めていると今話題になっていることがわかる」という点がある。炎上ネタなどはどうでもよいのだが、少しホットになりつつあるセキュリティ事象とか、最近この技術に言及されている機会が多いな、だとか、そういったことはRSSなど他の手段だと収集が難しい。もちろん、それが本当に必要な情報なのか、という視点はあるとは思うが。

以前はこの用途で [Nuzzel](https://twitter.com/nuzzel) を使っていた。これはTLやリストで多く言及されているリンクがあると、Slackなどに通知してくれるサービスで、「話題」をキャッチする上で重宝していたのだが、残念ながらTwitterに買収されて閉鎖されてしまった。

## Mailbrew

それからNuzzel Alternativeをずっと探していたのだが、2か月ぐらい前に [Mailbrew](https://app.mailbrew.com) に行き着き、自分の中で運用が安定してきた。月額 $4.99 の有償ではあるが、その価値はあると思う。

<a href="https://gyazo.com/e5cf3d647306e668dc2513c5b07ac8d3"><img src="https://i.gyazo.com/e5cf3d647306e668dc2513c5b07ac8d3.png" alt="Image from Gyazo" width="600"/></a>

Mailbrewは言うなれば「いろんな情報ソースを組み合わせて自分だけのメルマガ（ `Brews` と呼ばれる）を作れる」サービス。昨今、SNSやらDev.toのようなブログメディアなどが様々増え、それぞれに通知の仕組みがあるわけだが、その中から必要なものを抽出して集約して1日1回だけとか受け取るようにして、情報過多な状態を脱しましょう、という狙い。 [Not just what you read but how](https://world.hey.com/dhh/not-just-what-you-read-but-how-64648303) の中でDHHが言及していたことでも一時話題になったように思う。

Mailbrew自身が [The best Nuzzel alternatives](https://mailbrew.com/blog/top-nuzzel-alternatives) と称しているように、使える情報ソースの中に「Twitter Top Links」というものがあり、話題のリンクをピックアップすることもできる。Twitter連携はかなり充実していて、「あるユーザーの最新ツイートを3つだけ」、あるいは「人気のものを3つだけ」などもできるし、「自分のTLで人気のツイートを5つだけ」といったこともできる。最近はTwitterでマンガ連載するようなアカウントもあるけど、これならMailbrewだけで追えて良かったりとか。 [ちいかわ](https://twitter.com/ngnchiikawa) なんかはほぼマンガのツイートだけ投稿されていて、日に1〜2ツイート程度なのでめちゃくちゃ相性がいい。

<a href="https://gyazo.com/eae7e2cb929eeb33613812ec1ca1c079"><img src="https://i.gyazo.com/eae7e2cb929eeb33613812ec1ca1c079.png" alt="Image from Gyazo" width="600"/></a>

他にもいろいろと。RSSなんかにも対応しているのは当然として、 [Hacker News](https://news.ycombinator.com/) などの主要なメディアサイトであれば直接的に取り込む機能もある。

<a href="https://gyazo.com/6142b19a12d255c3b36feaa989d3f1fd"><img src="https://i.gyazo.com/6142b19a12d255c3b36feaa989d3f1fd.png" alt="Image from Gyazo" width="600"/></a>

## SavedとNewsletter

特徴的な機能として `Saved` と `Newsletters` がある。

前者はPocketのようなRead it Later機能。MailbrewはWebブラウザからログインすると、過去のBrewsもすべて読めるのだが、ここで読むと各記事に `Save` ボタンが付いており、あとで読む用に保存して、Mailbrewの中で読むことができる。また [chrome extension](https://chrome.google.com/webstore/detail/mailbrew-read-later/fgcpnflfkoclnkgkkimfpbehjopdfdem) を使うとブラウザからもURLを保存できて、まさにPocketライクに使える。

Newslettersはメルマガの集約機能。Mailbrewが発行してくれるメールアドレス宛にメールを送ると、その内容がMailbrew上で読めるようになる。僕は何本かメルマガを購読しているのだが、GmailのUIだとあんまり「読み物をする」気分にはならず溜まりがちだったのが、Mailbrewだと読む頻度が上がるようになった。

ちなみにSavedとNewslettersの新着は、Brewsの中に埋め込んで表示させることもできる。

## 自分の運用

先のDHHの記事の中に書かれた運用を参考に、毎日朝夕 + 週末の計3種類のBrewsを作っている。

* 毎朝 : Twitter、Reddit、Dev.to、Hacker Newsなどからの技術的な話題ピックアップ
* 毎夕 : 趣味的な話題のピックアップ
* 週末 : 確実に読みたいRelease Noteなどの集約

日次で受信するBrewは忙しいと読めないこともあるので、必ずしも読まなくてもいいようなホットな話題などを中心にしている。利用しているサービスやOSSのブログの更新や、GitHub ReleasesのRSSは時間のある週末に確実に目を通したいので、まとめて週末に送っている。

この方式で難があるのは [AWSのWhats'new](https://aws.amazon.com/jp/about-aws/whats-new/recent/feed/) など、日に10回も更新するようなことがあるブログなのだが、レアケースではあるのでこういったものだけは今はSlackに流している。上手いこと抽出して受信したいとは思うのだが。

<a href="https://gyazo.com/73f1ff72cb25a48354278bb077bf7457"><img src="https://i.gyazo.com/73f1ff72cb25a48354278bb077bf7457.png" alt="Image from Gyazo" width="300"/></a>

目指しているのは、「WebでのインプットはすべてMailbrewを見ればよい」という状態。あちこち通知を見に行ったりするんじゃなくて、ちょっと手持ち無沙汰なときにMailbrewを開けば読むものが積んである、という状態にしていきたい。 `Saved` も積極的に使っていて、仕事中などに「これは読んでおこう」というものが出たら取りあえず保存している。MailbrewはPWAではあるのでスマートフォンに「インストール」はできるものの、スマホから `Saved` を使うことはできないのが玉に瑕ではあるのだが、今のところ非公式な手段でゴニョゴニョしてスマホからもポチポチと保存している。

難を挙げると、今書いた通りモバイルの対応がいまいちな点、Brewsの編集がGUIで若干もっさりしていて面倒な点、Savedがたまにバグって同じURLを何度でも保存できちゃう点、ぐらい。あとはAPIがあると嬉しいのは確か。
