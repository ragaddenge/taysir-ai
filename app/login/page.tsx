'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notifyAuthChange } from '../hooks/useAuth';

// ⚠️ تسجيل دخول تجريبي للعرض فقط، ولا يوفّر أي حماية حقيقية.
// يعمل فقط عند ضبط NEXT_PUBLIC_DEMO_MODE=true في .env.local.
// وبدونه تُحذف البيانات التجريبية من الكود المُرسَل للمتصفح عند البناء، وتظهر رسالة «غير متاح».
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

const registeredUsers = DEMO_MODE
  ? [
      { email: 'parent@taysir.ai', password: '123456', name: 'محمد أحمد' },
      { email: 'teacher@taysir.ai', password: 'teacher123', name: 'أستاذ علي' },
    ]
  : [];

const ICONS = {
  key: 'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z',
  lock: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
  spinner: 'M12 3a9 9 0 109 9',
  warning:
    'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
} as const;

function Icon({ name, className = 'h-6 w-6' }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:focus-visible:outline-blue-300';

const inputClass =
  'w-full rounded-xl border-2 border-slate-500 bg-white p-4 text-lg text-slate-900 transition-colors focus:border-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-800/30 aria-invalid:border-red-700 dark:border-gray-400 dark:bg-[#0f0f1e] dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-300/30 dark:aria-invalid:border-red-300';

const labelClass = 'mb-2 block text-lg font-bold text-slate-900 dark:text-gray-200';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000)); // محاكاة طلب شبكة

    const user = registeredUsers.find((u) => u.email === cleanEmail && u.password === password);

    if (!user) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      setIsLoading(false);
      return;
    }

    try {
      localStorage.setItem(
        'taysir_auth',
        JSON.stringify({ email: user.email, name: user.name, loginTime: new Date().toISOString() }),
      );
    } catch {
      setError('تعذّر حفظ جلسة الدخول. تحقق من إعدادات المتصفح وحاول مرة أخرى.');
      setIsLoading(false);
      return;
    }

    // يُعلم useAuth والشريط العلوي بالجلسة الجديدة فورًا
    notifyAuthChange();
    router.push('/dashboard');
  };

  // خارج وضع العرض لا يوجد تسجيل دخول حقيقي
  if (!DEMO_MODE) {
    return (
      <main className="flex items-center justify-center p-6 py-16">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-[#1a1a2e]">
          <h1 className="mb-4 text-3xl font-black text-blue-800 dark:text-blue-300">تسجيل الدخول</h1>
          <p className="mb-6 text-xl text-slate-800 dark:text-gray-200">
            تسجيل الدخول غير متاح حاليًا في هذه النسخة. يمكنك استخدام الماسح والتمارين والألعاب دون حساب.
          </p>
          <Link
            href="/contact"
            className={`inline-block rounded-md py-1 font-bold text-blue-800 underline underline-offset-4 hover:text-blue-950 dark:text-blue-300 dark:hover:text-blue-100 ${focusRing}`}
          >
            تواصل معنا
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center p-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-black text-blue-800 dark:text-blue-300 md:text-4xl">
            منصة تيسير AI
          </h1>
          <p className="text-xl text-slate-800 dark:text-gray-200">تسجيل الدخول لمتابعة تقدم طفلك</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl dark:bg-[#1a1a2e]">
          <div className="mb-6 rounded-xl bg-blue-50 p-4 text-sm dark:bg-blue-950">
            <p className="mb-2 flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200">
              <Icon name="key" className="h-5 w-5 shrink-0" />
              بيانات تجريبية للدخول:
            </p>
            <p className="text-slate-800 dark:text-gray-200">
              البريد: <span className="font-mono font-bold">parent@taysir.ai</span>
            </p>
            <p className="text-slate-800 dark:text-gray-200">
              كلمة المرور: <span className="font-mono font-bold">123456</span>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6" noValidate aria-busy={isLoading}>
            {error && (
              <div
                id="login-error"
                role="alert"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-700 bg-red-50 p-4 text-center font-bold text-red-900 dark:border-red-300 dark:bg-red-950 dark:text-red-200"
              >
                <Icon name="warning" className="h-6 w-6 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className={labelClass}>
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className={inputClass}
                dir="ltr"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                dir="ltr"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-800 py-4 text-xl font-bold text-white transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-gray-500 dark:bg-blue-300 dark:text-blue-950 dark:hover:bg-blue-200 dark:disabled:bg-gray-600 dark:disabled:text-gray-200 ${focusRing}`}
            >
              {isLoading ? (
                <>
                  <Icon name="spinner" className="h-6 w-6 animate-spin motion-reduce:animate-none" />
                  جارٍ الدخول...
                </>
              ) : (
                <>
                  <Icon name="lock" />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-800 dark:text-gray-300">
              ليس لديك حساب؟{' '}
              <Link
                href="/contact"
                className={`rounded-md font-bold text-blue-800 underline underline-offset-4 hover:text-blue-950 dark:text-blue-300 dark:hover:text-blue-100 ${focusRing}`}
              >
                تواصل معنا لإنشاء حساب
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
