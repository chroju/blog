---
title: "Twitter (X) からの避難先としてPleromaを建てた"
date: "2023-10-23T10:01:57+0900"
tags: ["activitypub", "pleroma", "twitter"]
---

最近X（旧Twitter）からの避難先として [@chroju@pleroma.chroju.dev](https://pleroma.chroju.dev/users/chroju) を使い始めたので、そのあたりの背景などを書く。 [Pleroma](https://pleroma.social/) はMastodonのようなFediverseを実現するソフトウェアの1つで、ActivityPubに対応している。

ちなみにX（旧Twitter）を緩やかに離れたいな、みたいな気持ちは別ブログのほうに以前したためた。わりとPleromaを使っていけそうなので、今後の投稿メインはゆるゆるとPleromaのほうに移していきたいと考えている。Mastodonやmisskeyをやっていたらフォローを是非。

https://chroju.hatenablog.jp/entry/20230709/without_twitter

Twitterから心が離れる理由を掻い摘まんで書くと。フォローしていない人のツイートを目にしやすくなったとか、TweetDeckが使えなくなった、といった「見る」側の問題がいろいろあった。一方で、自分は最近こんな記事を書いて、こんなことに興味がありますよ、というのを時系列で書いて「見られる」ためのツールとしては重宝していたのだが、それも最近の仕様変更で、ログインしていない人には時系列でユーザーページを見てもらうことも困難になり、自分の活動を示すパブリックなタイムラインとしても活用が難しくなった、というのが離れたい一番の原因。

## Alt-Twitterに何を求めるのか

Twitterからの避難先はThreads、Mastodon、misskeyなど群雄割拠の様相を呈している。

避難先に求めることの第一はオープンであることだった。Twitterの仕様変更で、徐々に閉鎖的になっていくのが最もしんどかった。昨今の状況を鑑みると、特にActivityPubに対応していることを求めた。よってBlueskyやThreads（今後ActivityPub対応の予定があるとのことで、アカウントは取得したが）は候補にならなかった。

また、Twitterが運営者の一声でこうなってしまったことを考えると、第三者に運営を委ねるのではなくて、セルフホストするほうがいいのではないかと考えた。とはいえリソースを多く使うものは避けたいので、軽量な実装を調べた結果、行き着いたのが [Pleroma](https://pleroma.social/) だった。もちろん実際に使ってみないことには軽量かどうかはわからないが、いくらか先駆者の話を読んでみると期待ができそうに思えた。

* [Pleromaはいいぞ - PartyIX](https://h3poteto.hatenablog.com/entry/2019/12/09/180020)
* [軽量MastodonことPleromaインスタンスを立てたメモ - Lambdaカクテル](https://blog.3qe.us/entry/2023/04/09/220252#%E6%84%9F%E6%83%B3)

## Wildebeestというロマン

Pleromaを立ち上げる以前、 [Wildebeest](https://github.com/cloudflare/wildebeest) も一時期セルフホストして使っていた。これはCloudflareが開発していたActivityPub対応のSNSで、大きな特徴としてCloudflare WorkersをはじめとしたCloudflareスタックだけでホスティング環境が整う点にあった。最低月額$5というかなりの少額で運用が可能だった上、構築に必要なTerraformやCloudflareのコマンド実行もGitHub Actionsで定義されており、レポジトリをforkしてAPIキーなどを設定し、Actionを実行するだけで環境が整う、という手軽さがあった。

たださすがにいろいろと厳しかったようで、使ってみると様々な部分で動作が不安定であり、最終的には2023年7月にメンテナンス停止が告知された。エッジサーバーで動くSNS、というのは2023年っぽい実装ではあって期待したかったのだが、ロマンとして終わってしまった。

## Pleromaのセルフホスト

### インフラ

ホスティング環境としては、Kubernetes検証用に建てていたK3sを使っている。

PleromaはDockerイメージが公式には提供されていないのだが、READMEでいくらかサードパーティでの実装が紹介されており、そのうちの1つである [angristan/docker-pleroma](https://github.com/angristan/docker-pleroma) を使わせてもらっている。このレポジトリもイメージをビルドして公開するところまではしていないため、forkしてGitHub Actionでビルドすることにした。ほぼそのまま動いたが、設定ファイルである `config.exs` の「その他」に対するパーミッションが、最近のPleromaだと `0` になっている必要があり、その点だけ修正している（そういえばPRしても良さそうだ）。

```diff
- COPY ./config.exs /etc/pleroma/config.exs
+ COPY --chown=pleroma --chmod=440 ./config.exs /etc/pleroma/config.exs
```

なお外部公開には [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) を使っている。ngrokのようなものだが、Cloudflare DNSを使えば好きなドメインを当てることができ、最近の外部公開には全部これを活用している。K3sでcloudflaredをコンテナ起動させており、常時トンネルは開通した状態にあるので、あとはCloudflareのGUI側でどのドメインをどのポートにマッピングするかの設定だけで済む。

### データの永続化

データの永続化については基本的にはRDBであり、PostgreSQLを使う。これについてもコンテナでまかなっている。一方でファイルシステムに書き込むものとして、 [Static Directory](https://docs.pleroma.social/backend/configuration/static_dir/) と `uploads` がある。前者はフロントエンドで使う、例えばインスタンス全体の背景画像を設定できるのだが、そういったファイルが保存される。後者はユーザーが投稿した画像などの保存先だが、これはAmazon S3に変更することもできる。現状はそこまで画像を投稿するつもりもないのでローカルのままとした。いずれもPersistentVolumeを使い、フォルダパスは設定ファイル上で指定している。

```elixir
config :pleroma, :instance,
  static_dir: "/var/lib/pleroma/static"

config :pleroma, Pleroma.Uploaders.Local,
  uploads: "/var/lib/pleroma/uploads"
```

### config.exs

設定ファイルは `/etc/pleroma/config.exs` というものがあり、ここに基本的なものを書く。自分のインスタンスでは以下の設定をしており、K8s環境なのでConfigMapでマウントしている。

```elixir
# Shoutboxという簡易的なchat機能を無効化
config :pleroma, :shout,
  enabled: false

# UIを通じたユーザー登録の無効化
config :pleroma, :instance,
  registrations_open: false,

# 画像アップロード時のオプション
# mogrify -stripによりEXIFを削除する
# ファイル名の難読化を行う
config :pleroma, Pleroma.Upload.Filter.Mogrify, args: ["strip"]
config :pleroma, Pleroma.Upload,
  filters: [Pleroma.Upload.Filter.Dedupe,Pleroma.Upload.Filter.AnonymizeFilename,Pleroma.Upload.Filter.Mogrify]
```

おひとりさま用なので、新規登録を受け付けないようにするのは重要なポイント。自分のユーザーを作るにはどうするのか、という話があるが、 `pleroma_ctl` というCLIが内包されており、 `pleroma_ctl user new hogefuga hogefuga@example.com --admin` で作成できる。このとき `--admin` を付与すると、後述する管理者ユーザーとして振る舞えるようになる。

その他、 [Configuration Cheat Sheet - Pleroma Documentation](https://docs.pleroma.social/backend/configuration/cheatsheet/#static_fe) 全体をざっくり見て必要な設定を施せばよい。

### Admin FE

管理者ユーザーとしてログインすると、右上にタコメーターのようなマークが表示され、ここから管理者設定を触れる。多くは `config.exs` で設定できる内容ではあるが、一部はおそらくここからしか設定できない、あるいはここで設定したほうが簡単な気がしている。

僕が設定しているのは `Settings > Others > Term of Service` ぐらい。ToSはどうも一度Admin FEで編集しないと、 Static DirectoryにHTMLが出力されないように見える。

## 現状と感想

### ホスティングの状況

現状、スワップを有効化したt4g.small上でK3sを動作させており、そこには別のアプリケーションも載っているのだが、インスタンス全体でのCPU使用率は10％にも満たない値で推移しており、だいぶ安定している。まだフォロー/フォロワー数も投稿数も少ないというのはもちろんあるが、予想以上にリソースを食べる気配がなくて嬉しい。Gravitonのおかげというのもある。

### Static FEが好き

機能的にも、一般的に想定されるものはいずれも問題なく動く。Pleroma独特のところだとStatic FEというものが好きだ。これは設定でデフォルト無効になっているのだが、有効化すると、インスタンスに登録されているユーザーやポスト（status）のパーマリンクを開いた際、JavaScriptを用いない静的なHTMLで表示してくれる。

[![Image from Gyazo](https://i.gyazo.com/c4f6db5efc77500de879af85b756198c.png)](https://gyazo.com/c4f6db5efc77500de879af85b756198c)

PleromaのみならずMastodonでもmisskeyでもそうだが、ブラウザからアクセスすると、当然ながらSNSのアプリケーションとしてのUIが基本的には表示される。しかし、このPleromaはおひとりさま用で建てているがために、僕以外の人にとってはここにアプリケーションとしての価値はない。ならばSNS的な要素を削ぎ落とし、読むことに特化した静的なページとして表示すればよい、というのは良いアイデアだな、と感じた。冒頭に書いた通り、僕はこの手のSNSを「パブリックなタイムラインとしての自分の活動」を示すために使っているので、このStatic FEはまさにうってつけだった。

### TLをどう構築するか

おひとり様インスタンスなので不特定な投稿が乱入してくることはない。おすすめや広告の形で、フォローしていない見知らぬ人がTLに跋扈するようになったTwitterに比べてだいぶ快適になった。

一方で、逆に投稿が少なすぎて今は苦慮している。Mastodon界隈で付きものの「誰をフォローすればよいのかわからない」問題がある。Twitterでフォローしている人のActivityPubアカウントを探す手段もないし、自分のインスタンスには誰もいないので検索で探しようもない。あまり多量のフォローをする気もないのだが、日常的な情報収集も兼ねてもう少し欲しいところではあり、どうしたものかと考えている。

みんなどうしているのか。思いつくのはmstdn.jpのような大手のインスタンスで検索してみることぐらいだが。

### Elixirわからない問題

PleromaはElixirで実装されており、Dockerfileを読み解くにあたってmixコマンドぐらいは把握したが、コードは読めないし、今後学ぼうという気も現状あまりないのがどうなんだこれは、というのはある。その点だとRuby製のMastodonは敷居が低かったのかもしれない。あるいはPleromaを建てた後で知ったが、 [gotosocial](https://github.com/superseriousbusiness/gotosocial) というGoのActivityPub実装もある。

セルフホストしているとはいえ、Pleromaは他者が開発しているOSSであり、結局のところ誰かに依存している点から抜け出せてはいない。そのことを考えても、ある程度自分でコードを読み書きできるようになっておくべきだろうとは感じている。

あるいは自分でActivityPubを実装するか。最近 [このブログがFediverseに対応しました](https://blog.tyage.net/post/2023/2023-07-17-bridgy-fed/) や [kayamatetsu.com](https://kayamatetsu.com/) のように、静的なブログのようなサイトでありながら、ActivityPubに対応する例もあり、これについても興味は惹かれる。少なくともどのようなプロトコルなのかはもう少し把握したい。

### X（旧Twitter）との兼ね合い

Twitterをやめるということはないだろう、とは思っている。フォロー/フォロワーの関係性にしてもそうだし、Pleromaには現状人がいないので、災害時などに不特定多数の投稿から検索して状況を確認したい、という用途だと今後もTwitterの優位性は揺らがないんじゃないか。これ以上に人が集まるリアルタイムSNSが出てくる気はしないし、Twitterがそこまでユーザーを減らすこともなさそうではある。Threadsあたりか、どこかのmastodonインスタンスが超巨大になって、十分に代替可能になる、ということはあるかもしれないが。

ただ日常的な「SNS欲」を満たしたり、何かを自分がメインで投稿する場はPleromaにしていきたい、というつもり。
