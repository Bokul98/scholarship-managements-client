import { useQuery } from '@tanstack/react-query';
import { getTopScholarships } from '../api/scholarshipApi';

const useTopScholarships = () => {
    const { 
        data: scholarshipsData,
        isLoading,
        error
    } = useQuery({
        queryKey: ['topScholarships'],
        queryFn: getTopScholarships,
        staleTime: 1000 * 60 * 5,
        retry: 2
    });

    // Transform the data to match our component's expected structure
    const transformedScholarships = scholarshipsData?.map(scholarship => ({
        _id: scholarship._id,
        universityName: scholarship.university,
        universityLogo: scholarship.universityImage,
        scholarshipCategory: scholarship.scholarshipCategory,
        city: scholarship.location?.city,
        country: scholarship.location?.country,
        deadline: scholarship.applicationDeadline,
        applicationFee: scholarship.applicationFees,
        subjectCategory: scholarship.subjectCategory,
        postDate: scholarship.postDate,
        rating: scholarship.rating
    })) || [];

    return {
        scholarships: transformedScholarships,
        isLoading,
        error: error?.message
    };
};

export default useTopScholarships; 