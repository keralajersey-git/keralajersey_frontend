export const SITE_ORIGIN = "https://keralajersey.in";

export const RETRO_COLLECTION_ID = "retro-vintage-football-jerseys";
export const RETRO_SUBCATEGORY = "authentic retro";
export const RETRO_COLLECTION = {
  id: RETRO_COLLECTION_ID,
  label: "Retro & Vintage",
  description: "Shop retro and vintage-style football jerseys in India. Browse classic team and season designs, check prices and availability at Kerala Jersey.",
};
export const isJacketProduct = (product) =>
  String(product?.category || "").toLowerCase() === "jackets";
export const collectionHeading = (category) =>
  category?.id === "jackets" ? "Football Jackets & Windbreakers" : `${category.label} Football Jerseys`;
export const collectionTitle = (category) =>
  category?.id === "jackets" ? "Football Jackets & Windbreakers in India | Kerala Jersey" : `${category.label} Football Jerseys | Kerala Jersey`;
export const collectionDescription = (category) =>
  category?.id === "jackets"
    ? "Shop football jackets and windbreakers in India at Kerala Jersey. Browse available team styles, check current prices and stock."
    : `${category.description}. Browse ${category.label.toLowerCase()} football jerseys and fanwear at Kerala Jersey, with delivery across India.`;
export const collectionCategoryLabel = (category) =>
  category?.id === "jackets" ? "Football Jackets & Windbreakers" : category?.label;
export const productImageType = (product) =>
  isJacketProduct(product) ? "football jacket" : "football jersey";
export const imgpileVariantUrl = (imageUrl, size) => {
  if (!["xs", "sm", "md", "lg", "xl"].includes(size)) return null;
  try {
    const url = new URL(imageUrl);
    const match = url.pathname.match(/^\/f\/([^/]+)\.(jpe?g|png|webp)$/i);
    if (url.protocol !== "https:" || url.hostname !== "cdn.imgpile.com" || url.username || url.password || !match || /_(?:xs|sm|md|lg|xl)$/i.test(match[1])) return null;
    url.pathname = `/f/${match[1]}_${size}.${match[2]}`;
    return url.href;
  } catch {
    return null;
  }
};
export const jacketProductDescription = (product) =>
  `Shop ${String(product?.title || "Football jacket").trim().replace(/\s+/g, " ")} at Kerala Jersey. Check the listed price of ₹${product?.price} and current stock. Browse football jackets and windbreakers in India.`;
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

export const isRetroProduct = (product) =>
  String(product?.category || "").toLowerCase() === "top-quality" &&
  String(product?.sub_category || "").trim().toLowerCase() === RETRO_SUBCATEGORY;

const toTitleCase = (value = "") =>
  String(value)
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/(^|[\s/-])([a-z])/g, (_, separator, letter) => `${separator}${letter.toUpperCase()}`)
    .replace(/Worldcup/gi, "World Cup");

export const retroProductTitle = (product) => {
  const rawTitle = String(product?.title || "Football Jersey").trim().replace(/\s+/g, " ");
  const season = rawTitle.match(/\b(?:(?:19|20)\d{2}(?:\/(?:\d{2}|\d{4}))?|\d{2}\/\d{2,4})\b/);
  const team = season ? rawTitle.slice(0, season.index).replace(/\b(home|away|third|kit|retro|authentic|quality|top)\b/gi, " ").replace(/\s+/g, " ").trim() : "";
  const cleanName = toTitleCase([team, season?.[0], "Retro Jersey"].filter(Boolean).join(" "));
  return `${cleanName || toTitleCase(rawTitle)} | Kerala Jersey`;
};

export const retroProductDescription = (product) => {
  const productName = String(product?.title || "Retro football jersey").replace(/\b(top|authentic|quality)\b/gi, " ").replace(/\s+/g, " ").trim();
  const title = toTitleCase(productName);
  const season = String(product?.title || "").match(/\b(?:(?:19|20)\d{2}(?:\/(?:\d{2}|\d{4}))?|\d{2}\/\d{2,4})\b/);
  const era = season ? `The product title references ${season[0]}.` : "See the product title for its team and design details.";
  const sizes = Array.isArray(product?.available_sizes) && product.available_sizes.length
    ? ` Listed sizes: ${product.available_sizes.join(", ")}.`
    : " Check the product page for current size details.";
  const stock = product?.stock ? "Currently listed as in stock." : "Currently listed as out of stock.";
  return `Shop the ${title} from Kerala Jersey's retro football jersey collection. ${era} Listed at ₹${product?.price}.${sizes} ${stock} Browse retro and vintage-style football jerseys online in India.`;
};

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
