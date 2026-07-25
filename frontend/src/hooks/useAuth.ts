import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/store/authStore';

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, setAuth, setUser, logout, setLoading } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      setAuth(token, user);
      toast.success('Giriş başarılı!');
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Giriş başarısız';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setAuth, setLoading]);

  const register = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', data);
      toast.success('Kayıt başarılı! Lütfen emailinizi doğrulayın.');
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kayıt başarısız';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const logoutUser = useCallback(() => {
    logout();
    toast.success('Çıkış yapıldı');
    router.push('/login');
  }, [logout, router]);

  const updateUser = useCallback((user: User) => {
    setUser(user);
  }, [setUser]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout: logoutUser,
    updateUser,
  };
}
