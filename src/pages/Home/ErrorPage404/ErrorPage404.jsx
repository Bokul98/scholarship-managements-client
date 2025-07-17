import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import notFound from '../../../assets/page-not-found.png';

const ErrorPage404 = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-[#2C5F95]/5 flex items-center justify-center px-4 py-12">
            <div className="max-w-3xl w-full">
                <div className="text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img
                            src={notFound}
                            alt="404 Page Not Found"
                            className="max-w-md mx-auto w-full h-auto rounded-2xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] mb-8"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2C5F95] to-[#13436F] bg-clip-text text-transparent">
                            Oops! Page Not Found
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl mx-auto">
                            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/">
                            <button className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2C5F95] to-[#13436F] text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <FaHome className="text-lg group-hover:scale-110 transition-transform duration-300" />
                                Back to Home
                            </button>
                        </Link>
                        <button 
                            onClick={() => window.history.back()}
                            className="group flex items-center gap-2 px-6 py-3 bg-white text-[#2C5F95] rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-[#2C5F95]/20"
                        >
                            <FaArrowLeft className="text-lg group-hover:scale-110 transition-transform duration-300" />
                            Go Back
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage404;