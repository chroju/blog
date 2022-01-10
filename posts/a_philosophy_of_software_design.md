---
title: "『A Philosophy of Software Design』を読んだ"
date: "2022-01-10T14:57:05+0900"
tags: ["philosophy", "book"]
---

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://www.amazon.co.jp/-/en/John-Ousterhout/dp/1732102201" data-iframely-url="//cdn.iframe.ly/Vndgjaf?card=small"></a></div></div><script async src="//cdn.iframe.ly/embed.js" charset="utf-8"></script>

[ソフトウェアの複雑さに立ち向かう1つの哲学 :『A Philosophy of Software Design』 を読んだ - こまぶろ](https://ky-yk-d.hatenablog.com/entry/2022/01/04/100000) という非常に優れた感想エントリーがバズった直後なのだが、同じ書籍の感想を上げさせていただく。あの解像度の記事はちょっと書けないが。

先のエントリーに触発されたわけではなく、僕が本書を買ったきっかけは [Practices for Better Terraform Module | Taichi Nakashima](https://deeeet.com/posts/practices-for-better-terraform-module/) で Deep Module に関する一節を読んだことだった。それから1年近く積んでいたのを、2021年12月に重い腰を上げて読んでいた。従って現在の最新版である第2版ではなく、初版の感想になる。余談にはなるが、 Kindle で買う場合は初版と第2版の商品ページが分かれておらず、「すべての形式と版を表示」から選ばなければ第2版が買えないので、注意されたい。

<a href="https://gyazo.com/e3204b1e85b22ff7b8976e3989431435"><img src="https://i.gyazo.com/e3204b1e85b22ff7b8976e3989431435.png" alt="Image from Gyazo" width="600"/></a>

## 動機

職業プログラマーの経験がないので、ソフトウェア開発のパラダイムや哲学に疎い認識が常にある。特に SRE になってからは、ソフトウェアエンジニアリングが求められる場面も増えたし、 Infrastructure as Code においても依存性をどう排除するか、各種モジュールなどをどういった観点から分離していくか、といったソフトウェア開発の原理原則は応用できる。

そんなときに先の deeeet 氏のエントリーを読み、 Terraform module 作成にこの書籍を応用しているならば、何か自分にも得られるものがあるかもしれない、と読んでみた次第。

## 感想

ソフトウェア開発において「複雑性」を抑制するためにはどうしたらいいか、という方法論をいくつかの観点から述べている本。英語の本なので敬遠してここまで積んでしまったわけだが、実際読んでみると英語は平易なほうで読みやすかった。また言わんとするところもかなりシンプルだなと感じる。

* 複雑性
  * システムの理解や変更を困難としてしまうような性質
* なぜ複雑性を避けるべきか
  * シンプルな変更でも複数箇所を更新しなくてはならなくなる
  * 認知負荷の増大
  * Unknown unknowns (知られていない、ということが知られていないこと) の増大
* 複雑性はなぜ発生するのか
  * 依存性
    * ゼロには出来ないが、削減し、シンプルに、明瞭にするべき
  * 不明瞭さ
    * 変数名やドキュメントの不備から発生する
  * 複雑性は徐々に増大していくもの
* どうするべきか
  * Deep Module
    * インターフェースがシンプルで、隠蔽された情報が多いモジュール
    * メソッドや変数だけではなく、例外もまたインターフェースである
  * Information Leakage
    * 別のモジュールを同じ情報に依存させない
  * メソッドは1つのことだけを完全に遂行する
    * 他のメソッドを呼ぶだけのメソッドなどは作らない
  * コメントはコードの内容をそのまま書くのではなく、抽象度を上げるか詳述するのかどちらか
  * 継承は複雑性に繋がりやすいので留意する
  * アジャイルは機能レベルで increment するのではなく、抽象のレイヤーで increment することを意識する

## Terraform と複雑性

冒頭で書いた「動機」に鑑みて、 Terraform に引き寄せて少し考えてみる。

### Terraform module と Deep module

Terraform では抽象化のための機能として module が存在するが、これを扱う上で、 Deep Module の観点はやはり非常に重要だと思う。

僕の場合は AWS と Terraform をセットで使うことが多いので、 AWS に関しての話になるが、例えば EC2 インスタンスを Terraform で立てる場合に記述することになる、 `aws_instance` のドキュメント [aws_instance | Resources | hashicorp/aws | Terraform Registry](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance) を見るとパラメータが極めて多く、 Terraform を扱い慣れている自分でも、下までスクロールするのが嫌になる。

AWS を商用利用する場合、その組織内での規約に従い、いくつかのパラメータは決め打ちしたり、デフォルト値を決めておけることも多い。そういった場合に module 化を行えば、インターフェースは削減され、認知負荷の抑制が期待できる。

ただ、これだけでは単にインターフェースが減っただけであり、 **Deep** とは言い難いかもしれない。複数の AWS リソースを組み合わせて作成することで、何か1つの目的に供するような場合に、それらのリソースを1つの module で作成できるようになっていれば、より Deep と言えるものになる。例えば EKS Cluster はクラスターを作成し、権限管理用の IRSA を設定し、ログ出力先となる CloudWatch Log Group を作成し……と非常に手数の多い作業なのだが、これを一括して管理できる module が存在する。これは Deep な Terrform module の1つと言えそうだ。

<div class="iframely-embed"><div class="iframely-responsive" style="padding-bottom: 50%; padding-top: 120px;"><a href="https://github.com/terraform-aws-modules/terraform-aws-eks" data-iframely-url="//cdn.iframe.ly/gg04cbc"></a></div></div><script async src="//cdn.iframe.ly/embed.js" charset="utf-8"></script>

注意が必要なのは、 module の中に複数のリソースを含めたとき、その一方だけを更新したり、別の用途で使用したりするのは困難になる可能性がある点だ。先の EC2 インスタンスを作成するとき、セキュリティグループも同じ module に含めて作成したとして、そのセキュリティグループを他の用途にも使い回そうとすると、不要な依存関係が発生してしまう。セキュリティグループはあるインスタンス専用に作るというよりは、ウェブサーバー用、RDS 用など汎用的に作る場合が多いと考えられるので、インスタンスの module からは切り離し、外から渡せるようにしたほうが複雑性は抑制できる。こういったことは、本書でも general purpose と special purpose を1つの module にするべきではない、という観点で書かれている。

### remote state と Information Leakage

Terraform に関してもう1つ気になるのは、remote state だ。これは Terraform のある state が output した値を、別の Terraform state から参照できる機能だが、字面通りの「依存」に他ならない。 output している側で何か変更が入り、 output した値が更新されたとして、それを remote state で読み込んでいるあらゆる場所に影響が及ぶことになる。

個人的な印象にもなるが、 remote state はレポジトリをまたいだ依存にも成り得るので、 Unknown unknowns な依存になりやすい傾向にあると感じている。可能であれば `data` で置き換えたり、そもそも state 間で依存性が発生しないような構成を考えるべきだろう。

## Conclusion

Terraform で少し考察をしてみたが、複雑性による認知負荷の増大については、 Kubernetes の YAML 地獄でも似たものを感じる。 Helm や Kustomize など、マニフェストを抽象化するためのソリューションはいくつもあるが、まだ決定打は出ていないように思うし、どのツールを使うにしても、本書で述べられている観点は参考にできるのではないかと思う。「複雑性」との戦いは、職種問わず IT でシステムを組んでいれば自ずと発生するので、どのような立場でも読んで益のある本ではないだろうか。
