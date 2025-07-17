import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../SocialLogin/SocialLogin';
import loginImage from '../../../assets/login.png';
import toast from 'react-hot-toast';
import { getDatabase, ref, onValue } from 'firebase/database';
import axios from 'axios';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get return URL from location state or default to home, but never redirect to /login
    let from = location.state?.from?.pathname;
    if (!from || from === "/login" || from === "/register") {
        from = "/";
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const getUserRole = async (uid) => {
        return new Promise((resolve) => {
            const database = getDatabase();
            const userRef = ref(database, 'users/' + uid);
            
            onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    resolve(userData.role || 'user');
                } else {
                    resolve('user');
                }
            }, {
                onlyOnce: true
            });
        });
    };

    const saveUserToMongoDB = async (userData) => {
        try {
            const response = await axios.post('https://server-kohl-pi.vercel.app/api/users', userData);
            return response.data;
        } catch (error) {
            console.error('Error saving user to MongoDB:', error);
            // If user already exists, try updating instead
            if (error.response?.status === 409) {
                const updateResponse = await axios.put(`https://server-kohl-pi.vercel.app/api/users/${userData.email}`, userData);
                return updateResponse.data;
            }
            throw error;
        }
    };

    const onSubmit = async (data) => {
        try {
            setError('');
            setIsLoading(true);

            // Basic Firebase login first
            const userCredential = await signIn(data.email, data.password);
            const token = await userCredential.user.getIdToken();
            localStorage.setItem('access-token', token);

            // Show success message and navigate
            toast.success('Successfully logged in!', {
                duration: 2000,
                position: 'top-right',
            });
            
            // Navigate immediately after Firebase auth
            navigate(from, { replace: true });

            // Get role and save to MongoDB in background
            getUserRole(userCredential.user.uid).then(async (role) => {
                const userData = {
                    name: userCredential.user.displayName || 'User',
                    email: userCredential.user.email,
                    image: userCredential.user.photoURL,
                    role: role
                };
                await saveUserToMongoDB(userData);
            }).catch(console.error);

        } catch (error) {
            console.error('Login Error:', error);
            setError(error.message || 'Login failed. Please try again.');
            toast.error(error.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Image Section */}
            <div className="hidden md:flex items-center justify-center p-8">
                <img
                    src={loginImage}
                    alt="Login illustration"
                    className="max-w-md w-full h-auto object-contain"
                />
            </div>

            {/* Form Section */}
            <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[#0F3E6C]">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Welcome back to our scholarship community
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div className="rounded-md -space-y-px">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#2D6197] focus:border-[#2D6197] focus:z-10 sm:text-sm"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#2D6197] focus:border-[#2D6197] focus:z-10 sm:text-sm"
                                    {...register("password", {
                                        required: "Password is required"
                                    })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
                        </div>
                    </div>

                    {error && <p className="text-center text-sm text-red-600">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                                isLoading 
                                ? 'bg-[#2D6197]/70 cursor-not-allowed' 
                                : 'bg-[#2D6197] hover:bg-[#245180]'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D6197] transition-colors duration-200`}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <SocialLogin />

                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-[#2D6197] hover:text-[#245180] transition-colors duration-200">
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;