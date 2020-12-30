import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Fa({ iconPrefix = 'fab', iconName }) {
    library.add(fab, fas)
    return <FontAwesomeIcon icon={[iconPrefix, iconName]} size='xs' />
}
