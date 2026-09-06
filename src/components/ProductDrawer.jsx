import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdPushPin } from "react-icons/md";

const ProductDrawer = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("drawer-open");
    } else {
      document.body.classList.remove("drawer-open");
    }
    return () => document.body.classList.remove("drawer-open");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    if (window.history.state?.drawerOpen !== true) {
      window.history.pushState({ drawerOpen: true }, "");
    }

    const handlePopState = () => {
      handleClose();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
      if (window.history.state?.drawerOpen === true) {
        window.history.back();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setSelectedSize(null);
    setSizeError(false);
  }, [product]);

  const images = product
    ? [product.image1, product.image2, product.image3].filter(Boolean)
    : [];

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleWhatsAppClick = () => {
    if (
      product.available_sizes &&
      product.available_sizes.length > 0 &&
      !selectedSize
    ) {
      setSizeError(true);
      return;
    }

    setSizeError(false);
    const sizeText = selectedSize ? ` (Size: ${selectedSize})` : "";
    const message = `Hi, I'm interested in the ${product.title}${sizeText}. Price: ₹${product.price.toFixed(0)}. Can you provide more details?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918848027778?text=${encodedMessage}`, "_blank");
  };

  const handleClose = () => {
    setSelectedSize(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          <style>{`
            body.drawer-open {
              overflow: hidden;
            }
            body.drawer-open .floating-actions-container {
              opacity: 0;
              pointer-events: none;
              transform: translateX(20px);
              transition: all 0.3s ease;
            }
            .drawer-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .drawer-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 z-[10002] h-full w-full sm:w-[460px] md:w-[500px] lg:w-[540px] bg-[#faf9f6] shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-gray-700">Product Details</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto drawer-scrollbar">
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden shrink-0">
                <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden">
                  {images.length > 0 ? (
                    <>
                      <motion.img
                        key={currentImageIndex}
                        drag={images.length > 1 ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragStart={() => setIsDragging(true)}
                        onDrag={(e, info) => setDragX(info.offset.x)}
                        onDragEnd={(e, info) => {
                          setIsDragging(false);
                          setDragX(0);
                          const threshold = 80;
                          if (info.offset.x < -threshold) {
                            goToNextImage();
                          } else if (info.offset.x > threshold) {
                            goToPrevImage();
                          }
                        }}
                        initial={{ opacity: 0, x: 0 }}
                        animate={{
                          opacity: 1,
                          x: isDragging ? dragX : 0,
                          scale: isDragging ? 0.96 : 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        src={images[currentImageIndex]}
                        alt={`${product.title} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain touch-pan-y select-none"
                        style={{ cursor: images.length > 1 ? "grab" : "default" }}
                      />

                      {images.length > 1 && isDragging && (
                        <div
                          className="absolute inset-0 pointer-events-none transition-opacity"
                          style={{
                            background:
                              dragX < 0
                                ? `linear-gradient(to right, transparent ${50 + Math.min(Math.abs(dragX) / 3, 30)}%, rgba(0,0,0,${Math.min(Math.abs(dragX) / 400, 0.15)}))`
                                : `linear-gradient(to left, transparent ${50 + Math.min(dragX / 3, 30)}%, rgba(0,0,0,${Math.min(dragX / 400, 0.15)}))`,
                          }}
                        />
                      )}

                      {images.length > 1 && isDragging && Math.abs(dragX) > 80 && (
                        <div className={`absolute top-1/2 -translate-y-1/2 z-20 ${dragX < 0 ? "right-6" : "left-6"}`}>
                          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white">
                            <svg
                              className={`w-6 h-6 ${dragX < 0 ? "" : "rotate-180"}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
                      <div className="absolute inset-0 border-8 border-transparent pointer-events-none"></div>

                      {images.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      )}

                      {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                          {images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`h-2 rounded-full transition-all duration-300 backdrop-blur-sm ${
                                idx === currentImageIndex
                                  ? "w-8 bg-white shadow-lg"
                                  : "w-2 bg-white/50 hover:bg-white/80"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center aspect-[4/3]">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gray-300 rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-500 text-sm font-medium">
                          No image available
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price + Navigation Controls Row */}
                <div className="flex items-center justify-between px-5 py-4 bg-white/60 backdrop-blur-md border-t border-gray-200/50">
                  {/* Price (Left side) */}
                  <div className="flex items-baseline gap-3 font-sans">
                    <span
                      className="text-2xl sm:text-3xl font-semibold text-black"
                      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", letterSpacing: "0em" }}
                    >
                      ₹{product.price.toFixed(0)}
                    </span>
                    {product.original_price &&
                      product.original_price > product.price && (
                        <span
                          className="text-base sm:text-lg font-medium text-gray-400 line-through"
                          style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
                        >
                          ₹{product.original_price.toFixed(0)}
                        </span>
                      )}
                  </div>

                  {/* Prev / Next Arrows (Right side) */}
                  {images.length > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={goToPrevImage}
                        className="bg-white hover:bg-gray-50 border border-gray-200 p-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        <svg
                          className="w-5 h-5 text-black"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={goToNextImage}
                        className="bg-white hover:bg-gray-50 border border-gray-200 p-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        <svg
                          className="w-5 h-5 text-black"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="mb-5">
                  <h1 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">
                    {product.title}
                  </h1>
                </div>

                <div className="flex flex-col gap-2 mb-6">
                  {product.stock && (
                    <div className="self-start flex items-center gap-2 flex-wrap">
                      <div className="px-3 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-semibold flex items-center">
                        {product.stock_left} in stock
                      </div>
                      {product.pinned && (
                        <div className="px-3 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-sm font-semibold flex items-center gap-1.5">
                          <MdPushPin className="w-4 h-4 rotate-45" />
                          Pinned
                        </div>
                      )}
                    </div>
                  )}
                  {product.free_delivery && (
                    <div className="px-3 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl text-sm font-semibold border border-green-200">
                      🚚 Free Delivery Available
                    </div>
                  )}
                </div>

                <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 mb-6"></div>

                {product.description && (
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Description
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {product.description}
                    </p>
                  </div>
                )}

                {product.available_sizes &&
                  product.available_sizes.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">
                        Select Size
                      </h3>
                      <div className="grid grid-cols-5 gap-2">
                        {product.available_sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => {
                              setSelectedSize(
                                selectedSize === size ? null : size,
                              );
                              setSizeError(false);
                            }}
                            className={`py-2.5 rounded-lg font-bold text-sm transition-all duration-300 border-2 ${
                              selectedSize === size
                                ? "border-black bg-black text-white shadow-lg shadow-black/30 scale-105"
                                : "border-gray-300 text-gray-700 hover:border-gray-900 bg-white hover:bg-gray-50"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      <AnimatePresence>
                        {sizeError && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-xs font-bold mt-3 animate-pulse"
                          >
                            ⚠️ Please select a size before ordering
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
              </div>
            </div>

            <div className="border-t border-gray-100 p-6 bg-[#faf9f6] shrink-0">
              <button
                onClick={handleWhatsAppClick}
                className="w-full py-3.5 bg-gradient-to-r from-gray-900 to-black text-white font-bold text-base rounded-sm hover:shadow-xl hover:shadow-black/40 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:from-black hover:to-gray-900 uppercase font-built"
                style={{ fontFamily: "'BuiltTitlingSB', sans-serif" }}
              >
                <img
                  src="/whatsapp.svg"
                  alt="WhatsApp"
                  className="w-5 h-5"
                />
                Order Now
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDrawer;
