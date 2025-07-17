import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ScholarshipTable = ({ scholarships, refetch }) => {
    const [selectedScholarship, setSelectedScholarship] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEditScholarship = async (e) => {
        e.preventDefault();
        const form = e.target;
        const updatedData = {
            scholarshipName: form.scholarshipName.value,
            universityName: form.universityName.value,
            subjectCategory: form.category.value,
            degree: form.degree.value,
            applicationFee: parseFloat(form.fee.value)
        };

        try {
            await axios.patch(`/scholarships/${selectedScholarship._id}`, updatedData);
            toast.success('Scholarship updated successfully!');
            setIsEditModalOpen(false);
            refetch();
        } catch (error) {
            toast.error(error.message || 'Failed to update scholarship');
        }
    };

    const handleDeleteScholarship = async (id) => {
        try {
            await axios.delete(`/scholarships/${id}`);
            toast.success('Scholarship deleted successfully!');
            refetch();
        } catch (error) {
            toast.error(error.message || 'Failed to delete scholarship');
        }
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="table bg-white">
                    <thead className="bg-[#2C5F95] text-white">
                        <tr>
                            <th>Scholarship Name</th>
                            <th>University</th>
                            <th>Category</th>
                            <th>Degree</th>
                            <th>Fee</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scholarships.map((scholarship) => (
                            <tr key={scholarship._id}>
                                <td className="font-medium">{scholarship.scholarshipName}</td>
                                <td>{scholarship.universityName}</td>
                                <td>{scholarship.subjectCategory}</td>
                                <td>{scholarship.degree}</td>
                                <td>${scholarship.applicationFee}</td>
                                <td className="space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedScholarship(scholarship);
                                            setIsDetailsModalOpen(true);
                                        }}
                                        className="btn btn-sm bg-[#2C5F95] hover:bg-[#13436F] text-white"
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedScholarship(scholarship);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteScholarship(scholarship._id)}
                                        className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            {isDetailsModalOpen && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Scholarship Details</h3>
                        <div className="space-y-3">
                            <p><span className="font-semibold">Scholarship Name:</span> {selectedScholarship?.scholarshipName}</p>
                            <p><span className="font-semibold">University:</span> {selectedScholarship?.universityName}</p>
                            <p><span className="font-semibold">Category:</span> {selectedScholarship?.subjectCategory}</p>
                            <p><span className="font-semibold">Degree:</span> {selectedScholarship?.degree}</p>
                            <p><span className="font-semibold">Application Fee:</span> ${selectedScholarship?.applicationFee}</p>
                            <p><span className="font-semibold">Service Charge:</span> ${selectedScholarship?.serviceCharge}</p>
                            <p><span className="font-semibold">Country:</span> {selectedScholarship?.country}</p>
                            <p><span className="font-semibold">City:</span> {selectedScholarship?.city}</p>
                            <p><span className="font-semibold">Rank:</span> {selectedScholarship?.rank}</p>
                            <p><span className="font-semibold">Deadline:</span> {selectedScholarship?.deadline}</p>
                        </div>
                        <div className="modal-action">
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="btn bg-[#2C5F95] hover:bg-[#13436F] text-white"
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
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Edit Scholarship</h3>
                        <form onSubmit={handleEditScholarship} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Scholarship Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="scholarshipName"
                                    defaultValue={selectedScholarship?.scholarshipName}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">University Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="universityName"
                                    defaultValue={selectedScholarship?.universityName}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Category</span>
                                </label>
                                <select
                                    name="category"
                                    defaultValue={selectedScholarship?.subjectCategory}
                                    className="select select-bordered w-full"
                                    required
                                >
                                    <option value="Engineering">Engineering</option>
                                    <option value="Medical">Medical</option>
                                    <option value="Business">Business</option>
                                    <option value="Arts">Arts</option>
                                    <option value="Science">Science</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Degree</span>
                                </label>
                                <select
                                    name="degree"
                                    defaultValue={selectedScholarship?.degree}
                                    className="select select-bordered w-full"
                                    required
                                >
                                    <option value="Bachelor">Bachelor</option>
                                    <option value="Master">Master</option>
                                    <option value="PhD">PhD</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Application Fee</span>
                                </label>
                                <input
                                    type="number"
                                    name="fee"
                                    defaultValue={selectedScholarship?.applicationFee}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="modal-action">
                                <button
                                    type="submit"
                                    className="btn bg-[#2C5F95] hover:bg-[#13436F] text-white"
                                >
                                    Update Scholarship
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setIsEditModalOpen(false)}>close</button>
                    </form>
                </dialog>
            )}
        </>
    );
};

export default ScholarshipTable; 