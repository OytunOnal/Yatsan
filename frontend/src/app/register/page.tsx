'use client';

import { useState } from 'react';
import Link from 'next/link';
import RegisterForm from '../../components/forms/RegisterForm';

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Hesap oluşturun
          </h2>
        </div>
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
          <RegisterForm onStepChange={setCurrentStep} />
          {currentStep !== 3 && (
            <>
              <div className="mt-4 text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Şifremi unuttum?
                </Link>
              </div>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Zaten hesabınız var mı?
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="w-full flex justify-center py-2 px-4 border border-primary-600 rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 transition-colors"
                  >
                    Giriş Yap
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}