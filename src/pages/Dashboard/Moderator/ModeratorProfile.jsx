import { FaEnvelope, FaUserShield, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';

const ModeratorProfile = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Scholarships Added', value: '24' },
        { label: 'Applications Reviewed', value: '156' },
        { label: 'Reviews Managed', value: '89' },
        { label: 'Active Days', value: '120' }
    ];

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-[#2C5F95] to-[#13436F] text-white rounded-t-lg p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName}
                                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-white text-[#2C5F95] flex items-center justify-center text-4xl font-semibold">
                                    {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                                </div>
                            )}
                            <span className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></span>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold">{user?.displayName || 'Moderator'}</h2>
                            <div className="flex items-center gap-2 justify-center md:justify-start mt-1">
                                <FaEnvelope />
                                <p>{user?.email}</p>
                            </div>
                            <div className="flex items-center gap-2 justify-center md:justify-start mt-1">
                                <FaUserShield />
                                <p>Scholarship Moderator</p>
                            </div>
                            <div className="flex items-center gap-2 justify-center md:justify-start mt-1">
                                <FaCalendarAlt />
                                <p>Joined January 2024</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-3xl font-bold text-[#2C5F95]">{stat.value}</h3>
                            <p className="text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Role & Responsibilities */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-4">Role & Responsibilities</h3>
                    <div className="grid gap-3">
                        <div className="flex items-start gap-3">
                            <FaCheckCircle className="text-[#2C5F95] mt-1" />
                            <p>Review and manage scholarship applications from students</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <FaCheckCircle className="text-[#2C5F95] mt-1" />
                            <p>Add and update scholarship opportunities in the system</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <FaCheckCircle className="text-[#2C5F95] mt-1" />
                            <p>Provide feedback on student applications and manage their status</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <FaCheckCircle className="text-[#2C5F95] mt-1" />
                            <p>Monitor and moderate user reviews and feedback</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                                <p className="font-medium">Approved Harvard Scholarship Application</p>
                                <p className="text-sm text-gray-600">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                                <p className="font-medium">Added New MIT Scholarship</p>
                                <p className="text-sm text-gray-600">5 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <div>
                                <p className="font-medium">Updated Stanford Scholarship Details</p>
                                <p className="text-sm text-gray-600">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModeratorProfile; 