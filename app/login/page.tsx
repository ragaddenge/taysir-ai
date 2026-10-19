'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // <-- تمت إضافة استيراد الفوتر

const registeredUsers = [
  { email: 'parent@taysir.ai', password: '123456', name: 'محمد أحمد' },
  { email: 'teacher@taysir.ai', password: 'teacher123', name: 'أستاذ علي' }
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { 
      setError('يرجى ملء جميع الحقول'); 
      return; 
    }
    setIsLoading(true);
    
    setTimeout(() => {
      const user = registeredUsers.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('taysir_auth', JSON.stringify({ email: user.email, name: user.name, loginTime: new Date().toISOString() }));
        setIsLoading(false);
        router.push('/dashboard');
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3] dark:bg-[#0f0f1e] transition-colors duration-300 flex flex-col" dir="rtl">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-[#1E88E5] dark:text-[#42A5F5] mb-2">منصة تيسير AI</h1>
            <p className="text-xl text-[#2C3E50] dark:text-gray-300">تسجيل الدخول لمتابعة تقدم طفلك</p>
          </div>

          <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl shadow-2xl p-8">
            <div className="bg-[#1E88E5]/10 dark:bg-[#1E88E5]/20 p-4 rounded-xl mb-6 text-sm">
              <p className="font-bold text-[#1E88E5] mb-2">🔑 بيانات تجريبية للدخول:</p>
              <p className="text-[#2C3E50] dark:text-gray-300">البريد: <span className="font-mono font-bold">parent@taysir.ai</span></p>
              <p className="text-[#2C3E50] dark:text-gray-300">كلمة المرور: <span className="font-mono font-bold">123456</span></p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-[#E53935]/10 text-[#E53935] p-4 rounded-xl text-center font-bold border border-[#E53935]">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-lg font-bold text-[#2C3E50] dark:text-gray-300 mb-2">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="example@domain.com" 
                  className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 dark:bg-[#0f0f1e] dark:text-white rounded-xl text-lg focus:border-[#1E88E5] focus:outline-none transition-colors" 
                  dir="ltr" 
                />
              </div>
              
              <div>
                <label className="block text-lg font-bold text-[#2C3E50] dark:text-gray-300 mb-2">كلمة المرور</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 dark:bg-[#0f0f1e] dark:text-white rounded-xl text-lg focus:border-[#1E88E5] focus:outline-none transition-colors" 
                  dir="ltr" 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-[#1E88E5] text-white py-4 rounded-2xl text-xl font-bold hover:bg-[#1565C0] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    جاري الدخول...
                  </>
                ) : (
                  '🔐 تسجيل الدخول'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#2C3E50] dark:text-gray-400">
                ليس لديك حساب؟{' '}
                <Link href="/contact" className="text-[#1E88E5] font-bold hover:underline">
                  تواصل معنا لإنشاء حساب
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* <-- تمت إضافة الفوتر الاحترافي هنا --> */}
      <Footer />
    </div>
  );
}