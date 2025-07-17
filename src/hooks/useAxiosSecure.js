import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

const axiosSecure = axios.create({
    baseURL: 'https://server-kohl-pi.vercel.app/api/v1',
    withCredentials: true
});

// For debugging
axiosSecure.interceptors.request.use(request => {
    console.log('Starting Request:', request);
    return request;
});

axiosSecure.interceptors.response.use(response => {
    console.log('Response:', response);
    return response;
});

const useAxiosSecure = () => {
    const { logOut } = useAuth() || {};
    const navigate = useNavigate();

    useEffect(() => {
        // Add a request interceptor
        axiosSecure.interceptors.request.use((config) => {
            const token = localStorage.getItem('access-token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Add a response interceptor
        axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    // Logout user and navigate to login page
                    await logOut();
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );
    }, [logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;
