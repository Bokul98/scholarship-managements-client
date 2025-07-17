import moment from 'moment';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ReviewCard = ({ review, refetch }) => {
    const handleDeleteReview = async () => {
        try {
            await axios.delete(`/reviews/${review._id}`);
            toast.success('Review deleted successfully!');
            refetch();
        } catch (error) {
            toast.error(error.message || 'Failed to delete review');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-lg">{review.universityName}</h3>
                    <p className="text-sm text-gray-600">{review.subjectCategory}</p>
                </div>
                <button
                    onClick={handleDeleteReview}
                    className="btn btn-sm btn-circle bg-red-500 hover:bg-red-600 text-white"
                >
                    ✕
                </button>
            </div>

            <div className="flex items-center gap-3 mt-4">
                {review.reviewerImage ? (
                    <img
                        src={review.reviewerImage}
                        alt={review.reviewerName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-[#2C5F95] text-white flex items-center justify-center font-semibold">
                        {review.reviewerName?.charAt(0)}
                    </div>
                )}
                <div>
                    <h4 className="font-medium">{review.reviewerName}</h4>
                    <p className="text-sm text-gray-500">
                        {moment(review.createdAt).format('MMM D, YYYY')}
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
                <p className="text-gray-600">{review.comment}</p>
            </div>
        </div>
    );
};

export default ReviewCard; 