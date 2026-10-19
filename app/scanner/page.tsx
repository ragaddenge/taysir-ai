'use client';

import { useState } from 'react';
import Tesseract from 'tesseract.js';
import ReactMarkdown from 'react-markdown';

export default function ScannerPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysis(null);
        setError('');
        setProgress(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError('');
    setAnalysis(null);
    setProgress(0);

    try {
      setStatus('جاري قراءة النص من الصورة...');
      
      const { data: { text } } = await Tesseract.recognize(
        selectedImage,
        'ara',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 40));
              setStatus(`جاري قراءة النص: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );

      setStatus('جاري تحليل خصائص الصورة...');
      setProgress(50);

      const imageInfo = {
        size: selectedImage.length,
        type: selectedImage.split(';')[0].split(':')[1],
        hasComplexScript: selectedImage.length > 1000000
      };

      setStatus('جاري التحليل بالذكاء الاصطناعي...');
      setProgress(60);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          extractedText: text,
          imageInfo: imageInfo
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'فشل التحليل');

      setAnalysis(data.analysis);
      setProgress(100);
      setStatus('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-800 mb-3">الماسح الذكي للدسلكسيا</h1>
          <p className="text-slate-500 text-lg">تقنية هجينة: قراءة بصرية + تحليل ذكي عميق</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 mb-8">
          {!selectedImage ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-blue-50 hover:border-blue-500 transition-all group">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📤</div>
              <p className="text-xl font-bold text-slate-700">اضغط لرفع صورة ورقة الكتابة</p>
            </label>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img src={selectedImage} alt="Uploaded" className="w-full max-h-96 object-contain rounded-2xl border border-slate-200 bg-slate-50" />
                <button onClick={() => { setSelectedImage(null); setAnalysis(null); }} className="absolute top-4 left-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg">✕</button>
              </div>

              {!analysis && !loading && (
                <button onClick={analyzeImage} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all">
                  🔍 بدء التحليل الذكي
                </button>
              )}

              {loading && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-semibold text-slate-600">
                    <span>{status}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-blue-600 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl font-semibold">⚠️ {error}</div>}
        </div>

        {analysis && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-1">✅ اكتمل التحليل بنجاح</h2>
              <p className="text-emerald-100 text-sm">تم تحليل الصورة بواسطة المحرك الهجين الذكي</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-3"> تقرير التحليل التفصيلي</h3>
              
              {/* عرض Markdown بشكل منسق */}
              <div className="prose prose-lg max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-900">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </div>
            
            <button onClick={() => { setSelectedImage(null); setAnalysis(null); }} className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-xl font-bold transition shadow-lg">
              تحليل صورة جديدة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}