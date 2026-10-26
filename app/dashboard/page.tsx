'use client';
import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

// ---------- أيقونات SVG ----------
const ICONS = {
  camera: [
    'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z',
    'M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z',
  ],
  check: ['M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'],
  fire: [
    'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z',
    'M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z',
  ],
  star: [
    'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  ],
  trophy: [
    'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0',
  ],
  book: [
    'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
  ],
  target: [
    'M12 21a9 9 0 100-18 9 9 0 000 18z',
    'M12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9z',
    'M12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  ],
  play: [
    'M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z',
  ],
  mail: [
    'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  ],
  chart: [
    'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  ],
  logout: [
    'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9',
  ],
  info: [
    'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
  ],
} as const;

type IconName = keyof typeof ICONS;

function Icon({ name, className = 'h-6 w-6' }: { name: IconName; className?: string }) {
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
      {ICONS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

// ---------- البيانات التجريبية ----------
const CHILD_NAME = 'أحمد';

const weeklyProgress = [
  { day: 'السبت', score: 75 },
  { day: 'الأحد', score: 82 },
  { day: 'الاثنين', score: 78 },
  { day: 'الثلاثاء', score: 88 },
  { day: 'الأربعاء', score: 92 },
  { day: 'الخميس', score: 95 },
  { day: 'الجمعة', score: 90 },
];

const achievements: { id: number; title: string; icon: IconName; color: string; unlocked: boolean }[] = [
  { id: 1, title: 'أول تحليل', icon: 'target', color: 'from-blue-800 to-blue-600', unlocked: true },
  { id: 2, title: '10 تمارين', icon: 'check', color: 'from-green-800 to-green-600', unlocked: true },
  { id: 3, title: 'أسبوع متواصل', icon: 'fire', color: 'from-red-700 to-red-600', unlocked: true },
  { id: 4, title: '100% دقة', icon: 'star', color: 'from-amber-800 to-amber-700', unlocked: false },
  { id: 5, title: 'بطل القراءة', icon: 'book', color: 'from-purple-800 to-purple-700', unlocked: false },
  { id: 6, title: 'خبير الإملاء', icon: 'trophy', color: 'from-cyan-800 to-cyan-700', unlocked: false },
];

const recentActivities: { type: string; title: string; time: string; icon: IconName; color: string }[] = [
  { type: 'تحليل', title: 'مسح ورقة كتابة جديدة', time: 'منذ ساعتين', icon: 'camera', color: 'bg-blue-800' },
  { type: 'تمرين', title: 'أكمل تمرين التاء المربوطة', time: 'منذ 5 ساعات', icon: 'check', color: 'bg-green-800' },
  { type: 'لعبة', title: 'حقق 100 نقطة في القراءة السريعة', time: 'أمس', icon: 'play', color: 'bg-red-700' },
  { type: 'إنجاز', title: 'حصل على شارة "أول تحليل"', time: 'منذ يومين', icon: 'star', color: 'bg-amber-700' },
];

const recommendations = [
  {
    title: 'تركيز على النقاط',
    desc: 'أحمد يحتاج تمارين إضافية على وضع النقاط',
    priority: 'عالي',
    color: 'border-red-700 dark:border-red-300',
  },
  {
    title: 'تمارين الهمزة',
    desc: 'تحسن ملحوظ، استمر في التمارين اليومية',
    priority: 'متوسط',
    color: 'border-amber-600 dark:border-amber-300',
  },
  {
    title: 'القراءة الجهرية',
    desc: 'قراءة 15 دقيقة يوميًا لتحسين الطلاقة',
    priority: 'منخفض',
    color: 'border-green-700 dark:border-green-300',
  },
];

const priorityStyle: Record<string, string> = {
  عالي: 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200',
  متوسط: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  منخفض: 'bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200',
};

const quickActions: { href: string; icon: IconName; label: string }[] = [
  { href: '/scanner', icon: 'camera', label: 'مسح جديد' },
  { href: '/exercises', icon: 'target', label: 'تمارين' },
  { href: '/games', icon: 'play', label: 'ألعاب' },
  { href: '/contact', icon: 'mail', label: 'تواصل معنا' },
];

// ---------- قراءة localStorage دون setState داخل effect ----------
function subscribeStorage(cb: () => void) {
  window.addEventListener('storage', cb);
  return () => window.removeEventListener('storage', cb);
}

function useStoredJSON(key: string): unknown {
  const raw = useSyncExternalStore(
    subscribeStorage,
    () => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => null,
  );
  return useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  }, [raw]);
}

// البيانات المخزنة قد تكون معدّلة أو تالفة، فلا نعرض منها إلا نصًا أو رقمًا سليمًا
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const asNum = (v: unknown): number | undefined =>
  typeof v === 'number' && Number.isFinite(v) ? v : undefined;
const asText = (v: unknown): string =>
  typeof v === 'string' || typeof v === 'number' ? String(v) : '';

// ---------- أنماط مشتركة ----------
const card = 'rounded-2xl bg-white p-8 shadow-lg dark:bg-[#1a1a2e]';
const inner = 'rounded-xl bg-slate-100 dark:bg-[#0f0f1e]';
const heading = 'text-2xl font-black text-slate-900 dark:text-white';
const muted = 'text-slate-700 dark:text-gray-300';
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export default function DashboardPage() {
  const { user, checked, logout } = useAuth();
  const rawScans = useStoredJSON('taysir_scan_results');
  const rawStats = useStoredJSON('taysir_dashboard_stats');

  const scanResults = useMemo(
    () =>
      Array.isArray(rawScans)
        ? rawScans
            .filter(isObj)
            .slice(-5)
            .reverse()
            .map((s) => ({
              id: asText(s.id),
              date: asText(s.date),
              accuracy: asNum(s.accuracy),
              errors: asNum(s.errors),
            }))
        : [],
    [rawScans],
  );

  const stats = isObj(rawStats)
    ? { averageAccuracy: asNum(rawStats.averageAccuracy), totalExercises: asNum(rawStats.totalExercises) }
    : {};

  const statCards: {
    icon: IconName;
    iconStyle: string;
    tag: string;
    tagColor: string;
    value: number;
    label: string;
  }[] = [
    {
      icon: 'chart',
      iconStyle: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      tag: '+12%',
      tagColor: 'text-green-800 dark:text-green-300',
      value: stats.totalExercises ?? 24,
      label: 'تمرين مكتمل',
    },
    {
      icon: 'trophy',
      iconStyle: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
      tag: '+3',
      tagColor: 'text-green-800 dark:text-green-300',
      value: 3,
      label: 'شارات جديدة',
    },
    {
      icon: 'fire',
      iconStyle: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
      tag: '7 أيام',
      tagColor: 'text-red-700 dark:text-red-300',
      value: 12,
      label: 'سلسلة يومية',
    },
    {
      icon: 'star',
      iconStyle: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
      tag: 'المستوى 5',
      tagColor: 'text-purple-800 dark:text-purple-300',
      value: 450,
      label: 'نقطة إجمالية',
    },
  ];

  // حماية للعرض فقط: إن لم يكن المستخدم مسجّلًا يحوّله الـ hook إلى /login
  if (!checked || !user) {
    return (
      <main
        className="flex min-h-[50vh] items-center justify-center text-xl text-slate-800 dark:text-gray-200"
        role="status"
      >
        جارٍ التحقق من تسجيل الدخول...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      {/* تنبيه: البيانات تجريبية */}
      <div
        role="note"
        className="mb-6 flex items-start gap-3 rounded-xl border-2 border-amber-700 bg-amber-50 p-4 text-amber-950 dark:border-amber-300 dark:bg-amber-950 dark:text-amber-100"
      >
        <Icon name="info" className="mt-0.5 h-6 w-6 shrink-0" />
        <p className="text-base font-bold leading-relaxed">
          بيانات تجريبية لعرض الفكرة: الأرقام والشارات والنشاطات والتوصيات في هذه الصفحة
          نموذجية، وليست نتائج فعلية لطفل. ربطها ببيانات حقيقية مرحلة قادمة.
        </p>
      </div>

      {/* الترحيب */}
      <div className="mb-8 rounded-3xl bg-linear-to-r from-blue-800 to-green-800 p-8 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-black md:text-4xl">مرحبًا {user.name}!</h1>
            <p className="text-xl">مثال لملخص تقدم الطفل {CHILD_NAME} هذا الأسبوع</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-6 text-center">
              <div className="text-5xl font-black">{stats.averageAccuracy ?? 92}%</div>
              <div className="text-lg">معدل هذا الأسبوع</div>
            </div>
            <button
              type="button"
              onClick={logout}
              className={`flex items-center gap-2 rounded-xl bg-white/20 px-5 py-3 font-bold transition-colors hover:bg-white/30 ${focusRing}`}
            >
              <Icon name="logout" className="h-5 w-5" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      {/* كروت الإحصائيات */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-6 shadow-lg dark:bg-[#1a1a2e]">
            <div className="mb-4 flex items-center justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.iconStyle}`}>
                <Icon name={s.icon} />
              </div>
              <span className={`text-sm font-bold ${s.tagColor}`}>{s.tag}</span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{s.value}</div>
            <div className={muted}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* الشبكة الرئيسية */}
      <div className="mb-8 grid gap-8 lg:grid-cols-3">
        <section className={`${card} lg:col-span-2`} aria-labelledby="weekly-title">
          <div className="mb-6 flex items-center justify-between">
            <h2 id="weekly-title" className={heading}>
              تقدم الأسبوع
            </h2>
            <span className={`rounded-lg px-4 py-2 font-bold ${inner} text-slate-900 dark:text-white`}>
              هذا الأسبوع
            </span>
          </div>

          <ul className="flex h-64 items-end justify-between gap-3">
            {weeklyProgress.map((d) => (
              <li key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="sr-only">
                  {d.day}: {d.score}%
                </span>
                <div aria-hidden="true" className="text-sm font-bold text-slate-800 dark:text-gray-200">
                  {d.score}%
                </div>
                <div
                  aria-hidden="true"
                  className="w-full rounded-t-lg bg-linear-to-t from-blue-800 to-green-700"
                  style={{ height: `${d.score * 2.2}px` }}
                />
                <div aria-hidden="true" className={`text-sm font-bold ${muted}`}>
                  {d.day}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={card} aria-labelledby="ach-title">
          <h2 id="ach-title" className={`${heading} mb-6`}>
            الإنجازات
          </h2>
          <ul className="grid grid-cols-3 gap-4">
            {achievements.map((b) => (
              <li
                key={b.id}
                className={`flex aspect-square flex-col items-center justify-center rounded-2xl p-2 text-center ${
                  b.unlocked
                    ? `bg-linear-to-br ${b.color} text-white shadow-lg`
                    : 'border-2 border-dashed border-gray-400 bg-gray-100 text-gray-700 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                <Icon name={b.icon} className="mb-1 h-8 w-8" />
                <span className="text-sm font-bold leading-tight">{b.title}</span>
                <span className="text-xs font-bold">{b.unlocked ? 'تم' : 'مقفلة'}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* آخر التحليلات */}
      {scanResults.length > 0 && (
        <section className={`${card} mb-8`} aria-labelledby="scans-title">
          <h2 id="scans-title" className={`${heading} mb-6`}>
            آخر التحليلات
          </h2>
          <ul className="space-y-4">
            {scanResults.map((scan, i) => (
              <li key={i} className={`flex items-center gap-4 p-4 ${inner}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-800 text-white">
                  <Icon name="camera" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    تحليل #{scan.id.slice(-4) || '—'}
                  </div>
                  <div className={`text-sm ${muted}`}>{scan.date || '—'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-green-800 dark:text-green-300">
                    {scan.accuracy === undefined ? '—' : `${scan.accuracy}%`}
                  </div>
                  <div className={`text-sm ${muted}`}>دقة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-red-700 dark:text-red-300">
                    {scan.errors ?? '—'}
                  </div>
                  <div className={`text-sm ${muted}`}>أخطاء</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* النشاطات والتوصيات */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <section className={card} aria-labelledby="act-title">
          <h2 id="act-title" className={`${heading} mb-6`}>
            آخر النشاطات
          </h2>
          <ul className="space-y-4">
            {recentActivities.map((a) => (
              <li key={a.title} className={`flex items-center gap-4 p-4 ${inner}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${a.color}`}>
                  <Icon name={a.icon} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 dark:text-white">{a.title}</div>
                  <div className={`text-sm ${muted}`}>{a.time}</div>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-800 dark:bg-[#1a1a2e] dark:text-gray-200">
                  {a.type}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className={card} aria-labelledby="rec-title">
          <h2 id="rec-title" className={`${heading} mb-6`}>
            توصيات (مثال)
          </h2>
          <ul className="space-y-4">
            {recommendations.map((r) => (
              <li key={r.title} className={`border-s-4 p-5 ${inner} ${r.color}`}>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-black text-slate-900 dark:text-white">{r.title}</h3>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${priorityStyle[r.priority]}`}>
                    {r.priority}
                  </span>
                </div>
                <p className="text-slate-800 dark:text-gray-200">{r.desc}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* إجراءات سريعة */}
      <section
        aria-labelledby="quick-title"
        className="rounded-3xl bg-linear-to-r from-purple-800 to-blue-800 p-8 text-white shadow-xl"
      >
        <h2 id="quick-title" className="mb-6 text-3xl font-black">
          إجراءات سريعة
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          {quickActions.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className={`flex flex-col items-center gap-2 rounded-2xl bg-white/20 p-6 text-center transition-colors hover:bg-white/30 ${focusRing}`}
            >
              <Icon name={q.icon} className="h-10 w-10" />
              <span className="font-bold">{q.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
