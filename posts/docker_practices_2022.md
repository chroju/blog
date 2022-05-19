---
title: "2021〜22年頃のDockerfile事情"
date: "2022-02-28T09:17:31+0900"
tags: ["docker"]
---

先日 [GitHub ActionsでDocker Buildするときのキャッシュテクニック - cockscomblog?](https://cockscomb.hatenablog.com/entry/2022/02/16/092538)  を読んで、Dockerに関して最近の動向があまり追えていないなぁ、と思ったのでいろいろと調べてみたことをまとめる。

## Export cache

先のエントリーの `type=gha` cache は BuildKit の export cache における機能の1つ。

export cache には `gha` の他に、 `inline` 、 `registry` 、 `local` の3タイプがある。 inline は image と一緒に cahce をメタデータに書き込んでレジストリへ送る。 registry は image とキャッシュを分けて、キャッシュは cache manifest という形式でレジストリへ送る。ghaはGHA最適化であり、 local は読んでそのままローカルにキャッシュを出力する。

`inline` はmin modeでしか使えない制約がある。min modeは結果イメージのレイヤーしかキャッシュしないが、max modeはすべてのレイヤーをキャッシュする。

そのため `registry` でmax modeを使うほうがよいのだが、これについてはコンテナレジストリによってはcache manifestに対応していない場合がある。例えばAmazon ECRは対応していない。ECRを使っていて `registry` を使いたい場合、cache manifestに対応した、例えばGitHub Container Registryへcacheだけを送る、という荒技もあるようではある。

https://github.com/aws/containers-roadmap/issues/876

GitHub Actionsでキャッシュするなら、わりと何も考えずに使える `gha` が便利。ただし、現段階ではexperimentalであることは念頭に置いたほうが良さそう。その点を懸念するのであれば、 `type=local` を [actions/cache](https://github.com/actions/cache) と一緒に使うのが穏当か。

## apt-get upgrade in Dockerfile

Dockerfile内で `apt-get upgrade` など、 base imageに含まれるパッケージを一括でアップグレードする書き方は従来非推奨になっていたが、これは現在非推奨ではなくなった。

https://github.com/docker/docker.github.io/pull/12571

非推奨ではなくなっただけで、推奨になったというわけではない。Dockerfileで `apt-get upgrade` を書くかどうかは是非が分かれるところだと思う。base imageのパッケージに脆弱性があった場合、それに対処できる可能性があるが、一方でコンテナビルドの冪等性は失われることになる。

僕としては `apt-get upgrade` して良いのではないかと考えている。理由としては先のPRを提案したItamar氏の [The worst so-called “best practice” for Docker](https://pythonspeed.com/articles/security-updates-in-docker/) にほぼ同意するところ。昨年 [Docker Hub公開イメージ400万の半数に重大な脆弱性が見つかる](https://www.infoq.com/jp/news/2021/03/dockerhub-image-vulnerabilities/) というレポートもあった通り、Docker Hub上のOfficial Imageであってもパッケージに脆弱性がある場合は少なくない。正攻法としてはImage提供元に連絡してアップグレードしてもらうことだが、実際にコンテナビルドしていてもそれほど早く脆弱性対応されている状況とは認識できていない。ならば `apt-get upgrade` してこちらで対応してしまうのはありだと思う。冪等性に関してはビルド済みのイメージに対して求めれば運用上は十分であり、「同じDockerfileからビルドすれば同じものができる」状態はあまり求めていない。

## RUNを1行で書くか否か

かつては「`RUN`の中でコマンドを `&&` で繋げて1行で書きましょう」というのが盛んに言われていた。マルチステージビルドの登場によりこの状況は変わりつつある。中間イメージのレイヤー数は最終イメージに影響しないので、中間イメージの中であれば `RUN` を1行で書かなくても良いという話。

ただ注意しなくてはならないのは、 `RUN` を1行にまとめていた理由はレイヤー数の問題だけではなく、レイヤーキャッシュの観点もあったということ。1行にまとめていたコマンドを複数行に分けることで、キャッシュも別々に取られることになるわけだが、それで不都合がないかは気をつける必要がある。

今回調べていてよく目にしたのが、 `RUN apt-get update && apt-get install hoge` も複数行に `RUN apt-get update` と `RUN apt-get install hoge` で分けられますという話だが、これを分けて嬉しい場面はそれほど多くない気がしている。例えばインストールするパッケージを追加したくて後者を `install hoge fuga` に変更したとする。このとき `apt-get update` のレイヤーは、コマンドに変更がないのでキャッシュが使われたままになり、 `fuga` は古いバージョンのパッケージがインストールされる可能性がある。このことは [Best practices for writing Dockerfiles | Docker Documentation](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#run) の中でも言及されている。

なお、 `&&` で繋げて書く記法は煩わしいものではあるが、 `docker/dockerfile:1.4` でヒアドキュメントが導入されており、こちらのほうがいくらかマシかなと感じている。

```Dockerfile
syntax = docker/dockerfile:1.4
FROM debian
RUN <<eot bash
  apt-get update
  apt-get install -y vim
eot
```

## Dockerfile syntax

Dockerfile syntaxもどんどん新しい記法が取り入れられており、 [buildkit/syntax.md at master · moby/buildkit](https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/syntax.md) にまとめられている。新しい記法はDockerfileのバージョンによって使用可否が変わるので、使いたい記法に合わせてファイルに `# syntax=docker/dockerfile:1.3` というフラグを1行入れる必要がある。

特に ` RUN --mount=...` 記法は非常に便利。`--mount=type=hoge` の `hoge` 部分によって機能がまったく異なるので一言ではまとめづらいのだが、すべて目を通しておくと良さそう。例えば ` RUN --mount=type=cache,target=/root/.cache/go-build go build ...` とすると、ディレクトリ指定でのキャッシュを取ることができ、パッケージインストールなどで効果を発揮する。`--mount=type=secret` では、例えばビルド時に一時的にAPI実行で必要なキーなどを秘匿的に読み込み、最終イメージには焼き込まないようにできる。

## Digression

AWSとかTerraformとかDatadogとかはわりと追えているんだけど、Dockerfileに関しては全然追えてね〜〜という感じだったのが身に染みた。まぁ、こういうのは気付いた段階でGitHub Releaseとか公式ブログとかをちまちまRSS Readerに突っ込んでいく他ないとは思うのだが、CloudNative界隈に携わっていると本当に追うものが多くて大変という感じ。一度調べてベストプラクティスに則った設計が出来たぞいと思っていても、1年ぐらい経つとすでにDeprecatedですなんてことはざらにある。情報をザッピング的にサクサクと仕入れていく必要性をひしひしと感じているのだが、このあたりはみなさんどうやって効率よく情報を集めているんだろうなぁ、って思う。そしてこういう「定常的な更新確認」においては、やはり2022年においてもRSSが欠かせないな、とも思う。
