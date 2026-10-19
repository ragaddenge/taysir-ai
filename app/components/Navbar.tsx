'use client';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <nav className={`shadow-lg sticky top-0 z-50 transition-colors duration-300 ${
      isDarkMode ? 'bg-[#1a1a2e] border-b border-gray-700' : 'bg-white'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="text-4xl">🧠</div>
          <div>
            <h1 className={`text-2xl font-black ${isDarkMode ? 'text-[#42A5F5]' : 'text-[#1E88E5]'}`}>
              تيسير <span className="text-[#43A047]">AI</span>
            </h1>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#2C3E50]/60'}`}>
              منصة دعم مصابي الدسلكسيا
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/" className={`font-bold hover:text-[#1E88E5] transition-colors ${
            isDarkMode ? 'text-gray-300' : 'text-[#2C3E50]'
          }`}>
            الرئيسية
          </Link>
          
          <Link href="/how-it-works" className={`font-bold hover:text-[#1E88E5] transition-colors ${
            isDarkMode ? 'text-gray-300' : 'text-[#2C3E50]'
          }`}>
            كيف نعمل
          </Link>
          
          <Link href="/dashboard" className={`font-bold hover:text-[#1E88E5] transition-colors ${
            isDarkMode ? 'text-gray-300' : 'text-[#2C3E50]'
          }`}>
             لوحة التحكم
          </Link>
          
          <Link href="/about" className={`font-bold hover:text-[#1E88E5] transition-colors ${
            isDarkMode ? 'text-gray-300' : 'text-[#2C3E50]'
          }`}>
            من نحن
          </Link>
          
          <Link href="/contact" className={`font-bold hover:text-[#1E88E5] transition-colors ${
            isDarkMode ? 'text-gray-300' : 'text-[#2C3E50]'
          }`}>
            تواصل معنا
          </Link>

          {/* زر الوضع الليلي - تصميم واضح */}
          <button
            onClick={toggleDarkMode}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all hover:scale-110 ${
              isDarkMode 
                ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/50' 
                : 'bg-gray-800 text-yellow-400 shadow-lg'
            }`}
            title={isDarkMode ? 'الوضع النهاري ☀️' : 'الوضع الليلي 🌙'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          <Link href="/login" className="bg-[#1E88E5] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#1565C0] transition-all shadow-md flex items-center gap-2">
            <span></span>
            <span>تسجيل الدخول</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}