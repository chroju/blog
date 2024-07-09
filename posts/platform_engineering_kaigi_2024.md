---
title: "Platform Engineering Kaigi 2024 #PEK2024 に参加した"
date: "2024-07-09T12:27:16+0000"
tags: ["platform_engineering", "event"]
---

[Platform Engineering Kaigi 2024](https://www.cnia.io/pek2024/) に行ってきた。

## イベント参加時点での筆者の状況

Platform Enginneringを朧気に把握はしているが、腑に落ちるほど理解できてはおらず、それほど積極的に導入を図っているわけではない、というような状態。以前、 [Platform EngineeringとSREと「ちいとぽ」と - chroju.dev](https://chroju.dev/blog/what_is_platform_engineering) を書いたときからあまり状況は変わっていない。ただ潮流として「来そうだな」とは感じていて、腑に落としたくて参加したと言ってもいいぐらい。

## Platform Engineeingは古くて新しい

よく言われることだけれど、Platform Engineeringはまったく斬新な概念と言うわけではなく、従来から「共通基盤」と言われるような形で、似たプラクティスは実践されてきた。今日のセッションを聞いていても、Team Topologiesを元に実践を始めたという話もあれば、何年も前から取り組んできていたことが、今考えるとPlatform Engineeringに当てはまるのではないか、と考えて発表している、という話もあった。

キラキラした最新の概念、という受け取り方をしなくて良いと考えている。だから過度に遠ざける必要もないし、過度に盲信する必要もない。 `Class Platform Engineering implements DevOps` とも言うそうだが、SREとはまた異なるベクトルでのDevOpsの変形、あるいは実装、ぐらいに捉えていいのではないか。

## Platform Engineeringも小さく始める

では何がPlatform Engineering（的）なのかという話だけど、ガートナーの定義はこうなっている。

> プラットフォーム・エンジニアリングは、インフラストラクチャ・オペレーションの自動化とセルフサービス機能により、開発者エクスペリエンスと生産性を向上させます。開発者エクスペリエンスを最適化し、プロダクト・チームによる顧客価値のデリバリを加速させることが期待できるため、大きく注目されています。

ここでは「自動化」と「セルフサービス」に言及されているけれど、これは手段なので、個人的には一度外してみて良い気がしている。力点が置かれるのは「開発者エクスペリエンスと生産性を向上」「開発者エクスペリエンスを最適化」「デリバリを加速」あたりではないか。

最近見かけた以下の定義が一番腑に落ちている。

<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/1347cb1c77e647aaa6a2f50678d6aa8b?slide=20" title="タクシーアプリ『GO』におけるプラットフォームエンジニアリングの実践" allowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 100%; height: auto; aspect-ratio: 560 / 315;" data-ratio="1.7777777777777777"></iframe>

開発者がデリバリに集中するには、個別最適の必要性が薄い非機能的な部分を標準化し、低コストで扱えるようにすればいい、というのがPlatform Engineeringと捉えている。

よってセルフサービスや、システムの実体を伴った「プラットフォーム」は必要条件ではない。Team TopologiesでもWikiが最小のパターンという話があるし、今日の中だと [マルチクラスタの認知負荷に立ち向かう！Ubieのプラットフォームエンジニアリング](https://www.cnia.io/pek2024/sessions/53c4528a-ffbf-4d83-8b92-68652f11a774/) で「Sentryやログ・ダッシュボードのリンク集を作るだけでも喜ばれる」という趣旨の話題があったのが印象的だった。Backstageのマネージドサービス「[PlaTT](https://www.ap-com.co.jp/pressrelease/post-11079)」をまさに今日リリースしたエーピーコミュニケーションズの方と話していても、「最初からBackstageではなく、まずは小さく始めるので良いと思う」という話になったりした。

## Platform EngineeringとSRE

立ち話のなかで「SREの人から見て、Platform Engineeringってどう捉えているか」と聞かれたりした。今日聞いたセッションのなかでも、セッションに対する質問のなかでも、このテーマは散見した。

<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/4b71a1232bd44e168fdd29f37da93135" title="Platform Engineering と SRE の門 " allowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 100%; height: auto; aspect-ratio: 560 / 315;" data-ratio="1.7777777777777777"></iframe>

[Platform Engineering とSREの門](https://www.cnia.io/pek2024/sessions/31f1df6b-c98a-4bef-8c6b-fd0bf839bc7e/) というこのセッションの中では、両者の目的の違いや、具体的な取り組み内容の違いなどを、様々な資料を用いて比較している。違いのみならず、共通点などを探して、組織体制をどう組むか、という点を論じた話もあった。

先の質問に自分がどう答えたかと言えば、 **開発速度** と信頼性のバランシングを行っている以上、Platform EngineeringとSREには重複した領域があるということと、特に国内ではインフラチームを改組してSREとした会社が多いため、既存のSREがPlatform Engineering的な性格を帯びている場合がよく見られるのではないか、ということだった。実際にどうかは知らないが、自分はこういった背景からPlatform Engineeringに触れることになった。

またSREは組織横断的な活動を求められることも多く、少ない人数でレバレッジを効かせる必要性に駆られる。となると、Platform Engineeringの考え方と近しく、そこから学べることは多いのではないか。


## どこまでがPlatformか

もうひとつ気になったことがある。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">やっぱり<br>共通基板（共通で使えるサービス）とプラットフォームが色々と混ざってる話が色んなところで散見される気がする<br><br>あくまで、認証とか決済のマイクロサービスであって、プラットフォームと呼ぶと違う気がしてる<a href="https://twitter.com/hashtag/pek2024?src=hash&amp;ref_src=twsrc%5Etfw">#pek2024</a></p>&mdash; 沙南（5thVaxed:MMMFD） (@sokasanan) <a href="https://twitter.com/sokasanan/status/1810573783666954358?ref_src=twsrc%5Etfw">July 9, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

このポストの内容、今日セッションを聞きながら自分も考えていたことだった。Platformとはゼロからインフラやシステムを作る上での素地としてのものを指す（実体はBackstageだったりWikiだったり）と考えていたのだが、各プロダクトが共通して使う、例えば認証認可などの内部向けアプリケーション = このポストでいう「共通基盤」をPlatformとして扱っているセッションもあった。一方で、そういったシステムを取り扱うチームをStream Alignedとして整理しているセッションもあった。

結論としてはどちらでもいいのではないかなぁ、という雑な考えに至っている。デリバリの加速、顧客へ価値を速く届けるというPlatform Engineeringの目的に照らせば、認証認可などは価値そのものではなく、これもまたPlatformとして整理して、開発者がシンプルに呼び出せるようにしよう、と考えていくのは意義がありそうだ。

一方で、いやそれはマイクロサービスの一部だろう、という整理もわかる。認証基盤を作るのにもPlatformが必要になってくるわけで、認証基盤はあくまで社内へ価値提供するプロダクトとして、Stream Aligned Teamが扱うべきだ、という考え方もできそうだ。これは各社取り組みやすい整理でいいんじゃないだろうか。

## 暗中模索を続けていく

> サイトリライアビリティエンジニアリング（Site Reliability Engineering＝SRE）の分野で私が尊敬する人々は皆、この分野自体が今もなお進化、拡張、変革、新たな発見の真っ只中にあると考えています。ある意味では私たち全員がずっと、SREを探求し続けているのです。

『[SREの探求](https://www.oreilly.co.jp/books/9784873119618/)』冒頭のこの一節がとても好きなのだが、Platform Engineeringも同じだと感じる。

僕なりの解釈なので何か間違っていてどこかから怒られるかもしれないが、いずれも方法論ではなく、目的と考え方のセットであり、Howについてはある程度の自由度がある。ただ、Platform Engineeringの目的に同意する、その必要性を感じる人はどうやら多くいそうであり、僕もその一人であり、現在は各社なりの実践が無数に生まれている状況になりつつあり、それを一手に集めて話し合うような、こういったカンファレンスは非常に有意義だと感じた。 [昨年のガートナーによるハイプ・サイクル](https://www.gartner.co.jp/ja/newsroom/press-releases/pr-20231204) だとすでにピークに達しつつあるが、となると国内だとまだ黎明期を脱したぐらいではないだろうか。これからもしばらく暗中模索が続きそうだし、是非また参加したい。

運営もとてもスムーズで楽しく過ごせました。カヌレとコーヒー、というおやつのチョイス、ゴミもあまり出ないしおなかにもわりと溜まってくれるし物珍しいしおいしいしで、とてもよかったです。

[![お台場カヌレとコーヒー](https://i.gyazo.com/1d261d5ff3466e75f64e8dee43b7443e.jpg)](https://gyazo.com/1d261d5ff3466e75f64e8dee43b7443e)
