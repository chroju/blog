import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Fa({ iconName }) {
    library.add(fab)
    return <FontAwesomeIcon icon={['fab', iconName]} size='xs' />
}
