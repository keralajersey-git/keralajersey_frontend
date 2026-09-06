import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Contact", href: "tel:+918848027778", type: "link" },
    { name: "Collections", href: "#products", type: "scroll" },
    { name: "Features", href: "#about", type: "scroll" },
    { name: "Reviews", href: "#testimonials", type: "scroll" },
  ];

  const handleNavClick = (e, link) => {
    if (link.type === "link") {
      // Let the default behavior handle tel: links
      setMobileMenuOpen(false);
      return;
    }

    e.preventDefault();
    const targetId = link.href.replace("#", "");
    if (targetId === "") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-transparent pt-2 pb-0 md:py-5 border-b border-transparent">
      <div className="max-w-7xl mx-auto px-3 md:px-6 flex items-center justify-end md:justify-between">
        {/* Logo - desktop only */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-black italic">
            KERALA<span className="text-[#c5bbae]">JERSEY</span>
          </span>
        </div>

        {/* Mobile pill - title + menu icon, always off-white */}
        <div className="md:hidden flex items-center justify-between gap-3 bg-[#f5f3ee] rounded-full pl-4 pr-1 py-1 shadow-md border border-[#e5e1da]">
          <span className="text-sm font-black tracking-tighter text-black italic whitespace-nowrap">
            KERALA<span className="text-[#c5bbae]">JERSEY</span>
          </span>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-black text-[#f5f3ee]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={14} /> : <HiOutlineMenuAlt3 size={14} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="text-base font-bold text-gray-600 hover:text-gray-900 tracking-wide transition-colors"
              style={{ fontFamily: "'BuiltTitlingSB', sans-serif", letterSpacing: "0.12em" }}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* WhatsApp Link */}
        <div className="hidden md:block">
          <a
            href="https://wa.me/919747140487"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-gray-900 text-[#25D366] px-5 py-2.5 rounded-full hover:bg-black transition-all duration-300 shadow-xl border border-white/10 group"
          >
            <FaWhatsapp
              size={18}
              className="text-white group-hover:scale-110 transition-transform duration-300"
            />
            <span
              className="text-xs font-black uppercase tracking-widest text-white"
              style={{ fontFamily: "'BuiltTitlingSB', sans-serif", letterSpacing: "0.12em" }}
            >
              WhatsApp
            </span>
          </a>
        </div>

      </div>

      {/* Mobile Menu Overlay - SLIDER FROM LEFT */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] md:hidden"
            />

            {/* Sidebar Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[75%] max-w-sm bg-white z-[120] shadow-2xl p-8 flex flex-col gap-8 md:hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-black tracking-tighter text-gray-900 italic">
                  KERALA<span className="text-[#c5bbae]">JERSEY</span>
                </span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <FiX size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className="text-2xl font-bold text-gray-900 py-2 border-b border-gray-100 flex items-center justify-between group"
                    style={{ fontFamily: "'BuiltTitlingSB', sans-serif", letterSpacing: "0.12em" }}
                  >
                    <span style={{ fontFamily: "'BuiltTitlingSB', sans-serif", letterSpacing: "0.12em" }}>
                      {link.name}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-[#c5bbae] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>

              <div className="mt-auto">
                <a
                  href="https://wa.me/919747140487"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-gray-900 text-white font-black uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-3 hover:bg-black transition-all"
                  style={{ fontFamily: "'BuiltTitlingSB', sans-serif", letterSpacing: "0.12em" }}
                >
                  <FaWhatsapp size={20} className="text-[#25D366]" />
                  <span style={{ fontFamily: "'BuiltTitlingSB', sans-serif", letterSpacing: "0.12em" }}>
                    WhatsApp Us
                  </span>
                </a>
                <p
                  className="text-xs text-gray-400 text-center mt-6 uppercase tracking-widest font-bold"
                  style={{ fontFamily: "'BuiltTitlingSB', sans-serif", letterSpacing: "0.12em" }}
                >
                  © 2026 Kerala Jersey
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
