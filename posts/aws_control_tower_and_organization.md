---
title: "AWS Organization 等、マルチアカウント管理サービスをどう使うか"
date: "2020-02-29T14:10:31+09:00"
tags: ["aws"]
isCJKLanguage: true
draft: false
---

https://qiita.com/chroju/items/ddf6266b704fe26b5d7c

昨年末に Qiita のほうでこのようなエントリーを出した。このときは Organizations には触れていなかったのだが、その後年明けから Organizations はじめ「マルチアカウント管理のためのサービス」に触れてきたので、改めてまとめたい次第。

率直に言ってマルチアカウント管理のためのサービスは多すぎると感じている。 Organizations が代表的だが、その他にも Control Tower が近年出てきたり、 AWS SSO は使えるのかどうなのかとか。あとはサービスによってマルチアカウント制御の仕組みを独自で持っているものもあったりする。そんな中で何をどう使えばいいかがまったくもってわからんので、一旦自分なりの考えをまとめておく。あくまで自分なりの答えなのでベストプラクティスなどと呼ぶつもりはないが、一つの指針として参考になったらよいなと考えている。

なお、本記事は2020年2月時点の情報に基づく。1年も経てば状況はまたガラリと変わっているだろう。現時点で「マルチアカウント管理のためのサービス」としては、以下のものがある、という状態である。

* AWS Organizations
* Control Tower
* AWS Single Sign-On
* CloudFormation StackSets

だいぶ長いしまとまっていないので、時間がなければ最後までスクロールして Conclusion を見たほうがはやい。

## マルチアカウント管理とはつまるところ何がしたいのか

そもそも「マルチアカウント管理」とは具体的に何を欲しているのか。自分の場合、まとめると以下4点になる。

* 権限管理 : IAM User を個別に作ると面倒なのでログイン管理を集約したい
* 設定管理 : 各アカウントの基本的な設定は一括で統一的に適用したい
* 監査 : マルチアカウントの利用状況を効率的に監査してガバナンスを効かせたい
* 集約化 : ログなどをアカウントごとに蓄積すると閲覧しづらいので集約管理したい

混乱が生じやすいのは、これらの目的を魔法のように解決してくれるサービスがあるわけではない点だろう。まぁ「それはそうだろ」という話でもあるのだが、それにしてもマルチアカウント管理のサービスが Organization 1つに統一されているわけでもなく、各種サービスでできることが重なっていたり微妙に違っていたりもする中、様々組み合わせなければ「やりたいこと」が実現できないので見通しづらい。

以下では、これら目的視点で各サービスを見ていく。

## AWS Organizations はほぼ必須

https://aws.amazon.com/jp/organizations/

