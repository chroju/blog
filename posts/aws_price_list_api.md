---
title: "AWS Price List APIでAWSの料金体系をAPIから確認する"
date: "2022-12-21T09:23:35+0900"
tags: ["aws"]
---

AWSサービスの各種価格設定を確認するときはHTMLを見ることが多いが、 [AWS Price List API](https://docs.aws.amazon.com/ja_jp/awsaccountbilling/latest/aboutv2/price-changes.html) からも確認できる。AWS APIの1つではあるものの、これが他のAPIとは性質が異なり、ちょっと癖がある。

APIにはBulk APIとQuery APIの2種類がある。前者はあるサービスの価格情報などを文字通りまとめてダウンロードできるエンドポイントであり、APIとは言うが、実体としてはAmazon S3に保存されたJSONファイルになっている。そのため対象のサービスなどによってエンドポイント自体が異なってくる。ものによっては、例えばEC2だと4GB近い巨大ファイルが落ちてくるので扱いには注意が要る。

<a href="https://gyazo.com/25e3c266352b066aedf1b2a098f28314"><img src="https://i.gyazo.com/25e3c266352b066aedf1b2a098f28314.png" alt="Image from Gyazo" width="794"/></a>

Query APIはクエリをかけて、あるサービスの特定条件、例えばap-northeast-1のRDSのdb.t4g.microの料金のみを取得できる。こちらは各種SDKでも対応していて、AWS CLIの `pricing` サブコマンドからも叩くことが出来る。APIは3種類あり、 [GetProducts](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_pricing_GetProducts.html) は料金情報の取得、[DescribeServices](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_pricing_DescribeServices.html) はGetProductsでフィルタに使うことができる、あるサービスの属性情報の種類一覧を取得、  [GetAttributeValues](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_pricing_GetAttributeValues.html) は属性情報に指定可能な値を一覧できる。

属性情報というのは例えばEC2であれば `instanceType` のような、価格情報の確定に関わるパラメータ。これが思った以上にたくさん指定しなくては十分に絞りきれない場合があったり、パラメータをどう指定するかわかりづらい部分がある。

Lambdaについて `describe-services` して属性情報を一覧すると以下のようになる。

```bash
$ aws pricing describe-services --service-code AWSLambda --region ap-south-1
{
    "Services": [
        {
            "ServiceCode": "AWSLambda",
            "AttributeNames": [
                "productFamily",
                "termType",
                "usagetype",
                "locationType",
                "Restriction",
                "regionCode",
                "servicecode",
                "groupDescription",
                "location",
                "servicename",
                "group"
            ]
        }
    ],
    "FormatVersion": "aws_v1"
}
```

このうち `usageType` に指定可能な値を `get-attribute-values` で見てみる。

```bash
$  aws pricing get-attribute-values --service-code AWSLambda --attribute-name usageType --region ap-south-1
{
    "AttributeValues": [
        {
            "Value": "AFS1-Lambda-GB-Second-ARM"
        },
        {
            "Value": "AFS1-Lambda-GB-Second"
        },
        {
            "Value": "AFS1-Lambda-Provisioned-Concurrency-ARM"
        },
        {
            "Value": "AFS1-Lambda-Provisioned-Concurrency"
        },
```

これらの値はAWSの料金明細などに記載があるが、それほど日頃見慣れているわけでもないし、AWSのドキュメントなどにも詳細な説明はない。AtributeNamesについては [Product details - AWS Cost and Usage Reports](https://docs.aws.amazon.com/cur/latest/userguide/product-columns.html) に一覧されているが、その具体的な値、Valueが何を意味するかの記述はないので、手探りに考えていくしかない。

Lambdaは比較的とっつきやすくて、 `usageType` に `APN1-Request` （おそらくはap-notheast-1のリクエスト料金の意）を指定すると以下のように結果が1つに絞れる。若干妙な出力形式なのはJSONがstringで吐き出されているからで、こういった点でも癖がある。

```bash
$ aws pricing get-products --service-code AWSLambda --region ap-south-1 --filters Type=TERM_MATCH,Field=usageType,Value=APN1-Request
{
    "PriceList": [
        "{\"product\":{\"productFamily\":\"Serverless\",\"attributes\":{\"regionCode\":\"ap-northeast-1\",\"servicecode\":\"AWSLambda\",\"groupDescription\":\"Invocation call for a Lambda function\",\"usagetype\":\"APN1-Request\",\"locationType\":\"AWS Region\",\"location\":\"Asia Pacific (Tokyo)\",\"servicename\":\"AWS Lambda\",\"operation\":\"\",\"group\":\"AWS-Lambda-Requests\"},\"sku\":\"3BE8DYKG4FYSZGDW\"},\"serviceCode\":\"AWSLambda\",\"terms\":{\"OnDemand\":{\"3BE8DYKG4FYSZGDW.JRTCKXETXF\":{\"priceDimensions\":{\"3BE8DYKG4FYSZGDW.JRTCKXETXF.6YS6EN2CT7\":{\"unit\":\"Request\",\"endRange\":\"Inf\",\"description\":\"AWS Lambda - Total Requests - Asia Pacific (Tokyo)\",\"appliesTo\":[],\"rateCode\":\"3BE8DYKG4FYSZGDW.JRTCKXETXF.6YS6EN2CT7\",\"beginRange\":\"0\",\"pricePerUnit\":{\"USD\":\"0.0000002000\"}}},\"sku\":\"3BE8DYKG4FYSZGDW\",\"effectiveDate\":\"2022-12-01T00:00:00Z\",\"offerTermCode\":\"JRTCKXETXF\",\"termAttributes\":{}}}},\"version\":\"20221214183021\",\"publicationDate\":\"2022-12-14T18:30:21Z\"}"
    ],
    "FormatVersion": "aws_v1"
}
```

自分が試すなかで厄介だったのはEC2で、それなりに多くの属性を指定しなければ一意の情報にまで絞り込むことができなかった。日頃あまり意識していなかったが、インスタンスタイプとリージョンや、Dedicated Hostなどのテナント属性だけでなく、ソフトがプリインストールされていたり、といった要素も関わってくる。最終的に1個に絞り込むには以下の属性が必要だった。

```bash
$ aws pricing get-products --service-code AmazonEC2 --region ap-south-1 --filters '[{"Type":"TERM_MATCH","Field":"instanceType","Value":"t3.medium"},{"Type":"TERM_MATCH","Field":"location","Value":"US East (N. Virginia)"},{"Type":"TERM_MATCH","Field":"operatingSystem","Value":"Linux"},{"Type":"TERM_MATCH","Field":"tenancy","Value":"Shared"},{"Type":"TERM_MATCH","Field":"capacityStatus","Value":"Used"},{"Type":"TERM_MATCH","Field":"preInstalledSw","Value":"NA"}]'
```

なお、このAPIはTerraformにも対応しており、 [aws_pricing_product](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/pricing_product) で取得できる。このData sourceはかなりストイックで、取得結果が価格情報1つにまで絞り切れていないと `plan` の時点で失敗になる。

また先ほど見たとおり、結果はJSONがstringで落ちてくるので、そこから価格情報を取り出すには `jsonencode()` を噛ませる工夫が必要になる。いろいろとコツは要るが、使い方をマスターできればスポットインスタンスの価格設定にオンデマンドの価格を自動取得して設定する、ということもできるようになる。


```hcl
data "aws_pricing_product" "ec2_instance" {
  # Price List APIはus-east-1とap-south-1しか対応していない
  provider     = aws.ap-south-1

  service_code = "AmazonEC2"
  filters {
    field = "instanceType"
    value = "t3.medium"
  }
  filters {
    field = "operatingSystem"
    value = "Linux"
  }
  filters {
    field = "preInstalledSw"
    value = "NA"
  }
  filters {
    field = "location"
    value = "Asia Pacific (Tokyo)"
  }
  filters {
    field = "tenancy"
    value = "Shared"
  }
  filters {
    field = "capacitystatus"
    value = "Used"
  }
}

resource "aws_spot_instance_request" "this" {
  spot_price = values(values(jsondecode(data.aws_pricing_product.ec2_instance.result).terms.OnDemand)[0].priceDimensions)[0].pricePerUnit.USD
}
```

