import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ResponsiveProductImage from "../components/ResponsiveProductImage";
import { CATEGORIES } from "../constants/categories";
import {
  collectionPath,
  productPath,
  setPageMetadata,
  SITE_ORIGIN,
  slugify,
  RETRO_COLLECTION,
  RETRO_SUBCATEGORY,
  isRetroProduct,
  collectionHeading,
  collectionTitle,
  collectionDescription,
  productImageType,
} from "../utils/seo";

const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const PAGE_SIZE = 12;

const getCollectionParams = (page, category, isRetroCollection) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
    category: isRetroCollection ? "top-quality" : category.id,
  });
  if (isRetroCollection) params.set("sub_category", RETRO_SUBCATEGORY);
  return params.toString();
};

export default function CollectionPage() {
  const { categorySlug } = useParams();
  const isRetroCollection = categorySlug === slugify(RETRO_COLLECTION.id);
  const category = isRetroCollection
    ? RETRO_COLLECTION
    : CATEGORIES.find((item) => slugify(item.id) === categorySlug);
  const [products, setProducts] = useState([]);
  const [loadedCategoryId, setLoadedCategoryId] = useState(null);
  const [failedCategoryId, setFailedCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorySlug]);

  useEffect(() => {
    if (!category) return undefined;
    let active = true;
    const requestId = ++requestIdRef.current;
    setProducts([]);
    setLoadedCategoryId(null);
    setFailedCategoryId(null);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalProducts(0);
    setLoadingMore(false);
    setLoadMoreFailed(false);

    const loadCollection = async () => {
      try {
        const response = await fetch(
          `${API_URL}/products/?${getCollectionParams(1, category, isRetroCollection)}`,
        );
        if (!response.ok) throw new Error("Unable to load collection");
        const firstPage = await response.json();
        const items = Array.isArray(firstPage.items) ? firstPage.items : [];
        if (!active || requestId !== requestIdRef.current) return;

        setProducts(isRetroCollection ? items.filter(isRetroProduct) : items);
        setCurrentPage(1);
        setTotalPages(Math.max(1, Number(firstPage.pages) || 1));
        setTotalProducts(
          Number.isFinite(Number(firstPage.total))
            ? Number(firstPage.total)
            : items.length,
        );
        setLoadedCategoryId(category.id);
        setFailedCategoryId(null);
      } catch {
        if (active && requestId === requestIdRef.current) {
          setFailedCategoryId(category.id);
        }
      }
    };

    loadCollection();
    return () => {
      active = false;
    };
  }, [category, isRetroCollection]);

  const handleLoadMore = async () => {
    if (!category || loadingMore || currentPage >= totalPages) return;
    const requestId = requestIdRef.current;
    const nextPage = currentPage + 1;
    setLoadingMore(true);
    setLoadMoreFailed(false);

    try {
      const response = await fetch(
        `${API_URL}/products/?${getCollectionParams(nextPage, category, isRetroCollection)}`,
      );
      if (!response.ok) throw new Error("Unable to load more products");
      const data = await response.json();
      if (requestId !== requestIdRef.current) return;

      const items = Array.isArray(data.items) ? data.items : [];
      setProducts((currentProducts) => [
        ...currentProducts,
        ...(isRetroCollection ? items.filter(isRetroProduct) : items),
      ]);
      setCurrentPage(nextPage);
    } catch {
      if (requestId === requestIdRef.current) setLoadMoreFailed(true);
    } finally {
      if (requestId === requestIdRef.current) setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!category) return;
    const path = collectionPath(isRetroCollection ? RETRO_COLLECTION.id : category.id);
    const description = isRetroCollection ? RETRO_COLLECTION.description : collectionDescription(category);
    const heading = isRetroCollection ? "Retro & Vintage Football Jerseys in India" : collectionHeading(category);
    const listedProducts = products.filter(isRetroProduct);
    setPageMetadata({
      title: isRetroCollection ? "Retro & Vintage Football Jerseys in India | Kerala Jersey" : collectionTitle(category),
      description,
      path,
      image: `${SITE_ORIGIN}/kerala-jersey-og.jpg`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: heading,
        description,
        url: `${SITE_ORIGIN}${path}`,
        isPartOf: { "@type": "WebSite", name: "Kerala Jersey", url: `${SITE_ORIGIN}/` },
        ...(isRetroCollection ? { mainEntity: { "@type": "ItemList", numberOfItems: listedProducts.length, itemListElement: listedProducts.map((product, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_ORIGIN}${productPath(product)}`, name: product.title?.trim() })) } } : {}),
      },
    });
  }, [category, isRetroCollection, products]);

  if (!category) return <main className="min-h-screen p-8"><h1 className="text-3xl font-bold">Collection not found</h1><Link className="mt-5 inline-block underline" to="/">Browse all products</Link></main>;
  const loading = loadedCategoryId !== category.id && failedCategoryId !== category.id;
  const failed = failedCategoryId === category.id;
  const visibleProducts = loadedCategoryId === category.id ? products : [];

  return (
    <main className="min-h-screen bg-[#faf7f2] px-5 py-8 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-8 text-sm" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true"> / </span><span>{category.label}</span></nav>
        <header className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-black md:text-5xl">{isRetroCollection ? "Retro & Vintage Football Jerseys in India" : collectionHeading(category)}</h1>
          <p className="mt-4 text-lg text-gray-700">{isRetroCollection ? RETRO_COLLECTION.description : category.id === "jackets" ? collectionDescription(category) : `${category.description}. Shop football jerseys and fanwear online with delivery across India.`}</p>
        </header>
        {loading && <p role="status">Loading collection…</p>}
        {failed && <p role="alert">We couldn’t load this collection right now. Please try again shortly.</p>}
        {!loading && !failed && visibleProducts.length === 0 && <p>No products are currently listed in this collection.</p>}
        <ul className="grid list-none grid-cols-2 gap-5 p-0 sm:grid-cols-3 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <li key={product.$id || product.id} className="overflow-hidden rounded-lg border border-[#e5e1da] bg-white shadow-sm">
              {product.image1 && (
                <Link className="block" to={productPath(product)} state={{ product }}>
                  <ResponsiveProductImage
                    src={product.image1}
                    alt={`${product.title} ${productImageType(product)}`}
                    loading="lazy"
                    decoding="async"
                    mobileSize="md"
                    className="aspect-square w-full object-cover"
                  />
                </Link>
              )}
              <div className="p-4"><h2 className="font-bold">{product.title?.trim()}</h2><p className="mt-2 font-semibold">₹{product.price}</p></div>
            </li>
          ))}
        </ul>
        {!loading && !failed && currentPage < totalPages && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              aria-busy={loadingMore}
              className="min-h-12 rounded-md bg-gray-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-wait disabled:opacity-70"
            >
              {loadingMore ? "Loading more jerseys…" : loadMoreFailed ? "Try again" : "Load more jerseys"}
            </button>
            {loadMoreFailed && <p role="status" className="text-sm text-gray-600">We couldn’t load more products. Please try again.</p>}
            <p className="text-sm text-gray-600">Showing {visibleProducts.length} of {totalProducts} products</p>
          </div>
        )}
        <div className="mt-12 flex flex-wrap gap-5 border-t border-gray-300 pt-6">{!isRetroCollection && <Link className="underline" to={collectionPath(RETRO_COLLECTION.id)}>Shop retro &amp; vintage football jerseys</Link>}{CATEGORIES.filter((item) => item.id !== category.id).map((item) => <Link className="underline" key={item.id} to={collectionPath(item.id)}>Shop {item.label}</Link>)}</div>
      </div>
    </main>
  );
}
