---
title: "Claude CodeをDev Containersで動かすのはとても大変だった"
date: "2026-06-27T15:43:00+0900"
tags: ["claude-code", "devcontainer", "docker"]
---

Claude Codeに限らずAI Coding Agentはやはり隔離した上で自律動作させたいのだが、今のところ決定打がないようにも感じている。僕の場合はdevcontainer（Dev Containersなのか何なのか正式表記がわからないが）を使って、だいぶ試行錯誤してある程度形になったので、その顛末を書いておく。

なお、今回の対象はファイルシステムの隔離であり、ネットワークの隔離はしていない。

## なぜdevcontainerか

Claude Codeの実行環境を隔離する手段はいくつかある。Claude Code自体にも `/sandbox` コマンドがあるし、 [cage](https://github.com/Warashi/cage) のようなサードパーティツールもある。ただ、macOSの `/sandbox` にはSecurity.frameworkのTLS検証がブロックされてGo製のCLIツール（gh、terraform、kubectl等）が軒並み壊れるという問題がある。

https://github.com/anthropics/claude-code/issues/23416

SREとしてはこれらのツールが使えないのはかなり痛い。devcontainerを選んだのはそういった制約を回避できるのと、プロジェクトごとに環境を定義して `.devcontainer/devcontainer.json` としてシンプルに管理できるのがよかった。隔離だけが目的なら他の手段のほうが手軽だが、開発環境の定義と隔離を兼ねられるのがdevcontainerの利点だと思っている。

ただ、素朴に `ubuntu:24.04` のコンテナを立ち上げてClaude Codeを入れただけでは、いろいろと足りないものがある。Claude Codeの公式ドキュメントにもdevcontainerのページがあり、リファレンスとなる設定一式が公開されている。

https://code.claude.com/docs/ja/devcontainer

このリファレンスでは認証の永続化やネットワーク制限までカバーされていて参考になるのだが、自分の環境に合わせてカスタマイズしていくとなると、いくつか考えるべきことがあった。

ちなみに冒頭にも書いた通り、ネットワークの隔離は今回スコープ外なのだが、Claude Codeのリファレンスでは [init-firewall.sh](https://github.com/anthropics/claude-code/blob/main/.devcontainer/init-firewall.sh) という、ネットワーク隔離のためのスクリプトが公開されている。iptablesでClaude Codeが必要とするドメイン以外へのアウトバウンドをブロックする仕組みだが、allowlistに含まれないドメインへのアクセスは全部落ちるので、WebSearchやMCP経由の外部サービス接続も使えなくなる。頑張れたらこのあたりもやっていきたい。

## 著者の環境

参考として書いておくが、著者の環境はmacOS上のGhosttyでtmux -> devcontainer -> Claude Codeという構成で動かしている。コンテナの実行にはrootlessに動けるPodmanを使っており、devcontainerの管理は [devcontainers/cli](https://github.com/devcontainers/cli) による。

## 設計の考え方

devcontainerの設定をしていくと、「コンテナ内で設定するもの」「ホストからファイルとして共有するもの」「ホスト側で動的に取得してコンテナへ渡すもの」の3種類に分かれることに気づく。この分類を意識しておくと設定の見通しが良くなるので、それぞれ書いていく。

## コンテナ内で設定するもの

ホストから持ち込む必要がない、コンテナ内だけの設定は主に `features` と `containerEnv` を使うことになる。

```json
"features": {
  "ghcr.io/devcontainers/features/common-utils:2.5.9": {
    "configureZshAsDefaultShell": true,
    "username": "chroju"
  },
  "ghcr.io/devcontainers/features/git:1.8.12": {},
  "ghcr.io/devcontainers/features/github-cli:1.0.17": {},
  "ghcr.io/anthropics/devcontainer-features/claude-code:1.0.5": {}
},
"containerEnv": {
  "TERM": "xterm-256color",
  "COLORTERM": "truecolor",
  "TZ": "Asia/Tokyo"
}
```

`features` はdevcontainer向けのpackageのような仕組みであり、開発に必要なツール群が様々提供されている。Claude Codeについては、ありがたいことにAnthropics公式のfeatureがあるのでこれを活用している。

`containerEnv` もコンテナ内の設定。タイムゾーンのように静的でコンテナ全体に効かせたい値はここに入れている。似たものに `remoteEnv` があるが、こちらはシェルセッションにしか適用されない。 `TZ` みたいな設定はバックグラウンドプロセスにも効いてほしいので `containerEnv` のほうが適切だと思っている。

またdevcontainer-cliには `--dotfiles-repository` というオプションがあり、指定したdotfilesリポジトリをコンテナ作成後に自動でクローンして、リポジトリ内の `install.sh` を実行して設定までしてくれるという仕組みがある。シェルを始め各種設定ファイルの持ち込みや、コマンドによる初期設定はここでやっており、Claude Code featureでインストールされるバージョンは最新とは限らないので、この `install.sh` の中で `npm i -g @anthropic-ai/claude-code` を実行して最新版に上書きしたりもしている。コンテナ内の環境を自分好みにする処理はだいたいdotfilesに集約されている。

## ホストからファイルとして共有するもの（bind mount）

ホスト側に存在するファイルをコンテナと共有するのがbind mount。ここが今回一番面倒だった。

公式のリファレンスでは `~/.claude` ディレクトリ全体をnamed volumeとしてコンテナへマウントしている。設定やセッション履歴がコンテナの再作成をまたいで保持されるので便利な方式だ。

```json
"mounts": [
  "source=claude-code-config-${devcontainerId},target=/home/node/.claude,type=volume"
]
```

ただ、macOSをホストにしている場合、 `~/.claude` の中身をそのまま共有するのは問題がある。Claude Codeの認証情報の保存先はプラットフォームによって異なり、macOSではKeychainに保存されるが、Linuxでは `~/.claude/.credentials.json` というファイルに保存される。macOS上にも `.credentials.json` は存在するのだが、中身は空のまま使われていない。ホストとコンテナで認証方式が異なるので、 `~/.claude` を丸ごと共有すると認証まわりで不整合が起きうる。

そこで `~/.claude` 全体ではなく、必要なファイルを個別にbind mountする方式にした。最終的にはこういう構成になった。

```json
"mounts": [
  "source=${localEnv:HOME}/.claude/projects,target=/home/user/.claude/projects,type=bind",
  "source=${localEnv:HOME}/.claude/sessions,target=/home/user/.claude/sessions,type=bind",
  "source=${localEnv:HOME}/.claude/.credentials-devcontainer.json,target=/home/user/.claude/.credentials.json,type=bind",
  "source=${localEnv:HOME}/.claude/settings.json,target=/home/user/.claude/settings.json,type=bind,readonly",
  "source=${localEnv:HOME}/.claude/history.jsonl,target=/home/user/.claude/history.jsonl,type=bind",
  "source=${localEnv:HOME}/.claude.devcontainer.json,target=/home/user/.claude.json,type=bind"
]
```


認証情報については、ホスト側に `~/.claude/.credentials-devcontainer.json` というdevcontainer専用のファイルを用意して、コンテナ内の `~/.claude/.credentials.json` としてマウントしている。最初にどれか1つのコンテナ内で `claude` にログインすると認証情報がこのファイルに書き込まれ、bind mountなので以降は別のプロジェクトのdevcontainerでもログイン不要になる。ホスト側の空の `.credentials.json` とは別ファイルなので、macOS側のClaude Codeと干渉する心配もない。

`~/.claude.json` に関しては、ホスト側のほうがより制約を厳しく、devcontainer内では緩めにと分けたかったので、devcontainer用に `~/.claude.devcontainer.json` という別ファイルをホスト側に作って、コンテナ内では `~/.claude.json` としてマウントするようにした。

### sessionsの共有には制約がある

sessionsのマウントには注意が必要で、これでホストとコンテナの間でセッションが完全に共有されるわけではない。Claude Codeのセッションはカレントディレクトリの絶対パスに紐づいている。ホスト上では `/Users/chroju/project` だったパスが、コンテナ内では `/workspaces/project` になるので、パスが一致せずセッションは引き継がれない。

このマウントの目的は、コンテナを再作成しても会話履歴が消えない（永続化）ことと、同じワークスペースパスを持つ複数のdevcontainer間での共有に限られる。ホストの会話の続きをコンテナで、みたいな使い方はできないので、そこは割り切っている。 `workspaceFolder` をホスト側と同じパスに設定すれば一致させられるかもしれないが、今のところそこまではしていない。

### Podman / SELinux環境への配慮

Podman + SELinux環境だとbind mountがSELinuxのラベル不一致で拒否されるという問題がある。これに対しては `runArgs` に `--security-opt label=disable` を入れることで対処した。このオプションはDocker Desktopでも無害なので、環境を問わず無条件で付与するようにしている。SSH agent forwardingのマウントに関しても `relabel=shared` を付けており、これも同じ対策。

## ホスト側で動的に取得してコンテナへ渡すもの

`GH_TOKEN` やSSH agent socketのパスのように、ホスト側の状態に依存する値はbind mountでは渡せない。これには `initializeCommand` と `--env-file` を組み合わせて対処している。

`initializeCommand` はコンテナ起動前にホスト側で実行されるコマンド。僕は `devcontainer-init` というスクリプトを用意して、ここで以下のようなことをやっている。

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "GH_TOKEN=$(gh auth token)" > .devcontainer/.env.devcontainer
echo "SSH_AUTH_SOCK=/home/chroju/.ssh-agent.sock" >> .devcontainer/.env.devcontainer

# Podman VM越しにSSH agentをフォワード
if ! pgrep -f "podman machine ssh.*ssh-agent.sock" > /dev/null 2>&1; then
    podman machine ssh -- -R /tmp/ssh-agent.sock:"${SSH_AUTH_SOCK:-}" -N &
fi

# .env.devcontainer.local でプロジェクト固有の環境変数を追加
if [ -f .devcontainer/.env.devcontainer.local ]; then
    cat .devcontainer/.env.devcontainer.local >> .devcontainer/.env.devcontainer
fi

# bind mountに必要なファイルの存在を保証
touch "$HOME/.claude/.credentials-devcontainer.json"
if [ ! -f "$HOME/.claude.devcontainer.json" ]; then
    echo '{"hasCompletedOnboarding": true}' > "$HOME/.claude.devcontainer.json"
fi
```

`gh auth token` でホストのGitHub認証トークンを取得して `.env.devcontainer` に書き出し、 `runArgs` の `--env-file` でコンテナ起動時に環境変数として注入する。Podmanを使っている場合はVM越しのSSH agent forwardingもここでセットアップしている。

`.env.devcontainer.local` という仕組みも入れていて、プロジェクト固有の環境変数（APIキーなど）があればここに書いておくと `.env.devcontainer` にマージされる。 `.env.devcontainer` 自体は毎回生成し直されるので、gitignoreに入れておけばシークレットがリポジトリに入る心配はない。

また、bind mountのターゲットとなるファイルが存在しないとコンテナの起動に失敗するので、 `touch` や初期値の書き込みで存在を保証するのもこのスクリプトの役割。

## Agent Skillとdotfilesへの集約

ここまで書いたような設定を毎回手で書くのは面倒なので、Agent Skillとしてまとめた。一応汎用的に使えるskillにはなっているはずである。

https://github.com/chroju/skills

devcontainerの設定はプロジェクトごとに `.devcontainer/devcontainer.json` が必要になる。認証情報やSSH鍵のマウントといった共通部分は使い回せるのだが、プロジェクトによって必要なdevcontainer featuresが違う（Node.jsが要るのか、Pythonが要るのか、Terraformが要るのか……）し、JSONをそのままコピーするだけでは済まない。そこでskill化してセットアップしやすくしておいた。このskillと、先述した `devcontainer-init` を含め、個人的な設定はdotfiles内に整備することで、環境は成り立っている。


## 余談

今回devcontainerでClaude Codeの隔離を試みたが、最適解だったかはよくわからない。僕は普段からdevcontainerを使っているわけではなかったので、Claude Code用にゼロから生成するこの方式が成り立っているが、すでにdevcontainerがセットアップされたプロジェクトで開発する場合などはちょっと手間になりそうだ。skillを頑張れば、既存設定とmergeして上手いことやらせる、といったことも考えられるかもしれない。

