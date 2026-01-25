import React from 'react';
import { FiTruck, FiCpu } from 'react-icons/fi';
import { RiBrushAiFill } from "react-icons/ri";

const About = () => {
    const features = [
        {
            title: "Premium Quality",
            description: "Crafted with the finest moisture-wicking fabrics for maximum comfort and peak performance.",
            icon: <FiCpu className="w-8 h-8 text-gray-900" />,
        },
        {
            title: "Authentic Designs",
            description: "Unique collections inspired by Kerala's rich heritage and vibrant sports culture.",
            icon: <RiBrushAiFill className="w-8 h-8 text-gray-900" />,
        },
        {
            title: "Free Delivery",
            description: "Fast and free shipping across Kerala on all orders with extra-care secure packaging.",
            icon: <FiTruck className="w-8 h-8 text-gray-900" />,
        }
    ];

    return (
        <section id="about" className="py-20 px-4 mt-0 md:mt-20">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 bg-[#faf7f2]/80 backdrop-blur-md border border-[#e5e1da] rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-[#fffcf7] rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-snug">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed font-light">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
