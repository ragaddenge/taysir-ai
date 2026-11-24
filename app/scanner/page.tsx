'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// حد أمان لحجم الصورة: طلبات Vercel محدودة (~4.5MB) والتحويل لـ base64 يزيد الحجم ~33%
const MAX_FILE_BYTES = 3 * 1024 * 1024;

export default function ScannerPage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [agreed, setAgreed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // النتيجة قابلة للاستخدام فقط لو الدرجة أكبر من صفر (الصفر معناه صورة غير قابلة للتحليل)
  const hasValidResult =
    !!result && typeof result.overallScore === 'number' && result.overallScore > 0;

  const loadFile = (file: File) => {
    if (file.size > MAX_FILE_BYTES) {
      setError('حجم الصورة كبير. اختر صورة أصغر من 3 ميجابايت.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setError(null);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    loadFile(file);
  };

  const startAnalysis = async () => {
    if (!image) {
      setError('لا توجد صورة');
      return;
    }

    if (!agreed) {
      setError('يرجى الموافقة على الشروط أولاً');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);
    setProvider(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: image,
          fileName: fileName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ فشل التحليل:', data.details || data.error);
        throw new Error('تعذّر إكمال التحليل. حاول مرة أخرى بعد قليل.');
      }

      setResult(data.analysis);
      setProvider(data.provider || null);
    } catch (err: any) {
      setError(err.message || 'تعذّر إكمال التحليل');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8" dir="rtl">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-2">
            📷 الماسح الذكي
          </h1>
          <p className="text-gray-300">
            ارفع صورة ورقة الكتابة ودع الذكاء الاصطناعي يحلل الأخطاء
          </p>
        </div>

        {/* منطقة رفع الصورة */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-4 border-dashed border-blue-400 rounded-2xl p-8 text-center cursor-pointer hover:bg-gray-800 transition-colors bg-gray-800 shadow-lg mb-6"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {image ? (
            <div>
              <img
                src={image}
                alt="معاينة"
                className="max-h-96 mx-auto rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-gray-400">{fileName}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImage(null);
                  setFileName('');
                  setResult(null);
                }}
                className="mt-3 text-red-400 hover:underline text-sm"
              >
                ❌ حذف الصورة
              </button>
            </div>
          ) : (
            <div>
              <div className="text-6xl mb-4">📤</div>
              <p className="text-lg font-bold text-gray-300 mb-2">
                اضغط لاختيار صورة أو اسحبها هنا
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, WEBP حتى 3MB</p>
            </div>
          )}
        </div>

        {/* الموافقة */}
        {image && (
          <div className="mb-6 bg-gray-800 rounded-xl p-4 border border-gray-700">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 accent-blue-500"
              />
              <span className="text-sm text-gray-300 leading-relaxed">
                أوافق على إرسال هذه الصورة لتحليلها عبر Google Gemini، وفي حال تعذّر ذلك قد تُرسل تلقائياً إلى خدمة Groq بدلاً منها. وأعلم أن الموقع لا يخزّن الصورة، لكن الخدمة المستخدمة مجانية، وأن Google قد تستخدم المحتوى المرسل لتحسين خدماتها، وقد يطلع عليه مراجعون بشريون، وأن Groq تعالج المحتوى وفق سياستها. وأؤكد أن الصورة <strong>لا تحتوي على اسم الطفل أو بيانات تعريفية</strong>، وأن ولي الأمر موافق على رفعها.
              </span>
            </label>
          </div>
        )}

        {/* زر التحليل */}
        {image && (
          <button
            onClick={startAnalysis}
            disabled={!agreed || analyzing}
            className={`w-full py-4 rounded-xl text-xl font-bold transition-all shadow-lg mb-4 ${
              !agreed || analyzing
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-[1.02]'
            }`}
          >
            {analyzing ? '⏳ جارٍ التحليل الذكي...' : '🧠 بدء التحليل الذكي'}
          </button>
        )}

        {/* رسالة الخطأ */}
        {error && (
          <div className="mb-4 bg-red-900/30 border-2 border-red-500 text-red-300 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold">{error}</p>
            </div>
          </div>
        )}

        {/* صورة غير قابلة للتحليل */}
        {result && !hasValidResult && (
          <div className="mt-8 bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-amber-500">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">
              ⚠️ تعذّر تحليل هذه الصورة
            </h2>
            {result.diagnosis && (
              <p className="text-gray-300 mb-4">{result.diagnosis}</p>
            )}
            {result.recommendations?.length > 0 && (
              <ul className="list-disc pr-6 text-gray-300 space-y-1 mb-4">
                {result.recommendations.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
            <p className="text-sm text-gray-400">
              جرّب صورة واضحة لكتابة الطفل بخط اليد، بإضاءة جيدة وبدون ظلال.
            </p>
          </div>
        )}

        {/* نتيجة التحليل */}
        {hasValidResult && (
          <div className="mt-8 bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              ✅ نتيجة التحليل
            </h2>

            {/* وضوح الكتابة */}
            <div className="bg-blue-900/30 rounded-xl p-4 mb-4 text-center">
              <p className="text-gray-400 mb-1">وضوح الكتابة في هذه الورقة</p>
              <p className="text-5xl font-bold text-blue-400">
                {result.overallScore}%
              </p>
            </div>

            {/* ملخص الملاحظات */}
            {result.diagnosis && (
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-gray-200">
                  🔍 ملخص الملاحظات
                </h3>
                <p className="text-gray-300">{result.diagnosis}</p>
              </div>
            )}

            {/* نقاط القوة */}
            {result.strengths?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-green-400">💪 نقاط القوة</h3>
                <ul className="list-disc pr-6 text-gray-300 space-y-1">
                  {result.strengths.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ملاحظات للتحسين */}
            {result.weaknesses?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-red-400">⚠️ ملاحظات للتحسين</h3>
                <ul className="list-disc pr-6 text-gray-300 space-y-1">
                  {result.weaknesses.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* الأخطاء الإملائية */}
            {result.spellingErrors?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-orange-400">✏️ الأخطاء الإملائية</h3>
                <div className="space-y-2">
                  {result.spellingErrors.map((e: any, i: number) => (
                    <div key={i} className="bg-orange-900/20 p-3 rounded-lg">
                      <p className="text-red-400 line-through">{e.word}</p>
                      <p className="text-green-400">← {e.correction}</p>
                      <p className="text-xs text-gray-500">{e.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* التوصيات */}
            {result.recommendations?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-purple-400">💡 التوصيات</h3>
                <ul className="list-disc pr-6 text-gray-300 space-y-1">
                  {result.recommendations.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* التمارين الموصى بها */}
            {result.exercises?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-blue-400">🎯 تمارين موصى بها</h3>
                <div className="grid gap-3">
                  {result.exercises.map((ex: any, i: number) => (
                    <div key={i} className="bg-blue-900/20 p-4 rounded-lg">
                      <p className="font-bold text-gray-200">{ex.title}</p>
                      <p className="text-sm text-gray-300">{ex.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        📊 {ex.level} • ⏱️ {ex.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {provider && (
              <p className="mt-4 text-xs text-gray-500">
                تم التحليل عبر {provider}.
              </p>
            )}

            <p className="mt-2 text-xs text-gray-400">
              هذه نتيجة أولية وتعليمية، وليست تشخيصاً طبياً أو تربوياً. لو عندك قلق على الطفل، راجع مختصاً.
            </p>

            <button
              onClick={() => router.push('/exercises')}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-all"
            >
              🎯 ابدأ التمارين التدريبية
            </button>
          </div>
        )}
      </div>
    </div>
  );
}