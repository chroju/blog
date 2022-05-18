---
title: "Alfred で複数行文字列からの候補選択を簡単に実現する"
date: "2021-05-01T09:14:03+0900"
tags: ["alfred", "go"]
---

[Alfred](https://www.alfredapp.com) が好きなのだが、カスタマイズして使うのは結構面倒というジレンマがある。有償の [Alfred Powerpack](https://www.alfredapp.com/powerpack/) を購入すると、自分で好きな検索→アクションさせることができる（という話は [Alfred は「黒い窓」を使わなくなってからが本番 - the world as code](https://chroju.dev/blog/how_to_make_alfred_workflow) に書いた）ものの、検索候補を Alfred に渡すには、以下のような JSON format を使う必要がある。

```json
{"items": [
    {
        "uid": "desktop",
        "type": "file",
        "title": "Desktop",
        "subtitle": "~/Desktop",
        "arg": "~/Desktop",
        "autocomplete": "Desktop",
        "icon": {
            "type": "fileicon",
            "path": "~/Desktop"
        }
    }
]}
```

Alfred での検索画面というと下図の形でお馴染みだと思うが、これで言えばインクリメンタル検索の対象となる白い大きな文字が `title` 、その下に薄い文字色で書かれているのが `subtitle` になる。また、これら検索候補のいずれかを選択すると、それに応じて「ファイルを開く」「URLを開く」といったアクションに連携されるわけだが、そのアクションに引き渡す URL やファイルパスにあたるのが `arg` だ。

<a href="https://gyazo.com/43ffdb9dd4b64926f89de6e8d8357ca1"><img src="https://i.gyazo.com/43ffdb9dd4b64926f89de6e8d8357ca1.png" alt="Image from Gyazo" width="557"/></a>

Alfred をきちんと使うのであれば、こういった各項目を設定していく必要が出るが、時に複数行文字列を渡せばイイ感じに検索させてほしいなと思うときがある。となると bash でシュッとスクリプトを書きたくなるのだが、 JSON の生成をシェルスクリプトで扱うのはかなり難しい。そこで、複数行文字列を渡せばざっくりと Alfred JSON Format に変換してくれるツールを作った。

https://github.com/chroju/alfrednize

例えばローカルで Git レポジトリ管理を行うツールである [x-motemen/ghq](https://github.com/x-motemen/ghq) と組み合わせてみると、以下のような出力を得られる。

```bash
$ ghq list | head -n 5
github.com/chroju/og-image
github.com/chroju/dotfiles
github.com/chroju/parade
github.com/miiton/Cica
github.com/chroju/homebrew-tap

$ ghq list | alfrednize | jq | head -n 18
{
  "items": [
    {
      "uid": "github.com/chroju/og-image",
      "title": "github.com/chroju/og-image",
      "subtitle": "",
      "arg": "github.com/chroju/og-image",
      "match": "github.com/chroju/og-image",
      "autocomplete": "github.com/chroju/og-image"
    },
    {
      "uid": "github.com/chroju/dotfiles",
      "title": "github.com/chroju/dotfiles",
      "subtitle": "",
      "arg": "github.com/chroju/dotfiles",
      "match": "github.com/chroju/dotfiles",
      "autocomplete": "github.com/chroju/dotfiles"
    },
```

見てわかる通り、 JSON の中身は妥協の産物で、各項目すべて同じ内容になっている。細かいことは何もできなくていいので、複数行文字列から候補選択し、選択した文字列をそのまま次へ渡せれば OK 、というつもりで作っている。選択した文字列の加工が必要であれば、 bash でどうとでもできるだろう。

これを Alfred Workflow で設定すると、ローカルの Git レポジトリを検索するツールがシュッと完成する。あとは選択結果を `code` コマンドに渡せば VSCode で開けるし、あるいはブラウザで開かせてもいい。

<a href="https://gyazo.com/4507c51c30b7152734d4f8f4b8a2db57"><img src="https://i.gyazo.com/4507c51c30b7152734d4f8f4b8a2db57.png" alt="Image from Gyazo" width="557"/></a>

複数行文字列を渡すだけで Alfred Workflow が使えるのは結構便利で、[junegunn/fzf](https://github.com/junegunn/fzf) にかなり近い感覚で Alfred を扱えるようになる。 JSON 生成が必要であるがために、これまでは Workflow を作るだけで何かプログラミング言語を使うことがほぼ必須だったが、 alfrednize があれば bash だけで簡単に作れるようになったのもメリットとして大きい。先の例のように何かコマンドの実行結果を渡すのでもいいし、静的な検索であれば、何かをリストアップしたファイルを作ってシンプルに `cat` するだけでも使える。
