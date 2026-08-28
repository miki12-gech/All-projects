//src/lib/api.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

let activeBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
if (activeBaseUrl && !activeBaseUrl.endsWith('/api/v1') && !activeBaseUrl.includes('localhost')) {
    activeBaseUrl = activeBaseUrl.replace(/\/$/, '') + '/api/v1';
}

const api = axios.create({
    baseURL: activeBaseUrl,
    timeout: 10000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = useAuthStore.getState().token;
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// On 401, clear auth and redirect to login, EXCEPT for auth endpoints
api.interceptors.response.use(
    (res) => res,
    (error) => {
        const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');

        if (error.response?.status === 401 && typeof window !== 'undefined' && !isAuthRoute) {
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
