---
title: "k8s HPA target > resource requests という設定方針"
date: "2021-03-05T09:38:32+0900"
tags: ["kubernetes"]
---

言われてみれば当たり前のような話かもしれないが、自分としては大きな気付きだったことを書いてみる。

Kubernetes Horizontal Pod Autoscler (HPA) において `type: Resource` を用いた場合、閾値の指定は resource requests に対する使用率パーセンテージとなる。例えば CPU の requests 合計が 100m で limits 合計が 200m の Pod に対し、以下の HPA metrics を設定したとする。

```yaml
metrics:
- type: Resource
  resource:
    name: cpu
    target:
      type: Utilization
      averageUtilization: 50
```

この場合、各 Pod の CPU 使用量が平均で 50m になるよう HPA がスケーリングを行う。

このときふと疑問に思うのが、ならば limits を requests より高い値に設定しても無意味では無いかということだった。 HPA により、リソース使用量が常に requests より低い値になるよう動作するのであれば、 requests より高い値である limits に肉薄した使用量となる機会は少なくなる。もちろん、スケーリングが動作するまでのバースト余地としての意味はあるかもしれないが、少々動作が直観に反する気もする。

そもそも requests というのは、 Pod の起動時に最低限必要となるリソース量を設定するものだ。あまり大きい値だと、 Pod が無駄にリソースを確保してしまうため、 Node のリソース効率が悪くなるし、コンテナの数が増えてくれば、 Pod を起動する際の空きリソースが不足する事態も招きやすくなる。従って requests は、ある程度低めの値を設定しておくのが基本であり、これに対してさらに使用率パーセンテージで閾値をかけると、その値は自ずとかなり低い値になってくる。

この点、随分悩んでいたのだが、先日なんてことはない発想の転換を [Horizontal Pod Autoscaler should use resource limit as its base for calculation · Issue #72811 · kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/issues/72811) で見かけた。

> For instance, you might set request to 100m and limit to 250m. Set HPA to 200% cpu utilisation - this way the pods will scale when CPU usage hits 200m.

HPA の閾値は 100％ を超過した値にも設定できる。従って requests の値よりも高く、 limits に対しては余裕のあるところで閾値設定をする。すると requests よりも多くの CPU を普段は使いながらも、 limits が近づいてくればスケーリングによって不足したリソースを賄うことができる。

言われてみればこれしかないという回答なのだが、ついつい長年の経験から、監視閾値は 100% 未満で設定する他考えられなくなってしまっていた。また各種ドキュメントや書籍を見ても、 100% を超過している例を見なかったのも先入観に拍車を掛けていたように思う。設定や機能についてはドキュメントでいくらでも知ることができるが、こういった実態に即したユースケースというものを、もう少し知っていきたいなと思う。

