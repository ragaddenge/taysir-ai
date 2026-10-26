'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

// ⚠️ بيانات تجريبية للعرض فقط. لا تُخزَّن هنا بيانات أطفال حقيقيين.
// الحماية هنا بجلسة المتصفح للعرض فقط. قبل استعمال بيانات حقيقية: موافقة ولي الأمر
// + تخزين آمن على السيرفر + حماية دخول حقيقية.

type Skill = { name: string; value: number };
type Activity = { date: string; title: string; result: string };
type Child = {
  id: string;
  name: string;
  age: number;
  grade: string;
  lastSeen: string;
  skills: Skill[];
  activities: Activity[];
  focus: string[];
  note: string;
};

const CHILDREN: Child[] = [
  {
    id: 'ahmed',
    name: 'أحمد',
    age: 8,
    grade: 'الصف الثالث',
    lastSeen: 'أمس',
    skills: [
      { name: 'الإملاء', value: 62 },
      { name: 'القراءة', value: 74 },
      { name: 'تمييز الحروف المتشابهة', value: 48 },
      { name: 'الكتابة اليدوية', value: 66 },
    ],
    activities: [
      { date: '24 أكتوبر', title: 'تمرين الإملاء', result: '4 من 5' },
      { date: '22 أكتوبر', title: 'تحليل ورقة كتابة', result: 'تقرير جاهز' },
      { date: '20 أكتوبر', title: 'لعبة الحروف', result: '12 من 15' },
    ],
    focus: ['التفريق بين ذ وز', 'كتابة الهمزة في وسط الكلمة'],
    note: 'يتحسن عندما يقرأ الكلمة بصوت مرتفع قبل كتابتها. جلسات قصيرة من 10 دقائق تناسبه أكثر.',
  },
  {
    id: 'fatima',
    name: 'فاطمة',
    age: 7,
    grade: 'الصف الثاني',
    lastSeen: 'قبل 3 أيام',
    skills: [
      { name: 'الإملاء', value: 81 },
      { name: 'القراءة', value: 88 },
      { name: 'تمييز الحروف المتشابهة', value: 70 },
      { name: 'الكتابة اليدوية', value: 59 },
    ],
    activities: [
      { date: '23 أكتوبر', title: 'تمرين الإملاء', result: '5 من 5' },
      { date: '21 أكتوبر', title: 'لعبة الحروف', result: '14 من 15' },
      { date: '18 أكتوبر', title: 'تحليل ورقة كتابة', result: 'تقرير جاهز' },
    ],
    focus: ['انتظام حجم الحروف على السطر', 'اتصال الحروف داخل الكلمة'],
    note: 'قراءتها قوية. الأفضل التركيز على تمارين الكتابة اليدوية وتتبع الحروف.',
  },
];

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:focus-visible:outline-blue-300';

const card =
  'rounded-3xl border border-slate-300 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-[#1a1a2e]';
const h2 = 'mb-4 text-xl font-bold text-slate-900 dark:text-white';
const linkBtn = `inline-block rounded-xl bg-blue-800 px-5 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-900 dark:bg-blue-300 dark:text-blue-950 dark:hover:bg-blue-200 ${focusRing}`;

export default function UsersPage() {
  // useAuth يحوّل غير المسجّل إلى /login تلقائيًا
  const { user, checked } = useAuth();

  if (!checked || !user) {
    return (
      <main className="mx-auto max-w-md p-6 py-16 text-center">
        <p role="status" className="text-xl text-slate-800 dark:text-gray-200">
          {checked ? 'يلزم تسجيل الدخول. جارٍ تحويلك...' : 'جارٍ التحقق من الجلسة...'}
        </p>
        {checked && (
          <Link
            href="/login"
            className={`mt-4 inline-block rounded-md py-1 font-bold text-blue-800 underline underline-offset-4 dark:text-blue-300 ${focusRing}`}
          >
            الذهاب إلى تسجيل الدخول
          </Link>
        )}
      </main>
    );
  }

  return <UsersContent />;
}

