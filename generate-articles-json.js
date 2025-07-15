const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 🔍 Folder containing your article HTML files
const articlesDir = path.join(__dirname, 'articles');
const outputFile = path.join(__dirname, 'articles.json');

const articles = [];

// 🗂️ Scan each file in /articles
fs.readdirSync(articlesDir).forEach(file => {
  if (file.endsWith('.html')) {
    const filePath = path.join(articlesDir, file);
    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);

    // 🎯 Extract metadata (customize selectors if needed)
    const title = $('h1').first().text().trim() || path.basename(file, '.html');
    const summary = $('p').first().text().trim() || '';
    const image = $('img').first().attr('src') || 'default-thumb.jpg';
    const date = $('meta[name="date"]').attr('content') || 'Unknown';
    const tagsRaw = $('meta[name="tags"]').attr('content') || '';
    const tags = tagsRaw.split(',').map(tag => tag.trim()).filter(Boolean);

    // 🧾 Build article object
    articles.push({
      title,
      summary,
      image,
      date,
      tags,
      link: `Articles/${file}`
    });
  }
});

// 💾 Save to articles.json
fs.writeFileSync(outputFile, JSON.stringify(articles, null, 2));
console.log(`✅ Generated articles.json with ${articles.length} article(s)`);