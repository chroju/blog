---
title: "GitHub CLI に不可能はない"
date: "2021-03-21T11:17:22+0900"
tags: ["github"]
---

タイトルは誇張気味だが、 `gh` こと GitHub CLI こと [cli/cli: GitHub’s official command line tool](https://github.com/cli/cli) には任意の GitHub API を呼び出せる `gh api` サブコマンドがあるので、あながち間違ってもいない。サブコマンドが実装されていなくとも、アイデア次第で GitHub のあらゆる操作が gh から呼び出せる。

従来から強力な `api` サブコマンドだったが、実行結果は当然ながら JSON などの形式になるので、結果を整形するには jq を通す必要があった。これが先日の [1.7.0](https://github.com/cli/cli/releases/tag/v1.7.0) において、 jq のシンタックスを活用できる `--jq` オプションと、 [Go template](https://golang.org/pkg/text/template/) を活用できる `--template` オプションが実装されたことで、 gh コマンド単独であらゆる出力整形まで可能になった。

僕もコマンドラインツールをよく書くが、ある API を implement した CLI というのは、 API の発展に従って絶えず更新が必要だし、実行結果の出力形式をどうするかなかなか悩ましい部分も大きい。この `api` サブコマンドは、そういった問題を「ユーザーにぜんぶ編集可能とさせる」ことで根本的に解決している、発想の逆転がすばらしい。

いくつか僕の使っている alias の実例を挙げてみる。

### watch の管理

GitHub の watch は、かねてより GUI が貧弱だ。うっかりレポジトリの多い Organization に入ると一斉に多数のレポジトリが watch 対象になるなど事故りやすいが、 GUI からでは watch 解除は「全部解除」か「1つずつ解除」のいずれかしかできず、複数の対象をチェックして解除するような操作ができない。

<a href="https://gyazo.com/0fd8a4e3d480dab626fad1490641daa6"><img src="https://i.gyazo.com/0fd8a4e3d480dab626fad1490641daa6.png" alt="Image from Gyazo" width="600"/></a>

GitHub CLI で、 watch しているレポジトリ一覧の表示と、 watch 解除のコマンドを作ると、これがだいぶ楽になる。

```bash
$ gh alias set watches 'api /users/chroju/subscriptions --paginate --jq .[].full_name'

$ gh watches
chroju/dotfiles
chroju/todo.txt-cli
chroju/chef_web_server
...

$ gh alias set unwatch 'api -X DELETE /repos/$1/subscription'

$ gh unwatch chroju/dotfiles
```

あとは `gh watches` の結果をテキストファイルに書き出し、ファイルを開いて不要なレポジトリだけを残すよう編集し、そのファイルを `cat` して `xargs gh unwatch` していけば、一括で watch が解除できる。

### gitignore の生成

GitHub API から、さまざまな言語の `.gitignore` の雛形を取得できる。これも alias にしておくと便利だ。

```bash
$ gh alias set gitignore 'api /gitignore/templates/$1 --jq .source'

$ gh gitignore Go
# Binaries for programs and plugins
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test binary, built with `go test -c`
*.test

# Output of the go coverage tool, specifically when used with LiteIDE
*.out

# Dependency directories (remove the comment below to include it)
# vendor/
```

### レポジトリの検索

「なんかああいう名前のレポジトリあったよな」という朧気な記憶からググったりすることがよくあるが、これもコマンドにする。

```bash
$ gh alias set search 'api -X GET search/repositories -f q="$1" --template "{{range .items}}{{.full_name}} ⭐ {{.stargazers_count | color \"yellow\"}} ({{.description}}){{\"\\n\"}}{{end}}"'
```

結果はこんな感じ。Go template を用いると、出力の色も変えられるのが嬉しい。

<a href="https://gyazo.com/d295b1d84b6ada7abdbb50a52107be42"><img src="https://i.gyazo.com/d295b1d84b6ada7abdbb50a52107be42.png" alt="Image from Gyazo" width="600"/></a>

僕はレポジトリ名だけ出力するのが好きなのでそうしているが、 URL を表示するようにすれば、サクッとブラウザで開くこともできる。 [fzf](https://github.com/junegunn/fzf) などを通してシュッと開けるようにしておくのもよさそう。

### Atlantis の実行

Terraform の自動実行ツール [Atlantis](https://www.runatlantis.io/) はプルリクエストベースで動作する仕組みになっており、 `terraform apply` を実行するには、 PR コメントに `atlantis apply` と書き込む必要がある。これもブラウザから書き込むのは面倒なのでコマンド化してしまう。

```bash
$ gh alias set atlantis-apply 'pr comment -b "atlantis apply"'
```

この alias だとカレントディレクトリ、カレントブランチの PR に対して apply が実行される、かなり簡易的な形式になっているが、より安全な形式にするならば、 PR number やレポジトリを引数に取らせてもいい。

他、ここでは取り上げていないが REST API だけではなく GraphQL API にも対応している。また `gh` 単体で完結しない操作であっても、 `gh alias set --shell` オプションを使えば、シェルコマンドを挟んだワンライナーまでも alias 登録ができる。なので本当になんでもありだ。



## GitHub CLI の config をファイルで管理する

ここまで多くの設定ができるコマンドラインツールだと、 dotfile の考え方で、設定はファイル管理したくなる。現状、ドキュメントには記載がないが、 GitHub CLI の設定はデフォルトでは `~/.config/gh` 配下に YAML で保存されている。なお、設定ファイルの保存先ディレクトリは、環境変数 `GH_CONFIG_DIR` で自由に設定することもできる。 (see: https://github.com/cli/cli/pull/2444)

ファイルは OAuth token などが書かれた `hosts.yml` 、 GitHub CLI のバージョン情報が書かれた `state.yml` 、そして alias などの設定が書かれた `config.yml` の3種類がある。前者2つは秘密情報や動的な値を含んでいるので、 `config.yml` だけ dotfile 管理すればいいだろう。

```yaml
# What protocol to use when performing git operations. Supported values: ssh, https
git_protocol: ssh
# What editor gh should run when creating issues, pull requests, etc. If blank, will refer to environment.
editor:
# When to interactively prompt. This is a global config that cannot be overridden by hostname. Supported values: enabled, disabled
prompt: enabled
# A pager program to send command output to, e.g. "less". Set the value to "cat" to disable the pager.
pager:
# Aliases allow you to create nicknames for gh commands
aliases:
    watches: api /users/chroju/subscriptions --paginate --jq .[].full_name
    gitignore: api /gitignore/templates/$1 --jq .source
    unwatch: api -X DELETE /repos/$1/subscription
    search: api -X GET search/repositories -f q="$1" --template "{{range .items}}{{.full_name}} ⭐ {{.stargazers_count | color \"yellow\"}} ({{.description}}){{\"\\n\"}}{{end}}"
```

ウェブブラウザはつい脇道に逸れてしまったり、集中力を乱す要因になりがちなので、仕事中に触る機会は極力減らしたいと考えている。その上で GitHub CLI はかなり有意義なツールになりつつある。



