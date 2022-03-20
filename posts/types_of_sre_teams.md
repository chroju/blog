---
title: "Embedded SREとは何か - SREの組織類型についての覚書"
date: "2022-03-20T09:46:33+0900"
tags: ["sre", "organization"]
---

先日の [6社合同 SRE勉強会](https://line.connpass.com/event/236497/) 最後のディスカッションの中で、 **Embedded SRE** のようなSREの組織類型をどこで知ったのか、という話題が出ていた。これは僕も以前から感じていたことだ。SREの組織類型、特に「Embedded SRE」という単語は最近国内のテックブログでも見かけることが多いが、GoogleのSRE本各種などに直接言及があるわけではない。その場では海外のブログなどで、という程度の話にまとまり、厳密な結論には至らなかったし、僕も原典が何かと言われるとよくはわかっていない。

## Embedded SREとは何か

SREがプロダクトチーム内の職能横断の1つとして配置される体制をEmbedded SREと呼ぶ。これはプロダクトチーム、開発チームの外で中央集権的に組織され、各プロダクトを横断的に見るようなSREの組織体制と対置されている。プロダクトサイドとしては、チーム外にいるSREとのコミュニケーションパスを無くすことができるし、SREの側もそのプロダクト固有のドメイン知識の中で最適化された作業ができる、というメリットがある。

国内では [開発チームとともに歩むSREチームが成し遂げたいこと | メルカリエンジニアリング](https://engineering.mercari.com/blog/entry/20210129-embedded-sre/) でメルカリが、 [Topotal CTOの@rrreeeyyyさんにSREについて聞いてみました! | CyberAgent Developers Blog](https://developers.cyberagent.co.jp/blog/archives/31404/) でCyberAgentが言及していたりと、各社取り組んでいる事例が見られる。メルカリのように、元々インフラチームであったものをSREへ改組した場合、そのままの組織体制だとSREは中央集権的になってしまう。プロダクトが増えたり、SREの業務の幅が広がる中で限界を感じ、Embedded SREに転じていく事例が多いと見ている。

## SRE booksにおける「Embed」という表現

Googleが発刊しているいわゆるSRE booksと呼ばれる『サイトリライアビリティエンジニアリング』『サイトリライアビリティワークブック』、あるいは『SREの探求』においては、SREの組織体制をどうするべきか、という話題には乏しく、「Embedded SRE」という単語も直接は登場しない。

ただ、SREを「Embed」するという表現は『Site Reliability Engineering』の「[Chapter 30 - Embedding an SRE to Recover from Operational Overload](https://sre.google/sre-book/operational-overload/)」において見られる。ここでは、SREチームの運用作業が過負荷になった際、その原因となっているチームへ一時的にSREを移籍させ、チームのプラクティス改善を行うというGoogleのケースが紹介されている。SRE booksの中では、SREチームがプロダクトチームからプロダクトを受け入れ、トイルやアラートが多すぎればプロダクトを差し戻す場合があると書かれている通り、GoogleにおけるSREチームはプロダクトとは別チームとしてとどまっているようである。

『SREの探求』では第10章において、少しだけ組織論への言及が見られる。ここで言及されているのは1つが先のGoogleの事例で、これは「Googleモデル」と呼称されている。もう一方は「Netflixモデル」とされている。

> SRE（および他の機能別の役割）をプロダクト専用チームに参加させるものです。この方法では、サービスを開始から廃止まで所有できる機能横断型チームが作られます。開発と継続的な運用はすべて、この機能横断型チーム内で実行されます。大企業の観点からすると、これは概して、従来の組織モデルからの完全な離脱とみなされます。聞いたことがある人もいるでしょうが、このパターンはNetflixモデルと呼ばれる場合があります。

これは要するに「Embedded SRE」に相当するようと考えていいだろう。

## Embedded SREという呼称を辿る

メルカリが先のエントリーの中で「Embedded SRE」の出典として引いているのがSlalom Buildによる [The Many Shapes of Site Reliability Engineering | by Rob Cummings | Slalom Build | Medium](https://medium.com/slalom-build/the-many-shapes-of-site-reliability-engineering-468359866517) というエントリーである。これが2019年1月に書かれている。

この中で書かれているEmbedded SREは、やはりプロダクトチームの中に組み込まれ、信頼性やスケーラビリティの点で専門を担うとされている。なお、EmbedというとSREを外からプロダクトチームへ埋め込む（参加させる）ような印象を受けるが、ここではプロダクトチームが専任のSREを自ら雇ってもよいとしている。

では、このエントリーが「Embedded SRE」の原典なのかと言えば、実のところこれ以前にもまだ辿っていくことができる。どうもロールとしてのEmbedded SREという呼び方は2018年以前からLinkedInが使っていたようで、 [How Bad Is Your Toil?: Measuring the Human Impact of Process | USENIX](https://www.usenix.org/conference/lisa18/presentation/andersen) や [3 Myths About the Site Reliability Engineer, Debunked](https://www.informationweek.com/devops/3-myths-about-the-site-reliability-engineer-debunked) の中で確認できる。ただし、いずれも「私はEmbedded SREとして働いています」という程度の使い方であり、Slalom Buildのエントリーのように、組織類型をまとめたような内容のものではない。

明確な組織論として書いているものの1つには、New Relicの [SRE-iously: Defining the Principles, Habits, and Practices of Site Reliability Engineering](https://www.slideshare.net/newrelic/sreiously-defining-the-principles-habits-and-practices-of-site-reliability-engineering-112178269) がある。これは2018年8月のスライドであり、Embedded SREはDomain Expertsだとされている。この絵も国内でよく引用されているのを見かける。

<a href="https://gyazo.com/c7a3e0bf4c97e9cf1b83711c3ca3727e"><img src="https://i.gyazo.com/c7a3e0bf4c97e9cf1b83711c3ca3727e.png" alt="Image from Gyazo" width="700"/></a>

そしてさらに遡ると、LyftのエンジニアであるMatt Kleinという方が2018年6月に書いた [The human scalability of “DevOps” | by Matt Klein | Medium](https://medium.com/@mattklein123/the-human-scalability-of-devops-e36c37d3db6a) がある。SREをプロダクトチームの中へ組み込む必要性を説いた上で、それをEmbedded SREと呼んでいる。明確なロールとしてEmbedded SREの在り方を説明したものとしては、僕が辿れた範囲ではこれが一番古いようだった。

> The goal of embedded SREs is to increase the reliability of their products by implementing reliability oriented features and automation, mentoring and educating the rest of the team on operational best practices, and acting as a liaison between product teams and infrastructure teams (feedback on documentation, pain points, needed features, etc.).

このエントリーは今回初めて目にしたが、DevOpsとは何か、なぜ必要なのか、それを組織をスケールさせながら実践する上で、SREをどのように実装するべきなのかと順序立てて説明しており、非常に読み応えがあった。

## Embedded SREの対置概念

多くの記事では、SREはプロダクトチームに組み込まれるか、プロダクトチームの外で集約的に組織されるかという2つの組織類型を対置的に書いている。集約型SREについてはEmbeddedほど統一された呼称がないようで、様々に呼ばれている。先のSlalom Buildのエントリーでは、中央集権的に組織され、会社全体の信頼性コンサルティングを行うようなSREは **SRE Center of Practice** と呼ばれているし、New Relicのスライドでは **Pure SRE** と呼ばれている。

SREの元祖たるGoogleが組織類型に言及したのは [SRE at Google: How to structure your SRE team | Google Cloud Blog](https://cloud.google.com/blog/products/devops-sre/how-sre-teams-are-organized-and-how-to-get-started) ぐらいだと思うが、この中ではさらに細分化した6種類の分類が書かれている。なお、これが書かれたのは先のエントリー群よりも後、2019年6月になる。僕がEmbedded SREを初めて目にしたのもここだったように思う。

### Kitchen Sink a.k.a Everything SRE

プロダクト横断的な中央集権のSREチーム。まだ担当プロダクトが少ない、SREの実装の初期段階にあたる。

### Infrastructure

Kubernetes Clusterや監視システムのような共通で使用されるインフラ整備に携わるSRE。

### Tools

開発者が信頼性を維持するのに役立つようなツール、ソフトウェアなどを構築、提供するSRE。

### Product/applicaton

重要なプロダクトの信頼性向上に取り組むSRE。Embeddedのようにプロダクト専任に近い形と思われるが、まだプロダクトの内部には入り込んでいない点が相違点と思われる。

### Consulting

プロダクトのコードを直接変更は行わず、コンサルティングやツールの提供に責任範囲をとどめる。最初のSREチームを実装する前に、パートタイムのSREをコンサルトとして配置するようなパターンが想定されているらしい。

Embedされていない場合において、その役割は多岐に渡る可能性があることがこのエントリーからは読み取れる。各プロダクトの信頼性向上に尽力する場合もあれば、サポート程度までしか行わない場合、あるいは完全にプラットフォームの整備へ注力する場合（個人的には、これはほぼインフラエンジニアではないかと思ったりするが）まで考えられる。SREチームとプラットフォームのインフラチームを別で用意できるほどに人員が豊富な事例というのはそれほどない気がしていて、僕としてはこのGoogleの6類型を使って、どのロールをどの程度担っているか、担っていくかと考えるのが一番しっくりきている。

なお、 [Embedded SREs within the SWE team or a separate SRE team entirely? - Pros and Cons](https://www.harrisonclarke.com/devops-sre-recruiting-blog/embedded-sres-within-the-swe-team-or-a-separate-sre-team-entirely) では、このGoogleの6類型をざっくりとEmbedded SRE Teamsと **Dedicated (Stand-alone) SRE Teams** という2つに分類し直して再度論じている。SREがプロダクトチームの内外どちらにいるか、という点だけで分類するなら、この呼び方がわかりやすいかもしれない。
