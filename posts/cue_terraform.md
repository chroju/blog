---
title: "CUEでTerraformを書いてみる"
date: "2022-12-16T21:21:02+0900"
tags: ["cue", "terraform"]
---

最近 [CUE](https://github.com/cue-lang/cue) の話題を少しずつだがよく見かけるようになってきた。

- [CUE を使用した Kubernetes マニフェスト管理 | メルカリエンジニアリング](https://engineering.mercari.com/blog/entry/20220127-kubernetes-configuration-management-with-cue/)
- [\[DevOps プラットフォームの取り組み #4\] CUE 言語の紹介 - NTT Communications Engineers' Blog](https://engineers.ntt.com/entry/2022/08/08/082549)
- [CUE によるスキーマやバリデーションのポータビリティ | gihyo.jp](https://gihyo.jp/article/2022/09/tsukinami-go-02)

CUE とは何か、レポジトリの README から引用すると以下のように書かれている。

> CUE is an open source data constraint language which aims to simplify tasks involving defining and using data.
> It is a superset of JSON, allowing users familiar with JSON to get started quickly.

ポイントとしては JSON のスーパーセットであることと、データの定義や利用をシンプルにすることを目的としているという点だと理解している。昨今、Kubernetes の隆盛などにより、JSON やそれと互換性を持つ YAML を用いる機会が多くなったが、これら言語の機能だけではスキーマを定義したり、制約を書いたりすることは難しい。CUE はこれを解消する機能を持っているようである。

CUE が JSON のスーパーセットであるということは、JSON と互換性を持つ HCL のスーパーセットとしても使えるはずである。筆者はそもそも CUE に触ったこと自体がなかったので、今回は CUE で Terraform の定義をどのように書けばよいのか探りながら CUE に入門してみた。

## HCL と JSON の互換性

https://developer.hashicorp.com/terraform/language/syntax/json

HCL と JSON には互換性があり、Terraform の定義も JSON で書くことが可能である。 `terraform` コマンドの対象として、カレントディレクトリの `*.tf` に加えて、 `*.tf.json` という postfix の JSON ファイルも読み取られる仕様となっている。

変換の手順としてはシンプルに key value をそのまま JSON として起こしていくだけだが、 `resource "aws_instance" "this" {}` のように複数の label が連続する箇所については、JSON Object がネストする形になる。例えば以下の HCL があるとする。

```hcl
resource "aws_ebs_volume" "this" {
    availability_zone = "ap-northeast-1a"
    size              = 50
}

resource "aws_s3_bucket" "this" {
    bucket = "example"
}
```

これは以下の JSON に等しい。

```json
"resource" : {
    "aws_ebs_volume" : {
        "this" : {
            "availability_zone" : "ap-northeast-1a",
            "size" : 50
        }
    },
    "aws_s3_bucket" : {
        "this" : {
            "bucket" : "example"
        }
    }
}
```

## CUE で Terraform の定義を書く

早速ではあるが、上記の JSON を CUE に起こすと以下のようになる。

```cue
resource: {
    aws_ebs_volume: {
        this: {
            availability_zone: "ap-northeast-1a"
            size: 50
        }
    }
    aws_s3_bucket: {
        this: {
            bucket: "example"
        }
    }
}
```

あるいは、 [フィールドが 1 つだけの場合はブラケットを省略できる](https://cuelang.org/docs/tutorials/tour/intro/fold/) ので、以下も同義になる。

```cue
resource: {
    aws_ebs_volume: this: {
        availability_zone: "ap-northeast-1a"
        size: 50
    }
    aws_s3_bucket: this: {
        bucket: "example"
    }
}
```

JSON への変換は `cue` コマンドを使って行う。コマンドのインストール方法は [ドキュメント](https://cuelang.org/docs/install/) では `brew install cue-lang/tap/cue` となっているが、12 月の現時点では homebrew-core にも入っているようである。 `cue eval sample.cue` でバリデーション、 `cue export sample.cue` で JSON への変換が行える。

これだけだと key はクォーティングしなくて良くてちょっと楽ですねとか、それぐらいなものではあり、特に魅力を感じられる気はしてこない。

## スキーマ定義とバリデーション

ここからが本領、CUE でスキーマを定義したり、値のバリデーションをかけたりするフェーズに入っていく。

CUE では「[型は値である](https://cuelang.org/docs/concepts/logic/#types-are-values)」と言われる。これはあるフィールドを定義するものとして、型や制約と、具体的な値とが同じように評価されるということを意味する。数学的には [Lattice](https://cuelang.org/docs/concepts/logic/#the-value-lattice)、日本語で「[束（そく）](<https://ja.wikipedia.org/wiki/%E6%9D%9F_(%E6%9D%9F%E8%AB%96)>)」の概念を取り入れている。

```cue
resource: aws_ebs_volume: this: {
    availability_zone: string
    size: <100
}

resource: aws_ebs_volume: this: {
    availability_zone: "ap-northeast-1a"
    size: 50
    encrypted: true
}
```

上記の CUE は成り立つ。まず、CUE では同じフィールドに対する定義を複数回書けるので、 `resource: aws_ebs_volume: this:` が複数存在していてもエラーにはならない。複数回記述されたフィールドは、その論理積が取られるような形になる。 `availability_zone` は `string` かつ `"ap-northeast-1a"` であり、 `size` は `<100` かつ `50` 、という具合である。ここにさらに `size: >100` や `availability_zone: "us-east-1"` といった記述を追加すると論理積は空集合となってしまい、CUE の評価は失敗する。また 2 つの定義の双方で、フィールドの過不足があっても問題ない。上記の例の場合、最終的には `encrypted: true` が存在する形になる。

バリデーションは多様な書き方ができる。string に対しては正規表現も書けるし、論理和 `|` のオペランドが備わっていて、 enums のように `availability_zone: "ap-northeast-1a" | "ap-northeast-1c"` といった書き方もできる。また同様に論理和を使った書き方として、アスタリスクを付けるとデフォルト値を指定でき、 `size: <100 | *50` とすれば、具体的に size の指定がなければ 50 として評価される。

## Definition

CUE で記述されたデータを JSON に変換するには、当然ではあるが最終的に具体的な値を持つ必要がある。様々な AWS リソースのスキーマだけを書いたファイルを取りあえず用意して、このうち一部のリソースしか実際には定義しない、ということもあるだろうが、スキーマだけの状態だと値が確定できず、 `cue export` は失敗する。

```bash
$ cat <<EOF > sample.cue
resource: aws_ebs_volume: this: {
    availability_zone: string
    size: <100
}
EOF

$ cue export sample.cue
resource.aws_ebs_volume.this.availability_zone: incomplete value string:
    ./sample.cue:2:24
resource.aws_ebs_volume.this.size: incomplete value <100:
    ./sample.cue:3:11
```

このような場合は Definition を使う。頭に `#` を付けたフィールドは Definition として扱われ、データとしては評価されない。

```bash
$ cat <<EOF > sample.cue
#resource: aws_ebs_volume: this: {
    availability_zone: string
    size: <100
}
EOF

$ cue export sample.cue
{}
```

Definition を利用するときには `&` を使って呼び出す。上記は簡易な例として `resource` を Definition にしてしまったが、実際に Definition として作りたいのは `aws_ebs_volume` の方なので、より実践的な書き方としては以下のようになる。

```bash
$ cat <<EOF > sample.cue
#aws_ebs_volume: this: {
    availability_zone: string
    size: <100
}

resource: aws_ebs_volume: #aws_ebs_volume & {
    this: {
        availability_zone: "ap-northeast-1a"
        size: 10
    }
}
EOF

$ cue export sample.cue
{
    "resource": {
        "aws_ebs_volume": {
            "this": {
                "availability_zone": "ap-northeast-1a",
                "size": 10
            }
        }
    }
}
```

Terraform resource の定義は JSON だと深いネストを必要とするので、これでも少し冗長に感じる。呼び出し側の記述をもう少しシンプルにしたければ、 Definition をフル活用して以下のようにも書ける。 `#resource_name` は Terraform らしく、半角英字とアンダースコアしか使えない制約も追加した。

```cue
#aws_ebs_volume: {
    #resource_name: =~ "^[a-z_]+$"
    #availability_zone: string
    #size: <100
    resource: aws_ebs_volume: "\(#resource_name)": {
        availability_zone: #availability_zone
        size: #size
    }
}

#aws_ebs_volume & {
    #resource_name: "prod_instance_ebs"
    #availability_zone: "ap-northeast-1a"
    #size: 10
}
```

これだと非常にシンプルにはなったが、呼び出し側で `aws_ebs_volume` に新たなパラメータを追加できなくなっていることには注意が必要だ。頑張れば何か手段があるかもしれないが、今の時点では思い浮かばなかった。

## Package / Modules の分離

Definition による型や制約は、何らかの形で切り出して、複数のプロダクトなどで使い回したくなってくる。コードの再利用を進める仕組みとして、 CUE にも Package / Modules の概念が存在している。

CUE で Modules を使うには、 `module: "example.com/pkg"` と記したファイルを `./cue.mod/module.cue` に配置する必要がある。手動で作ってもよいが、 `cue mod init example.com/pkg` コマンドで自動生成もしてくれる。このあたりは Go の設計に影響を受けており、モジュール名も `github.com/user/repo` 形式が [原則とされている](https://cuelang.org/docs/concepts/packages/#creating-a-module) 。 `cue mod init` により、Go での外部パッケージ管理を彷彿とさせる `cue.mod/{pkg,usr}` といったディレクトリも作成されるのだが、現時点では CUE 自体の Package Management の仕組みがなく、あまり活用する機会がないように思えている。

https://github.com/cue-lang/cue/issues/851

Package を宣言するのも Go と同様で、1 行目に `package main` のように記述する。なお Package と Module は包含関係にあり、 Module 内に複数 Package が存在できる。 Module はディレクトリで切られるが、その中に異なる Package のファイルが複数配置可能だ。

実践してみる。先の例から、スキーマについては別の Package に切り出すとして、 `./schema/terraform` に以下のようなファイルを作る。

```cue
package ebs

#aws_ebs_volume: {
    #resource_name: =~ "^[a-z_]+$"
    #availability_zone: string
    #size: <100
    resource: aws_ebs_volume: "\(#resource_name)": {
        availability_zone: #availability_zone
        size: #size
    }
}
```

これを `./main.cue` で呼び出すときも、やはり Go のような書き方になる。ここでは仮に `cue mod init github.com/chroju/cue-sandbox` を実行済みとする。

```cue
package main

import (
    "github.com/chroju/cue-sandbox/schema/terraform:ebs`
)

ebs.#aws_ebs_volume & {
    #resource_name: "prod_instance_ebs"
    #availability_zone: "ap-northeast-1a"
    #size: 10
}
```

実際の現場で使う場合は、さらに複雑なモジュール構成になっていくのかもしれない。例えば社内標準の `#aws_ebs_volume` を定義した Package を設け、それを `package prod` で本番環境相当により厳しくした `#aws_ebs_volume` と掛け合わせる、といった使い方が想定できる。

## Script で Terraform を実行する

今更ながら CUE という単語の意味を紐解くと、 `Configure Unify Execute` の略だとされている。最後の `Execute` についてだが、CUE には [Scripting](https://cuelang.org/docs/usecases/scripting/) というコマンド実行の機能が備わっている。組み込みの `tools/exec` や `tools/file` といったパッケージを使って、シンプルなシェルコマンドの実行からファイルの作成削除など、様々な操作が可能だ。

CUE で Terraform を扱う場合、Terraform コマンドの実行前に CUE から JSON への変換などを行う必要があるので、これをスクリプトにまとめると便利になる。詳細は割愛するが、以下のような CUE を書いて、 `cue cmd plan` と実行することにより、変換から `terraform plan` の実行、変換後 JSON の削除までを一発で完了させることができた。

```cue
package main

import (
	"tool/cli"
	"tool/exec"
	"tool/file"
)

command: plan: {
  echo_start: cli.Print & {
    text: "Convert cue to JSON ..."
  }

  export: exec.Run & {
    cmd: ["cue", "export", "."]
    stdout: string
  }

  remove_old_file: file.RemoveAll & {
    path: "terraform.tf.json"
  }

  generate_file: file.Append & {
    filename: "terraform.tf.json"
    contents: export.stdout
  }

  echo_plan: cli.Print & {
    text: "Execute terraform plan ..."
  }

  tfplan: exec.Run & {
    cmd: ["terraform", "plan", "-out=tfplan"]
  }

  remove_file: file.RemoveAll & {
    $dep: tfplan
    path: "terraform.tf.json"
  }
}
```

## Impression

ざっくりと型定義、バリデーションなども行いつつ、CUE を使って Terraform を実行するまでを眺めてみた。率直な感想としてはわりと使えそうかもしれないと感じた。どちらかの方向への依存関係が発生するわけではなく、複数の定義を掛け合わせて最終的なデータを作って行くという形式は柔軟性が高い。Terraform 標準の機能では module の中で module を使ったりするとかなり複雑化してくるが、CUE であれば後からパラメータを追加するといったことも簡単にできる。かなり高機能なバリデーションを、 Sentinel や OPA/Rego といった別のツールを使わず、 CUE の中で完結できるのも良い。

一方、注意点も少なくない。当然ながら HCL の機能は使えないため、 `bucket = aws_s3_bucket.this.id` のようなリテラルは利用できず、懐かしい `"${aws_s3_bucket.this.id}"` 形式を使う必要がある。また先述したとおり、Package management の仕組みがないのは少々想定外だった。個人的にはスキーマだけを切り出した Module を 1 つのレポジトリで共有して、各プロダクトでそれを import するような使い方を想定していたからだ。インポートの機能としては `cue get go` コマンドによって Go Module の struct を CUE の struct として読めるという機能はあるので、そう遠くないうちに CUE Module もインポートできるようになるだろうとは思う（Kubernetes のリソースは Go の struct で定義されているため、これが結構便利らしい。残念ながら Terraform resource のスキーマ自体は [struct ではない](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-sdk/v2@v2.24.1/helper/schema#Resource)）。VSCode Extension などの入力支援もまだ乏しく、良くも悪くもまだまだ発展途上にあると感じてもいる。

あとは CUE の学習コストをかけてまで移行するメリットを見出せるか次第かなと思う。Lattice の概念に基づく記述は他に経験がなく、慣れるまでに多少の時間はかかったし、ここに書いた記述法でもまだ触り程度であり、CUE の表現力は極めて高く、それなりに学習コストを要する言語ではある。ただ、一度覚えれば Kubernetes にも Terraform にも、その他 JSON や YAML を使った様々な言語も内包し得るというのは魅力に映る。冒頭に貼った NTT コミュニケーションズやメルカリが目指しているのは、おそらくそういう地平なんじゃないだろうか。

## Reference

今回参考にしたサイトをいくつか貼っておく。公式の Docs を見るのであれば Tutorials と Language Specification は特におすすめである。ただ、これだけではなかなかイメージが掴めず、Cutorials に非常に助けられた。

- [Documentation | CUE](https://cuelang.org/docs/)
- [Cuetorials](https://cuetorials.com/)
- [How CUE Wins | Cedric Charly's Blog](https://blog.cedriccharly.com/post/20210523-how-cue-wins/)
- [The Configuration Complexity Curse | Cedric Charly's Blog](https://blog.cedriccharly.com/post/20191109-the-configuration-complexity-curse/)
- [CUE 言語の Kubernetes チュートリアル【和訳】 - Qiita](https://qiita.com/riita10069/items/1c9077657fcd62843aaf)
