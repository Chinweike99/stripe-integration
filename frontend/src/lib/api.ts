import axios from 'axios'


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
);

api.interceptors.response.use(
    (response)=> response,
    async(error) => {
        const originalRequest = error.config;
        
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if(refreshToken){
                    const response= await api.post('/auth/refresh', {refreshToken});
                    const {accessToken} = response.data;

                    localStorage.setItem('accessToken', accessToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Redirect to login if refresh fails
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error)
    }
)