---
title: "K3s + Cloudflare Zero Trustな環境をuser dataでシュッと建てる"
date: "2022-08-16T09:07:18+0900"
tags: ["kubernetes", "cloudflare", "argocd", "k3s"]
---

個人のKubernetes環境でベストな形というのを結構ずっと探っている。やりたいこととしてはIaCできちんと管理した形でK8sを運用したい、というのと、クラウドに建てるので、ローカルからセキュアにK8s APIを叩きたい、というあたり。昨年は [kops と Argo CD でプライベート Kubernetes を建てる - chroju.dev/blog](http://chroju.dev/blog/kops_argo_cd_private_k8s_cluster) というのを書いたりしたのだが、結構重量級の環境になってしまった故、その後断念している。

最近 [K3s](https://k3s.io/) を用いることである程度形になった。K3sはワンバイナリで動作する軽量なK8s実装であり、非常に扱いやすい。またK8s APIを遠隔から実行するにあたっては [Cloudflare Zero Trust](https://www.cloudflare.com/ja-jp/products/zero-trust/) を用いることにしてみた。

現在、この環境をEC2 + user dataを使って `terraform apply` 一発で建てる仕組みを使い始めたので、少しまとめておきたい。

## K3s

https://k3s.io/

Kubedrnetes (K8s) から諸々の機能を省いて、メモリフットプリントを半分にした実装。名前もKubernetes = 10文字の半分なので5文字でK3s、ということらしい。Rancherが元々開発していたもので、2020年にCNCF入りしている。

最も簡単なインストール方法としては `curl -sfL https://get.k3s.io | sh -` を実行することだが、あまりスクリプトでのインストールが好きではないので、直接バイナリを落としてきて使っている。バイナリダウンロードによるインストール方法も[Docsに言及があり](https://rancher.com/docs/k3s/latest/en/installation/install-options/)、systemd周りの設定を自力でやらなくてはならないぐらいで、特別煩雑な手順にはならない。

```bash
# Install k3s
curl -Ls https://github.com/k3s-io/k3s/releases/download/${k3s_version}/k3s -o /usr/local/bin/k3s
chmod +x /usr/local/bin/k3s
ln -s /usr/local/bin/k3s /usr/local/bin/kubectl

cat > /etc/systemd/system/k3s.service <<EOF
[Unit]
Description=Lightweight Kubernetes
...

Environment=K3S_KUBECONFIG_MODE=644
...
ExecStart=/usr/local/bin/k3s server
EOF

systemctl daemon-reload
systemctl enable k3s
systemctl start k3s
```

サーバとしてK3sを起動するときのオプションとしては、 `K3S_KUBECONFIG_MODE` を適切に設定しなければ、rootでしか `kubectl` できなくなってしまう点に注意が要る。

`kubectl` もK3sは内包していて、 `kubectl` のエイリアスとして実行すると `kubectl` として動作してくれる。

遠隔から `kubectl` で繋ぎにいくにあたっては、 `/etc/rancher/k3s/k3s.yaml` をkubeconfigとして用いればよい。ローカルからすぐに確認できるよう、user dataの中でこれをパラメータストアへ投げさせている。

```bash
# Register kubeconfig
apt update
apt install awscli -y

KUBE_CONFIG=$(cat /etc/rancher/k3s/k3s.yaml)
aws ssm put-parameter --region ap-northeast-1 --name /chroju/k3s/kube_config --type SecureString --overwrite --value "$KUBE_CONFIG"
```

## Cloudflare Zero Trust + kubectl

`kubectl` はローカルから実行したいが、APIのエンドポイントをインターネット上に開放したくはないので、 Cloudflare Zero Trustを使っている。これはCloudflareが提供するゼロトラスト関連サービスの総称であり、より具体的にはCloudflare TunnelとCloudflare Accessを使う。

Tunnel[^1]は、サーバのインバウンド通信を開放せずとも、サーバ上で稼働するデーモン（cloudflared）がCloudflareと通信を確立することにより、Cloudflare経由でサーバの公開が可能となるサービス。httpを開放してWebサイトを運用するのにも利用できるし、SSHなどもサーバのポート開放を行うことなく通信が可能となる。

Tunnelが開放したエンドポイント自体には認証の仕組みが一切ないため、アクセス制御を行うのにCloudflare Accessを用いる。これはCloudflareのDNSサーバーに登録したドメイン上の任意のパスなどに認証を付与できるサービスで、いわゆるゼロトラストの中心的なサービスにあたると捉えている。個人開発のサービスに簡単に認証が付けられるし、企業ユースならSaaSに対するSSOのようなこともできるらしい。

認証方式は様々なものが用意されているが、最もシンプルなところだとワンタイムコードのメール送信がある。指定したメールアドレスにのみコード送信を許可できるので、メールアカウントさえ守れば防御できる。これを設定すると、当該のエンドポイントへ `kubectl` で繋ぎに行った際、以下のような認証画面がブラウザで自動的に表示されるようになる。

<a href="https://gyazo.com/77fe8ddb6169fb58e4b67003ea00c500"><img src="https://i.gyazo.com/77fe8ddb6169fb58e4b67003ea00c500.png" alt="Image from Gyazo" width="698"/></a>

Tunnelを使うにあたっては、先にTunnelを作成しておき、cloudflaredには接続するTunnelの情報を書いたJSONと、接続に必要なSecretなどが書かれたYAMLを読み込ませる形になる。TunnelはTerraformで構築できるので、先にTeraformで構築した後、必要な情報をTerraform `templatefile` に埋め込んでuser dataを作成している。

```bash
# Install cloudflared for kubectl (Kubernetes API)
curl -Ls https://github.com/cloudflare/cloudflared/releases/download/${cloudflared_version}/cloudflared-linux-amd64.deb -o /tmp/cloudflared.deb
dpkg -i ./tmp/cloudflared.deb

mkdir -p /root/.cloudflared
cat > /root/.cloudflared/${cloudflare_tunnel.kubectl.id}.json <<EOF
{
  "AccountTag": "${cloudflare_account_id}",
  "TunnelSecret": "${cloudflare_tunnel.kubectl.secret}",
  "TunnelID": "${cloudflare_tunnel.kubectl.id}"
}
EOF

cat > /root/.cloudflared/config.yaml <<EOF
tunnel: ${cloudflare_tunnel.kubectl.id}
credentials-file: /root/.cloudflared/${cloudflare_tunnel.kubectl.id}.json

ingress:
  - hostname: ${cloudflare_tunnel.kubectl.hostname}
    service: tcp://127.0.0.1:6443
    originRequest:
      proxyType: socks
  - service: http_status:404
EOF

cloudflared service install
```

`config.yaml` に記載の通りSOCKSによるプロキシとして開放している。あとはローカル側にもcloudflaredをインストールし、 `cloudflared access tcp --hostname example.com --url 127.0.0.1:1234` で、ローカルの1234 portがKubernetes APIと繋がった形になる。

この方法はCloudflare Docsに [Connect through Cloudflare Access using kubectl · Cloudflare Zero Trust docs](https://developers.cloudflare.com/cloudflare-one/tutorials/kubectl/) として掲載されている内容を、ほぼそのまま使わせてもらっている。なお、プロキシ経由で `kubectl` を実行するにあたり、Docsでは `env HTTPS_PROXY=socks5://127.0.0.1:1234 kubectl ...` を使っているが、kubeconfigに書いてしまったほうが楽なのでそうしている。

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: XXX...
    server: https://example.com
    proxy-url: socks5://127.0.0.1:1234
```

## user dataにどこまで含めるべきか？

ここまでの内容をuser dataに書いてEC2を起動すれば、そのまますぐにローカルから `kubectl` で繋ぎに行けるような環境は出来上がる。これだけでも良いのだが、自分はCDにArgo CDを使っていて、そのデプロイまでuser dataで済ませるべきか少々悩んだ。

user dataは非常に便利だが、一回性のただのコマンド群なので `as Code` 的ではない。K8s上に展開するArgo CDに関しては、きちんとマニフェスト管理するべきという考え方もあり、ここは意見が分かれるところとも思う。

まぁしかし、個人の環境だとArgo CDのマニフェストを書き換えて、という機会もそれほどないし、作ったときにはもうArgo CDも動いていて、あとはGitOpsで全部制御できる、となっているほうが嬉しい。ということで割り切ることにした。個人開発では割り切りが大事。

## Cloudflare Zero Trust + Argo CD

Argo CDのGUIもCloudflare Zero Trustで開放している。

### HelmChart CRD

Argo CDの導入には、簡単なところでHelmを使いたい。K3sはHelmも内包しているのだが、しかしHelmのコマンドラインは付属していない。ならばChartをどうインストールするのか、というところだが、HelmChartというCRDを使うことになっている。

https://rancher.com/docs/k3s/latest/en/helm/

HelmChartは、HelmでインストールするChartの情報を定義できるCRDであり、これをapplyすることで `helm install` がJobとして自動的に走る。 `helm install` を手続き的に実行するのではなく、宣言的にどう管理するかは結構頭を悩ませるポイントだと思うが、こんなスマートな回答があったとは知らなかった。このCRDは [k3s-io/helm-controller](https://github.com/k3s-io/helm-controller) を導入することで、K3s以外のK8s環境でも使えるらしい。

ということで、Helmを通じたArgo CDのインストールはこのようなコマンドになった。なお、マニフェストにコメントで書いているが、Argo CD serverのHTTPSは無効化しておく必要がある。HTTP接続があるとArgo CD serverはHTTPSへ307 redirectするのだが、これをCloudflare Tunnel経由だと上手く処理できないためだ（Tunnelのエンドポイントとローカル間はHTTPSにできるので問題はない）。

```bash
cat > /tmp/argo-cd-helm-chart.yaml <<EOF
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: argo-cd
  namespace: kube-system
spec:
  repo: https://argoproj.github.io/argo-helm
  chart: argo-cd
  targetNamespace: argo-cd
  valuesContent: |-
    server:
      extraArgs:
        - --insecure # HTTPSを無効化しないとArgo Tunnelから繋がらない
EOF

kubectl create ns argo-cd
kubectl apply -f /tmp/argo-cd-helm-chart.yaml
```

### Cloudflare Tunnel on K8s

Argo CDのServiceをTunnelで開放するため、今度はTunnelをK8s上に展開するが、これもCloudflareが記事 [Kubectl with Cloudflare Zero Trust](https://blog.cloudflare.com/kubectl-with-zero-trust/) を公開しているので、詳細は割愛する。必要なのは接続情報を書いたYAMLと認証情報を書いたJSONであるという点は変わらない。

### ApplicationSetのApply

Argo CDで管理したいApplicationはApplicationSetとしてまとめてGitHubに置いているので、最後にこれを読ませてやれば、Argo CDがバシバシ必要なApplicationを展開してくれて、GitOpsがすぐに使えるようになる。

```bash
curl https://raw.githubusercontent.com/chroju/infrastructure/main/kubernetes/applicatio
n-set/application-set.yaml -o /tmp/application-set.yaml
while true
do
    # Argo CD ApplicationSet Controllerの起動を待つ
    kubectl get deployment/argo-cd-argocd-applicationset-controller -n argo-cd | grep 1
/1
    if [[ "$?" == '0' ]]; then
        break
    fi
    sleep 10
done

kubectl apply -f /tmp/application-set.yaml
```

大方これで上手くいくはず、なのだが、ApplicationSet Controllerだけが起動してもダメなのか、実は今のところ上手くいっていない。一応Applyはされるのだが、ApplicationSetがエラーを吐いてしまっている。Argo CDのGUIに入って、ApplicationSetを一度削除してから再度Syncすれば直るので、個人環境だし深入りはしていない。追々直すかもしれないし直さないかもしれない。

### Argo CDのパスワード

GUIのデフォルトパスワード、昔はPod nameだったりしたが、最近はsecretに入っているので、これもパラメータストアに投げて、ローカルからすぐ確認できるようにしてやる。

```bash
kubectl apply -f /tmp/application-set.yaml
ARGO_CD_PASSWORD=$(kubectl -n argo-cd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
aws ssm put-parameter --region ap-northeast-1 --name /chroju/k3s/argo_cd_password --type SecureString --overwrite --value "$ARGO_CD_PASSWORD"
```

## Impression

以上の内容を繋ぎ合わせたuser dataの全体像は[Gistにも上げておいた](https://gist.github.com/chroju/2270753a008be6715e3da47ff4e47a03)。何度か言及してきた通り、Terraformの `templatefile` として用いるものとして書いている。

頑張って何もかもuser dataに入れなくてもよかったかもしれないが、 `terraform apply` を実行するだけで、すぐにローカルから `kubectl` でもArgo CDでも繋ぎにいける環境がシュッと立ち上がる、というのは結構体験がいい。個人での技術検証が目的だし、これぐらいの気軽さでいいんじゃないだろうか。K8sのバージョンが上がったらサクッとスクラップアンドビルドしちまえ、ぐらいの気概でいきたい。

また、ここまでに登場したCloudflareの機能は全部無料で使えていて、昨今いろんなところで名前を聞くようになった「Cloudflare」の勢いを感じた。自分が個人開発を始めた頃は、VPSの要塞化に頭を悩ませるような時代だったので、シンプルに「インバウンドは全部塞ぐ」が最適解な時代になったのは喜ばしい。


[^1]: Argo Tunnelという呼び方をウェブ上の記事で見かけることがあるが、おそらく旧名称と思われる。
