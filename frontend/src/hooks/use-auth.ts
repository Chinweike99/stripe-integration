import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { 
    user, 
    accessToken, 
    isAuthenticated, 
    login: loginStore, 
    logout: logoutStore, 
    setUser 
  } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      loginStore(data.user, data.accessToken, data.refreshToken);
      router.push('/dashboard');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      loginStore(data.user, data.accessToken, data.refreshToken);
      router.push('/dashboard');
    },
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    enabled: !!isAuthenticated,
  });

  const logout = () => {
    logoutStore();
    queryClient.clear();
    router.push('/login');
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    profile: profileQuery.data,
    refetchProfile: profileQuery.refetch,
  };
};