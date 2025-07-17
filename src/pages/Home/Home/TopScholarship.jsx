import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaMapMarkerAlt, FaCalendarAlt, FaGraduationCap, FaBookOpen, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className="text-[#2C5F95]">
                {i <= rating ? <FaStar /> : <FaRegStar />}
            </span>
        );
    }
    return <div className="flex gap-1">{stars}</div>;
};

const TopScholarship = () => {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchScholarships();
    }, []);

    const fetchScholarships = async () => {
        try {
            const response = await axios.get('https://server-kohl-pi.vercel.app/api/scholarships');
            // Sort by application fee (ascending) and date (most recent) and take only 6
            const sortedScholarships = response.data
                .sort((a, b) => {
                    // First sort by application fee
                    const feeComparison = a.applicationFee - b.applicationFee;
                    if (feeComparison !== 0) return feeComparison;
                    
                    // If fees are equal, sort by date (most recent first)
                    return new Date(b.deadline) - new Date(a.deadline);
                })
                .slice(0, 6); // Take only the first 6 scholarships
            
            setScholarships(sortedScholarships);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching scholarships:', error);
            setError('Failed to load scholarships');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load scholarships'
            });
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2C5F95]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center text-red-500">
                    <p className="text-xl font-semibold">Error loading scholarships</p>
                    <p className="mt-2">{error}</p>
                </div>
            </div>
        );
    }

    if (!scholarships?.length) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <p className="text-xl font-semibold">No scholarships found</p>
                    <p className="mt-2">Please check back later for new opportunities.</p>
                </div>
            </div>
        );
    }

    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Top Scholarships</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover the most affordable and recent scholarship opportunities tailored for you
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                        <p>Sorted by lowest application fees and most recent postings</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {scholarships.map((scholarship) => (
                        <div 
                            key={scholarship._id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#2C5F95]/20"
                        >
                            {/* University Info */}
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#2C5F95]/5 to-[#13436F]/5">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={scholarship.image || 'https://placehold.co/48x48?text=Logo'} 
                                        alt={`${scholarship.universityName} logo`}
                                        className="w-12 h-12 object-contain rounded-lg shadow-sm"
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/48x48?text=Logo';
                                        }}
                                    />
                                    <div>
                                        <h3 className="font-semibold text-lg text-[#2C5F95]">
                                            {scholarship.universityName}
                                        </h3>
                                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                                            <FaMapMarkerAlt className="text-[#2C5F95]" />
                                            <span>{scholarship.city}, {scholarship.country}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Scholarship Details */}
                            <div className="p-6 space-y-4">
                                <h4 className="font-semibold text-lg text-gray-900">{scholarship.scholarshipName}</h4>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <FaCalendarAlt className="text-[#2C5F95]" />
                                        <span className="text-gray-600">Deadline:</span>
                                        <span className="font-medium text-[#13436F]">
                                            {new Date(scholarship.deadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-600">Fee: </span>
                                        <span className="font-medium text-green-600">
                                            ${scholarship.applicationFee}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <FaGraduationCap className="text-[#2C5F95]" />
                                        <span className="text-gray-600">Subject:</span>
                                        <span className="font-medium text-[#13436F]">{scholarship.subjectCategory}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <FaBookOpen className="text-[#2C5F95]" />
                                        <span className="text-gray-600">Category:</span>
                                        <span className="font-medium text-[#13436F]">{scholarship.scholarshipCategory}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="text-sm">
                                        <span className="text-gray-600">Degree: </span>
                                        <span className="font-medium text-[#13436F]">{scholarship.degree}</span>
                                    </div>
                                    <Link 
                                        to={`/scholarship/${scholarship._id}`}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#2C5F95] to-[#13436F] text-white text-sm font-medium rounded-lg hover:from-[#13436F] hover:to-[#2C5F95] transition-all duration-300"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Scholarships Button */}
                <div className="text-center mt-12">
                    <Link 
                        to="/all-scholarships"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2C5F95] to-[#13436F] text-white text-lg font-medium rounded-lg hover:from-[#13436F] hover:to-[#2C5F95] transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        View All Scholarships
                        <FaArrowRight className="text-sm" />
                    </Link>
                    <p className="mt-3 text-sm text-gray-500">
                        Explore our complete collection of available scholarships
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TopScholarship;