import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiX, FiCheck, FiUploadCloud, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Authentication State
    const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isAdminLoggedIn') === 'true');
    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const envUser = import.meta.env.VITE_ADMIN_USER;
        const envPass = import.meta.env.VITE_ADMIN_PASS;

        if (adminUser === envUser && adminPass === envPass) {
            setIsLoggedIn(true);
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            setLoginError('');
        } else {
            setLoginError('Invalid credentials. Please try again.');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        sessionStorage.removeItem('isAdminLoggedIn');
    };

    // Filtering state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;
    const adminRef = useRef(null);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        // Direct scroll to top of window for Admin panel
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'top-quality',
        sub_category: '',
        price: '',
        original_price: '',
        stock: true,
        stock_left: '',
        free_delivery: false,
        available_sizes: ['S', 'M', 'L', 'XL'],
        image1: '',
        image2: '',
        image3: ''
    });

    const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/products/`);
            if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
            const data = await response.json();
            console.log('Fetched products:', data);
            setProducts(data);
            setFilteredProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Could not connect to backend. Please check if it is running.');
        } finally {
            setLoading(false);
        }
    };

    // Handle search and category filter
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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setProducts(products.filter(p => (p.$id || p.id) !== id));
            }
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title || '',
            description: product.description || '',
            category: product.category || 'top-quality',
            sub_category: product.sub_category || '',
            price: product.price || '',
            original_price: product.original_price || '',
            stock: product.stock !== undefined ? product.stock : true,
            stock_left: product.stock_left !== null ? product.stock_left : '',
            free_delivery: product.free_delivery || false,
            available_sizes: product.available_sizes || ['S', 'M', 'L', 'XL'],
            image1: product.image1 || '',
            image2: product.image2 || '',
            image3: product.image3 || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'top-quality',
            sub_category: '',
            price: '',
            original_price: '',
            stock: true,
            stock_left: '',
            free_delivery: false,
            available_sizes: ['S', 'M', 'L', 'XL'],
            image1: '',
            image2: '',
            image3: ''
        });
        setEditingProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            original_price: formData.original_price ? parseFloat(formData.original_price) : null,
            stock_left: formData.stock ? parseInt(formData.stock_left) : null,
        };

        try {
            const id = editingProduct?.$id || editingProduct?.id;
            const url = editingProduct
                ? `${API_URL}/products/${id}`
                : `${API_URL}/products/`;

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setShowModal(false);
                resetForm();
                fetchProducts();
            } else {
                const error = await response.json();
                alert(`Error: ${JSON.stringify(error.detail)}`);
            }
        } catch (err) {
            console.error('Error saving product:', err);
            alert('Failed to save product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSizeToggle = (size) => {
        const updatedSizes = formData.available_sizes.includes(size)
            ? formData.available_sizes.filter(s => s !== size)
            : [...formData.available_sizes, size];
        setFormData({ ...formData, available_sizes: updatedSizes });
    };

    const handleImageUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log(`Starting upload for ${fieldName}:`, file.name);

        const originalValue = formData[fieldName];
        setFormData(prev => ({ ...prev, [fieldName]: 'Uploading...' }));
        setIsSubmitting(true);

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/products/upload-image`, {
                method: 'POST',
                body: uploadData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Upload success:', data.url);
                setFormData(prev => ({ ...prev, [fieldName]: data.url }));
            } else {
                console.error('Upload fail status:', response.status);
                alert('Upload failed. Please check backend logs.');
                setFormData(prev => ({ ...prev, [fieldName]: originalValue }));
            }
        } catch (err) {
            console.error('Upload Error:', err);
            alert('Network error during upload');
            setFormData(prev => ({ ...prev, [fieldName]: originalValue }));
        } finally {
            setIsSubmitting(false);
            e.target.value = '';
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-[#e5e1da]"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">
                            ADMIN<span className="text-[#c5bbae]">LOGIN</span>
                        </h1>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">
                            Secure Access Required
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Username</label>
                            <input
                                required
                                type="text"
                                value={adminUser}
                                onChange={(e) => setAdminUser(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-gray-900 focus:ring-0 outline-none transition-all placeholder:text-gray-300"
                                placeholder="Enter username"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                            <input
                                required
                                type="password"
                                value={adminPass}
                                onChange={(e) => setAdminPass(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-gray-900 focus:ring-0 outline-none transition-all placeholder:text-gray-300"
                                placeholder="••••••••"
                            />
                        </div>

                        {loginError && (
                            <p className="text-red-500 text-xs font-bold text-center">
                                {loginError}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg active:scale-[0.98]"
                        >
                            Authorize
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div ref={adminRef} className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-row justify-between items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">
                            ADMIN<span className="text-[#c5bbae]">PANEL</span>
                        </h1>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">
                            Manage your products
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLogout}
                            className="text-gray-400 hover:text-red-600 transition-colors p-2"
                            title="Logout"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="flex items-center justify-center bg-gray-900 text-white px-2 py-2 rounded-md font-bold hover:bg-black transition-all shadow-lg shadow-gray-900/20 active:scale-95 shrink-0"
                        >
                            <FiPlus className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Search Bar and Filter */}
                <div className="mb-10">
                    <div className="flex flex-row gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-5 py-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-all duration-200 shadow-sm"
                            />
                            <svg
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

                        <div className="relative">
                            <select
                                value={selectedCategory || ''}
                                onChange={(e) => setSelectedCategory(e.target.value || null)}
                                className="w-12 h-full pl-3 pr-2 border border-gray-200 rounded-md bg-white text-gray-900 focus:outline-none focus:border-gray-900 transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300 shadow-sm"
                                style={{ textIndent: '-9999px' }}
                            >
                                <option value="">All Categories</option>
                                <option value="top-quality">Top Quality</option>
                                <option value="standard-quality">Standard Quality</option>
                            </select>
                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-8 rounded-md border border-red-100 text-center">
                        <p className="text-red-600 font-bold mb-4">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="bg-red-600 text-white px-6 py-2 rounded-md font-bold hover:bg-red-700 transition-all"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white rounded-md shadow-xl overflow-hidden border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredProducts
                                            .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                                            .map((product) => (
                                                <tr key={product.$id || product.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <img
                                                                src={product.image1}
                                                                alt={product.title}
                                                                className="w-12 h-12 rounded-md object-cover bg-gray-100 border border-gray-100"
                                                            />
                                                            <div>
                                                                <div className="font-bold text-gray-900 line-clamp-1">{product.title}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
                                                            {product.sub_category || product.category?.replace('-', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-900 text-sm">₹{product.price}</span>
                                                            {product.original_price && product.original_price > product.price && (
                                                                <span className="text-[10px] text-gray-400 line-through">₹{product.original_price}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {product.stock ? (
                                                            <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
                                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                                {product.stock_left} Left
                                                            </div>
                                                        ) : (
                                                            <span className="text-red-500 text-xs font-bold">Out of Stock</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEdit(product)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                            >
                                                                <FiEdit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(product.$id || product.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                            >
                                                                <FiTrash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="grid grid-cols-1 gap-6 md:hidden">
                            {filteredProducts
                                .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                                .map((product) => (
                                    <div key={product.$id || product.id} className="bg-white p-6 rounded-md shadow-lg border border-gray-100 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={product.image1}
                                                alt={product.title}
                                                className="w-20 h-20 rounded-md object-cover bg-gray-100 border border-gray-50"
                                            />
                                            <div className="flex-1">
                                                <div className="text-xs font-bold uppercase tracking-wider text-yellow-600 mb-1">
                                                    {product.sub_category || product.category?.replace('-', ' ')}
                                                </div>
                                                <h3 className="font-black text-gray-900 leading-tight">{product.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="text-lg font-black text-gray-900">₹{product.price}</div>
                                                    {product.original_price && product.original_price > product.price && (
                                                        <div className="text-sm text-gray-400 line-through opacity-60">₹{product.original_price}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stock Status</div>
                                            {product.stock ? (
                                                <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                    {product.stock_left} Units Left
                                                </div>
                                            ) : (
                                                <span className="text-red-500 text-xs font-bold uppercase tracking-widest">Out of Stock</span>
                                            )}
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-md font-bold"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.$id || product.id)}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-md font-bold"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Pagination */}
                        {Math.ceil(filteredProducts.length / productsPerPage) > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-4">
                                <button
                                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 bg-white"
                                >
                                    <FiChevronLeft size={20} />
                                </button>

                                <div className="px-5 h-12 bg-white border border-gray-200 rounded-md flex items-center justify-center shadow-sm min-w-[120px]">
                                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest whitespace-nowrap">
                                        Page {currentPage} <span className="text-gray-300 mx-2">/</span> {Math.ceil(filteredProducts.length / productsPerPage)}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handlePageChange(Math.min(currentPage + 1, Math.ceil(filteredProducts.length / productsPerPage)))}
                                    disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                                    className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 bg-white"
                                >
                                    <FiChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                if (!isSubmitting) setShowModal(false);
                            }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-md shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-4 sm:p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                                    </h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        disabled={isSubmitting}
                                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                    >
                                        <FiX className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                                                placeholder="Premium Kerala Jersey"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price (₹)</label>
                                            <input
                                                required
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                                                placeholder="799"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Original Price (₹)</label>
                                            <input
                                                type="number"
                                                value={formData.original_price}
                                                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                                                placeholder="1299"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                                        <textarea
                                            required
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                                            placeholder="Product features and details..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        category: val,
                                                        sub_category: val === 'top-quality' ? formData.sub_category : ''
                                                    });
                                                }}
                                                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all appearance-none bg-white"
                                            >
                                                <option value="top-quality">Top Quality</option>
                                                <option value="standard-quality">Standard Quality</option>
                                            </select>
                                        </div>
                                        {formData.category === 'top-quality' && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sub Category</label>
                                                <select
                                                    value={formData.sub_category}
                                                    onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all appearance-none bg-white"
                                                >
                                                    <option value="">None</option>
                                                    <option value="first quality">First Quality</option>
                                                    <option value="master quality">Master Quality</option>
                                                    <option value="player version">Player Version</option>
                                                    <option value="authentic retro">Authentic Retro</option>
                                                </select>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stock Left</label>
                                            <input
                                                required={formData.stock}
                                                type="number"
                                                value={formData.stock_left}
                                                onChange={(e) => setFormData({ ...formData, stock_left: e.target.value })}
                                                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                                                placeholder="50"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, stock: !formData.stock })}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.stock ? 'bg-gray-900 border-gray-900' : 'border-gray-200'}`}>
                                                {formData.stock && <FiCheck className="text-white w-4 h-4" />}
                                            </div>
                                            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">In Stock</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, free_delivery: !formData.free_delivery })}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.free_delivery ? 'bg-gray-900 border-gray-900' : 'border-gray-200'}`}>
                                                {formData.free_delivery && <FiCheck className="text-white w-4 h-4" />}
                                            </div>
                                            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Free Delivery</span>
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Sizes</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() => handleSizeToggle(size)}
                                                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all border-2 ${formData.available_sizes.includes(size) ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-4 border-t border-gray-100">
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <FiImage className="w-4 h-4" /> Product Images
                                        </h3>
                                        {[1, 2, 3].map((num) => (
                                            <div key={`img-upload-box-${num}`} className="bg-gray-50/50 p-4 rounded-md border border-gray-100">
                                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                                    {/* Better Preview Area */}
                                                    <div className="relative w-20 h-20 bg-white rounded-md border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0 group mx-auto sm:mx-0">
                                                        {formData[`image${num}`] && formData[`image${num}`] !== 'Uploading...' ? (
                                                            <img src={formData[`image${num}`]} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="text-gray-300">
                                                                {formData[`image${num}`] === 'Uploading...' ? (
                                                                    <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                                                ) : (
                                                                    <FiImage className="w-8 h-8" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 w-full space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                                Slot {num} {num === 1 && <span className="text-blue-500">* (Cover Image)</span>}
                                                            </label>
                                                            {formData[`image${num}`] && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setFormData({ ...formData, [`image${num}`]: '' })}
                                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                                >
                                                                    <FiTrash2 className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={formData[`image${num}`] === 'Uploading...' ? '' : formData[`image${num}`]}
                                                                onChange={(e) => setFormData({ ...formData, [`image${num}`]: e.target.value })}
                                                                className="flex-1 min-w-0 px-4 py-2.5 text-sm rounded-md border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all placeholder:text-gray-300 bg-white"
                                                                placeholder="Paste URL..."
                                                                disabled={formData[`image${num}`] === 'Uploading...'}
                                                            />

                                                            <label
                                                                className={`w-11 h-11 flex items-center justify-center rounded-md cursor-pointer transition-all active:scale-90 shrink-0 ${formData[`image${num}`] === 'Uploading...' ? 'bg-gray-100 text-gray-400 cursor-wait' : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-900/20'}`}
                                                            >
                                                                <FiUploadCloud className="w-5 h-5" />
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={(e) => handleImageUpload(e, `image${num}`)}
                                                                    disabled={isSubmitting}
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8">
                                        <button
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="w-full bg-gray-900 text-white py-4 rounded-md font-black uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50 shadow-xl shadow-gray-900/30 active:scale-[0.98] flex items-center justify-center gap-3"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Updating...
                                                </>
                                            ) : (
                                                editingProduct ? 'Update Product' : 'Create Product'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Admin;
