import fs from 'fs';
import RSS from 'rss';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts')
const siteURL = 'https://chroju.dev'

async function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = await Promise.all(fileNames.map(async (fileName) => {
        const id = fileName.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)
        const processedContent = await remark()
            .use(html, { sanitize: false })
            .process(matterResult.content)
        const contentHtml = processedContent.toString()

        return {
            id,
            contentHtml,
            ...matterResult,
        }
    }))

    return allPostsData.sort((a, b) => {
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        if (a.data.date < b.data.date) {
            return 1
        } else {
            return -1
        }
    })
}

async function generate() {
    const allPosts = await getSortedPostsData();
    const feed = new RSS({
        title: "the world as code",
        site_url: siteURL,
        feed_url: `${siteURL}/feed.xml`,
    });

    allPosts.map(post => {
        feed.item({
            // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
            title: post.data.title,
            // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
            guid: post.id,
            // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
            url: `${siteURL}/blog/${post.id}`,
            // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
            date: post.data.date,
            // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
            description: post.contentHtml,
            author: "chroju",
        });
    });

    const rss = feed.xml({ indent: true });
    fs.writeFileSync("./public/feed.xml", rss);
}

generate();
