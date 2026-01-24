import React from 'react';
import { motion } from "framer-motion";

// --- Data ---
const testimonials = [
    {
        text: "The quality of the material is exceptional. Best jersey I've ever bought, perfect for the Kerala climate!",
        image: "https://i.pinimg.com/736x/8c/1b/3a/8c1b3a6d01a786d663680ce69ed14839.jpg",
        name: "Arjun Das",
        role: "Local League Player",
    },
    {
        text: "Absolutely love the authentic mural designs. It feels great to wear something that represents our heritage so beautifully.",
        image: "https://i.pinimg.com/736x/f4/c2/fe/f4c2fe0f23dc062a0e7db27e7a5adfe4.jpg",
        name: "Rahul Nair",
        role: "Vlogger & Fan",
    },
    {
        text: "Fast delivery and the fit is perfect. The size guide was spot on. Highly recommend Kerala Jersey!",
        image: "https://i.pinimg.com/736x/41/c0/8e/41c08e93a2d16ac397b2c857665eb27c.jpg",
        name: "Sneha Kurian",
        role: "Die-hard Supporter",
    },
    {
        text: "The fabric is so breathable! I wear it for my morning games and it stays light and comfortable throughout.",
        image: "https://i.pinimg.com/736x/f8/75/4b/f8754b3f0c8e18547e995c0c37cec1e5.jpg",
        name: "Kiran Jose",
        role: "Marathon Runner",
    },
    {
        text: "Been searching for high-quality Kerala jerseys for a long time. This is definitely the best shop in town.",
        image: "https://i.pinimg.com/736x/bb/94/f3/bb94f36b0b73b84bc08400319f5c71c5.jpg",
        name: "Meera Menon",
        role: "Collector",
    },
    {
        text: "The attention to detail in the stitching is impressive. It feels like a premium international brand.",
        image: "https://i.pinimg.com/736x/02/6b/3b/026b3b99ff48f4f1baf7a4184b0156ec.jpg",
        name: "Fahad Ibrahim",
        role: "Sports Journalist",
    },
    {
        text: "Support was very helpful when I needed to exchange for a different size. Smooth and hassle-free experience.",
        image: "https://i.pinimg.com/736x/16/ee/2c/16ee2c07a74f2e52e55fdc5155cb4d25.jpg",
        name: "Vishnu Prasad",
        role: "Student",
    },
    {
        text: "Proud to wear my roots! The yellow and green combo is simply iconic. Manjapada for life!",
        image: "https://i.pinimg.com/736x/fa/9f/86/fa9f863bfc20680888afe30b76290ed4.jpg",
        name: "Deepak Raj",
        role: "Season Ticket Holder",
    },
    {
        text: "Ordered from Dubai and it arrived earlier than expected. Great service for Malayalis living abroad!",
        image: "https://i.pinimg.com/1200x/40/83/25/408325bb57e1a479b656f75aba29a96f.jpg",
        name: "Sidhu Sreenivasan",
        role: "NRI Fan",
    },
];

const firstColumn = testimonials;
const secondColumn = [...testimonials.slice(3), ...testimonials.slice(0, 3)];
const thirdColumn = [...testimonials.slice(6), ...testimonials.slice(0, 6)];

// --- Sub-Components ---
const TestimonialsColumn = ({ className, testimonials, duration }) => {
    return (
        <div className={className}>
            <motion.ul
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6 bg-transparent list-none m-0 p-0"
            >
                {[
                    ...new Array(2).fill(0).map((_, index) => (
                        <React.Fragment key={index}>
                            {testimonials.map(({ text, image, name, role }, i) => (
                                <motion.li
                                    key={`${index}-${i}`}
                                    aria-hidden={index === 1 ? "true" : "false"}
                                    tabIndex={index === 1 ? -1 : 0}
                                    whileHover={{
                                        scale: 1.02,
                                        y: -5,
                                        boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)",
                                        transition: { type: "spring", stiffness: 400, damping: 17 }
                                    }}
                                    className="p-8 rounded-3xl border border-[#e5e1da] shadow-xl max-w-xs w-full bg-[#faf7f2]/80 backdrop-blur-xl cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition-all duration-300"
                                >
                                    <blockquote className="m-0 p-0">
                                        <p className="text-gray-600 text-sm leading-relaxed font-light m-0 line-clamp-4">
                                            "{text}"
                                        </p>
                                        <footer className="flex items-center gap-3 mt-6">
                                            <img
                                                width={40}
                                                height={40}
                                                src={image}
                                                alt={`Avatar of ${name}`}
                                                className="h-10 w-10 rounded-full object-cover ring-2 ring-white/60 group-hover:ring-yellow-500/50 transition-all duration-300 ease-in-out"
                                            />
                                            <div className="flex flex-col">
                                                <cite className="font-semibold not-italic tracking-tight leading-5 text-gray-900">
                                                    {name}
                                                </cite>
                                                <span className="text-xs leading-5 tracking-tight text-gray-500 mt-0.5 font-light">
                                                    {role}
                                                </span>
                                            </div>
                                        </footer>
                                    </blockquote>
                                </motion.li>
                            ))}
                        </React.Fragment>
                    )),
                ]}
            </motion.ul>
        </div>
    );
};

export default function Testimonials() {
    return (
        <section
            aria-labelledby="testimonials-heading"
            className="bg-transparent py-24 relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col items-center justify-center text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center space-x-2 bg-gray-900/5 backdrop-blur-sm border border-gray-900/10 px-4 py-1.5 rounded-full mb-6"
                    >
                        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-800">
                            Community Love
                        </p>
                    </motion.div>



                    <div className="flex items-center gap-3 bg-white/30 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/50 shadow-sm">
                        <div className="flex -space-x-2">
                            <img
                                src="https://res.cloudinary.com/dviwae8cc/image/upload/v1766746071/999_11zon_p1cwr4.jpg"
                                alt="Member"
                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                            />
                            <img
                                src="https://res.cloudinary.com/dviwae8cc/image/upload/v1766745906/3D_UrbanStyle_11zon_r71nzf.jpg"
                                alt="Member"
                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                            />
                            <img
                                src="https://i.pinimg.com/1200x/b7/c1/31/b7c131d008da508abbe765b5c2d49114.jpg"
                                alt="Member"
                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                            />
                        </div>
                        <div className="text-left">
                            <p className="text-gray-900 font-bold text-sm leading-tight">Join 10K+ Fans</p>
                            <p className="text-gray-500 text-[10px] uppercase font-semibold tracking-wider">Passionate Supporters</p>
                        </div>
                    </div>
                </div>

                {/* Scrolling Columns */}
                <div
                    className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[800px] overflow-hidden"
                    role="region"
                    aria-label="Scrolling Testimonials"
                >
                    <TestimonialsColumn testimonials={firstColumn} duration={40} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={55} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={45} />
                </div>
            </div>

            {/* Decorative Blur Backgrounds */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-yellow-200/20 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-green-200/10 rounded-full blur-[100px] -z-10"></div>
        </section>
    );
}
