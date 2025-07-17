import PropTypes from "prop-types";
import { FaUniversity, FaMapMarkerAlt, FaCalendarAlt, FaBookOpen, FaClock, FaDollarSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ScholarshipInfo = ({ scholarship, isLoading, error }) => {
    const navigate = useNavigate();

    // Handle error state
    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <div className="text-center text-red-600">
                    <h2 className="text-xl font-bold mb-2">Error Loading Scholarship</h2>
                    <p>{error.message || "Please try again later"}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Return loading state if scholarship is not yet loaded
    if (isLoading || !scholarship) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <div className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded mb-8"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    const {
        image,
        universityName,
        category,
        country,
        city,
        deadline,
        subjectCategory,
        description,
        stipend,
        postDate,
        serviceCharge,
        applicationFee,
        _id
    } = scholarship;

    // Helper function to safely format dates
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Date not available";
        }
    };

    // Helper function to safely format currency
    const formatCurrency = (amount) => {
        // Convert string to number if needed
        if (typeof amount === 'string') {
            amount = parseFloat(amount);
        }
        
        // Return 0 for invalid or missing values
        if (!amount || isNaN(amount)) {
            return '0';
        }
        
        try {
            return amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } catch (error) {
            console.error("Error formatting currency:", error);
            return '0';
        }
    };

    // Handle apply button click
    const handleApplyClick = () => {
        try {
            navigate(`/apply-scholarship/${_id}`);
        } catch (error) {
            console.error("Navigation error:", error);
            // Show a user-friendly error message
            alert("Unable to navigate to application page. Please try again.");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            {/* University Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <div className="w-32 h-32 flex-shrink-0">
                    <img
                        src={image}
                        alt={`${universityName} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            e.target.src = '/fallback-university-logo.png'; // Add a fallback image
                            e.target.onerror = null; // Prevent infinite loop
                        }}
                    />
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        {universityName}
                    </h1>
                    <div className="flex flex-col md:flex-row gap-3 text-gray-600">
                        <span className="flex items-center justify-center md:justify-start gap-2">
                            <FaUniversity className="text-primary" />
                            {category}
                        </span>
                        <span className="flex items-center justify-center md:justify-start gap-2">
                            <FaMapMarkerAlt className="text-primary" />
                            {city}, {country}
                        </span>
                    </div>
                </div>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <InfoCard
                    icon={<FaCalendarAlt />}
                    title="Application Deadline"
                    value={formatDate(deadline)}
                    urgent={true}
                />
                <InfoCard
                    icon={<FaBookOpen />}
                    title="subjectCategory"
                    value={subjectCategory || 'Not specified'}
                />
                <InfoCard
                    icon={<FaClock />}
                    title="Posted On"
                    value={formatDate(postDate)}
                />
            </div>

            {/* Description Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{description}</p>
            </div>

            {/* Financial Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stipend && (
                    <InfoCard
                        icon={<FaDollarSign />}
                        title="Monthly Stipend"
                        value={`$${formatCurrency(stipend)}`}
                        highlight={true}
                    />
                )}
                <InfoCard
                    icon={<FaDollarSign />}
                    title="Service Charge"
                    value={`$${formatCurrency(serviceCharge)}`}
                />
                <InfoCard
                    icon={<FaDollarSign />}
                    title="Application Fee"
                    value={`$${formatCurrency(applicationFee)}`}
                />
            </div>

            {/* Apply Button */}
            <button
                onClick={handleApplyClick}
                className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
                Apply Now
            </button>
        </div>
    );
};

// Helper component for consistent info card styling
const InfoCard = ({ icon, title, value, urgent = false, highlight = false }) => (
    <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
            <span className={`text-lg ${highlight ? 'text-primary' : 'text-gray-600'}`}>
                {icon}
            </span>
            <h3 className="font-medium text-gray-700">{title}</h3>
        </div>
        <p className={`text-lg font-semibold ${urgent ? 'text-red-600' : highlight ? 'text-primary' : 'text-gray-800'}`}>
            {value}
        </p>
    </div>
);

InfoCard.propTypes = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    urgent: PropTypes.bool,
    highlight: PropTypes.bool,
};

ScholarshipInfo.propTypes = {
    scholarship: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        universityName: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        deadline: PropTypes.string.isRequired,
        subjectCategory: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        stipend: PropTypes.number,
        postDate: PropTypes.string.isRequired,
        serviceCharge: PropTypes.number.isRequired,
        applicationFee: PropTypes.number.isRequired,
    }),
    isLoading: PropTypes.bool,
    error: PropTypes.object,
};

export default ScholarshipInfo; 