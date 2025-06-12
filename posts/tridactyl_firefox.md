---
title: "Firefoxとtridactylを使い始めた"
date: "2025-06-12T12:41:43+0900"
tags: ["firefox", "vivaldi", "browser"]
---

最近、メインのブラウザをVivaldiからFirefoxへと移した。メインブラウザを替えるのは [VimperatorからVivaldi + Vimiumへ乗り換える - chroju.dev](https://chroju.dev/blog/vimperator_to_vivaldi) のとき以来で、実に8年ぶりにVivaldiから離れたことになる。Vivaldiはカスタマイズ性も高くて好きだったのだが、今年の春頃に「[ページ内検索を複数回繰り返すとフリーズする](https://forum.vivaldi.net/topic/105671/%E3%83%87%E3%82%B9%E3%82%AF%E3%83%88%E3%83%83%E3%83%97%E7%89%88-%E3%83%9A%E3%83%BC%E3%82%B8%E5%86%85%E6%A4%9C%E7%B4%A2%E3%82%92%E8%A1%8C%E3%81%86%E3%81%A8%E3%83%95%E3%83%AA%E3%83%BC%E3%82%BA%E3%81%99%E3%82%8B%E4%BA%8B%E3%81%8C%E3%81%82%E3%82%8B)」という不具合が数か月直らず、さすがに使うのが辛くなってしまった。

Firefoxは突然使い始めたわけではなく、サブブラウザとしてはずっと使っていた。 [Multi-Account Contaienrs](https://support.mozilla.org/ja/kb/containers) という、「コンテナ」という単位でセッションの分離ができる機能があり、AWSコンソールを複数のアカウントに同時ログインして使うのに便利だったのだ。他のブラウザでもマルチプロファイルを活用して似たことが可能だが、Firefoxにおけるコンテナは単一プロファイル内での分離なので、ウィンドウを分ける必要もないし、ブックマークや機能拡張などはコンテナ間で共有できるので、より扱いやすい。使い勝手としては、タブグループごとにセッションが分かれている感覚に近い。また機能面の理由以外だと、Chromium一強の状況があまり好ましくない、Mozillaを応援したいという気持ちもあった。

Firefoxがそれでも「サブブラウザ」扱いだったのは、Vivaldiに比べていくつかの機能が欠落していたからだが、最近改めて見てみると垂直タブやマルチプロファイル（ローリングリリースのため、筆者のFirefoxにはまだ実装されてはいない）など、欲しかった機能にも対応していたので、メインに足ると考えた。

僕がブラウザ自体に求める機能はそれほど多くなく、垂直タブ、マルチプロファイル、あとは次点でピクチャ・イン・ピクチャがほしい。垂直タブはややマイナーめの機能とは自覚しており、Firefoxがネイティブの機能として実装してくれるとは正直考えていなかった。ニッチな需要しかないのかと思っていたが、考えてみればVivaldiやArc、Braveのような比較的新しいブラウザのほか、最近ではEdgeも採用しているので、徐々に市民権を得ている機能なのかもしれない。タブを多量に開く場合には、視認性の面で自分にとってはほぼマストになっている。

余談だが、Firefoxの垂直タブはピン留めすると少し既視感のある外観になる。さすがにこれは意識して寄せている気がするのだが、そこを意識するんだなぁというのはちょっと面白い。

![Firefoxの垂直タブでピン留めをしている画像](../images/2025-06-12/firefox_vertical_tabs.png)


ネイティブな機能以外、つまり拡張機能としては「キーボードでブラウザを操作できる」ものを何より求めているが、Firefoxでは [tridactyl](https://github.com/tridactyl/tridactyl) を使っている。何年か前にも触ったことはあるが、そのときより数段使いやすくなった印象がある。この分野の拡張では、かつてFirefoxの [Vimperator](http://vimperator.org/) が代名詞に近い存在だったが、tridactylはかなり意識的にVimperatorの機能性を踏襲しており、使用感が似てきている。

この手の拡張は、何かの操作を行うコマンド（例えば引数に与えた数字n行分ページをスクロールする `scrollline` ）と、そのコマンドを実行するキーバインド（例えば `j` で `scrollline 5` ）で主に構成され、好きなキーで好きなコマンドを実行できるよう、カスタマイズすることが肝になる。tridactylではVimperatorと同様、ローカルファイルに設定を書いてそれを読み込めるので、dotfileとして管理ができる。

https://github.com/chroju/dotfiles/blob/main/dotfiles/HOME/.config/tridactyl/tridactylrc

組み込みのコマンドのみならず、任意のJavaScriptにもキーバインドできるので、他の拡張を入れずともtridactylだけで多くのことがまかなえたりする。URLとタイトルを任意の形式でコピーする、みたいな小さな機能実装もできるし、最近機能拡張からは使えなくなってしまった、Google翻訳によるページ全体翻訳も再現が可能だ。以下の設定をすれば `translate` コマンドで翻訳が実行されるようになる。

```js
alias translate js let googleTranslateCallback = document.createElement('script'); googleTranslateCallback.innerHTML = "function googleTranslateElementInit(){ new google.translate.TranslateElement(); }"; document.body.insertBefore(googleTranslateCallback, document.body.firstChild); let googleTranslateScript = document.createElement('script'); googleTranslateScript.charset="UTF-8"; googleTranslateScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&tl=&sl=&hl="; document.body.insertBefore(googleTranslateScript, document.body.firstChild);
```

先述のコンテナ操作にもtridactylは対応しており、 `tabopen -c CONTAINER_NAME https://example.com` という形で、任意のコンテナ上でURLを開ける。特定のコンテナでよく開くURLがあるのなら、これにaliasやキーバインドを設定しておくと便利だ。

若干変わった機能としては、 [サイドバー](https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions/user_interface/Sidebars) にURLを読み込み、通常のタブと横に並べて表示する機能がある。これを普通に使おうとすると、サイドバーの開閉を切り替える `sidebartoggle` コマンドと、サイドバーに任意のURLを読み込む `sidebaropen` コマンドが分かれていてやや不便なのだが、これもキーバインドで解決できる。

```js
bind --mode=browser <C-g> jsua browser.sidebarAction.open(); tri.excmds.sidebaropen("https://gemini.google.com/")
```

このように設定すれば `Ctrl + g` でサイドバーにGeminiが開くようになる。また、現在タブで開いているURLを、サイドバーで開き直すというコマンドも別途実装しており、2つのページを見比べながら作業したいときによく使っている。Vivaldiだと、複数タブをタイルのように並べるタブタイリングという機能があってよく使っていたが、Firefoxにおいても、2ページ併存に限定されるとは言えだいたい似たようなことができている。

![FirefoxのサイドバーでGeminiを読み込んでいる画像](../images/2025-06-12/firefox_sidebar.png)

動作も安定しているし、UIもシンプルなデザインで、使用上困ることはほとんどない。機能拡張はFirefox非対応のものもあり、Vivaldiからすべてを移してくることはできなかったが、最小限の拡張で使っていくのも悪くないと思っている。ネックとしては、稀にFirefox完全非対応で表示すらできないサービスがあることぐらいだろうか。
