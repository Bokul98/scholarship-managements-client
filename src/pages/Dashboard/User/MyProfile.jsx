import useAuth from '../../../hooks/useAuth';

const MyProfile = () => {
    const { user: authUser } = useAuth();
    // Fallback for missing user
    if (!authUser) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="text-gray-500">No user found.</span>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-[60vh] bg-gray-50 px-2">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 flex flex-col items-center gap-4">
                {/* User Image */}
                {authUser.photoURL ? (
                    <img
                        src={authUser.photoURL}
                        alt={authUser.displayName}
                        className="w-24 h-24 rounded-full object-cover border-2 border-[#2C5F95] shadow"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-[#2C5F95] text-white flex items-center justify-center text-3xl font-bold shadow">
                        {authUser.displayName?.charAt(0) || authUser.email?.charAt(0)}
                    </div>
                )}
                {/* User Name */}
                <h2 className="text-xl font-bold text-gray-800 text-center">{authUser.displayName || 'No Name'}</h2>
                {/* User Role */}
                {authUser.role && authUser.role !== 'user' && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                        ${authUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                        authUser.role === 'moderator' ? 'bg-blue-100 text-blue-700' : ''}`}>
                        {authUser.role}
                    </span>
                )}
                {/* Other Info */}
                <div className="w-full mt-2 space-y-2">
                    <div className="flex items-center justify-between text-gray-600">
                        <span className="font-semibold">Email:</span>
                        <span>{authUser.email}</span>
                    </div>
                    {authUser.createdAt && (
                        <div className="flex items-center justify-between text-gray-600">
                            <span className="font-semibold">Joined:</span>
                            <span>{new Date(authUser.createdAt).toLocaleDateString()}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between text-gray-600">
                        <span className="font-semibold">Status:</span>
                        <span className="text-green-600 font-medium">Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile; 