import { library } from '@fortawesome/fontawesome-svg-core'
import { faGithub, faKeybase, faSpeakerDeck, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faRssSquare, faTags } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Fa({ iconPrefix = 'fab', iconName, title }) {
    library.add(faGithub, faKeybase, faSpeakerDeck, faTwitter, faInstagram, faRssSquare, faTags)
    return <FontAwesomeIcon icon={[iconPrefix, iconName]} title={title} size='xs' />
}
