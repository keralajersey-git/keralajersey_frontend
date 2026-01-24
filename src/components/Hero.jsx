import React from 'react';
import homeJersey from '../assets/hero/home_jersey.png';
import awayJersey from '../assets/hero/fourthjersey.png';
import thirdJersey from '../assets/hero/third_jersey.png';

const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center pt-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Side: Content */}
        <div className="relative z-10 text-left space-y-8 animate-in fade-in slide-in-from-left duration-1000">
          <div className="inline-flex items-center space-x-2 bg-gray-900/5 backdrop-blur-sm border border-gray-900/10 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-800">
              New Season 2024 Collection
            </p>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-5xl lg:text-7xl font-black text-gray-900 leading-[0.9] tracking-tighter">
              WEAR THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">
                SPIRIT.
              </span>
            </h1>
            <p className="max-w-lg text-lg text-gray-600 font-light leading-relaxed">
              Premium Kerala jerseys crafted with heritage, pulse, and peak performance fabric.
              Elevate your game and celebrate your roots in absolute style.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-10 py-4 bg-gray-900 text-white font-bold rounded-md hover:bg-gray-800 hover:shadow-2xl hover:shadow-gray-900/20 transition-all duration-300 transform hover:-translate-y-1">
              Shop Collection
            </button>
            <button className="px-10 py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-md hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1">
              View Premiums
            </button>
          </div>


        </div>

        {/* Right Side: Floating Aesthetic Elements */}
        <div className="relative h-[350px] md:h-[400px] lg:h-[500px] flex items-center justify-center mt-2 lg:mt-0">
          {/* Main Floating Jersey */}
          <div className="relative z-10 w-48 sm:w-64 lg:w-full lg:max-w-xs animate-float">
            <div className="absolute inset-0 bg-yellow-400/20 blur-[60px] lg:blur-[80px] rounded-full scale-110"></div>
            <img
              src={homeJersey}
              alt="Kerala Home Jersey"
              className="relative w-full h-auto md:drop-shadow-[0_25px_25px_rgba(0,0,0,0.2)]"
            />
          </div>

          {/* Secondary Floating Elements */}
          <div className="absolute top-8 right-0 lg:top-5 lg:right-0 z-30 w-28 sm:w-40 lg:w-52 animate-float-delayed opacity-90 hover:opacity-100 transition-opacity duration-500">
            <img
              src={awayJersey}
              alt="Kerala Away Jersey"
              className="w-full h-auto grayscale-[0.1] hover:grayscale-0 transition-all duration-500"
            />
          </div>

          <div className="absolute bottom-8 left-0 lg:bottom-5 lg:left-0 z-20 w-24 sm:w-32 lg:w-44 animate-float-slow opacity-90 hover:opacity-100 transition-opacity duration-500">
            <img
              src={thirdJersey}
              alt="Kerala Third Jersey"
              className="w-full h-auto"
            />
          </div>

          {/* Decorative Elements - Hidden on mobile for less clutter */}
          <div className="hidden lg:block absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-500 rounded-full animate-ping opacity-20"></div>
          <div className="hidden lg:block absolute bottom-1/4 right-1/4 w-2 h-2 bg-gray-800 rounded-full animate-bounce opacity-10"></div>
          <div className="absolute top-1/2 right-1/4 lg:right-1/3 w-20 h-20 lg:w-24 lg:h-24 border border-gray-900/5 rounded-full animate-spin-slow"></div>
        </div>

      </div>

      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-yellow-100/30 rounded-full blur-[120px] -z-10"></div>
    </div>
  );
};

export default Hero;

