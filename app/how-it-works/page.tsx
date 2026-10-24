import Link from 'next/link';

type Status = 'available' | 'soon';

type Step = {
  title: string;
  description: string;
  status: Status;
  href?: string;
};

// غيّر الشارة هنا: 'soon' ← 'available' أو العكس
const steps: Step[] = [
  {
    title: 'المسح الذكي',
    description:
      'صوّر ورقة كتابة الطفل أو ارفعها. الصورة بتتصغّر على جهازك قبل ما تتبعت للتحليل.',
    status: 'available',
    href: '/scanner',
  },
  {
    title: 'تقرير التحليل',
    description:
      'Google Gemini بيقرأ خط اليد مباشرة من الصورة ويطلّع مؤشرات محتملة وملاحظات. لو الصورة مش مقروءة بتظهر لك رسالة واضحة بدل تقرير غلط.',
    status: 'available',
    href: '/scanner',
  },
  {
    title: 'التمارين والألعاب',
    description:
      'تمارين وألعاب بسيطة لتدريب القراءة والكتابة، تقدر تبدأ بيها في أي وقت.',
    status: 'available',
    href: '/exercises',
  },
  {
    title: 'الحسابات الحقيقية',
    description:
      'الدخول حالياً تجريبي للعرض فقط. حسابات حقيقية بحماية كاملة جاية في مرحلة لاحقة.',
    status: 'soon',
  },
  {
    title: 'متابعة التقدم',
    description:
      'البيانات اللي في لوحة المتابعة دلوقتي تجريبية. ربطها ببيانات الطفل الفعلية لسه ما اتعملش.',
    status: 'soon',
  },
  {
    title: 'التقارير الدورية',
    description: 'تقارير تتبعت للأهل بشكل منتظم، لسه ما اتنفّذتش.',
    status: 'soon',
  },
];

const technologies = [
  {
    name: 'Google Gemini',
    role: 'قراءة خط اليد وتحليله من الصورة',
  },
  {
    name: 'Next.js',
    role: 'بناء الموقع وصفحاته',
  },
  {
    name: 'Resend',
    role: 'إرسال رسائل فورم التواصل',
  },
  {
    name: 'Vercel',
    role: 'استضافة الموقع (مخطط)',
  },
];

const badge: Record<Status, { label: string; className: string }> = {
  available: {
    label: 'متاح',
    className:
      'bg-green-700 text-white dark:bg-green-400 dark:text-green-950',
  },
  soon: {
    label: 'قريباً',
    className:
      'bg-amber-700 text-white dark:bg-amber-300 dark:text-amber-950',
  },
};

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-gray-900 dark:text-gray-100">
      <header className="mb-10">
        <h1 className="mb-3 text-3xl font-bold text-blue-800 dark:text-blue-300 md:text-4xl">
          إزاي بيشتغل تيسير AI؟
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          من صورة كتابة الطفل لحد ملاحظات تساعدك تفهم نقاط القوة والصعوبات.
          هنوضّح لك هنا إيه المتاح فعلاً دلوقتي وإيه لسه تحت التطوير.
        </p>
      </header>

      <section
        aria-labelledby="before-use"
        className="mb-12 rounded-xl border-2 border-blue-800 bg-blue-50 p-5 dark:border-blue-300 dark:bg-blue-950"
      >
        <h2
          id="before-use"
          className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-200"
        >
          قبل الاستخدام
        </h2>
        <ul className="list-disc space-y-2 pr-5 leading-relaxed text-gray-800 dark:text-gray-200">
          <li>
            صورة الكتابة بتتبعت لخدمة Google Gemini عشان تتحلل. ما ترفعش صور
            فيها اسم الطفل أو بيانات تعريفية.
          </li>
          <li>
            النتيجة أولية وتعليمية، وليست تشخيصاً طبياً أو تربوياً. لو عندك قلق
            على الطفل، راجع مختص.
          </li>
        </ul>
      </section>

      <section aria-labelledby="steps-title" className="mb-12">
        <h2
          id="steps-title"
          className="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
        >
          الخطوات
        </h2>
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-xl border border-gray-300 bg-white p-5 dark:border-gray-600 dark:bg-gray-900"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-800 text-lg font-bold text-white dark:bg-blue-300 dark:text-blue-950"
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <span
                    className={`rounded-full px-3 py-0.5 text-sm font-semibold ${badge[step.status].className}`}
                  >
                    {badge[step.status].label}
                  </span>
                </div>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  {step.description}
                </p>
                {step.status === 'available' && step.href && (
                  <Link
                    href={step.href}
                    className="mt-3 inline-block font-semibold text-blue-800 underline underline-offset-4 hover:text-blue-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:text-blue-300 dark:hover:text-blue-100 dark:focus-visible:outline-blue-300"
                  >
                    جرّب دلوقتي
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tech-title" className="mb-12">
        <h2
          id="tech-title"
          className="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
        >
          التقنيات المستخدمة
        </h2>
        <dl className="divide-y divide-gray-300 rounded-xl border border-gray-300 bg-white dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-900">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <dt className="w-40 shrink-0 font-bold">{tech.name}</dt>
              <dd className="text-gray-700 dark:text-gray-300">{tech.role}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="text-center">
        <Link
          href="/scanner"
          className="inline-block rounded-lg bg-blue-800 px-8 py-3 text-lg font-bold text-white hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:bg-blue-300 dark:text-blue-950 dark:hover:bg-blue-200 dark:focus-visible:outline-blue-300"
        >
          ابدأ المسح الذكي
        </Link>
      </div>
    </main>
  );
}
