---
title: "AWS Certified Security - Specialty を自宅で受験して合格した"
date: "2021-09-13T08:50:09+0900"
tags: ["aws", "certified"]
---

<a href="https://gyazo.com/afe0a94aa7617c8478226b7896768be0"><img src="https://i.gyazo.com/afe0a94aa7617c8478226b7896768be0.png" alt="Image from Gyazo" width="600"/></a>

[AWS Certified Security – Specialty](https://aws.amazon.com/jp/certification/certified-security-specialty/) を自宅で受験して合格したのでレポート。

## 受験の動機

AWS のセキュリティサービスってひたすらに数が多くて訳がわからなかったので一度体系的に学び直したくて取ってみた、という感じ。 EC2 建てるときに何に気をつけなくちゃいけないかとか、 IAM の権限のベストプラクティスとか、個別の事例は理解しているけれど包括的に知りたくなった。
基本的に資格を取る、あるいは資格勉強をするときのメリットって、こういった体系立てて知識を付けることにあると思っている。

## 取得に向けた学習

学習期間は1週間しか取れていないのだが、あくまで数年にわたる業務経験 + 1週間の集中学習で合格できているだけなので、誰でも1週間で取れますよとは全然言わないし、自分自身にとってももう少し時間取るべきだったとは反省している（試験は合格したけど、もう少し深掘りしたかった分野がいくつもある）。

逆に業務経験だけで取れたとも思えない。後述の書籍などを読んでいて、名前さえ聞いたことがないサービスに出くわすこともあった。業務経験の知識を試験向けに洗練しつつ、業務で触れたことがない知識を補うように学習していったイメージ。

以下、使った教材を具体的に書いていく。

### 要点整理から攻略する『AWS認定 セキュリティ-専門知識』

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://www.amazon.co.jp/dp/B08DCLRHC7" data-iframely-url="//cdn.iframe.ly/7kIJ5ub?card=small"></a></div></div><script async src="//cdn.iframe.ly/embed.js" charset="utf-8"></script>

NRIネットコムのエンジニアの方々が書いている試験対策本。試験範囲を網羅的に押さえる上で良いと思う。一番最初にこの書籍をざっくりと読み通してから、あまり詳しくない部分を個別に補う形で学習を進めた。試験に出そうなところは詳しく、あまり出題されないサービスなどはさらっとした解説になっていて、どこを重点的に学べばいいかわかりやすい。

ちなみにだが、2020年7月の発刊なので、現時点で内容が古くなっているということはほぼないものの、それでも公式に告知されている試験範囲は別途きちんと押さえるべきだと思う。例えば AWS Audit Manager は2020年12月に発表されたサービスなので、本書では当然言及がないが、公式の試験ガイドには記載されている。

### Exam Readiness: AWS Certified Security - Specialty

[Exam Readiness: AWS Certified Security - Specialty | AWS トレーニングと認定](https://www.aws.training/Details/eLearning?id=34786&ep=sec&sec=spec_security)

公式の無料デジタルトレーニング。内容としては短いが、練習問題もいくつか付いているので、雰囲気を掴むのに良い。

### AWS Black Belt & Developeres.IO

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://aws.amazon.com/jp/aws-jp-introduction/aws-jp-webinar-service-cut/" data-iframely-url="//cdn.iframe.ly/lzgIhHn?card=small"></a></div></div><script async src="//cdn.iframe.ly/embed.js" charset="utf-8"></script>

名前も知らないようなサービスは Black Belt のスライドで要点を掴むようにした。いわゆるドキュメントを読むよりはわかりやすく、短時間で読めるのでおすすめ。具体的な使い方のイメージを掴みたい場合は Developers.IO でハンズオン記事を探していた。

### 模擬試験

公式で模擬試験が有料で提供されており、受験はしたのだが、個人的にはあまりオススメしない。問題が本番65問に対して20問と少ない上、先のデジタルトレーニングと重複したものも多く（ランダム出題だとすれば僕の運が悪かっただけかもしれないが）、コストパフォーマンス的にいまいちだった。

## 重点的に学習した箇所

### Active Directory 関連

仕事で Active Directory を扱ったことがなく、まったく土地勘のない領域だった上、 AWS には AD 関連のサービスが複数あり、それぞれの違いと使い方、使用するシチュエーションなどをしっかり押さえるようにした。

### 監査、分析系のサービス

とにかく数が多いので、こちらも使い分け方を頭にたたき込んだ。具体的には Config, CloudTrail, Trusted Adviser, Inspector, Detective, Security Hub, Shield, QuickSight, GuardDuty, Macie あたり。それぞれ何が出来るのか、どの AWS サービスと連携するのか、発見的統制なのか予防的統制なのか、複数 AWS アカウントで使いたい場合はどうすればいいのか、といったところを押さえた。

### 知らなかったサービス

Macie, QuickSight, CloudHSM の3つと、先の AD 関連のサービスは恥ずかしながら存在すら知らなかった。

## 自宅受験

自宅受験するのは初めてだったので、この部屋じゃダメだと言われないか、何かトラブルになったりしないかと、試験そのもの以上に緊張した。結果から言えば特にトラブルはなかった。

### 受験環境について

そこそこ広いリビングの片隅に仕事スペースを設けているのだが、そこで受験した。部屋が広いしリビングなのでいろいろとモノは置いてあるのだが、書籍類やガジェット類を片付けて綺麗にしていれば何も言われることはなかった。

中には風呂場で受験した人もいると聞いていたので、そのレベルで「何もない」場所じゃないといけないのか……？と疑心暗鬼になっていたが、そこまで厳しくはないらしい。ただ、同居の家族の関係で絶対に邪魔が入らない場所が必要だとか、そうなってくると事情は異なってくるし、不安や心配のない環境で受験するのがベターだとは思う。いろいろと余裕があればビジネスホテルなどを借りるのもアリかもしれない。

### PC の再起動を求められる場合がある

一度試験準備の過程で接続の問題が発生し、試験官から PC の再起動を求められる場面があり、若干ヒヤッとした。というのも、ソフトウェアアップデートを数日放置していることが多く、再起動後にアップデートで数十分待つことになるのではないかと思ったから。幸いアップデートは適用済みだったのですぐに起動したが、試験前日までに一度再起動しておいたほうが良いと思う。

### マルチディスプレイは NG

試験前に、PC が試験に適したシステム環境になっているか（カメラが使えるか、他のアプリが起動していないかなど）自動で確認するプロセスがあり、その中では警告されることはないのだが、実際にはマルチディスプレイは NG で、いざ試験問題が配信される、という最後のプロセスが一度うまくいかなかった。ちゃんとシステム要件の案内には記載があったので、読み飛ばしていた自分が全面的に悪いのだが、自動チェックで弾かれなかったので油断してしまった。他にも要件はいろいろとあるのでちゃんと読みましょう。

## Impression

AWS の認定試験は何年も前に一度テストセンターで受けたこともあるのだが、自宅で想像より手軽に受けられたので、もし次回受ける機会があっても自宅でいいかな、と感じた。とはいえ最大3時間、実際には2時間問題を解いていたのだが、かなり集中力を要するので、自宅でそれだけの時間、確実に集中してパフォーマンスを出せるのか、というのも考えたほうがいい。気晴らしついでにホテル受験というのもやってみたくはある。

何にせよ、そこそこお金もかかるものだし、一発合格できてよかった。