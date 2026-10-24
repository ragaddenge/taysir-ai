import Link from 'next/link';

const quickLinks = [
  { href: '/scanner', label: 'الماسح الذكي' },
  { href: '/exercises', label: 'التمارين' },
  { href: '/games', label: 'الألعاب التعليمية' },
  { href: '/how-it-works', label: 'كيف يعمل' },
];

const LOGO_PATH =
  'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z';
const MAIL_PATH =
  'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75';
const PIN_PATHS = [
  'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z',
  'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
];

function Icon({ paths, className = 'h-5 w-5' }: { paths: string[]; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      {paths.map((d) => (
        <path key={d} strokeLinecap="round" strokeLinejoin="round" d={d} />
      ))}
    </svg>
  );
}

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:focus-visible:outline-blue-400';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-900 print:hidden dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3">
        {/* التعريف */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-white">
              <Icon paths={[LOGO_PATH]} className="h-6 w-6" />
            </span>
            <span className="text-xl font-black">
              تيسير <span className="text-blue-800 dark:text-blue-400">AI</span>
            </span>
          </div>
          <p className="max-w-sm text-base font-bold leading-relaxed text-gray-700 dark:text-gray-300">
            منصة عربية تستخدم الذكاء الاصطناعي لرصد مؤشرات محتملة لأخطاء الكتابة
            لدى الأطفال، وتقدّم تمارين وألعابًا للتدريب.
          </p>
        </div>

        {/* روابط سريعة */}
        <nav aria-label="روابط سريعة">
          <h2 className="mb-4 text-lg font-black text-blue-800 dark:text-blue-300">
            روابط سريعة
          </h2>
          <ul className="space-y-1">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`inline-block rounded-md py-1.5 text-base font-bold text-gray-800 transition-colors hover:text-blue-800 dark:text-gray-200 dark:hover:text-blue-300 ${focusRing}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* تواصل */}
        <div>
          <h2 className="mb-4 text-lg font-black text-blue-800 dark:text-blue-300">
            تواصل معنا
          </h2>
          <ul className="space-y-3 text-base font-bold text-gray-800 dark:text-gray-200">
            <li className="flex items-center gap-2">
              <Icon paths={[MAIL_PATH]} className="h-5 w-5 shrink-0 text-blue-800 dark:text-blue-300" />
              <a
                href="mailto:soosooalx@gmail.com"
                dir="ltr"
                className={`rounded-md py-1 transition-colors hover:text-blue-800 dark:hover:text-blue-300 ${focusRing}`}
              >
                soosooalx@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Icon paths={PIN_PATHS} className="h-5 w-5 shrink-0 text-blue-800 dark:text-blue-300" />
              مصر
            </li>
            <li>
              <Link
                href="/contact"
                className={`inline-block rounded-md py-1 font-black text-blue-800 underline underline-offset-4 hover:text-blue-950 dark:text-blue-300 dark:hover:text-blue-100 ${focusRing}`}
              >
                أرسل لنا رسالة
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800">
        <p className="mx-auto max-w-7xl px-4 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300">
          النتائج أولية وليست تشخيصًا طبيًا. © {new Date().getFullYear()} تيسير AI
        </p>
      </div>
    </footer>
  );
}
