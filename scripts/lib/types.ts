export interface PostMeta {
  id: string
  title: string
  date: string
  tags: string[]
  draft: boolean
  firstOfYear: string | null
}

export interface Post extends PostMeta {
  contentHtml: string
}
