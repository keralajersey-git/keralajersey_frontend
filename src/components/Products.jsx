import React, { useState, useEffect } from 'react';
import ProductModal from './ProductModal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productsPerPage = 6;
  const API_URL = import.meta.env.VITE_API_URL || 'https://keralajersey-backend.vercel.app';

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
    <div className="py-16 md:py-24 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            Our Collection
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

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
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
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`p-3 rounded-full transition-all duration-300 border-2 ${
              selectedCategory === null
                ? 'bg-gray-900 border-gray-900 shadow-lg text-white'
                : 'bg-white border-gray-300 hover:border-gray-900 text-gray-600 hover:text-gray-900'
            }`}
            title="All Products"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>

          <button
            onClick={() => setSelectedCategory('top-quality')}
            className={`p-3 rounded-full transition-all duration-300 border-2 ${
              selectedCategory === 'top-quality'
                ? 'bg-gray-900 border-gray-900 shadow-lg text-white'
                : 'bg-white border-gray-300 hover:border-gray-900 text-gray-600 hover:text-gray-900'
            }`}
            title="Top Quality"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>

          <button
            onClick={() => setSelectedCategory('standard quality')}
            className={`p-3 rounded-full transition-all duration-300 border-2 ${
              selectedCategory === 'standard quality'
                ? 'bg-gray-900 border-gray-900 shadow-lg text-white'
                : 'bg-white border-gray-300 hover:border-gray-900 text-gray-600 hover:text-gray-900'
            }`}
            title="Standard Quality"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredProducts
                .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                .map((product, index) => (
              <div
                key={index}
                className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-300"
              >
                {/* Product Image Container */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 aspect-square flex items-center justify-center">
                  {product.image1 ? (
                    <>
                      <img
                        src={product.image1}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Subtle overlay on hover */}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                  
                  {/* Badge Container */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {product.free_delivery && (
                      <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-900 shadow-lg border border-gray-200">
                        Free Delivery
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col p-5 bg-yellow-50">
                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight group-hover:text-gray-700 transition-colors duration-200 line-clamp-2">
                    {product.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-xs font-light mb-3 flex-1 line-clamp-1 leading-relaxed opacity-80">
                    {product.description}
                  </p>

                  {/* Size Pills */}
                  <div className="mb-4 pt-3 border-t border-gray-200">
                    <div className="flex gap-2 flex-wrap">
                      {product.available_sizes && product.available_sizes.map((size) => (
                        <button
                          key={size}
                          className="h-8 px-3 flex items-center justify-center border-2 border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-white group-hover:border-gray-400 transition-all duration-200"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stock Indicator & Badge */}
                  {product.stock && (
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-xs text-gray-600 font-medium">
                        <span className="text-gray-700 font-semibold">{product.stock_left}</span> pieces available
                      </div>
                      <div className="bg-gray-900/90 px-2.5 mt-[-6px] rounded-md">
                        <span className="text-xs text-white">In Stock</span>
                      </div>
                    </div>
                  )}

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-200 mt-auto">
                    <div className="flex flex-col">
                      <div className="text-2xl font-bold text-gray-900">
                        ₹{product.price.toFixed(0)}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      disabled={!product.stock}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wide transition-all duration-300 overflow-hidden relative ${
                        product.stock
                          ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/30 active:scale-95'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <span className="relative z-10">
                        {product.stock ? 'View' : 'Out'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>

            {/* Pagination */}
            {Math.ceil(filteredProducts.length / productsPerPage) > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-sm text-gray-700 hover:border-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/30'
                            : 'border-2 border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / productsPerPage)))}
                  disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                  className="px-4 py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-sm text-gray-700 hover:border-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
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
