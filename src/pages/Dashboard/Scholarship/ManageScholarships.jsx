import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ManageScholarships = () => {
    const [scholarships, setScholarships] = useState([]);
    const [selectedScholarship, setSelectedScholarship] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch scholarships
    useEffect(() => {
        fetchScholarships();
    }, []);

    const fetchScholarships = async () => {
        try {
            const token = localStorage.getItem('access-token');
            const response = await axios.get(
                'https://server-kohl-pi.vercel.app/api/scholarships',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setScholarships(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching scholarships:', error);
            toast.error('Failed to load scholarships');
            setLoading(false);
        }
    };

    const handleEditScholarship = async (e) => {
        e.preventDefault();
        const form = e.target;
        
        try {
            const token = localStorage.getItem('access-token');
            const updatedData = {
                scholarshipName: form.scholarshipName.value,
                universityName: form.universityName.value,
                country: form.country.value,
                city: form.city.value,
                rank: parseInt(form.rank.value),
                subjectCategory: form.subjectCategory.value,
                scholarshipCategory: form.scholarshipCategory.value,
                degree: form.degree.value,
                tuitionFee: form.tuitionFee.value ? parseFloat(form.tuitionFee.value) : null,
                applicationFee: parseFloat(form.applicationFee.value),
                serviceCharge: parseFloat(form.serviceCharge.value),
                deadline: form.deadline.value,
                description: form.description.value
            };

            await axios.patch(
                `https://server-kohl-pi.vercel.app/api/scholarships/${selectedScholarship._id}`, 
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            await fetchScholarships(); // Refresh the list

            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Scholarship has been updated successfully.',
                showConfirmButton: false,
                timer: 1500
            });
            
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating scholarship:', error);
            toast.error('Failed to update scholarship');
        }
    };

    const handleDeleteScholarship = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const token = localStorage.getItem('access-token');
                await axios.delete(
                    `https://server-kohl-pi.vercel.app/api/scholarships/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                
                setScholarships(scholarships.filter(scholarship => scholarship._id !== id));
                toast.success('Scholarship deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting scholarship:', error);
            toast.error('Failed to delete scholarship');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="p-2 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Manage Scholarships</h2>
            <div className="overflow-x-auto w-full">
                <table className="table border border-gray-200 bg-white w-full rounded-lg">
                    <thead className="bg-[#2C5F95] text-white">
                        <tr className="border-b border-gray-200">
                            <th className="text-[13px] md:text-base font-semibold p-3 md:p-4 border-r border-gray-100/20">Scholarship Name</th>
                            <th className="text-[13px] md:text-base font-semibold p-3 md:p-4 border-r border-gray-100/20">University</th>
                            <th className="text-[13px] md:text-base font-semibold p-3 md:p-4 border-r border-gray-100/20">Category</th>
                            <th className="text-[13px] md:text-base font-semibold p-3 md:p-4 border-r border-gray-100/20">Degree</th>
                            <th className="text-[13px] md:text-base font-semibold p-3 md:p-4 border-r border-gray-100/20">Fee</th>
                            <th className="text-[13px] md:text-base font-semibold p-3 md:p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-[13px] md:text-base divide-y divide-gray-200">
                        {scholarships.map((scholarship) => (
                            <tr key={scholarship._id} className="hover:bg-gray-50">
                                <td className="p-3 md:p-4 font-medium max-w-[140px] md:max-w-[200px] truncate border-r border-gray-200">{scholarship.scholarshipName}</td>
                                <td className="p-3 md:p-4 max-w-[140px] md:max-w-[200px] truncate border-r border-gray-200">{scholarship.universityName}</td>
                                <td className="p-3 md:p-4 max-w-[100px] md:max-w-[150px] truncate border-r border-gray-200">{scholarship.subjectCategory}</td>
                                <td className="p-3 md:p-4 max-w-[80px] md:max-w-[120px] truncate border-r border-gray-200">{scholarship.degree}</td>
                                <td className="p-3 md:p-4 max-w-[80px] md:max-w-[100px] truncate border-r border-gray-200">${scholarship.applicationFee}</td>
                                <td className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
                                    <button
                                        onClick={() => {
                                            setSelectedScholarship(scholarship);
                                            setIsDetailsModalOpen(true);
                                        }}
                                        className="btn btn-xs !h-6 !w-6 md:btn-sm !min-h-0 bg-[#2C5F95] hover:bg-[#13436F] text-white p-0"
                                    >
                                        <AiOutlineEye className="text-xs md:text-sm" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedScholarship(scholarship);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="btn btn-xs !h-6 !w-6 md:btn-sm !min-h-0 bg-yellow-500 hover:bg-yellow-600 text-white p-0"
                                    >
                                        <FaEdit className="text-xs md:text-sm" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteScholarship(scholarship._id)}
                                        className="btn btn-xs !h-6 !w-6 md:btn-sm !min-h-0 bg-red-500 hover:bg-red-600 text-white p-0"
                                    >
                                        <FaTrash className="text-xs md:text-sm" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            {isDetailsModalOpen && (
                <dialog open className="modal modal-middle sm:modal-middle">
                    <div className="modal-box w-11/12 max-w-3xl bg-gray-50 p-4 sm:p-6">
                        <div className="bg-gradient-to-r from-[#2C5F95] to-[#13436F] text-white p-4 sm:p-6 -m-4 sm:-m-6 mb-6">
                            <h3 className="font-bold text-lg sm:text-xl lg:text-2xl">{selectedScholarship?.scholarshipName}</h3>
                            <p className="text-xs sm:text-sm mt-1 text-gray-100">{selectedScholarship?.universityName}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h4 className="font-semibold text-[#2C5F95] mb-3 text-[13px] md:text-base">Basic Information</h4>
                                <div className="space-y-2 text-[13px] md:text-base">
                                    <p><span className="text-gray-600">Subject Category:</span> <span className="font-medium">{selectedScholarship?.subjectCategory}</span></p>
                                    <p><span className="text-gray-600">Scholarship Type:</span> <span className="font-medium">{selectedScholarship?.scholarshipCategory}</span></p>
                                    <p><span className="text-gray-600">Degree Level:</span> <span className="font-medium">{selectedScholarship?.degree}</span></p>
                                    <p><span className="text-gray-600">University Rank:</span> <span className="font-medium">#{selectedScholarship?.rank}</span></p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow">
                                <h4 className="font-semibold text-[#2C5F95] mb-3">Location & Deadline</h4>
                                <div className="space-y-2">
                                    <p><span className="text-gray-600">Country:</span> <span className="font-medium">{selectedScholarship?.country}</span></p>
                                    <p><span className="text-gray-600">City:</span> <span className="font-medium">{selectedScholarship?.city}</span></p>
                                    <p><span className="text-gray-600">Application Deadline:</span> <span className="font-medium">{new Date(selectedScholarship?.deadline).toLocaleDateString('en-US', { 
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span></p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow">
                                <h4 className="font-semibold text-[#2C5F95] mb-3">Financial Information</h4>
                                <div className="space-y-2">
                                    <p><span className="text-gray-600">Tuition Fee:</span> <span className="font-medium">${selectedScholarship?.tuitionFee || 'N/A'}</span></p>
                                    <p><span className="text-gray-600">Application Fee:</span> <span className="font-medium">${selectedScholarship?.applicationFee}</span></p>
                                    <p><span className="text-gray-600">Service Charge:</span> <span className="font-medium">${selectedScholarship?.serviceCharge}</span></p>
                                </div>
                            </div>

                            {selectedScholarship?.image ? (
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <h4 className="font-semibold text-[#2C5F95] mb-3">University Image</h4>
                                    <img src={selectedScholarship.image} alt="University" className="w-full h-48 object-cover rounded-lg" />
                                </div>
                            ) : (
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <h4 className="font-semibold text-[#2C5F95] mb-3">Description</h4>
                                    <p className="text-gray-700 text-sm">{selectedScholarship?.description}</p>
                                </div>
                            )}
                        </div>

                        {selectedScholarship?.description && selectedScholarship?.image && (
                            <div className="mt-6 bg-white p-4 rounded-lg shadow">
                                <h4 className="font-semibold text-[#2C5F95] mb-3">Description</h4>
                                <p className="text-gray-700 text-sm">{selectedScholarship?.description}</p>
                            </div>
                        )}

                        <div className="modal-action mt-4 sm:mt-6">
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="btn btn-sm sm:btn-md bg-gradient-to-r from-[#2C5F95] to-[#13436F] hover:from-[#13436F] hover:to-[#2C5F95] text-white min-w-[100px] sm:min-w-[120px]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setIsDetailsModalOpen(false)}>close</button>
                    </form>
                </dialog>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <dialog open className="modal modal-middle sm:modal-middle">
                    <div className="modal-box w-11/12 max-w-4xl bg-gray-50 p-0">
                        {/* Modal Header with Gradient */}
                        <div className="bg-gradient-to-r from-[#2C5F95] to-[#13436F] text-white p-4 sm:p-6 relative">
                            <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-1">Edit Scholarship</h3>
                            <p className="text-xs sm:text-sm text-gray-100 flex flex-wrap items-center gap-1 sm:gap-2">
                                <span className="hidden sm:inline-block w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full"></span>
                                <span className="truncate max-w-[150px] sm:max-w-none">{selectedScholarship?.scholarshipName}</span>
                                <span className="text-gray-300 mx-1 sm:mx-2">•</span>
                                <span className="truncate max-w-[150px] sm:max-w-none">{selectedScholarship?.universityName}</span>
                            </p>
                            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                                <button 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="btn btn-xs sm:btn-sm btn-circle btn-ghost text-gray-100 hover:text-white hover:bg-[#13436F]"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6">
                            <form onSubmit={handleEditScholarship}>
                                {/* Basic Information Section */}
                                <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm mb-3 sm:mb-6">
                                    <h4 className="font-semibold text-[#2C5F95] mb-2 sm:mb-4 text-[11px] sm:text-sm uppercase tracking-wider">Basic Information</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="form-control">
                                            <label className="label py-1">
                                                <span className="label-text text-[13px] font-medium">Scholarship Name</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="scholarshipName"
                                                defaultValue={selectedScholarship?.scholarshipName}
                                                className="input input-bordered h-10 text-[13px] min-h-0 w-full bg-gray-50 focus:bg-white transition-colors"
                                                required
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">University Name</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="universityName"
                                                defaultValue={selectedScholarship?.universityName}
                                                className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location Section */}
                                <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                                    <h4 className="font-semibold text-[#2C5F95] mb-4 text-sm uppercase tracking-wider">Location Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Country</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                defaultValue={selectedScholarship?.country}
                                                className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                                                required
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">City</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                defaultValue={selectedScholarship?.city}
                                                className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                                                required
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">University World Rank</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="rank"
                                                defaultValue={selectedScholarship?.rank}
                                                className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                                                required
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Application Deadline</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="deadline"
                                                defaultValue={selectedScholarship?.deadline?.split('T')[0]}
                                                className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Information */}
                                <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                                    <h4 className="font-semibold text-[#2C5F95] mb-4 text-sm uppercase tracking-wider">Academic Information</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="form-control">
                                            <label className="label py-1">
                                                <span className="label-text text-[13px] font-medium">Subject Category</span>
                                            </label>
                                            <select 
                                                name="subjectCategory" 
                                                defaultValue={selectedScholarship?.subjectCategory}
                                                className="select select-bordered h-10 min-h-0 text-[13px] w-full bg-gray-50 focus:bg-white transition-colors"
                                                required
                                            >
                                                <option value="">Select category</option>
                                                <option value="Agriculture">Agriculture</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Doctor">Doctor</option>
                                            </select>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Scholarship Category</span>
                                            </label>
                                            <select 
                                                name="scholarshipCategory" 
                                                defaultValue={selectedScholarship?.scholarshipCategory}
                                                className="select select-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                                                required
                                            >
                                                <option value="">Select category</option>
                                                <option value="Full fund">Full fund</option>
                                                <option value="Partial">Partial</option>
                                                <option value="Self-fund">Self-fund</option>
                                            </select>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Degree</span>
                                            </label>
                                            <select 
                                                name="degree" 
                                                defaultValue={selectedScholarship?.degree}
                                                className="select select-bordered w-full bg-gray-50 focus:bg-white transition-colors"
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
                                <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                                    <h4 className="font-semibold text-[#2C5F95] mb-4 text-sm uppercase tracking-wider">Financial Information</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="form-control">
                                            <label className="label py-1">
                                                <span className="label-text text-[13px] font-medium">Tuition Fee ($)</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="tuitionFee"
                                                defaultValue={selectedScholarship?.tuitionFee}
                                                className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Application Fee ($)</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="applicationFee"
                                                defaultValue={selectedScholarship?.applicationFee}
                                                className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Service Charge ($)</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="serviceCharge"
                                                defaultValue={selectedScholarship?.serviceCharge}
                                                className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors"
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                                    <h4 className="font-semibold text-[#2C5F95] mb-4 text-sm uppercase tracking-wider">Description</h4>
                                    <div className="form-control">
                                        <textarea
                                            name="description"
                                            defaultValue={selectedScholarship?.description}
                                            className="textarea textarea-bordered h-32 bg-gray-50 focus:bg-white transition-colors"
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="sticky bottom-0 left-0 right-0 bg-gray-50 px-4 py-3 border-t mt-6 flex flex-row justify-end items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="btn btn-sm h-10 min-h-0 btn-outline text-[13px] px-6"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-sm h-10 min-h-0 bg-gradient-to-r from-[#2C5F95] to-[#13436F] hover:from-[#13436F] hover:to-[#2C5F95] text-white text-[13px] px-6 border-0"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setIsEditModalOpen(false)}>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
};

export default ManageScholarships;