# Blog Quick Start Guide

## 🎨 Custom Styling Per Post

### Quick Templates
Add `"template": "template-name"` to any post:

```json
{
  "template": "minimal"    // Clean, border-only
  "template": "featured"   // Gradient, prominent
  "template": "wide"       // Wider content area
  "template": "narrow"     // Narrower content area
}
```

### Full Custom Styling
Add a `style` object for complete control:

```json
{
  "style": {
    "articleClass": "bg-blue-100 rounded-xl",
    "containerClass": "p-12",
    "titleClass": "text-5xl font-bold",
    "contentClass": "prose text-xl",
    "customCSS": "#post-1 { border: 2px solid red; }"
  }
}
```

**See `blog-posts.json` posts 5, 6, 7 for examples!**

## 🔒 Private/Public Posts

### How It Works
- **Public** (`isPrivate: false`): Everyone can see it
- **Private** (`isPrivate: true`): Requires password

### Setup Password
1. Open `blog.js`
2. Line 72: Change `'your-password-here'` to your password
3. Save

### How Authentication Works
- User enters password → checked client-side
- If correct → `isAuthenticated = true`
- Private posts filtered out if not authenticated
- Session remembered (cleared on browser close)

**Note**: This is basic protection. For production, use server-side auth.

## 📧 Email Subscription

### Setup EmailJS (Recommended)
1. Sign up at [emailjs.com](https://www.emailjs.com) (free tier: 200 emails/month)
2. Create email service (Gmail, Outlook, etc.)
3. Create email template
4. Get your Service ID, Template ID, and Public Key
5. Update `blog.html`:
   - Replace `YOUR_SERVICE_ID`
   - Replace `YOUR_TEMPLATE_ID`
   - Replace `YOUR_PUBLIC_KEY`
   - Uncomment EmailJS init line

### Fallback (No Setup)
If EmailJS isn't configured, emails are stored in localStorage. Export them:
```javascript
// In browser console:
blogManager.exportSubscribers()
```

### Sending Email Digests
Use `email-digest-helper.js`:
```javascript
// In browser console:
const digest = await createDigest('2024-12-01', '2024-12-20');
console.log(digest.html); // Use this to send emails
```

Or integrate with:
- Mailchimp API
- ConvertKit API
- Substack embed
- Your own backend

## 📝 Adding a New Post

### Short Post (< 500 words)
```json
{
  "id": "8",
  "title": "My Post",
  "date": "2024-12-20",
  "tags": ["tag1", "tag2"],
  "isPrivate": false,
  "excerpt": "Brief description",
  "content": "# My Post\n\nContent here...",
  "template": "minimal"  // Optional
}
```

### Long Post (2000+ words)
1. Create `blog-posts/2024-12-20-my-post.md`
2. Write your content in markdown
3. Add to JSON:
```json
{
  "id": "9",
  "title": "My Long Post",
  "date": "2024-12-20",
  "tags": ["essay"],
  "isPrivate": false,
  "excerpt": "Description",
  "contentFile": "./blog-posts/2024-12-20-my-post.md",
  "template": "wide"  // Optional
}
```

## 🎯 Quick Tips

1. **Change the password** in `blog.js` immediately
2. **Test custom styles** in both light and dark mode
3. **Use templates** for quick styling, `style` object for full control
4. **Set up EmailJS** for email functionality
5. **Export subscribers** regularly for backup

## 📚 Full Documentation

- `BLOG_README.md` - Complete blog system docs
- `blog-email-guide.md` - Email & privacy detailed guide
- `email-digest-helper.js` - Email digest generation