function UsersContent() {
  const [selectedId, setSelectedId] = useState(CHILDREN[0].id);
  const child = CHILDREN.find((c) => c.id === selectedId) ?? CHILDREN[0];

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6 py-10">
      <header>
        <h1 className="text-3xl font-black text-blue-800 dark:text-blue-300 md:text-4xl">ملفات الأطفال</h1>
        <p className="mt-2 text-lg text-slate-800 dark:text-gray-200">اختر الطفل لعرض تقدمه وآخر نشاطاته.</p>
      </header>

      <div
        role="note"
        className="rounded-2xl border-2 border-amber-700 bg-amber-50 p-4 text-amber-950 dark:border-amber-300 dark:bg-amber-950 dark:text-amber-100"
      >
        هذه بيانات تجريبية للعرض، وليست لأطفال حقيقيين.
      </div>

      <nav aria-label="اختيار الطفل">
        <ul className="flex flex-wrap gap-3">
          {CHILDREN.map((c) => {
            const active = c.id === child.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  aria-pressed={active}
                  className={`flex items-center gap-3 rounded-2xl border-2 px-5 py-3 text-lg font-bold transition-colors ${focusRing} ${
                    active
                      ? 'border-blue-800 bg-blue-800 text-white dark:border-blue-300 dark:bg-blue-300 dark:text-blue-950'
                      : 'border-slate-500 bg-white text-slate-900 hover:bg-slate-100 dark:border-gray-400 dark:bg-[#1a1a2e] dark:text-white dark:hover:bg-[#252540]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-base ${
                      active
                        ? 'bg-white text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                    }`}
                  >
                    {c.name.charAt(0)}
                  </span>
                  {c.name}
                  {active && <span className="sr-only"> (المحدد)</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <section aria-labelledby="child-name" className={card}>
        <h2 id="child-name" className="text-2xl font-black text-slate-900 dark:text-white">
          {child.name}
        </h2>
        <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-slate-800 dark:text-gray-200">
          <div className="flex gap-2">
            <dt className="font-bold">العمر:</dt>
            <dd>{child.age} سنوات</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-bold">المرحلة:</dt>
            <dd>{child.grade}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-bold">آخر نشاط:</dt>
            <dd>{child.lastSeen}</dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section aria-labelledby="skills-title" className={card}>
          <h2 id="skills-title" className={h2}>
            مستوى المهارات
          </h2>
          <ul className="space-y-4">
            {child.skills.map((s) => (
              <li key={s.name}>
                <div className="mb-1 flex justify-between font-semibold text-slate-900 dark:text-white">
                  <span>{s.name}</span>
                  <span>{s.value}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-label={s.name}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={s.value}
                  className="h-4 w-full overflow-hidden rounded-full bg-slate-300 dark:bg-slate-700"
                >
                  <div className="h-4 rounded-full bg-blue-800 dark:bg-blue-300" style={{ width: `${s.value}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="activity-title" className={card}>
          <h2 id="activity-title" className={h2}>
            آخر النشاطات
          </h2>
          <ul className="divide-y divide-slate-300 dark:divide-slate-700">
            {child.activities.map((a) => (
              <li key={`${a.date}-${a.title}`} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{a.title}</p>
                  <p className="text-sm text-slate-700 dark:text-gray-300">{a.date}</p>
                </div>
                <p className="font-bold text-blue-800 dark:text-blue-300">{a.result}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section aria-labelledby="focus-title" className={card}>
          <h2 id="focus-title" className={h2}>
            ما يحتاج تدريبًا
          </h2>
          <ul className="list-disc space-y-2 ps-5 leading-loose text-slate-800 marker:text-orange-700 dark:text-gray-200">
            {child.focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="note-title" className={card}>
          <h2 id="note-title" className={h2}>
            ملاحظة للمتابعة
          </h2>
          <p className="leading-loose text-slate-800 dark:text-gray-200">{child.note}</p>
          <p className="mt-3 text-sm text-slate-700 dark:text-gray-300">
            هذه ملاحظات تدريب وليست تشخيصًا. لأي قلق يُنصح بمراجعة أخصائي صعوبات تعلم معتمد.
          </p>
        </section>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/exercises" className={linkBtn}>
          ابدأ تمرينًا
        </Link>
        <Link href="/scanner" className={linkBtn}>
          حلّل ورقة كتابة
        </Link>
      </div>
    </main>
  );
}
