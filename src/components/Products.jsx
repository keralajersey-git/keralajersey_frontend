import React, { useState, useEffect, useRef } from 'react';
import ProductModal from './ProductModal';
import { FiChevronLeft, FiChevronRight, FiFilter, FiCheck, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Products = ({ externalFilter, setExternalFilter }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productsPerPage = 6;
  const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

  const categories = [
    { id: null, label: 'All Collections' },
    { id: 'top-quality', label: 'Top Quality' },
    { id: 'standard-quality', label: 'Standard Quality' }
  ];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setTimeout(() => {
      const section = document.getElementById('products');
      if (section) {
        const offset = section.offsetTop - 80;
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
        const response = await fetch(`${API_URL}/products/`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError('⚠️ Backend Connection Error. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let results = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedCategory) {
      results = results.filter((product) => product.category === selectedCategory);
    }
    setFilteredProducts(results);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, products]);

  useEffect(() => {
    if (externalFilter) {
      setSelectedCategory(externalFilter);
    }
  }, [externalFilter]);

  const handleCategoryChange = (val) => {
    setSelectedCategory(val);
    setIsFilterOpen(false);
    if (setExternalFilter) setExternalFilter(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-gray-900 text-white rounded-lg">Retry</button>
    </div>
  );

  const currentCategoryObj = categories.find(cat => cat.id === selectedCategory) || categories[0];

  return (
    <div id="products" className="py-16 md:py-24 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight uppercase">
            {selectedCategory?.replace('-', ' ') || 'Our Collection'}
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex-1 max-w-xs h-px bg-gradient-to-r from-transparent to-gray-400"></div>
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
            <div className="flex-1 max-w-xs h-px bg-gradient-to-l from-transparent to-gray-400"></div>
          </div>

        </div>

        {/* Search Bar and Filter */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-100 rounded-2xl bg-white/50 backdrop-blur-sm focus:outline-none focus:border-gray-900 transition-all h-[56px]"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-[56px] h-[56px] flex items-center justify-center border-2 border-gray-100 rounded-2xl bg-white/50 backdrop-blur-sm hover:border-gray-900 transition-all shrink-0"
            >
              <FiFilter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts
              .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
              .map((product, index) => (
                <div
                  key={index}
                  onClick={() => product.stock && setSelectedProduct(product)}
                  className={`group bg-[#faf7f2]/80 backdrop-blur-xl rounded-md overflow-hidden border border-[#e5e1da] shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col cursor-pointer ${!product.stock ? 'opacity-75 grayscale-[0.5]' : ''}`}
                >
                  <div className="relative aspect-square m-3 rounded-md overflow-hidden bg-white flex items-center justify-center">
                    {product.image1 ? (
                      <img src={product.image1} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                    {product.free_delivery && (
                      <div className="absolute top-2 right-2 bg-gray-900 text-white text-[8px] px-2 py-1 rounded-full uppercase font-bold tracking-widest">Free Delivery</div>
                    )}
                    {!product.stock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-black px-4 py-2 font-black text-[10px] uppercase tracking-[0.2em] rounded-sm">Sold Out</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest mb-1">{product.category?.replace('-', ' ')}</span>
                    <h3 className="text-sm font-black text-gray-900 mb-4 line-clamp-1">{product.title}</h3>

                    <div className="mt-auto pt-4 border-t border-gray-200 text-right">
                      
                      <div className="flex items-baseline justify-end gap-2">
                        {product.original_price && product.original_price > product.price && (
                          <p className="text-sm text-gray-400 line-through font-medium opacity-60">₹{product.original_price}</p>
                        )}
                        <p className="text-xl font-black text-gray-900">₹{product.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Pagination */}
        {Math.ceil(filteredProducts.length / productsPerPage) > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} className="w-12 h-12 border-2 border-gray-200 rounded-lg flex items-center justify-center disabled:opacity-30"><FiChevronLeft size={24} /></button>
            <div className="px-6 h-12 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center font-bold">{currentPage} / {Math.ceil(filteredProducts.length / productsPerPage)}</div>
            <button onClick={() => handlePageChange(Math.min(currentPage + 1, Math.ceil(filteredProducts.length / productsPerPage)))} disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)} className="w-12 h-12 border-2 border-gray-200 rounded-lg flex items-center justify-center disabled:opacity-30"><FiChevronRight size={24} /></button>
          </div>
        )}

        <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            />

            {/* Popup Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            >
              <div className="relative bg-white rounded-2xl border border-[#e5e1da] shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Header */}
                <div className="p-4 sm:p-6 pb-2 sm:pb-4 border-b border-[#e5e1da]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Select Quality</h3>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                </div>

                {/* Options */}
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {categories.map((category) => (
                    <button
                      key={category.label}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 group ${selectedCategory === category.id
                        ? 'border-[#c5bbae] bg-[#faf7f2] shadow-inner'
                        : 'border-[#e5e1da] hover:border-[#c5bbae] hover:bg-[#faf7f2]'
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <h4 className="font-bold text-gray-900 text-md">{category.label}</h4>
                            {selectedCategory === category.id && (
                              <div className="bg-[#c5bbae] rounded-full p-1 shadow-lg">
                                <FiCheck className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 sm:pt-1 bg-gray-50 invisible sm:visible" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
