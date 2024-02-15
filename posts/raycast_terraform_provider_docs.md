---
title: "RaycastでTerraform Providerのドキュメントを読めるようにしている"
date: "2024-02-15T12:16:47+0900"
tags: ["Raycast", "Terraform", "TypeScript", "React"]
---

最近の個人開発で、Terraform Providerのドキュメントを読むための [Raycast](https://raycast.com) Extensionを作っている。Raycast ExtensionはReactでUIを書く形であり、ReactとTypeScriptの手習いとしてやってみている。なのでStoreで一般公開する気はないが、レポジトリから `clone` すれば誰でもインポートはできる。

https://github.com/chroju/raycast-extensions

処理としては以下のような感じ。

1. ExtensionのPreferenceで、ユーザーが検索したいProviderを登録する（複数可）
1. Extensionを起動すると、登録されたProviderのGitHubレポジトリから、ドキュメントのmarkdownファイル一覧を取得し、その名前をUIへ表示する
1. ユーザーがmarkdownファイルを選択すると、そのファイルを読み込んで表示する

Providerは任意のものを検索可能とし、ユーザーが好きなものを登録できるようにした。Raycastではrequiredな設定項目を作っておくと、Extensionの初回起動時に設定画面を表示してくれるのが便利。デフォルト値を登録しておいてもこの画面は開くので、どのように記載すればいいかデフォルト値を通じて例示が出来るのも良い。

[![Image from Gyazo](https://i.gyazo.com/6028443968e3303f623a28746d37b15e.png)](https://gyazo.com/6028443968e3303f623a28746d37b15e)

任意のProviderに対応可能なのは、ドキュメントがProviderのレポジトリ内の決まった場所に保存されているから。[Terraform Registry - Provider Documentation | Terraform | HashiCorp Developer](https://developer.hashicorp.com/terraform/registry/providers/docs) で、ドキュメントのディレクトリ構造が定められている。

ただ面倒なポイントとしては、ディレクトリ構造の規則が一度変更になっており、さらに従来の規則がまだ有効であること。

* 現行の規則
    * `docs/resources`
    * `docs/data-sources`
* 従来の規則
    * `website/docs/r`
    * `website/docs/d`

AWSやGoogleなどでもまだ従来の規則に則っており、双方に対応する必要がある。どちらの規則に従っているのかをあらかじめ知ることは不可能なので、現行のディレクトリ構造を探索してみて、フォルダがなければ従来のディレクトリ構造を探索するという形にしている。

最後の、ドキュメントを表示する部分はあまり難しくなくて、というのもRaycastにMarkdownを引き渡せば、いい感じに表示してくれる機能が最初から備わっている。Terraform ProviderのドキュメントもMarkdownで書かれており、Frontmatterだけ削除すればRaycastでそのまま表示できる。

[![Image from Gyazo](https://i.gyazo.com/3f10243797f2b34691b5abc04879495d.png)](https://gyazo.com/3f10243797f2b34691b5abc04879495d)

体験としては結構良い感じではあるのだが、Raycastのウィンドウは閉じると初期状態に戻ってしまう点や、表示したMarkdownの全文検索するような機能がない点など、ドキュメントを読むには若干厳しいかなというところもある。うっかり画面を閉じるとまた最初から検索し直し……というのは辛いので、「最近読んだドキュメント」をキャッシュする機能は付けた。

![alt text](https://i.gyazo.com/cb77d069427881d3914472e14c5280dc.png)

ブラウザでドキュメントを開くオプションも付けているので、全文検索しながらじっくり読みたい場合にはブラウザから開く形で対応している。

Raycast Extensionは初めて作ったものの、リッチなUIを簡単に作れるのでモチベーションを保ちやすい。並行してTypeScriptやReactの本を読んでいるので、それらの知識を反映させながらブラッシュアップしてく予定。
