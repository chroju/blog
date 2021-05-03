---
title: "terraform test コマンドを試してみる"
date: "2021-05-03T13:36:58+0900"
tags: ["terraform"]
---

[Terraform 0.15](https://www.hashicorp.com/blog/announcing-hashicorp-terraform-0-15-general-availability) にて、Terraform module をテストするための実験的機能として `terraform test` コマンドが追加された。 module は Terraform の設定を抽象化してくれる存在であり、それ故確かに「テスト」の必要性を感じる場面も少なくない。従来は [Terratest](https://terratest.gruntwork.io/) のような OSS がこれを担ってきていたが、 Terraform 自体がテスト機能を内包する方向に動き出したことは興味深く感じている。

詳細な背景や使い方は [Module Testing Experiment - Configuration Language - Terraform by HashiCorp](https://www.terraform.io/docs/language/modules/testing-experiment.html) に記載されている。これを参考に自分でも test コマンドを試してみたので、その手順と雑感をまとめてみたい。

## terraform test の動作仕様

まず、 `terraform test` がどのように動作するのか簡単にまとめる。

このコマンドは module の root で実行する。テストはスクリプトなどではなく、純粋な Terraform の設定（HCL）で記述し、 module root からの相対パスで `./tests/` 配下にサブディレクトリを作って、その中にファイルを置く形となる。 `./tests/` 配下には複数のディレクトリを置くことができ、そのすべてがテスト対象として認識される。 module に渡す引数ごとに複数テストパターンを行いたい場合などに、複数ディレクトリを設けることになる。

テストファイル設置後、 `terraform test` を実行すると、各 `./test/*` ディレクトリ内の Terraform ファイルに対して、以下が実行される。

1. `terraform validate`
1. `terraform apply`
1. 定義されたテストの実行
1. `terraform destroy`

module を使って実際にリソースを構築し、その設定が意図したものになっているかテストした上で、構築した全リソースを削除するまでが一連の流れとなる。

## 検証

### test 検証用 module の作成

今回、 `terraform test` を検証するにあたり、以下の module を使用した。AWS S3 バケットを作成して、その中にオブジェクトを保存し、ウェブサイトとして公開するものとしている。

`aws_s3_bucket.this` で使用している `policy.json.tpl` の記述内容や、 provider 定義については、ここでは割愛する。

```hcl
variable "bucket_name" {
  type = string
}

variable "bucket_objects" {
  type = map(object({
    object_key   = string
    filepath     = string
    content_type = string
  }))
}

resource "aws_s3_bucket" "this" {
  bucket        = var.bucket_name
  acl           = "public-read"
  policy        = templatefile("${path.module}/policy.json.tpl", { bucket_name = var.bucket_name })
  force_destroy = true

  website {
    index_document = "index.html"
  }
}

resource "aws_s3_bucket_object" "objects" {
  for_each = var.bucket_objects

  bucket       = var.bucket_name
  key          = each.value.object_key
  source       = each.value.filepath
  content_type = each.value.content_type

  etag = filemd5(each.value.filepath)

  depends_on = [
    aws_s3_bucket.this,
  ]
}
```

### test の作成

module を用意したら、その中に `./tests/sample` ディレクトリを作成してテストファイルを作成していく。先述の通り、書き方は普通の Terraform とあまり変わりはない。

まず provider 定義だが、ここで builtin の test provider を読み込む必要がある。

```hcl
terraform {
  required_providers {
    test = {
      source = "terraform.io/builtin/test"
    }
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.0.0"
    }
  }
}
```

これで test 用の resource が使えるようになる。

続いて実際の設定を書いていくが、 module を読み込んでリソース構築するところまでは通常通り書いていく。今回、引数として渡す S3 のバケット名は、AWS の仕様上毎回ユニークなものでなければならないため、 `random_string` を使ってランダムなサフィックスを付加している。また S3 バケットに配置するオブジェクトは `./tests/sample/static` 配下に html と JSON の2つを用意しておいた。

```hcl
resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
  number  = false
}

locals {
  bucket_name = "chroju-terraform-test-${random_string.suffix.result}"
}

module "s3_website" {
  source = "../.."
  depends_on = [
    random_string.suffix,
  ]

  bucket_name = local.bucket_name
  bucket_objects = {
    index_html = {
      object_key   = "index.html"
      filepath     = "${path.module}/static/index.html"
      content_type = "text/html"
    }
    avater_jpg = {
      object_key   = "test.json"
      filepath     = "${path.module}/static/test.json"
      content_type = "application/json"
    }
  }
}
```

ここからテスト本体を書いていく。テストには先の test provider が提供する、 `test_assertions` resource を用いる。

```hcl
data "aws_s3_bucket" "this" {
  bucket = module.s3_website.bucket_id
}

resource "test_assertions" "s3_bucket" {
  component = "s3_bucket"

  equal "bucket_id" {
    description = "bucket id is valid"
    got         = data.aws_s3_bucket.this.id
    want        = local.bucket_name
  }

  check "website_endpoint" {
    description = "website endpoint is not empty"
    condition   = data.aws_s3_bucket.this.website_endpoint != ""
  }
}
```

`test_assertions` 内で書けるテストには2種類ある。1つが `equal` block であり、構築したリソースから得た値を `got` 、その値の期待値を `want` に指定して、両者が文字列として一致していればテスト成功となる。ここでは `data.aws_s3_bucket` によって、構築した S3 バケットの設定を読み出し、その ID が指定したバケット名と一致することを確認している。

もう1つが `check` block。 `condition` に bool 値を返す任意の式や function を記述し、その評価結果が `true` であればテスト成功となる。 Terraform 0.13 で追加された [Custom Variable Validation](https://www.hashicorp.com/blog/custom-variable-validation-in-terraform-0-13) と、仕組みとしては同じだ。上記のサンプルでは、 S3 バケットの `website_endpoint` という attribute が空文字列ではないことを確認している。この attribute は、 S3 がウェブサイトホスティング設定になっているときのみ、エンドポイントのドメインが設定されるので、それを確認することでテストとしている。

```hcl
data "http" "json_access" {
  depends_on = [
    test_assertions.s3_bucket,
  ]
  url = "http://${data.aws_s3_bucket.this.website_endpoint}/test.json"
}

resource "test_assertions" "json_access" {
  component = "json_access"

  equal "response_content_type" {
    description = "content type is valid"
    got         = data.http.json_access.response_headers["Content-Type"]
    want        = "application/json"
  }
}
```

さらにテストを書いてみる。今回の module の目的は S3 バケットを使ってウェブサイトを公開することなので、 HTTP provider を使って、実際に HTTP でアクセスできるのかまで確認をしてみた。

`data.http.json_access` には `depends_on` を設定し、先の S3 バケット自体のテストが終了後にこちらのテストを実行するようにした。これは、バケット作成が未完了の状態では、 HTTP アクセスもできないためだ。 `depends_on` によって、実行するテストの順序もこのようにある程度コントロールできる。実際のテストでは、アクセスした際の Content-Type が、 `application/json` になっていることを確認する内容とした。

### test コマンドの実行

テストを書き終えたら、 module root に戻り、 `terraform test` コマンドを実行する。実際にリソース構築が実行されるので、環境変数などで対象 provider 向けの API キーなどの設定もあらかじめ必要になる。

無事にすべてのテストが通れば、緑の文字で `Success!` と表示される。

<a href="https://gyazo.com/bf2cc6a49c89a7fc546706fd79b2da76"><img src="https://i.gyazo.com/bf2cc6a49c89a7fc546706fd79b2da76.png" alt="Image from Gyazo" width="600"/></a>

失敗したときは、以下のようにその詳細が表示される。ここでは最後の HTTP アクセス時のテストで、期待する値をあえて `text/html` と誤った値に設定してみた。

<a href="https://gyazo.com/a53e110d493a6473bb0c9038f09fc9d1"><img src="https://i.gyazo.com/a53e110d493a6473bb0c9038f09fc9d1.png" alt="Image from Gyazo" width="600"/></a>

## 現時点での課題や懸念

`terraform test` は experimental な段階にあり、まだ安定的に動作するものではない。また、僕が行った検証は上記のもののみであって、これから書くことが一般性のある内容かは保証しないとあらかじめ断っておく。

なお experimental 段階だからか、フィードバックがあれば [HashiCrop Disucuss](https://discuss.hashicorp.com/c/terraform-core/27/l/latest) のほうに寄せてほしいとのこと。

### 設定不備のデバッグが困難

設定不備により、 `terraform apply` 自体が失敗したり、テストがうまく動作しないこともあるが、現状ではその場合でも `Failed to clean up after tests` というメッセージが出力されるため、失敗の原因を掴みにくくなっている。

以下の出力は、先の検証の際に、バケット名をあえて重複した値に設定してみて、 apply をわざと失敗させたときのもの。スクショでは省略したが、実際には定義した各リソースすべてについて `Failed to ...` のメッセージが表示される。

<a href="https://gyazo.com/b1256abf477bc4a1a319ecd55a8a1868"><img src="https://i.gyazo.com/b1256abf477bc4a1a319ecd55a8a1868.png" alt="Image from Gyazo" width="600"/></a>

### destroy 失敗するとリカバリーが大変

`terraform test` では state を作成せずに apply / destroy を行うため、何らかの原因で destroy が失敗した場合は、作成したリソースを手動削除しなければならず、リカバリーが大変なことになる。あらかじめ手で apply / destroy だけは実行してみて、問題なく通ることは確認しておいたほうがいいかもしれない。

また、通常 `terraform destroy` ではリソース間の依存関係を鑑みて削除処理が行われるが、 `test` ではそれが上手く動いていない可能性を若干疑っている。先の検証中、 `aws_s3_bucket_object` と `aws_s3_object` には `depends_on` であえて依存関係を明記しているが、バケット削除が先に試みられ、エラーとなることがあったからだ。この点はもう少し確認して、バグのようなら報告しておきたい。

<a href="https://gyazo.com/bdc007971ecc40b7196dfbfd9028b8ac"><img src="https://i.gyazo.com/bdc007971ecc40b7196dfbfd9028b8ac.png" alt="Image from Gyazo" width="600"/></a>

### 構築に時間がかかる場合

今回の検証対象は S3 バケットだったため、テストの実行は1分程度で完了しているが、 AWS EKS Cluster など、構築完了まで10〜数十分を要するものが対象だと実行の難易度が上がる。 CI に組み込んだりすれば、時間的にも金銭的にもかなりのコストになるだろう。

将来的なテストダブルの実装可能性には触れられているので、それを期待したい。

## Conclusion

[Kief Morris『Infrastructure as Code』](https://www.oreilly.co.jp/books/9784873117966/) では、11章にて IaC のテストについてまとめられている。

ここでは「反射的テスト」と名付けて、何らかの構成定義をただ言い換えただけのテストを書くことをアンチパターンとしている。今回の検証で言えば、 S3 バケット名の確認テストがそれにあたるだろう。この種のテストは書いていても切りがないし、要するところ「Terraform が正しく動いているか」というツールの信用性を試すだけのものになってしまう。

では何をテストすれば良いのかについては、以下のように書かれている。

> 原則として、テストを書くのは、チェックしたいと思っているロジックにある程度複雑さが含まれている場合だけにすべきだ。（Kief Morris 著. 宮下剛輔 監訳. 長尾高弘 訳. Infrastructure as Code. 初版, オライリー・ジャパン, 2017, p.207）

確かに Terraform module は内部で Terraform Function や dynamic block を用いて複雑化している場合も多く、そういったところを中心に分岐網羅、条件網羅的にテストを書いていくのがベターな方法になるのかもしれない。また今回 HTTP provider を活用したように、直接構築されるリソース以外で副次的にもたらされる価値があれば、それについてもテストをしておきたい。 HTTP Provider 以外にも、すでに Terraform に存在している、数々の `data` を上手く活用できるんじゃないだろうか。

Terraform にテスト機能が内包されることで、より module 開発はやりやすくなりそうだと感じたし、 `test` コマンドの本実装には肯定的な気持ちでいる。
