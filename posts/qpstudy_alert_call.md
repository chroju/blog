---
date: "2016-04-24T22:28:32+09:00"
description: ""
title: "#qpstudy 響け！アラートコール！行ってきた"

---

[#qpstudy 2016.04 響け！アラートコール！　本編 一般枠 on Zusaar](http://www.zusaar.com/event/12327003)

こちら参加してきました。アラートコール、というか監視運用をテーマとした勉強会。qpstudyことキューピー3分インフラクッキングについては、数少ないインフラ系の継続的勉強会ということで、気になってはいましたが初参加できました。

以前にも障害対応をテーマとした勉強会に行ったことがありますが、この界隈は闇が深い。。以前のそのイベントも今回のイベントも、いずれも参加者が互いの経験を話し合う場があったわけですが、やっぱりそういうのが一番効果あるかもなぁという気がしました。特に監視運用についてはイベント内でも触れられた通りノウハウや勘に頼っている部分も大きく、他社がどういうノウハウに頼っているのか？というのはとても気になるところ。例えばサービス運用全般のガイドラインとしてITILがあるように、客観的な基準があればいいわけなんですが。

で、監視の基準。これは確かにもう少し考え直した方がいいのかもなと思った次第。例えばメトリック監視ってよくありますけど、仮にCPUが90%使用率達したとして、それがすぐに何か異常に繋がるわけではないのですよね。だから「障害」として扱うべきは単純な閾値超過やエラーではなくて、システム的な動作不全であるはず。それと障害予兆にあたるようなワーニングメッセージは別で扱うべきであって、何が本当に必要な監視、アラートなのかというのは、どの会社でも洗い直すと結構ボロが出てきそうな気がしました。イベントではMakerelのような監視系のSaaSがフレームワークを提供してほしいという声もあったり。あとはAIによる判別。確かにメトリックやログの状態を機械学習させれば、障害予兆をAIで判断させることもできそうな気がします。

今年度に入ってからの自分の社内ミッションは、わりと自動化に重きが置かれているのですけど、イベントでは「自動化は目的ではなく手段」という話もあり。確かに自動化自体が楽しい作業なのでついついなんでも手を出すけど、何のために、またどういった効果があると考えられるから自動化するのか、あるいは自動化の手段には何を用いるのかというところはもうちょっと考えたい。「SaaSを使わない理由って何？」って話もあったけど、そういえばそうだなと。まぁ外部にメトリックやIP持たせるのが嫌、という理由で弊社の場合は通らないかもなぁという気もしますけど、SaaSの導入だって要は監視システムをDIYするプロセスを自動化しているわけで。一考には値するはず。

今回の勉強会はなにか結論をバーン！と提示してくれるものではなく、考えるきっかけを与えてくれるような形式だったので、明日以降ちゃんと社内に持って帰って再検討しようと思います。qpstudy、楽しいので次回もぜひ行きたいところ。

<script async class="speakerdeck-embed" data-id="3aaec6a7751c4245a2951a688eaa5543" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

<iframe src="//www.slideshare.net/slideshow/embed_code/key/CI5WFlfnIN2Pyf" width="425" height="355" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/zembutsu/is-it-wront-to-try-to-automate" title="Re: 運用に自動化を求めるのは間違っているだろうか" target="_blank">Re: 運用に自動化を求めるのは間違っているだろうか</a> </strong> from <strong><a href="//www.slideshare.net/zembutsu" target="_blank">Masahito Zembutsu</a></strong> </div>


