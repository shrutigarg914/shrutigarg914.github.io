/**
 * Email Digest Helper
 * 
 * This script helps you create email digests of your blog posts.
 * Run this in Node.js or browser console to generate email content.
 * 
 * Usage:
 *   1. Load blog-posts.json
 *   2. Filter posts by date range
 *   3. Format as HTML/text email
 *   4. Send via your email service
 */

// Example: Generate email digest HTML
function generateEmailDigest(posts, startDate, endDate, baseUrl = 'https://yoursite.com') {
  const filteredPosts = posts.filter(post => {
    const postDate = new Date(post.date);
    return postDate >= new Date(startDate) && 
           postDate <= new Date(endDate) &&
           !post.isPrivate; // Only include public posts
  });

  if (filteredPosts.length === 0) {
    return {
      subject: 'No new posts this week',
      html: '<p>No new posts to share this week. Check back soon!</p>',
      text: 'No new posts to share this week. Check back soon!'
    };
  }

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .post { margin-bottom: 30px; padding: 20px; border-left: 4px solid #000; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .excerpt { color: #666; margin-bottom: 10px; }
        .tags { margin-bottom: 10px; }
        .tag { display: inline-block; background: #f0f0f0; padding: 4px 8px; margin-right: 5px; border-radius: 3px; font-size: 12px; }
        .read-more { color: #0066cc; text-decoration: none; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <h1>New Blog Posts</h1>
      <p>Here are the latest posts from my blog:</p>
  `;

  let text = `New Blog Posts\n\nHere are the latest posts from my blog:\n\n`;

  filteredPosts.forEach(post => {
    const postUrl = `${baseUrl}/dist/blog.html#post-${post.id}`;
    const tags = post.tags.map(t => `#${t}`).join(' ');
    
    html += `
      <div class="post">
        <div class="title">${post.title}</div>
        <div class="excerpt">${post.excerpt || ''}</div>
        <div class="tags">${post.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>
        <div>Posted: ${new Date(post.date).toLocaleDateString()}</div>
        <a href="${postUrl}" class="read-more">Read more →</a>
      </div>
    `;

    text += `${post.title}\n${post.excerpt || ''}\nTags: ${tags}\nPosted: ${new Date(post.date).toLocaleDateString()}\nRead more: ${postUrl}\n\n`;
  });

  html += `
      <div class="footer">
        <p>You're receiving this because you subscribed to blog updates.</p>
        <p><a href="${baseUrl}/dist/blog.html">View all posts</a> | <a href="#">Unsubscribe</a></p>
      </div>
    </body>
    </html>
  `;

  return {
    subject: `New Blog Posts (${filteredPosts.length} new ${filteredPosts.length === 1 ? 'post' : 'posts'})`,
    html: html,
    text: text,
    postCount: filteredPosts.length
  };
}

// Example usage:
// 1. Load your blog-posts.json
// 2. Call generateEmailDigest(posts.posts, '2024-12-01', '2024-12-20')
// 3. Use the returned HTML/text to send via your email service

// For Node.js:
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateEmailDigest };
}

// For browser console:
if (typeof window !== 'undefined') {
  window.generateEmailDigest = generateEmailDigest;
  
  // Helper to load and process
  window.createDigest = async function(startDate, endDate) {
    const response = await fetch('./blog-posts.json');
    const data = await response.json();
    return generateEmailDigest(data.posts, startDate, endDate);
  };
}

