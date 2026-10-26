'use client';
import { useState, useEffect, useRef } from 'react';

export type Report = {
  text: string;
  totalWords: number;
  errors: { written: string; correct: string; type: string }[];
  writing: { aspect: string; level: string; note: string }[];
  indicators: string[];
  level: string;
  recommendations: string[];
};

type Props = { report: Report; imageSrc?: string | null };

const DISCLAIMER =
  'هذا تحليل أولي مدعوم بالذكاء الاصطناعي ولا يُعد تشخيصًا، ويعتمد على عينة كتابة واحدة. الأرقام هنا تقدير من قراءة الصورة. يُوصى بعرض النتيجة على أخصائي صعوبات تعلم معتمد.';

const card =
  'rounded-3xl border border-slate-300 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-[#1a1a2e] break-inside-avoid print:bg-white print:shadow-none';
const h3 = 'mb-4 text-lg font-bold text-slate-900 dark:text-white';
const gradient = 'bg-linear-to-l from-orange-700 to-pink-700';
const headerBtn =
  'rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

// أيقونات SVG بدل الإيموجي
const ICON_PATHS = {
  document:
    'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  warning:
    'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
};

function Icon({ name, className }: { name: keyof typeof ICON_PATHS; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[name]} />
    </svg>
  );
}

const levelIndex: Record<string, number> = { سليم: 1, خفيف: 2, ملحوظ: 3 };
const levelColor = ['', 'bg-green-700', 'bg-amber-600', 'bg-orange-700'];

/** دونات: كلمات لم تُرصد بها أخطاء مقابل كلمات مرصود بها أخطاء (تقدير أولي) */
function Donut({ ok, bad }: { ok: number; bad: number }) {
  const total = ok + bad;
  const r = 40;
  const c = 2 * Math.PI * r;
  const badLen = total ? (bad / total) * c : 0;
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <svg
        viewBox="0 0 100 100"
        className="h-40 w-40 -rotate-90"
        role="img"
        aria-label={`${ok} كلمات لم تُرصد بها أخطاء و${bad} كلمات مرصود بها أخطاء`}
      >
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="16"
          className="stroke-blue-700 dark:stroke-blue-400"
        />
        {bad > 0 && (
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth="16"
            strokeDasharray={`${badLen} ${c - badLen}`}
            className="stroke-orange-600"
          />
        )}
      </svg>
      <ul className="space-y-2 text-slate-800 dark:text-gray-200">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-4 w-4 rounded bg-blue-700 dark:bg-blue-400" />
          لم تُرصد بها أخطاء: <strong>{ok}</strong>
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-4 w-4 rounded bg-orange-600" />
          مرصود بها أخطاء: <strong>{bad}</strong>
        </li>
      </ul>
    </div>
  );
}

type CopyState = 'idle' | 'done' | 'failed';

