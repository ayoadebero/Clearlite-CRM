import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

// Use environment variable for production, proxy for development
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle errors
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('currentUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
