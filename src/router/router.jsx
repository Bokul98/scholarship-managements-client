import { createBrowserRouter, Outlet } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Home from '../pages/Home/Home/Home';
import Login from '../pages/Authentications/Login/Login';
import Register from '../pages/Authentications/Register/Register';
import ErrorPage404 from '../pages/Home/ErrorPage404/ErrorPage404';
import PrivateRoute from '../routes/PrivateRoute';
import AdminRoute from '../routes/AdminRoute';
import ModeratorRoute from '../routes/ModeratorRoute';
import UserRoute from '../routes/UserRoute';
import Unauthorized from '../pages/Unauthorized/Unauthorized';
import AllScholarshipsPage from '../pages/AllScholarshipsPage';
import ScholarshipDetailsPage from '../pages/ScholarshipDetailsPage';
import ApplyScholarshipPage from '../pages/ApplyScholarshipPage';

// Admin Pages
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import ManageApplications from '../pages/Dashboard/Admin/ManageApplications';
import ManageReviews from '../pages/Dashboard/Admin/ManageReviews';
import AdminProfile from '../pages/Dashboard/Admin/AdminProfile';
import Analytics from '../pages/Dashboard/Admin/Analytics';

// Scholarship Management Pages
import AddScholarship from '../pages/Dashboard/Scholarship/AddScholarship';
import ManageScholarships from '../pages/Dashboard/Scholarship/ManageScholarships';

// Moderator Pages
import AllAppliedScholarship from '../pages/Dashboard/Moderator/AllAppliedScholarship';
import AllReviews from '../pages/Dashboard/Moderator/AllReviews';
import ModeratorProfile from '../pages/Dashboard/Moderator/ModeratorProfile';

// User Pages
import MyProfile from '../pages/Dashboard/User/MyProfile';
import MyApplications from '../pages/Dashboard/User/MyApplications';
import MyReviews from '../pages/Dashboard/User/MyReviews';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage404 />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/all-scholarships',
                element: <AllScholarshipsPage />
            },
            {
                path: '/scholarship/:id',
                element: <ScholarshipDetailsPage />
            },
            {
                path: '/apply-scholarship/:id',
                element: <PrivateRoute><ApplyScholarshipPage /></PrivateRoute>
            },
            {
                path: '/unauthorized',
                element: <Unauthorized />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            // Default routes for each role
            {
                path: 'admin',
                element: <AdminRoute><Outlet /></AdminRoute>,
                children: [
                    {
                        path: "profile",
                        element: <AdminProfile />
                    },
                    {
                        path: "analytics",
                        element: <Analytics />
                    },
                    {
                        path: "add-scholarship",
                        element: <AddScholarship />
                    },
                    {
                        path: "manage-scholarships",
                        element: <ManageScholarships />
                    },
                    {
                        path: "manage-applications",
                        element: <ManageApplications />
                    },
                    {
                        path: "manage-users",
                        element: <ManageUsers />
                    },
                    {
                        path: "manage-reviews",
                        element: <ManageReviews />
                    }
                ]
            },
            {
                path: 'moderator',
                element: <ModeratorRoute><Outlet /></ModeratorRoute>,
                children: [
                    {
                        path: "profile",
                        element: <ModeratorProfile />
                    },
                    {
                        path: "add-scholarship",
                        element: <AddScholarship />
                    },
                    {
                        path: "manage-scholarships",
                        element: <ManageScholarships />
                    },
                    {
                        path: "all-applied-scholarship",
                        element: <AllAppliedScholarship />
                    },
                    {
                        path: "all-reviews",
                        element: <AllReviews />
                    }
                ]
            },
            {
                path: 'user',
                element: <UserRoute><MyProfile /></UserRoute>
            },
            // Admin Routes
            {
                path: 'admin/manage-users',
                element: <AdminRoute><ManageUsers /></AdminRoute>
            },
            {
                path: 'admin/manage-applications',
                element: <AdminRoute><ManageApplications /></AdminRoute>
            },
            {
                path: 'admin/manage-reviews',
                element: <AdminRoute><ManageReviews /></AdminRoute>
            },
            // Moderator Routes
            {
                path: 'moderator/my-profile',
                element: <ModeratorRoute><MyProfile /></ModeratorRoute>
            },
            {
                path: 'moderator/all-applied-scholarship',
                element: <ModeratorRoute><AllAppliedScholarship /></ModeratorRoute>
            },
            {
                path: 'moderator/all-reviews',
                element: <ModeratorRoute><AllReviews /></ModeratorRoute>
            },
            // User Routes
            {
                path: 'user/my-profile',
                element: <UserRoute><MyProfile /></UserRoute>
            },
            {
                path: 'user/my-applications',
                element: <UserRoute><MyApplications /></UserRoute>
            },
            {
                path: 'user/my-reviews',
                element: <UserRoute><MyReviews /></UserRoute>
            }
        ]
    }
]);

export default router;