import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CATEGORIES } from "../constants/categories";
import { collectionPath, productPath, setPageMetadata, SITE_ORIGIN, RETRO_COLLECTION, isRetroProduct, isJacketProduct, retroProductTitle, retroProductDescription, jacketProductDescription, collectionCategoryLabel, productImageType } from "../utils/seo";

const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const matchesProductId = (product, id) => product && String(product.$id || product.id) === id;
const getInitialProduct = (id) => {
  const dataTag = document.getElementById("initial-product-data");
  if (!dataTag) return null;
  try {
    const initialProduct = JSON.parse(dataTag.textContent || "null");
    return matchesProductId(initialProduct, id) ? initialProduct : null;
  } catch {
    return null;
  }
};

export default function ProductPage() {
  const { id } = useParams();
  const location = useLocation();
  const linkedProduct = location.state?.product;
  const [product, setProduct] = useState(() => matchesProductId(linkedProduct, id) ? linkedProduct : getInitialProduct(id));
  const [failedId, setFailedId] = useState(null);
  const currentProduct = matchesProductId(product, id) ? product : matchesProductId(linkedProduct, id) ? linkedProduct : null;

  useEffect(() => {
    let active = true;
    const cachedProduct = matchesProductId(location.state?.product, id) ? location.state.product : getInitialProduct(id);
    fetch(`${API_URL}/products/${encodeURIComponent(id)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Product not found");
        return response.json();
      })
      .then((data) => {
        if (active) {
          setProduct(data);
          setFailedId(null);
        }
      })
      .catch(() => {
        if (active && !cachedProduct) setFailedId(id);
      });
    return () => { active = false; };
  }, [id, location.state]);

  useEffect(() => {
    if (!currentProduct) return;
    const isRetro = isRetroProduct(currentProduct);
    const isJacket = isJacketProduct(currentProduct);
    const title = isRetro ? retroProductTitle(currentProduct) : `${currentProduct.title.trim()} | Kerala Jersey`;
    const description = (isRetro ? retroProductDescription(currentProduct) : isJacket ? jacketProductDescription(currentProduct) : currentProduct.description || `Shop ${currentProduct.title.trim()} at Kerala Jersey. Order online with delivery across India.`).trim().slice(0, 155);
    const path = productPath(currentProduct);
    const category = CATEGORIES.find((item) => item.id === currentProduct.category);
    const availability = currentProduct.stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
    setPageMetadata({
      title,
      description,
      path,
      image: currentProduct.image1 || `${SITE_ORIGIN}/kerala-jersey-og.jpg`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Product",
        name: currentProduct.title.trim(),
        description,
        ...(isJacket && category ? { category: collectionCategoryLabel(category) } : {}),
        image: [currentProduct.image1, currentProduct.image2, currentProduct.image3].filter(Boolean),
        sku: currentProduct.$id || currentProduct.id,
        brand: { "@type": "Brand", name: "Kerala Jersey" },
        offers: {
          "@type": "Offer",
          url: `${SITE_ORIGIN}${path}`,
          priceCurrency: "INR",
          price: String(currentProduct.price),
          availability,
        },
      },
    });
  }, [currentProduct]);

  if (!currentProduct && failedId !== id) return <main className="min-h-screen p-8 text-gray-700">Loading product…</main>;
  if (!currentProduct) return <main className="min-h-screen p-8 text-gray-900"><h1 className="text-3xl font-bold">Product unavailable</h1><p className="mt-3">This product may no longer be listed.</p><Link className="mt-6 inline-block underline" to="/">Browse Kerala Jersey</Link></main>;

  const category = CATEGORIES.find((item) => item.id === currentProduct.category);
  const isRetro = isRetroProduct(currentProduct);
  const isJacket = isJacketProduct(currentProduct);
  const productDescription = isRetro ? retroProductDescription(currentProduct) : currentProduct.description;
  const categoryName = collectionCategoryLabel(category) || currentProduct.category?.replaceAll("-", " ") || "Jerseys";
  const message = encodeURIComponent(`Hi, I'm interested in the ${currentProduct.title.trim()}. Price: ₹${currentProduct.price}.`);

  return (
    <main className="min-h-screen bg-[#faf7f2] text-gray-900">
      <nav className="mx-auto flex max-w-6xl gap-2 px-5 py-6 text-sm" aria-label="Breadcrumb">
        <Link to="/">Home</Link><span aria-hidden="true">/</span>{isRetro ? <Link to={collectionPath(RETRO_COLLECTION.id)}>{RETRO_COLLECTION.label}</Link> : category ? <Link to={collectionPath(category.id)}>{categoryName}</Link> : <span>{categoryName}</span>}<span aria-hidden="true">/</span><span>{currentProduct.title.trim()}</span>
      </nav>
      <article className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 md:grid-cols-2">
        <div className="space-y-4">
          {currentProduct.image1 && <img className="w-full rounded-lg bg-white object-cover" src={currentProduct.image1} alt={`${currentProduct.title.trim()} ${productImageType(currentProduct)}`} fetchPriority="high" loading="eager" decoding="async" />}
          <div className="grid grid-cols-2 gap-4">{[currentProduct.image2, currentProduct.image3].filter(Boolean).map((image) => <img key={image} className="w-full rounded-lg bg-white object-cover" src={image} alt={`${currentProduct.title.trim()} ${isJacket ? "jacket" : "jersey"} detail`} loading="lazy" fetchPriority="low" decoding="async" />)}</div>
        </div>
        <div className="self-start md:sticky md:top-8">
          <p className="text-sm font-bold uppercase tracking-widest">{currentProduct.sub_category || categoryName}</p>
          <h1 className="mt-3 text-3xl font-black md:text-5xl">{currentProduct.title.trim()}</h1>
          <p className="mt-5 text-2xl font-semibold">₹{currentProduct.price}</p>
          {productDescription && <p className="mt-6 whitespace-pre-line leading-7 text-gray-700">{productDescription}</p>}
          {currentProduct.available_sizes?.length > 0 && <p className="mt-5"><strong>Available sizes:</strong> {currentProduct.available_sizes.join(", ")}</p>}
          <p className="mt-4">{currentProduct.stock ? "Available to order" : "Currently out of stock"}</p>
          <a className="mt-7 inline-block rounded bg-gray-900 px-6 py-3 font-semibold text-white" href={`https://wa.me/918848027778?text=${message}`}>{isJacket ? "Ask about this jacket on WhatsApp" : "Ask about this jersey on WhatsApp"}</a>
          {isRetro ? <p className="mt-6"><Link className="underline" to={collectionPath(RETRO_COLLECTION.id)}>Browse retro &amp; vintage football jerseys</Link></p> : category && <p className="mt-6"><Link className="underline" to={collectionPath(category.id)}>Browse more {categoryName.toLowerCase()}</Link></p>}
        </div>
      </article>
    </main>
  );
}
