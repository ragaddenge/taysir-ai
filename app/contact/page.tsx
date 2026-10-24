'use client';
import { useState } from 'react';

const contactCards = [
  {
    title: 'البريد الإلكتروني',
    value: 'soosooalx@gmail.com',
    href: 'mailto:soosooalx@gmail.com',
    gradient: 'from-[#1565C0] to-[#1E88E5]',
    color: 'text-[#1565C0] dark:text-[#64B5F6]',
    path: ['M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'],
  },
  {
    title: 'الموقع',
    value: 'مصر',
    href: null,
    gradient: 'from-[#6A1B9A] to-[#8E24AA]',
    color: 'text-[#6A1B9A] dark:text-[#CE93D8]',
    path: [
      'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
      'M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    ],
  },
];

const inputClass =
  'w-full rounded-xl border-2 border-gray-300 bg-white p-4 text-lg font-medium text-[#2C3E50] focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/30 dark:border-gray-600 dark:bg-[#0f0f1e] dark:text-white';
const labelClass = 'mb-2 block text-lg font-bold text-[#2C3E50] dark:text-gray-200';

const EMPTY = { name: '', email: '', subject: '', message: '' };

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactPage() {
  const [formData, setFormData] = useState(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update =
    (field: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFormData((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'تعذّر إرسال الرسالة');

      setStatus('success');
      setFormData(EMPTY);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى');
      setStatus('error'); // الرسالة تفضل في الفورم
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-[#1565C0] to-[#2E7D32] px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
            <svg
              className="h-11 w-11"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h8M8 14h5m-9 6l2.5-3H18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14z"
              />
            </svg>
          </div>
          <h1 className="mb-6 text-4xl font-black md:text-6xl">تواصل معنا</h1>
          <p className="text-xl font-medium leading-relaxed md:text-2xl">
            لديك سؤال أو اقتراح؟ اكتب لنا وسنقرأ رسالتك.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          {contactCards.map((c) => (
            <div
              key={c.title}
              className="rounded-3xl border-2 border-gray-200 bg-white p-8 text-center shadow-lg dark:border-gray-700 dark:bg-[#1a1a2e]"
            >
              <div
                className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient}`}
              >
                <svg
                  className="h-12 w-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {c.path.map((d) => (
                    <path key={d} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                  ))}
                </svg>
              </div>
              <h3 className={`mb-3 text-2xl font-black ${c.color}`}>{c.title}</h3>
              {c.href ? (
                <a href={c.href} className={`break-all text-lg font-bold hover:underline ${c.color}`}>
                  <span dir="ltr">{c.value}</span>
                </a>
              ) : (
                <p className={`text-lg font-bold ${c.color}`}>{c.value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-16 dark:bg-[#1a1a2e]">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center text-3xl font-black text-[#2C3E50] dark:text-white md:text-4xl">
            أرسل لنا رسالة
          </h2>

          {status === 'success' ? (
            <div
              role="status"
              className="rounded-3xl border-2 border-[#2E7D32] bg-[#43A047]/10 p-12 text-center dark:border-[#66BB6A] dark:bg-[#43A047]/20"
            >
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#2E7D32]">
                <svg
                  className="h-11 w-11 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-3 text-3xl font-black text-[#2E7D32] dark:text-[#A5D6A7]">
                وصلتنا رسالتك
              </h3>
              <p className="mb-6 text-lg font-medium text-[#2C3E50] dark:text-gray-200">
                سنرد على البريد الإلكتروني الذي كتبته.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="rounded-xl bg-[#1565C0] px-6 py-3 font-bold text-white hover:bg-[#0D47A1]"
              >
                إرسال رسالة أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === 'error' && (
                <div
                  role="alert"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#C62828] bg-[#E53935]/10 p-4 text-center font-bold text-[#C62828] dark:border-[#EF9A9A] dark:bg-[#E53935]/20 dark:text-[#EF9A9A]"
                >
                  <svg
                    className="h-6 w-6 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    />
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label htmlFor="name" className={labelClass}>الاسم</label>
                <input
                  id="name"
                  type="text"
                  required
                  maxLength={100}
                  autoComplete="name"
                  value={formData.name}
                  onChange={update('name')}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>البريد الإلكتروني</label>
                <input
                  id="email"
                  type="email"
                  required
                  maxLength={200}
                  autoComplete="email"
                  value={formData.email}
                  onChange={update('email')}
                  className={inputClass}
                  dir="ltr"
                />
              </div>

              <div>
                <label htmlFor="subject" className={labelClass}>الموضوع</label>
                <select id="subject" required value={formData.subject} onChange={update('subject')} className={inputClass}>
                  <option value="">اختر الموضوع</option>
                  <option value="استفسار">استفسار عام</option>
                  <option value="حساب">طلب إنشاء حساب</option>
                  <option value="دعم">مشكلة تقنية</option>
                  <option value="اقتراح">اقتراح تحسين</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>الرسالة</label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  maxLength={3000}
                  value={formData.message}
                  onChange={update('message')}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-2xl bg-gradient-to-r from-[#1565C0] to-[#2E7D32] py-4 text-xl font-bold text-white transition-all hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? 'جاري الإرسال...' : 'إرسال الرسالة'}
              </button>

              <div className="flex items-start gap-3 rounded-xl border-2 border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-[#0f0f1e]">
                <svg
                  className="mt-0.5 h-6 w-6 shrink-0 text-[#1565C0] dark:text-[#64B5F6]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-base font-semibold leading-relaxed text-[#2C3E50] dark:text-gray-200">
                  الرسالة تصل إلى بريد الفريق. لا تكتب فيها بيانات حساسة عن الطفل.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
