---
title: "re:Invent 2021 で個人的に気になったもの"
date: "2021-12-05T20:30:45+0900"
tags: ["aws", "re:invent"]
---

[AWS re:Invent 2021](https://aws.amazon.com/jp/about-aws/events/2021/reinvent/) で発表されたうち、個人的に気になった内容のメモ。ザックリ読んで、後で触れたい、業務で使えそうと思ったものをサッとメモしただけなので内容の正確性は微妙かも。網羅性と正確性を求める場合は DevelopersIO あたりを読みましょう。

全体的に派手なリリースはそれほど多くはないものの、地味に嬉しいものとか、サービス間の関係性が適切に見直されたものが多かったかな、という印象。

## ECR Public + Docker Hub

* [Docker Official Images now available on Amazon Elastic Container Registry Public | Containers](https://aws.amazon.com/jp/blogs/containers/docker-official-images-now-available-on-amazon-elastic-container-registry-public/)
* [Announcing Pull Through Cache Repositories for Amazon Elastic Container Registry | AWS News Blog](https://aws.amazon.com/jp/blogs/aws/announcing-pull-through-cache-repositories-for-amazon-elastic-container-registry/)

ECR 関連で2つ発表されていて、1つは Docker Hub 上の Docker Official Images が ECR Public からダウンロードできるようになったというもの。 ECR Public は AWS ネットワーク内からダウンロードする分には制限がないので、 Docker Hub のダウンロード制限をこれで回避できる。

2つ目は Pull Through Cache Repositories。 Public なコンテナイメージレポジトリと、 ECR private を同期して、 ECR private の機能を用いてパブリックイメージを管理できるようになるというもの。例えば Private Link を介してイメージをダウンロードしたり、 ECR private の脆弱性検査の機能を使ったりなど。対応しているのは ECR Public だけではなく、ローンチ時点で Quay.io も扱える。で、 ECR Public には Docker Official Images も同期されているので、実質 Docker Hub も一部対応しているような形になった。

## Amazon S3 Event Notifications with Amazon EventBridge

[New – Use Amazon S3 Event Notifications with Amazon EventBridge | AWS News Blog](https://aws.amazon.com/jp/blogs/aws/new-use-amazon-s3-event-notifications-with-amazon-eventbridge/)

S3 の Event Notification は従来バケットの設定の中に組み込まれていたけど、これが EventBridge で設定できるようになった。

これ、管理の面で結構嬉しくて、というのも Event Notification は何と言うのか、1個のオブジェクトのようなもので、1つのバケットに対して複数の通知を設定する場合でも Terraform でこういう書き方になる。

```hcl
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.bucket.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.func1.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "AWSLogs/"
    filter_suffix       = ".log"
  }

  lambda_function {
    lambda_function_arn = aws_lambda_function.func2.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "OtherLogs/"
    filter_suffix       = ".log"
  }

  depends_on = [
    aws_lambda_permission.allow_bucket1,
    aws_lambda_permission.allow_bucket2,
  ]
}
```

この密結合な感じがすごく嫌だったんだけど、 EventBridge であれば1つずつ切り離して別々に設定を書けるはず、と認識している。

## New Amazon Inspector

[Improved, Automated Vulnerability Management for Cloud Workloads with a New Amazon Inspector | AWS News Blog](https://aws.amazon.com/jp/blogs/aws/improved-automated-vulnerability-management-for-cloud-workloads-with-a-new-amazon-inspector/)

Amazon Inspector に新しい機能がかなり盛り込まれた。

Automated Discovery を有効化すると、EC2 と ECR repository を自動で検知して脆弱性を検査してくれる。 ECR にはもともと脆弱性検査機能はあったわけだが、 Inspector と連携すると [Enhanced Scanning](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning-enhanced.html) が使えるようになり、プログラミング言語のパッケージもスキャンできるようになる（ただしこちらは有料）。まぁアプリケーションの脆弱性スキャンはアプリケーションレポジトリ + GitHub Code Scanning とかでもっと早い段階でスキャンしていたりするだろうとは思うものの。

他にも Security Hub との連携、 AWS Organizations との連携などなど追加要素はかなり多い。

## AWS Mainframe Modernization

[Introducing AWS Mainframe Modernization](https://aws.amazon.com/jp/about-aws/whats-new/2021/11/introducing-aws-mainframe-modernization/)

これは使う予定のない完全な興味。

オンプレのメインフレームのワークロードを AWS へ移行できるらしい。自分が業務でメインフレームに触れる機会は今後なさそうだが、ついに AWS もここに手を出すのか、という感慨深さがある。ざっとしか読んでいないけど、おそらく z/OS などがクラウドで動きますよ、という話ではなくて、メインフレームで動かしている COBOL などを AWS で動かすためのあれこれ、みたいなものっぽい。

## S3 Glacier Instant Retrieval

[Announcing the new Amazon S3 Glacier Instant Retrieval storage class - the lowest cost archive storage with milliseconds retrieval](https://aws.amazon.com/jp/about-aws/whats-new/2021/11/amazon-s3-glacier-instant-retrieval-storage-class/)

ミリ秒単位でデータ取得が可能でありながら、標準IAよりは安価に保存が可能な Glacier の新たなストレージクラス。標準IAもミリ秒単位で取得可能なので、ならば標準IAと Glacier Instant Retrieval との違いはどこ？とちょっと疑問なのだが、おそらくデータ取り出し時の料金にコストが跳ねていると思われる。記事執筆時点で Pricing にまだ反映されていないので未確認。

これに伴い、既存の Glacier と呼ばれていたストレージクラスは Glacier Flexible Retrieval に名称変更。ここまで細かくストレージクラスが分かれる必要あるのかは若干疑問だけど、選択肢があるのはいことかな。

## Control Tower が Terraform から操作可能に

[HashiCorp Teams with AWS on New Control Tower Account Factory for Terraform](https://www.hashicorp.com/blog/hashicorp-teams-with-aws-on-new-control-tower-account-factory-for-terraform)

AWS アカウントの管理ではあんまり Terraform の出番がなかったのでこれは嬉しい。

## AWS Backup for Amaozon S3

[Announcing preview of AWS Backup for Amazon S3](https://aws.amazon.com/jp/about-aws/whats-new/2021/11/aws-backup-amazon-s3-backup/)

AWS Backup が S3 に対応、バケットのスナップショットを取得できるようになったとのこと。 S3 に保存したデータが消える心配はあまりしていないのだけど、本当に重要なものは別クラウドのオブジェクトストレージにコピーしたりしていたので、これが代わりになるかな？

## Amazon DevOps Guru for RDS

[Announcing Amazon DevOps Guru for RDS, an ML-powered capability that automatically detects and diagnoses performance and operational issues within Amazon Aurora](https://aws.amazon.com/jp/about-aws/whats-new/2021/12/amazon-devops-guru-rds-ml-powered-capability-amazon-aurora/)

Amazon Aurora のパフォーマンスの問題などを自動的に解析してくれるらしい。

## Sustainability Pillar for the AWS Well-Architected Framework

[New Sustainability Pillar for the AWS Well-Architected Framework](https://aws.amazon.com/jp/about-aws/whats-new/2021/12/new-sustainability-pillar-aws-well-architected-framework/)

Well-Architected Framework にサステナビリティの柱が新たに追加された。 Well-Architected Framework 、全体を何年か前にザッと読んだっきりになって更新も追えてないので年末とかに読もうかな。

## IP Address Manager

[Amazon Virtual Private Cloud (VPC) announces IP Address Manager (IPAM) to help simplify IP address management on AWS](https://aws.amazon.com/jp/about-aws/whats-new/2021/12/amazon-virtual-private-cloud-vpc-announces-ip-address-manager-ipam/)

VPC の IP アドレスを GUI で効率的に管理できるサービス。最初に IP のプールを `/8` の下に `/16` をいくつか、みたいな感じで具体的なセグメントを切りつつ作っておいて、それを VPC に割り当てる、という形で使えるらしい。このあたりは確かに Excel とか Notion Database とか使って管理していたので、 AWS の中で完結できると地味に良さそう。 IP の割当状況とかも見られるらしい。枯渇しそうになったらアラート上げるとかできるかな。

## Disalbe S3 access control list

[Amazon S3 Object Ownership で、S3 内のデータのアクセス管理をシンプル化するためのアクセスコントロールリストの無効化が可能に](https://aws.amazon.com/jp/about-aws/whats-new/2021/11/amazon-s3-object-ownership-simplify-access-management-data-s3/)

S3 の ACL を無効化して使わないようにできるらしい。ちょっと笑った。

確かに現状では ACL で出来ることはバケットポリシーでほぼ代替できるので、基本的には使わないものだし、無効化してしまったほうが認知負荷の観点でシンプルになるのはすごくわかる。一方で歴史的経緯から機能自体を廃止はできないのだと想像。これはよい落とし所だと思うし、案外神アプデでは。

## AWS re:Post

[AWS re:Post – A Reimagined Q&A Experience for the AWS Community | AWS News Blog](https://aws.amazon.com/jp/blogs/aws/aws-repost-a-reimagined-qa-experience-for-the-aws-community/)

こういう言い方で正しいかわからないけど、 teratail の AWS 版的な認識。 AWS の Forum って確か従来もあったと思うけど、あんまり GitHub Issue ほど活発で活用できるような感覚がなかったし、 Community として知見が集まってくると嬉しいかも。
