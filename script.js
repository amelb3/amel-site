// Profile configuration
const PROFILE_CONFIG = {
    name: 'Amel Bajramovic',
    jobTitle: 'Software Engineer at Browserbase 🅱️ - Agent and Identity',
    profilePic: 'profile.png',
    contact: 'mailto:akamaibypass@gmail.com' 
};

// Initialize the blog
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
    loadPosts();
});

// Load profile information
function loadProfile() {
    document.getElementById('name').textContent = PROFILE_CONFIG.name;
    document.getElementById('jobTitle').textContent = PROFILE_CONFIG.jobTitle;
    document.getElementById('profilePic').src = PROFILE_CONFIG.profilePic;
}

// Load and display blog posts
async function loadPosts() {
    try {
        const response = await fetch('posts.json');
        const posts = await response.json();

        const postsContainer = document.getElementById('postsContainer');

        if (posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="no-posts">
                    <p>No posts yet. Create your first post using the Node.js script!</p>
                    <p><code>node create-post.js</code></p>
                </div>
            `;
            return;
        }

        postsContainer.innerHTML = posts.map(post => `
            <article class="post-card">
                <h3 class="post-title">${escapeHtml(post.title)}</h3>
                <div class="post-date">${formatDate(post.date)}</div>
                <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
                <a href="post.html?slug=${post.slug}" class="post-link">Read more →</a>
            </article>
        `).join('');

    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('postsContainer').innerHTML = `
            <div class="error-message">
                <p>Error loading posts. Make sure posts.json exists.</p>
            </div>
        `;
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Contact button handler
function openContact() {
    window.location.href = PROFILE_CONFIG.contact;
}