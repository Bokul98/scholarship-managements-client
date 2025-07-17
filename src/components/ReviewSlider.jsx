
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ReviewSlider = ({ reviews }) => {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
      className="py-8"
    >
      {reviews.map((review) => (
        <SwiperSlide key={review._id}>
          <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col items-center">
            {/* Reviewer Image */}
            <img
              src={review.userImage}
              alt={review.userName}
              className="w-16 h-16 rounded-full mb-3 object-cover border-2 border-primary"
            />
            {/* Reviewer Name */}
            <h3 className="font-semibold text-lg mb-1">{review.userName}</h3>
            {/* Review Date */}
            <p className="text-gray-500 text-sm mb-2">
              {new Date(review.reviewDate || review.createdAt).toLocaleDateString()}
            </p>
            {/* Review Rating */}
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-5 h-5 ${index < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
            </div>
            {/* Reviewer Comment */}
            <p className="text-center text-gray-700">{review.comment}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

ReviewSlider.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
      userName: PropTypes.string.isRequired,
      userImage: PropTypes.string.isRequired,
      reviewDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date),
      ]),
      createdAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date),
      ]),
    })
  ).isRequired,
};

export default ReviewSlider;