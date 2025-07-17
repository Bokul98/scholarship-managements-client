import { useState } from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';
import useUserRole from '../hooks/useUserRole';
import useAuth from '../hooks/useAuth';
import {
    FaUser, FaPlus, FaGraduationCap, FaClipboardList,
    FaUsers, FaStar, FaBars, FaTimes, FaHome, FaChartBar
} from 'react-icons/fa';

const DashboardLayout = () => {
    const { role } = useUserRole();
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const adminLinks = [
        { to: '/dashboard/admin/profile', text: 'Admin Profile', icon: <FaUser /> },
        { to: '/dashboard/admin/analytics', text: 'Analytics', icon: <FaChartBar /> },
        { to: '/dashboard/admin/add-scholarship', text: 'Add Scholarship', icon: <FaPlus /> },
        { to: '/dashboard/admin/manage-scholarships', text: 'Manage Scholarships', icon: <FaGraduationCap /> },
        { to: '/dashboard/admin/manage-applications', text: 'Manage Applications', icon: <FaClipboardList /> },
        { to: '/dashboard/admin/manage-users', text: 'Manage Users', icon: <FaUsers /> },
        { to: '/dashboard/admin/manage-reviews', text: 'Manage Reviews', icon: <FaStar /> }
    ];

    const moderatorLinks = [
        { to: '/dashboard/moderator/profile', text: 'My Profile', icon: <FaUser /> },
        { to: '/dashboard/moderator/manage-scholarships', text: 'Manage Scholarships', icon: <FaGraduationCap /> },
        { to: '/dashboard/moderator/all-reviews', text: 'All Reviews', icon: <FaStar /> },
        { to: '/dashboard/moderator/all-applied-scholarship', text: 'All Applications', icon: <FaClipboardList /> },
        { to: '/dashboard/moderator/add-scholarship', text: 'Add Scholarship', icon: <FaPlus /> }
    ];

    const userLinks = [
        { to: '/dashboard/user/my-profile', text: 'My Profile', icon: <FaUser /> },
        { to: '/dashboard/user/my-applications', text: 'My Applications', icon: <FaClipboardList /> },
        { to: '/dashboard/user/my-reviews', text: 'My Reviews', icon: <FaStar /> }
    ];

    const getLinks = () => {
        switch (role) {
            case 'admin':
                return adminLinks;
            case 'moderator':
                return moderatorLinks;
            default:
                return userLinks;
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Mobile sidebar overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside className={`fixed lg:static z-50 top-0 left-0 w-72 bg-white shadow-lg h-full transform transition-all duration-300 ease-in-out 
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 border-r border-gray-200`}>
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#2C5F95] to-[#3874B5]">
                    <div className="flex items-center gap-4">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} 
                                className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-white text-[#2C5F95] flex items-center justify-center font-bold text-xl shadow-md">
                                {user?.displayName?.charAt(0)}
                            </div>
                        )}
                        <div className="hidden lg:block">
                            <h2 className="text-sm font-semibold text-white">{user?.displayName}</h2>
                            <p className="text-xs text-gray-200 capitalize">{role}</p>
                        </div>
                        <button className="lg:hidden text-white text-xl ml-auto" onClick={() => setSidebarOpen(false)}>
                            <FaTimes />
                        </button>
                    </div>
                </div>
                <nav className="p-4 overflow-y-auto h-[calc(100%-88px)]">
                    <ul className="space-y-1.5">
                        {getLinks().map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                                            isActive 
                                                ? 'bg-[#2C5F95] text-white font-medium shadow-md' 
                                                : 'hover:bg-gray-100 text-gray-700 hover:text-[#2C5F95]'
                                        }`
                                    }
                                >
                                    <span className="text-lg">{link.icon}</span>
                                    {link.text}
                                </NavLink>
                            </li>
                        ))}
                        <li className="pt-4 border-t mt-4">
                            <Link
                                to="/"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 hover:text-[#2C5F95] transition-all duration-200"
                            >
                                <span className="text-lg"><FaHome /></span>
                                Back to Home
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top bar for mobile */}
                <header className="bg-white shadow-md p-4 flex items-center justify-between lg:hidden sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="text-[#2C5F95] text-2xl hover:text-[#3874B5] transition-colors">
                            <FaBars />
                        </button>
                        <h2 className="text-lg font-semibold text-[#2C5F95]">Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-gray-200" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-[#2C5F95] text-white flex items-center justify-center font-bold text-sm">
                                {user?.displayName?.charAt(0)}
                            </div>
                        )}
                    </div>
                </header>
                <main className="p-6 flex-1 lg:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
