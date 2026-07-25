'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Geçerli bir email adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError(null);
    const result = await login(data.email, data.password);
    if (result.success) {
      router.push(redirect || '/dashboard');
    } else {
      setSubmitError(result.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <>
      {submitError && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg" role="alert">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 font-medium">{submitError}</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label htmlFor="email" className="label">
          E-posta Adresi
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`input ${errors.email ? 'input-error' : ''}`}
          placeholder="ornek@email.com"
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-error-600 flex items-center gap-1" role="alert">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="label">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className={`input ${errors.password ? 'input-error' : ''}`}
          placeholder="••••••••"
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && (
          <p className="mt-1.5 text-sm text-error-600 flex items-center gap-1" role="alert">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
            Beni hatırla
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Şifremi unuttum?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary btn-lg"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Giriş yapılıyor...</span>
          </>
        ) : (
          'Giriş Yap'
        )}
      </button>

      <div className="text-center">
        <p className="text-gray-600">
          Hesabınız yok mu?{' '}
          <Link
            href="/register"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Kayıt olun
          </Link>
        </p>
      </div>
      </form>
    </>
  );
}
