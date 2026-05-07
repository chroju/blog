---
title: "tmux popupとfzfでClaude Codeを管理する"
date: "2026-05-07T09:12:15+0900"
tags: ["tmux", "claude-code", "fzf"]
---

Claude Codeの複数並列実行にあたり、tmuxを9年ぶりぐらいに引っ張りだして使っている。この用途では最近、 [zellij](https://github.com/zellij-org/zellij) などの、より新しいterminal multiplexersを使うケースや、 ターミナルエミュレータ自体をAI Agent利用に特化させた[cmux](https://github.com/manaflow-ai/cmux)を使うケースなどがあるが、いろいろ試した結果としてtmuxに落ち着いた。

tmuxは枯れている上に、カスタマイズの自由度が高いのがいい。当然ながらコマンドベースでtmux自体の情報取得や操作ができるし、一時的なターミナルをオーバーレイ表示するpopupや、今アクティブではないwindowへキーストロークを送れる `send-keys` など、高度に工夫できる機能も取りそろえられている。

## 基本的な使い方

使い方としては、シンプルにAgentごとでwindowを分けている。sessionはあまり分けてはおらず、開発用途のsessionとメモや情報整理のためのsessionを分けているぐらい。paneに関してもそんなに多く分割はしていない。だいたいはエディタとClaude Codeの2ペイン、必要に応じてzsh用にもう1ペイン分けたりもする。

なお、使っているエディタはNeovim。エディタとターミナルを1つにまとめたくて、VSCodeの使用をやめて今年から使い始めた。正直に言って設定を書くスキルはまったくないのだが、Vimの設定をそのままNeovimに移してくれとClaude Codeに依頼してやってもらった。ローカルのエディタ設定だから、ほぼvibingにしてしまってもいいだろうと割り切っている。プラグインとしては、その中身や名前からfuzzy検索してファイルを開ける [nvim-telescope/telescope.nvim](https://github.com/nvim-telescope/telescope.nvim) が非常に便利。

## fzfとpopupを利用したClaude Codeの管理

tmuxのpopupと [fzf](https://github.com/junegunn/fzf) を組み合わせて、すべてのwindowにおけるClaude Codeの状態（何かこちらの操作を待っているのか、処理が終わったのか……）を一覧表示するpopupを作っている。

![Claude Code in tmux](/images/2026-05-07/fzf-tmux-cc.png)

このpopupは `Ctrl - f` で呼び出せるようにしており、Claude Codeに何かひとつ指示を出したら、 `Ctrl - f` を押して状態を見守り、操作が必要なwindowが出てきたら、ここから選択してそちらへ行く……というのを繰り返している。popup内の「waiting」「working」といった状態表示はリアルタイムで更新され、カーソルを合わせれば右側に `tmux capture-pane` と `fzf --preview` を組み合わせたターミナル画面表示が出るようになっている。

他にも、「ローカルのGit repositoryを [ghq](https://github.com/x-motemen/ghq) とfzfで選択し、新しいtmux windowで開く」popupや、「popup内でローカルディレクトリ配下の全ファイルをfuzzy検索し、選択したファイル名をClaude Codeの `@filename` に渡す」popupなどを作っている。tmux自体の管理タスクをpopupに寄せればいつでも呼び出せる形になるので、並列でターミナルやAgentを動かして、それらをマネージしていく、という姿勢に非常にマッチする。

## Claude Codeの通知とtmux

tmuxでClaude Codeを扱う上でひとつ注意したい点として、Claude Codeからの「通知」をtmuxがパススルーしないという点がある。

https://github.com/anthropics/claude-code/issues/19976

Claude Codeの通知はOSC (Operating System Command)と呼ばれるエスケープシーケンスで行われるが、tmuxはOSCを吸収してしまってターミナル側へパススルーしない。もともと僕はClaude Codeの通知をターミナル（Ghostty）側の通知機能で処理していたのだが、これは動かなくなった。Claude Codeの通知処理では、Claude Code自体のhooksを用いている人も多いと思うので、あまり引っかかる人もいないかもしれない。

また、Claude CodeはカレントブランチにPull Requestがあると、status lineの位置にGitHub linkを出してくれたりするが、こういったターミナル上でのハイパーリンクもOSCで実現されているため、tmux内では動作しなくなる。致命的ではないものの、ちょっと不便なポイントではある。

## tmux status lineでの情報表示

![tmux status line](/images/2026-05-07/tmux-status-line.jpg)

tmuxのstatus lineは、これ期にかなりシンプルなものへ変更した。デザインは [binoymanoj/tmux-minimal-theme](https://github.com/binoymanoj/tmux-minimal-theme) を参考にさせてもらっている。

![tmux claude code rate limit](/images/2026-05-07/tmux-claude-code-rate-limit.png)

左側がsessionとwindowの一覧、右側はClaude Codeの使用率と [ccusage](https://github.com/ryoppippi/ccusage) 経由で取得しているClaude Codeの日次コスト。サブスク型で使っているのでコスト表示は正直要らないのだが、今日どれぐらい使っているかの目安としてなんとなく表示している。Claude Code関連の情報は、以前はClaude Code自体のstatus lineに表示していたが、Claude Codeを使っていないときにも知りたい情報なので、tmux側へ移した。使用率のほうは値によって色が変化して教えてくれる。

![tmux window list](/images/2026-05-07/tmux-window-list.jpg)

左側のwindow一覧は、Claude Codeの状態に合わせて表示が変わり、通知がある時は黄色、単に処理が終了したときは緑にしている。いずれもClaude Codeのhooksを用いていて、通知のときはbellを送信、終了時はtmuxのカスタム変数 `@claude_done` を操作して、それぞれwindow名の表示にstyle反映させている。

## 枯れた技術とClaude Codeの相性

ここまで書いたカスタムもだいたいはClaude Codeに書かせている。tmuxはもう20年使われているソフトウェアなので、Claude Codeからでも十二分に設定編集ができるし、自身も過去に使っていた経験があり、どう使えば便利になりそうか、アイデアを練りやすいのがいい。
