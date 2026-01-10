'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../lib/api';
import SMSVerification from './SMSVerification';

const step1Schema = z.object({
  email: z.string().email('Geçerli bir email adresi girin'),
  password: z.string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'),
});

const step2Schema = z.object({
  phone: z.string().min(12, 'Geçerli bir telefon numarası girin').regex(/^\d+$/, 'Telefon numarası sadece rakam içermelidir'),
  userType: z.enum(['INDIVIDUAL', 'BROKER'], {
    errorMap: (issue, ctx) => {
      if (issue.code === 'invalid_enum_value') {
        return { message: 'Kullanıcı tipi seçin' };
      }
      return { message: ctx.defaultError };
    },
  }),
  kvkkApproved: z.boolean().refine(val => val === true, 'KVKK onayı gereklidir'),
});

const formatPhoneNumber = (value: string) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  // Format as xxx xxx xxxx for 10 digits
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
};

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange',
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange',
  });

  useEffect(() => {
    const step = searchParams.get('step');
    if (step === '2') {
      setCurrentStep(2);
      // Step 2'ye geri döndüğümüzde, eğer telefon '90' ise placeholder'ı göster
      if (step2Form.getValues('phone') === '90') {
        step2Form.setValue('phone', '', { shouldValidate: false });
      }
    } else {
      setCurrentStep(1);
    }
  }, [searchParams, step2Form]);

  // Telefon input değerini izlemek için watch kullanıyoruz
  const phoneValue = step2Form.watch('phone');

  const handleStep1Next = async (data: Step1Data) => {
    try {
      // Email kontrolü
      await api.post('/auth/check-email', { email: data.email });
      setFormData({ ...formData, ...data });
      setCurrentStep(2);
      router.push('/register?step=2');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email kontrol edilemedi');
    }
  };

  const handleStep2Next = async (data: Step2Data) => {
    try {
      // Telefon kontrolü
      await api.post('/auth/check-phone', { phone: data.phone });
      const completeData = { ...formData, ...data };
      setFormData(completeData);
      setLoading(true);
      setError('');

      await api.post('/auth/register', completeData);
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationComplete = async (code: string) => {
    // For testing, accept fixed code "123456" without API call
    if (code === '123456') {
      router.push('/login');
    } else {
      setError('Geçersiz kod');
    }
  };

  const handleResendCode = async () => {
    try {
      await api.post('/auth/resend', { email: formData.email });
    } catch (err: any) {
      setError('Kod gönderilemedi');
    }
  };

  if (currentStep === 3) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <SMSVerification onComplete={handleVerificationComplete} onResend={handleResendCode} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {currentStep === 1 && (
        <form onSubmit={step1Form.handleSubmit(handleStep1Next)} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...step1Form.register('email')}
              className={`mt-1 block w-full px-3 py-2 border ${step1Form.formState.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
            />
            {step1Form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              {...step1Form.register('password')}
              className={`mt-1 block w-full px-3 py-2 border ${step1Form.formState.errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
            />
            {step1Form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">{step1Form.formState.errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={step1Form.formState.isSubmitting}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 flex items-center justify-center"
          >
            {step1Form.formState.isSubmitting && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            İleri
          </button>
        </form>
      )}

      {currentStep === 2 && (
        <form onSubmit={step2Form.handleSubmit(handleStep2Next)} noValidate className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefon
            </label>
            <input
              id="phone"
              type="tel"
              // register fonksiyonunu kullanmıyoruz, değeri manuel olarak yönetiyoruz
              placeholder="90 555 55 55"
              value={formatPhoneNumber(phoneValue || '')}
              onChange={(e) => {
                // Sadece rakamları al
                const rawValue = e.target.value.replace(/\D/g, '');
                // React-hook-form'a kaydet (formatlanmamış hali)
                step2Form.setValue('phone', rawValue, { shouldValidate: true });
              }}
              onFocus={(e) => {
                if (!phoneValue) {
                  step2Form.setValue('phone', '90', { shouldValidate: true });
                }
              }}
              onBlur={(e) => {
                if (phoneValue === '90') {
                  step2Form.setValue('phone', '', { shouldValidate: false });
                }
              }}
              className={`mt-1 block w-full px-3 py-2 border ${step2Form.formState.errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary placeholder-gray-400`}
            />
            {step2Form.formState.errors.phone && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
              Kullanıcı Tipi
            </label>
            <select
              id="userType"
              {...(() => {
                const { onChange, onBlur, ...rest } = step2Form.register('userType');
                return {
                  ...rest,
                  onChange: (e) => {
                    onChange(e);
                    step2Form.trigger('userType');
                  },
                  onBlur: (e) => {
                    onBlur(e);
                    step2Form.trigger('userType');
                  },
                };
              })()}
              onFocus={(e) => {
                if (e.target.value === '') {
                  step2Form.trigger('userType');
                }
              }}
              className={`mt-1 block w-full px-3 py-2 border ${step2Form.formState.errors.userType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
            >
              <option value="">Seçin</option>
              <option value="INDIVIDUAL">Bireysel</option>
              <option value="BROKER">Kurumsal</option>
            </select>
            {step2Form.formState.errors.userType && (
              <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.userType.message}</p>
            )}
          </div>

          <div className="flex items-start">
            <input
              id="kvkkApproved"
              type="checkbox"
              {...step2Form.register('kvkkApproved')}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
            />
            <label htmlFor="kvkkApproved" className="ml-2 block text-sm text-gray-700">
              <a href="/kvkk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Kişisel Verilerin Korunması Kanunu
              </a>
              {' '}aydınlatma metnini okudum ve kabul ediyorum.
            </label>
          </div>
          {step2Form.formState.errors.kvkkApproved && (
            <p className="mt-1 text-sm text-red-600">{step2Form.formState.errors.kvkkApproved.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 flex items-center justify-center"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>
      )}
    </div>
  );
}