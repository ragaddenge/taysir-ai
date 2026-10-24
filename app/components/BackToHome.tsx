'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// شريط "العودة للرئيسية": يظهر في كل الصفحات ما عدا الرئيسية، ويختفي عند الطباعة
export default function BackToHome() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-4 print:hidden sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-base font-bold text-slate-800 shadow-sm transition-colors hover:border-slate-500 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:focus-visible:outline-blue-400"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        العودة للرئيسية
      </Link>
    </div>
  );
}