const cards = [
  {
    title: 'رؤيتنا',
    text: 'أن يجد كل طفل عربي يواجه صعوبة في الكتابة أدوات بسيطة تساعده على التدرّب والتقدّم بثقة.',
    gradient: 'from-[#1565C0] to-[#1E88E5]',
    titleColor: 'text-[#1565C0] dark:text-[#64B5F6]',
    paths: [
      'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    ],
  },
  {
    title: 'رسالتنا',
    text: 'أن نوفّر للأهل أداة سهلة ترصد مؤشرات محتملة لأخطاء الكتابة من صورة خط اليد، مع تمارين وألعاب للتدريب.',
    gradient: 'from-[#2E7D32] to-[#43A047]',
    titleColor: 'text-[#2E7D32] dark:text-[#81C784]',
    paths: ['M13 10V3L4 14h7v7l9-11h-7z'],
  },
];

const ready = [
  'تحليل صورة خط اليد بالذكاء الاصطناعي وعرض الأخطاء المحتملة برسوم وملاحظات',
  'تمارين إملائية بسيطة وألعاب للتدريب',
  'ملفات للأطفال محفوظة على جهازك فقط',
];

const upcoming = [
  'توليد تمارين من أخطاء الطفل الفعلية',
  'حسابات حقيقية ومتابعة التقدم عبر الوقت',
  'مراجعة النتائج مع مختصين',
];

function Check() {
  return (
    <svg
      className="mt-1 h-6 w-6 shrink-0 text-[#2E7D32] dark:text-[#81C784]"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Clock() {
  return (
    <svg
      className="mt-1 h-6 w-6 shrink-0 text-[#B26A00] dark:text-[#FFB74D]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#1565C0] to-[#2E7D32] px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-black md:text-6xl">من نحن</h1>
          <p className="text-xl font-medium leading-relaxed md:text-2xl">
            تيسير AI منصة عربية تستخدم الذكاء الاصطناعي لدعم الأطفال الذين يواجهون صعوبات الكتابة المرتبطة بالدسلكسيا.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-3xl border-2 border-gray-200 bg-white p-10 shadow-lg dark:border-gray-700 dark:bg-[#1a1a2e]"
            >
              <div
                className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient}`}
              >
                <svg
                  className="h-12 w-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {c.paths.map((d) => (
                    <path key={d} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                  ))}
                </svg>
              </div>
              <h2 className={`mb-4 text-3xl font-black ${c.titleColor}`}>{c.title}</h2>
              <p className="text-xl font-medium leading-loose text-[#2C3E50] dark:text-gray-200">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-16 dark:bg-[#1a1a2e]">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-3xl font-black text-[#2C3E50] dark:text-white md:text-4xl">
            أين وصل المشروع
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border-2 border-[#2E7D32] p-8 dark:border-[#66BB6A]">
              <h3 className="mb-5 text-2xl font-black text-[#2E7D32] dark:text-[#81C784]">متاح الآن</h3>
              <ul className="space-y-4">
                {ready.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-lg font-semibold text-[#2C3E50] dark:text-gray-200">
                    <Check />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border-2 border-[#B26A00] p-8 dark:border-[#FFB74D]">
              <h3 className="mb-5 text-2xl font-black text-[#B26A00] dark:text-[#FFB74D]">قريباً</h3>
              <ul className="space-y-4">
                {upcoming.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-lg font-semibold text-[#2C3E50] dark:text-gray-200">
                    <Clock />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-10 text-center text-lg font-bold text-[#2C3E50] dark:text-gray-200">
            النتائج أولية وليست تشخيصاً طبياً. للتشخيص راجع مختصاً.
          </p>
        </div>
      </section>
    </>
  );
}
