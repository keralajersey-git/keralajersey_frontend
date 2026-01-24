import React from 'react';
import { motion } from 'framer-motion';

const Marquee = () => {
    const words = Array(10).fill('Kerala JERSEY');

    return (
        <div className="relative py-6 md:py-8 mt-[-10px] md:mt-[80px] overflow-hidden bg-[#111827] border-y border-white/5 shadow-2xl -skew-y-6 md:-skew-y-3 my-12 md:my-14">
            <div className="flex whitespace-nowrap">
                <motion.div
                    className="flex flex-row"
                    animate={{ x: [0, -1500] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 20,
                            ease: "linear",
                        },
                    }}
                >
                    {words.map((word, idx) => (
                        <div key={idx} className="flex items-center mx-6 md:mx-10">
                            <h2 className="text-2xl md:text-6xl font-black text-white tracking-widest uppercase italic flex items-center gap-2 md:gap-4">
                                Kerala <span className="text-[#c5bbae]">Jersey</span>
                                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#c5bbae] rounded-full mx-2 md:mx-4 opacity-50"></span>
                            </h2>
                        </div>
                    ))}
                    {/* Duplicate for seamless looping */}
                    {words.map((word, idx) => (
                        <div key={`dup-${idx}`} className="flex items-center mx-6 md:mx-10">
                            <h2 className="text-2xl md:text-6xl font-black text-white tracking-widest uppercase italic flex items-center gap-2 md:gap-4">
                                Kerala <span className="text-[#c5bbae]">Jersey</span>
                                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#c5bbae] rounded-full mx-2 md:mx-4 opacity-50"></span>
                            </h2>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Marquee;
