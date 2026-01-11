import Link from 'next/link';
import LoginForm from '../../components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Hesabınıza giriş yapın
          </h2>
        </div>
        <div className="bg-white py-8 px-4 shadow-md md:rounded-lg md:px-10">
           <LoginForm />
           <div className="mt-4 text-center">
             <Link
               href="/forgot-password"
               className="text-sm text-primary hover:text-primary-dark"
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
                   Hesabınız yok mu?
                 </span>
               </div>
             </div>
             <div className="mt-6">
               <Link
                 href="/register"
                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-white border-primary hover:bg-gray-50"
               >
                 Kayıt Ol
               </Link>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}