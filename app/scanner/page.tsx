'use client';

import { useState, useSyncExternalStore } from 'react';
import AnalysisReport, { type Report } from '../components/AnalysisReport';

const PROFILES_KEY = 'taysir_profiles';
const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB

// أيقونات SVG بدل الإيموجي (نفس أسلوب الصفحة الرئيسية)
const ICONS = {
  upload:
    'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
  search:
    'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
  close: 'M6 18L18 6M6 6l12 12',
  warning:
    'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  check: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

function Icon({ name, className }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[name]} />
    </svg>
  );
}

// تصغير الصورة قبل الإرسال (أسرع، وتبقى تحت حد حجم الطلب)
function compressImage(dataUrl: string, maxSide = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('تعذّر تجهيز الصورة'));
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('تعذّر قراءة الصورة، جرّب صورة بصيغة JPG أو PNG'));
    img.src = dataUrl;
  });
}

// اسم الطفل يُقرأ محليًا من المتصفح للعرض فقط، ولا يُرسل مع الصورة
function subscribeChild(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getChildName(): string | null {
  try {
    const childId = new URLSearchParams(window.location.search).get('child');
    if (!childId) return null;
    const saved = localStorage.getItem(PROFILES_KEY);
    if (!saved) return null;
    const list: unknown = JSON.parse(saved);
    if (!Array.isArray(list)) return null;
    const found = list.find((p) => p && p.id === childId);
    return found && typeof found.name === 'string' ? found.name : null;
  } catch {
    // تخزين غير متاح أو بيانات تالفة: نتجاهل
    return null;
  }
}

export default function ScannerPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [consent, setConsent] = useState(false);
  const childName = useSyncExternalStore(subscribeChild, getChildName, () => null);

  const reset = () => {
    setSelectedImage(null);
    setAnalysis(null);
    setError('');
    setProgress(0);
    setStatus('');
    setConsent(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('من فضلك اختر ملف صورة صالح');
      input.value = '';
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setError('حجم الصورة كبير جداً. اختر صورة أقل من 15 ميجابايت');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') return;
      setSelectedImage(reader.result);
      setAnalysis(null);
      setError('');
      setProgress(0);
    };
    reader.onerror = () => setError('تعذّر قراءة الملف، جرّب صورة أخرى');
    reader.readAsDataURL(file);
    input.value = ''; // يسمح باختيار الملف نفسه مرة أخرى
  };

  const analyzeImage = async () => {
    if (!selectedImage || !consent) return;

    setLoading(true);
    setError('');
    setAnalysis(null);
    setProgress(10);

    try {
      setStatus('جاري تجهيز الصورة...');
      const compressed = await compressImage(selectedImage);
      setProgress(35);

      setStatus('جاري التحليل بالذكاء الاصطناعي...');
      setProgress(55);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: compressed }),
      });

      let data: { report?: Report; error?: string } = {};
      try {
        data = await response.json();
      } catch {
        // الرد ليس بصيغة JSON (مثلاً تجاوز الحد الأقصى لحجم الطلب)
      }
      if (!response.ok) throw new Error(data.error || 'فشل التحليل');
      if (!data.report) throw new Error('رد غير متوقع من الخدمة');

      setAnalysis(data.report);
      setProgress(100);
      setStatus('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">
            الماسح الذكي لخط اليد
          </h1>
          <p className="text-lg text-slate-700 dark:text-gray-300">
            تحليل بصري لخط اليد بالذكاء الاصطناعي
          </p>
          {childName && (
            <p className="mt-3 inline-block rounded-full border border-slate-300 bg-slate-50 px-4 py-1 text-base font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100">
              الطفل: {childName}
            </p>
          )}
        </div>

        <div className="mx-auto mb-8 max-w-4xl rounded-3xl border border-slate-300 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-[#1a1a2e]">
          {!selectedImage ? (
            <label className="group flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-400 transition-colors hover:border-blue-700 hover:bg-blue-50 focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-700 dark:border-slate-500 dark:hover:border-blue-300 dark:hover:bg-slate-800 dark:focus-within:border-blue-300 dark:focus-within:ring-blue-300">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />
              <Icon
                name="upload"
                className="mb-4 h-14 w-14 text-slate-700 transition-transform group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 dark:text-gray-200"
              />
              <p className="text-xl font-bold text-slate-800 dark:text-gray-100">
                اضغط لرفع صورة ورقة الكتابة
              </p>
              <p className="mt-2 px-4 text-center text-sm font-bold text-slate-700 dark:text-gray-300">
                تُرسل الصورة إلى خدمة ذكاء اصطناعي خارجية (Google Gemini) لتحليلها. تجنّب
                الصور التي تحتوي على اسم الطفل.
              </p>
            </label>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage}
                  alt="صورة ورقة الكتابة المرفوعة"
                  className="max-h-96 w-full rounded-2xl border border-slate-300 bg-slate-50 object-contain dark:border-slate-700 dark:bg-[#0f0f1e]"
                />
                <button
                  onClick={reset}
                  disabled={loading}
                  aria-label="إزالة الصورة"
                  className="absolute left-4 top-4 rounded-full bg-red-700 p-2 text-white shadow-lg hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon name="close" className="h-5 w-5" />
                </button>
              </div>

              {!analysis && !loading && (
                <>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 text-sm font-bold leading-relaxed text-slate-800 focus-within:ring-2 focus-within:ring-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 dark:focus-within:ring-blue-300">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-5 w-5 shrink-0 accent-blue-800"
                    />
                    <span>
                      أوافق على إرسال هذه الصورة إلى Google Gemini لتحليلها. وأعلم أن الخدمة
                      المستخدمة مجانية، وأن Google قد تستخدم المحتوى المرسَل لتحسين خدماتها،
                      وقد يطّلع عليه مراجعون بشريون. وأؤكد أن الصورة لا تحتوي على اسم الطفل
                      أو بيانات تعريفية، وأن ولي الأمر موافق على رفعها.
                    </span>
                  </label>
                  <button
                    onClick={analyzeImage}
                    disabled={!consent}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-800 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-300 dark:text-blue-950 dark:hover:bg-blue-200 dark:focus-visible:outline-blue-300"
                  >
                    <Icon name="search" className="h-6 w-6" />
                    بدء التحليل الذكي
                  </button>
                </>
              )}

              {loading && (
                <div className="space-y-3" role="status" aria-live="polite">
                  <div className="flex justify-between text-sm font-semibold text-slate-800 dark:text-gray-200">
                    <span>{status}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-3 rounded-full bg-blue-800 transition-all duration-300 motion-reduce:transition-none dark:bg-blue-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-center gap-2 rounded-xl border-2 border-red-700 bg-red-50 p-4 font-semibold text-red-900 dark:border-red-400 dark:bg-red-950 dark:text-red-200"
            >
              <Icon name="warning" className="h-6 w-6 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {analysis && (
          <div className="space-y-6">
            <div
              role="status"
              className="flex items-center gap-3 rounded-2xl border-2 border-green-700 bg-green-50 p-5 text-green-950 dark:border-green-300 dark:bg-green-950 dark:text-green-100"
            >
              <Icon name="check" className="h-9 w-9 shrink-0" />
              <div>
                <h2 className="text-xl font-bold">اكتمل التحليل</h2>
                <p className="text-sm">النتيجة أولية وتحتاج مراجعة مختص، وليست تشخيصاً.</p>
              </div>
            </div>

            <AnalysisReport report={analysis} imageSrc={selectedImage} />

            <button
              onClick={reset}
              className="mx-auto block w-full max-w-md rounded-xl bg-slate-800 py-4 font-bold text-white shadow-lg transition-colors hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:outline-slate-200 print:hidden"
            >
              تحليل صورة جديدة
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
