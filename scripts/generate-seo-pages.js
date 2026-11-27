import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { CATEGORIES } from "../src/constants/categories.js";
import { collectionPath, productPath, SITE_ORIGIN, slugify, RETRO_COLLECTION, isRetroProduct, isJacketProduct, retroProductTitle, retroProductDescription, jacketProductDescription, collectionHeading, collectionTitle, collectionDescription, collectionCategoryLabel, productImageType } from "../src/utils/seo.js";

const root = process.cwd();
const distDir = path.join(root, "dist");
const builtIndexPath = path.join(distDir, "index.html");
const envFile = path.join(root, ".env.production");

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function excerpt(value = "", max = 155) {
  const text = String(value).replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

function setTagContent(html, tagPattern, content) {
  return html.replace(tagPattern, (tag) => {
    const escaped = escapeHtml(content);
    if (/\bcontent\s*=/.test(tag)) return tag.replace(/\bcontent\s*=\s*(["']).*?\1/i, `content="${escaped}"`);
    return tag.replace(/\s*\/?\s*>$/, ` content="${escaped}" />`);
  });
}

function makePage(baseHtml, { title, description, canonical, image, body, schema, productData }) {
  let html = baseHtml;
  html = html.replace(/<link\b(?=[^>]*\brel=["']preload["'])(?=[^>]*\bas=["']image["'])(?=[^>]*\bhref=["']\/kerala-hero-mobile\.webp["'])[^>]*\/?\s*>/i, "");
  html = html.replace(/<style id="initial-home-shell-styles">[\s\S]*?<\/style>/i, "");
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = setTagContent(html, /<meta\s+name="description"[^>]*>/i, description);
  html = setTagContent(html, /<meta\s+property="og:title"[^>]*>/i, title);
  html = setTagContent(html, /<meta\s+property="og:description"[^>]*>/i, description);
  html = setTagContent(html, /<meta\s+property="og:url"[^>]*>/i, canonical);
  html = setTagContent(html, /<meta\s+property="og:image"[^>]*>/i, image);
  html = setTagContent(html, /<meta\s+name="twitter:title"[^>]*>/i, title);
  html = setTagContent(html, /<meta\s+name="twitter:description"[^>]*>/i, description);
  html = setTagContent(html, /<meta\s+name="twitter:image"[^>]*>/i, image);
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHtml(canonical)}" />`);
  const schemaScript = `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;
  const initialProductScript = productData ? `<script id="initial-product-data" type="application/json">${JSON.stringify(productData).replace(/</g, "\\u003c")}</script>` : "";
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${body}</div>`);
  return html.replace("</head>", `${schemaScript}\n${initialProductScript}\n  </head>`);
}

async function getApiUrl() {
  if (process.env.VITE_API_URL) return process.env.VITE_API_URL.replace(/\/$/, "");
  const env = await readFile(envFile, "utf8");
  const entry = env.split(/\r?\n/).find((line) => line.startsWith("VITE_API_URL="));
  if (!entry) throw new Error("VITE_API_URL is missing; cannot build the live product sitemap.");
  return entry.slice("VITE_API_URL=".length).trim().replace(/^['"]|['"]$/g, "").replace(/\/$/, "");
}

async function getProducts(apiUrl) {
  const pageSize = 100;
  const firstResponse = await fetch(`${apiUrl}/products/?page=1&limit=${pageSize}`);
  if (!firstResponse.ok) throw new Error(`Product catalog returned HTTP ${firstResponse.status}.`);
  const firstPage = await firstResponse.json();
  if (!Array.isArray(firstPage.items) || !Number.isFinite(Number(firstPage.pages))) {
    throw new Error("Product catalog response is missing its expected items/pages fields.");
  }
  const products = [...firstPage.items];
  for (let page = 2; page <= Number(firstPage.pages); page += 1) {
    const response = await fetch(`${apiUrl}/products/?page=${page}&limit=${pageSize}`);
    if (!response.ok) throw new Error(`Product catalog page ${page} returned HTTP ${response.status}.`);
    const data = await response.json();
    if (!Array.isArray(data.items)) throw new Error(`Product catalog page ${page} has no items list.`);
    products.push(...data.items);
  }
  return products.filter((product) => product && (product.$id || product.id) && product.title?.trim());
}

const baseHtml = await readFile(builtIndexPath, "utf8");
const apiUrl = await getApiUrl();
const products = await getProducts(apiUrl);
const sitemapUrls = new Set([`${SITE_ORIGIN}/`]);
let generatedProductPages = 0;

for (const category of CATEGORIES.filter((item) => item.id)) {
  const canonical = `${SITE_ORIGIN}${collectionPath(category.id)}`;
  const categoryProducts = products.filter((product) => product.category === category.id);
  sitemapUrls.add(canonical);
  const heading = collectionHeading(category);
  const title = collectionTitle(category);
  const description = excerpt(collectionDescription(category));
  const cards = categoryProducts.map((product) => {
    const itemUrl = productPath(product);
    const productUrl = `${SITE_ORIGIN}${itemUrl}`;
    const image = product.image1 ? `<img src="${escapeHtml(product.image1)}" alt="${escapeHtml(product.title.trim())} ${productImageType(product)}" width="320" loading="lazy" />` : "";
    return `<li><a href="${escapeHtml(productUrl)}">${image}<h2>${escapeHtml(product.title.trim())}</h2><p>₹${escapeHtml(product.price)}</p></a></li>`;
  }).join("\n");
  const nav = [...CATEGORIES.filter((item) => item.id !== category.id).map((item) => `<a href="${SITE_ORIGIN}${collectionPath(item.id)}">Shop ${escapeHtml(item.label)}</a>`), `<a href="${SITE_ORIGIN}${collectionPath(RETRO_COLLECTION.id)}">Shop retro and vintage football jerseys</a>`].join(" | ");
  const intro = category.id === "jackets" ? description : `${category.description}. Shop football jerseys and fanwear online with delivery across India.`;
  const body = `<main><nav aria-label="Breadcrumb"><a href="${SITE_ORIGIN}/">Home</a> / ${escapeHtml(heading)}</nav><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(intro)}</p><ul>${cards}</ul><nav aria-label="Other collections">${nav}</nav></main>`;
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: heading, description, url: canonical, isPartOf: { "@type": "WebSite", name: "Kerala Jersey", url: `${SITE_ORIGIN}/` } };
  const file = path.join(distDir, "collections", slugify(category.id), "index.html");
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, makePage(baseHtml, { title, description, canonical, image: `${SITE_ORIGIN}/kerala-jersey-og.jpg`, body, schema }));
}

const retroProducts = products.filter(isRetroProduct);
const retroCanonical = `${SITE_ORIGIN}${collectionPath(RETRO_COLLECTION.id)}`;
const retroTitle = "Retro & Vintage Football Jerseys in India | Kerala Jersey";
const retroDescription = RETRO_COLLECTION.description;
const retroCards = retroProducts.map((product) => {
  const itemUrl = productPath(product);
  const productUrl = `${SITE_ORIGIN}${itemUrl}`;
  const image = product.image1 ? `<img src="${escapeHtml(product.image1)}" alt="${escapeHtml(product.title.trim())} retro football jersey" width="320" loading="lazy" />` : "";
  return `<li><a href="${escapeHtml(productUrl)}">${image}<h2>${escapeHtml(product.title.trim())}</h2><p>₹${escapeHtml(product.price)}</p></a></li>`;
}).join("\n");
const retroBody = `<main><nav aria-label="Breadcrumb"><a href="${SITE_ORIGIN}/">Home</a> / Retro &amp; Vintage jerseys</nav><h1>Retro &amp; Vintage Football Jerseys in India</h1><p>${escapeHtml(retroDescription)}</p><ul>${retroCards}</ul><nav aria-label="Other collections">${CATEGORIES.map((item) => `<a href="${SITE_ORIGIN}${collectionPath(item.id)}">Shop ${escapeHtml(item.label)}</a>`).join(" | ")}</nav></main>`;
const retroSchema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Retro & Vintage Football Jerseys in India", description: retroDescription, url: retroCanonical, isPartOf: { "@type": "WebSite", name: "Kerala Jersey", url: `${SITE_ORIGIN}/` }, mainEntity: { "@type": "ItemList", numberOfItems: retroProducts.length, itemListElement: retroProducts.map((product, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_ORIGIN}${productPath(product)}`, name: product.title.trim() })) } };
const retroFile = path.join(distDir, "collections", slugify(RETRO_COLLECTION.id), "index.html");
await mkdir(path.dirname(retroFile), { recursive: true });
await writeFile(retroFile, makePage(baseHtml, { title: retroTitle, description: retroDescription, canonical: retroCanonical, image: `${SITE_ORIGIN}/kerala-jersey-og.jpg`, body: retroBody, schema: retroSchema }));
sitemapUrls.add(retroCanonical);

for (const product of products) {
  const id = product.$id || product.id;
  const productSlug = slugify(product.title);
  const productUrl = productPath(product);
  const canonical = `${SITE_ORIGIN}${productUrl}`;
  const category = CATEGORIES.find((item) => item.id === product.category);
  const categoryLabel = collectionCategoryLabel(category) || String(product.category || "Football jerseys").replaceAll("-", " ");
  const categoryUrl = category ? `${SITE_ORIGIN}${collectionPath(category.id)}` : `${SITE_ORIGIN}/`;
  const retroProduct = isRetroProduct(product);
  const productDescription = retroProduct ? retroProductDescription(product) : product.description || `Shop ${product.title.trim()} at Kerala Jersey. Order online with delivery across India.`;
  const title = retroProduct ? retroProductTitle(product) : `${product.title.trim()} | Kerala Jersey`;
  const description = excerpt(isJacketProduct(product) ? jacketProductDescription(product) : productDescription);
  const images = [product.image1, product.image2, product.image3].filter(Boolean);
  const imageMarkup = images.map((url, index) => `<img src="${escapeHtml(url)}" alt="${escapeHtml(product.title.trim())} ${productImageType(product)}${index ? ` detail ${index + 1}` : ""}" width="480" fetchpriority="${index ? "low" : "high"}" loading="${index ? "lazy" : "eager"}" decoding="async" />`).join("\n");
  const productCollectionUrl = retroProduct ? `${SITE_ORIGIN}${collectionPath(RETRO_COLLECTION.id)}` : categoryUrl;
  const productCollectionName = retroProduct ? "retro and vintage football jerseys" : categoryLabel.toLowerCase();
  const body = `<main><nav aria-label="Breadcrumb"><a href="${SITE_ORIGIN}/">Home</a> / <a href="${productCollectionUrl}">${escapeHtml(productCollectionName)}</a> / ${escapeHtml(product.title.trim())}</nav><article><h1>${escapeHtml(product.title.trim())}</h1><p>${escapeHtml(product.sub_category || categoryLabel)}</p>${imageMarkup}<p><strong>₹${escapeHtml(product.price)}</strong></p><p>${escapeHtml(productDescription)}</p><p>${product.stock ? "Available to order" : "Currently out of stock"}</p><p><a href="${productCollectionUrl}">Browse more ${escapeHtml(productCollectionName)}</a></p></article></main>`;
  const schema = { "@context": "https://schema.org", "@type": "Product", name: product.title.trim(), description, image: images, sku: id, ...(category ? { category: categoryLabel } : {}), brand: { "@type": "Brand", name: "Kerala Jersey" }, offers: { "@type": "Offer", url: canonical, priceCurrency: "INR", price: String(product.price), availability: product.stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } };
  const file = path.join(distDir, "products", productSlug, encodeURIComponent(id), "index.html");
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, makePage(baseHtml, { title, description, canonical, image: images[0] || `${SITE_ORIGIN}/kerala-jersey-og.jpg`, body, schema, productData: product }));
  sitemapUrls.add(canonical);
  generatedProductPages += 1;
}

const xmlEscape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const urlEntries = [...sitemapUrls].sort().map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`).join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
await writeFile(path.join(distDir, "sitemap.xml"), sitemap);
console.log(`Generated ${generatedProductPages} product pages, ${CATEGORIES.filter((item) => item.id).length + 1} collection pages, and a ${sitemapUrls.size}-URL sitemap.`);
