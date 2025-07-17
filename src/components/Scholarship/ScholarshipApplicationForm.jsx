import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { applyForScholarship } from "../../api/scholarshipApi";
import useAuth from "../../hooks/useAuth";

const ScholarshipApplicationForm = ({ scholarshipId, onSuccess, applicationFee = 100, serviceCharge = 20 }) => {
    const { user } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const applicationData = {
                ...data,
                scholarshipId,
                userId: user.uid, // Changed from applicantId to userId to match server schema
                applicationFee,
                serviceCharge,
                status: "pending",
                submittedAt: new Date().toISOString()
            };

            await applyForScholarship(applicationData);
            onSuccess();
        } catch (error) {
            console.error("Application submission failed:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Full Name
                </label>
                <input
                    type="text"
                    {...register("fullName", { required: "Full name is required" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.fullName.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    type="email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                        },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                </label>
                <input
                    type="tel"
                    {...register("phone", { required: "Phone number is required" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Address
                </label>
                <textarea
                    {...register("address", { required: "Address is required" })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.address.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Current Academic Level
                </label>
                <select
                    {...register("academicLevel", {
                        required: "Academic level is required",
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="">Select level</option>
                    <option value="high_school">High School</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="phd">PhD</option>
                </select>
                {errors.academicLevel && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.academicLevel.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Current GPA
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    {...register("gpa", {
                        required: "GPA is required",
                        min: {
                            value: 0,
                            message: "GPA must be between 0 and 4",
                        },
                        max: {
                            value: 4,
                            message: "GPA must be between 0 and 4",
                        },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.gpa && (
                    <p className="mt-1 text-sm text-red-600">{errors.gpa.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
        </form>
    );
};

ScholarshipApplicationForm.propTypes = {
    scholarshipId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    applicationFee: PropTypes.number,
    serviceCharge: PropTypes.number,
};

export default ScholarshipApplicationForm;