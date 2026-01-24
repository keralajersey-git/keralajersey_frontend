import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-[#e5e1da]/50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Footer Top Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">
              Kerala <span className="text-[#c5bbae]">Jersey</span>
            </h3>
            <p className="max-w-xs text-sm text-gray-500 font-light leading-relaxed">
              Premium Kerala jerseys crafted with heritage, pulse, and peak performance fabric.
              Elevate your game and celebrate your roots in absolute style.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Navigation</h4>
            <ul className="flex flex-col space-y-3">
              {['Shop Collection', 'Custom Design', 'About Us', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Connect</h4>
            <div className="space-y-3">
              <a href="mailto:info@keralajersey.com" className="text-sm text-gray-900 font-bold hover:text-[#c5bbae] transition-colors duration-300">
                info@keralajersey.com
              </a>
              <div className="space-y-1">
                <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium">Free shipping across Kerala</p>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest italic">Sustainable Production</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider & Bottom Section */}
        <div className="pt-8 border-t border-[#e5e1da] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center md:text-left">
            © {currentYear} Kerala Jersey. All rights reserved.
          </p>
          <div className="flex gap-8">
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] cursor-pointer hover:text-gray-600 transition-colors">Privacy Policy</span>
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] cursor-pointer hover:text-gray-600 transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
