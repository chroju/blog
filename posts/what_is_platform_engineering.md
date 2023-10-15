---
title: "Platform EngineeringとSREと「ちいとぽ」と"
date: "2023-10-15T19:28:50+0900"
tags: ["organization", "sre", "platform-engineering"]
---

https://ascii.jp/elem/000/004/157/4157089/

先日こんな記事を読んだ。僕もPlatform Engineeringについては多少なり追ってはいるが、正直よくわかっていないというか、いまいち捉えどころがないと感じている。このエントリーは現時点における自分のPlatform Engineeringに対する認識の覚書であり、間違っている部分も多々あるかとは思う。

## 原義

Platform Engineeringについて調べていると、Gartnerの「[先進テクノロジのハイプ・サイクル : 2022年](https://www.gartner.co.jp/ja/newsroom/press-releases/pr-20220816)」での登場が発端であるとする記事が多く見られる。そのGartnerにおける [プラットフォーム・エンジニアリングとは何か？ | ガートナー](https://www.gartner.co.jp/ja/articles/what-is-platform-engineering) という記事から引いてみる。

> プラットフォーム・エンジニアリングは、インフラストラクチャ・オペレーションの自動化とセルフサービス機能により、開発者エクスペリエンスと生産性を向上させます。開発者エクスペリエンスを最適化し、プロダクト・チームによる顧客価値のデリバリを加速させることが期待できるため、大きく注目されています。

ソフトウェアデリバリにおいて必要なインフラの構築を単に自動化するのではなく、開発者がセルフサービスで扱えるようにするというのがポイントだと捉えている。ここでは「インフラストラクチャ・オペレーション」と書かれているので、構築部分だけではなく、その後運用フェーズに入ってからのチューニングなども同様にセルフサービスとするのだろう。

ところで、僕が最初にPlatform Engineeringという単語を見かけたのは、Honeycombによる [The Future of Ops Is Platform Engineering | Honeycomb](https://www.honeycomb.io/blog/future-ops-platform-engineering) という記事だった。先の2022年ハイプ・サイクルが発表された1か月後に書かれた記事だが、もともとHoneycomb内で実践していたプラクティスをPlatform Engineeringと名付けた、としており、Gartnerの発表との前後関係はわからない。

定義に大差はなく、「これは、サードパーティ プラットフォーム プロバイダーの運用スタックの評価と組み立てに特化しており、ソフトウェア エンジニアがセルフサービスでサービスを提供し、運用環境で独自のコードを所有できるようにします（Google翻訳）」「operations engineering minus the infrastructure」と書かれている。ただ、こちらのほうが、なぜこういったプラクティスが必要なのか丁寧に書かれており、納得感はある。曰く、開発者がコアとなる機能開発に集中できるようにするため、Platform Engineeringは、開発者がコードを実行するのに必要な作業をセルフサービスかつ、認知負荷の低い形で提供する。

## IDPの必要性

昨今のインフラ、特にKubernetesを巡るエコシステムが相応に複雑化しているのは確かであり、これを開発者が直接的に取り扱うのではなく、ある程度抽象化して提供する、というのは理解できる。「operations engineering minus the infrastructure」はこれをよく表していると思う。

Platform Engineeringを追っているとよく言及されるのが、このプラクティスの実現にIDP（Internal Developer Platform）が必要である、ということだ。ツールとしては[Crossplane](https://www.crossplane.io/)や[Backstage](https://backstage.io/)が挙げられることが多く、統一的なインターフェースであらゆるインフラを払い出せるようなものが想定されている。最近Terraform Cloudでも、moduleの変数をGUIから入力して展開する[no-code provisioning](https://www.hashicorp.com/blog/terraform-cloud-no-code-provisioning-is-now-ga-with-new-features)がGAになったが、文脈としては同じものだろう。

確かに「開発者へ認知負荷低くコード実行環境のプロビジョニングを提供する」となると、こういったツールに収束していくのは理解できる。気になるのは、先のGartnerの記事において「プラットフォーム構築の初期段階は、最も成熟度の高い社内開発者ポータル (IDP) から開始することがほとんどです」と書かれているように、半ばIDPの利用がPlatform Engineeringの実践上不可欠であるかのような印象を受けることだ。この手のプラクティスが、あるツールの利用を必要条件とするのは、あまり好ましくないように思うし、例えばマイクロサービスでバンバン環境を立ち上げるような組織でもなければ、IDPを維持管理するメリットは大きくないように思える。IDPを使わず、ドキュメンテーションやその他のツール群によるアプローチもあり得るのではないかと思うが、IDPを使わなければPlatform Engineeringを名乗るべきではないのだろうか。このあたりが掴めない。

## SREとの関係性

SREとPlatform Engineeringは基本的には無関係というか、後者が前者の発展系や一類型といった類のものではないと認識している。SREは信頼性が第一に置かれ、どちらかといえばシステムの運用に比重が置かれる一方、Platform Engineeringはシステムの構築段階における工数やコストの削減に対する関心が大きい。基本的な目的はそれぞれ異なる。

ただ国内においては、事実上SREチームが横断的なインフラストラクチャチームを兼ねている場合も少なくない。以前書いた[Embedded SREとは何か - SREの組織類型についての覚書](https://chroju.dev/blog/types_of_sre_teams)という記事で紹介した、Googleによる「SREチームの組織類型」の中にも、監視システムを含め共通的なインフラ整備を行う、Infrastructure SREという類型が存在する。

そういった役割を内包したSREチームが、インフラ構築における負荷を軽減するために、Platform Engineeringを取り込んでいく、あるいはその役割を分離していくという考え方はあり得るように思う。言ってしまえば、Platform EngineeringはEliminate toilの一環ではあり、SREと目的が交差する部分も大いに存在する。Platform Engineeringには、その構築した環境がReliableであるべきだ、という話が出てくるわけではないが、当然ながらそれは求められるわけだし、むしろ標準化を進めるのであればReliabilityやSecurityを組み込んだPlatformであることは自ずと必要になる。SREとPlatform Engineeringは同じロールではないが、協力関係にはあると見ている。

個人的には `class DevOps implements SRE` という言葉にあんまりしっくり来ていなかった（結果的にSREの活動はDevOpsの実装に近くはなるが、DevOpsという言葉が目指していた方向性と、SREの方向性は微妙に違う気がしている）のだが、 `implements Platform Engineering` であればしっくり来る感がある。

## Team Topologiesとの関係性

"Platform" と言われると、[Team Topologies](https://teamtopologies.com/)に登場する "Platform Team" をつい思い浮かべてしまう。Team Topologoies（＝ちいとぽ）は2年前に[日本語版](https://www.amazon.co.jp/dp/4820729632)も出版されて話題になった、システム開発に有用な組織設計を解説した本だ。そのなかに登場する4つのチームタイプの1つが「プラットフォームチーム」であり、その役割は「横断的に内部サービスを提供し、ストリームアラインドチームが下位のレイヤーを意識する必要性を下げる」と定義される。ちなみにストリームアラインドチームとは、「他チームへ引き継ぎを行わずとも機能をリリースできる職能横断的なチーム」であり、要するところプロダクトの開発チームにあたる（のが望ましいとされる）。

Gartnerの記事にはTeam Topologiesへの言及はなく、Platform EngineeringがPlatform Teamの考え方にインスパイアされたものなのかはわからない。Team Topologiesにおける「プラットフォーム」の定義は、Evan Bottcherによる [What I Talk About When I Talk About Platforms](https://martinfowler.com/articles/talk-about-platforms.html) に沿っていると書かれている。この記事ではセルフサービスでのプロビジョニングに言及されており、書かれている内容はほぼPlatform Engineeringだ。どちらかと言えば、先にPlatform Engineering的な考え方が存在しており、そこからTeam Topologiesがインスパイアされているように見える。

自分の場合はTeam Topologiesを先に読んでいて、SREの役割の一部がプラットフォームチームに転嫁可能だと考えていた。ただ、そこで実体としてのプラットフォームを伴うかは別だと思っていた。Team Topologiesにも「いちばんシンプルなプラットフォームは、下位のコンポーネントやサービスについて書いた単なるWikiページ上のリストだ」とある。一方でPlatform Engineeringには先述のようにIDPが必須かのような印象があり、こちらの指すプラットフォームは実体を伴う気がしている。そういった区分け方で正しいのかはまだわかっていない。

## 感想

自分の「しっくりこなさ」は、結局のところ何をしていればPlatform Engineeringと呼びうるのかがわからないという点にある。実体としてのIDPがあればよいのか。IDPがなくとも、Terraform Moduleなど何らかのツールやWikiによって、開発者のセルフサービスが実現してさえいればよいのか。最悪の話として、ウェブフォームに必要事項を埋めてPOSTすれば、その裏で誰かが人力で頑張っていたとしてもすぐに環境が払い出されたらそれでもプラットフォームと考えていいのか。そのあたりがわからないので、今のところ自分ではPlatform Engineeringという語を使うことは控えることにしている。

目的や考え方に関しては賛同するというか、中央集権的にインフラ管理を行っていれば自ずとここには行き着くだろう。開発者がすべての作業をセルフサービスできる、ストリームアラインドな在り方に近づくことは工数面でも認知負荷の面でも明らかな理想だ。その実現方法についてはIDPを使おうがなんだっていいじゃないか、と自分としては思う。インフラの新規プロビジョニングが年間に数えるほどしかないような組織で、IDPを抱えても仕方ないような気がしている。

いろいろと書いてきたが、繰り返しにはなるが考え方としては賛同するのだ。だからエッセンスとしては吸収していきたい。あるいはここで書いた考えに致命的な間違いがあって、本当のPlatform Engineeringはこうなんですよ！という話があって、それならば最高だ！という展開があるなら、それもまた望ましいと思っている。新しい考え方やプラクティスが生まれたときは、そういった議論があってこそだと思うので。
