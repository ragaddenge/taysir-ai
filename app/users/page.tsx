'use client';
import { useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

// ⚠️ ملفات الأطفال تُحفظ في هذا المتصفح فقط (localStorage) وليست حماية حقيقية.
// قبل استعمال بيانات حقيقية: موافقة ولي الأمر + تخزين آمن على السيرفر + حماية دخول حقيقية.
// أحمد وفاطمة وما يظهر تحت ملفيهما من تقدم ونشاطات بيانات تجريبية للعرض.

const PROFILES_KEY = 'taysir_profiles'; // نفس المفتاح الذي يقرأه الماسح
const CHANGE_EVENT = 'taysir-profiles-change';

type Profile = { id: string; name: string; age: number | null; grade: string };
type Detail = {
  lastSeen: string;
  skills: { name: string; value: number }[];
  activities: { date: string; title: string; result: string }[];
  focus: string[];
  note: string;
};

const DEFAULT_PROFILES: Profile[] = [
  { id: 'ahmed', name: 'أحمد', age: 8, grade: 'الصف الثالث' },
  { id: 'fatima', name: 'فاطمة', age: 7, grade: 'الصف الثاني' },
];

const DEMO_DETAILS: Record<string, Detail> = {
  ahmed: {
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
  fatima: {
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
};

// ---------- التخزين ----------
function subscribe(cb: () => void) {
  window.addEventListener('storage', cb);
  window.addEventListener(CHANGE_EVENT, cb);
  return () => {
    window.removeEventListener('storage', cb);
    window.removeEventListener(CHANGE_EVENT, cb);
  };
}

function getRaw(): string | null {
  try {
    return localStorage.getItem(PROFILES_KEY);
  } catch {
    return null;
  }
}

function parseProfiles(raw: string | null): Profile[] {
  if (raw === null) return DEFAULT_PROFILES;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return DEFAULT_PROFILES;
    return data.flatMap((p): Profile[] => {
      if (typeof p !== 'object' || p === null) return [];
      const r = p as Record<string, unknown>;
      if (typeof r.id !== 'string' || typeof r.name !== 'string' || !r.name.trim()) return [];
      return [
        {
          id: r.id,
          name: r.name.trim().slice(0, 30),
          age: typeof r.age === 'number' ? r.age : null,
          grade: typeof r.grade === 'string' ? r.grade.slice(0, 30) : '',
        },
      ];
    });
  } catch {
    return DEFAULT_PROFILES;
  }
}

function saveProfiles(list: Profile[]): boolean {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(list));
  } catch {
    return false;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return true;
}

// ---------- الأنماط ----------
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:focus-visible:outline-blue-300';
const card =
  'rounded-3xl border border-slate-300 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-[#1a1a2e]';
const h2 = 'mb-4 text-xl font-bold text-slate-900 dark:text-white';
const primaryBtn = `inline-block rounded-xl bg-blue-800 px-5 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-900 dark:bg-blue-300 dark:text-blue-950 dark:hover:bg-blue-200 ${focusRing}`;
const dangerBtn = `rounded-xl border-2 border-red-700 px-5 py-3 text-lg font-bold text-red-800 transition-colors hover:bg-red-50 dark:border-red-300 dark:text-red-200 dark:hover:bg-red-950 ${focusRing}`;
const inputClass =
  'w-full rounded-xl border-2 border-slate-500 bg-white p-3 text-lg text-slate-900 focus:border-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-800/30 dark:border-gray-400 dark:bg-[#0f0f1e] dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-300/30';
const labelClass = 'mb-1 block font-bold text-slate-900 dark:text-gray-200';

// ---------- الصفحة (محمية بالجلسة) ----------
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
  const raw = useSyncExternalStore(subscribe, getRaw, () => null);
  const profiles = useMemo(() => parseProfiles(raw), [raw]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [formError, setFormError] = useState('');

  const child = profiles.find((p) => p.id === selectedId) ?? profiles[0] ?? null;
  const detail = child ? DEMO_DETAILS[child.id] : undefined;

  const addChild = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setFormError('اكتب اسم الطفل (الاسم الأول فقط).');
      return;
    }
    const id = globalThis.crypto?.randomUUID?.() ?? `c${Date.now()}`;
    const next: Profile[] = [
      ...profiles,
      { id, name: cleanName.slice(0, 30), age: age ? Number(age) : null, grade: grade.trim().slice(0, 30) },
    ];
    if (!saveProfiles(next)) {
      setFormError('تعذّر الحفظ. تحقق من إعدادات المتصفح (التصفح الخاص يمنع الحفظ).');
      return;
    }
    setName('');
    setAge('');
    setGrade('');
    setFormError('');
    setSelectedId(id);
  };

  const removeChild = (p: Profile) => {
    if (!window.confirm(`حذف ملف ${p.name}؟ لا يمكن التراجع.`)) return;
    saveProfiles(profiles.filter((x) => x.id !== p.id));
    setSelectedId(null);
  };

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6 py-10">
      <header>
        <h1 className="text-3xl font-black text-blue-800 dark:text-blue-300 md:text-4xl">ملفات الأطفال</h1>
        <p className="mt-2 text-lg text-slate-800 dark:text-gray-200">
          اختر الطفل لعرض ملفه، أو أضف طفلًا جديدًا.
        </p>
      </header>

      <div
        role="note"
        className="rounded-2xl border-2 border-amber-700 bg-amber-50 p-4 text-amber-950 dark:border-amber-300 dark:bg-amber-950 dark:text-amber-100"
      >
        الملفات تُحفظ في هذا المتصفح فقط. اكتب الاسم الأول وحده دون أي بيانات تعريفية. بيانات أحمد وفاطمة
        تجريبية للعرض.
      </div>

      {profiles.length > 0 && (
        <nav aria-label="اختيار الطفل">
          <ul className="flex flex-wrap gap-3">
            {profiles.map((p) => {
              const active = child?.id === p.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(p.id)}
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
                      {p.name.charAt(0)}
                    </span>
                    {p.name}
                    {active && <span className="sr-only"> (المحدد)</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {child ? (
        <>
          <section aria-labelledby="child-name" className={card}>
            <h2 id="child-name" className="text-2xl font-black text-slate-900 dark:text-white">
              {child.name}
            </h2>
            <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-slate-800 dark:text-gray-200">
              {child.age !== null && (
                <div className="flex gap-2">
                  <dt className="font-bold">العمر:</dt>
                  <dd>{child.age} سنوات</dd>
                </div>
              )}
              {child.grade && (
                <div className="flex gap-2">
                  <dt className="font-bold">المرحلة:</dt>
                  <dd>{child.grade}</dd>
                </div>
              )}
              {detail && (
                <div className="flex gap-2">
                  <dt className="font-bold">آخر نشاط:</dt>
                  <dd>{detail.lastSeen}</dd>
                </div>
              )}
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/scanner?child=${encodeURIComponent(child.id)}`} className={primaryBtn}>
                حلّل ورقة كتابة
              </Link>
              <Link href="/exercises" className={primaryBtn}>
                ابدأ تمرينًا
              </Link>
              <button type="button" onClick={() => removeChild(child)} className={dangerBtn}>
                حذف الملف
              </button>
            </div>
          </section>

          {detail ? (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <section aria-labelledby="skills-title" className={card}>
                  <h2 id="skills-title" className={h2}>
                    مستوى المهارات
                  </h2>
                  <ul className="space-y-4">
                    {detail.skills.map((s) => (
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
                          <div
                            className="h-4 rounded-full bg-blue-800 dark:bg-blue-300"
                            style={{ width: `${s.value}%` }}
                          />
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
                    {detail.activities.map((a) => (
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
                    {detail.focus.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="note-title" className={card}>
                  <h2 id="note-title" className={h2}>
                    ملاحظة للمتابعة
                  </h2>
                  <p className="leading-loose text-slate-800 dark:text-gray-200">{detail.note}</p>
                  <p className="mt-3 text-sm text-slate-700 dark:text-gray-300">
                    هذه ملاحظات تدريب وليست تشخيصًا. لأي قلق يُنصح بمراجعة أخصائي صعوبات تعلم معتمد.
                  </p>
                </section>
              </div>
            </>
          ) : (
            <section className={card}>
              <p className="text-lg text-slate-800 dark:text-gray-200">
                لا توجد نشاطات مسجلة لهذا الطفل بعد. ابدأ بتمرين أو حلّل ورقة كتابة.
              </p>
            </section>
          )}
        </>
      ) : (
        <section className={card}>
          <p className="text-lg text-slate-800 dark:text-gray-200">لا توجد ملفات بعد. أضف طفلًا من النموذج أدناه.</p>
        </section>
      )}

      <section aria-labelledby="add-title" className={card}>
        <h2 id="add-title" className={h2}>
          إضافة طفل
        </h2>
        <form onSubmit={addChild} noValidate className="space-y-4">
          {formError && (
            <p
              id="form-error"
              role="alert"
              className="rounded-xl border-2 border-red-700 bg-red-50 p-3 font-bold text-red-900 dark:border-red-300 dark:bg-red-950 dark:text-red-200"
            >
              {formError}
            </p>
          )}
          <div>
            <label htmlFor="child-name-input" className={labelClass}>
              الاسم الأول
            </label>
            <input
              id="child-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              autoComplete="off"
              className={inputClass}
              aria-invalid={formError ? true : undefined}
              aria-describedby={formError ? 'form-error' : undefined}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="child-age" className={labelClass}>
                العمر (اختياري)
              </label>
              <select id="child-age" value={age} onChange={(e) => setAge(e.target.value)} className={inputClass}>
                <option value="">غير محدد</option>
                {Array.from({ length: 11 }, (_, i) => i + 4).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="child-grade" className={labelClass}>
                المرحلة (اختياري)
              </label>
              <input
                id="child-grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                maxLength={30}
                placeholder="مثال: الصف الثالث"
                autoComplete="off"
                className={inputClass}
              />
            </div>
          </div>
          <button type="submit" className={primaryBtn}>
            إضافة الطفل
          </button>
        </form>
      </section>
    </main>
  );
}
