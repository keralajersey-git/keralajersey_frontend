import React from 'react';

const Hero = () => {
  return (
    <div className=" flex items-center justify-center px-4 bg-transparent">
      <div className="max-w-3xl mx-auto text-center">
        
        {/* Kerala Jersey Text Badge */}
        <div className="mb-8 mt-20">
          <p className="text-md text-gray-700 bg-gray-100/20 px-4 py-2 rounded-full inline-block shadow-sm">
            Kerala Jersey
          </p>
        </div>

        {/* Main heading - clean and bold */}
        <h1 className="text-3xl md:text-6xl text-gray-900 tracking-tight mb-4">
          Wear Your Spirit
        </h1>
        
        {/* Simple divider */}
        <div className="w-24 h-0.5 bg-gray-800 mx-auto mb-6"></div>

        {/* Subheading */}
        <h2 className="text-md md:text-3xl text-gray-700 font-light mb-8">
          Kerala's Spirit, Crafted in Every Thread
        </h2>

        {/* Description - clean and readable */}
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Premium jerseys that blend traditional Kerala heritage with modern design. 
            Each piece is thoughtfully crafted for those who carry their roots with pride.
          </p>
          <p className="text-gray-500 italic">
            Breathable fabrics • Sustainable materials • Timeless designs
          </p>
        </div>

        {/* Clean action buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-gray-900 text-white font-medium rounded-sm hover:bg-gray-800 transition-colors duration-200">
            Shop Collection
          </button>
          <button className="px-8 py-3 border-2 border-gray-800 text-gray-800 font-medium rounded-sm hover:bg-gray-50 transition-colors duration-200">
            Premiums
          </button>
        </div>


      </div>
    </div>
  );
};

export default Hero;
