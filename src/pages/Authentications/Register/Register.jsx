import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../SocialLogin/SocialLogin';
import loginImage from '../../../assets/login.png';
import toast from 'react-hot-toast';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const db = getFirestore();
    
    // Always redirect to home after registration
    const from = "/";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        toast.promise(
            (async () => {
                const result = await createUser(data.email, data.password);
                const user = result.user;
                await updateUserProfile(data.name);
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    name: data.name,
                    role: 'user',
                    createdAt: new Date().toISOString()
                });
                return 'Account created successfully!';
            })(),
            {
                loading: 'Creating account...',
                success: (msg) => msg,
                error: (err) => err.message || 'Registration failed. Please try again.',
            },
            {
                duration: 3000,
                position: 'top-center',
            }
        ).then(() => {
            setIsLoading(false);
            navigate(from, { replace: true });
        }).catch(() => {
            setIsLoading(false);
        });
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Image Section */}
            <div className="hidden md:flex items-center justify-center p-8">
                <img
                    src={loginImage}
                    alt="Register illustration"
                    className="max-w-md w-full h-auto object-contain"
                />
            </div>

            {/* Form Section */}
            <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[#0F3E6C]">
                        Create Your Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join our scholarship community today
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div className="rounded-md -space-y-px">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#2D6197] focus:border-[#2D6197] focus:z-10 sm:text-sm"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                        </div>

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
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        },
                                        pattern: {
                                            value: /^(?=.*[A-Z])(?=.*[!@#$&*])/,
                                            message: "Password must contain at least one capital letter and one special character"
                                        }
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
                            {isLoading ? 'Creating Account...' : 'Create Account'}
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
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-[#2D6197] hover:text-[#245180] transition-colors duration-200">
                            Sign in here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;