import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const teams = [
    { name: "Barcelona", img: "/teams/barcelona.svg" },
    { name: "KBFC", img: "/teams/kbfc.svg" },
    { name: "Manchester", img: "/teams/manchester.svg" },
    { name: "MCFC", img: "/teams/mcfc.svg" },
    { name: "NEU", img: "/teams/neu.svg" },
    { name: "PSG", img: "/teams/psg.svg" }
];

const LogoColumn = ({ set, delay }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % set.length);
        }, 4000 + delay);
        return () => clearInterval(timer);
    }, [set.length, delay]);

    return (
        <div className="relative h-[180px] w-full md:h-[250px] flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.img
                    key={set[index].img}
                    src={set[index].img}
                    alt={set[index].name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`${set[index].name === "Barcelona" ? "w-[40px] h-[40px] md:w-[105px] md:h-[105px]" : "w-[120px] h-[120px] md:w-[200px] md:h-[200px]"} object-contain cursor-pointer transition-all`}
                />
            </AnimatePresence>
        </div>
    );
};

const TeamCarousel = () => {
    // Distribute 6 teams into 3 columns of 2
    const columns = [
        [teams[0], teams[3]],
        [teams[1], teams[4]],
        [teams[2], teams[5]]
    ];

    return (
        <div className="w-full bg-transparent overflow-hidden ">
            <div className="max-w-4xl mx-auto px-4 ">

                {/* Top Picks Header */}
                <div className="flex items-center justify-center gap-6 mb-16">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-30"></div>
                    <div className="flex flex-col items-center">
                        
                        <h2 className="text-xl mb-[-100px] md:mb-[-50px] md:text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
                            Top <span className="text-[#c5bbae]">Picks</span> for you
                        </h2>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gray-200 to-transparent opacity-30"></div>
                </div>




                {/* 3 Columns in a row */}
                <div className="flex items-center justify-between gap-4 md:gap-12 mt-[-50px] md:mt-0">
                    {columns.map((set, i) => (
                        <React.Fragment key={i}>
                            <LogoColumn set={set} delay={i * 500} />
                            {/* Vertical divider between columns */}
                            {i < columns.length - 1 && (
                                <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-100 to-transparent"></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamCarousel;
