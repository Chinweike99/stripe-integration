import { api } from "@/lib/api";


export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData{
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    }
}

export const authService = {
    async login(credentials: LoginData): Promise<AuthResponse>{
        const response = await api.post<AuthResponse>('/auth/login', {credentials});
        return response.data;
    },

    async register(userData: RegisterData): Promise<AuthResponse>{
        const response = await api.post<AuthResponse>('/auth/register', userData);
        return response.data
    },

    async getProfile(){
        const response  =  await api.get('/users/profile');
        return response.data
    }
}

