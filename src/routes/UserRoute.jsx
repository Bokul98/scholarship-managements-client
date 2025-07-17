import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';

const UserRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { userData, roleLoading } = useUserRole();

    if (loading || roleLoading) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    if (user && userData?.role === 'user') {
        return children;
    }

    return <Navigate to="/dashboard/user/my-profile" replace />;
};

export default UserRoute; 