import { parseISO, format } from 'date-fns'

export default function Date({
    dateString
}: any) {
    const date = parseISO(dateString)
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'time'.
    return <time dateTime={dateString}>{format(date: any, 'yyyy-MM-dd HH:mm')}</time>;
}
