---
title: "令和4年最新版 Amaozn S3 のストレージクラスと Backup"
date: "2022-01-22T21:28:40+0900"
tags: ["AWS", "S3"]
---

Amazon S3 のストレージクラスがどんどん増えるなぁとぼんやり数年眺めていたところ、気付けば **8種類** となかなかな数になってしまった。そこで昨年の re:Invent 2021 での更新内容を中心に、 Amazon S3 のいくつかの技術仕様をさらい直してみた、自分用メモを残しておく。

## ストレージクラス

先述の通り、現状は8種類が存在している。 re:Invent 2021 で発表された Glacier Instant Retrieval が追加されたのが最後となっている。

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://dev.classmethod.jp/articles/reinvent2021-amazon-s3-glacier-instant-retrieval-storage-class/" data-iframely-url="//iframely.net/O66p3JY?card=small"></a></div></div><script async src="//iframely.net/embed.js" charset="utf-8"></script>

本記事執筆時点だと、[日本語版の S3 ドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/storage-class-intro.html#sc-compare) は最新の状態にはなく、まだ7種類のストレージクラスしか表記されていない。以下、 [英語版](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html#sc-compare) を参考にすることとする。

### 標準、IA、Glacier の現状

古い人間としては、ストレージクラスというと標準、IA、Glacier の3種類という認識が強い。基本的には標準 → IA → Glacier と辿るにつれて、保存料金は低くなり、一方でデータの取り出し料金は高くなる。特に Glacier についてはかなり低料金になるが、取り出しにおいては分単位での時間がかかるようになる。 IA （Infrequent Access）は名前通り低頻度のアクセスが想定されるデータの保存に適しており、 Glacier はほとんど取り出すことのない、例えば監査対応のためのログ保存などに適している。

……と、いうのが基本的な僕の認識だったのだが、これがややこしくなったのが最新ストレージクラス Glacier Instant Retrieval の登場である。これは Glacier という名を冠してはいるが、データの取り出しは標準、IA と同様に数ミリ秒のディレイで実現される。 Glacier シリーズのアイデンティティはその名の通り「氷河」のようにデータが凍結され、すぐに取り出せないことにあると考えていたのだが、現状はそのような区分け方ではなくなっている。

適切なストレージクラスを考えるにあたっては、保存料金と取り出し料金のほかにも、いくつかの観点を踏まえる必要がある。

### 最小ストレージ期間とデータサイズ

標準と Intelligent-Tiering 以外の各クラスは「最小ストレージ期間」の設定があり、その期間内にオブジェクトを削除すると、最小期間相当の料金が発生する。例えば「標準 IA」の最小ストレージ期間は30日であり、オブジェクトを保存開始後に5日で削除しても、30日保存したのと同等の料金になる。

似たところで、データサイズの制約も存在する。標準 IA は最小データサイズが 128KB であり、それより小さいサイズのオブジェクトを保存しても、 128KB 相当の保存料金が発生する。これも標準と Intelligent-Tiering 以外、すべてのクラスに適用されている。

### クラス移行の前提条件

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html" data-iframely-url="//iframely.net/6pqgwC5"></a></div></div><script async src="//iframely.net/embed.js" charset="utf-8"></script>

IA については、ストレージクラスを移行する前に、「標準」ストレージクラスで30日保存されている必要がある。 IA は標準と同じく数ミリ秒でデータが取り出せるので、取り出し頻度が多少低ければ取りあえず IA 、としたくなるところだが、ある程度長期間保存されるデータでなければ、 IA は利用できない。

### ストレージクラスの考え方

ストレージクラスの使い分けは、基本的には [Amazon S3 ストレージクラスを使用する - Amazon Simple Storage Service](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/storage-class-intro.html) を見れば間違いがなさそうなところではあるが、先の通り最新版にはないため、現時点では英語版を見るのを勧めたい。英語版だと、ストレージクラスの比較表（以下に抜粋）において、 IA などが想定する「低頻度のデータアクセス」というのが、具体的にどの程度の頻度なのかも言及があるので、その点でも英語版を読む価値がある。

<a href="https://gyazo.com/42ba301e09a66267d1ab0f2acb789a7c"><img src="https://i.gyazo.com/42ba301e09a66267d1ab0f2acb789a7c.png" alt="Image from Gyazo" width="600"/></a>

基本的にはこの表にて、アクセス頻度だけでほぼ一意にストレージクラスを決定できるようになっている。

* アクセスが頻繁 or 保存期間が1か月以内 → 標準
* 1か月に1回程度 → 1ゾーンIA or 標準IA
* 四半期に1回程度 → Glacier Instant Retrieval
* 年に1回程度 → Glacier Flexible Retrieval （旧 Glacier）
* 年に1回未満 → Glacier Deep Archive

標準以外のストレージクラスは、いずれも30日以上の最小ストレージ期間が設定されているため、アクセスが頻繁ではないとしても、30日以内に削除されるようなデータは「標準」で保存するしかない。

アクセス頻度が1か月に1回程度の場合は、1ゾーン IA と標準 IA の2つが選択肢となるが、これらは可用性、回復性の点で差分がある。1ゾーン IA は 1 AZ でしかデータを保存しないため、その分料金は下がるものの、標準 IA が可用性 99.9 % であるのに対して可用性 99.5 % にとどまり、また災害時などはデータが回復しないおそれがある。

3つの Glacier については、先述の通り Glacier Instant Retrieval 以外についてはデータの即時的な取り出しができないため、その点に注意が必要だ。

なお、アクセスパターンの予測がつかない場合は、 Intelligent-Tiering というストレージクラスを使うことにより、アクセス頻度に応じて自動的に最適なストレージクラスへオブジェクトが移行されるようになる（正確には Intelligent-Tiering 自体がストレージクラス相当の概念であり、変動するのは各ストレージクラスに相当する「アクセス階層」と呼ばれるパラメータ）。移行先には、 Glacier Instant Retrieval や Glacier Deep Archive に相当するアクセス階層も存在するが、これら階層への移行を有効化するかどうかは選択できるようになっており、気付けばデータが即時取り出しできなくなっていた、という事態は避けられる。

## AWS Backup の S3 対応

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://aws.amazon.com/jp/blogs/news/preview-aws-backup-adds-support-for-amazon-s3/" data-iframely-url="//iframely.net/NPBl9fM?card=small"></a></div></div><script async src="//iframely.net/embed.js" charset="utf-8"></script>

S3 のバックアップ機能として、 AWS Backup が S3 をサポートすることが re:Invent 2021 で発表された。ただし、現状 preview の状態であり、 Oregon でしか利用することはできない。

機能と特徴をざっくりまとめると以下の通り。

* 利用に当たってはバージョニングの有効化が必要となる
* バックアップタイミングは、ポイントインタイムと定期の2種類がある
* 復元はバケット全体、オブジェクト単位の2種類を選択できる
* オブジェクト単位で復元する場合、一度のGUI操作で復元できるのは5個までの制限がある
* 復元先は既存バケット、もしくは新しいバケットをつくるか選べる

S3 のデータ回復という点では、従来からバージョニングの機能があり、オブジェクトを更新したり削除しても、その前の版のオブジェクトを残しておいて、後から復元させることができた。そのため、オブジェクト単位のリストアが、バージョニングにおける復元とどう違うのかがいまいち掴めていない。時間指定で戻せるのがポイントだろうか？

バケット全体のリストアについては、使いたい機会もありそうな気はしている。いずれにせよまだ本番利用できる段階にはない。

## ACL の無効化

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://aws.amazon.com/jp/blogs/news/new-simplify-access-management-for-data-stored-in-amazon-s3/" data-iframely-url="//iframely.net/is1xvPD"></a></div></div><script async src="//iframely.net/embed.js" charset="utf-8"></script>

re:Invent 2021 での大きな発表からもう1つ、 ACL の無効化も取り上げる。S3 のアクセス制御は、オブジェクトポリシーと ACL の2つを利用することができるために非常に複雑であったが、このうち ACL に関しては、バケット単位で機能を無効化することができるようになった。

### ACL 無効化の本質

「ACL の無効化」は、より厳密には「オブジェクト所有者」を強制的に「バケット所有者」と同一とする設定であり、 GUI での設定箇所も ACL の項ではなく、「オブジェクト所有者」の項にある。このあたり、 ACL を理解していないと少々わかりにくい。

バケット所有者、オブジェクト所有者という概念が、 ACL とどう関係するのか。従来、オブジェクトの所有者は、バケット所有者とは別とすることができたのだが、このとき、バケット所有者からは、そのオブジェクトの管理ができなくなるという仕様があった。というのも、オブジェクトには「オブジェクト ACL」というアクセス権が設定されており、これがデフォルトでは、オブジェクト所有者に対してのみ許可を与える形となっていたからだ。オブジェクト所有者以外へアクセスを許可するには、オブジェクト ACL を変更しなければならなかった。

従って ACL を無効化し、使わないようにする上では、オブジェクト所有者をバケット所有者と一致させることが必須となる。

### 他に ACL が必要な場面はないのか？

ACL を無効化して困る場面はないのだろうか。多くの場面では、 ACL を使って実施できることはバケットポリシーで代替できるが、従来いくつかの権限制御には ACL が必須とされていた。

1つは、サーバーアクセスログを記録するにあたり、ログ配信グループへのアクセス許可を ACL で与える必要があるとされていた。これについてはバケットポリシーでの付与が可能となったため、現状 ACL は必要ではなくなった。（参考: [Prerequisites for disabling ACLs - Amazon Simple Storage Service](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-ownership-migrating-acls-prerequisites.html#object-ownership-server-access-logs) ）

日本語のドキュメントにはこの内容はまだ反映されておらず、 [アクセスポリシーのガイドライン - Amazon Simple Storage Service](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/access-policy-alternatives-guidelines.html) には「バケット ACL の使用が推奨される唯一のユースケースは、Amazon S3 のログ配信グループに、バケットへのアクセスログオブジェクトの書き込みアクセス許可を付与する場合です」との記載が現時点では存在している。 [英語版](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-policy-alternatives-guidelines.html) では、この表記はすでに削除されている。

これ以外では、 [CloudFront の標準ログを S3 へ保存する際、 ACL を使用している。](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html#AccessLogsBucketAndFileOwnership)

これをバケットポリシーで置き換えることは現時点ではできないらしい。回避策としては、 CloudFront のもう1つのログ機能である、リアルタイムログを使い、標準ログの使用をやめることが挙げられる。

その他では、オブジェクトレベルで権限制御したい場合などが考えられるが、ほとんどのユースケースではバケットポリシーで制御可能な「ディレクトリ」レベルの権限で十分ではないだろうか。よって多くの場合、 ACL は無効化できそうだと考えている。
