import Script from "next/script"
import { GA_TRACKING_ID } from "../lib/gtag"

export default function Ga() {
    return <>
        <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy="afterInteractive"
        />
        <Script
            dangerouslySetInnerHTML={{
                __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                    });
                `,
            }}
            strategy="afterInteractive"
        />
    </>
}
