import { useState, useEffect, useCallback } from 'react';
import { FaEdit } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getFirebaseToken } from '../../../utils/getFirebaseToken';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { toast } from 'react-toastify';

const MyApplications = () => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');

    const fetchApplications = useCallback(async () => {
        if (!user) return;
        
        try {
            const token = await getFirebaseToken();
            if (!token) {
                toast.error('No authentication token found');
                return;
            }

            // Only show loading on initial load, not on refreshes
            if (applications.length === 0) {
                setLoading(true);
            }

            const response = await axios.get(
                `https://server-kohl-pi.vercel.app/api/applications/user/${user.uid}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data) {
                console.log('Fetched applications:', response.data); // Debug log
                // Only update if data has changed
                const currentData = JSON.stringify(applications);
                const newData = JSON.stringify(response.data);
                
                if (currentData !== newData) {
                    setApplications(response.data);
                }
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load your applications');
        } finally {
            setLoading(false);
        }
    }, [user, applications]);

    // Initial load
    useEffect(() => {
        if (user) {
            fetchApplications();
        }
    }, [user, fetchApplications]);

    // No auto refresh

    const handleEdit = async (application) => {
        if (application.status !== 'pending') {
            Swal.fire({
                icon: 'error',
                title: 'Cannot Edit Application',
                text: 'You cannot edit this application as it is already in processing.',
                confirmButtonColor: '#2C5F95'
            });
            return;
        }
        
        setSelectedApplication(application);
        // Open a modal with pre-filled data
        const { value: formData } = await Swal.fire({
            title: 'Edit Application',
            html: `
                <div class="space-y-4 max-h-[70vh] overflow-y-auto p-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input id="phoneNumber" class="w-full p-2 border rounded" value="${application.phoneNumber || ''}" placeholder="+1234567890">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select id="gender" class="w-full p-2 border rounded">
                            <option value="male" ${application.gender === 'male' ? 'selected' : ''}>Male</option>
                            <option value="female" ${application.gender === 'female' ? 'selected' : ''}>Female</option>
                            <option value="other" ${application.gender === 'other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Applying Degree</label>
                        <input id="applyingDegree" class="w-full p-2 border rounded" value="${application.applyingDegree || ''}" placeholder="Bachelor/Masters/PhD">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">SSC Result</label>
                        <input id="sscResult" type="number" step="0.01" class="w-full p-2 border rounded" value="${application.sscResult || ''}" placeholder="4.50">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">HSC Result</label>
                        <input id="hscResult" type="number" step="0.01" class="w-full p-2 border rounded" value="${application.hscResult || ''}" placeholder="4.50">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Study Gap (Years)</label>
                        <input id="studyGap" class="w-full p-2 border rounded" value="${application.studyGap || ''}" placeholder="2">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">University Name (Disabled)</label>
                        <input id="universityName" class="w-full p-2 border rounded bg-gray-200" value="${application.universityName || ''}" placeholder="University Name" disabled>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Scholarship Category (Disabled)</label>
                        <select id="scholarshipCategory" class="w-full p-2 border rounded bg-gray-200" disabled>
                            <option value="Full" ${application.scholarshipCategory === 'Full' ? 'selected' : ''}>Full</option>
                            <option value="Partial" ${application.scholarshipCategory === 'Partial' ? 'selected' : ''}>Partial</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Subject Category (Disabled)</label>
                        <input id="subjectCategory" class="w-full p-2 border rounded bg-gray-200" value="${application.subjectCategory || ''}" placeholder="Engineering/Medical/Business" disabled>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fees & Payment Status (Disabled)</label>
                        <div class="space-y-2">
                            <input 
                                id="applicationFee" 
                                class="w-full p-2 border rounded bg-gray-200" 
                                value="Application Fee: $${application.payment?.applicationFee || 'Pending'}" 
                                disabled
                            >
                            <input 
                                id="serviceCharge" 
                                class="w-full p-2 border rounded bg-gray-200" 
                                value="Service Charge: $${application.payment?.serviceCharge || 'Pending'}" 
                                disabled
                            >
                            ${application.payment?.totalPaid ? 
                                `<input 
                                    id="totalPaid" 
                                    class="w-full p-2 border rounded bg-gray-200 text-green-600" 
                                    value="Total Paid: $${application.payment.totalPaid}" 
                                    disabled
                                >` : ''
                            }
                        </div>
                    </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <div class="space-y-2">
                            <input id="village" class="w-full p-2 border rounded" value="${application.address?.village || ''}" placeholder="Village/Street">
                            <input id="district" class="w-full p-2 border rounded" value="${application.address?.district || ''}" placeholder="District/City">
                            <input id="country" class="w-full p-2 border rounded" value="${application.address?.country || ''}" placeholder="Country">
                        </div>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update',
            confirmButtonColor: '#2C5F95',
            preConfirm: () => {
                const data = {
                    phoneNumber: document.getElementById('phoneNumber').value.trim(),
                    gender: document.getElementById('gender').value,
                    applyingDegree: document.getElementById('applyingDegree').value.trim(),
                    sscResult: parseFloat(document.getElementById('sscResult').value),
                    hscResult: parseFloat(document.getElementById('hscResult').value),
                    studyGap: document.getElementById('studyGap').value.trim(),
                    universityName: document.getElementById('universityName').value.trim(),
                    scholarshipCategory: document.getElementById('scholarshipCategory').value,
                    subjectCategory: document.getElementById('subjectCategory').value.trim(),
                    address: {
                        village: document.getElementById('village').value.trim(),
                        district: document.getElementById('district').value.trim(),
                        country: document.getElementById('country').value.trim()
                    }
                };

                // Basic validation
                if (!data.phoneNumber) {
                    Swal.showValidationMessage('Phone number is required');
                    return false;
                }
                if (!data.applyingDegree) {
                    Swal.showValidationMessage('Applying degree is required');
                    return false;
                }
                if (!data.universityName) {
                    Swal.showValidationMessage('University name is required');
                    return false;
                }
                if (!data.subjectCategory) {
                    Swal.showValidationMessage('Subject category is required');
                    return false;
                }

                // Validate numeric fields
                if (isNaN(data.sscResult) || data.sscResult < 0 || data.sscResult > 5) {
                    Swal.showValidationMessage('SSC result must be between 0 and 5');
                    return false;
                }
                if (isNaN(data.hscResult) || data.hscResult < 0 || data.hscResult > 5) {
                    Swal.showValidationMessage('HSC result must be between 0 and 5');
                    return false;
                }

                // Validate address
                if (!data.address.village || !data.address.district || !data.address.country) {
                    Swal.showValidationMessage('All address fields are required');
                    return false;
                }

                return data;
            }
        });

        if (formData) {
            try {
                // Validate required fields
                if (!formData.phoneNumber?.trim()) {
                    throw new Error('Phone number is required');
                }
                if (!formData.gender) {
                    throw new Error('Gender is required');
                }
                if (!formData.applyingDegree?.trim()) {
                    throw new Error('Applying degree is required');
                }
                if (!formData.universityName?.trim()) {
                    throw new Error('University name is required');
                }
                if (!formData.subjectCategory?.trim()) {
                    throw new Error('Subject category is required');
                }
                if (!formData.scholarshipCategory) {
                    throw new Error('Scholarship category is required');
                }

                // Validate numeric fields
                if (isNaN(formData.sscResult) || formData.sscResult < 0 || formData.sscResult > 5) {
                    throw new Error('SSC result must be between 0 and 5');
                }
                if (isNaN(formData.hscResult) || formData.hscResult < 0 || formData.hscResult > 5) {
                    throw new Error('HSC result must be between 0 and 5');
                }

                // Validate address
                if (!formData.address.village?.trim() || !formData.address.district?.trim() || !formData.address.country?.trim()) {
                    throw new Error('All address fields are required');
                }

                const token = await getFirebaseToken();
                
                // Convert number strings to actual numbers
                const dataToSend = {
                    ...formData,
                    sscResult: Number(formData.sscResult),
                    hscResult: Number(formData.hscResult),
                    studyGap: Number(formData.studyGap) || formData.studyGap
                };

                // Log the request data
                console.log('Sending update request:', {
                    url: `https://server-kohl-pi.vercel.app/api/applications/${application._id}`,
                    data: dataToSend
                });

                const response = await axios.patch(
                    `https://server-kohl-pi.vercel.app/api/applications/${application._id}`,
                    dataToSend,
                    {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Updated Successfully',
                        text: 'Your application has been updated.',
                        confirmButtonColor: '#2C5F95'
                    });

                    // Refresh the applications list
                    fetchApplications();
                }
            } catch (error) {
                console.error('Error updating application:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || error.message || 'Failed to update application. Please try again.',
                    confirmButtonColor: '#2C5F95'
                });
            }
        }
    };

    const handleCancel = async (applicationId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#2C5F95',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, cancel it!'
            });

            if (result.isConfirmed) {
                const token = await getFirebaseToken();
                const response = await axios.patch(`https://server-kohl-pi.vercel.app/api/applications/${applicationId}/cancel`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data) {
                    // Update local state by removing the cancelled application
                    setApplications(prevApplications => 
                        prevApplications.filter(app => app._id !== applicationId)
                    );

                    Swal.fire(
                        'Cancelled!',
                        'Your application has been cancelled.',
                        'success'
                    );
                }
            }
        } catch (error) {
            console.error('Error cancelling application:', error);
            const errorMessage = error.response?.data?.message || 'Failed to cancel application';
            Swal.fire(
                'Error!',
                errorMessage,
                'error'
            );
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Validate required fields
            if (!selectedApplication) {
                toast.error('No application selected');
                return;
            }
            if (!rating) {
                toast.error('Please provide a rating');
                return;
            }
            if (!reviewComment?.trim()) {
                toast.error('Please provide a review comment');
                return;
            }

            const token = await getFirebaseToken();
            if (!token) {
                toast.error('Authentication token not found');
                return;
            }

            // Prepare simplified review data
            const reviewData = {
                userId: user?.uid || '',
                scholarshipId: selectedApplication.scholarshipId || selectedApplication._id,  // Fallback to application ID if scholarshipId not available
                scholarshipName: selectedApplication.scholarshipTitle || selectedApplication.scholarshipName || 'Scholarship',
                universityId: selectedApplication.universityId || 'default',  // Provide a default value since it's required
                universityName: selectedApplication.universityName,
                rating: Number(rating),
                comment: reviewComment.trim(),
                reviewDate: new Date().toISOString(),
                userName: user?.displayName || '',
                userEmail: user?.email || '',
                userImage: user?.photoURL || null
            };

            // Submit review
            const response = await axios.post(
                `https://server-kohl-pi.vercel.app/api/reviews`,
                reviewData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                // Mark application as reviewed
                await axios.patch(
                    `https://server-kohl-pi.vercel.app/api/applications/${selectedApplication._id}`,
                    { isReviewed: true },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                toast.success('Review submitted successfully');
                setIsReviewModalOpen(false);
                setRating(0);
                setReviewComment('');
                
                // Refresh the applications list
                fetchApplications();
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit review';
            toast.error(errorMessage);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (

        <div className="p-4 max-w-full">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#2C5F95] tracking-tight">My Applications</h2>
            {applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2a4 4 0 004 4h2a4 4 0 004-4z" /></svg>
                    <p className="text-lg text-gray-500">No applications found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200">
                        <thead className="bg-gradient-to-r from-[#2C5F95] to-[#13436F] text-white">
                            <tr>
                                <th className="py-4 px-4 text-left font-semibold">University</th>
                                <th className="py-4 px-4 text-left font-semibold">Country</th>
                                <th className="py-4 px-4 text-left font-semibold">Subject</th>
                                <th className="py-4 px-4 text-left font-semibold">Degree</th>
                                <th className="py-4 px-4 text-left font-semibold">Fees</th>
                                <th className="py-4 px-4 text-left font-semibold">Status</th>
                                <th className="py-4 px-4 text-left font-semibold">Feedback</th>
                                <th className="py-4 px-4 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((application) => (
                                <tr key={application._id} className="border-b last:border-b-0 hover:bg-gray-50 transition-all">
                                    <td className="py-3 px-4 font-semibold text-[#2C5F95]">{application.universityName}</td>
                                    <td className="py-3 px-4 text-gray-600">{application.address?.country}</td>
                                    <td className="py-3 px-4 text-gray-700">{application.subjectCategory}</td>
                                    <td className="py-3 px-4 text-gray-700">{application.applyingDegree}</td>
                                    <td className="py-3 px-4">
                                        <div className="space-y-1">
                                            <span className="block text-sm">App: <span className="font-bold">${application.payment?.applicationFee || 'Pending'}</span></span>
                                            <span className="block text-xs text-gray-500">Service: ${application.payment?.serviceCharge || 'Pending'}</span>
                                            {application.payment?.totalPaid && (
                                                <span className="block text-xs text-green-600 font-semibold">Paid: ${application.payment.totalPaid}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusColor(application.status)}`}>{application.status}</span>
                                    </td>
                                    <td className="py-3 px-4 max-w-xs">
                                        {application.feedback ? (
                                            <span className="text-xs text-gray-700 bg-blue-50 px-2 py-1 rounded-lg" title={application.feedback}>{application.feedback}</span>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Not submitted</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedApplication(application);
                                                    setIsDetailsModalOpen(true);
                                                }}
                                                className="px-3 py-1 text-xs rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold shadow-sm transition-colors"
                                            >
                                                Details
                                            </button>
                                            {application.status === 'pending' && (
                                                <button
                                                    onClick={() => handleEdit(application)}
                                                    className="px-3 py-1 text-xs rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-semibold shadow-sm flex items-center gap-1"
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                            )}
                                            {application.status === 'pending' && (
                                                <button
                                                    onClick={() => handleCancel(application._id)}
                                                    className="px-3 py-1 text-xs rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-semibold shadow-sm"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            {(application.status === 'approved' || application.status === 'rejected') && !application.isReviewed && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedApplication(application);
                                                        setIsReviewModalOpen(true);
                                                    }}
                                                    className="px-3 py-1 text-xs rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold shadow-sm"
                                                >
                                                    Add Review
                                                </button>
                                            )}
                                            {!(application.status === 'approved' || application.status === 'rejected') && (
                                                <button
                                                    className="px-3 py-1 text-xs rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed font-semibold shadow-sm"
                                                    title="Reviews can only be added for approved or rejected applications"
                                                >
                                                    Add Review
                                                </button>
                                            )}
                                            {((application.status === 'approved' || application.status === 'rejected') && application.isReviewed) && (
                                                <button
                                                    className="px-3 py-1 text-xs rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed font-semibold shadow-sm"
                                                    title="This application has already been reviewed"
                                                >
                                                    Add Review
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Details Modal */}
            {isDetailsModalOpen && selectedApplication && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 overflow-y-auto p-2 sm:p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto my-auto">
                        <div className="mb-6 flex justify-between items-center border-b border-gray-200 pb-3">
                            <h3 className="text-2xl font-bold text-gray-800">Application Details</h3>
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-6">
                            {selectedApplication.feedback && (
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-semibold text-blue-800 mb-2">Application Feedback</h4>
                                    <p className="text-blue-600 text-sm">{selectedApplication.feedback}</p>
                                </div>
                            )}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-lg text-gray-800 border-b border-gray-300 pb-2 mb-3">Personal Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                                        <p className="text-gray-800 font-medium">{selectedApplication.phoneNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Gender</p>
                                        <p className="text-gray-800 font-medium">{selectedApplication.gender}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-lg text-gray-800 border-b border-gray-300 pb-2 mb-3">Address</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Village/Street</p>
                                        <p className="text-gray-800 font-medium">{selectedApplication.address?.village}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">District/City</p>
                                        <p className="text-gray-800 font-medium">{selectedApplication.address?.district}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Country</p>
                                        <p className="text-gray-800 font-medium">{selectedApplication.address?.country}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-lg text-gray-800 border-b border-gray-300 pb-2 mb-3">Academic Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Applying Degree</p>
                                        <p className="text-gray-800 font-medium">{selectedApplication.applyingDegree}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">SSC Result</p>
                                        <p className="text-gray-800 font-medium">{selectedApplication.sscResult}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">HSC Result</p>
                                        <p className="text-gray-800 font-medium">{selectedApplication.hscResult}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Study Gap</p>
                                        <p className="text-gray-800 font-medium">{selectedApplication.studyGap || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-lg text-gray-800 border-b border-gray-300 pb-2 mb-3">Scholarship Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">University Name</p>
                                        <p className="text-gray-800 font-medium">{selectedApplication.universityName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Scholarship Category</p>
                                        <p className="text-gray-800 font-medium">{selectedApplication.scholarshipCategory}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Subject Category</p>
                                        <p className="text-gray-800 font-medium">{selectedApplication.subjectCategory}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-lg text-gray-800 border-b border-gray-300 pb-2 mb-3">Fees & Payment</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Application Fee</p>
                                        <p className="text-gray-800 font-medium">
                                            ${selectedApplication.payment?.applicationFee || 'Pending'}
                                            {!selectedApplication.payment?.applicationFee && (
                                                <span className="text-xs text-yellow-600 ml-2">(Payment Required)</span>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Service Charge</p>
                                        <p className="text-gray-800 font-medium">
                                            ${selectedApplication.payment?.serviceCharge || 'Pending'}
                                            {!selectedApplication.payment?.serviceCharge && (
                                                <span className="text-xs text-yellow-600 ml-2">(Payment Required)</span>
                                            )}
                                        </p>
                                    </div>
                                    {selectedApplication.payment?.totalPaid && (
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount Paid</p>
                                            <p className="text-green-600 font-medium">${selectedApplication.payment.totalPaid}</p>
                                            <p className="text-xs text-gray-500 mt-1">Payment Date: {new Date(selectedApplication.payment.paidAt).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-lg text-gray-800 border-b border-gray-300 pb-2 mb-3">Status</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>{selectedApplication.status}</span>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {isReviewModalOpen && selectedApplication && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 overflow-y-auto p-2 sm:p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto my-auto">
                        <div className="mb-6 flex justify-between items-center border-b border-gray-200 pb-3">
                            <h3 className="text-2xl font-bold text-gray-800">Submit Review</h3>
                            <button
                                onClick={() => setIsReviewModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Scholarship Information */}
                        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-lg font-semibold mb-3 text-gray-800">Scholarship Details</h4>
                            <div className="space-y-2">
                                <p className="text-sm">
                                    <span className="font-medium">University:</span>{" "}
                                    {selectedApplication.universityName}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Scholarship:</span>{" "}
                                    {selectedApplication.scholarshipName}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Review Date:</span>{" "}
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Reviewer Information */}
                        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-lg font-semibold mb-3 text-gray-800">Reviewer Information</h4>
                            <div className="flex items-center space-x-4">
                                {user?.photoURL && (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                )}
                                <div className="space-y-1">
                                    <p className="font-medium">{user?.displayName}</p>
                                    <p className="text-sm text-gray-600">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleReviewSubmit} className="space-y-5">
                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-3xl focus:outline-none ${
                                                star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                            } hover:text-yellow-400 transition-colors`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Review Comment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Review Comment <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    rows="4"
                                    placeholder="Share your experience with this scholarship..."
                                    required
                                ></textarea>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsReviewModalOpen(false);
                                        setRating(0);
                                        setReviewComment('');
                                    }}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-700 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#2C5F95] hover:bg-[#13436F] text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!rating || !reviewComment.trim()}
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyApplications;