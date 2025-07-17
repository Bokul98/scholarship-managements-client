import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import ScholarshipInfo from "../components/ScholarshipDetails/ScholarshipInfo";
import ReviewSlider from "../components/ReviewSlider";
import { getScholarshipById } from "../api/scholarshipApi";
import axios from "axios";

const ScholarshipDetailsPage = () => {
  const { id } = useParams();
  console.log("Fetching details for scholarship ID:", id);

  // Fetch scholarship details
  const {
    data: scholarship,
    isLoading: scholarshipLoading,
    error: scholarshipError,
  } = useQuery({
    queryKey: ["scholarship", id],
    queryFn: async () => {
      try {
        console.log("Making API call for scholarship ID:", id);
        const data = await getScholarshipById(id);
        console.log("Received scholarship data:", data);
        return data;
      } catch (error) {
        console.error("Error fetching scholarship:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch scholarship details");
      }
    },
    retry: 1, // Only retry once if failed
  });

  // Fetch scholarship reviews
  const {
    data: reviews,
    isLoading: reviewsLoading,
  } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      try {
        const response = await axios.get(`https://server-kohl-pi.vercel.app/api/reviews/scholarship/${id}`);
        if (!response.data) {
          return []; // Return empty array if no reviews
        }
        console.log("Received reviews data:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching reviews:", error);
        return []; // Return empty array on error
      }
    },
    retry: 1,
  });

  // Handle loading states
  if (scholarshipLoading || reviewsLoading) {
    console.log("Loading state - Scholarship:", scholarshipLoading, "Reviews:", reviewsLoading);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Handle error states
  if (scholarshipError) {
    console.error("Error loading scholarship:", scholarshipError);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: scholarshipError.message || "Failed to load scholarship details",
    });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">
          Error loading scholarship details. Please try again later.
        </p>
      </div>
    );
  }

  // Validate scholarship data
  if (!scholarship || typeof scholarship !== 'object') {
    console.error("Invalid scholarship data received:", scholarship);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">
          Error: Invalid scholarship data received
        </p>
      </div>
    );
  }

  console.log("Rendering scholarship details:", {
    name: scholarship.name,
    id: scholarship._id,
    hasData: Object.keys(scholarship).length > 0
  });

  // Debug: Log reviews data
  console.log("Reviews to display:", reviews);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8 lg:py-12">
      {/* Scholarship Information */}
      <ScholarshipInfo 
        scholarship={scholarship} 
        isLoading={scholarshipLoading}
        error={scholarshipError}
      />

      {/* Reviews Section */}
      <div className="mt-12 md:mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
          What Our Applicants Say
        </h2>
        <div className="w-full max-w-6xl mx-auto px-0 sm:px-2 md:px-4 lg:px-6 xl:px-8">
          {Array.isArray(reviews) && reviews.length > 0 ? (
            <ReviewSlider reviews={reviews} />
          ) : (
            <p className="text-center text-gray-500 py-8">No reviews yet for this scholarship.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetailsPage;