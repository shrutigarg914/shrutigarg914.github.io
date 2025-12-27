# A Long-Form Blog Post Example

This is an example of how long-form content works. The content is stored in a separate markdown file, so you can write posts that are thousands of words without bloating your JSON file.

## How It Works

When you create a blog post, you have two options:

1. **Short posts** (under ~500 words): Keep the content directly in the JSON file using the `content` field
2. **Long posts** (2000+ words): Store the content in a separate markdown file and reference it using the `contentFile` field

## Benefits

- **Fast loading**: The blog index loads quickly because it only contains metadata
- **Scalable**: No limit on post length
- **Easy to edit**: Write in your favorite markdown editor
- **Version control friendly**: Each post is a separate file

## Writing Long Posts

Just create a new `.md` file in the `blog-posts/` directory and reference it in your JSON. The system will automatically load it when someone views the post.

## Images

You can include images in your markdown using standard markdown syntax:

![Example Image](../fotos/SGRG_filmscan/SGRG-30.jpg)

Images are automatically styled and optimized for the blog layout.

## Code Blocks

You can also include code blocks:

```javascript
function example() {
  console.log("This is a code block");
}
```

## Conclusion

This system scales beautifully for both short microblog posts and long-form essays. Write as much as you want!

