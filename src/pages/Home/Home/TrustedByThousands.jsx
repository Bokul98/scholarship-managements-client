import React from 'react';
import { FaUserGraduate, FaAward, FaCheckCircle, FaUniversity } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TrustedByThousands = () => {
    const achievements = [
        {
            icon: <FaUserGraduate className="text-4xl" />,
            number: "10,000+",
            label: "Students Registered",
            description: "Active learners on our platform"
        },
        {
            icon: <FaAward className="text-4xl" />,
            number: "500+",
            label: "Scholarships Available",
            description: "Opportunities for students"
        },
        {
            icon: <FaCheckCircle className="text-4xl" />,
            number: "95%",
            label: "Application Success Rate",
            description: "Of our students succeed"
        },
        {
            icon: <FaUniversity className="text-4xl" />,
            number: "150+",
            label: "Partner Universities",
            description: "Global institutions"
        }
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-white to-[#2C5F95]/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#2C5F95] to-[#13436F] bg-clip-text text-transparent">
                        Trusted by Students Around the World
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        We've helped thousands of students connect with the right scholarship.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {achievements.map((achievement, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group h-full"
                        >
                            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.2)] transition-all duration-300 border border-[#2C5F95]/10 hover:border-[#2C5F95]/20 h-[280px] flex flex-col items-center justify-center">
                                <div className="flex flex-col items-center text-center space-y-6">
                                    <div className="p-4 rounded-full bg-gradient-to-r from-[#2C5F95]/10 to-[#13436F]/10 text-[#2C5F95] group-hover:scale-110 transition-transform duration-300">
                                        {achievement.icon}
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-4xl font-bold bg-gradient-to-r from-[#2C5F95] to-[#13436F] bg-clip-text text-transparent">
                                            {achievement.number}
                                        </h3>
                                        <h4 className="text-lg font-semibold text-[#13436F]">
                                            {achievement.label}
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            {achievement.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedByThousands;