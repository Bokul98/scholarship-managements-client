import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getFirebaseToken } from '../../../utils/getFirebaseToken';

const ManageReviews = () => {
    const { data: reviews = [], isLoading, refetch } = useQuery({
        queryKey: ['reviews'],
        queryFn: async () => {
            const token = await getFirebaseToken();
            const response = await axios.get('https://server-kohl-pi.vercel.app/api/reviews', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        }
    });

    const handleDeleteReview = async (id) => {
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
                await axios.delete(`https://server-kohl-pi.vercel.app/api/reviews/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                await refetch();
                Swal.fire(
                    'Deleted!',
                    'Review has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting review:', error);
                Swal.fire(
                    'Error!',
                    error.response?.data?.message || 'Failed to delete review',
                    'error'
                );
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-[#2C5F95]"></span>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 md:mb-6 lg:mb-8 text-gray-800">
                Manage Reviews
            </h2>
            {reviews.length === 0 ? (
                <div className="text-center py-12 md:py-16 bg-white rounded-xl shadow-sm">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-500">There are no reviews in the system yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-base md:text-lg truncate">{review.universityName}</h3>
                                    <p className="text-sm text-gray-600 truncate mt-1">{review.scholarshipName}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteReview(review._id)}
                                    className="btn btn-sm btn-circle bg-red-500 hover:bg-red-600 text-white ml-2 flex-shrink-0"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="flex items-center gap-3 mt-4">
                                {review.userImage ? (
                                    <img
                                        src={review.userImage}
                                        alt={review.userName}
                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#2C5F95] text-white flex items-center justify-center font-semibold flex-shrink-0">
                                        {review.userName?.charAt(0)}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <h4 className="font-medium text-sm truncate">{review.userName}</h4>
                                    <p className="text-xs text-gray-500">
                                        {moment(review.reviewDate || review.createdAt).format('MMM D, YYYY')}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, index) => (
                                        <svg
                                            key={index}
                                            className={`w-4 h-4 ${
                                                index < review.rating
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-3">{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageReviews;