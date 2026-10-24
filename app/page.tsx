import Link from 'next/link';

// الأزرار الرئيسية: نفس الألوان الغامقة في الوضعين مع نص أبيض (تباين جيد)،
// والأيقونات SVG بدل الإيموجي لمظهر موحّد
const buttons = [
  {
    href: '/scanner',
    label: 'ابدأ المسح الذكي',
    color:
      'bg-blue-800 hover:bg-blue-900 focus-visible:outline-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus-visible:outline-blue-400',
    icon: [
      'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z',
      'M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z',
    ],
  },
  {
    href: '/exercises',
    label: 'جرّب التمارين',
    color:
      'bg-green-800 hover:bg-green-900 focus-visible:outline-green-800 dark:bg-green-700 dark:hover:bg-green-600 dark:focus-visible:outline-green-400',
    icon: [
      'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
    ],
  },
  {
    href: '/games',
    label: 'الألعاب التعليمية',
    color:
      'bg-red-700 hover:bg-red-800 focus-visible:outline-red-700 dark:bg-red-600 dark:hover:bg-red-500 dark:focus-visible:outline-red-400',
    icon: [
      'M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      'M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z',
    ],
  },
];

const notes = [
  {
    text: 'النتائج أولية وليست تشخيصاً طبياً',
    icon: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
  },
  {
    text: 'ملفات الأطفال محفوظة على جهازك فقط',
    icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
  },
];

const features = [
  {
    title: 'تحليل ذكي',
    text: 'يرصد مؤشرات محتملة لأخطاء الكتابة العربية من صورة خط اليد',
    gradient: 'from-blue-800 to-blue-600',
    titleColor: 'text-blue-800 dark:text-blue-300',
    path: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    title: 'تمارين وألعاب',
    text: 'تمارين وألعاب تعليمية بسيطة لتدريب القراءة والكتابة',
    gradient: 'from-green-800 to-green-600',
    titleColor: 'text-green-800 dark:text-green-300',
    path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
  {
    title: 'تقارير واضحة',
    text: 'ملاحظات ورسوم واضحة عن الأخطاء ونقاط القوة في عينة الكتابة',
    gradient: 'from-purple-800 to-purple-600',
    titleColor: 'text-purple-800 dark:text-purple-300',
    path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
];

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-8 pt-16">
      <div className="max-w-4xl text-center">
        <h1 className="mb-6 text-4xl font-black text-blue-800 dark:text-blue-300 md:text-6xl">
          منصة تيسير <span className="text-green-800 dark:text-green-300">AI</span>
        </h1>

        <p className="mb-8 text-2xl leading-relaxed text-slate-800 dark:text-gray-200 md:text-3xl">
          ذكاء يفهم تحديك.. ويصمم حلّك
        </p>

        <p className="mx-auto mb-12 max-w-3xl text-lg leading-loose text-slate-700 dark:text-gray-300 md:text-xl">
          منصة عربية تستخدم الذكاء الاصطناعي لتحليل أخطاء الكتابة لدى الأشخاص ذوي عسر
          القراءة (الدسلكسيا)، وتقدّم تمارين وألعاباً للتدريب.
        </p>

        <div className="mx-auto mb-4 flex max-w-md flex-col gap-5">
          {buttons.map((b) => (
            <Link
              key={b.href}
              href={b.href}
              className={`${b.color} inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-xl font-bold text-white shadow-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4`}
            >
              <svg
                className="h-7 w-7 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                aria-hidden="true"
              >
                {b.icon.map((d) => (
                  <path key={d} strokeLinecap="round" strokeLinejoin="round" d={d} />
                ))}
              </svg>
              {b.label}
            </Link>
          ))}
        </div>

        {/* زر ثانوي: ملفات الأطفال محفوظة على الجهاز فقط */}
        <div className="mx-auto mb-16 mt-8 flex max-w-md flex-col items-center gap-4">
          <Link
            href="/users"
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-8 py-3 text-lg font-semibold text-slate-800 transition-colors hover:border-slate-500 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:focus-visible:outline-slate-300"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            ملفات الأطفال
          </Link>
          <div className="grid w-full gap-3 sm:grid-cols-2">
            {notes.map((n) => (
              <div
                key={n.text}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 text-center px-4 py-3 text-base font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
              >
                <svg
                  className="h-5 w-5 shrink-0 text-slate-600 dark:text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={n.icon} />
                </svg>
                {n.text}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-slate-700 dark:bg-[#1a1a2e]"
            >
              <div
                className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br ${f.gradient} transition-transform group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
              >
                <svg
                  className="h-12 w-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.path} />
                </svg>
              </div>
              <h3 className={`mb-3 text-2xl font-black ${f.titleColor}`}>{f.title}</h3>
              <p className="text-lg leading-relaxed text-slate-700 dark:text-gray-300">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
