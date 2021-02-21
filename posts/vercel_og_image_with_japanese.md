---
title: "vercel/og-image を日本語に対応させたい"
date: "2021-02-21T11:01:26+0900"
---

このブログを Next.js へ移した際、 [ブログを Next.js + Vercel に移行した - the world as code](https://chroju.dev/blog/blog_with_next_js_vercel) の中で、 OGP 画像の動的生成を行っていることを書いた。使っているのは Next.js の Vercel が提供している [vercel/og-image: Open Graph Image as a Service - generate cards for Twitter, Facebook, Slack, etc](https://github.com/vercel/og-image) 。画像を動的生成する API サーバとして動作させることができるのだが、元のレポジトリでは日本語対応ができていないので、 fork して使っている旨を書いていた。

> 1つ問題があって、このサービスでは日本語のフォントに対応しておらず、日本語のページタイトルだと文字化けしてしまう。 (中略) これを fork して書き換えて自前で運営しちゃえばいい。 こんな感じ で Google Font から Kosugi を import している。

しかし、その後フォントのインポートだけでは対応しきれていないことがわかった。ちゃんと日本語が表示できていることもあるのだが、できないこともあり、動作が不安定なのだ。特に Twitter Card として表示された際は表示できていないことが多かった。

<a href="https://gyazo.com/f50238a1c1689c1b56e2dd7c4467b7ba"><img src="https://i.gyazo.com/f50238a1c1689c1b56e2dd7c4467b7ba.png" alt="Image from Gyazo" width="592"/></a>

結論から言えば、結局まだ対処しきれていないのだが、取りあえずここまででやってみた対策をメモしておく。

## 前提 : vercel/og-image のメカニズム

前提として vercel/og-image の動作メカニズムを最初に書く。やっていることはシンプルで、画像の元になるものを HTML で組み上げ、それを [Puppeteer](https://pptr.dev/) （正確には、その Node library 版である [puppeteer-core](https://www.npmjs.com/package/puppeteer-core) ） を使ってスクリーンショットを撮り、画像化している。この一連の処理は AWS Lambda で動いている。

従ってこのレポジトリ自体の問題というよりは、 Lambda で Puppeteer を使った際の日本語表示に関する問題と捉えたほうがよい。 AWS Lambda の実行環境に日本語対応のフォントが含まれていないことへのノウハウは、かねてからウェブ上では散見されている。

## puppeteer の言語設定

puppeteer は初めて使うので言語設定はあまり気にしていなかった。公式の言及ではないのだが、 [javascript - How to specify browser language in Puppeteer - Stack Overflow](https://stackoverflow.com/questions/46908636/how-to-specify-browser-language-in-puppeteer) を参考にいくつか設定を追加した。

```javascript
export async function getScreenshot(html: string, type: FileType, isDev: boolean) {
    const page = await getPage(isDev);
    await page.setViewport({ width: 2048, height: 1170 });
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'ja-JP'
    });
    await page.setContent(html);
    const file = await page.screenshot({ type });
    return file;
}
```

```javascript
        options = {
            args: ['--lang=ja'],
            executablePath: exePath,
            headless: true
        };
```

また、生成する html においても、 `<html>` を `<html lang="ja">` に書き換えている。

## web font の読み込みラグ

より根本的と思われるところで、 web font の読み込みラグの問題がある。今回日本語化にあたっては、 Google Font （先のエントリー時点では Kosugi と書いていたが、現在は [Noto Sans JP](https://fonts.google.com/specimen/Noto+Sans+JP?preview.text_type=custom) を使っている）を使っている。しかし web font 、特に日本語対応のものはロードにそれなりに時間がかかるため、ロードが終わらないうちにスクリーンショットが撮られれば tofu 状態になってしまう。冒頭に書いたように「日本語が表示できたりできなかったりする」という点も、ロード時間が一定ではないことで説明がつきそうだと考えた。

これについては非常に原始的な措置だが、待たせることにした。 Vercel で動かしているので CDN でキャッシュが効くとはいえ、画像生成においてはどう考えても悪手なのだが、一旦やむを得ないものとしている。

```javascript
    await page.setContent(html);
    await page.waitFor(1000);
    const file = await page.screenshot({ type });
    return file;
```

ちなみに「そもそも web font 使わなければいいのでは？」という話はもちろんあって、これも試したのだが、「日本語が表示できたりできなかったりする」ことに変わりはなかった。同様の報告が https://github.com/vercel/og-image/issues/108#issuecomment-657078789 にも上がっている。

## Conclusion

以上の対応で9割近くは日本語表示できるようになり、課題だった Twitter でも表示を確認できた。百発百中にしたいのだが。。ついでにデザインも変更して、まぁ一旦はここで妥協かなというところには来ている。

<a href="https://gyazo.com/ac58b6df434aa116c2e471564945a35e"><img src="https://i.gyazo.com/ac58b6df434aa116c2e471564945a35e.png" alt="Image from Gyazo" width="591"/></a>

余談だが、今回調べる中で Google の Noto フォントが「No tofu」の意味であることを初めて知った。

