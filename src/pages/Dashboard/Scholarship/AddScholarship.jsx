import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useUserRole from '../../../hooks/useUserRole';

const AddScholarship = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { role } = useUserRole();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;
        const image = form.image.files[0];

        try {
            const token = await user.getIdToken();

            const formData = new FormData();
            formData.append('image', image);

            const imgbbRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
                formData
            );

            const scholarshipData = {
                scholarshipName: form.scholarshipName.value,
                universityName: form.universityName.value,
                country: form.country.value,
                city: form.city.value,
                rank: form.rank.value,
                subjectCategory: form.subjectCategory.value,
                scholarshipCategory: form.scholarshipCategory.value,
                degree: form.degree.value,
                tuitionFee: form.tuitionFee.value ? parseFloat(form.tuitionFee.value) : null,
                applicationFee: parseFloat(form.applicationFee.value),
                serviceCharge: parseFloat(form.serviceCharge.value),
                deadline: form.deadline.value,
                postDate: new Date().toISOString(),
                postedUserEmail: user?.email,
                image: imgbbRes.data.data.url,
                description: form.description.value
            };

            const response = await axios.post(
                'https://server-kohl-pi.vercel.app/api/scholarships',
                scholarshipData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.insertedId) {
                toast.success('Scholarship added successfully!');
                form.reset();
                
                // Navigate based on user role
                if (role === 'admin') {
                    navigate('/dashboard/admin/manage-scholarships');
                } else if (role === 'moderator') {
                    navigate('/dashboard/moderator/manage-scholarships');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error('Unauthorized access! Please login again.');
            } else {
                toast.error(error.message || 'Failed to add scholarship');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#2C5F95] to-[#13436F] bg-clip-text text-transparent">
                        Add New Scholarship
                    </h2>
                    <p className="mt-2 text-gray-600">Fill in the details to create a new scholarship opportunity</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Information */}
                            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <span className="w-8 h-8 bg-[#2C5F95] rounded-lg text-white flex items-center justify-center mr-2 text-sm">1</span>
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="form-control">
                                        <label className="text-sm font-medium text-gray-700">Scholarship Name*</label>
                                        <input
                                            type="text"
                                            name="scholarshipName"
                                            placeholder="Enter scholarship name"
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="text-sm font-medium text-gray-700">University Name*</label>
                                        <input
                                            type="text"
                                            name="universityName"
                                            placeholder="Enter university name"
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="text-sm font-medium text-gray-700">University World Rank*</label>
                                        <input
                                            type="number"
                                            name="rank"
                                            placeholder="Enter university rank"
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location Information */}
                            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <span className="w-8 h-8 bg-[#2C5F95] rounded-lg text-white flex items-center justify-center mr-2 text-sm">2</span>
                                    Location Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className="text-sm font-medium text-gray-700">Country*</label>
                                        <input
                                            type="text"
                                            name="country"
                                            placeholder="Enter country"
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="text-sm font-medium text-gray-700">City*</label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="Enter city"
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <span className="w-8 h-8 bg-[#2C5F95] rounded-lg text-white flex items-center justify-center mr-2 text-sm">3</span>
                                    Academic Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="form-control">
                                        <label className="text-sm font-medium text-gray-700">Subject Category*</label>
                                        <select
                                            name="subjectCategory"
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                            required
                                        >
                                            <option value="">Select category</option>
                                            <option value="Agriculture">Agriculture</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Doctor">Doctor</option>
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <label className="text-sm font-medium text-gray-700">Scholarship Category*</label>
                                        <select
                                            name="scholarshipCategory"
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                            required
                                        >
                                            <option value="">Select category</option>
                                            <option value="Full fund">Full fund</option>
                                            <option value="Partial">Partial</option>
                                            <option value="Self-fund">Self-fund</option>
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <label className="text-sm font-medium text-gray-700">Degree*</label>
                                        <select
                                            name="degree"
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                            required
                                        >
                                            <option value="">Select degree</option>
                                            <option value="Diploma">Diploma</option>
                                            <option value="Bachelor">Bachelor</option>
                                            <option value="Masters">Masters</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Information */}
                            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <span className="w-8 h-8 bg-[#2C5F95] rounded-lg text-white flex items-center justify-center mr-2 text-sm">4</span>
                                    Financial Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="form-control">
                                        <label className="text-sm font-medium text-gray-700">Tuition Fee ($)</label>
                                        <input
                                            type="number"
                                            name="tuitionFee"
                                            placeholder="Enter tuition fee (optional)"
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="text-sm font-medium text-gray-700">Application Fee ($)*</label>
                                        <input
                                            type="number"
                                            name="applicationFee"
                                            placeholder="Enter application fee"
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="text-sm font-medium text-gray-700">Service Charge ($)*</label>
                                        <input
                                            type="number"
                                            name="serviceCharge"
                                            placeholder="Enter service charge"
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <span className="w-8 h-8 bg-[#2C5F95] rounded-lg text-white flex items-center justify-center mr-2 text-sm">5</span>
                                    Additional Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="form-control">
                                        <label className="text-sm font-medium text-gray-700">Application Deadline*</label>
                                        <input
                                            type="date"
                                            name="deadline"
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="text-sm font-medium text-gray-700">University Image/Logo*</label>
                                        <input
                                            type="file"
                                            name="image"
                                            accept="image/*"
                                            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200
                                                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                                                file:text-sm file:font-medium
                                                file:bg-[#2C5F95] file:text-white
                                                hover:file:bg-[#13436F]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="text-sm font-medium text-gray-700">Description*</label>
                                    <textarea
                                        name="description"
                                        placeholder="Enter scholarship description"
                                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2C5F95] focus:border-transparent transition duration-200 h-32"
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="form-control mt-8">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#2C5F95] to-[#13436F] text-white py-4 rounded-lg hover:from-[#13436F] hover:to-[#2C5F95] transition-all duration-300 font-medium text-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Add Scholarship</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
);
};

export default AddScholarship;
