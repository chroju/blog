---
title: "docker/build-push-action v3.3.0で導入されたprovenanceオプションにまつわる問題"
date: "2023-01-25T12:50:17+0900"
tags: ["docker", "github actions"]
---

[docker/build-push-actionのv3.3.0](https://github.com/docker/build-push-action/releases/tag/v3.3.0) で、 `provenance` というオプションが入り、デフォルトで有効化された。このオプションについては、

> This may introduce issues with registry and runtime support (e.g. GCR and Lambda).

という注意書きがされており、一部環境で問題が起きる可能性がある。GitHub Actionsでバージョンをマイナー、パッチバージョンまで指定せずに使っていた場合、自動的にこのバージョンが適用されるため、実際に問題になったという声もTwitterで散見され、自分も一部で引っかかった。

<blockquote class="twitter-tweet"><p lang="en" dir="ltr"><a href="https://twitter.com/github?ref_src=twsrc%5Etfw">@GitHub</a> Actions runner bumped <a href="https://twitter.com/Docker?ref_src=twsrc%5Etfw">@Docker</a> buildx today, which has default provenance on. It&#39;s a nice feature, but many registries do not support it including google container registry.<br><br>All builds broke, and had to disable provenance.<a href="https://t.co/wp0TsgAJi8">https://t.co/wp0TsgAJi8</a> <a href="https://t.co/eH0uv3fkZp">pic.twitter.com/eH0uv3fkZp</a></p>&mdash; Sigurd Fosseng (@fosseng) <a href="https://twitter.com/fosseng/status/1616227805125025792?ref_src=twsrc%5Etfw">January 20, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### （2023-01-31 追記）

その後v3.3.1で、 `provenance` オプションはデフォルト無効化に切り替えられ、改めてデフォルト有効化はv4.0.0でメジャーバージョンアップとして取り入れられた。

参考 : [Disable provenance by default if not set by crazy-max · Pull Request #781 · docker/build-push-action](https://github.com/docker/build-push-action/pull/781)

（追記ここまで）

## SLSA Provenanceとは何か

`provenance: true` を設定すると、Provenance attestationなるものが出力されるようになる、と書かれている。ドキュメントとしては [Provenance attestations | Docker Documentation](https://docs.docker.com/build/attestations/slsa-provenance/) に記載があり、ここでは [SLSA Provenance schema, version 0.2](https://slsa.dev/provenance/v0.2#schema) に従ったものが出力されるのだとされている。

SLSAは、Supply chain Levels for Software Artifactsの略である。ソフトウェアのサプライチェーン、つまり開発からビルドを経てデプロイされるまでの一連の過程において、外部の攻撃からその完全性を守るためのフレームワークがSLSAである。これはGoogleによって2021年に提唱されたものであり、背景などに関しては以下の記事が詳しい。例えばCI環境の汚染など、この分野での脅威は近年増加傾向にあるのだという。ちなみにSLSAの発音は「サルサ」だそうだ。

https://security.googleblog.com/2021/06/introducing-slsa-end-to-end-framework.html

SLSAには4つのレベルがあるが、このうち最も低いレベルであるSLSA 1で必要とされるのが、ソフトウェアのビルドプロセスに関するProvenance、すなわち来歴の情報をメタデータとしてアーティファクトに添付することだとされている。

## Buildkit 0.11でのProvenance attestation対応

Dockerのビルドにおいては、2023年1月に [buildx v0.10.0](https://github.com/docker/buildx/releases) でSLSA Provenanceへの対応が盛り込まれ、このbuildxを内包した [Buildkit v0.11.0](https://github.com/moby/buildkit/releases/tag/v0.11.0) が同じ月にリリースされた。

https://www.docker.com/blog/highlights-buildkit-v0-11-release/

このバージョンでは `--provenance true` オプションを `docker buildx build` に付与することにより、Provenanceを生成してイメージに添付できる。冒頭のdocker/build-push-action v3.3.0における `provenance` オプション追加は、これを受けてのものである。

なお、手元のdockerでもこのオプションを試したかったのだが、macOS上でもUbuntu上でもエラーになってしまったので、残念ながらまだ試せていない。

## Attestation Storageの仕組みとレジストリ等の対応状況

Provenance attestationのイメージへの添付においては、 [Attestation Storage](https://github.com/moby/buildkit/blob/master/docs/attestations/attestation-storage.md) という仕組みが使われている。

DockerやOCIによるコンテナの仕様においては、image manifestと呼ばれるイメージのメタデータを格納する仕組みがある。さらに複数のmanifestの参照情報を保存する仕組みもあり、OCIでは [image index](https://github.com/opencontainers/image-spec/blob/main/image-index.md) 、Dockerでは [Manifest List (fat manifest)](https://docs.docker.com/registry/spec/manifest-v2-2/#manifest-list) と呼ばれている。例えばmulti-platform imageの場合、各platformごとにmanifestが生成されるので、これらがimage indexの中で取りまとめられる形になる。image indexについては、 `buildx imagetools inspect` コマンドで確認ができる。

```bash
❯ docker buildx imagetools inspect docker/buildx-bin
Name:      docker.io/docker/buildx-bin:latest
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:08625f48a68bb050f54b1840b5cab728ff3f086fd00f1fb08389f4b1cb9db221

Manifests:
  Name:        docker.io/docker/buildx-bin:latest@sha256:aecb1ff186197954361752564c04e73a464f0132fa15ac31a36d70580d8eba82
  MediaType:   application/vnd.oci.image.manifest.v1+json
  Platform:    darwin/amd64

  Name:        docker.io/docker/buildx-bin:latest@sha256:3ac63f40838fb8c2170b2d96bb5fadbffb5854ad3868c117016bbe73dee9b0d7
  MediaType:   application/vnd.oci.image.manifest.v1+json
  Platform:    darwin/arm64

  Name:        docker.io/docker/buildx-bin:latest@sha256:caf1d5f0527f5a9e7ce7ac8bb0c2b065567e3cc2dee9d5c4ddf1589f4f59b959
  MediaType:   application/vnd.oci.image.manifest.v1+json
  Platform:    linux/amd64
```

Attestation Storageはこのmanifestを活用して保存されており、image indexにもその情報が記載される。

しかしながら、一部のコンテナレジストリなどは、Attestation Storageに対応できていない。より具体的にはmulti-platform imageに対応していない場合があるのだが、それはすなわちimage indexに対応していないことを意味しているようで、そのためAttestation Storageを使っているimageも起動できないようだ。GCPのCloud RunやAWS Lambdaが該当しており、issueが挙げられている。

https://github.com/docker/buildx/issues/1533

またAmazon ECRはmulti-platform imageに対応してはいるものの、image indexを適切に処理できていないのか、Storage部分のmanifestがイメージとして認識されてしまい、 `<Untagged>` という名前で表示されたり、イメージスキャンが走ったりしてしまうという問題が報告されている。

https://github.com/aws/containers-roadmap/issues/1596

https://github.com/docker/build-push-action/pull/746#issuecomment-1377806123


## 暫定的な対処と今後

上記のように不具合を起こす可能性があるため、自身が利用しているコンテナ環境の対応状況を見つつ、暫定的には `provenance: false` の指定が必要になってくる。コンテナ自体は正常に起動していても、ECRの例のようにレジストリが対応できていない場合もあるため、そちらもあわせて確認したほうが良さそうだ。

表層的には「面倒なものが追加されたな」という思いもあるが、SLSA自体の有効性は理解できる。ソフトウェアのサプライチェーンをめぐるセキュリティについては、アメリカの大統領令に盛り込まれたSBOM (Software Bill of Materials)の話題を聞くことも多くなってきているし、長期的にはより大きなトレンドになってくる可能性は小さくない。将来的には多くのコンテナレジストリや実行環境が対応し、特に気にせずデフォルトでProvenanceを生成するようになるのかもしれない。

~また今回の事例はdocker/build-push-actionの3.3.0における「破壊的な」変更がきっかけになったが、一部の環境で問題を引き起こしかねないことが事前に予見されていたのであれば、これはメジャーバージョンアップが妥当だったのではないか、という思いもある。Dockerとしては生成物が追加されるだけで後方互換性を壊すわけではないので、これはマイナーバージョンアップ相当であり、レジストリなどの対応状況については知らんよ、という言い分なのかもしれないし、それも理解できるところではあるのだが……。~ （先述した追記の通り、その後改めてこの変更はメジャーバージョンアップとして扱われることになった）

まぁGitHub Actionsを使う側としては `@v3` 指定で不意にアップデートされてしまった、というのはやはりよろしくないので、推奨されているcommit hashでのバージョン指定か、パッチバージョンまで固定するべきなのだろうな、とは思う。
