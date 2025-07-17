import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ApplicationTable = ({ applications, refetch }) => {
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        const feedback = e.target.feedback.value;

        try {
            await axios.patch(`/applications/${selectedApplication._id}`, {
                feedback,
                status: e.target.status.value
            });
            toast.success('Feedback submitted successfully!');
            setIsFeedbackModalOpen(false);
            refetch();
        } catch (error) {
            toast.error(error.message || 'Failed to submit feedback');
        }
    };

    const handleCancelApplication = async (id) => {
        try {
            await axios.patch(`/applications/${id}`, { status: 'cancelled' });
            toast.success('Application cancelled successfully!');
            refetch();
        } catch (error) {
            toast.error(error.message || 'Failed to cancel application');
        }
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="table bg-white">
                    <thead className="bg-[#2C5F95] text-white">
                        <tr>
                            <th>University</th>
                            <th>Degree</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((application) => (
                            <tr key={application._id}>
                                <td className="font-medium">{application.universityName}</td>
                                <td>{application.degree}</td>
                                <td>{application.subjectCategory}</td>
                                <td>
                                    <span className={`badge ${
                                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    } px-3 py-1 rounded-full capitalize`}>
                                        {application.status}
                                    </span>
                                </td>
                                <td className="space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedApplication(application);
                                            setIsDetailsModalOpen(true);
                                        }}
                                        className="btn btn-sm bg-[#2C5F95] hover:bg-[#13436F] text-white"
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedApplication(application);
                                            setIsFeedbackModalOpen(true);
                                        }}
                                        className="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
                                    >
                                        Feedback
                                    </button>
                                    <button
                                        onClick={() => handleCancelApplication(application._id)}
                                        className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        Cancel
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
                        <h3 className="font-bold text-lg mb-4">Application Details</h3>
                        <div className="space-y-3">
                            <p><span className="font-semibold">University:</span> {selectedApplication?.universityName}</p>
                            <p><span className="font-semibold">Degree:</span> {selectedApplication?.degree}</p>
                            <p><span className="font-semibold">Category:</span> {selectedApplication?.subjectCategory}</p>
                            <p><span className="font-semibold">Status:</span> {selectedApplication?.status}</p>
                            <p><span className="font-semibold">Application Fee:</span> ${selectedApplication?.applicationFee}</p>
                            <p><span className="font-semibold">Service Charge:</span> ${selectedApplication?.serviceCharge}</p>
                            {selectedApplication?.feedback && (
                                <p><span className="font-semibold">Feedback:</span> {selectedApplication.feedback}</p>
                            )}
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

            {/* Feedback Modal */}
            {isFeedbackModalOpen && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Provide Feedback</h3>
                        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Status</span>
                                </label>
                                <select name="status" className="select select-bordered w-full" required>
                                    <option value="approved">Approve</option>
                                    <option value="rejected">Reject</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Feedback</span>
                                </label>
                                <textarea
                                    name="feedback"
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Write your feedback here..."
                                    required
                                ></textarea>
                            </div>
                            <div className="modal-action">
                                <button
                                    type="submit"
                                    className="btn bg-[#2C5F95] hover:bg-[#13436F] text-white"
                                >
                                    Submit Feedback
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsFeedbackModalOpen(false)}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setIsFeedbackModalOpen(false)}>close</button>
                    </form>
                </dialog>
            )}
        </>
    );
};

export default ApplicationTable; 