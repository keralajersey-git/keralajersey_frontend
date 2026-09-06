import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiX,
  FiCheck,
  FiUploadCloud,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { MdPushPin } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isAdminLoggedIn") === "true",
  );
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const envUser = import.meta.env.VITE_ADMIN_USER;
    const envPass = import.meta.env.VITE_ADMIN_PASS;

    if (adminUser === envUser && adminPass === envPass) {
      setIsLoggedIn(true);
      sessionStorage.setItem("isAdminLoggedIn", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("isAdminLoggedIn");
  };

  // Filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [pinnedFilter, setPinnedFilter] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState("top-quality");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const productsPerPage = 12;
  const adminRef = useRef(null);

  const subCategories = [
    { id: null, label: "All Top Quality" },
    { id: "first quality", label: "First Quality" },
    { id: "master quality", label: "Master Quality" },
    { id: "player version", label: "Player Version" },
    { id: "authentic retro", label: "Authentic Retro" },
  ];

  const handleCategoryChange = (val, subVal = null) => {
    setSelectedCategory(val);
    setSelectedSubCategory(subVal);
    setPinnedFilter(false);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handlePinnedFilter = () => {
    setPinnedFilter(true);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Reviews tab state
  const [activeTab, setActiveTab] = useState("products");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsLoadingMore, setReviewsLoadingMore] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [reviewsSearch, setReviewsSearch] = useState("");
  const [debouncedReviewsSearch, setDebouncedReviewsSearch] = useState("");
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsTotal, setReviewsTotal] = useState(0);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Direct scroll to top of window for Admin panel
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "top-quality",
    sub_category: "",
    price: "",
    original_price: "",
    stock: true,
    stock_left: "",
    free_delivery: false,
    pinned: false,
    available_sizes: ["S", "M", "L", "XL"],
    image1: "",
    image2: "",
    image3: "",
  });

  const API_URL = (
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
  ).replace(/\/$/, "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(productsPerPage),
      });
      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedSubCategory) params.set("sub_category", selectedSubCategory);
      if (pinnedFilter) params.set("pinned", "true");
      const response = await fetch(`${API_URL}/products/?${params.toString()}`);
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      const data = await response.json();
      console.log("Fetched products:", data);
      setProducts(data.items);
      setFilteredProducts(data.items);
      setTotalPages(data.pages);
      setTotalProducts(data.total);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Could not connect to backend. Please check if it is running.");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    debouncedSearch,
    selectedCategory,
    selectedSubCategory,
    pinnedFilter,
    productsPerPage,
    API_URL,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedReviewsSearch(reviewsSearch);
    }, 400);
    return () => clearTimeout(timer);
  }, [reviewsSearch]);

  const fetchReviews = useCallback(
    async (page = 1, append = false) => {
      try {
        if (append) setReviewsLoadingMore(true);
        else setReviewsLoading(true);
        setReviewsError(null);
        const params = new URLSearchParams({
          page: String(page),
          limit: "20",
        });
        if (debouncedReviewsSearch.trim())
          params.set("search", debouncedReviewsSearch.trim());
        const response = await fetch(
          `${API_URL}/reviews/?${params.toString()}`,
        );
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        const data = await response.json();
        setReviews((prev) =>
          append ? [...prev, ...data.items] : data.items,
        );
        setReviewsTotal(data.total);
        setReviewsPage(page);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviewsError("Could not load reviews.");
      } finally {
        setReviewsLoading(false);
        setReviewsLoadingMore(false);
      }
    },
    [debouncedReviewsSearch, API_URL],
  );

  useEffect(() => {
    if (activeTab === "reviews") {
      fetchReviews(1, false);
    }
  }, [activeTab, fetchReviews]);

  const handleLoadMore = () => {
    fetchReviews(reviewsPage + 1, true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        setReviewsTotal((t) => Math.max(t - 1, 0));
      } else {
        alert("Failed to delete review");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || "",
      description: product.description || "",
      category: product.category || "top-quality",
      sub_category: product.sub_category || "",
      price: product.price || "",
      original_price: product.original_price || "",
      stock: product.stock !== undefined ? product.stock : true,
      stock_left: product.stock_left !== null ? product.stock_left : "",
      free_delivery: product.free_delivery || false,
      pinned: product.pinned || false,
      available_sizes: product.available_sizes || ["S", "M", "L", "XL"],
      image1: product.image1 || "",
      image2: product.image2 || "",
      image3: product.image3 || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "top-quality",
      sub_category: "",
      price: "",
      original_price: "",
      stock: true,
      stock_left: "",
      free_delivery: false,
      pinned: false,
      available_sizes: ["S", "M", "L", "XL"],
      image1: "",
      image2: "",
      image3: "",
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      original_price: formData.original_price
        ? parseFloat(formData.original_price)
        : null,
      stock_left: formData.stock ? parseInt(formData.stock_left) : null,
    };

    try {
      const id = editingProduct?.$id || editingProduct?.id;
      const url = editingProduct
        ? `${API_URL}/products/${id}`
        : `${API_URL}/products/`;

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        const error = await response.json();
        alert(`Error: ${JSON.stringify(error.detail)}`);
      }
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSizeToggle = (size) => {
    const updatedSizes = formData.available_sizes.includes(size)
      ? formData.available_sizes.filter((s) => s !== size)
      : [...formData.available_sizes, size];
    setFormData({ ...formData, available_sizes: updatedSizes });
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log(`Starting upload for ${fieldName}:`, file.name);

    const originalValue = formData[fieldName];
    setFormData((prev) => ({ ...prev, [fieldName]: "Uploading..." }));
    setIsSubmitting(true);

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/products/upload-image`, {
        method: "POST",
        body: uploadData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Upload success:", data.url);
        setFormData((prev) => ({ ...prev, [fieldName]: data.url }));
      } else {
        console.error("Upload fail status:", response.status);
        alert("Upload failed. Please check backend logs.");
        setFormData((prev) => ({ ...prev, [fieldName]: originalValue }));
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Network error during upload");
      setFormData((prev) => ({ ...prev, [fieldName]: originalValue }));
    } finally {
      setIsSubmitting(false);
      e.target.value = "";
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-[#e5e1da]"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">
              ADMIN<span className="text-[#c5bbae]">LOGIN</span>
            </h1>
            <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">
              Secure Access Required
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Username
              </label>
              <input
                required
                type="text"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-gray-900 focus:ring-0 outline-none transition-all placeholder:text-gray-300"
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Password
              </label>
              <input
                required
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-gray-900 focus:ring-0 outline-none transition-all placeholder:text-gray-300"
                placeholder="••••••••"
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-xs font-bold text-center">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg active:scale-[0.98]"
            >
              Authorize
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={adminRef}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight italic">
              ADMIN<span className="text-[#c5bbae]">PANEL</span>
            </h1>
            <p className="text-gray-500 text-xs mt-1 tracking-widest">
              Manage your products <span className="text-gray-300">|</span>{" "}
              <span className="text-gray-900 font-bold">
                {totalProducts} total
              </span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === "products" && (
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="flex items-center justify-center bg-gray-900 text-white px-2.5 py-2.5 rounded-md font-bold hover:bg-black transition-all shadow-lg shadow-gray-900/20 active:scale-95 shrink-0"
                title="Add Product"
              >
                <FiPlus className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2.5 border border-red-100 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-all active:scale-95 shrink-0"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-10 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-1 py-3 text-sm font-black uppercase tracking-widest transition-all border-b-2 -mb-px ${
              activeTab === "products"
                ? "text-gray-900 border-gray-900"
                : "text-gray-400 border-transparent hover:text-gray-600"
            }`}
            style={{ fontFamily: "'BuiltTitlingSB', sans-serif" }}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-1 py-3 text-sm font-black uppercase tracking-widest transition-all border-b-2 -mb-px ${
              activeTab === "reviews"
                ? "text-gray-900 border-gray-900"
                : "text-gray-400 border-transparent hover:text-gray-600"
            }`}
            style={{ fontFamily: "'BuiltTitlingSB', sans-serif" }}
          >
            Reviews
          </button>
        </div>

        {activeTab === "products" ? (
          <>
        {/* Search Bar and Filter */}
        <div className="mb-10">
          <div className="flex flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-5 py-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-all duration-200 shadow-sm"
              />
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-12 h-[46px] flex items-center justify-center border border-gray-200 rounded-md bg-white text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all duration-200 shadow-sm active:scale-95 shrink-0"
              title="Filter Collection"
            >
              <FiFilter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-8 rounded-md border border-red-100 text-center">
            <p className="text-red-600 font-bold mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-red-600 text-white px-6 py-2 rounded-md font-bold hover:bg-red-700 transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-md shadow-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Product
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Category
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Price
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProducts.map((product) => (
                        <tr
                          key={product.$id || product.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 relative">
                            {product.pinned && (
                              <MdPushPin className="absolute top-2 right-2 w-3.5 h-3.5 text-yellow-500 shrink-0 rotate-45" />
                            )}
                            <div className="flex items-center gap-4">
                              <img
                                src={product.image1}
                                alt={product.title}
                                className="w-12 h-12 rounded-md object-cover bg-gray-100 border border-gray-100"
                              />
                              <div>
                                <div className="font-bold text-gray-900 line-clamp-1">
                                  {product.title}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
                              {product.sub_category ||
                                product.category?.replace("-", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 text-sm">
                                ₹{product.price}
                              </span>
                              {product.original_price &&
                                product.original_price > product.price && (
                                  <span className="text-[10px] text-gray-400 line-through">
                                    ₹{product.original_price}
                                  </span>
                                )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {product.stock ? (
                              <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                {product.stock_left} Left
                              </div>
                            ) : (
                              <span className="text-red-500 text-xs font-bold">
                                Out of Stock
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(product.$id || product.id)
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-6 md:hidden">
              {filteredProducts.map((product) => (
                  <div
                    key={product.$id || product.id}
                    className="bg-white p-6 rounded-md shadow-lg border border-gray-100 space-y-4 relative"
                  >
                    {product.pinned && (
                      <MdPushPin className="absolute top-4 right-4 w-4 h-4 text-yellow-500 shrink-0 rotate-45" />
                    )}
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image1}
                        alt={product.title}
                        className="w-20 h-20 rounded-md object-cover bg-gray-100 border border-gray-50"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-yellow-600 mb-1">
                          {product.sub_category ||
                            product.category?.replace("-", " ")}
                        </div>
                        <h3 className="font-black text-gray-900 leading-tight">
                          {product.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="text-lg font-black text-gray-900">
                            ₹{product.price}
                          </div>
                          {product.original_price &&
                            product.original_price > product.price && (
                              <div className="text-sm text-gray-400 line-through opacity-60">
                                ₹{product.original_price}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Stock Status
                      </div>
                      {product.stock ? (
                        <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          {product.stock_left} Units Left
                        </div>
                      ) : (
                        <span className="text-red-500 text-xs font-bold uppercase tracking-widest">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-md font-bold"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.$id || product.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-md font-bold"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 bg-white"
                >
                  <FiChevronLeft size={20} />
                </button>

                <div className="px-5 h-12 bg-white border border-gray-200 rounded-md flex items-center justify-center shadow-sm min-w-[120px]">
                  <span className="text-xs font-black text-gray-900 uppercase tracking-widest whitespace-nowrap">
                    Page {currentPage}{" "}
                    <span className="text-gray-300 mx-2">/</span>{" "}
                    {totalPages}
                  </span>
                </div>

                <button
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 bg-white"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}

            {/* Filter Collection Modal */}
            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsFilterOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
                  >
                    <div
                      className="relative bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 overflow-hidden pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="p-4 pb-2 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Filter Collection
                        </h3>
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <FiX className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      {/* Options */}
                      <div className="p-4 space-y-2">
                        {/* All Collections */}
                        <button
                          onClick={() => handleCategoryChange(null)}
                          className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                            !selectedCategory && !selectedSubCategory && !pinnedFilter
                              ? "border-[#c5bbae] bg-[#faf7f2]"
                              : "border-gray-200 hover:border-[#c5bbae] hover:bg-[#faf7f2]"
                          }`}
                        >
                          <div className="font-medium text-gray-900">
                            All Collections
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            View all products
                          </div>
                        </button>

                        {/* Pinned */}
                        <button
                          onClick={handlePinnedFilter}
                          className={`w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center justify-between ${
                            pinnedFilter && !selectedCategory && !selectedSubCategory
                              ? "border-[#c5bbae] bg-[#faf7f2]"
                              : "border-gray-200 hover:border-[#c5bbae] hover:bg-[#faf7f2]"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MdPushPin className="w-4 h-4 text-gray-700 rotate-45" />
                            <div>
                              <div className="font-medium text-gray-900">
                                Pinned
                              </div>
                              <div className="text-sm text-gray-500">
                                Featured products only
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* Top Quality */}
                        <div className="space-y-1">
                          <button
                            onClick={() =>
                              setExpandedCategory(
                                expandedCategory === "top-quality"
                                  ? null
                                  : "top-quality",
                              )
                            }
                            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center justify-between ${
                              expandedCategory === "top-quality" ||
                              (selectedCategory === "top-quality" &&
                                !selectedSubCategory)
                                ? "border-[#c5bbae] bg-[#faf7f2]"
                                : "border-gray-200 hover:border-[#c5bbae] hover:bg-[#faf7f2]"
                            }`}
                          >
                            <div>
                              <div className="font-medium text-gray-900">
                                Top Quality
                              </div>
                              <div className="text-sm text-gray-500">
                                5 variations available
                              </div>
                            </div>
                            {expandedCategory === "top-quality" ? (
                              <FiChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                              <FiChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                          </button>

                          <AnimatePresence>
                            {expandedCategory === "top-quality" && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-gray-50 rounded-lg overflow-hidden"
                              >
                                {subCategories.map((sub) => (
                                  <button
                                    key={sub.id || "all-sub"}
                                    onClick={() =>
                                      handleCategoryChange("top-quality", sub.id)
                                    }
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-l-2 ${
                                      selectedCategory === "top-quality" &&
                                      selectedSubCategory === sub.id
                                        ? "text-[#c5bbae] bg-white border-[#c5bbae]"
                                        : "text-gray-700 hover:text-[#c5bbae] hover:bg-white border-transparent hover:border-[#c5bbae]"
                                    }`}
                                  >
                                    {sub.label}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Standard Quality */}
                        <button
                          onClick={() => handleCategoryChange("standard-quality")}
                          className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                            selectedCategory === "standard-quality" &&
                            !selectedSubCategory
                              ? "border-[#c5bbae] bg-[#faf7f2]"
                              : "border-gray-200 hover:border-[#c5bbae] hover:bg-[#faf7f2]"
                          }`}
                        >
                          <div className="font-medium text-gray-900">
                            Standard Quality
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Regular quality jerseys
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div>
            {/* Reviews Search */}
            <div className="mb-10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by review or product..."
                  value={reviewsSearch}
                  onChange={(e) => setReviewsSearch(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-all duration-200 shadow-sm"
                />
                {reviewsSearch && (
                  <button
                    onClick={() => setReviewsSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {reviewsLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : reviewsError ? (
              <div className="bg-red-50 p-8 rounded-md border border-red-100 text-center">
                <p className="text-red-600 font-bold">{reviewsError}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No reviews found.
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-md shadow-md border border-gray-100 p-5 flex items-start gap-4"
                    >
                      {review.product_image ? (
                        <img
                          src={review.product_image}
                          alt={review.product_title}
                          className="w-16 h-16 rounded-md object-cover bg-gray-100 border border-gray-100 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-md bg-gray-100 border border-gray-100 flex items-center justify-center text-gray-300 shrink-0">
                          <FiImage className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md truncate">
                            {review.product_title || "Unknown product"}
                          </span>
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {review.created_at
                              ? new Date(
                                  review.created_at,
                                ).toLocaleDateString(undefined, {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : ""}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-gray-900 mb-1">
                          {review.customer_name}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {review.review}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors shrink-0"
                        title="Delete review"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <p className="text-xs text-gray-400 mb-4">
                    Showing {reviews.length} of {reviewsTotal} reviews
                  </p>
                  {reviews.length < reviewsTotal && (
                    <button
                      onClick={handleLoadMore}
                      disabled={reviewsLoadingMore}
                      className="px-8 py-3 bg-gray-900 text-white rounded-md font-bold hover:bg-black transition-all disabled:opacity-50"
                    >
                      {reviewsLoadingMore ? "Loading..." : "Load More"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSubmitting) setShowModal(false);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-md shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 sm:p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Title
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                        placeholder="Premium Kerala Jersey"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Price (₹)
                      </label>
                      <input
                        required
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                        placeholder="799"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Original Price (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.original_price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            original_price: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                        placeholder="1299"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Description
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                      placeholder="Product features and details..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            category: val,
                            sub_category:
                              val === "top-quality"
                                ? formData.sub_category
                                : "",
                          });
                        }}
                        className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all appearance-none bg-white"
                      >
                        <option value="top-quality">Top Quality</option>
                        <option value="standard-quality">
                          Standard Quality
                        </option>
                      </select>
                    </div>
                    {formData.category === "top-quality" && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Sub Category
                        </label>
                        <select
                          value={formData.sub_category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sub_category: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all appearance-none bg-white"
                        >
                          <option value="">None</option>
                          <option value="first quality">First Quality</option>
                          <option value="master quality">Master Quality</option>
                          <option value="player version">Player Version</option>
                          <option value="authentic retro">
                            Authentic Retro
                          </option>
                        </select>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Stock Left
                      </label>
                      <input
                        required={formData.stock}
                        type="number"
                        value={formData.stock_left}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stock_left: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                        placeholder="50"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, stock: !formData.stock })
                      }
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.stock ? "bg-gray-900 border-gray-900" : "border-gray-200"}`}
                      >
                        {formData.stock && (
                          <FiCheck className="text-white w-4 h-4" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                        In Stock
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          free_delivery: !formData.free_delivery,
                        })
                      }
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.free_delivery ? "bg-gray-900 border-gray-900" : "border-gray-200"}`}
                      >
                        {formData.free_delivery && (
                          <FiCheck className="text-white w-4 h-4" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                        Free Delivery
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, pinned: !formData.pinned })
                      }
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.pinned ? "bg-yellow-500 border-yellow-500" : "border-gray-200"}`}
                      >
                        {formData.pinned && (
                          <MdPushPin className="text-white w-3.5 h-3.5 rotate-45" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-bold uppercase tracking-widest ${formData.pinned ? "text-yellow-600" : "text-gray-600"}`}
                      >
                        Pin to Top
                      </span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Available Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`px-4 py-2 rounded-md text-xs font-bold transition-all border-2 ${formData.available_sizes.includes(size) ? "bg-gray-900 border-gray-900 text-white" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                      <FiImage className="w-4 h-4" /> Product Images
                    </h3>
                    {[1, 2, 3].map((num) => (
                      <div
                        key={`img-upload-box-${num}`}
                        className="bg-gray-50/50 p-4 rounded-md border border-gray-100"
                      >
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                          {/* Better Preview Area */}
                          <div className="relative w-20 h-20 bg-white rounded-md border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0 group mx-auto sm:mx-0">
                            {formData[`image${num}`] &&
                            formData[`image${num}`] !== "Uploading..." ? (
                              <img
                                src={formData[`image${num}`]}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-gray-300">
                                {formData[`image${num}`] === "Uploading..." ? (
                                  <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <FiImage className="w-8 h-8" />
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 w-full space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Slot {num}{" "}
                                {num === 1 && (
                                  <span className="text-blue-500">
                                    * (Cover Image)
                                  </span>
                                )}
                              </label>
                              {formData[`image${num}`] && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      [`image${num}`]: "",
                                    })
                                  }
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <FiTrash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={
                                  formData[`image${num}`] === "Uploading..."
                                    ? ""
                                    : formData[`image${num}`]
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    [`image${num}`]: e.target.value,
                                  })
                                }
                                className="flex-1 min-w-0 px-4 py-2.5 text-sm rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all placeholder:text-gray-300 bg-white"
                                placeholder="Paste URL..."
                                disabled={
                                  formData[`image${num}`] === "Uploading..."
                                }
                              />

                              <label
                                className={`w-11 h-11 flex items-center justify-center rounded-md cursor-pointer transition-all active:scale-90 shrink-0 ${formData[`image${num}`] === "Uploading..." ? "bg-gray-100 text-gray-400 cursor-wait" : "bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-900/20"}`}
                              >
                                <FiUploadCloud className="w-5 h-5" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleImageUpload(e, `image${num}`)
                                  }
                                  disabled={isSubmitting}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8">
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full bg-gray-900 text-white py-4 rounded-md font-black uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50 shadow-xl shadow-gray-900/30 active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : editingProduct ? (
                        "Update Product"
                      ) : (
                        "Create Product"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
