import React, { useState, useEffect } from 'react';

const ProductModal = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // Get available images
  const images = [product.image1, product.image2, product.image3].filter(Boolean);

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Hide scrollbar while keeping scroll functionality
  const scrollbarStyles = `
    .modal-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .modal-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .modal-content {
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .image-transition {
      animation: fadeInImage 0.3s ease-in-out;
    }
    @keyframes fadeInImage {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    body.modal-open .floating-actions-container {
      opacity: 0;
      pointer-events: none;
      transform: translateX(20px);
      transition: all 0.3s ease;
    }
  `;

  const handleWhatsAppClick = () => {
    const sizeText = selectedSize ? ` (Size: ${selectedSize})` : '';
    const message = `Hi, I'm interested in the ${product.title}${sizeText}. Price: ₹${product.price.toFixed(0)}. Can you provide more details?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919747140487?text=${encodedMessage}`, '_blank');
  };

  const handleClose = () => {
    setSelectedSize(null);
    onClose();
  };

  return (
    <>
      <style>{scrollbarStyles}</style>

      {/* Desktop Modal */}
      <div className="hidden md:flex fixed inset-0 z-[10001] items-center justify-center bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md p-4">
        <div className="modal-content bg-white rounded-xl overflow-hidden shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto modal-scrollbar">
          <div className="grid grid-cols-5 gap-0">
            {/* Image Section - Wider */}
            <div className="col-span-3 bg-gradient-to-br from-gray-50 to-gray-100 sticky top-0">
              <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
                {images.length > 0 ? (
                  <>
                    <img
                      key={currentImageIndex}
                      src={images[currentImageIndex]}
                      alt={`${product.title} - Image ${currentImageIndex + 1}`}
                      className="image-transition w-full h-full object-cover"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={goToPrevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                        >
                          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={goToNextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                        >
                          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    )}

                    {/* Image Indicators */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 backdrop-blur-sm ${idx === currentImageIndex
                              ? 'w-8 bg-white shadow-lg'
                              : 'w-2 bg-white/50 hover:bg-white/80'
                              }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-500 text-sm font-medium">No image available</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="col-span-2 bg-white flex flex-col h-[600px] border-l border-gray-100">
              {/* Close Button */}
              <div className="flex justify-end p-5 border-b border-gray-100">
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto modal-scrollbar px-6 py-6">
                {/* Title & Price */}
                <div className="mb-6">
                  <h1 className="text-2xl font-black text-gray-900 mb-3 leading-tight tracking-tight">
                    {product.title}
                  </h1>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-black">₹{product.price.toFixed(0)}</span>
                  </div>
                </div>

                {/* Stock & Delivery Badges */}
                <div className="flex flex-col gap-2 mb-6">
                  {product.stock && (
                    <div className="px-3 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                      {product.stock_left} in stock
                    </div>
                  )}
                  {product.free_delivery && (
                    <div className="px-3 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl text-sm font-semibold border border-green-200">
                      🚚 Free Delivery Available
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 mb-6"></div>

                {/* Description */}
                {product.description && (
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</h3>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Available Sizes */}
                {product.available_sizes && product.available_sizes.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Select Size</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {product.available_sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                          className={`py-2.5 rounded-lg font-bold text-sm transition-all duration-300 border-2 ${selectedSize === size
                            ? 'border-black bg-black text-white shadow-lg shadow-black/30 scale-105'
                            : 'border-gray-300 text-gray-700 hover:border-gray-900 bg-white hover:bg-gray-50'
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Button - Sticky Bottom */}
              <div className="border-t border-gray-100 p-6 bg-white">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full py-3.5 bg-gradient-to-r from-gray-900 to-black text-white font-bold text-base rounded-xl hover:shadow-xl hover:shadow-black/40 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:from-black hover:to-gray-900"
                >
                  <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5" />
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className="md:hidden fixed inset-0 z-[10001] bg-black/50 backdrop-blur-sm" onClick={handleClose}>
        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-4xl shadow-2xl max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom modal-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-5 pb-3">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end px-5 pb-2">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-5 pb-8">
            {/* Product Image Carousel */}
            <div className="mb-6 -mx-5 relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-b-3xl overflow-hidden">
              <div className="relative h-80 flex items-center justify-center">
                {images.length > 0 ? (
                  <>
                    <img
                      key={currentImageIndex}
                      src={images[currentImageIndex]}
                      alt={`${product.title} - Image ${currentImageIndex + 1}`}
                      className="image-transition w-full h-full object-cover"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={goToPrevImage}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                        >
                          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={goToNextImage}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                        >
                          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    )}

                    {/* Image Indicators */}
                    {images.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 backdrop-blur-sm ${idx === currentImageIndex
                              ? 'w-6 bg-white shadow-lg'
                              : 'w-1.5 bg-white/50 hover:bg-white/80'
                              }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight tracking-tight">
                {product.title}
              </h2>

              {/* Price */}
              <div className="text-3xl font-black text-black mb-5">₹{product.price.toFixed(0)}</div>

              {/* Stock & Delivery */}
              <div className="flex flex-col gap-2 mb-6">
                {product.stock && (
                  <div className="px-3 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                    {product.stock_left} in stock
                  </div>
                )}
                {product.free_delivery && (
                  <div className="px-3 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl text-sm font-semibold border border-green-200">
                    🚚 Free Delivery
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 mb-5"></div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-600 leading-relaxed mb-5 whitespace-pre-wrap">
                  {product.description}
                </p>
              )}

              {/* Available Sizes */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.available_sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                        className={`flex-1 min-w-[60px] py-2.5 rounded-lg font-bold text-sm transition-all duration-300 border-2 ${selectedSize === size
                          ? 'border-black bg-black text-white shadow-lg shadow-black/30'
                          : 'border-gray-300 text-gray-700 hover:border-gray-900 bg-white hover:bg-gray-50'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <button
                onClick={handleWhatsAppClick}
                className="w-full py-3.5 bg-gradient-to-r from-gray-900 to-black text-white font-bold text-base rounded-xl hover:shadow-xl hover:shadow-black/40 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:from-black hover:to-gray-900 mb-2"
              >
                <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5" />
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
