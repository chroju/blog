---
title: "Quick7 を BLE Micro Pro で無線化した"
date: "2021-07-04T23:20:58+0900"
tags: ["keyboard"]
---

はじめに断ると、結構イレギュラーな感じになったのでオススメはしない。

ロータリーエンコーダ付きのマクロパッドというものが欲しくなり、わりと直感的にカッコいいなというのと、必要十分なキー数だなというところで遊舎工房の [Quick7](https://shop.yushakobo.jp/products/quick7) を購入した。これ自体は文字通りクイックに作れてとてもいいキットだった。慣れている人であれば1時間とかそこらで作れると思う。

さて問題はここからで、マクロパッドというものはホームポジションで固定的に使う普通のキーボードと違い、ポジションの自由度が高い。そのため使っているうちに有線が煩わしく思えてきた。幸いにして家には、使っていない [BLE Micro Pro](https://shop.yushakobo.jp/products/ble-micro-pro) があったので、では無線化しようと思い至ったのだが、そう簡単な話ではなかった。

## BLE Micro Pro との config 互換性

BLE Micro Pro (BMP) は自作キーボードでよく使われる [QMK Firmware](https://github.com/qmk/qmk_firmware) と高い互換性を持ったファームウェアを使用しているが、完全互換ではない。各種設定は QWK ではC言語で定義することになるが、 BMP ではこれを JSON 形式に変換したものを用いる。この2つが1対1には必ずしも対応していない。

Quick7 で具体的に問題となったのは、キースイッチの押下を感知する基盤のピン設定である。多くの自作キーボードでは、 `MATRIX_PINS` を用いる。これはキーボードを格子配列にみたてて、行列それぞれにピンを割り当てる方式だ。

<a href="https://gyazo.com/7e6426020e6f5e4ec1f9f3a48f76355a"><img src="https://i.gyazo.com/7e6426020e6f5e4ec1f9f3a48f76355a.jpg" alt="Image from Gyazo" width="424"/></a>

簡単に言えば上図の1〜6がピン割り当てになる。1と5のピンに通電すれば「D」が押されたと検知する、という具合だ。 QMK Firmware での設定の書き方は、 [crkbd (Corne Keyboard)](https://github.com/qmk/qmk_firmware/blob/bf7e19e9977fc23a41898c90ce973d990717cfb4/keyboards/crkbd/config.h) を例にすると以下のようになる。

```c
#define MATRIX_ROWS 8
#define MATRIX_COLS 6
#define MATRIX_ROW_PINS { D4, C6, D7, E6 }
#define MATRIX_COL_PINS { F4, F5, F6, F7, B1, B3 }
```

[BMP の場合](https://github.com/sekigon-gonnoc/BLE-Micro-Pro/blob/32358d9f3491cd8fa125908dcf0b43c4dd79c0aa/AboutDefaultFirmware/keyboards/crkbd/crkbd_rev1_master_left_config.json) は以下。

```json
"matrix":{"rows":8,"cols":6,"device_rows":4, "device_cols":6,
	"debounce":1,"is_left_hand":1,"diode_direction":0,
	"row_pins":[7, 8, 9, 10],
	"col_pins":[20, 19, 18, 17, 16, 15],
```

一方 Quick7 など、一部のマクロパッドにおいては `MATRIX_PINS` ではなく、１キーにつき1ピンを割り当てる、 `DIRECT_PINS` という設定を用いている。キー数が少ない故、マトリクスの形を取らなくとも、 Pro Micro のピンが足りるためと思われる（設計者ではないので断言ができない）。そして現状、 BMP の config.json は `DIRECT_PINS` に対応していない。

ではどうしたか、だが、擬似的に 1x9 のマトリクスとみなすことで対処した。

実は、 `MATRIX_PINS` で設定している際、行列双方のピンが通電していなければ、キーを検知しないわけではない。例えば先の図で1番のピンだけが通電したとする。このときは、A、D、Gの3キーが押されたと検知する。したがって 1x9 のマトリクスとみなし、 `DIRECT_PINS` として設定されていた9つのピンを各列に設定すれば、各キー入力の検知は可能になる。

具体的には、 Quick7 の [QMK Firmware における DIRECT_PINS](https://github.com/qmk/qmk_firmware/blob/2ae39ccf380ba3f934295501074c448e60e1c066/keyboards/yushakobo/quick7/config.h) は以下の設定であり、

```c
#define DIRECT_PINS { \
      { D2, D4, F4 }, \
      { D7, B1, B3 }, \
      { E6, B4, B2 }, \
}
```

これに対し、 BMP をこのように設定した。ピンの表記が双方で異なるためわかりづらいかもしれないが、 `DIRECT_PINS` の各行のピンを横に並べ直すような形で `col_pins` に設定している。

```json
"matrix":{"rows":1,"cols":9,"device_rows":1, "device_cols":9,
	"debounce":1,"is_left_hand":1,"diode_direction":0,
	"row_pins":[13],
	"col_pins":[10, 11, 14,  9, 16, 15, 2, 7, 20],
```

ちなみに `row_pins` に設定している13ピンは、 Quick7 では使われていないピンをダミーで設定した。

## 電池基盤格納の物理的な問題

BMP を稼働させるには、別途[電池基盤](https://shop.yushakobo.jp/products/ble-micro-pro-battery-board?_pos=1&_sid=9a957617c&_ss=r)を接続する必要がある。 Quick7 はかなりコンパクトな筐体であるため、これをどこに格納するかが問題になった。

多いパターンとしては、遊舎工房で販売されている電池基盤が BMP とほぼ同じ大きさのため、 BMP の裏側に載せるような形で格納するパターンだ。実は手元にあった BMP は、すでにこの形で電池基盤をはんだ付けしてあるものだった。しかし、 Quick7 はトッププレートとボトムプレートの間を 10mm のスペーサーで結んでおり、この隙間に電池基盤付きの BMP は収まらなかった。

<a href="https://gyazo.com/da3ca45dc0437e66dc3b079e9755e490"><img src="https://i.gyazo.com/da3ca45dc0437e66dc3b079e9755e490.jpg" alt="Image from Gyazo" width="600"/></a>

結論としてはシンプルに、 15mm のスペーサーに換装することで対応した。電池基盤を BMP と接着せず、横に並べるような形で配置すれば、もう少し薄くすることは可能かもしれない。

## Conclusion

はじめに書いたことの繰り返しだが、特にこういったやり方をおすすめする記事ではなく、技術的なメモに近い内容である。ロータリーエンコーダ付きマクロパッドでは、公式に BMP 対応している [Palette1202](https://palette1202.nilgiri-tea.net/) なども存在するので、そちらを使ったほうがスムーズかもしれない。また、 QMK Firmware や BMP に僕自身そこまで詳しいとは思っていないので、ここで書いた方法以外の何かスマートな解決策が存在する可能性もある。

とはいえ出来には満足している。普段使いは Corne Cherry で長らく落ち着いてしまったが、たまにはこうやってキーボードを作ることも続けてみたい。
