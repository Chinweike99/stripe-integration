import { useAuthStore } from "@/lib/store/auth-store"
import { useRouter } from "next/navigation";
import {useQueryClient, useMutation, useQuery} from '@tanstack/react-query'
import { authService } from "@/services/auth-service";



export const useAuth =()=> {
    const {login: loginStore, logout: logoutStore, user} = useAuthStore();
    const router = useRouter();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            loginStore(data.user, data.accessToken, data.refreshToken);
            router.push('/dashboard')
        }
    });

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: (data) => {
            loginStore(data.user, data.accessToken, data.refreshToken);
            router.push('/dashboard')
        }
    });

    const profileQuery = useQuery({
        queryKey: ['profile'],
        queryFn: authService.getProfile,
        enabled: !!user,
    });

    const logout = () => {
        logoutStore();
        queryClient.clear();
        router.push('/login')
    };

   return {
    user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    profile: profileQuery.data,
  };
}