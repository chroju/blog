import Document, { Html, Head, Main, NextScript } from 'next/document'

// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../l... Remove this comment to see the full error message
import { GA_TRACKING_ID } from '../lib/gtag'

class MyDocument extends Document {
    // @ts-expect-error ts-migrate(2416) FIXME: Property 'render' in type 'MyDocument' is not assi... Remove this comment to see the full error message
    render() {
        return (
            // @ts-expect-error ts-migrate(2749) FIXME: 'Html' refers to a value, but is being used as a t... Remove this comment to see the full error message
            <Html lang="ja">
                <Head>
                    {/* Global Site Tag (gtag.js) - Google Analytics */}
                    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'script'. Did you mean 'WScript'?
                    <script
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'async'.
                        async
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'src'.
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                    />
                    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'script'. Did you mean 'WScript'?
                    <script
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'dangerouslySetInnerHTML'.
                        dangerouslySetInnerHTML={{
                            // @ts-expect-error ts-migrate(2695) FIXME: Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                    });
                `,
                        }}
                    />
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                    <meta name="application-name" content="the world as code" />
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                    <meta name="apple-mobile-web-app-title" content="the world as code" />
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'meta'.
                    <meta name="mobile-web-app-capable" content="yes" />
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'link'.
                    <link rel="manifest" href="/manifest.json" />
                </Head>
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'body'.
                <body className="line-numbers">
                    // @ts-expect-error ts-migrate(2749) FIXME: 'Main' refers to a value, but is being used as a t... Remove this comment to see the full error message
                    <Main />
                    // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
