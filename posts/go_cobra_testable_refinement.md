---
title: "spf13/cobra を testable に使う"
date: "2021-04-16T19:34:15+0900"
tags: ["go"]
---

[spf13/cobra](https://github.com/spf13/cobra) という、 Go でコマンドラインツールを作り際によく使われるライブラリがある。 kubectl や GitHub CLI (gh) などにも使われており、かなり人気の高いライブラリなのだが、以前 [AWS Parameter Store をターミナルから操作する Parade を作った - the world as code](https://chroju.dev/blog/parade_aws_parameter_store_cli) という記事の中でも言及した通り、そのまま使うとあまり testable な状態にならない。

先日、先の記事で書いた [Parade](https://github.com/chroju/parade) というツールのリファクタリングを通じて、 cobra を testable に使う方法を模索したので、それについて書いてみる。

## example に基づいた cobra の利用

まず、何が問題なのかを明らかにするために、 [cobra v1.1.3 のドキュメント記載の example](https://pkg.go.dev/github.com/spf13/cobra@v1.1.3) を参考にコードを書いてみる。

```go
package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var (
	// Used for flags.
	userLicense string

	rootCmd = &cobra.Command{
		Use:   "cobra",
		Short: "A generator for Cobra based Applications",
		Long: `Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	}

    tryCmd = &cobra.Command{
        Use:   "try",
        Short: "Try and possibly fail at something",
        RunE: func(cmd *cobra.Command, args []string) error {
            if err := someFunc(); err != nil {
                return err
            }
            fmt.Println(args[0])
            return nil
        },
    }
)

// Execute executes the root command.
func Execute() error {
	return rootCmd.Execute()
}

func init() {
	cobra.OnInitialize(initConfig)

	rootCmd.PersistentFlags().StringP("author", "a", "YOUR NAME", "author name for copyright attribution")
	rootCmd.PersistentFlags().StringVarP(&userLicense, "license", "l", "", "name of license for the project")

	rootCmd.AddCommand(tryCmd)
}
```

cobra はサブコマンドのある CLI が念頭に置かれている。15行目の `rootCmd` がサブコマンド無しの状態のコマンドであり、ここに23行目で `&cobra.Command` として定義した `tryCmd` を、51行目で `AddCommand()` することにより、サブコマンドを追加している。サブコマンドである `tryCmd` が呼ばれた際に実行される処理は、26行目の `&cobra.Command{}.RunE` に渡された関数が担っている。

example に基づくとこのような実装になるわけだが、パッと見ただけでもいくつか改善したいポイントが出てくる。

* 26行目、 `tryCmd` の処理が無名関数であり、テストしづらい
* 30行目、関数の出力処理が `fmt.Println` で行われており、出力内容のテストがしづらい
* 13、45行目、 `rootCmd` のコマンドフラグがグローバル変数で管理されている
* 同様に、各コマンドもグローバル変数となっている

以下、順に見て行きながら改修していく。

## コマンドの実行に無名関数を使うのをやめる

26行目からの無名関数内でサブコマンドの処理を実行しているが、このままではテストなどを行う場合に扱いづらいので、これをまず改修する。処理を実行する部分は別の関数に分離して、無名関数内から呼び出す形を取ってみる。

```go
var {
    tryCmd = &cobra.Command{
        Use:   "try",
        Short: "Try and possibly fail at something",
        RunE: func(cmd *cobra.Command, args []string) error {
            if len(args) != 1 {
                return fmt.Errorf("expected 1 arg.")
            }
            return try(args[0])
        },
    }
}

func try(value string) error {
    if err := someFunc(); err != nil {
        return err
    }

    fmt.println(value)
    return nil
}
```

引数の validation などの処理は呼び出し関数である `tryCmd` のほうに寄せて、 `try()` は実処理だけを担うようにしたことで、これだけでもだいぶ見通しがよくなった。実処理に必要な引数も、 `args []string` という曖昧なものではなく、 string 型1個だということがこれで明示できる。

### 出力処理に fmt.Println() を使わない

さらに、改善ポイントの2つ目に上げた、「出力内容のテストがしづらい」という問題もこれで改善の余地が出た。 `try()` に引数を自由に設定できるようになったので、 `io.Writer` を受け取るようにすればよい。これにより、テストの際には `&bytes.Buffer{}` を生成して `try()` に渡すことで、出力をかすめ取ることができるようになる。

```go
var {
    tryCmd = &cobra.Command{
        Use:   "try",
        Short: "Try and possibly fail at something",
        RunE: func(cmd *cobra.Command, args []string) error {
            if len(args) != 1 {
                return fmt.Errorf("expected 1 arg.")
            }

            out := os.Stdout
            errOut := os.Stderr
            return try(args[0], out, errOut)
        },
    }
}

func try(value string, out, errOut io.Writer) error {
    if err := someFunc(); err != nil {
        return err
    }

    fmt.Fprintln(out, value)
    return nil
}
```

ちなみに、自分の場合はサブコマンドの引数が長くなる場合もあったので、各コマンドの引数を構造体でまとめるようにしている。ここはお好みで。

```go
type tryOption struct {
    Value  string
    Out    io.Writer
    ErrOut io.Writer
}

func try(o *tryOption) error {
    if err := someFunc(); err != nil {
        return err
    }

    fmt.Fprintln(o.Out, o.Value)
    return nil
}
```

### グローバル変数をやめる

続いてグローバル変数をやめたい。まず、 `rootCmd` と `tryCmd` については関数で生成するようにする。 `tryCmd` について書くと、以下のようになる。

```go
func newTryCmd() *cobra.Command {
    cmd := &cobra.Command{
        Use:   "try",
        Short: "Try and possibly fail at something",
        RunE: func(cmd *cobra.Command, args []string) error {
            if len(args) != 1 {
                return fmt.Errorf("expected 1 arg.")
            }

            out := os.Stdout
            errOut := os.Stderr
            return try(args[0], out, errOut)
        },
    }
    return cmd
}

func init() {
    rootCmd.AddCommand(newTryCmd())
}
```

`rootCmd` も同様に `newRootCmd()` 関数で生成する。これにより関数の中で `*cobra.Command` を操作可能になったので、最初のサンプルでは `init()` の中で `func (c *cobra.Command) PersistentFlags()` で行っていた Flag の付与や、同 `AddCommand()` によるサブコマンドの設定処理も一緒にまかなえるようになった。

```go
func newRootCmd() (*cobra.Command, error) {
    var userLicense string

	cmd := &cobra.Command{
		Use:   "cobra",
		Short: "A generator for Cobra based Applications",
		Long: `Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	}
	cmd.PersistentFlags().StringP("author", "a", "YOUR NAME", "author name for copyright attribution")
	cmd.PersistentFlags().StringVarP(&userLicense, "license", "l", "", "name of license for the project")

	cmd.AddCommand(
		newTryCmd(),
	)

	return cmd, nil
}
```

`tryCmd` のときと同様、 `rootCmd` についても出力先は io.Writer を引数で与えるようにする。`newTryCmd` にも io.Writer の引数を追加すれば、 `rootCmd` に渡した io.Writer をサブコマンドへと伝播させる形が実現できる。

さらに、 `*cobra.Command` の `func (c *Command) SetOut()` と、同 `SetErr()` にも io.Writer を渡す。これらは `*cobra.Command` 自身が出力する、 Usage やエラーメッセージの出力先になる。

```go
func newRootCmd(outWriter, errWriter io.Writer) (*cobra.Command, error) {
    var userLicense string

	cmd := &cobra.Command{
		Use:   "cobra",
		Short: "A generator for Cobra based Applications",
		Long: `Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	}
	cmd.PersistentFlags().StringP("author", "a", "YOUR NAME", "author name for copyright attribution")
	cmd.PersistentFlags().StringVarP(&userLicense, "license", "l", "", "name of license for the project")

	cmd.AddCommand(
		newTryCmd(outWriter, errWriter),
	)
	cmd.SetOut(outWriter)
	cmd.SetErr(errWriter)

	return cmd, nil
}

func Execute() error {
	o := os.Stdout
	e := os.Stderr

	rootCmd, err := NewRootCmd(o, e)
	if err != nil {
		return err
	}
	return rootCmd.Execute()
}
```

## Conclusion

以上を踏まえると、最終形は以下のような形になる。

```go
type tryOption struct {
    Value  string
    Out    io.Writer
    ErrOut io.Writer
}

func newTryCmd(out, errOut io.Writer) *cobra.Command {
    o := &tryOption{}
    cmd := &cobra.Command{
        Use:   "try",
        Short: "Try and possibly fail at something",
        RunE: func(cmd *cobra.Command, args []string) error {
            if len(args) != 1 {
                return fmt.Errorf("expected 1 arg.")
            }

            o.Out = out
            o.ErrOut = errOut
            return try(o)
        },
    }
    return cmd
}

func try(o *tryOption) error {
    if err := someFunc(); err != nil {
        return err
    }

    fmt.Fprintln(o.Out, o.Value)
    return nil
}

func newRootCmd(out, errOut io.Writer) (*cobra.Command, error) {
    var userLicense string

	cmd := &cobra.Command{
		Use:   "cobra",
		Short: "A generator for Cobra based Applications",
		Long: `Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	}
	cmd.PersistentFlags().StringP("author", "a", "YOUR NAME", "author name for copyright attribution")
	cmd.PersistentFlags().StringVarP(&userLicense, "license", "l", "", "name of license for the project")

	cmd.AddCommand(
		newTryCmd(out, errOut),
	)
	cmd.SetOut(out)
	cmd.SetErr(errOut)

	return cmd, nil
}

func Execute() error {
	o := os.Stdout
	e := os.Stderr

	rootCmd, err := NewRootCmd(o, e)
	if err != nil {
		return err
	}
	return rootCmd.Execute()
}
```

サブコマンドの生成を関数で行ったり、コマンドの出力先を io.Writer を渡すことでまかなったりするのは、いずれも [mitchellh/cli](https://github.com/mitchellh/cli) では標準の機能であり、こちらを先に使っていたことで、 cobra も改修して使おうという発想に至れた。同じ目的に使える言語ライブラリが複数存在することはままあるが、それぞれの実装を比較してみると学べることは多いのだと実感した。実際改修にあたる際は、ここで書いたように「何を改善したいのか」というポイントを1つずつ解きほぐしていくと整理しやすい。

また冒頭にも書いた通り、 cobra は多くの著名なツールで使われているので、実例が豊富なのもポイントだと思う。 GitHub CLI の実装は特にここで書いたものと似た形になっており、とても参考になっている。

[cli/status.go at 3ad41e3e651647236ed4ece290afb12dbdc924bf · cli/cli](https://github.com/cli/cli/blob/3ad41e3e651647236ed4ece290afb12dbdc924bf/pkg/cmd/issue/status/status.go)
