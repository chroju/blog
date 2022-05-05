export default function Year({
    year
}: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h3'.
    return year !== null ? <h3>{year}</h3> : null
}
