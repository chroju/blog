import '../styles/global.css'
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../l... Remove this comment to see the full error message
import * as gtag from '../lib/gtag'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function App({
    Component,
    pageProps
}: any) {
    const router = useRouter()
    useEffect(() => {
        const handleRouteChange = (url: any) => {
            gtag.pageview(url)
        }
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router.events])

    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    return <Component {...pageProps} />
}
