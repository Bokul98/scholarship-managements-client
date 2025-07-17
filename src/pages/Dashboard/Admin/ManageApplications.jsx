import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaEye, FaCommentAlt, FaBan } from 'react-icons/fa';

const ManageApplications = () => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [filteredApplications, setFilteredApplications] = useState([]);

    const { data: applications = [], isLoading, refetch } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const token = localStorage.getItem('access-token');
            const res = await axios.get('https://server-kohl-pi.vercel.app/api/applications', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return res.data;
        }
    });

    useEffect(() => {
        if (applications.length > 0) {
            let sorted = [...applications];
            switch (sortBy) {
                case 'newest':
                    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                case 'oldest':
                    sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    break;
                case 'deadline-closest':
                    sorted.sort((a, b) => new Date(a.scholarshipDeadline) - new Date(b.scholarshipDeadline));
                    break;
                case 'deadline-furthest':
                    sorted.sort((a, b) => new Date(b.scholarshipDeadline) - new Date(a.scholarshipDeadline));
                    break;
                default:
                    break;
            }
            setFilteredApplications(sorted);
        }
    }, [applications, sortBy]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('access-token');
            if (!token) {
                toast.error('No authentication token found');
                return;
            }

            const response = await axios.patch(
                `https://server-kohl-pi.vercel.app/api/applications/${id}/status`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success(`Status updated to ${newStatus}`);
                refetch(); // Refresh the data
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleShowDetails = (application) => {
        setSelectedApplication(application);
        setIsDetailsModalOpen(true);
    };

    const handleShowFeedback = (application) => {
        setSelectedApplication(application);
        setIsFeedbackModalOpen(true);
        setFeedback('');
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access-token');
            if (!token) {
                toast.error('Authentication token not found');
                return;
            }

            const response = await axios.patch(
                `https://server-kohl-pi.vercel.app/api/applications/feedback/${selectedApplication._id}`,
                {
                    feedback,
                    status: 'processing'
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setIsFeedbackModalOpen(false);
                await Swal.fire({
                    icon: 'success',
                    title: 'Feedback Sent!',
                    text: 'Your feedback has been sent to the applicant.',
                    showConfirmButton: false,
                    timer: 1500
                });
                refetch();
                setFeedback('');
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
            toast.error(error.response?.data?.message || 'Failed to send feedback');
        }
    };

    const handleCancel = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This will reject the application. This action cannot be undone!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, reject it!'
            });

            if (result.isConfirmed) {
                const token = localStorage.getItem('access-token');
                await axios.patch(
                    `https://server-kohl-pi.vercel.app/api/applications/${id}/status`,
                    { 
                        status: 'rejected',
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                toast.success('Application rejected successfully');
                refetch();
            }
        } catch (error) {
            console.error('Error rejecting application:', error);
            toast.error('Failed to reject application');
        }
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-[#2C5F95]"></span>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Manage Applications</h2>
            
            {/* Add sorting dropdown */}
            <div className="flex justify-center mb-6">
                <select 
                    className="select select-bordered w-full max-w-xs"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="newest">Newest Applications First</option>
                    <option value="oldest">Oldest Applications First</option>
                    <option value="deadline-closest">Closest Deadline First</option>
                    <option value="deadline-furthest">Furthest Deadline First</option>
                </select>
            </div>
            
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>University & Program</th>
                            <th>Status</th>
                            <th>Application Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplications.map((application) => (
                            <tr key={application._id}>
                                <td>
                                    <div className="font-medium">{application.userName}</div>
                                    <div className="text-sm text-gray-500">{application.userEmail}</div>
                                    <div className="text-sm text-gray-500">{application.phoneNumber}</div>
                                </td>
                                <td>
                                    <div>{application.universityName}</div>
                                    <div className="text-sm text-gray-500">Degree: {application.applyingDegree}</div>
                                    <div className="text-sm text-gray-500">Category: {application.scholarshipCategory}</div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                            {application.status || 'Pending'}
                                        </span>
                                        <select 
                                            className="select select-bordered select-sm w-32"
                                            value={application.status || 'pending'}
                                            onChange={(e) => handleStatusChange(application._id, e.target.value)}
                                            disabled={application.status === 'rejected'}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="approved">Approved</option>
                                        </select>
                                    </div>
                                </td>
                                <td>
                                    {new Date(application.createdAt).toLocaleDateString()}
                                </td>
                                <td className="space-x-2">
                                    <button
                                        onClick={() => handleShowDetails(application)}
                                        className="btn btn-sm text-white bg-[#2C5F95] hover:bg-[#13436F]"
                                        title="View Details"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => handleShowFeedback(application)}
                                        className="btn btn-sm text-white bg-[#4CAF50] hover:bg-[#388E3C]"
                                        title="Send Feedback"
                                        disabled={application.status === 'rejected'}
                                    >
                                        <FaCommentAlt />
                                    </button>
                                    <button
                                        onClick={() => handleCancel(application._id)}
                                        className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                                        title="Reject Application"
                                        disabled={application.status === 'rejected'}
                                    >
                                        <FaBan />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            {isDetailsModalOpen && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
                        <h3 className="text-xl font-semibold mb-4">Application Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold">Applicant Name:</p>
                                <p>{selectedApplication.userName}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Email:</p>
                                <p>{selectedApplication.userEmail}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Phone:</p>
                                <p>{selectedApplication.phoneNumber}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Gender:</p>
                                <p className="capitalize">{selectedApplication.gender}</p>
                            </div>
                            <div>
                                <p className="font-semibold">University:</p>
                                <p>{selectedApplication.universityName}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Applying Degree:</p>
                                <p>{selectedApplication.applyingDegree}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Results:</p>
                                <p>SSC: {selectedApplication.sscResult}, HSC: {selectedApplication.hscResult}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Study Gap:</p>
                                <p>{selectedApplication.studyGap} years</p>
                            </div>
                            <div className="col-span-2">
                                <p className="font-semibold">Address:</p>
                                <p>{selectedApplication.address?.village}, {selectedApplication.address?.district}, {selectedApplication.address?.country}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="font-semibold">Payment Info:</p>
                                <p>Application Fee: ${selectedApplication.payment?.applicationFee}, Service Charge: ${selectedApplication.payment?.serviceCharge}</p>
                                <p>Total Paid: ${selectedApplication.payment?.totalPaid}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Status:</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                                    {selectedApplication.status || 'Pending'}
                                </span>
                            </div>
                            {selectedApplication.feedback && (
                                <div className="col-span-2">
                                    <p className="font-semibold">Previous Feedback:</p>
                                    <p className="text-gray-700">{selectedApplication.feedback}</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setIsDetailsModalOpen(false)}
                            className="btn bg-[#2C5F95] hover:bg-[#13436F] text-white mt-6"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Feedback Modal */}
            {isFeedbackModalOpen && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
                        <h3 className="text-xl font-semibold mb-4">Send Feedback</h3>
                        <form onSubmit={handleFeedbackSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Feedback Message</span>
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="textarea textarea-bordered h-32"
                                    placeholder="Enter your feedback here..."
                                    required
                                ></textarea>
                            </div>
                            <div className="mt-6 space-x-2">
                                <button
                                    type="submit"
                                    className="btn bg-[#4CAF50] hover:bg-[#388E3C] text-white"
                                >
                                    Send Feedback
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsFeedbackModalOpen(false)}
                                    className="btn bg-gray-500 hover:bg-gray-600 text-white"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageApplications;