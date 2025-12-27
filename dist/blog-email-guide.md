# Blog Email & Privacy Guide

## Private/Public Posts

### How It Works

1. **Public Posts** (`isPrivate: false`):
   - Visible to everyone immediately
   - No password required
   - Appear in the main blog feed

2. **Private Posts** (`isPrivate: true`):
   - Hidden from non-authenticated users
   - Require password to view
   - Password is set in `blog.js` (line 72)
   - Session is remembered (stored in browser sessionStorage)

### Setting Up Password Protection

1. Open `blog.js`
2. Find line 72: `const correctPassword = 'your-password-here';`
3. Change `'your-password-here'` to your actual password
4. Save the file

### How Authentication Works

- User enters password in the form
- Password is checked against the hardcoded value (client-side)
- If correct, `isAuthenticated` is set to `true`
- Session is stored in `sessionStorage` (cleared when browser closes)
- Private posts are filtered out if `isAuthenticated === false`

**Note**: This is basic client-side protection. For stronger security, consider:
- Server-side authentication
- JWT tokens
- OAuth integration

## Email Subscription System

### Option 1: EmailJS (Recommended - No Backend)

EmailJS is a free service that lets you send emails from JavaScript without a backend.

#### Setup Steps:

1. **Sign up at [EmailJS](https://www.emailjs.com/)**
   - Free tier: 200 emails/month

2. **Create an Email Service**
   - Go to Email Services → Add New Service
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the setup instructions

3. **Create an Email Template**
   - Go to Email Templates → Create New Template
   - Use variables like `{{subscriber_email}}` and `{{message}}`
   - Example template:
     ```
     Subject: New Blog Subscriber
     
     You have a new subscriber: {{subscriber_email}}
     {{message}}
     ```

4. **Get Your Keys**
   - Service ID: Found in Email Services
   - Template ID: Found in Email Templates
   - Public Key: Found in Account → API Keys

5. **Update blog.html**
   - Replace `YOUR_SERVICE_ID` with your service ID
   - Replace `YOUR_TEMPLATE_ID` with your template ID
   - Replace `YOUR_PUBLIC_KEY` with your public key
   - Uncomment the EmailJS init line

### Option 2: LocalStorage (Fallback)

If you don't want to use EmailJS, the system falls back to storing emails in localStorage. You can export this list manually:

```javascript
// In browser console:
JSON.parse(localStorage.getItem('blogSubscribers'))
```

### Option 3: Integrate with Other Services

You can modify the `subscribe()` function in `blog.html` to integrate with:
- **Mailchimp**: Use their API
- **ConvertKit**: Use their API
- **Substack**: Use their embed widget
- **Custom Backend**: Send to your own API endpoint

## Sending Email Digests

### Manual Method

1. Export subscriber list (from localStorage or EmailJS dashboard)
2. Use your email client or service to send digest
3. Include links to new posts

### Automated Method (Requires Backend)

Create a simple script that:
1. Checks for new posts in `blog-posts.json`
2. Gets list of subscribers
3. Formats email with post excerpts and links
4. Sends via email service API

Example structure:
```javascript
// email-digest.js (run this periodically)
const posts = require('./blog-posts.json');
const subscribers = [...]; // from EmailJS or database

const newPosts = posts.posts.filter(post => {
  const postDate = new Date(post.date);
  const lastDigest = new Date('2024-12-20'); // last digest date
  return postDate > lastDigest && !post.isPrivate;
});

// Format and send email to each subscriber
```

## Custom Styling Per Post

### Using Templates

Add a `template` field to your post JSON:

```json
{
  "id": "8",
  "title": "My Post",
  "template": "minimal",  // Options: "minimal", "featured", "wide", "narrow"
  ...
}
```

**Available Templates:**
- `minimal`: Clean, border-only design, no background
- `featured`: Gradient background, prominent styling
- `wide`: Wider content area (max-w-5xl)
- `narrow`: Narrower content area (max-w-2xl)

### Using Custom Styles

For complete control, use the `style` object:

```json
{
  "id": "9",
  "title": "My Custom Post",
  "style": {
    "articleClass": "bg-blue-100 rounded-xl shadow-lg",
    "containerClass": "p-12",
    "titleClass": "text-5xl font-bold text-blue-600",
    "contentClass": "prose max-w-4xl text-xl",
    "customCSS": "#post-9 { border: 2px solid red; }"
  },
  ...
}
```

**Style Properties:**
- `articleClass`: CSS classes for the `<article>` element
- `containerClass`: CSS classes for the inner container
- `titleClass`: CSS classes for the `<h2>` title
- `contentClass`: CSS classes for the content area
- `customCSS`: Raw CSS string (injected as `<style>` tag)

### Examples

See `blog-posts.json` for examples of:
- Template-based styling (posts 5, 6)
- Custom styling (post 7)

## Best Practices

1. **Password Security**: Change the default password immediately
2. **Email Service**: Use EmailJS or similar for production
3. **Subscriber Privacy**: Comply with GDPR/email regulations
4. **Styling**: Test custom styles in both light and dark mode
5. **Performance**: Custom CSS is injected per post, keep it minimal

