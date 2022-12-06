import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getPostFiles() {
    return fs.readdirSync(postsDirectory);
}

export function getPostData(postIdentifier) {
    const postSlug = postIdentifier.replace(/\.md$/, ''); // removes the file extension
    const filePath = path.join(postsDirectory, `${postSlug}.md`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
        slug: postSlug,
        ...data,
        content
    };
}

export function getAllPosts() {
    const postFiles = getPostFiles();

    const allPosts = postFiles.map(postFile => {
        return getPostData(postFile);
    })

    return allPosts.sort((postA, postB) => postA.date > postB.date ? -1 : 1);
}

export function getFeaturedPosts() {
    const allPosts = getAllPosts();

    return allPosts.filter(post => post.isFeatured);
}