export const SITE_ORIGIN = "https://keralajersey.in";

export const slugify = (value = "") =>
  String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "item";

export const productPath = (product) => {
  const id = product?.$id || product?.id;
  return id ? `/products/${slugify(product.title)}/${encodeURIComponent(id)}` : "/";
};

export const collectionPath = (category) => `/collections/${slugify(category)}`;

export const setPageMetadata = ({ title, description, path, image, jsonLd }) => {
  document.title = title;
  let descriptionTag = document.head.querySelector('meta[name="description"]');
  if (!descriptionTag) {
    descriptionTag = document.createElement("meta");
    descriptionTag.name = "description";
    document.head.appendChild(descriptionTag);
  }
  descriptionTag.content = description;
  const canonical = document.head.querySelector('link[rel="canonical"]');
  canonical?.setAttribute("href", `${SITE_ORIGIN}${path}`);
  for (const [selector, content] of [
    ['meta[property="og:title"]', title],
    ['meta[property="og:description"]', description],
    ['meta[property="og:url"]', `${SITE_ORIGIN}${path}`],
    ['meta[property="og:image"]', image],
    ['meta[name="twitter:title"]', title],
    ['meta[name="twitter:description"]', description],
    ['meta[name="twitter:image"]', image],
  ]) {
    document.head.querySelector(selector)?.setAttribute("content", content);
  }
  let schema = document.head.querySelector('script[data-page-schema="true"]');
  if (!schema) {
    schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.pageSchema = "true";
    document.head.appendChild(schema);
  }
  schema.textContent = JSON.stringify(jsonLd);
};
