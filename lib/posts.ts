import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map((fileName: any) => {
        const id = fileName.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)

        return {
            id,
            ...matterResult.data
        }
    })

    const sortedPosts = allPostsData.sort((a: any, b: any) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })

    let previous = '0'
    return sortedPosts.map((post: any) => {
        const year = post.date.substr(0, 4)
        post.firstOfYear = year !== previous ? year : null
        previous = year
        return post
    });
}


export function getAllTags() {
    const allPostsData = getSortedPostsData()
    const allTags = allPostsData.map((postData: any) => {
        return postData.tags === undefined || postData.tags[0] === '' ? [] : postData.tags.map((tag: any) => {
            return encodeURI(tag)
        });
    }).flat()
    const tagCounts = {}
    allTags.forEach((tag: any) => {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    })
    return tagCounts
}


export function getPostsWithTag(tag: any) {
    const decodedTag = decodeURI(tag)
    const allPostsData = getSortedPostsData()
    return allPostsData.filter((post: any) => {
        return post.tags !== undefined && post.tags.includes(decodedTag)
    });
}


export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)

    return fileNames.map((fileName: any) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        };
    });
}

export async function getPostData(id: any) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    const processedContent = await remark()
        .use(html, { sanitize: false })
        .use(gfm)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
        id,
        contentHtml,
        ...matterResult.data
    }
}
