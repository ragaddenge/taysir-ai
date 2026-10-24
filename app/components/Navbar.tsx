'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/scanner', label: 'الماسح الذكي' },
  { href: '/exercises', label: 'التمارين' },
  { href: '/games', label: 'الألعاب' },
  { href: '/how-it-works', label: 'كيف يعمل' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'اتصل بنا' },
];

const LOGO_PATH =
  'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z';
const SUN_PATH =
  'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z';
const MOON_PATH =
  'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z';

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:focus-visible:outline-blue-400';

function Icon({ d, className = 'h-5 w-5' }: { d: string; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleDarkMode } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  const linkClass = (href: string) =>
    isActive(href)
      ? 'border border-blue-600/40 bg-blue-600/15 font-extrabold text-blue-900 shadow-sm backdrop-blur-md dark:border-blue-400/40 dark:bg-blue-400/20 dark:text-blue-200'
      : 'border border-transparent font-bold text-gray-800 hover:border-gray-300/70 hover:bg-white/60 hover:backdrop-blur-md dark:text-gray-200 dark:hover:border-white/15 dark:hover:bg-white/10 dark:hover:text-white';

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="sticky top-0 z-40 border-b border-white/40 bg-white/70 shadow-sm backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-gray-900/70 print:hidden"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* الشعار */}
          <Link href="/" className={`flex items-center gap-3 rounded-xl ${focusRing}`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-700/30 backdrop-blur-md">
              <Icon d={LOGO_PATH} className="h-6 w-6" />
            </span>
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
              تيسير <span className="text-blue-800 dark:text-blue-400">AI</span>
            </span>
          </Link>

          {/* قائمة الديسكتوب */}
          <ul className="hidden items-center gap-1 rounded-2xl border border-gray-300/60 bg-white/40 p-1 backdrop-blur-md dark:border-white/10 dark:bg-white/5 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`block rounded-xl px-3 py-2 text-base transition-colors ${linkClass(link.href)} ${focusRing}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* الأزرار */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="تبديل الوضع الداكن"
              title="تبديل الوضع الداكن"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/50 bg-amber-400/25 text-amber-900 shadow-sm backdrop-blur-md transition-colors hover:bg-amber-400/40 dark:border-amber-300/40 dark:bg-amber-300/20 dark:text-amber-200 dark:hover:bg-amber-300/30 ${focusRing}`}
            >
              <span className="dark:hidden">
                <Icon d={MOON_PATH} />
              </span>
              <span className="hidden dark:block">
                <Icon d={SUN_PATH} />
              </span>
            </button>

            <Link
              href="/dashboard"
              className={`hidden rounded-xl border border-white/30 bg-gradient-to-br from-blue-600 to-indigo-700 px-5 py-2 text-base font-black text-white shadow-lg shadow-blue-700/30 backdrop-blur-md transition hover:from-blue-500 hover:to-indigo-600 hover:shadow-blue-700/50 lg:block ${focusRing}`}
            >
              تسجيل الدخول
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border border-blue-600/40 bg-blue-600/15 text-blue-900 backdrop-blur-md transition-colors hover:bg-blue-600/25 dark:border-blue-400/40 dark:bg-blue-400/20 dark:text-blue-200 lg:hidden ${focusRing}`}
            >
              <Icon d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5'} />
            </button>
          </div>
        </div>

        {/* قائمة الموبايل */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="border-t border-white/40 py-3 dark:border-white/10 lg:hidden"
          >
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-base transition-colors ${linkClass(link.href)} ${focusRing}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`mt-3 block rounded-xl border border-white/30 bg-gradient-to-br from-blue-600 to-indigo-700 py-3 text-center text-base font-black text-white shadow-lg shadow-blue-700/30 transition hover:from-blue-500 hover:to-indigo-600 ${focusRing}`}
            >
              تسجيل الدخول
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
