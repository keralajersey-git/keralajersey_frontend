import React, { useState, useEffect } from 'react';
import ProductModal from './ProductModal';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Updated filter UI with dropdown
const Products = ({ externalFilter, setExternalFilter }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productsPerPage = 6;
  const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

  const scrollToSection = () => {
    const section = document.getElementById('products');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Use a small timeout to let the DOM update before scrolling
    setTimeout(() => {
      const section = document.getElementById('products');
      if (section) {
        const offset = section.offsetTop - 80; // Offset for the fixed/sticky navbar
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/products/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);

        // Provide specific error messages
        if (err.message.includes('Failed to fetch') || err.message.includes('CORS')) {
          setError('⚠️ Backend Connection Error: The backend server is not accessible. Please ensure the backend is running and CORS is properly configured.');
        } else if (err.message.includes('500')) {
          setError('⚠️ Server Error: The backend encountered an error. Please contact support.');
        } else {
          setError('Failed to load products. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search and category filter
  useEffect(() => {
    let results = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory) {
      results = results.filter((product) => product.category && product.category === selectedCategory);
    }

    setFilteredProducts(results);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, products]);

  // Sync external filter from Hero
  useEffect(() => {
    if (externalFilter) {
      setSelectedCategory(externalFilter);
    }
  }, [externalFilter]);

  // Reset external filter when user manually changes category
  const handleCategoryChange = (e) => {
    const val = e.target.value || null;
    setSelectedCategory(val);
    if (setExternalFilter) {
      setExternalFilter(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="products" className="py-16 md:py-24 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            {selectedCategory === 'top-quality'
              ? 'Top Collections'
              : selectedCategory === 'standard-quality'
                ? 'Standard Collections'
                : 'Our Collection'}
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex-1 max-w-xs h-px bg-gradient-to-r from-transparent to-gray-400"></div>
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
            <div className="flex-1 max-w-xs h-px bg-gradient-to-l from-transparent to-gray-400"></div>
          </div>
          <p className="text-gray-600 font-light text-lg">
            Carefully curated jerseys celebrating Kerala's spirit
          </p>
        </div>

        {/* Search Bar and Filter */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-900 transition-all duration-200"
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

            {/* Category Filter - Icon Only */}
            <div className="relative">
              <select
                value={selectedCategory || ''}
                onChange={handleCategoryChange}
                className="w-14 h-[50px] pl-3 pr-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-gray-900 transition-all duration-200 appearance-none cursor-pointer hover:border-gray-400"
                style={{ textIndent: '-9999px' }}
              >
                <option value="">All</option>
                <option value="top-quality">Top Quality</option>
                <option value="standard-quality">Standard Quality</option>
              </select>
              {/* Filter Icon */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 'No products found matching your search.' : 'No products available at the moment.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-10">
              {filteredProducts
                .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                .map((product, index) => (
                  <div
                    key={index}
                    className="group flex flex-col h-full bg-[#faf7f2]/80 backdrop-blur-xl rounded-md overflow-hidden border border-[#e5e1da] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out"
                  >
                    {/* Product Image Container */}
                    <div className="relative overflow-hidden bg-white/20 aspect-square flex items-center justify-center m-1.5 sm:m-3 rounded-md">
                      {product.image1 ? (
                        <>
                          <img
                            src={product.image1}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                          {/* Subtle overlay on hover */}
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-400 text-sm">No image</span>
                        </div>
                      )}

                      {/* Badge Container */}
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col gap-1 sm:gap-2">
                        {product.free_delivery && (
                          <div className="bg-gray-900/90 backdrop-blur-md px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-full text-[7px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest text-white shadow-lg border border-white/10">
                            Free Delivery
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col p-3 sm:p-8 pt-2 sm:pt-4">
                      {/* Category if available */}
                      {product.category && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-600 mb-2">
                          {product.category.replace('-', ' ')}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="text-[12px] sm:text-lg font-black text-gray-900 mb-0.5 sm:mb-2 leading-tight tracking-tight line-clamp-1">
                        {product.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-500 text-[9px] sm:text-sm font-light mb-2 sm:mb-6 line-clamp-1 sm:line-clamp-2 leading-relaxed opacity-70 italic">
                        "{product.description}"
                      </p>



                      {/* Stock & Bottom Row */}
                      <div className="mt-auto space-y-4">
                        {product.stock && (
                          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span>{product.stock_left} Pieces Left</span>
                          </div>
                        )}

                        {/* Price and CTA */}
                        {/* Price and CTA */}
                        <div className="flex flex-row items-center justify-between gap-2 pt-2 sm:pt-4 border-t border-gray-900/5">
                          <div className="flex flex-col">
                            <span className="hidden sm:block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Price</span>
                            <div className="text-[13px] sm:text-3xl font-black text-gray-900 tracking-tighter shrink-0">
                              ₹{product.price.toFixed(0)}
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedProduct(product)}
                            disabled={!product.stock}
                            className={`flex-1 h-7 sm:h-14 rounded-md font-black text-[8px] sm:text-[11px] uppercase tracking-[0.05em] sm:tracking-[0.15em] transition-all duration-300 relative ${product.stock
                              ? 'bg-gray-900 text-white hover:bg-yellow-500 hover:text-gray-900 shadow-sm active:scale-95'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                          >
                            <span className="relative z-10">
                              {product.stock ? 'View' : 'Sold Out'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination */}
            {Math.ceil(filteredProducts.length / productsPerPage) > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-12 h-12 flex items-center justify-center border-2 border-gray-200 rounded-lg text-gray-600 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <FiChevronLeft size={24} />
                </button>

                <div className="px-6 h-12 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center shadow-sm min-w-[140px]">
                  <span className="text-sm font-black text-gray-900 uppercase tracking-widest whitespace-nowrap">
                    Page {currentPage} <span className="text-gray-400 mx-2">/</span> {Math.ceil(filteredProducts.length / productsPerPage)}
                  </span>
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, Math.ceil(filteredProducts.length / productsPerPage)))}
                  disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                  className="w-12 h-12 flex items-center justify-center border-2 border-gray-200 rounded-lg text-gray-600 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <FiChevronRight size={24} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </div>
  );
};

export default Products;
