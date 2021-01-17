---
title: "YubiKey + GPG で統一的な鍵の管理を行う"
date: "2021-01-17T19:04:25+0900"
---

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">$5,000で Let&#39;s Encryptを12時間ご利用いただけます。次の12時間で$5,000を寄付しましょう！お礼の印として、<a href="https://twitter.com/Yubico?ref_src=twsrc%5Etfw">@Yubico</a> よりSecurity Key NFCを無料でお受け取りいただけます (送料はかかりません)！<a href="https://t.co/swycXbtpSz">https://t.co/swycXbtpSz</a> <a href="https://t.co/QJwoWKWKS8">pic.twitter.com/QJwoWKWKS8</a></p>&mdash; Let&#39;s Encrypt (@letsencrypt) <a href="https://twitter.com/letsencrypt/status/1288733908771561473?ref_src=twsrc%5Etfw">July 30, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

昨年、 [Let's Encrypt](https://letsencrypt.org/ja/) が寄付の返礼として [YubiKey](https://www.yubico.com/%E3%83%97%E3%83%AD%E3%83%80%E3%82%AF%E3%83%84/?lang=ja) をプレゼントするキャンペーンを行っていて、以前より YubiKey には興味があったので入手していた。その後長らく放置してしまっていたのだが、前回 [Macbook Pro (13-inch, M1, 2020) を購入した - the world as code](https://chroju.dev/blog/m1_macbook_pro) で書いた通り、 PC を新調して移行するにあたり、 GPG 周りを改めて YubiKey を使ってセットアップしてみた。

なお補足すると、先のツイートの `$5,000` は `¥5,000` の誤りであり、入手できた YubiKey は [YubiKey 5 NFC](https://www.yubico.com/jp/product/yubikey-5-nfc/) である。

## YubiKey とはなにか

機能は非常に多い。検索するとワンタイムパスワードトークンだとか、二要素認証デバイスなどと記述されている場合があるが、機能はそれだけにとどまらない。国内正規代理店である株式会社ソフト技研の記事 [YubiKey 5 の機能【YubiKeyとは-part2】](https://www.yubion.com/post/yubikey-5-%E3%81%AE%E6%A9%9F%E8%83%BD%E3%80%90yubikey%E3%81%A8%E3%81%AF-part2%E3%80%91) からリストアップしてみる。

* FIDO U2F
* FIDO2 or WebAuthn
* OTP (One-time Password)
* TOTP (Time-based One-time Password)
* スマートカード機能（クライアント証明書の格納、 OpenPGP 秘密鍵の格納）

今回試したのは最後のスマートカード機能であり、 OpenPGP の秘密鍵を格納して、 PGP による署名、認証等に用いることができるようにした。

他の機能を概観すると、 OTP は、 YubiKey 本体のアイコン部分をタッチしたり、 YubiKey 5 NFC の場合は NFC で通信することによって生成される（ちなみに、あのアイコンをタッチすると指紋認証できるのではと勘違いしていたが、 YubiKey に生体認証の機能はない）。僕が使っているパスワードマネージャー [Bitwarden](https://bitwarden.com/) のプレミアム機能と連携できるようだが、現状非プレミアムで使っているため試すに至っていない。 TOTP はいわゆる二段階認証のそれだが、スマホアプリでの認証との比較優位が見い出せなかった。 FIDO, FIDO2 については正直技術的に理解しきれていない部分があり、どこかのタイミングで勉強できればと思っている。

## PGP, OpenPGP, GPG

名前が似ていて PGP, OpenPGP, GPG を混同しがちだったが、関係性をまとめると以下のようになる。

* Phil Zimmermann が開発した暗号ソフトウェアが PGP (Pretty Good Privacy)
* PGP を元にして、 RFC で定められた暗号文、デジタル署名などの規格が OpenPGP
* OpenPGP を元にして、 GNU により公開されているソフトウェアが GPG (GnuPG)

GPG には暗号関連の技術で実現する機能の多くが実装されている。公開鍵暗号、デジタル署名、一方向ハッシュ関数、鍵リングの管理など。今回はこの GPG を用いて Git commit へのデジタル署名と、 ssh key の管理を実現し、その鍵の管理に YubiKey を用いることにした。

PGP や GPG については [結城浩『暗号技術入門 第3版　秘密の国のアリス』 (2015, SBクリエイティブ)](https://www.amazon.co.jp/dp/B015643CPE/) を参考として学んだ。

## 今回実践したこと

今回の実践にあたって、参考としたのは主に以下の資料。

1. [Guides – Yubico](https://support.yubico.com/hc/en-us/sections/360003997900-Guides)
2. [drduh/YubiKey-Guide: Guide to using YubiKey for GPG and SSH](https://github.com/drduh/YubiKey-Guide)
3. [GnuPG チートシート（鍵作成から失効まで） | text.Baldanders.info](https://text.baldanders.info/openpgp/gnupg-cheat-sheet/)

1\. が YubiKey を販売している Yubico の公式ガイドにあたる。基本的にはこれに従うべきとは思うが、かなりリンクが多くて目的のドキュメントが探しづらかったり、各ページの記載がコマンドを step by step で実行するだけのものが多く、そのコマンドが何を意味するのか掘り下げづらいなど、少々難を覚えた。 2. は執筆者の素性を把握していないのだが、 YubiKey + GPG についてより詳しく手順が解説されており、公式ガイドよりこちらを多くは参照していた。 GPG のコマンドチートシートとして、合わせて 3. を参照した。

先述した通り、やりたいことは「Git commit へのデジタル署名」と「ssh key の管理」の2つで、これを実現するために以下の手順で作業を行った。細かい手順は先の資料に記載があるのでここでは再説明せず、ポイントだけ書いておく。

1. GPG キー (master key x1, sub key x3) の生成
2. sub key の有効期限設定
3. 生成したキーの YubiKey への import
4. ローカルマシン側の master key と失効証明書の退避
5. keybase への鍵登録
6. Git commit への署名設定
7. ssh key として GPG キーを使用するための設定
8. 移行後のマシンで YubiKey 内のキーを使用するための設定

### GPG キーの生成

GPG には master key （主鍵）、 sub key （副鍵） の概念が存在する。 master key の公開鍵は公開鍵基盤で広く公開するため、それと紐付く秘密鍵は厳重な管理が求められる。そこで実際の暗号化や署名には master key を直接は使わず、 master key が署名した sub key を用いる。sub key は署名用、暗号化用、認証用の3種類を作るのが一般的になっている。

手順は Yubico の [Using Your YubiKey with OpenPGP – Yubico](https://support.yubico.com/hc/en-us/articles/360013790259-Using-Your-YubiKey-with-OpenPGP) に従ったが、一点だけ、この中では RSA 4096 bit を用いる形となっているが、 YubiKey 5 は楕円曲線暗号 ECC P-384 に対応しているので、そちらでもよかったかもしれない。

### sub key の有効期限設定

以下のコマンドで設定した。期限設定後、期限到達前に延長も可能なので、それほど強い制約を課すものではない。

```bash
$ gpg --quick-set-expire $MASTER_KEY_FINGER_PRINT 1y $SUB_KEY_FINGER_PRINT
```

### 生成したキーの YubiKey への import

GPG にスマートカードへの書き出し機能が備わっており、これを利用する。 import したキーを読み出す際には、 PIN によって制限がかかる格好となっている。これはデフォルトで `123456` という値になっているので、あわせて変更が必要となる。 YubiKey の紛失も考えると、チャレンジ回数は制限しておいたほうがよい。

### ローカルマシン側の master key と失効証明書の退避

YubiKey にキーを import したら、ローカルマシン内の master key は紛失、盗難を回避するために、別のディスクなどへ退避してオフラインで保管することが推奨されている。これが結構悩みどころで、本気で保管するならばある程度冗長性のあるディスクに保存したいところだが、その手のディスクはご自宅にあるとしてもネットワーク接続された NAS の場合が多く、オフラインにならない。一旦 USB メモリに退避はしたものの、現代においてはかなりシビアな運用ではないかという気がしている。

また master key の失効証明書が、キー生成時に macOS の場合は `~/.gnupg/openpgp-revocs.d` に生成されている。これも盗難された場合には悪用の危険があるため退避が必要だが、 master key の紛失時に必要となるものであるため、 master key とは別途保存が必要となる。

### keybase への鍵登録

[Keybase](https://keybase.io/) は公開鍵基盤を提供するサービスであり、ここに公開鍵を登録した。公開鍵基盤では、その鍵が誰のものであるか保証する必要があるわけだが、 Keybase は SNS などを用いて本人であることを保証できる点が特徴となっている。僕のアイデンティティはこちら。

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://keybase.io/chroju" data-iframely-url="//cdn.iframe.ly/LyMJiFF"></a></div></div><script async src="//cdn.iframe.ly/embed.js" charset="utf-8"></script>

Keybase には秘密鍵も登録可能で、その鍵を用いて Keybase の UI 上で暗号化サービスや、秘匿ファイルの共有なども行うことができる。

### Git commit への署名設定

先の 2. の資料に則ったので割愛する。 GitHub 側でも　[コミット署名の検証を管理する - GitHub Docs](https://docs.github.com/ja/github/authenticating-to-github/managing-commit-signature-verification)　で手順を公開している。

<a href="https://gyazo.com/87295cc541be1420bb78497a1cae68b2"><img src="https://i.gyazo.com/87295cc541be1420bb78497a1cae68b2.png" alt="Image from Gyazo" width="303"/></a>

### ssh key として GPG キーを使用するための設定

これも 2. に手順が詳細に記載されている。

### 移行後のマシンで YubiKey 内のキーを使用するための設定

移行後のマシンで YubiKey 内のキーを使うには、 YubiKey を挿した上で以下の手順を行った。

1. `gpg --card-edit` でスマートカードの操作モードに入り、 `fetch` コマンドで、 YubiKey に登録した URL (keybase) から公開鍵をダウンロード
2. この鍵を信用するために `gpg --edit-key` で鍵の操作モードに入り、 `trust` コマンドで信頼する
3. 新しいマシンを Keybase に登録する

インポートした鍵は、新しいマシン上では「知らない鍵」にあたるため、それを信用していいのかどうか GPG 側では「不明」のステータスになっている。これを自身の鍵であるとして信用するのが 2. の手順。自分の鍵の場合、信用度は「ultimate (究極)」になる。

```bash
❯ gpg -k            
/Users/chroju/.gnupg/pubring.kbx
--------------------------------
pub   rsa4096 2020-08-23 [SC]
      5B1586BD87F81233D5A72590B2901C02871B6CD5
uid           [  究極  ] chroju <chroju@users.noreply.github.com>
sub   rsa4096 2020-08-23 [E] [有効期限: 2022-01-17]
sub   rsa4096 2020-08-23 [A] [有効期限: 2022-01-17]
sub   rsa4096 2020-08-23 [S] [有効期限: 2022-01-17]
```

また Keybase はアカウントとデバイスを対応づけることが可能になっており、信頼したデバイスからでなくては操作を受け付けない場合がある。そこで新しいデバイスを導入した際には、 Keybase への登録も忘れずに行う必要がある。

## Impression

これまで特に ssh 鍵は作ってはキーフレーズを忘れてしまったり何度か作り直したりしていたので、一括管理できる方法を導入してスッキリさせることができた。難点としては YubiKey がなければ ssh も commit も出来ないという点で、こういう運用をするのであれば USB Type-C 対応の YubiKey が必要になりそう。今は常に家で作業しているので、ディスプレイの USB-A ポートが使えるのだが。

また GPG の仕組み、公開鍵基盤の仕組みなどを改めて復習できたのもよかった。 FIDO など、まだ活用できていない YubiKey の機能も今後概観したい。
