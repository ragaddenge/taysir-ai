'use client';
import { useState } from 'react';

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    document.documentElement.style.fontSize = `${size}%`;
  };

  const handleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  return (
    <>
      {/* زر القائمة */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-[#1E88E5] text-white rounded-full shadow-2xl hover:bg-[#1565C0] transition-all z-50 flex items-center justify-center text-2xl"
        title="إعدادات إمكانية الوصول"
      >
        
      </button>

      {/* القائمة */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-2xl p-6 w-72 z-50 border-2 border-[#1E88E5]">
          <h3 className="text-xl font-black mb-4 text-[#2C3E50] dark:text-white">
            ⚙️ إمكانية الوصول
          </h3>

          {/* حجم الخط */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-[#2C3E50] dark:text-gray-300">
              حجم الخط
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleFontSizeChange(90)}
                className={`flex-1 py-2 rounded-lg font-bold ${
                  fontSize === 90 ? 'bg-[#1E88E5] text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                صغير
              </button>
              <button
                onClick={() => handleFontSizeChange(100)}
                className={`flex-1 py-2 rounded-lg font-bold ${
                  fontSize === 100 ? 'bg-[#1E88E5] text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                عادي
              </button>
              <button
                onClick={() => handleFontSizeChange(120)}
                className={`flex-1 py-2 rounded-lg font-bold ${
                  fontSize === 120 ? 'bg-[#1E88E5] text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                كبير
              </button>
            </div>
          </div>

          {/* التباين العالي */}
          <div className="mb-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-bold text-[#2C3E50] dark:text-gray-300">
                تباين عالي
              </span>
              <div
                onClick={handleHighContrast}
                className={`w-12 h-6 rounded-full transition-all ${
                  highContrast ? 'bg-[#1E88E5]' : 'bg-gray-300'
                } relative`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    highContrast ? 'right-1' : 'right-7'
                  }`}
                ></div>
              </div>
            </label>
          </div>

          {/* خط الدسلكسيا */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-bold text-[#2C3E50] dark:text-gray-300">
                خط مخصص للدسلكسيا
              </span>
              <button
                onClick={() => {
                  document.body.style.fontFamily = 'Comic Sans MS, cursive';
                }}
                className="bg-[#43A047] text-white px-4 py-2 rounded-lg text-sm font-bold"
              >
                تطبيق
              </button>
            </label>
          </div>
        </div>
      )}
    </>
  );
}