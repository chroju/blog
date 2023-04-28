---
title: "RSSもPDFもYouTubeも、全部Readwise Readerで「読む」"
date: "2023-04-28T11:20:07+0900"
tags: ["readwise", "feed"]
---

https://read.readwise.io

情報収集のためのアプリとして最近Readwise Readerを使い始めたのだが、これが結構面白い。一言で表すと「RSS ReaderとRead it laterサービスが一体化したもの」なんだけど、独自性のある機能が非常に多くて、言うなればデジタル上における「読む」という体験がここに集約できるようになっている。

Readwise Readerではエントリーを溜め込む場所として **「Feed」** と **「Library」** の2つが用意されている。前者がRSS Readerの役割を果たすものであり、後者がRead it later的な場所となっている。FeedにはRSS以外にも、専用のメルアドを通してメルマガを送り込んだり、TwitterのPublic List経由でツイートを送り込んだりもできる。

[![Image from Gyazo](https://i.gyazo.com/709cfc841491ff446b357f17fa2fa34e.png)](https://gyazo.com/709cfc841491ff446b357f17fa2fa34e)

特に面白いのがLibraryのほう。Feedから「あとで読みたい」ものを送れたり、Pocketのようにブラウザ拡張から今開いているURLを送れるのは基本。それ以外にファイルも登録して読むことができる。エンジニアをしているとホワイトペーパーなどのPDFを読む機会も少なくないが、なかなか未読管理まではできていなかったりする。これをRead it later的なワークフローで管理できるようになるのはなかなかに便利だ。アップロードできるファイル形式には他にePub、CSVなどがある。ePubについては目次が設定されていれば、ちゃんとそれも読み込んで使えるようになる。

[![Image from Gyazo](https://i.gyazo.com/8c15846c4c28c2a5d116b2f872f986f5.png)](https://gyazo.com/8c15846c4c28c2a5d116b2f872f986f5)

> [飯って同じ料理食う回のアニメ観ながら食べるよね？ - YouTube](https://www.youtube.com/watch?v=6w7aV_zmDec)

YouTubeのURLを登録した場合も面白くて、字幕をすべて取り込んでLibrary上で表示してくれる。日本語もイケる。なので、動画を「読むもの」に変換することができる。正直、動画によるインプットが苦手な質で、適当に飛ばし読みしながらザッピングできる文章のほうが好きなのだが、この機能によりある程度動画でもインプットが進むようになった。ちなみに、字幕上の任意の箇所をクリックすれば、その箇所から動画を再生してくれるという機能も付いている。

デジタル上で「読む」ものが集約できるというのはこのあたりであり、いろんなアプリを行き来しなくても、あらかたのものはここに突っ込んでおけばよくなった。

https://readwise.io

Readwise ReaderはReadwiseというサービスの派生サービスのようなものであり、親にあたるのはReadwiseだ。ではReadwiseはどのようなサービスかというと、PocketやKindleなどと連携させ、それらのハイライトを取り込んで集約できるというもの。取り込んだハイライトはReadwise上でタグを使って整理したり、反復学習の理論に則った間隔でリマインドメールを送らせたりして、記憶の定着を図ったりすることができる。Readwiseはこのような「読んだあと」にフォーカスしたサービスだったのが、最初に「読む」フェーズまで取り込もうとしているのがReadwise Readerだと言える。

このような成り立ちもあり、Readwise Reader上でもあらゆる記事は当然ながらハイライトしたり、メモを書いたりすることができ、Readwise側へも自動的に取り込まれる。PDFでもePubでも、形式は問わない。YouTubeの字幕にもハイライトできる。

[![Image from Gyazo](https://i.gyazo.com/30ba64777bc9797a0f4b16e309d287f8.jpg)](https://gyazo.com/30ba64777bc9797a0f4b16e309d287f8)

> [帝京大学通信課程での社会人大学生4年目を終えて - chroju.dev/blog](https://chroju.dev/blog/teikyo_university_learner_fourth_year)

さらに面白いのが、Readwise Readerのブラウザ拡張を使っている場合。拡張を入れた状態で、すでにReadwise Readerへ登録済みのページを表示すると、ブラウザで閲覧しながらそのままハイライトすることができる。ハイライト箇所はもちろん相互同期されるので、よくありがちな「過去に見たページをもう一回探し当てた」ときにも、以前読んだ箇所がすぐに見つけられる。

[![Image from Gyazo](https://i.gyazo.com/e4a4cb8a5c9b0368e2ad9a52d5db622d.png)](https://gyazo.com/e4a4cb8a5c9b0368e2ad9a52d5db622d)

また、属性情報に基づくフィルタリング条件を保存しておいて、ビューを自由に作れるのも嬉しい。初期設定では「1週間以内に開いたハイライト」や、「あとで読むに保存して、1週間以内に開いて途中まで読んだもの（最後に読んだ位置を保存してくれている）」といったフィルタが作られている。PDFやYouTubeの動画だけフィルタする、なんていう基本的なものもある。

今のところ新たに作ったのは2つで、「日本語の記事でまだ読んでいないもの」と「1か月以上前に保存したが、1か月以上開いていないもの」。英語の記事はPCでGoogle翻訳にかけながら読むことが多いので、外出中にサクッと日本語の記事を読みたいときに前者を使っている。後者はありがちな「あとで読む記事読まない問題」の対処として使うつもりでいる。

Readwiseは生まれてから5年以上は経っているようだが、Readerは2022年12月にPublic Betaになったばかりのまだまだ新しいサービスであり、不満や不具合らしきものもいくつか見受けられる。全体的にCJK周りの処理が甘いような感じはあり、検索でうまく引っかからなかったり、変換確定のEnterで投稿自体が確定してしまうといったものも見られる。日本人ユーザーが増えてフィードバックが増えれば改善も速まる気がするので、日本での利用も増えて欲しいところ。

利用には月額課金が必要になる。最終的にはReadwiseに内包されるような形になるようで、現在もReadwiseの有料プランを契約すると、Readerも使えるという形式になっている。GAした後は料金は上がる見込みだそうだが、Public Betaから使っているユーザーは据え置きになる予定だそうだ [^1] 。現状、これだけの機能を月$7.99で使えるのはなかなか安いんじゃないかと思っている。なお、最初の30日間はお試しで料金がかからない。

TwitterのAPI有料化をきっかけに、従来情報収集に使っていたMailbrewが使えなくなってしまった [^2] のを受けてReadwise Readerを使い始めた。Tweetでの情報収集がだいぶ厳しくなってしまった今、情報収集においてはRSS Readerが復権するんじゃないかな、という感覚が強い。

[^1]: "Regardless, we don't intend to increase pricing on existing full subscribers at that time. This means that if you subscribe while Reader is in beta, you'll get lifetime access for $7.99/month (billed annually) as part of our current Readwise Full plan." [The Next Chapter of Reader: Public Beta](https://blog.readwise.io/the-next-chapter-of-reader-public-beta/)

[^2]: もともと開発が低調ではあったが、2023年4月28日現在、開発チームから音沙汰もない。Twitter OAuthでのログインもできなくなり、締め出されたと訴えているユーザーも出てきている。 [Login is broke | Voters | Mailbrew](https://mailbrew.canny.io/feature-requests/p/login-is-broke)


