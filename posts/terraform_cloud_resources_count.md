---
title: "Terraform Cloudで課金対象となるリソース合計数を、コマンドで取得する"
date: "2023-11-13T19:04:51+0900"
tags: ["terraform"]
---

宣伝記事です。

https://www.hashicorp.com/blog/terraform-cloud-updates-plans-with-an-enhanced-free-tier-and-more-flexibility

2023年5月より、Terraform Cloudで新しい料金体系が導入された。多くの人が使うであろう、Free tierと真ん中のStandard tierはリソース数に応じた課金（Freeはリソース数500までの制限）、という説明になっているが、パッと見だと何のリソースのことかよくわからない。

結論としては、Terraform Cloudに保存しているState上に記録されたリソース数の合計ということになる。要するに `terraform state list` で出てくるリソースの数ということになるのだが、 `null_resource` や `data` は含まないということで、ただそのまま数えればいいというわけではない。

https://dev.classmethod.jp/articles/tfc-pricing-resource/

こちらのClassmethodの記事にそのあたりは詳しく書いてあり、Terraform CloudのGUI上における数え方も記載されている。ただ残念なのは、まだ新料金体系で契約をしていない場合、課金対象となるOrganization全体のリソース数を直接見る手段がなく、各Workspaceのリソース数を1つずつ見て足し合わせるしかないということだ。Standard tierへ移行する前に、どの程度の料金になるのか見積もりたくても、そのための手段がないというのは、ちょっと不便だと思う。

というところで宣伝にはなるが、Terraform CloudのAPIを実行する [tfcloud](https://github.com/chroju/tfcloud) というCLIツールを以前から作っている。これの `workspace view` コマンドを使えば、以下のようにリソース数を始めとした情報を取得できる。何もオプションを付けずに実行すれば、カレントディレクトリのTerraformの設定を見て、そのbackendとなっているWorkspaceの情報を取得する。

```bash
$ tfcloud workspace view
Name:               test-a
Terraform Version:  1.6.2
VCS Repo:
Working Directory:
Execution mode:     local
Auto Apply:         false
Resource count:     1
Created at:         2023-05-05 00:16:03 (UTC)
Updated at:         2023-08-02 10:42:25 (UTC)
URL:                https://app.terraform.io/app/chroju/workspaces/test-a
```

すべてのWorkspaceの情報を一括で取得するなら `workspace list` コマンドを使えばいい。 `--format json` を付加すれば、全Workspaceの情報が単純に配列になった形の雑なJSON構造で落ちてくるので、こういう感じでjqを使えば一発でリソース数合計も取れる。

```json
$ tfcloud workspace list chroju --format json | jq '[.[].resource_count] | add'
122
```

tfcloud、ローカルからTerraform Cloudの情報を取るのには結構便利で、自分用のツールとしてちまちまと使い続けている。最近 [tfc-workflows-tooling](https://github.com/hashicorp/tfc-workflows-tooling) という、Terraform CloudのAPIを実行する公式のツールも出てきたので、tfcloudはお役御免になるかなと期待もしているが、こちらは `plan` や `discard` を実行する、本当にワークフロー周りのAPIしか実装しないようで、しばらくはtfcloudが必要そうだ。OpenTofuの顛末を見ていると、これも名前変えたほうがいいのかなとは、ちょっと思っている。
