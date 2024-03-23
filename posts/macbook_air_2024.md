---
title: "MacBook Air (13-inch, M3, 2024) を買った話と、その初期設定"
date: "2024-03-23T13:10:00+0900"
tags: ["macbook", "gadget"]
---

<a href="https://gyazo.com/060a53f208064eb59987243f8b572339"><img src="https://i.gyazo.com/060a53f208064eb59987243f8b572339.jpg" alt="Image from Gyazo" width="1512"/></a>

大学を卒業する前に（25年春卒業を想定）、MacBookを学割で買い替えておこうと思って待ち構えていたところ、先日M3のMacBook Airが出たので購入した。特にこの3月ごろの時期は、学割購入時にはApple Gift Cardも24,000円分もらえるのでさらにお得に。

## First Impression

初めてApple Siliconを搭載した、MacBook Pro (13-inch, M1, 2020) からの買い替えなので3年ちょっとぶり。当時はまだTouch Barのあるモデルだった。いろいろ言われていたTouch Barだが、音量や明るさをスライダーで調整できる点などはわりと気に入っていたので、若干操作感の変化に戸惑いはある。

性能面の違いは然ることながら、10年ぶりぐらいにAirを買ったので、そのことによる変化が大きい。最近はAirでも24GBメモリを積めたり、十二分な性能になってきているので、あえてProを買う必要はないと判断した。Airであれば充電に必要な電力が30Wで済むので、 [Anker 511 PowerBank](https://www.ankerjapan.com/products/a1634) のような、バッテリーと充電器を兼ねた機器でも充電が可能になった。充電器とバッテリーの双方を携帯しなくてよくなったのはなかなか便利。

<a href="https://gyazo.com/52a2e29a6b4b864a394044d44bf58b35"><img src="https://i.gyazo.com/52a2e29a6b4b864a394044d44bf58b35.jpg" alt="Image from Gyazo" width="1512"/></a>

明らかに薄さがわかる、Airの楔形ボディが好きだったので、それが失われたのは残念ではある。それでもProと比べれば明らかに薄いし軽くて取り回しはしやすくなった。バックパックに入れて背負ったときの感覚も、数百グラムの差分だが結構違う。向こう5年ぐらいはこれで戦えたらと思ってたりする。

## 初期設定

軽く初期設定まわりの話も書いておく。

僕は新しいPCを買ったら、以前のマシンの中身をそのまま移行するということはせず、ゼロから環境を作り直している。定期的に強制的なクリーンナップをするのは大事。初期設定については https://github.com/chroju/dotfiles にだいたい集約している。

### Homebrew

Brewfileに以下のような形式でインストールするパッケージを書いておき、 `brew bundle` すると一気にインストールしてくれるので便利。継続的にメンテナンスとかはしていなくて、だいたいPCを買い替えたときに旧PCで `brew bundle dump` コマンドにより現在インストールしているものを出力し、不要なものを削除して新たなBrewfileとしている。

```bash
brew "asdf"
brew "bitwarden-cli"
brew "fzf"
...
cask "anki"
cask "bitwarden"
...
```

### `$HOME` 配下のファイル群

`~/.gitconfig` とか `~/.ssh/config` とか、 `$HOME` 配下に配置するファイル群。これについてはdotfilesのレポジトリに `HOME` というディレクトリを置いていて、例えば `HOME/hoge/fuga` のファイルのシンボリックリンクを `$HOME/hoge/fuga` に配置する、という形のシェルスクリプトを書いて対応している。今見ると2年ほど前に書いたなかなか頑張ったシェルスクリプトが出てきたけど、最近だともうちょいシュッとできるソリューションがありそうな気はする。

```bash
#!/bin/bash

function make_symlinks() {
    for f in $(ls -A $1); do
        src="$1/$f"
        dst="$2/$f"
        if [ -f $src ]; then
            if [ -e "$dst" ] && [ "$3" = '-f' ]; then
                echo "### WARN: overwrite $dst ###"
                ln -fs $PWD/$src "$dst"
            elif [ ! -e "$dst" ]; then
                echo "make symlink $dst => $src ..."
                ln -fs $PWD/$src "$dst"
            fi
        elif [ -d $src ]; then
            if [ ! -e "$dst" ]; then
                echo "make directory "$dst" ..."
                mkdir "$dst"
            fi
            make_symlinks $src $2/$f $3
        fi
    done
}

if [ "$1" = '-f' ]; then
  echo '!!! force mode'
fi

make_symlinks dotfiles/HOME $HOME $1
```

昔はAnsibleで頑張ったりしていた頃もあったが、もっと薄い仕組みでいいやという気分になり、シェルスクリプトに書き換えた経緯がある。

### 各種システム設定とdefaults

macOSの設定をターミナルから読み書きできる `defaults` というコマンドがある。 [Macの「ターミナル」でプロパティリストを編集する - Apple サポート (日本)](https://support.apple.com/ja-jp/guide/terminal/apda49a1bb2-577e-4721-8f25-ffc0836f6997/mac) に記載されており、特に隠し機能というわけでもないのだが、どんなコマンドを打てばどういう設定になるのか、という情報は公式に公開されておらず、有志が確認した情報頼りの状況。

OSのアップデートに伴い、コマンドが変わることもあり得る。例えばメニューバーにバッテリーのパーセント表示をするコマンドは、Big Sur以降とその前までとで、以下のように違いがある。

```diff
- defaults write com.apple.menuextra.battery ShowPercent YES
+ defaults write /Users/$_user/Library/Preferences/ByHost/com.apple.controlcenter.plist BatteryShowPercentage -bool true
```

Infrastructure as Codeチックなことができるので、できる範囲で使いたいところではあるのだが、上述の経緯があるのであんまり隅々までdefaultsで賄うことにはこだわっていない。知っているコマンドだけはスクリプトに列挙しておいて、効いたら儲け物、ぐらいで考えたほうがいいものと捉えている。

システム設定、その他ではだいたい以下のところをいじっている。

* キーボード
  * 「キーボードショートカット」→「修飾キー」から、CapsLockをControlに変更する
  * 「キーボードショートカット」→「ファンクションキー」→「F1、F2などのキーを標準のファンクションキーとして使用」を有効化
  * 「キーボードショートカット」→「Spotlight」は使わないので、すべてのショートカットを無効化
* トラックパッド
  * 「ナチュラルなスクロール」を無効化
  * 「ページ間をスワイプ」を無効化
  * 「通知センター（2本指で右端から左にスワイプ」を無効化
* Dock
  * 「自動的に表示/非表示」を有効化
  * すべてのAppを削除して、使用中のAppだけが表示されるようにする
    * Appは [Raycast](https://www.raycast.com/) から起動するので、Dockによく使うAppを置く必要がない
* Mission Control
  * 「最近の使用状況に基づいて操作スペースを自動的に並べ替える」を無効化
  * 「ホットコーナー」をすべて無効化
* 壁紙
  * 黒いものにする
    * メニューバーの色が壁紙を透かすので、黒い壁紙にするとメニューバーも黒くなり、ノッチが目立たなくなる

### GPG key

Git commitの署名などで使うGPG key。秘密鍵はYubikeyで管理しており、公開鍵はKeybaseに上げているので、公開鍵だけ引っ張ってきてあとはYubikeyを新たなPCに挿せば終わり。

### 認証情報系

Cloudflareとか各種クラウドサービスについては、新たに認証し直し、旧PCからCredentialを持ってきたりはしていない。APIキーが必要な場合はローテートする。

## 開発環境はこれから

とりあえず全般的な設定がこんな感じで終わってきたところで、個別に必要な開発環境などはまだこれから。なるべくローカル環境を汚さずにdevcontainerとか使うことを今度のマシンでは意識していきたい。このあたりは必要に合わせて徐々にやっていこうと思う。

あと、ターミナルは長年iTerm2を使ってきたが、今回 [warp](https://www.warp.dev/) を試してみている。コマンドの自動補完に用いていた [Fig](https://fig.io/) がちょうど開発終了を表明しており、後継のAmazon CodeWhispererに移っても良かったのだが、ちょっと趣向を変えてみようかなと。

https://www.warp.dev/

warpはターミナルアプリだが、補完機能も内包している。1回のコマンド実行とその出力が、UI上は「block」と呼ばれる区切られた範囲内で表示され、めちゃくちゃ長い出力とかでもblock内をiframeのような感覚でスクロールして見られるのがなかなかよかった。補完はFigほどではない感じがしているが、もう少しチューニングしつつ様子を見たい。

自分も若くなくなってはきたので、定期的に環境を入れ替える、ということは意識的にやっていかないといけない気がしてきている次第。
