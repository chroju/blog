const fs = require("fs");
const RSS = require("rss");
const path = require('path');
const matter = require('gray-matter');
const remark = require('remark')
const html = require('remark-html')

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
            .use(html, {sanitize: false})
            .process(matterResult.content)
        const contentHtml = processedContent.toString()

        return {
            id,
            contentHtml,
            ...matterResult,
        }
    }))

    return allPostsData.sort((a, b) => {
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
            title: post.data.title,
            guid: post.id,
            url: `${siteURL}/blog/${post.id}`,
            date: post.data.date,
            description: post.contentHtml,
            author: "chroju",
        });
    });

    const rss = feed.xml({ indent: true });
    fs.writeFileSync("./public/feed.xml", rss);
}

generate();
