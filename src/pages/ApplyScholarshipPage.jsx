import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScholarshipPayment from "../components/Scholarship/ScholarshipPayment";
import useScholarshipById from "../hooks/useScholarshipById";
import useAuth from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { applyForScholarship } from "../api/scholarshipApi";
import axios from "axios"; // Added axios import

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ApplyScholarshipPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { scholarship, loading, error } = useScholarshipById(id);
    const { user } = useAuth();
    const [showPayment, setShowPayment] = useState(false);
    const [applicationData, setApplicationData] = useState(null);
    const [scholarshipData, setScholarshipData] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (scholarship) {
            console.log("Scholarship data loaded:", {
                id: scholarship._id,
                name: scholarship.scholarshipName,
                category: scholarship.scholarshipCategory,
                universityName: scholarship.universityName,
                subjectCategory: scholarship.subjectCategory
            });
            setScholarshipData(scholarship);
        }
    }, [scholarship]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !scholarshipData) {
        console.error("Error loading scholarship:", error);
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">Error: {error || 'Failed to load scholarship data'}</div>
            </div>
        );
    }

    const onSubmit = async (data) => {
        try {
            if (!scholarshipData?.scholarshipCategory) {
                console.error('Scholarship category is missing:', scholarshipData);
                toast.error('Required scholarship information is missing. Please try again later.');
                return;
            }

            // Upload photo first
            const photoFile = data.photo[0];
            if (!photoFile) {
                toast.error('Please select a photo');
                return;
            }

            // Show loading toast while uploading
            toast.info('Uploading photo...', { autoClose: false, toastId: 'uploading' });

            // Create FormData for ImgBB
            const formData = new FormData();
            formData.append('image', photoFile);

            // Upload to ImgBB
            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
                formData
            );

            if (!response.data.success) {
                throw new Error('Failed to upload image');
            }

            // Get the image URL from ImgBB response
            const photoUrl = response.data.data.url;
            toast.dismiss('uploading');
            toast.success('Photo uploaded successfully!');

            // Prepare application data with proper structure
            const applicationFormData = {
                phoneNumber: data.phoneNumber,
                photo: photoUrl,
                address: {
                    village: data.village,
                    district: data.district,
                    country: data.country
                },
                gender: data.gender,
                applyingDegree: data.applyingDegree,
                sscResult: parseFloat(data.sscResult),
                hscResult: parseFloat(data.hscResult),
                studyGap: data.studyGap || null,
                scholarshipId: id,
                userId: user.uid,
                userName: user.displayName,
                userEmail: user.email,
                universityName: scholarshipData.universityName,
                scholarshipCategory: scholarshipData.scholarshipCategory,
                subjectCategory: scholarshipData.subjectCategory,
                status: "pending"
            };

            // Double check required fields
            if (!applicationFormData.scholarshipCategory) {
                console.error('Scholarship category is missing in form data:', applicationFormData);
                toast.error('Required scholarship information is missing. Please try again later.');
                return;
            }

            console.log('Application form data prepared:', applicationFormData);
            setApplicationData(applicationFormData);
            setShowPayment(true);
            toast.info('Please complete the payment to submit your application.');
        } catch (error) {
            console.error("Form submission failed:", error);
            toast.error(error.response?.data?.message || 'Failed to process form. Please try again.');
            if (error.response?.data?.errors) {
                console.log('Validation errors:', error.response.data.errors);
            }
        }
    };

    const handlePaymentSuccess = async (paymentIntent) => {
        try {
            // Ensure we have all required data
            if (!applicationData?.scholarshipCategory) {
                console.error('Missing scholarship category:', applicationData);
                toast.error('Missing required scholarship information. Please try again.');
                return;
            }

            const applicationFee = scholarshipData.applicationFee || 100;
            const serviceCharge = scholarshipData.serviceCharge || 100; // Default service charge

            const finalApplicationData = {
                ...applicationData,
                payment: {
                    applicationFee,
                    serviceCharge,
                    totalPaid: applicationFee + serviceCharge,
                    paidAt: new Date().toISOString(),
                    paymentIntentId: paymentIntent.id,
                    paymentStatus: 'completed'
                },
                appliedDate: new Date().toISOString()
            };

            console.log('Final application data being submitted:', finalApplicationData);

            const response = await applyForScholarship(finalApplicationData);
            console.log('Application submitted successfully:', response);
            toast.success('Application submitted successfully!');
            navigate("/dashboard/user/my-applications");  // Updated this line
        } catch (error) {
            console.error("Error submitting application:", error);
            
            // Handle validation errors
            if (error.response?.data?.errors) {
                const errorMessages = Object.entries(error.response.data.errors)
                    .map(([field, message]) => `${field}: ${message}`)
                    .join('\n');
                toast.error(`Validation errors:\n${errorMessages}`);
                console.log('Validation errors:', error.response.data.errors);
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to submit application. Please try again.');
            }
        }
    };

    // Ensure we have a valid application fee
    const applicationFee = scholarshipData?.applicationFee;
    if (!applicationFee || typeof applicationFee !== 'number' || applicationFee <= 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto bg-red-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-red-600">
                        Error: Invalid Application Fee
                    </h2>
                    <p>Please contact support for assistance.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <ToastContainer position="top-right" />
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        Apply for {scholarshipData?.scholarshipName}
                    </h1>
                    <p className="text-gray-600">Please fill out the form below to apply for this scholarship</p>
                </div>

                <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                    {!showPayment ? (
                        <div className="p-4 sm:p-6 lg:p-8">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Personal Information Section */}
                                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Phone Number */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                {...register("phoneNumber", { 
                                                    required: "Phone number is required",
                                                    pattern: {
                                                        value: /^[0-9+\-\s()]*$/,
                                                        message: "Please enter a valid phone number"
                                                    }
                                                })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                                placeholder="Enter your phone number"
                                            />
                                            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                                        </div>

                                        {/* Gender */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                            <select
                                                {...register("gender", { required: "Gender is required" })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                                        </div>
                                    </div>

                                    {/* Photo Upload */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Photo</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            {...register("photo", { 
                                                required: "Photo is required",
                                                validate: {
                                                    fileSize: (files) => !files[0] || files[0].size <= 2000000 || 'Image must be less than 2MB',
                                                    fileType: (files) =>
                                                        !files[0] || ['image/jpeg', 'image/png', 'image/gif'].includes(files[0].type) || 'Only JPEG, PNG and GIF images are allowed',
                                                }
                                            })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent
                                                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                                                file:text-sm file:font-medium
                                                file:bg-[#2C5F95] file:text-white
                                                hover:file:bg-[#13436F] transition duration-200"
                                        />
                                        {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo.message}</p>}
                                        <p className="text-gray-500 text-xs mt-1">Maximum file size: 2MB. Accepted formats: JPEG, PNG, GIF</p>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                                            <input
                                                type="text"
                                                {...register("village", { required: "Village is required" })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                                placeholder="Enter village name"
                                            />
                                            {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                            <input
                                                type="text"
                                                {...register("district", { required: "District is required" })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                                placeholder="Enter district name"
                                            />
                                            {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                            <input
                                                type="text"
                                                {...register("country", { required: "Country is required" })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                                placeholder="Enter country name"
                                            />
                                            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Information */}
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Applying Degree</label>
                                            <select
                                                {...register("applyingDegree", { required: "Applying degree is required" })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                            >
                                                <option value="">Select Degree</option>
                                                <option value="Diploma">Diploma</option>
                                                <option value="Bachelor">Bachelor</option>
                                                <option value="Masters">Masters</option>
                                            </select>
                                            {errors.applyingDegree && <p className="text-red-500 text-sm mt-1">{errors.applyingDegree.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Study Gap (Optional)</label>
                                            <select
                                                {...register("studyGap")}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                            >
                                                <option value="">No Gap</option>
                                                <option value="1">1 Year</option>
                                                <option value="2">2 Years</option>
                                                <option value="3">3+ Years</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">SSC Result (GPA)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register("sscResult", { 
                                                    required: "SSC result is required",
                                                    min: { value: 0, message: "GPA cannot be negative" },
                                                    max: { value: 5, message: "GPA cannot be more than 5" }
                                                })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                                placeholder="Enter SSC GPA"
                                            />
                                            {errors.sscResult && <p className="text-red-500 text-sm mt-1">{errors.sscResult.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">HSC Result (GPA)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register("hscResult", { 
                                                    required: "HSC result is required",
                                                    min: { value: 0, message: "GPA cannot be negative" },
                                                    max: { value: 5, message: "GPA cannot be more than 5" }
                                                })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                                placeholder="Enter HSC GPA"
                                            />
                                            {errors.hscResult && <p className="text-red-500 text-sm mt-1">{errors.hscResult.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Scholarship Information */}
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Scholarship Information</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
                                            <input
                                                type="text"
                                                value={scholarshipData?.universityName || ''}
                                                readOnly
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Category</label>
                                                <input
                                                    type="text"
                                                    value={scholarshipData?.scholarshipCategory || ''}
                                                    readOnly
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Category</label>
                                                <input
                                                    type="text"
                                                    value={scholarshipData?.subjectCategory || ''}
                                                    readOnly
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#2C5F95] to-[#13436F] text-white py-3 px-6 rounded-lg hover:from-[#13436F] hover:to-[#2C5F95] transition-all duration-300 font-medium text-lg shadow-md hover:shadow-lg"
                                >
                                    Proceed to Payment
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="bg-gradient-to-r from-[#2C5F95]/10 to-[#13436F]/10 p-6 rounded-xl mb-6">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                                    Application Fee Details
                                </h2>
                                <p className="text-gray-600 mb-4">Please complete your payment to submit the application</p>
                                <div className="text-2xl font-bold text-[#2C5F95]">
                                    Amount: ${applicationFee}
                                </div>
                            </div>
                            <Elements stripe={stripePromise}>
                                <ScholarshipPayment
                                    amount={applicationFee}
                                    onPaymentSuccess={handlePaymentSuccess}
                                />
                            </Elements>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplyScholarshipPage;