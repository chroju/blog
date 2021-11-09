---
title: "kops と Argo CD でプライベート Kubernetes を建てる"
date: "2021-11-09T17:13:35+0900"
tags: ["kubernetes", "kops", "argo cd"]
---

先日 [CloudNative Days Tokyo 2021](https://event.cloudnativedays.jp/cndt2021) を見ていて、知らない kubernetes 関連のツールがまだまだあることを実感した。 AWS サービスや各種 OSS はわりとサクッとローカルで試せたりもするんだけど、 k8s 関係もプライベートでシュッと試せる環境が欲しいよな、ということを考え、クラスターを1個作ってみた。

## 利用技術

Kubernetes のインストールには [kOps](https://kops.sigs.k8s.io/) を使った。

そのほかのツールとしては [kubeadm](https://github.com/kubernetes/kubeadm) や [kubespray](https://github.com/kubernetes-sigs/kubespray) などがある。 kubeadm は以前使ったこともあるのだが、サーバーの中でコマンドを実行することで Kubernetes コントロールプレーンもしくはワーカーノードとして必要な設定が施される。 kops はこれとは異なり、 AWS で必要なリソース各種の構築と、サーバー内の設定の双方をおこなってくれる。今回 kops を選んだのは、 Kubernetes Cluster 一式が一発で構築できるので kubeadm より楽だったから、という理由に尽きる。VPS を使うより AWS のほうがある程度金額面で高くはなるが、検証するなら業務でもよく使う環境のほうがいいだろうということで AWS にした。リザーブドインスタンスを適用すれば、サーバー代自体はそこまで国内主要 VPS と変わらないと認識している。

ちなみに kubespray のことはよく知らない。

また、 Kubernetes 上に manifest を適用するにあたっては [Argo CD](https://argo-cd.readthedocs.io/en/stable/) による GitOps を採用した。これは業務で使っているものに揃えた。

## kops

kops は本当にザックリでよければ、 `kops create cluster $NAME` コマンドで初期設定を作成し、 `kops update cluster $NAME --yes` でクラスターの構築が終わる。構築にあたっては `~/.kube/config` も自動で設定され、そのまま k8s が利用可能となる。もともと AWS で簡単にクラスターを立てることを目的としたツールだったようだが、現在はその他の各種クラウドサービス、 VPS も alpha, beta の状態でサポートされている。

kops の設定情報は `create cluster` コマンドにオプションで手渡す。例えば `--master-size` でコントロールプレーンのインスタンスタイプを設定できる。設定情報の実態は、 `kops` コマンドの実行時に予め `KOPS_STATE_STORE` 環境変数で設定した S3 バケットに保存される。

### kops + Terraform

設定を宣言的に Git で管理したければ、 `create cluster` コマンドに `--target=terraform` オプションを与えることで、 Terraform の設定を出力させることができる。

```bash
$ kops create cluster kops.chroju.dev --zones=ap-northeast-1a --master-size t3.small --node-size t3.small --networking calico --ssh-public-key ~/.ssh/id_rsa.pub --out=. --target=terraform

$ terraform apply -auto-approve
```

これは先の S3 バケット内の設定を Terraform 形式に落とし込む形になるが、この後は S3 側の設定は必要としなくなり、 Terraform コマンドだけでオペレーションできるようになる。このほうが、 kops はあくまで設定テンプレートを出力するだけのツールとして扱うことができ、クラスター管理において kops を離れることができるという点でも利がある（ただし、 kops が自動的に [etcd のバックアップ](https://kops.sigs.k8s.io/operations/etcd_backup_restore_encryption/)などでも S3 を使用するため、 S3 が不要になるわけではない）。

### ssh 接続を ssm に切り替える

kops はデフォルトで ssh による各ノードへのアクセスを有効としているが、セキュアではないので AWS SSM による接続へ切り替えたい。 Terraform を編集して ssh の許可を塞ぎ、各ノードの IAM Role に `AmazonEC2RoleforSSM` policy を追加しておく。

<a href="https://gyazo.com/f0c7a85045d7a6d4bc90d15b6cc3819c"><img src="https://i.gyazo.com/f0c7a85045d7a6d4bc90d15b6cc3819c.png" alt="Image from Gyazo" width="600"/></a>

<a href="https://gyazo.com/53d3c939f3a7446c03ab36a36bf7189d"><img src="https://i.gyazo.com/53d3c939f3a7446c03ab36a36bf7189d.png" alt="Image from Gyazo" width="600"/></a>

画像は省略したが、 IPv6 の Port 22 も同様に閉じておく。

### ノード内部設定変更の反映

kops が出力する Terraform では、各ノード内部の設定には user data を使用している。 Terraform では user data を編集してもインスタンスの再起動は行われないため、即時の反映はされない。この場合は `kops rolling-update` を実行することで、インスタンスを入れ替えることができる。

## Argo CD

2021年2月から、[公式の Helm Chart](https://artifacthub.io/packages/helm/argo/argo-cd) がリリースされているので、これを使ってインストールした。

### App of apps

Argo CD による Application の管理には [App of apps](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#app-of-apps) パターンを採用した。

Argo CD は、管理対象の Kubernetes manifests を Application と呼ばれる CRD で設定する。対象の Git レポジトリの URL やパスを Application 内で設定することで、定期的にそのレポジトリを fetch して、 Kubernetes クラスター上に apply する。

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: guestbook
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/argoproj/argocd-example-apps.git
    targetRevision: HEAD
    path: guestbook
  destination:
    server: https://kubernetes.default.svc
    namespace: guestbook
```

この Application 自体も Kubernetes resource なので、 Argo CD で管理したくなる。そこで Application を管理する Application（便宜的に「親 app」と呼ぶ）を作成するパターンが App of apps と呼ばれる。具体的には Helm Chart で以下のようなファイルを作成する。

```bash
.
├── Chart.yaml
├── templates
│   ├── argo-cd.yaml
│   └── namespace.yaml
└── values.yaml
```

Chart.yaml は適当な内容でよい。

```yaml
apiVersion: v1
name: app-of-apps
version: 0.0.1
```

values.yaml には管理対象となる Application のデフォルト値を設定しておく。

```yaml
metadata:
  namespace: argo-cd
spec:
  destination:
    server: https://kubernetes.default.svc
  source:
    repoURL: https://github.com/chroju/infrastructure
    targetRevision: HEAD
```

templates 内に app 1つにつき1ファイルを作成していく。ここで Application を管理していく。以下では、 `chroju/infrastructure` レポジトリの `kubernetes/namespace` 配下が Application の同期対象となる。

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: namespace
  namespace: {{ .Values.metadata.namespace }}
spec:
  project: default
  source:
    repoURL: {{ .Values.spec.source.repoURL }}
    path: kubernetes/namespace
    targetRevision: {{ .Values.spec.source.targetRevision }}
  destination:
    server: {{ .Values.spec.destination.server }}
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

この Helm Chart を管理する Application をさらに作っていくとさすがに切りがないので、ここだけは `argocd app create` コマンドにより手動で Argo CD へ Application を作成する。すると画面上では以下のように、親 app から各 Application がぶら下がるような形になる。

<a href="https://gyazo.com/76782bf27a1953507d99d3088de586f0"><img src="https://i.gyazo.com/76782bf27a1953507d99d3088de586f0.png" alt="Image from Gyazo" width="600"/></a>

今後 Application を追加したい場合は、先の Helm の template にファイルを追加していくだけでいいので、今後は Git 上の操作だけで manifest を apply できる、 GitOps の環境ができあがる。

### Argo CD UI へのアクセス

なお、k8s 上のアプリケーションを expose する手段をまだ持っておらず、 Argo CD は port forward でアクセスしている。常時アクセスしたいものではないし、これでも別に良いような気もしているが、気が向いたら何か手段を講じるかもしれない。

```bash
$ kubectl port-forward argo-cd-argocd-server-XXXXXXXXX-XXXXX 8080:8080
```

## Next

とりあえず、 k8s cluster とその上で動く resource がすべて declarative に管理できる状態がこれで出来上がった。まだまだ課題はあるので、ゆっくり育てていきたい。

* 先述の Argo CD port forward をどうするか
* Argo CD ログインを何らかの OAuth へ変更したい
* 監視を実施したい
* Reserved Instance を購入したい
* 定期的なアップデートを実施していきたい

実は1年近く前にも kubeadm + ConoHa でクラスター構築したのだが、当時の設定を何も情報残していないし、管理が頓挫したので今回が再挑戦になる。今回こそは続けていきたいところ。
