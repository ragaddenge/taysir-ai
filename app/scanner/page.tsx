'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ScannerPage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [agreed, setAgreed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      console.log('✅ تم تحميل الصورة:', base64.substring(0, 50) + '...');
      setImage(base64);
      setError(null);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      console.log('✅ تم تحميل الصورة (drag):', base64.substring(0, 50) + '...');
      setImage(base64);
      setError(null);
      setResult(null);
    };
    reader.readAsDataURL(file);
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

    console.log('📤 بدء إرسال الصورة للتحليل...');
    console.log('📏 حجم الصورة:', image.length, 'character');
    console.log('📝 اسم الملف:', fileName);

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

      console.log('📥 استلام الرد:', response.status);

      const data = await response.json();
      console.log('📄 محتوى الرد:', data);

      if (!response.ok) {
        throw new Error(data.details || data.error || 'فشل التحليل');
      }

      setResult(data.analysis);
    } catch (err: any) {
      console.error('❌ خطأ:', err);
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
              <p className="text-sm text-gray-500">PNG, JPG, WEBP حتى 10MB</p>
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
                أوافق على إرسال هذه الصورة إلى Google Gemini لتحليلها. وأعلم أن الخدمة المستخدمة مجانية، وأن Google قد تستخدم المحتوى المرسل لتحسين خدماتها، وقد يطلع عليه مراجعون بشريون. وأؤكد أن الصورة <strong>لا تحتوي على اسم الطفل أو بيانات تعريفية</strong>، وأن ولي الأمر موافق على رفعها.
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

        {/* نتيجة التحليل */}
        {result && (
          <div className="mt-8 bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              ✅ نتيجة التحليل
            </h2>

            {/* الدقة العامة */}
            <div className="bg-blue-900/30 rounded-xl p-4 mb-4 text-center">
              <p className="text-gray-400 mb-1">الدقة العامة</p>
              <p className="text-5xl font-bold text-blue-400">
                {result.overallScore}%
              </p>
            </div>

            {/* التشخيص */}
            {result.diagnosis && (
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-gray-200">
                  🔍 التشخيص
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

            {/* نقاط الضعف */}
            {result.weaknesses?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-red-400">⚠️ نقاط الضعف</h3>
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

            <button
              onClick={() => router.push('/exercises')}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-all"
            >
              🎯 ابدأ التمارين العلاجية
            </button>
          </div>
        )}
      </div>
    </div>
  );
}