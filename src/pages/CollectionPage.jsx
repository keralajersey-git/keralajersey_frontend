import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CATEGORIES } from "../constants/categories";
import { collectionPath, productPath, setPageMetadata, SITE_ORIGIN, slugify } from "../utils/seo";

const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export default function CollectionPage() {
  const { categorySlug } = useParams();
  const category = CATEGORIES.find((item) => slugify(item.id) === categorySlug);
  const [products, setProducts] = useState([]);
  const [loadedCategoryId, setLoadedCategoryId] = useState(null);
  const [failedCategoryId, setFailedCategoryId] = useState(null);

  useEffect(() => {
    if (!category) return;
    let active = true;
    const loadCollection = async () => {
      const params = new URLSearchParams({ page: "1", limit: "100", category: category.id });
      const firstResponse = await fetch(`${API_URL}/products/?${params}`);
      if (!firstResponse.ok) throw new Error("Unable to load collection");
      const firstPage = await firstResponse.json();
      const items = Array.isArray(firstPage.items) ? [...firstPage.items] : [];
      for (let page = 2; page <= Number(firstPage.pages || 1); page += 1) {
        params.set("page", String(page));
        const response = await fetch(`${API_URL}/products/?${params}`);
        if (!response.ok) throw new Error("Unable to load collection page");
        const data = await response.json();
        if (Array.isArray(data.items)) items.push(...data.items);
      }
      if (active) {
        setProducts(items);
        setLoadedCategoryId(category.id);
        setFailedCategoryId(null);
      }
    };
    loadCollection()
      .catch(() => active && setFailedCategoryId(category.id));
    return () => { active = false; };
  }, [category]);

  useEffect(() => {
    if (!category) return;
    const path = collectionPath(category.id);
    const description = `${category.description}. Browse ${category.label.toLowerCase()} football jerseys and fanwear at Kerala Jersey, with delivery across India.`;
    setPageMetadata({
      title: `${category.label} Football Jerseys | Kerala Jersey`,
      description,
      path,
      image: `${SITE_ORIGIN}/kerala-jersey-og.jpg`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${category.label} Football Jerseys`,
        description,
        url: `${SITE_ORIGIN}${path}`,
        isPartOf: { "@type": "WebSite", name: "Kerala Jersey", url: `${SITE_ORIGIN}/` },
      },
    });
  }, [category]);

  if (!category) return <main className="min-h-screen p-8"><h1 className="text-3xl font-bold">Collection not found</h1><Link className="mt-5 inline-block underline" to="/">Browse all products</Link></main>;
  const loading = loadedCategoryId !== category.id && failedCategoryId !== category.id;
  const failed = failedCategoryId === category.id;
  const visibleProducts = loadedCategoryId === category.id ? products : [];

  return (
    <main className="min-h-screen bg-[#faf7f2] px-5 py-8 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-8 text-sm" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true"> / </span><span>{category.label}</span></nav>
        <header className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-black md:text-5xl">{category.label} Football Jerseys</h1>
          <p className="mt-4 text-lg text-gray-700">{category.description}. Shop football jerseys and fanwear online with delivery across India.</p>
        </header>
        {loading && <p>Loading collection…</p>}
        {failed && <p>We couldn’t load this collection right now. Please try again shortly.</p>}
        {!loading && !failed && visibleProducts.length === 0 && <p>No products are currently listed in this collection.</p>}
        <ul className="grid list-none grid-cols-2 gap-5 p-0 sm:grid-cols-3 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <li key={product.$id || product.id} className="overflow-hidden rounded-lg border border-[#e5e1da] bg-white shadow-sm">
              <Link className="block h-full" to={productPath(product)}>
                {product.image1 && <img className="aspect-square w-full object-cover" src={product.image1} alt={`${product.title} football jersey`} loading="lazy" />}
                <div className="p-4"><h2 className="font-bold">{product.title?.trim()}</h2><p className="mt-2 font-semibold">₹{product.price}</p></div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-5 border-t border-gray-300 pt-6">{CATEGORIES.filter((item) => item.id !== category.id).map((item) => <Link className="underline" key={item.id} to={collectionPath(item.id)}>Shop {item.label}</Link>)}</div>
      </div>
    </main>
  );
}
