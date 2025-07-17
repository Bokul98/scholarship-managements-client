import axios from 'axios';
import { getFirebaseToken } from '../utils/getFirebaseToken';

const BASE_URL = 'https://server-kohl-pi.vercel.app/api';

// Configure axios instance
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await getFirebaseToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            console.error('Error getting token:', error);
            return config;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    response => {
        console.log(`API Response [${response.config.url}]:`, response.data);
        return response;
    },
    error => {
        console.error(`API Error [${error.config?.url}]:`, {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        return Promise.reject(error);
    }
);

// Get scholarship by id
export const getScholarshipById = async (id) => {
    try {
        console.log('Fetching scholarship by ID:', id);
        const response = await api.get(`/scholarships/${id}`);
        
        // Validate the response data
        const scholarship = response.data;
        if (!scholarship || typeof scholarship !== 'object') {
            throw new Error('Invalid scholarship data received');
        }

        // Log the received data
        console.log('Received scholarship data:', {
            id: scholarship._id,
            name: scholarship.name,
            fields: Object.keys(scholarship)
        });

        return scholarship;
    } catch (error) {
        console.error('Error fetching scholarship:', {
            id,
            error: error.message,
            response: error.response?.data
        });
        throw error;
    }
};

// Get all scholarships
export const getAllScholarships = async () => {
    try {
        const response = await api.get('/scholarships');
        return response.data;
    } catch (error) {
        console.error('Error fetching scholarships:', error);
        throw error;
    }
};

// Apply for scholarship
export const applyForScholarship = async (applicationData) => {
    try {
        const response = await api.post('/applications', applicationData);
        return response.data;
    } catch (error) {
        console.error('Error applying for scholarship:', error);
        throw error;
    }
};

// Create payment intent
export const createPaymentIntent = async (amount) => {
    try {
        const response = await api.post('/payments/create-payment-intent', { amount });
        return response.data;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
};

// Get top scholarships
export const getTopScholarships = async () => {
    try {
        const response = await api.get('/top-scholarships');
        return response.data;
    } catch (error) {
        console.error('Error fetching top scholarships:', error);
        throw error;
    }
};