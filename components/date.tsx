import { parseISO, format } from 'date-fns'

export default function Date({ dateString }: { dateString: string }) {
    const date = parseISO(dateString)
    return <time className="text-gray-500 font-semibold" dateTime={dateString}> {format(date, 'yyyy-MM-dd HH:mm')} </time>
}
