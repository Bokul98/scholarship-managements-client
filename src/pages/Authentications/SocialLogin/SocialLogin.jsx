import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import axios from 'axios';

const SocialLogin = () => {
    const { signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const db = getFirestore();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Get return URL from location state or default to home
    const from = location.state?.from?.pathname || "/";

    const saveUserData = async (user) => {
        const userRef = doc(db, "users", user.uid);
        
        try {
            // Check if user exists
            const docSnap = await getDoc(userRef);
            const userInfo = {
                email: user.email,
                name: user.displayName,
                role: 'user',
                photoURL: user.photoURL || null,
                lastLogin: new Date().toISOString()
            };

            if (!docSnap.exists()) {
                // New user
                userInfo.createdAt = new Date().toISOString();
            } else {
                // Existing user - preserve existing data
                const existingData = docSnap.data();
                Object.assign(userInfo, {
                    ...existingData,
                    lastLogin: new Date().toISOString(),
                    name: user.displayName, // Update name in case it changed
                    photoURL: user.photoURL || existingData.photoURL // Update photo if new one exists
                });
            }

            // Save/update user data
            await setDoc(userRef, userInfo);
            return userInfo;
        } catch (error) {
            console.error('Error saving user data:', error);
            throw error;
        }
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

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            setIsLoading(true);

            const result = await signInWithGoogle();
            const user = result.user;
            
            // Get the ID token
            const token = await user.getIdToken();
            
            // Store the token in localStorage
            localStorage.setItem('access-token', token);
            
            // Save user data to Firebase
            const userData = await saveUserData(user);

            // Save user data to MongoDB
            const mongoUserData = {
                name: user.displayName,
                email: user.email,
                image: user.photoURL,
                role: userData.role || 'user'
            };
            await saveUserToMongoDB(mongoUserData);
            
            toast.success('Successfully logged in with Google!', {
                duration: 3000,
                position: 'top-center',
            });

            // Navigate after successful data save
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Google Sign-in Error:', error);
            let errorMessage = 'Failed to sign in with Google. Please try again.';
            
            // Handle specific error cases
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign-in cancelled. Please try again.';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid credentials. Please try signing in again.';
            }
            
            setError(errorMessage);
            toast.error(errorMessage, {
                duration: 3000,
                position: 'top-center',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium ${
                    isLoading 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-50'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D6197] transition-colors duration-200`}
            >
                <FaGoogle className="text-[#DB4437]" />
                {isLoading ? 'Signing in...' : 'Continue with Google'}
            </button>
            {error && (
                <p className="mt-2 text-center text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default SocialLogin;