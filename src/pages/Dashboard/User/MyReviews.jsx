import { useEffect, useState } from 'react';
import moment from 'moment';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import { getFirebaseToken } from '../../../utils/getFirebaseToken';

const MyReviews = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedRating, setEditedRating] = useState(0);
    const [editedComment, setEditedComment] = useState('');

    // Fetch user's reviews
    useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                const token = await getFirebaseToken();
                const { data } = await axios.get(
                    `https://server-kohl-pi.vercel.app/api/reviews?userEmail=${user?.email}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setReviews(data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load reviews',
                    confirmButtonColor: '#2C5F95'
                });
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchUserReviews();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleDelete = async (reviewId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2C5F95',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const token = await getFirebaseToken();
                await axios.delete(
                    `https://server-kohl-pi.vercel.app/api/reviews/${reviewId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                
                setReviews(reviews.filter(review => review._id !== reviewId));
                
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Your review has been deleted.',
                    confirmButtonColor: '#2C5F95'
                });
            } catch (error) {
                console.error('Error deleting review:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Failed to delete review',
                    confirmButtonColor: '#2C5F95'
                });
            }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        if (!editedRating) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please provide a rating',
                confirmButtonColor: '#2C5F95'
            });
            return;
        }

        try {
            const token = await getFirebaseToken();
            const updateData = {
                rating: editedRating,
                comment: editedComment,
                reviewDate: new Date().toISOString(),
                scholarshipName: selectedReview.scholarshipName,
                universityName: selectedReview.universityName,
                universityId: selectedReview.universityId,
                userId: user.uid,
                userName: user.displayName,
                userImage: user.photoURL || null,
                userEmail: user.email
            };

            const response = await axios.patch(
                `https://server-kohl-pi.vercel.app/api/reviews/${selectedReview._id}`,
                updateData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                // Update the review in the local state
                setReviews(reviews.map(review => 
                    review._id === selectedReview._id 
                        ? { 
                            ...review, 
                            rating: editedRating, 
                            comment: editedComment,
                            reviewDate: new Date().toISOString()
                        }
                        : review
                ));

                setIsEditModalOpen(false);
                setSelectedReview(null);
                setEditedRating(0);
                setEditedComment('');
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Review Updated!',
                    text: 'Your review has been successfully updated.',
                    confirmButtonColor: '#2C5F95'
                });
            }
        } catch (error) {
            console.error('Error updating review:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update review',
                confirmButtonColor: '#2C5F95'
            });
        }
    };

    const openEditModal = (review) => {
        setSelectedReview(review);
        setEditedRating(review.rating);
        setEditedComment(review.comment);
        setIsEditModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-16 h-16 border-4 border-[#2C5F95] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">My Reviews</h2>
                    <p className="text-gray-600 mt-1">Manage your scholarship reviews</p>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="w-full">
                {reviews.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                        <p className="text-gray-500">You haven't written any reviews for scholarships yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 container mx-auto">
                        {reviews.map((review) => (
                            <div key={review._id} 
                                className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden min-w-[350px]">
                                <div className="p-8 flex flex-col h-full">
                                    <div className="flex-grow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1 pr-4">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{review.scholarshipName}</h3>
                                                <p className="text-sm text-gray-600">{review.universityName}</p>
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                                                {moment(review.reviewDate || review.createdAt).format('MMM D, YYYY')}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center mb-4">
                                            {[...Array(5)].map((_, index) => (
                                                <svg
                                                    key={index}
                                                    className={`w-5 h-5 ${
                                                        index < review.rating
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-200'
                                                    }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            <span className="ml-2 text-sm font-medium text-gray-600">
                                                {review.rating}.0
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                            {review.comment}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                        <div className="flex items-center">
                                            {review.userImage ? (
                                                <img 
                                                    src={review.userImage} 
                                                    alt={review.userName}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-[#2C5F95] text-white flex items-center justify-center">
                                                    {review.userName?.charAt(0)}
                                                </div>
                                            )}
                                            <span className="ml-2 text-sm font-medium text-gray-700 truncate max-w-[120px]">
                                                {review.userName}
                                            </span>
                                        </div>
                                        
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => openEditModal(review)}
                                                className="inline-flex items-center px-3 py-1.5 border border-[#2C5F95] text-sm font-medium rounded-md text-[#2C5F95] bg-white hover:bg-[#2C5F95] hover:text-white transition-all duration-200"
                                            >
                                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="inline-flex items-center px-3 py-1.5 border border-red-500 text-sm font-medium rounded-md text-red-500 bg-white hover:bg-red-500 hover:text-white transition-all duration-200"
                                            >
                                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Review Modal */}
            {isEditModalOpen && selectedReview && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto">
                            <form onSubmit={handleEditSubmit} className="bg-white rounded-xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-semibold text-gray-900" id="modal-title">
                                            Edit Review
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditModalOpen(false);
                                                setSelectedReview(null);
                                            }}
                                            className="text-gray-400 hover:text-gray-500 transition-colors"
                                        >
                                            <span className="sr-only">Close</span>
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="px-6 py-4">
                                    {/* Scholarship Info */}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Scholarship</label>
                                                <p className="mt-1 text-gray-900">{selectedReview.scholarshipName}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">University</label>
                                                <p className="mt-1 text-gray-900">{selectedReview.universityName}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rating
                                        </label>
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setEditedRating(star)}
                                                    className={`text-3xl focus:outline-none transition-colors duration-200 ${
                                                        star <= editedRating ? 'text-yellow-400' : 'text-gray-300'
                                                    } hover:text-yellow-400`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                            <span className="ml-2 text-sm text-gray-600">
                                                {editedRating} out of 5 stars
                                            </span>
                                        </div>
                                    </div>

                                    {/* Review Comment */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Review
                                        </label>
                                        <textarea
                                            rows="4"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5F95] focus:border-[#2C5F95] text-gray-900"
                                            placeholder="Share your experience with this scholarship..."
                                            value={editedComment}
                                            onChange={(e) => setEditedComment(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            setSelectedReview(null);
                                            setEditedRating(0);
                                            setEditedComment('');
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C5F95] transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#2C5F95] hover:bg-[#13436F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C5F95] transition-all duration-200"
                                    >
                                        Update Review
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyReviews;