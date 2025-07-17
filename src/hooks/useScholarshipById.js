import { useQuery } from "@tanstack/react-query";
import { getScholarshipById } from "../api/scholarshipApi";

const useScholarshipById = (id) => {
    const {
        data: scholarship,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ["scholarship", id],
        queryFn: () => getScholarshipById(id),
        enabled: !!id,
        retry: 2,
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        cacheTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
    });

    return { scholarship, isLoading, error, refetch };
};

export default useScholarshipById; 