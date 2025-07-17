import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaMapMarkerAlt, FaCalendarAlt, FaGraduationCap, FaBookOpen, FaSearch, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className="text-yellow-400">
                {i <= rating ? <FaStar /> : <FaRegStar />}
            </span>
        );
    }
    return <div className="flex gap-1">{stars}</div>;
};

const AllScholarshipsPage = () => {
    const [scholarships, setScholarships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9); // Show 9 scholarships per page

    // Fetch scholarships
    useEffect(() => {
        fetchScholarships();
    }, []);

    const fetchScholarships = async () => {
        try {
            const response = await axios.get('https://server-kohl-pi.vercel.app/api/scholarships');
            setScholarships(response.data);
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

    // Filter scholarships based on search term
    const filteredScholarships = React.useMemo(() => {
        if (!searchTerm.trim()) return scholarships;
        
        const searchTermLower = searchTerm.toLowerCase().trim();
        return scholarships.filter(scholarship => 
            scholarship.scholarshipName?.toLowerCase().includes(searchTermLower) ||
            scholarship.universityName?.toLowerCase().includes(searchTermLower) ||
            scholarship.subjectCategory?.toLowerCase().includes(searchTermLower) ||
            scholarship.scholarshipCategory?.toLowerCase().includes(searchTermLower) ||
            scholarship.degree?.toLowerCase().includes(searchTermLower)
        );
    }, [scholarships, searchTerm]);

    // Get current scholarships for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentScholarships = filteredScholarships.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="min-h-[600px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2C5F95]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center text-red-500">
                    <p className="text-xl font-semibold">Error loading scholarships</p>
                    <p className="mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8 md:py-12">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="max-w-2xl mx-auto text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">All Scholarships</h1>
                    <p className="text-base md:text-lg text-gray-600">
                        Browse through our comprehensive list of available scholarships
                    </p>
                </div>

                <div className="max-w-3xl mx-auto mb-8 md:mb-12">
                    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search scholarships..."
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {filteredScholarships.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                            {currentScholarships.map((scholarship) => (
                                <div 
                                    key={scholarship._id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#2C5F95]/20"
                                >
                                    {/* University Information */}
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage === 1
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-[#2C5F95] text-white hover:bg-[#13436F]'
                                        }`}
                                    >
                                        Previous
                                    </button>

                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => paginate(index + 1)}
                                            className={`px-3 py-1 rounded-md ${
                                                currentPage === index + 1
                                                    ? 'bg-[#2C5F95] text-white'
                                                    : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage === totalPages
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-[#2C5F95] text-white hover:bg-[#13436F]'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
                        <div className="mb-6 text-gray-400">
                            <FaExclamationCircle className="w-24 h-24" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Scholarships Found</h3>
                        <p className="text-gray-500 max-w-md">
                            We couldn't find any scholarships matching your search criteria. 
                            Try adjusting your search terms or browse all available scholarships.
                        </p>
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="mt-6 px-6 py-2 bg-gradient-to-r from-[#2C5F95] to-[#13436F] text-white font-medium rounded-lg hover:from-[#13436F] hover:to-[#2C5F95] transition-all duration-300"
                        >
                            View All Scholarships
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllScholarshipsPage;