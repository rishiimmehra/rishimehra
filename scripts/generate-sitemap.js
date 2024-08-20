const fs = require('fs');
const path = require('path');

async function generateSitemap() {
  // Ignore Next.js specific files and API routes
  const globby = await import('globby')([
    "pages/**/*{.js,.mdx,.tsx}",
    "!pages/_*.tsx",
    "!pages/api",
  ]);

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => {
    const filePath = path.join(__dirname, page);
    const route = filePath.replace(/^\.\/pages/, '').replace(/\.(js|mdx|tsx)$/, '');
    const lastmod = fs.existsSync(filePath) ? fs.statSync(filePath).mtime.toISOString() : new Date().toISOString();

    return `
      <url>
        <loc>${`http://localhost:3000}${route}`}</loc>
        <lastmod>${lastmod}</lastmod>
      </url>
    `;
  }).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, 'public/sitemap.xml'), sitemapXml);
}

// Call generateSitemap during build process (e.g., in a custom script)
module.exports = generateSitemap;
