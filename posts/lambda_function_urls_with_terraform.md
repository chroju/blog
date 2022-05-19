---
title: "TerraformでAWS Lambda Function URLsをデプロイする"
date: "2022-04-16T14:03:05+0900"
tags: ["lambda", "terraform", "aws"]
---

https://aws.amazon.com/jp/about-aws/whats-new/2022/04/aws-lambda-function-urls-built-in-https-endpoints/

AWS LambdaでHTTPSエンドポイントがデフォルト利用できるようになり、API Gatewayを付与する必要がなくなった。早いもので、すでにServerless FrameworkもTerraformも対応しているのだが、せっかくなのでLambdaのデプロイには使ったことがない、Terraformで試してみた。

## Terraform with AWS Lambda

AWS LambdaでTerraformを管理するというのはあまり一般的なケースではなく、僕もServerless Frameworkなどを使うことが多い。

改めて、なぜTerraformでAWS Lambdaを管理しないのか、言語化してみるとポイントはいくつかある。

### Terraformはattribute差分による状態管理を行う

Terraformの基本的な考え方は、クラウドリソースのattributeについて、HCLで記述された状態と実際の状態とを比較し、差分があればそれを適用の対象とする、というものである。AWS Lambdaの場合はソースコードをデプロイするわけだが、その差分はソースコードをzip化したもののハッシュ値を用いて比較することが多い。

しかし、Lambdaでアップロードするzipには、依存ライブラリなどすべてのファイルを含めることになるので、ライブラリインストールにおいて予期せぬ差分が発生する場合がままある。その上Terraformの `plan` 結果で表示されるのはハッシュ値の差分だから、何が実際の差分なのかは判別ができない。

### TerraformはあくまでAWS APIのラッパー

Terraformは基本的にAWS APIをラップするものでしかない。従ってAWS LambdaのFunctionを作成、変更、削除はできるが、コードの依存ライブラリをインストールして、zipに圧縮して、といった作業をうまいことお膳立ててくれるわけではない。Terraformのbuilt-inな機能を使えば実現は可能だが、Serverless Frameworkなど専用のフレームワークを使ったほうが上手いこと付随処理を隠蔽してくれる。

## Example

そういったデメリットを理解しつつ、試しに書いてみたTerraformが以下の通り。

```hcl
resource "null_resource" "lambda_function_pre_build" {
  triggers = {
    packages = filebase64sha256("${path.root}/function/package.json")
  }

  provisioner "local-exec" {
    working_dir = "${path.root}/function"
    command     = "npm i"
  }
}

data "archive_file" "lambda_function" {
  type        = "zip"
  source_dir  = "${path.module}/function"
  output_path = "${path.module}/lambda.zip"

  depends_on = [
    null_resource.lambda_function_pre_build,
  ]
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
  ]


  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "tweet_url" {
  filename         = data.archive_file.lambda_function.output_path
  function_name    = "tweet_url"
  role             = aws_iam_role.iam_for_lambda.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda_function.output_base64sha256
  publish          = true
  timeout          = 10

  runtime = "nodejs14.x"

  environment {
    variables = {
      AUTH_TOKEN = "XXXXXX"
    }
  }
}

resource "aws_lambda_function_url" "tweet_url" {
  function_name      = aws_lambda_function.tweet_url.function_name
  authorization_type = "NONE"
}

output "function_url" {
  value = aws_lambda_function_url.tweet_url.function_url
}
```

今回はNode.js14.xで書いたので、 `null_resource` を使って事前に `npm install` を行い、 `data.archive_file` によってzip化を行っている。自分で試しに書いてみると、楽ではないがやれなくはないな、というところだった。取りあえずやってみるの大事。

肝心のURLだが、 `aws_lambda_function_url` をfunctionに紐付けるだけで設定できる。 `authorization_type` は `NONE` か `AWS_IAM` の2択であり、今回は `X-AUTH-TOKEN` headerを読み込んで、コードの中で簡易的な認証をかける形とした。このほか、CORSの設定ができる。

なお、今回のソースコードは慣れないNode.jsで書いたためめちゃくちゃ汚い気がするので割愛する。以前から個人的に欲しかった、「URLを投げつけると、タイトルを自動取得して『Browsing : タイトル URL』形式でTwitterに投稿してくれる君」を作ってみている。

## Lambda Function URLsでできること

https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html

リクエストからのヘッダー、body、query stringなどの読み取りは一通りできるし、レスポンスにもヘッダー、bodyなどは含められるので、簡単なAPIを作りたい場合などはこれで事足りそうに感じた。

ただ、ドキュメントを読んだ限りではCloudFrontが介在するわけではなさそうだし、エンドポイントのパスを自由に設定できたりもしないので、API Gatewayの完全互換なものではないことには注意したほうがいいかもしれない。
