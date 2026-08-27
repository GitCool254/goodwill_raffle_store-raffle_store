// generate-sitemap.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sampleProducts } from './src/App.jsx';
import { catalogItems } from './src/components/Catalog.jsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://goodwillstores.vercel.app';

// Must match the generateSlug function in App.jsx
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Static routes
const staticRoutes = [
  '',
  '/catalog',
  '/about',
  '/contact',
  '/address',
  '/donations',
  '/terms',
  '/privacy',
  '/tickets'
];

// Dynamic product routes – combine both arrays
const allProducts = [...sampleProducts, ...catalogItems];
const productRoutes = allProducts.map(p => `/${generateSlug(p.title)}`);

// Combine and generate XML
const allRoutes = [...staticRoutes, ...productRoutes];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `
  <url>
    <loc>${BASE_URL}${route}</loc>
  </url>`).join('')}
</urlset>`;

// Write to public folder
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log(`✅ Sitemap generated with ${allRoutes.length} URLs (${productRoutes.length} product pages)`);
