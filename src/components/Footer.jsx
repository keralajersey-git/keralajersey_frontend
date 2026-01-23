import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent text-gray-black mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 md:mb-12">
          {/* Brand Section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-3">Kerala Jersey</h3>
            <p className="text-black text-sm font-light leading-relaxed">
              Premium jerseys celebrating Kerala's spirit and heritage through thoughtful design.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-base font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="#" className="text-black hover:text-white text-sm transition-colors duration-200">
                Shop Collection
              </a>
              <a href="#" className="text-black hover:text-white text-sm transition-colors duration-200">
                Custom Design
              </a>
              <a href="#" className="text-black hover:text-white text-sm transition-colors duration-200">
                About Us
              </a>
              <a href="#" className="text-black hover:text-white text-sm transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col">
            <h4 className="text-base font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-2 text-sm">
              <a href="mailto:info@keralajersey.com" className="text-black hover:text-white transition-colors duration-200">
                info@keralajersey.com
              </a>
              <p className="text-black">
                Free shipping across Kerala
              </p>
              <p className="text-black">
                Ethically produced & sustainable
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-black mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
          <p className="text-black text-sm font-light">
            © {currentYear} Kerala Jersey. All rights reserved.
          </p>
         
       
        </div>
      </div>
    </footer>
  );
};

export default Footer;
