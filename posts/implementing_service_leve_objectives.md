---
title: "『Implementing Service Level Objectives』を読んだ"
date: "2021-01-28T12:59:09+0900"
---

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://www.oreilly.com/library/view/implementing-service-level/9781492076803/" data-iframely-url="//cdn.iframe.ly/H5CaSrl"></a></div></div><script async src="//cdn.iframe.ly/embed.js" charset="utf-8"></script>

O'Reilly Media より2020年8月に発刊された、 SLO practice のみに着目した1冊を読んだ。英語版のみで、邦訳は現時点で発刊されておらず、 O'Reilly Online Learning で読んだ。

SLO は SRE を実践するにあたっての中心的なプラクティスの1つで、いわゆる SRE book こと『[サイトリライアビリティエンジニアリング](https://www.oreilly.co.jp/books/9784873117911/)』では第4章で言及されている。 SRE が「サイト信頼性」を守るにあたり、そもそもの守るべき「信頼性」とは何かを定義しなくてはならないわけで、『[サイトリライアビリティワークブック](https://www.oreilly.co.jp/books/9784873119137/)』第20章では、「SREがない場合であっても、SLOを使うことによってSREのプラクティスはできます（p.407）」とさえ書かれている。

それだけ重要な実践なのだが、実際に取り組むのはなかなか難しい。まず、適切な SLO （SLI） をどう決めれば良いのか。よくあるのは「99.9%のレスポンスが一定時間内に返っていること」といった SLO だが、サービスによっては、単にレスポンスが早いことだけがユーザーからの信頼を得る材料とも限らない。また SLO practice にはエラーバジェットの考え方がある。例えば 99.9% の SLO を掲げた場合、月間で許容されるダウンタイムは約40分であり、これを「バジェット」として、底が尽きたら新機能のリリースはストップし、信頼性向上のための施策に舵を切ろう、というのが SRE book でのやり方だ。頭では理解できるが、リリースを実際に停めてしまうのはビジネス的にかなりインパクトの大きいジャッジであり、当然ながら SRE team のみならず、開発チームどころか経営層まで巻き込んでいく必要がある。

技術面だけではなく、組織運営、組織文化といった領域にまで広く踏み込む必要があるのがこのプラクティスで、その実践にあたって本が丸一冊書けてしまうというのも頷ける。この本では技術面、組織文化面、両面から如何に SLO practice を実践していくか、統計的な知識なども交えつつ、かなり細かく記述されている。 SLO の実践は、一度導入したらハイ終わりというものでもなく、絶え間なく計測、評価、改善を繰り返していくものなので、困ったときに末永く参照できる本として、手元に置いておけそうだと感じた。

以下では、印象に残った箇所をピックアップしていく。

## 段階を踏んで実践する

ソフトウェアエンジニアにはおなじみの「小さく始める」やり方がこの本でも踏襲されている。特にエラーバジェットについては、賛同を得て推進するには「長い道のり (long road)」になると書かれている。もちろん、だからできなくても仕方ないという話ではないが、少し安心させられた。

> Thinking about your services with SLIs is the first step; thinking about how you need to be reliable for your users with SLOs is the second; calculating how you’ve performed against your target over time is the third. Actually using your error budget status to have discussions and make decisions is the fourth and final step. ( Chapter 5. How to Use Error Budgets )

まずは適切な SLI を定めて計測を始めてみること。計測して結果が出なければ、そもそも SLO を守ろうという意識自体生まれにくいのかもしれない。

## エラーバジェットは意思決定の材料

エラーバジェットが枯渇した際、すべてのリリースを停止するというのが SRE book に書かれた実践だが、本書ではその判断には慎重になるべきだとされている。

> Don’t freeze your pipeline unless you only have one product and believe it to be truly the best choice. ( Chapter 5. How to Use Error Budgets )

エラーバジェットを、機械的にリリースするか否かをゼロイチで判断するための指標として使うのではなく、重要なのは意思決定の材料として用いることである。大規模なリリースを行うときに、現状バジェットが残っているのかどうか、あまり残っていないのなら、今そのリリースを行うことが経営的にプラスなのかどうなのか、そういった思考プロセスを踏めることが価値になる。

## SLO を元にアラートする

これは『ワークブック』にも記載がある内容だけど、いわゆる CPU 使用率の閾値監視などではなく、 SLO を元にアラートは上げるべきだとされている。

> Instead of alerting on internal system states (such as CPU usage), alert on what really matters: the user experience (for example, latency, errors, correctness, and other SLO-worthy concepts). ( Chapter 8. SLO Monitoring and Alerting )

これ自体は比較的一般的な話ではあるが、具体的に SLO ベースのアラートをどう上げるかというと、エラーバジェットのバーンレートを使うのだという。つまり、急激にエラーバジェットが消費されているようなときにアラートを上げるというものであり、具体的には「1時間に2%消費」している場合にページングするという例が載っている。

考え方としては非常に理解できる一方、いくつかの困難も覚える。1つには、半死半生のような状態で、ゆるやかなバーンレートのときに即時対応を行わなくて本当に良いのか、という点。「SLOさえ守っていればOK」という価値観に自分はどうも慣れなくて、何はともあれ落ちていたらすぐ復旧するべきと考えてしまう。これは組織内での取り決めにもよるのだとは思うが。

もう1つは、ではこのバーンレートによるアラートをどう実装したらいいのか、という点。複雑な統計処理を行った上でアラートできるような監視ソフトウェア、サービスはそれほど多くないんじゃないだろうか。メジャーな監視 SaaS である Datadog には SLO の計測機能こそ存在するが、エラーバジェットの機能は有していない。このあたり、具体的なツールを交えた実践例があれば是非聞いてみたい。

## QA との関係性

Chapter 6. Getting Buy-in になかなか衝撃的な一節がある。

> I have seen the dedicated QA team eventually get disbanded and redistributed into the core engineering team.

決して QA スキル人材が不要になると言っているわけではない。 SLO practice を進めるうちに、各プロダクトチームが内在的に品質保証 = 信頼性維持のためのプロセスを回すようになるので、 QA 専任のチームというものから形態が変化していくということだ。

これは QA に限らず、 SRE も同様だと考えている。 SRE の考え方が浸透すれば、各プロダクト内で「SRE をする」ようになり、 SRE 専任チームの必要性は薄くなっていく。このあたりについても『ワークブック』などに言及があるので、やはりこの本は SRE 本2冊と並行で読むと学びが深くなると思う。

## Appendix: 英語技術書を読むことについて

今回、英語技術書を読む習慣をつけようと考えて、その第一弾で本書を読んでみた。全文通読したわけではなく、重要そうなところや気になるところを各章拾い読みした形ではあるが、とりあえず1冊全体に目を通せたので多少自信になった。英語を読む習慣をつけるだけで、アクセスできる資料は何倍にも膨れ上がるので、今後も継続的に読み、そしてもっと読書スピードを上げていきたい。