export default function AnalysisReport({ report, imageSrc }: Props) {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const copyTimer = useRef<number | null>(null);

  // التاريخ يُحسب مرة واحدة (استدعاء Date داخل الرسم يخالف قواعد lint الحديثة)
  // الأرقام لاتينية لتتسق مع بقية أرقام التقرير
  const [date] = useState(() =>
    new Date().toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' }),
  );

  // عند الطباعة يُزال الوضع الداكن مؤقتًا، وإلا خرج النص أبيض على ورقة بيضاء
  useEffect(() => {
    const root = document.documentElement;
    let wasDark = false;
    const before = () => {
      wasDark = root.classList.contains('dark');
      root.classList.remove('dark');
    };
    const after = () => {
      if (wasDark) root.classList.add('dark');
    };
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    };
  }, []);

  // عدد الكلمات الفريدة المرصود بها أخطاء، فلا تُحسب الكلمة مرتين إن تكررت في الجدول
  const uniqueBad = new Set(report.errors.map((e) => e.written.trim()).filter(Boolean)).size;
  const bad = Math.min(uniqueBad, report.totalWords);
  const ok = Math.max(report.totalWords - bad, 0);
  const pct = report.totalWords ? Math.round((bad / report.totalWords) * 100) : 0;

  // توزيع أنواع الأخطاء
  const counts = new Map<string, number>();
  report.errors.forEach((e) => counts.set(e.type, (counts.get(e.type) ?? 0) + 1));
  const types = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(1, ...types.map(([, n]) => n));

  const copyReport = async () => {
    const lines = [
      'تقرير تحليل الكتابة اليدوية',
      `النص: ${report.text}`,
      `الكلمات: ${report.totalWords} | مرصود بها أخطاء (تقدير أولي): ${bad}`,
      ...report.errors.map((e) => `- ${e.written} ← ${e.correct} (${e.type})`),
      `المستوى التقديري: ${report.level}`,
      ...(report.indicators.length
        ? ['مؤشرات محتملة تستدعي المتابعة:', ...report.indicators.map((t) => `- ${t}`)]
        : []),
      'التوصيات:',
      ...report.recommendations.map((r) => `- ${r}`),
      DISCLAIMER,
    ];
    let next: CopyState = 'done';
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
    } catch {
      next = 'failed'; // الحافظة غير متاحة
    }
    setCopyState(next);
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopyState('idle'), 2500);
  };

  const copyLabel = copyState === 'done' ? 'تم النسخ' : copyState === 'failed' ? 'تعذّر النسخ' : 'نسخ';

  return (
    <article
      aria-labelledby="report-title"
      className="space-y-6 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]"
    >
      <header
        className={`flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6 text-white shadow-lg ${gradient}`}
      >
        <div>
          <h2 id="report-title" className="text-2xl font-black md:text-3xl">
            تقرير تحليل الكتابة اليدوية
          </h2>
          <p className="mt-1">{date} · تحليل أولي بالذكاء الاصطناعي</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button type="button" onClick={copyReport} className={headerBtn}>
            {copyLabel}
          </button>
          <button type="button" onClick={() => window.print()} className={headerBtn}>
            طباعة / PDF
          </button>
          <span role="status" className="sr-only">
            {copyState === 'done' ? 'تم نسخ التقرير' : copyState === 'failed' ? 'تعذّر نسخ التقرير' : ''}
          </span>
        </div>
      </header>

      {/* بلاطات الأرقام */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`${card} flex items-center justify-center p-3!`}>
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt="ورقة الكتابة التي تم تحليلها"
              className="max-h-28 w-full rounded-2xl object-contain"
            />
          ) : (
            <Icon name="document" className="h-12 w-12 text-slate-600 dark:text-gray-300" />
          )}
        </div>
        {[
          { label: 'كلمات النص', value: report.totalWords, color: 'text-blue-800 dark:text-blue-300' },
          { label: 'كلمات مرصود بها أخطاء', value: bad, color: 'text-orange-700 dark:text-orange-400' },
          {
            label: 'نسبة الكلمات المرصود بها أخطاء (تقدير أولي)',
            value: `${pct}%`,
            color: 'text-pink-700 dark:text-pink-300',
          },
        ].map((k) => (
          <div key={k.label} className={card}>
            <p className="text-sm font-semibold text-slate-700 dark:text-gray-300">{k.label}</p>
            <p className={`mt-1 text-4xl font-black ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* الرسوم */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className={card} aria-labelledby="chart-ratio">
          <h3 id="chart-ratio" className={h3}>
            الكلمات التي رُصدت بها أخطاء وغيرها
          </h3>
          {report.totalWords > 0 ? (
            <Donut ok={ok} bad={bad} />
          ) : (
            <p className="text-slate-700 dark:text-gray-300">لا توجد كلمات كافية للرسم.</p>
          )}
        </section>

        <section className={card} aria-labelledby="chart-types">
          <h3 id="chart-types" className={h3}>
            أنواع الأخطاء
          </h3>
          {types.length === 0 ? (
            <p className="text-slate-700 dark:text-gray-300">لم تُرصد أخطاء إملائية ظاهرة في هذه العينة.</p>
          ) : (
            <ul className="space-y-3">
              {types.map(([type, n]) => (
                <li key={type}>
                  <div className="mb-1 flex justify-between text-sm font-semibold text-slate-800 dark:text-gray-200">
                    <span>{type}</span>
                    <span>{n}</span>
                  </div>
                  <div
                    aria-hidden="true"
                    className="h-4 w-full overflow-hidden rounded-full bg-slate-300 dark:bg-slate-700"
                  >
                    <div
                      className="h-4 rounded-full bg-linear-to-l from-orange-700 to-pink-700"
                      style={{ width: `${(n / maxCount) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* شكل الكتابة */}
      {report.writing.length > 0 && (
        <section className={card} aria-labelledby="writing-title">
          <h3 id="writing-title" className={h3}>
            ملاحظات على شكل الكتابة
          </h3>
          <p className="-mt-2 mb-4 text-sm text-slate-700 dark:text-gray-300">
            كلما امتلأ الشريط زادت الحاجة للمتابعة.
          </p>
          <ul className="grid gap-5 md:grid-cols-2">
            {report.writing.map((w, i) => {
              const idx = levelIndex[w.level] ?? 2;
              return (
                <li key={`${w.aspect}-${i}`}>
                  <div className="mb-1 flex justify-between font-semibold text-slate-900 dark:text-white">
                    <span>{w.aspect}</span>
                    <span>{w.level}</span>
                  </div>
                  <div className="flex gap-1" aria-hidden="true">
                    {[1, 2, 3].map((s) => (
                      <span
                        key={s}
                        className={`h-3 flex-1 rounded-full ${s <= idx ? levelColor[idx] : 'bg-slate-300 dark:bg-slate-700'}`}
                      />
                    ))}
                  </div>
                  {w.note && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-gray-300">{w.note}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* النص المقروء + جدول الأخطاء */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className={card} aria-labelledby="text-title">
          <h3 id="text-title" className={h3}>
            النص كما قرأه الذكاء الاصطناعي
          </h3>
          <p className="rounded-2xl bg-slate-100 p-4 text-lg leading-loose text-slate-900 dark:bg-[#0f0f1e] dark:text-gray-100">
            {report.text}
          </p>
        </section>

        <section className={card} aria-labelledby="errors-title">
          <h3 id="errors-title" className={h3}>
            الأخطاء الظاهرة
          </h3>
          {report.errors.length === 0 ? (
            <p className="text-slate-700 dark:text-gray-300">لا توجد أخطاء ظاهرة.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-slate-800 dark:text-gray-200">
                <thead>
                  <tr className="border-b border-slate-300 text-sm dark:border-slate-600">
                    <th scope="col" className="py-2 text-start">كُتبت</th>
                    <th scope="col" className="py-2 text-start">الصواب</th>
                    <th scope="col" className="py-2 text-start">النوع</th>
                  </tr>
                </thead>
                <tbody>
                  {report.errors.map((e, i) => (
                    <tr key={i} className="border-b border-slate-200 dark:border-slate-700">
                      <td className="py-2 font-bold text-orange-700 dark:text-orange-400">{e.written}</td>
                      <td className="py-2 font-bold text-green-800 dark:text-green-400">
                        {e.correct || (
                          <>
                            <span aria-hidden="true">—</span>
                            <span className="sr-only">غير محدد</span>
                          </>
                        )}
                      </td>
                      <td className="py-2 text-sm">{e.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* المؤشرات والمستوى والتوصيات */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className={card} aria-labelledby="ind-title">
          <h3 id="ind-title" className={h3}>
            مؤشرات محتملة تستدعي المتابعة
          </h3>
          {report.level && (
            <p className="mb-3 rounded-2xl bg-orange-50 p-3 font-semibold text-orange-950 dark:bg-orange-950 dark:text-orange-100">
              <span className="font-normal">المستوى التقديري: </span>
              {report.level}
            </p>
          )}
          {/* ps-5: الهامش على جهة البداية (اليمين في RTL) حيث تظهر النقاط */}
          <ul className="list-disc space-y-2 ps-5 leading-loose text-slate-800 marker:text-orange-700 dark:text-gray-200">
            {report.indicators.length ? (
              report.indicators.map((t, i) => <li key={i}>{t}</li>)
            ) : (
              <li>لم تظهر مؤشرات واضحة في هذه العينة.</li>
            )}
          </ul>
        </section>

        <section className={card} aria-labelledby="rec-title">
          <h3 id="rec-title" className={h3}>
            توصيات عملية
          </h3>
          <ul className="list-disc space-y-2 ps-5 leading-loose text-slate-800 marker:text-green-700 dark:text-gray-200">
            {report.recommendations.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      </div>

      <aside
        role="note"
        className="flex gap-3 rounded-3xl border-2 border-amber-700 bg-amber-50 p-5 text-amber-950 dark:border-amber-300 dark:bg-amber-950 dark:text-amber-100"
      >
        <Icon name="warning" className="h-7 w-7 shrink-0" />
        <p className="leading-relaxed">{DISCLAIMER}</p>
      </aside>
    </article>
  );
}
