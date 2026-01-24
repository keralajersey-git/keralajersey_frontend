import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdDoubleArrow } from "react-icons/md";
import { FiBookOpen, FiStar } from "react-icons/fi";

const Hero = () => {
  const images = [
    "https://i.pinimg.com/736x/22/ca/c2/22cac27c6f4409796291a1c119e125e3.jpg",
    "https://i.pinimg.com/736x/93/76/09/9376093a29a5b68f9a7beb9cf599a90e.jpg",
    "https://i.pinimg.com/736x/4c/0f/2f/4c0f2fd86b79c7da4e3324b5f1e9610e.jpg",
    "https://i.pinimg.com/736x/33/b7/66/33b7667b00c3533b7aa257934dfe8750.jpg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative min-h-[80vh] flex items-center pt-0 lg:pt-20 px-0 lg:px-4 overflow-hidden bg-white text-[#111827]">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-center">

        {/* Right Side: Re-ordered (First on Mobile) */}
        <div className="relative h-fit lg:h-[550px] flex items-center justify-center mt-0 lg:mt-0 order-1 lg:order-2">

          {/* MOBILE ONLY: Automatic Carousel - Full Width, No Padding, No Rounded Corners */}
          <div className="lg:hidden relative w-full aspect-square bg-gray-50 overflow-hidden">
            <AnimatePresence mode='wait'>
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-[#c5bbae]' : 'w-2 bg-white/50'
                    }`}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
          </div>

          {/* DESKTOP ONLY: Grid Layout Bento */}
          <div className="hidden lg:grid grid-cols-2 gap-4 h-[500px] w-full max-w-2xl">

            {/* PREMIUM Button - Desktop */}
            <div className="group relative overflow-hidden rounded-2xl border border-[#e5e1da] bg-[#faf7f2]/80 p-5 backdrop-blur-xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c5bbae]/5 via-transparent to-[#c5bbae]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-600 to-[#c5bbae] animate-pulse" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">elite quality</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-2xl uppercase tracking-tight mb-2 flex items-center gap-4">
                    <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                      PREMIUM
                    </span>
                    <span className="text-gray-900">
                      <MdDoubleArrow className="w-8 h-8 transition-transform group-hover:translate-x-2 group-hover:scale-110" />
                    </span>
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono mb-4 uppercase tracking-tighter">
                    LIMITED EDITION & PLAYER CUTS
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-gray-400 font-mono">CRAFTED</span>
                    <span className="text-xs text-[#c5bbae] font-bold">GOLD TIER</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#e5e1da]/30 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-gray-900 to-[#c5bbae] rounded-full" />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[8px] text-gray-400 font-mono tracking-widest uppercase">LUXE FABRIC</span>
                    <span className="text-[8px] text-gray-400 font-mono">HAND STITCHED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Jersey - Right Column (Tall) */}
            <div className="group relative row-span-2 overflow-hidden rounded-2xl border border-[#e5e1da] bg-white shadow-xl">
              <img
                src={images[0]}
                alt="Authentic Kerala Jersey"
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-right">
                <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase italic">C U S T O M S</span>
              </div>
            </div>

            {/* Detail Jersey - Left Column (Tall) */}
            <div className="group relative row-span-2 overflow-hidden rounded-2xl border border-[#e5e1da] bg-[#faf7f2]">
              <img
                src={images[3]}
                alt="Jersey Detail"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase italic">S P O R T S</span>
              </div>
            </div>

            {/* REVIEWS Button - Desktop */}
            <div className="group relative overflow-hidden rounded-2xl border border-[#e5e1da] bg-[#faf7f2]/80 p-5 backdrop-blur-xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c5bbae]/5 via-transparent to-[#c5bbae]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiStar className="w-4 h-4 text-[#c5bbae] fill-[#c5bbae]" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">customer fam</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-2xl uppercase tracking-tight mb-2 flex items-center gap-4">
                    <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                      REVIEWS
                    </span>
                    <span className="text-gray-900">
                      <MdDoubleArrow className="w-8 h-8 transition-transform group-hover:translate-x-2 group-hover:scale-110" />
                    </span>
                  </h3>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter italic">AVG RATING</span>
                    <span className="text-xs text-[#c5bbae] font-bold">4.9 / 5.0</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#e5e1da]/30 overflow-hidden">
                    <div className="h-full w-[98%] bg-gradient-to-r from-gray-900 to-[#c5bbae] rounded-full" />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[8px] text-gray-400 font-mono tracking-widest uppercase italic font-bold">500+ FEEDBACKS</span>
                    <span className="text-[8px] text-gray-400 font-mono font-bold uppercase tracking-tighter">TRUSTED</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Decorative Glows */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#c5bbae]/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#c5bbae]/5 rounded-full blur-3xl -z-10"></div>
        </div>

        {/* Left Side: Content - Order 2 on Mobile */}
        <div className="relative z-10 text-left space-y-8 animate-in fade-in slide-in-from-left duration-1000 order-2 lg:order-1 px-6 lg:px-0 pb-20 lg:pb-0">
          <div className="inline-flex items-center space-x-2 bg-gray-900/5 backdrop-blur-sm border border-gray-900/10 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-800">
              2026 Collection
            </p>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-5xl lg:text-7xl font-black text-gray-900 leading-[0.9] tracking-tighter">
              WEAR THE <br />
              <span className="text-[#c5bbae]">
                SPIRIT.
              </span>
            </h1>
            <p className="max-w-lg text-lg text-gray-600 font-light leading-relaxed">
              Premium Kerala jerseys crafted with heritage, pulse, and peak performance fabric.
              Elevate your game and celebrate your roots in absolute style.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            
            <button className="px-10 py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-sm hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1">
              Collections
            </button>
          </div>
        </div>

      </div>

      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-yellow-100/5 rounded-full blur-[120px] -z-10"></div>
    </div>
  );
};

export default Hero;
