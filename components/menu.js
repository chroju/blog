import Link from 'next/link'
import Fa from '../components/fontawesome'
import utilsStyles from '../styles/utils.module.css'

export default function Menu() {
    return (
        <section className={utilsStyles.menu}>
            <Link href="https://github.com/chroju">
                <a><Fa iconName="github" /></a>
            </Link>
            <Link href="https://twitter.com/chroju">
                <a><Fa iconName="twitter" /></a>
            </Link>
            <Link href="https://speakerdeck.com/chroju">
                <a><Fa iconName="speaker-deck" /></a>
            </Link>
            <Link href="https://instagram.com/chroju">
                <a><Fa iconName="instagram" /></a>
            </Link>
        </section>
    )
}
