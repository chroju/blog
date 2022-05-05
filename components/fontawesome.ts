import { library, config } from '@fortawesome/fontawesome-svg-core'
import { faGithub, faKeybase, faSpeakerDeck, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faRssSquare, faTags, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Fa({
    iconPrefix = 'fab',
    iconName,
    title
}: any) {
    config.autoAddCss = false;
    library.add(faGithub, faKeybase, faSpeakerDeck, faTwitter, faInstagram, faRssSquare, faTags, faExclamationTriangle)
    // @ts-expect-error ts-migrate(2749) FIXME: 'FontAwesomeIcon' refers to a value, but is being ... Remove this comment to see the full error message
    return <FontAwesomeIcon icon={[iconPrefix, iconName]} title={title} size='xs' />
}
