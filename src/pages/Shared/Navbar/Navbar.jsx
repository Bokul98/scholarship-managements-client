import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaUserCircle } from 'react-icons/fa';
import Logo from '../Logo/Logo';
import useUserRole from '../../../hooks/useUserRole';

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const { userData } = useUserRole();

    const handleLogout = () => {
        logOut()
            .then(() => {
                // Handle successful logout
            })
            .catch(error => console.error(error));
    };

    const getNameInitial = (name) => {
        if (!name) return '';
        return name.charAt(0).toUpperCase();
    };

    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'All Scholarships', path: '/all-scholarships' }
    ];

    // Updated dashboard links with different paths for each role
    const dashboardLinks = {
        admin: { title: 'Admin Dashboard', path: '/dashboard/admin' },
        moderator: { title: 'Moderator Dashboard', path: '/dashboard/moderator' },
        user: { title: 'User Dashboard', path: '/dashboard/user' }
    };

    // Get the appropriate dashboard link based on user role
    const getDashboardLink = () => {
        if (!userData?.role) return dashboardLinks.user;
        return dashboardLinks[userData.role] || dashboardLinks.user;
    };

    return (
        <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <Logo className="transform hover:scale-105 transition-transform duration-200" />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'text-[#2C5F95] bg-[#2C5F95]/10 shadow-sm backdrop-blur-sm'
                                        : 'text-gray-600 hover:text-[#2C5F95] hover:bg-[#2C5F95]/5'
                                    }`
                                }
                            >
                                {link.title}
                            </NavLink>
                        ))}

                        {/* Conditional Dashboard Link */}
                        {user && (
                            <NavLink
                                to={getDashboardLink().path}
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'text-[#2C5F95] bg-[#2C5F95]/10 shadow-sm backdrop-blur-sm'
                                        : 'text-gray-600 hover:text-[#2C5F95] hover:bg-[#2C5F95]/5'
                                    }`
                                }
                            >
                                {getDashboardLink().title}
                            </NavLink>
                        )}

                        {/* Auth Buttons */}
                        {user ? (
                            <div className="flex items-center space-x-4 ml-4">
                                <div className="flex items-center space-x-3 bg-[#2C5F95]/5 backdrop-blur-sm px-4 py-2 rounded-lg">
                                    {user.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.displayName}
                                            className="h-8 w-8 rounded-full ring-2 ring-[#2C5F95] ring-offset-2"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-[#2C5F95] text-white flex items-center justify-center font-medium ring-2 ring-[#2C5F95] ring-offset-2">
                                            {getNameInitial(userData?.name || user.displayName)}
                                        </div>
                                    )}
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-medium text-gray-700">
                                            {userData?.name || user.displayName}
                                        </span>
                                        {userData?.role && userData.role !== 'user' && (
                                            <span className="text-xs font-medium text-[#2C5F95] capitalize bg-[#2C5F95]/10 px-2 py-0.5 rounded">
                                                {userData.role}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#2C5F95] to-[#13436F] rounded-md hover:from-[#13436F] hover:to-[#2C5F95] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C5F95] shadow-md hover:shadow-lg"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <NavLink
                                to="/login"
                                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#2C5F95] to-[#13436F] rounded-md hover:from-[#13436F] hover:to-[#2C5F95] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C5F95] shadow-md hover:shadow-lg"
                            >
                                Login
                            </NavLink>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-[#2C5F95] hover:bg-[#2C5F95]/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2C5F95] transition-colors duration-200"
                        >
                            {isOpen ? (
                                <HiX className="block h-6 w-6" />
                            ) : (
                                <HiMenu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
            >
                <div className="px-4 pt-2 pb-3 space-y-2 bg-[#2C5F95]/5 backdrop-blur-sm border-t border-gray-200/80">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `block px-4 py-2.5 rounded-md text-base font-medium transition-all duration-200 ${isActive
                                    ? 'text-[#2C5F95] bg-white shadow-sm'
                                    : 'text-gray-600 hover:text-[#2C5F95] hover:bg-white/80'
                                }`
                            }
                        >
                            {link.title}
                        </NavLink>
                    ))}

                    {/* Conditional Dashboard Link for Mobile */}
                    {user && (
                        <NavLink
                            to={getDashboardLink().path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `block px-4 py-2.5 rounded-md text-base font-medium transition-all duration-200 ${isActive
                                    ? 'text-[#2C5F95] bg-white shadow-sm'
                                    : 'text-gray-600 hover:text-[#2C5F95] hover:bg-white/80'
                                }`
                            }
                        >
                            {getDashboardLink().title}
                        </NavLink>
                    )}

                    {/* Mobile Auth Section */}
                    {user ? (
                        <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-lg mt-4 shadow-sm">
                            <div className="flex items-center space-x-3 mb-3">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName}
                                        className="h-10 w-10 rounded-full ring-2 ring-[#2C5F95] ring-offset-2"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-[#2C5F95] text-white flex items-center justify-center font-medium ring-2 ring-[#2C5F95] ring-offset-2">
                                        {getNameInitial(userData?.name || user.displayName)}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-base font-medium text-gray-700">
                                        {userData?.name || user.displayName}
                                    </span>
                                    {userData?.role && userData.role !== 'user' && (
                                        <span className="text-sm font-medium text-[#2C5F95] capitalize bg-[#2C5F95]/10 px-2 py-0.5 rounded">
                                            {userData.role}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#2C5F95] to-[#13436F] rounded-md hover:from-[#13436F] hover:to-[#2C5F95] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C5F95] shadow-md hover:shadow-lg"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <NavLink
                            to="/login"
                            onClick={() => setIsOpen(false)}
                            className="block w-full px-4 py-2.5 text-sm font-medium text-center text-white bg-gradient-to-r from-[#2C5F95] to-[#13436F] rounded-md hover:from-[#13436F] hover:to-[#2C5F95] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C5F95] shadow-md hover:shadow-lg"
                        >
                            Login
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;