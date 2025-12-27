# Blog System Documentation

## Overview

This blog system supports both short microblog posts and long-form content (2000+ words) with a lean, static-file approach that requires minimal maintenance.

## How It Works

### Short Posts (Under ~500 words)
Store content directly in `blog-posts.json` using the `content` field:

```json
{
  "id": "1",
  "title": "Quick Update",
  "date": "2024-12-20",
  "tags": ["update"],
  "isPrivate": false,
  "excerpt": "A quick update about my day.",
  "content": "# Quick Update\n\nThis is a short post stored directly in JSON...",
  "images": []
}
```

### Long Posts (2000+ words)
Store content in separate markdown files in the `blog-posts/` directory and reference them:

```json
{
  "id": "2",
  "title": "My Long-Form Essay",
  "date": "2024-12-20",
  "tags": ["essay", "philosophy"],
  "isPrivate": false,
  "excerpt": "A deep dive into an interesting topic...",
  "contentFile": "./blog-posts/my-long-essay.md",
  "images": []
}
```

## File Structure

```
dist/
├── blog.html
├── blog.js
├── blog-posts.json          # Index/metadata file
└── blog-posts/              # Directory for long-form posts
    ├── example-long-post.md
    └── my-essay.md
```

## Adding a New Post

### Option 1: Short Post
1. Open `blog-posts.json`
2. Add a new entry to the `posts` array
3. Include the `content` field with your markdown

### Option 2: Long Post
1. Create a new `.md` file in `blog-posts/` directory (e.g., `2024-12-20-my-post.md`)
2. Write your content in markdown
3. Add an entry to `blog-posts.json` with `contentFile` pointing to your markdown file

## Markdown Features Supported

- Headers (`#`, `##`, `###`)
- **Bold** and *italic* text
- Links `[text](url)`
- Images `![alt](path)`
- Code blocks with syntax highlighting
- Inline code
- Unordered and ordered lists
- Paragraphs

## Password Protection

- Set `isPrivate: true` in the post metadata
- Users need to enter the password to view private posts
- Password is stored in `blog.js` (line 72) - **CHANGE IT!**
- Session is remembered for convenience

## Tagging System

- Add tags in the `tags` array: `["travel", "photography"]`
- Tags are automatically extracted and shown as filters
- Click tags to filter posts
- Tags are clickable on individual posts too

## Images

### In Markdown
```markdown
![Alt text](../fotos/SGRG_filmscan/SGRG-30.jpg)
```

### In JSON (for featured images)
```json
"images": [
  {
    "src": "../fotos/SGRG_filmscan/SGRG-30.jpg",
    "alt": "Description"
  }
]
```

## Performance

- **Fast initial load**: Only metadata is loaded initially
- **Lazy loading**: Long posts are loaded on-demand
- **Caching**: Once loaded, markdown files are cached
- **Static hosting**: Works with GitHub Pages, Netlify, etc.

## Customization

### Styling
- Posts use Tailwind CSS classes
- Dark mode is automatically supported
- Fonts match your site (Signika)

### Password
Change the password in `blog.js` line 72:
```javascript
const correctPassword = 'your-secure-password-here';
```

## Tips

1. **Naming convention**: Use date-prefixed filenames for posts: `2024-12-20-title.md`
2. **Excerpts**: Always include an `excerpt` field - it's shown while content loads
3. **Dates**: Use ISO format: `YYYY-MM-DD`
4. **Tags**: Use lowercase, hyphenated tags: `"machine-learning"` not `"Machine Learning"`

## Example Long Post

See `blog-posts/example-long-post.md` for a complete example.

