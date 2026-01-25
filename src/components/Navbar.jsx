import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Contact', href: 'tel:9747140487', type: 'link' },
        { name: 'Collections', href: '#products', type: 'scroll' },
        { name: 'Features', href: '#about', type: 'scroll' },
        { name: 'Reviews', href: '#testimonials', type: 'scroll' },
    ];

    const handleNavClick = (e, link) => {
        if (link.type === 'link') {
            // Let the default behavior handle tel: links
            setMobileMenuOpen(false);
            return;
        }

        e.preventDefault();
        const targetId = link.href.replace('#', '');
        if (targetId === '') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const elem = document.getElementById(targetId);
            if (elem) {
                elem.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setMobileMenuOpen(false);
    };

    return (
        <nav
            className={`
                fixed top-0 left-0 right-0 z-[100] transition-all duration-500
                ${isScrolled
                    ? 'bg-white shadow-md py-3 border-b border-[#e5e1da]'
                    : 'bg-transparent py-5 border-b border-transparent'}
            `}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tighter text-black italic">
                        KERALA<span className="text-[#c5bbae]">JERSEY</span>
                    </span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link)}
                            className="text-sm font-bold text-gray-600 hover:text-gray-900 tracking-wide transition-colors"
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
                        <FaWhatsapp size={18} className="text-white group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-white">WhatsApp</span>
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-gray-900"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
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
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
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
                                        className="text-xl font-bold text-gray-900 py-2 border-b border-gray-100 flex items-center justify-between group"
                                    >
                                        <span>{link.name}</span>
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
                                >
                                    <FaWhatsapp size={20} className="text-[#25D366]" />
                                    <span>WhatsApp Us</span>
                                </a>
                                <p className="text-[10px] text-gray-400 text-center mt-6 uppercase tracking-widest font-bold">
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
