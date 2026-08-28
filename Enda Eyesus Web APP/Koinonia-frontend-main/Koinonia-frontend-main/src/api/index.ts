//src/api/index.ts
import { Api } from './generated/api';

let activeBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

if (activeBaseUrl && !activeBaseUrl.endsWith('/api/v1') && !activeBaseUrl.includes('localhost')) {
    activeBaseUrl = activeBaseUrl.replace(/\/$/, '') + '/api/v1';
}

export const apiClient = new Api({
    baseURL: activeBaseUrl,
    withCredentials: true,
    timeout: 15000,
});

apiClient.instance.interceptors.response.use(
    (res) => res,
    (error) => {
        const url: string = error.config?.url || '';
        const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register');
        if (error.response?.status === 401 && !isAuthRoute) {
            import('@/store/authStore').then(({ useAuthStore }) => {
                useAuthStore.getState().logout();
                window.location.href = '/login';
            });
        }
        return Promise.reject(error);
    }
);

export default apiClient;
