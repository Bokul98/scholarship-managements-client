import React from 'react';
import { FaSearch, FaFileInvoiceDollar, FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaSearch className="text-4xl text-[#2C5F95]" />,
            title: "Search Scholarships",
            description: "Filter opportunities by degree, university, and fees."
        },
        {
            icon: <FaFileInvoiceDollar className="text-4xl text-[#2C5F95]" />,
            title: "Apply & Pay Online",
            description: "Apply directly through our system after secure payment."
        },
        {
            icon: <FaBell className="text-4xl text-[#2C5F95]" />,
            title: "Track & Get Feedback",
            description: "Check your dashboard for application status and feedback."
        }
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-white to-[#2C5F95]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#2C5F95] to-[#13436F] bg-clip-text text-transparent">
                        How Scholarship Management Works
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Follow three simple steps to find and apply for your dream scholarship.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.2)] transition-all duration-300 border border-gray-200/80 hover:border-[#2C5F95]/30">
                                <div className="flex flex-col items-center text-center space-y-6">
                                    <div className="p-4 rounded-full bg-gradient-to-r from-[#2C5F95]/10 to-[#13436F]/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#2C5F95] transition-colors duration-200">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;