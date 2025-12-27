// Markdown parser
function parseMarkdown(text) {
  if (!text) return '';
  
  // Code blocks first
  text = text.replace(/```(\w+)?\n([\s\S]*?)```/gim, (match, lang, code) => {
    const escaped = code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `__CODEBLOCK__${lang || 'text'}__${escaped}__CODEBLOCK__`;
  });
  
  const lines = text.split('\n');
  const processed = [];
  let inList = false, listType = null;
  
  const closeList = () => {
    if (inList) {
      processed.push(`</${listType}>`);
      inList = false;
      listType = null;
    }
  };
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Headers
    if (trimmed.startsWith('###')) {
      closeList();
      processed.push(`<h3 class="text-xl font-signika font-bold mt-4 mb-2">${trimmed.slice(4)}</h3>`);
      continue;
    }
    if (trimmed.startsWith('##')) {
      closeList();
      processed.push(`<h2 class="text-2xl font-signika font-bold mt-6 mb-3">${trimmed.slice(3)}</h2>`);
      continue;
    }
    if (trimmed.startsWith('#')) {
      closeList();
      processed.push(`<h1 class="text-3xl font-signika font-bold mt-8 mb-4">${trimmed.slice(2)}</h1>`);
      continue;
    }
    
    // Lists
    const ulMatch = trimmed.match(/^[\*\-\+]\s+(.+)$/);
    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        closeList();
        processed.push('<ul class="list-disc ml-6 mb-4">');
        inList = true;
        listType = 'ul';
      }
      processed.push(`<li class="mb-1">${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inList || listType !== 'ol') {
        closeList();
        processed.push('<ol class="list-decimal ml-6 mb-4">');
        inList = true;
        listType = 'ol';
      }
      processed.push(`<li class="mb-1">${olMatch[1]}</li>`);
    } else {
      closeList();
      if (trimmed.startsWith('__CODEBLOCK__')) {
        const [, lang, code] = trimmed.match(/^__CODEBLOCK__(\w+)__(.+?)__CODEBLOCK__$/) || [];
        if (lang) processed.push(`<pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${lang}">${code}</code></pre>`);
      } else {
        processed.push(`<p class="mb-4 leading-relaxed">${trimmed}</p>`);
      }
    }
  }
  closeList();
  
  // Inline formatting
  return processed.join('\n')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*([^*\n]+?)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="my-4 rounded-lg max-w-full h-auto shadow-lg" loading="lazy" />')
    .replace(/`([^`\n]+)`/gim, '<code class="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-sm">$1</code>');
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

class BlogManager {
  constructor() {
    this.posts = [];
    this.filteredPosts = [];
    this.selectedTag = null;
    this.isAuthenticated = false;
    this.allTags = new Set();
    this.contentCache = {};
  }

  async loadPosts() {
    try {
      const { posts } = await (await fetch('./blog-posts.json')).json();
      this.posts = posts;
      this.posts.forEach(post => post.tags.forEach(tag => this.allTags.add(tag)));
      this.filterPosts();
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }

  async hashPassword(password) {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async authenticate(inputPassword) {
    const correctPasswordHash = '6b7cde28861e30e4fcccc63107d16ccd0bcba8168284096f8bffd1486a45c473';
    if (await this.hashPassword(inputPassword) === correctPasswordHash) {
      this.isAuthenticated = true;
      sessionStorage.setItem('blogAuthenticated', 'true');
      return true;
    }
    return false;
  }

  checkSessionAuth() {
    if (sessionStorage.getItem('blogAuthenticated') === 'true') {
      this.isAuthenticated = true;
    }
  }

  filterPosts() {
    let filtered = this.posts.filter(post => this.isAuthenticated || !post.isPrivate);
    if (this.selectedTag) filtered = filtered.filter(post => post.tags.includes(this.selectedTag));
    this.filteredPosts = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  selectTag(tag) {
    this.selectedTag = this.selectedTag === tag ? null : tag;
    this.filterPosts();
  }

  async loadContentFile(filePath) {
    if (this.contentCache[filePath]) return this.contentCache[filePath];
    try {
      const content = await (await fetch(filePath)).text();
      return this.contentCache[filePath] = content;
    } catch (error) {
      console.error(`Error loading ${filePath}:`, error);
      return '*Error loading content.*';
    }
  }

  getPostStyles(post) {
    const defaults = {
      articleClass: 'bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8 opacity-0 animate-fade-in',
      containerClass: 'p-6 md:p-8',
      titleClass: 'text-2xl md:text-3xl font-signika font-bold',
      contentClass: 'prose dark:prose-invert max-w-none mb-4'
    };

    if (post.style) {
      return { ...defaults, ...post.style, customCSS: post.style.customCSS || '' };
    }

    const templates = {
      minimal: {
        articleClass: 'bg-transparent border-b border-gray-200 dark:border-gray-700 mb-12 pb-8 opacity-0 animate-fade-in',
        containerClass: 'p-0',
        titleClass: 'text-3xl md:text-4xl font-signika font-light mb-6',
        contentClass: 'prose dark:prose-invert max-w-3xl mb-4 text-lg leading-relaxed'
      },
      featured: {
        articleClass: 'bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl overflow-hidden mb-8 opacity-0 animate-fade-in border-2 border-gray-200 dark:border-gray-700',
        containerClass: 'p-8 md:p-12',
        titleClass: 'text-3xl md:text-4xl font-signika font-bold mb-6',
        contentClass: 'prose dark:prose-invert max-w-none mb-4 text-lg'
      },
      wide: {
        containerClass: 'p-6 md:p-12 max-w-5xl mx-auto',
        titleClass: 'text-3xl md:text-4xl font-signika font-bold mb-6',
        contentClass: 'prose dark:prose-invert max-w-none mb-4 text-lg'
      },
      narrow: {
        containerClass: 'p-6 md:p-8 max-w-2xl mx-auto',
        titleClass: 'text-2xl md:text-3xl font-signika font-bold mb-4'
      }
    };

    return post.template && templates[post.template] ? { ...defaults, ...templates[post.template] } : defaults;
  }

  update() {
    const tagsContainer = document.getElementById('tags-container');
    const postsContainer = document.getElementById('posts-container');
    if (tagsContainer) this.renderTags(tagsContainer);
    if (postsContainer) this.renderPosts(postsContainer);
  }

  renderTags(container) {
    const tags = Array.from(this.allTags).sort();
    const btnClass = (tag) => `px-4 py-2 rounded-md transition-colors font-signika ${
      this.selectedTag === tag ? 'bg-black dark:bg-white text-white dark:text-black' 
      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`;
    
    container.innerHTML = `
      <div class="flex flex-wrap gap-2 mb-8">
        <button @click="blogManager.selectTag(null); blogManager.filterPosts(); blogManager.update()" class="${btnClass(null)}">All Posts</button>
        ${tags.map(tag => `<button @click="blogManager.selectTag('${tag}'); blogManager.filterPosts(); blogManager.update()" class="${btnClass(tag)}">#${tag}</button>`).join('')}
      </div>
    `;
  }

  async renderPosts(container) {
    if (!this.filteredPosts.length) {
      container.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 mt-8">No posts found.</p>';
      return;
    }

    const tagBtn = (tag) => `<button @click="blogManager.selectTag('${tag}'); blogManager.filterPosts(); blogManager.update()" 
      class="px-3 py-1 text-xs rounded-full transition-colors ${
        this.selectedTag === tag ? 'bg-black dark:bg-white text-white dark:text-black' 
        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
      }">#${tag}</button>`;

    container.innerHTML = this.filteredPosts.map(post => {
      const styles = this.getPostStyles(post);
      const hasContentFile = post.contentFile && !post.content;
      const postId = `post-${post.id}`;
      const content = post.content ? parseMarkdown(post.content) : 
        (hasContentFile ? '<div class="text-center py-8"><p class="text-gray-500 dark:text-gray-400">Loading...</p></div>' : '');

      return `
        ${styles.customCSS ? `<style>${styles.customCSS}</style>` : ''}
        <article class="${styles.articleClass}" id="${postId}">
          <div class="${styles.containerClass}">
            <div class="flex items-center justify-between mb-4">
              <h2 class="${styles.titleClass}">${post.title}</h2>
              ${post.isPrivate ? '<span class="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">Private</span>' : ''}
            </div>
            <div class="flex flex-wrap gap-2 mb-4">${post.tags.map(tagBtn).join('')}</div>
            ${post.excerpt && hasContentFile ? `<p class="text-gray-600 dark:text-gray-400 italic mb-4">${post.excerpt}</p>` : ''}
            <div class="${styles.contentClass}" id="${postId}-content">${content}</div>
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
              Posted on <time datetime="${post.date}">${formatDate(post.date)}</time>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Load external files
    this.filteredPosts.forEach(async post => {
      if (post.contentFile && !post.content) {
        const el = document.getElementById(`post-${post.id}-content`);
        if (el) el.innerHTML = parseMarkdown(await this.loadContentFile(post.contentFile));
      }
    });
  }
}

const blogManager = new BlogManager();
window.blogManager = blogManager;

document.addEventListener('DOMContentLoaded', async () => {
  blogManager.checkSessionAuth();
  await blogManager.loadPosts();
  setTimeout(() => blogManager.update(), 100);
});
