import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const Banner = () => {
    const slides = [
        {
            id: 1,
            title: ["Unlock", "Full-Funded", "Scholarships Today"],
            subtitle: "Find the best opportunities from top universities across the globe",
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
            buttonText: "Explore Now",
            buttonLink: "/scholarships",
            gradient: "from-[#2C5F95]/50 to-[#13436F]/50"
        },
        {
            id: 2,
            title: ["Study Abroad with", "Zero", "Application Fees"],
            subtitle: "Our platform helps you apply faster and smarter to your dream universities",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
            buttonText: "Apply Today",
            buttonLink: "/apply",
            gradient: "from-[#13436F]/50 to-[#2C5F95]/50"
        },
        {
            id: 3,
            title: ["Join 5,000+", "Successful", "Scholars"],
            subtitle: "Be part of our growing community of successful scholarship recipients",
            image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
            buttonText: "Get Started",
            buttonLink: "/register",
            gradient: "from-[#2C5F95]/50 to-[#13436F]/60"
        }
    ];

    return (
        <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden group">
            {/* Custom Navigation Buttons */}
            <div className="absolute left-4 top-1/2 z-20 -translate-y-1/2 md:left-8">
                <button className="swiper-custom-prev flex h-12 w-12 items-center justify-center rounded-full bg-[#2C5F95]/10 text-white backdrop-blur-sm transition-all hover:bg-[#2C5F95]/20 hover:text-white group-hover:opacity-100 md:h-14 md:w-14 opacity-0">
                    <HiOutlineChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
                </button>
            </div>
            <div className="absolute right-4 top-1/2 z-20 -translate-y-1/2 md:right-8">
                <button className="swiper-custom-next flex h-12 w-12 items-center justify-center rounded-full bg-[#2C5F95]/10 text-white backdrop-blur-sm transition-all hover:bg-[#2C5F95]/20 hover:text-white group-hover:opacity-100 md:h-14 md:w-14 opacity-0">
                    <HiOutlineChevronRight className="h-6 w-6 md:h-8 md:w-8" />
                </button>
            </div>

            <Swiper
                modules={[Autoplay, Navigation, Pagination, EffectFade]}
                effect="fade"
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                    prevEl: '.swiper-custom-prev',
                    nextEl: '.swiper-custom-next',
                }}
                pagination={{ 
                    clickable: true,
                    renderBullet: function (index, className) {
                        return '<span class="' + className + ' w-3 h-3 bg-[#2C5F95]/50 hover:bg-[#2C5F95]"></span>';
                    },
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                loop={true}
                className="h-full w-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative h-full w-full"
                        >
                            {/* Background Image with Gradient Overlay */}
                            <div className="absolute inset-0">
                                <img
                                    src={slide.image}
                                    alt={slide.title.join(" ")}
                                    className="h-full w-full object-cover"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} mix-blend-multiply`} />
                                <div className="absolute inset-0 bg-black/30" />
                            </div>
                            
                            {/* Content */}
                            <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
                                <div className="text-center max-w-4xl mx-auto">
                                    <motion.h1 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="mb-6 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl lg:text-6xl tracking-tight"
                                    >
                                        {slide.title.map((part, index) => (
                                            <span key={index} className="block">
                                                {index === 1 ? (
                                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2C5F95] to-[#13436F]">
                                                        {part}
                                                    </span>
                                                ) : part}
                                            </span>
                                        ))}
                                    </motion.h1>
                                    <motion.p 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        className="mb-8 text-base text-gray-200 sm:text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto"
                                    >
                                        {slide.subtitle}
                                    </motion.p>
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.6 }}
                                    >
                                        <Link
                                            to={slide.buttonLink}
                                            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2C5F95] to-[#13436F] px-8 py-4 text-lg font-semibold text-white transition-all hover:from-[#13436F] hover:to-[#2C5F95] hover:scale-105 focus:ring-2 focus:ring-[#2C5F95] focus:ring-offset-2 focus:ring-offset-transparent"
                                        >
                                            {slide.buttonText}
                                            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#13436F]/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#13436F]/40 to-transparent pointer-events-none" />
        </div>
    );
};

export default Banner;