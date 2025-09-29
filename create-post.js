#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const POSTS_FILE = './posts.json';
const POSTS_DIR = './posts';

// Ensure posts directory exists
if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR);
}

// Load existing posts or create empty array
function loadPosts() {
    if (fs.existsSync(POSTS_FILE)) {
        return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
    }
    return [];
}

// Save posts to JSON file
function savePosts(posts) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// Generate URL slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Create new blog post
async function createPost() {
    console.log('\n📝 Create New Blog Post\n');

    const title = await question('Post title: ');
    const excerpt = await question('Short excerpt: ');

    console.log('\nEnter your post content (type "END" on a new line when finished):');
    let content = '';
    let line;

    while ((line = await question('')) !== 'END') {
        content += line + '\n';
    }

    const slug = generateSlug(title);
    const date = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();

    const post = {
        id: Date.now(),
        title,
        slug,
        excerpt,
        content: content.trim(),
        date,
        timestamp
    };

    // Save individual post file
    const postFile = path.join(POSTS_DIR, `${slug}.json`);
    fs.writeFileSync(postFile, JSON.stringify(post, null, 2));

    // Update posts index
    const posts = loadPosts();
    posts.unshift(post); // Add to beginning (newest first)
    savePosts(posts);

    console.log(`\n✅ Post created successfully!`);
    console.log(`📄 Title: ${title}`);
    console.log(`🔗 Slug: ${slug}`);
    console.log(`📅 Date: ${date}`);
    console.log(`📁 File: ${postFile}`);

    rl.close();
}

// Helper function to promisify readline
function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Start the post creation process
createPost().catch(console.error);