Organizations はどんな場合であれ、マルチアカウントを使うのであれば有効化してよい。というのはコストメリットが大きくなるため。1つには Reserved Instance を複数アカウントで共有する機能を利用できるようになるので、柔軟な RI 購入が実現できるようになる。もう1つは「[ボリューム割引](https://docs.aws.amazon.com/ja_jp/awsaccountbilling/latest/aboutv2/useconsolidatedbilling-discounts.html)」の考え方があり、複数アカウントを Organizations で一括請求にまとめることで、価格が低くなる可能性が高まる。

また、この後で触れていくが、一部サービスについては Organizations を活用して管理を効率化できるものがある。そのため「何はなくてもとりあえず Organizations に契約アカウントはまとめておく」ようにすると、恩恵を受けられる機会は多くなる。  Organizations には、実行可能な API をアカウント単位で制御する SCP といった機能などもあるが、こういった付随機能がよくわからなくても、極論とりあえず Organizations を有効化しておくだけでもいい。

## Control Tower を使う場面はかなり限られる

https://aws.amazon.com/jp/controltower/

Control Tower はそもそも何者なのかすごくわかりにくいのだが、以下の機能を持つ Organizations のメタ管理サービスみたいなものと捉えている。

* Landing Zone
* Account Factory
* ガードレール
* SSO

Landing Zone とは AWS が提唱するマルチアカウント構成のベストプラクティスを指す。以下のページに構成図が載っているので、あわせて見てもらうとわかりやすいのだが、つまるところ監査専用アカウント、ログ集約専用アカウントを設けて、それらの間を AWS SSO を使って行き来するというようなものである。 Control Tower はボタン1つでこの構成を用意してくれるというものだ。

https://aws.amazon.com/solutions/aws-landing-zone/

自動でいい感じにやってくれるなら最高じゃないか、と思いたくなるところなのだが、曲者なのがこれに付随する Account Factory という機能である。 Landing Zone で生成されたログ集約用アカウントや監査用アカウントで管理してくれるのは、この Account Factory を使って新規作成したアカウントに限られる。したがってすでに Organizations を利用済みだったり、 AWS アカウントを準備している場合に、それを Landing Zone へ組み込むということができない。そのため Control Tower を有効活用できるのは、これから AWS を使い始るような場合に限られる。

なお、ガードレールは Config Rules 等を使って Landing Zone 内の各アカウントを監査する機能であり、 SSO は先に言及した通りである。これらも自動的にセットアップしてくれるのだが、 Account Factory で作成していないアカウントはやはり制御下に追加できない。今後このあたり改善されないだろうかと期待している。

## SSO vs switch role

権限管理については IAM User と switch role の仕組みを使うか、 AWS SSO を使うかの2択だろう。 switch role は、あるアカウントの IAM User から別アカウントの IAM role へ権限の切り替えを行う方法で、詳しくは [ロールの切り替え (コンソール) - AWS Identity and Access Management](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_use_switch-role-console.html) に掲載されている。 AWS SSO は読んで字の如く、マルチアカウントでシングルサインオンを実現するサービスである。

基本的には Active Directory (AD) をすでに有している、あるいはその管理を厭わないのであれば SSO を使えばよいし、そうでなければ switch role という考え方をしている。 AWS SSO は非常に便利な機能ではあるのだが、ID ソースとして利用できるのが AD か SSO 自身の ID ストアのいずれかに限られている。そして後者は API が存在せず、 GUI 上で管理しなくてはならないので手間が大きい。そのため AD ほぼ一択という状況なのである。

switch role であれば単なる IAM の活用に過ぎないので、 Terraform 等を利用した管理が実現できる。マルチアカウントの ID 管理を Terraform に落とし込むのは若干面倒ではあるものの、一度セットアップしてしまえば難しくはない。エムスリーさんのブログに非常にわかりやすくまとめられていたので貼っておく。

<iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fwww.m3tech.blog%2Fentry%2Fterraform_across_aws_accounts" style="border: 0; width: 100%; height: 190px;" allowfullscreen scrolling="no"></iframe>

ちなみに、 AWS はサードパーティの SAML IdP にも対応しているので、 G Suite などを持っているのであれば、それを活用するのも手である。

## 設定管理の集約化における銀の弾丸はない

マルチアカウントを管理していると、各アカウントで設定を揃えたい部分が出てくる。例えばよく使う IAM Policy を全アカウント作っておきたいとか、そういうもの。これに関しては残念ながら万能な解決策は今のところ存在しない。

https://aws.amazon.com/jp/blogs/news/new-use-aws-cloudformation-stacksets-for-multiple-accounts-in-an-aws-organization/

最も「万能な解決策」に近いのが CloudFormation StackSets だろう。もともとマルチアカウントに設定展開する機能を持っていた StackSets だが、先日 Organizations と連携して、新たに Organization へ追加されたアカウントへ自動展開が可能になった。アカウント作成時の初期設定をこれに全部任せてしまえるわけである。

しかし API の公開がまだなので、 StackSets for Organizations の設定は手作業となってしまう。まぁ、そこにこだわらなければこれが万能解に近い。すべて完全なコード化を行いたいのであれば、 Terraform を先のマルチアカウント展開させる方式で活用することになる。個人的には現時点ではこっちを選んでいる。

### Organizations による一括設定

<a href="https://gyazo.com/bb36385c76a16531b3e764ef6930efdc"><img src="https://i.gyazo.com/bb36385c76a16531b3e764ef6930efdc.png" alt="Image from Gyazo" width="600"/></a>

Organizations には「信頼されたアクセス」と呼ばれる機能がある。この画像のようにサービスごとに「アクセスの有効化」ボタンが用意されており、これを押すことで有効となる機能だ。

これは何なのかという話だが、サービスごとに意味するところが異なるので、それぞれ調べて使う必要がある。そして一部サービスについては（具体的には CloudTrail）、これを有効化することで Organization 内の全アカウントで機能を有効化することができる。一方、例えば Config は全アカウントの状況を集約したダッシュボードを作れるようになるだけであり、機能の有効化までは賄われていない。

これもまた直感に反しているというか、わかりにくいなと思う機能の1つではある。

## 自動監査系のサービスはお好みで

各種ログであったり、 AWS の使用状況であったりを AWS が自動的に監査してセキュリティ上の懸念を通知してくれるというサービスは様々ある。 GuardDuty, Config Rules, Amazon Detective, Security Hub などなどが該当するだろう。これらもマルチアカウント集約が可能であったりはする。

しかし何分サービスの数も多いので、とにかく全部使っておけばよいというものでもなくなってきている。もちろん「やるべきか否か」で言えば「やるべき」になるのだろうが、監査をすべて有効化したところで、その通知をさばいて対処するのは人間である。結局通知がさばけないのであれば通知だけされても意味はない。セキュリティ上、何を優先的に確認しなければならないのか、チームなり会社なりで方針を決めた上で活用していかなくてはならない。

各種監査系サービスのマルチアカウント管理について、調べた範囲で対応状況を記載しておく。

### AWS Config

* Config Aggregater という集約機能がある
* Organization 内のアカウントからデータ集約させることができる

### Amazon GuardDuty

* Organization には連携しない
* マスターアカウントとして任意のアカウントを決めて、そのアカウントから集約したいアカウントを「招待」する形で集約化できる

### AWS Security Hub

* GuardDuty と同様

### Amazon Detective

* GuardDuty と同様

まぁ、正直全部 Organizations と連動してほしい。

## Conclusion

何もまとまらないのだが、あえてまとめるとこんな感じかと。

* Organizations をまず有効化して、 Organizations を基軸に集約化を考える
* Control Tower, SSO は最悪一旦無視してもいい
* Infrastructure as Code 過激派じゃなければ CFn StackSets は便利
* マルチアカウントを一括設定する Terraform の使い方は習熟しておくとよい
* 監査、管理系の各サービスは、個別にマルチアカウント管理の方法が異なるのでそれぞれ調べる必要がある

僕としては Organizations を中心に、もう少しシュッとした感じになってくれることを期待している。
