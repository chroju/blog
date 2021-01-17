import Link from 'next/link'
import Fa from '../components/fontawesome'
import utilsStyles from '../styles/utils.module.css'

export default function Menu() {
    return (
        <section className={utilsStyles.menu}>
            <Link href="https://github.com/chroju">
                <a><Fa iconName="github" /><span className={utilsStyles.faText}>GitHub</span></a>
            </Link>
            <Link href="https://keybase.io/chroju">
                <a><Fa iconName="keybase" /><span className={utilsStyles.faText}>keybase</span></a>
            </Link>
            <Link href="https://speakerdeck.com/chroju">
                <a><Fa iconName="speaker-deck" /><span className={utilsStyles.faText}>Speaker Deck</span></a>
            </Link>
            <Link href="https://twitter.com/chroju">
                <a><Fa iconName="twitter" /><span className={utilsStyles.faText}>Twitter</span></a>
            </Link>
            <Link href="https://instagram.com/chroju">
                <a><Fa iconName="instagram" /><span className={utilsStyles.faText}>Instagram</span></a>
            </Link>
        </section>
    )
}
