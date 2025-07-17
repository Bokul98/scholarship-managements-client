import useAuth from '../../../hooks/useAuth';

const AdminProfile = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#2C5F95] mb-4 md:mb-6 text-center sm:text-left">
                Admin Profile
            </h2>

            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-4 md:p-6 lg:p-8">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                    {user?.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-[#2C5F95]/10 shadow-sm"
                        />
                    ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#2C5F95] text-white flex items-center justify-center text-2xl md:text-3xl font-bold shadow-sm">
                            {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                        </div>
                    )}
                    <div className="text-center sm:text-left space-y-2">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">{user?.displayName || 'Admin User'}</h3>
                        <p className="text-xs md:text-sm text-gray-500">{user?.email}</p>
                        <span className="inline-block px-3 py-1 bg-[#2C5F95] text-white text-xs font-medium rounded-full shadow-sm">
                            Administrator
                        </span>
                    </div>
                </div>

                {/* Role & Permissions */}
                <div className="mt-6 md:mt-8 border-t pt-4 md:pt-6">
                    <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Role & Permissions</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc list-inside text-gray-600 text-sm md:text-base">
                        <li>Full system access</li>
                        <li>User management</li>
                        <li>Application management</li>
                        <li>Scholarship management</li>
                        <li>Review management</li>
                    </ul>
                </div>

                {/* Account Info */}
                <div className="mt-6 md:mt-8 border-t pt-4 md:pt-6">
                    <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Account Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 text-sm md:text-base">
                        <p><span className="font-medium">Account Created:</span> January 1, 2024</p>
                        <p><span className="font-medium">Last Login:</span> {new Date().toLocaleDateString()}</p>
                        <p>
                            <span className="font-medium">Status:</span>{' '}
                            <span className="text-green-600 font-medium">Active</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
